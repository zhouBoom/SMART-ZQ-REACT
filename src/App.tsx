import MainLayout from "./layouts/MainLayout";
// import { getLoginStatusApi, getAuthApi } from "@/api/getAuthApi";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "@/store/modules/userSlice";
import type { RootState } from "@/store/index";
import { fetchConversationList } from "@/store/modules/conversationSlice";
import { initWebSocket } from "@/util/ws/index";

function App() {
  const setCookie = () => {
    document.cookie = 'udc_sdk_uid=087337; path=/'
    document.cookie = 'udc_token_int=ygp_UTdQbldsYjNlWGhHQWFOSzJyTXpxelo1QUJYeGhBUzlJbFpZWXNSYXJpWWhyT3lkRnpxUkdoNXUxc0Vjc3Nta1ZfTm16ZkVjeUw4djZ1Zk9wd3lYLW1sOWJuV0RVTmlRWWl1VVNZVnNlTzIxV3J4Sk1JeGJGWEpEQVRFbWh0VjZNU3ZNYjM4MkhOMEdqYlBGOFozOFJjQ3FzN2FmNmRZNEx2eXM2ckZjWmJrS3ZvcWRpZDUtUWkzc3Z6cm5ZYTkwLTBrZjNBQzdRMkdaY3o2dkFId0ZwOGlfczA4V0pWaGJLSnkzUWY2TG5PN20wYkZKekdHdTR6cUdvSWVXV3FuTnNhMGFldGlzT0JMQURrQ19nNzRaeTNRYm5aMXBTZnpmMkVaQlVzcHVCb00wX2tsT1dwQ2llMHhDX204Z29pUkU5YXFVZlNPTVhCZkpVT1Z4N2FkMENpLWdvOFRGdUNFdE9yb0JJZnBDQmJrMG93bDZ0RDMyeDhwY0dycHZYb0ZkTFZrdFhPMHhtQkdNM1U5WWlGYmp1dko5WXdzUjlRaDZfSGplU3VwTURGcFZPNllRU0tIU1dqeEhBVzRqVzV4N1Y3M2x2MmZqV21FTzRDRGlyTU1INFEO';
  }
  if (location.host.includes("localhost")) {
    setCookie();
  }
  const dispatch = useDispatch();
  const initializedRef = useRef(false); // 用于防止重复初始化
  
  useEffect(() => {
    dispatch(fetchUserInfo() as any);
  }, []);
  
  const { data: userData, status: userStatus} = useSelector((state: RootState) => state.user);
  
  // 只在数据真正变化时才打印
  useEffect(() => {
    if (userData) {
      console.log('userData 更新:', userData);
    }
  }, [userData]);
  
  useEffect(() => {
    if (userStatus) {
      console.log('userStatus 更新:', userStatus);
    }
  }, [userStatus]);
  // 初始化获取会话列表
  const initConvList = () => {
    console.log('开始获取会话列表...');
    dispatch(fetchConversationList({
      page: 1,
      pageSize: 10
    }) as any);
  }
  // 监听data和status变化，只初始化一次
  useEffect(() => {
    // 只有当状态为success且有数据时才执行初始化，并且只初始化一次
    if (userStatus === 'success' && userData?.corp_list?.length && userData.corp_list.length > 0 && !initializedRef.current) {
      initializedRef.current = true; // 标记已初始化
      console.log('开始初始化socket连接和会话列表...');
      
      initConvList();
      initWebSocket(
        { 'WX-CORPID': userData.corp_list[0].wx_corp_id },
        ['test-udc.100tal.com', '127.0.0.1', '10.29', 'localhost'].some(
          (url) => location.href.includes(url)
        )
      ).then((result: any) => {
        console.log('websocket 连接成功', result);
      }).catch((error: any) => {
        console.error('websocket 连接失败', error);
        initializedRef.current = false; // 连接失败时重置标记，允许重试
      });
    }
  }, [userStatus, userData?.corp_list?.length]); // 只监听数组长度变化

  return (
    <MainLayout />
  )
}

export default App
