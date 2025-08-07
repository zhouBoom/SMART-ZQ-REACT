// 管理websocket连接
/**
 * 管理层、负责连接管理和消息路由
 * 单例模式管理WebSocket连接
 * 初始化WebSocket连接
 * 管理连接的生命周期
 * 提供消息发送接口
 * 管理消息缓存机制
 */
import { WsChannel } from './wsChannel';
import type { ILoginInfo } from './wsChannel';
import { ACTION_TYPE } from './msgType';

interface IWsConfig {
    loginInfo: ILoginInfo,
    onSuccess: () => void,
    onError: (result: any) => void
}

export class WsManage {
  /**
   * 单例模式
   */
  private static _instance?: WsManage;
  /**
   * 获取单例
   */
  static get instance(): WsManage {
    if (!WsManage._instance) {
      WsManage._instance = new WsManage();
    }
    return WsManage._instance;
  }
  private _wsChannel?: WsChannel;
  /**
   * 初始化websocket连接
   */
  async init(wsConfig: IWsConfig, isSandBox: boolean = false, tempWsUrl?: string) {
    if (!wsConfig.loginInfo['WX-CORPID']) {
        return;
    }
    console.log('初始化websocket连接', tempWsUrl);
    const wsChannel = new WsChannel(tempWsUrl? tempWsUrl : ((isSandBox ? 'wss://test-udc.100tal.com/zhuque/websocket/ws' : `wss://udc.100tal.com/zhuque/websocket/ws`) + "?corp_id=" + wsConfig.loginInfo['WX-CORPID']) , wsConfig.loginInfo, {
        onError: wsConfig.onError,
        onReady: wsConfig.onSuccess
    });
    this._wsChannel = wsChannel;
  }

  async wsClose() {
    if (this._wsChannel) {
        this._wsChannel.disconnectWs();
    }
  }

  async sendMsg(content: Object) {
    if (this._wsChannel) {
        this._wsChannel.sendMessage(ACTION_TYPE.SEND_MSG, content);
    }
  }

  /**
   * 缓存消息
   */
  startCache() {
    if (this._wsChannel) {
        this._wsChannel.startCache();
    }
  }
  /**
   * 停止缓存并更新队列
   */
  stopCacheAndFlush () {
    this._wsChannel?.stopCacheAndFlush()
  }
}