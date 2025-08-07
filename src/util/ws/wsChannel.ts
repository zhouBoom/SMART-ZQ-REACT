// socket 通道
/**
 * 通道层
 * 负责websocket连接的创建和维护
 * 处理消息的接收和发送
 * 管理消息缓存机制
 * 处理重连机制
 * 处理ping/pong心跳机制
 * 处理鉴权机制
 */
import { uuid } from '../utils';
import { ACTION_TYPE } from './msgType';
import { messageQueue, listeners } from './common';

export interface ILoginInfo {
  'WX-CORPID': string
}

export class WsChannel {
  private _ioInstance: WebSocket;
  /**
   * 单例模式
   */
  /**
   * 最大重连次数
   */
  private _maxReconnectCount: number = 3;
  /**
   * 当前剩余重连次数
   */
  private _restReconnectCount: number = 3;
  /**
   * 重连间隔
   */
  private _reconnectInterval: number = 1000;
  /**
   * 等待服务端的pong消息的超时时间
   */
  private _pongTimeout: number = 10000;
  /**
   * 当前websocket连接达到可用状态时的回调
   */
  private _onReady?: () => void;
  /**
   * websocket连接出现异常情况的回调
   */
  private _onError: (error: Event) => void;
  /**
   * 发ping心跳定时器的id
   */
  private _pingTimerId?: number;
  /**
   * 等待pong心跳定时器的id，如果收到pong，则重置定时器
   */
  private _pongTimerId?: number;
  /**
   * 表示是否鉴权成功
   */
  private _checkAuthSuccess = false;
  /**
   * 是否刷新消息
   */
  private _isFlushMsg = true;
  /**
   * 重连延迟时间/重连延迟定时器的id
   */
  private _reconnectDelayTime = 0;
  private _reconnectDelayTimerId: any;
  /**
   * websocket是否已经连接
   */
  get connected() {
    return this._ioInstance.readyState === WebSocket.OPEN;
  }
  /**
   * websocket连接是否已经准备好给上层使用了
   */
  get ready() {
    return this.connected && this._checkAuthSuccess;
  }
  /**
   * 创建websocket实例
   */
  constructor(url: string, loginInfo: ILoginInfo, {
    timeout = 60,
    reconnectMaxCount = 3,
    onReady = () => {},
    onError = (result: any) => {},
  }) {
    this._ioInstance = this.createWs(url);
    this._onReady = onReady;
    this._onError = onError;
    this._maxReconnectCount = reconnectMaxCount;
    this._restReconnectCount = reconnectMaxCount;
    this._reconnectInterval = timeout;
    this._pongTimeout = timeout * 1000;
  }

  private createWs(url: string): WebSocket {
    const ioInstance = new WebSocket(url);
    this._checkAuthSuccess = false;
    ioInstance.onopen = () => {
      console.log('websocket 连接成功');
      this._restReconnectCount = this._maxReconnectCount;
    }
    ioInstance.onmessage = (event: MessageEvent) => {
      let result = JSON.parse(event.data)
      if (!result.action) {
        console.error('接收到的消息格式不正确', result)
        return
      }
      if(result.action != 'pong'){
        this.sendMessage(ACTION_TYPE.ACK_MSG, {trace_id: result.trace_id, local_id: result.data?.local_id, server_id: result.data?.server_id, msgid: (result.data?.msgid || result.data?.msg_id)})
      }
      switch (result.action) {
        case ACTION_TYPE.LOGIN:
            this._checkAuthSuccess = true
            this._reconnectDelayTime = 0
            // 开始发ping并且等待pong
            this.startPing();
            this.startWaitingPong();
            this.tryOnReady();
            break
        case ACTION_TYPE.PONG:
            this.endWaitingPong();
            this.startWaitingPong();
            break
        case ACTION_TYPE.RECEIVE_MSG:
            this.onMessage(result)
            break
        case ACTION_TYPE.UPDATE_MSG:
            this.onUpdateMsg(result)
            break
      }
      if(result.action == 'pong'){
        return
      }
      if (this._isFlushMsg) {
        this.stopCacheAndFlush()
      }
    }
    ioInstance.onclose = () => {
      console.log('websocket 连接关闭');
    }
    ioInstance.onerror = (event: Event) => {
      console.log('websocket 连接失败', event);
    }
    return ioInstance;
  }

  /**
   * 连接
   */
  private connectWs() {
    this._ioInstance.onopen = () => {
      console.log('websocket 连接成功');
    }
  }
  /**
   * 收到消息更新回执
   * @param result 
   */
  private onUpdateMsg(result: any) {
    console.log('==onUpdateMsg==', result)
    // push到update的执行队列里
    messageQueue.update_msg_status?.push({
      is_update: true,
      ...result.data
    })
  }
  /**
   * 收到消息
   */
  private onMessage(result: any) {
    // 屏蔽ping和pong消息
    console.log('==data.action==', result.action)
    if(result.action == ACTION_TYPE.PING || result.action == ACTION_TYPE.PONG) {
      return
    }
    console.log('websocket 收到消息', result);
    let tempArr = result.data.messages
    for (let i = 0; i < tempArr.length; i++) {
        let msgBaseInfo = {
            workcode:  result.data.workcode,
            wx_userid: result.data.wx_userid,
            wx_corp_id: result.data.wx_corp_id,
            conv_id: result.data.conv_id,
            conv_type: result.data.conv_type,
            sender: tempArr[i].sender,
            receiver: tempArr[i].receiver,
            status: tempArr[i].status,
            msgid: tempArr[i].msgid,
            send_time: tempArr[i].send_time,
            server_id: tempArr[i].server_id,
            local_id: tempArr[i].local_id,
            send_type: tempArr[i].send_type,
            is_hide_revoke: tempArr[i].send_type == 1,
            sender_info: {
              name: tempArr[i].sender_info.name,
              avatar: tempArr[i].sender_info.avatar
            },
            receiver_info: {
              name: tempArr[i].receiver_info.name,
              avatar: tempArr[i].receiver_info.avatar
            }
        }
        // 初始化消息队列
        if(!messageQueue.recv_msg![result.data.conv_id]){
            messageQueue.recv_msg![result.data.conv_id] = []
        }
        // 处理引用消息
        const contentType = tempArr[i].content.type.toLowerCase() == 'img' ? 'image' : tempArr[i].content.type.toLowerCase()
        const quoteMsg = {
                quote_msg_type: tempArr[i].content[contentType].quote_msg_type,
                quote_msg_content: tempArr[i].content[contentType].quote_msg_content,
                quote_msg_send_time: tempArr[i].content[contentType].quote_msg_send_time,
                quote_msg_sender: tempArr[i].content[contentType].quote_msg_sender,
                quote_msg_sender_name: tempArr[i].content[contentType].quote_msg_sender_name,
                quote_msg_file_path: tempArr[i].content[contentType].quote_msg_file_path,
                quote_msg_file_name: tempArr[i].content[contentType].quote_msg_file_name,
                revoke: tempArr[i].content[contentType].revoke
        }
        // 将消息添加到消息队列
        messageQueue.recv_msg![result.data.conv_id].push({
            ...msgBaseInfo,
            content:{
              type: tempArr[i].content.type,
              text: {
                content: tempArr[i].content.text?.content,
                ...quoteMsg
              },
              image: {
                url: tempArr[i].content.image?.url,
                md5: tempArr[i].content.image?.md5,
                name: tempArr[i].content.image?.name,
                ...quoteMsg
              },
              video: {
                url: tempArr[i].content.video?.url,
                md5: tempArr[i].content.video?.md5,
                name: tempArr[i].content.video?.name,
                thumb_url: tempArr[i].content.video?.thumb_url,
                ...quoteMsg
              },
              voice: {
                url: tempArr[i].content.voice?.url,
                md5: tempArr[i].content.voice?.md5,
                name: tempArr[i].content.voice?.name,
                duration: tempArr[i].content.voice?.duration,
                text: tempArr[i].content.voice?.text,
                media_id: tempArr[i].content.voice?.media_id,
                ...quoteMsg
              },
              file: {
                url: tempArr[i].content.file?.url,
                md5: tempArr[i].content.file?.md5,
                name: tempArr[i].content.file?.name,
                ...quoteMsg
              },
              video_call: {
                duration: tempArr[i].content.video_call?.duration,
                ...quoteMsg
              },
              voice_call: {
                duration: tempArr[i].content.voice_call?.duration,
                ...quoteMsg
              },
              link: {
                title: tempArr[i].content.link?.title,
                desc: tempArr[i].content.link?.desc,
                url: tempArr[i].content.link?.url,
                ...quoteMsg
              },
              card: {
                avatar: tempArr[i].content.card?.avatar,
                nickname: tempArr[i].content.card?.nickname,
                ...quoteMsg
              },
              emotion: {
                url: tempArr[i].content.emotion?.url,
                ...quoteMsg
              },
              we_app: {...tempArr[i].content.we_app, ...quoteMsg},
              sph_video: {...tempArr[i].content.sph_video, ...quoteMsg},
              sph_live: {...tempArr[i].content.sph_live, ...quoteMsg},
              sph_card: {...tempArr[i].content.sph_card, ...quoteMsg}
            }
          })
          console.log('==messageQueue.recv_msg==', messageQueue.recv_msg)
    }
  }
  /**
   * 收到消息的回调函数
   */
  private callReceiveMsgListener(){
    console.log('==callReceiveMsgListener==')
    let tempReceiveMsgObj = messageQueue.recv_msg || {}
    for(let key in tempReceiveMsgObj){
      let msgList = tempReceiveMsgObj[key]
      console.log('==msgList==', msgList)
      let msgListenerList = listeners.recv_msg && listeners.recv_msg[key]
      console.log('==msgListenerList==', msgListenerList)
      if(Array.isArray(msgList) && Array.isArray(msgListenerList)){
        for(let i = 0; i < msgList.length; i++){
          msgListenerList.forEach(listener=>{
            listener.callback(msgList[i])
          })
          // 会话条目上的监听事件提取到父组件后，需要一个全局的监听事件
          listeners.recv_msg && listeners.recv_msg.all_new_msg_listener?.forEach(listener=>{
            listener.callback(msgList[i])
          })
          msgList.splice(i, 1)
          i--
        }
      }
  }
    // for(let key in tempUpdateMsgObj){
    //   let msgList = tempUpdateMsgObj[key]
    //   console.log('==msgList==', msgList)
    //   let msgListenerList = listeners.recv_msg && listeners.recv_msg[key]
    //   console.log('==msgListenerList==', msgListenerList)
    //   if(Array.isArray(msgList) && Array.isArray(msgListenerList)){
    //     for(let i = 0; i < msgList.length; i++){
    //       msgListenerList.forEach(listener=>{
    //         listener.callback(msgList[i])
    //       })
    //       // 会话条目上的监听事件提取到父组件后，需要一个全局的监听事件
    //       listeners.recv_msg && listeners.recv_msg.all_new_msg_listener?.forEach(listener=>{
    //         listener.callback(msgList[i])
    //       })
    //       msgList.splice(i, 1)
    //       i--
    //     }
    //   }
    // }
  }
  /**
   * 发送消息
   */
  sendMessage(type: string, content: Object) {
    if (this.ready) {
        let target = {
            action: type,
            timestamp: Date.now(),
            data: content,
            trace_id: uuid()
        }
        let sendData = JSON.stringify(target)
        this._ioInstance.send(sendData)
    }
  }
  /**
   * 消费update_msg_status队列中的消息
   */
  callUpdateMsgListener() {
    let tempArr = messageQueue.update_msg_status || [];
    if (tempArr.length === 0) return;
    
    // 过滤出有对应监听器的消息
    const messagesToProcess = tempArr.filter(item => 
      listeners.update_msg_status && 
      Array.isArray(listeners.update_msg_status[item.conv_id]) &&
      listeners.update_msg_status[item.conv_id].length > 0
    );
    
    // 清空原队列
    messageQueue.update_msg_status = [];
    
    // 处理有监听器的消息
    messagesToProcess.forEach(item => {
      if (listeners.update_msg_status && Array.isArray(listeners.update_msg_status[item.conv_id])) {
        listeners.update_msg_status[item.conv_id].forEach((listener: any) => {
          listener.callback(item.tmp_id, item.msgid);
        });
      }
    });
  }
  /**
   * 连接失败
   */
  private onError(event: Event) {
    console.log('websocket 连接失败', event);
  }
  /**
   * 重连
   */
  private reconnectWs() {
    this._ioInstance.onclose = () => {
      console.log('websocket 连接关闭');
    }
  }
  /**
   * 断开连接
   */
  disconnectWs() {
    this._ioInstance.close();
  }
  /**
   * 开始发ping
   */
  private startPing() {
    this._pingTimerId = setInterval(() => {
      this.sendMessage(ACTION_TYPE.PING, {})
    }, 15 * 1000);
  }

  /**
   * 结束发ping
   */
  private endPing() {
    clearInterval(this._pingTimerId);
  }

  /**
   * 开始等待pong
   */
  private startWaitingPong() {
    this._pongTimerId = setInterval(() => {
      this.sendMessage(ACTION_TYPE.PONG, {})
    }, this._pongTimeout);
  }

  /**
   * 结束等待pong
   */
  private endWaitingPong() {
    clearInterval(this._pongTimerId);
  }
  /**
   * 尝试触发onReady
   */
  private tryOnReady() {
    if (this.ready && this._onReady) {
      // 触发onReady，满足条件之后只触发一次
      const onReady = this._onReady;
      this._onReady = undefined;
      onReady();
    }
  }

  /**
   * 开始缓存消息
   */
  startCache() {
    this._isFlushMsg = false
  }

  // 停止缓存并刷新
  stopCacheAndFlush() {
    this._isFlushMsg = true
    this.callReceiveMsgListener()
    this.callUpdateMsgListener()
  }
}