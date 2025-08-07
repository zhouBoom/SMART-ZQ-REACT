// socket 通道
/**
 * 对外接口层
 */
import { WsManage } from './wsManage';
import type { TypeMsg } from './interface/index';
import { listeners, nextSeq } from './common';

// 1. websocket 连接
export interface ILoginInfo {
    'WX-CORPID': string
}
const initWebSocket = (loginInfo: ILoginInfo, isSandBox:boolean = false, tempWsUrl?: string) => {
    return new Promise((resolve, reject) => {
    const wsConfig = {
      loginInfo,
      onError: (result: any) => {
        console.error('websocket 连接失败', result);
        resolve({
          isSuccess: false,
          errMsg: result.message || 'websocket 连接失败', 
          errCode: result.code || 500,
          errName: result.name || 'websocket 连接失败',
          errStack: result.stack || 'websocket 连接失败'
        })
      },
      onSuccess: () => {
        resolve({
          isSuccess: true
        })
      }
    }
    // 初始化websocket连接
    try {
      WsManage.instance.init(wsConfig, isSandBox, tempWsUrl);
    } catch (error) {
      reject(`'初始化WebSocket出错了，错误信息如下：'${error}`)
    }
  })
}

type TypeNewMsgCallback = {
  event_id: number,
  callback: (res: TypeMsg) => void
}
/**
 * 注册新消息监听
 */
const addNewMsgListener = (convId: string, callBack: TypeNewMsgCallback["callback"]) => {
  console.log("注册新消息");
  if (!listeners.recv_msg) { // 判断有没有已经存在收到的消息，因为这是切换会话注册的，所以需要清空
      listeners.recv_msg = {};
  }
  if (!Array.isArray(listeners.recv_msg[convId])) { // 根据会话id存储
      listeners.recv_msg[convId] = [];
  }
  let eventId = nextSeq();
  let callBackParams = {
    event_id: eventId,
    callback: callBack
  }
  listeners.recv_msg[convId].push(callBackParams);
  console.log("消息队列", listeners.recv_msg[convId]);
  return eventId;
}
/**
 * 移除新消息监听
 */
const removeNewMsgListener = (eventId: number) => {
  if (!listeners.recv_msg) return
  first: for (let key in listeners.recv_msg) {
      if (Array.isArray(listeners.recv_msg[key])) {
          let arr = listeners.recv_msg[key];
          for (let i = 0; i < arr.length; i++) {
              if (arr[i].event_id === eventId) {
                  arr.splice(i, 1)
                  break first;
              }
          }
      }
  }
}

type TypeAccountMsgCountResult = {
  wx_userid: string,
  wx_corp_id: string,
  unread_total: number
}

const sendMsg = (sendInfo: any, updateCallback: any) => {
  WsManage.instance.sendMsg(sendInfo)
  /**
   * 注册消息更新回执监听
   */
  const addUpdateMsgListener = () => {
    if (!Array.isArray(listeners.update_msg_status)) {
      listeners.update_msg_status = {};
    }
    if (!Array.isArray(listeners.update_msg_status[sendInfo.conv_id])) {
      listeners.update_msg_status[sendInfo.conv_id] = []
    }
    let eventId = nextSeq();
    let callBackParams = {
      event_id: eventId,
      callback: updateCallback
    }
    listeners.update_msg_status[sendInfo.conv_id].push(callBackParams);
    console.log('==listeners.update_msg_status==', listeners.update_msg_status)
  }
  addUpdateMsgListener()
}

/**
 * 移除消息更新回执监听
 */
const removeUpdateMsgListener = (eventId: number) => {
  if (!Array.isArray(listeners.update_msg_status)) {
    return
  }
}

type TypeAccountMsgCountCallback = {
  event_id?: number,
  callback: (res: TypeAccountMsgCountResult) => void
}

const addAccountMsgCountListener = (callback: TypeAccountMsgCountCallback["callback"]) => {
  if(!Array.isArray(listeners.account_unread_msg)){
      listeners.account_unread_msg = []
  }
  let eventId = nextSeq()
  let callbackParam = {
      event_id: eventId,
      callback
  }
  listeners.account_unread_msg?.push(callbackParam)
  return eventId
}

const removeAccountMsgCountListener = (eventId: number) => {
  if (!Array.isArray(listeners.account_unread_msg)) {
      return
  }
  let arr = listeners.account_unread_msg;
  for (let i = 0; i < arr.length; i++) {
      if (arr[i].event_id === eventId) {
          arr.splice(i, 1)
          break;
      }
  }
}

const uuid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
export {
  initWebSocket,
  addNewMsgListener,
  removeNewMsgListener,
  addAccountMsgCountListener,
  removeAccountMsgCountListener,
  sendMsg,
  uuid
}