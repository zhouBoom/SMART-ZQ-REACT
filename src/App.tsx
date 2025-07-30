import MainLayout from "./layouts/MainLayout";
// import { getLoginStatusApi, getAuthApi } from "@/api/getAuthApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "@/store/modules/userSlice";
import type { RootState } from "@/store/index";
import { fetchConversationList } from "@/store/modules/conversationSlice";
import { initWebSocket } from "@/util/wsChannel/index";

function App() {
  const setCookie = () => {
    document.cookie = 'udc_sdk_uid=087337; path=/'
    document.cookie = 'udc_token_int=ygp_UTdQbldsYjNlWGhHQWFOSzJyTXpxelo1QUJYeGhBUzlJbFpZWXNSYXJpWWhyT3lkRnpxUkdoNXUxc0Vjc3Nta1ZfTm16ZkVjeUw4djZ1Zk9wd3lYLW1sOWJuV0RVTmlRWWl1VVNZVnNlTzIxV3J4Sk1JeGJGWEpEQVRFbWh0VjZNU3ZNYjM4MkhOMEdqYlBGOFozOFJjQ3FzN2FmNmRZNEx2eXM2ckZjWmJrS3ZvcWRpZDUtUWkzc3Z6cm5ZYTkwLTBrZjNBQzdRMkdaY3o2dkFId0ZwOGlfczA4V0pWaGJLSnkzUWY2TG5PN20wYkZKekdHdTR6cUdvSWVXV3FuTnNhMGFldGlzT0JMQURrQ19nNzRaeTNRYm5aMXBTZnpmMkVaQlVzcHVCb00wX2tsT1dwQ2llMHhDX204Z29pUkU5YXFVZlNPTVhCZkpVT1Z4N2FkMENpLWdvOFRGdUNFdE9yb0JJZnBDQmJrMG93bDZ0RDMyeDhwY0dycHZYb0ZkTFZrdFhPMHhtQkdNM1U5WWlGYmp1dko5WXdzUjlRaDZfSGplU3VwTURGcFZPNllRU0tIU1dqeEhBVzRqVzV4N1Y3M2x2MmZqV21FTzRDRGlyTU1INFEO';
  }
  if (location.host.includes("localhost")) {
    setCookie();
  }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo() as any);
  }, []);
  const { data: userData, status: userStatus} = useSelector((state: RootState) => state.user);
  const { data: convData, status: convStatus} = useSelector((state: RootState) => state.conversation);
  console.log('data', userData);
  console.log('status', userStatus);
  // 初始化获取会话列表
  const initConvList = () => {
    dispatch(fetchConversationList({
      page: 1,
      pageSize: 10
    }) as any);
    console.log('initConvList', convData?.list, convStatus);
  }
  // 监听data和status变化
  useEffect(() => {
    // 初始化socket连接 如果status为success并且data不为空，则初始化socket连接或者重新初始化
    console.log('data', userData);
    if (userStatus === 'success' && userData && userData.corp_list.length > 0) {
      initConvList();
      initWebSocket(
        { 'WX-CORPID': userData.corp_list[0].wx_corp_id },
        ['test-udc.100tal.com', '127.0.0.1', '10.29', 'localhost'].some(
          (url) => location.href.includes(url)
        )
      );
    }
  }, [userData, userStatus]);

  return (
    <MainLayout />
  )
}

export default App
