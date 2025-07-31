// socket 通道
import { uuid } from '../utils';
import { ACTION_TYPE } from './msgType';

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
      console.log('websocket 收到消息', event);
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
   * 收到消息
   */
  private onMessage(event: MessageEvent) {
    console.log('websocket 收到消息', event);
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
}