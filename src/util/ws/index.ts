// socket 通道
import { WsManage } from './wsManage';

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
// 2. 发送消息
// 3. 接收消息
// 4. 断开连接

// 1. websocket 连接
// 2. 发送消息
// 3. 接收消息
// 4. 断开连接

export {
  initWebSocket
}