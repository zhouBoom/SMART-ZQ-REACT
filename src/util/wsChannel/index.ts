// socket 通道

// 1. websocket 连接
export interface ILoginInfo {
    'WX-CORPID': string
}
const initWebSocket = (loginInfo: ILoginInfo, isSandBox:boolean = false, tempWsUrl?: string) => {
  const ws = new WebSocket(tempWsUrl || 'wss://test-udc.100tal.com/ws/v1/chat');
  ws.onopen = () => {
    console.log('websocket 连接成功');
  }
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