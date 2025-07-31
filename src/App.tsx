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
    document.cookie = 'udc_sdk_uid=224596; path=/'
    document.cookie = 'udc_token_int=mMa_RHZ6S3RlMXBCTE5WZkVoa0FPZ3pKZUUzc2JGVlFpcVVTM0tOSjU3d2E0RUtIOUxOaXk1U0tONGp6Q3h2YnpaUXdRSzNRazJlOUpFWnlYZkhCWXhsTTRPN3JTems3ZFpVaXR5SEthb01Ka1ppQ3RrRVhhUVVlM0thVWdpSkVFdEpsZ3RxbzFhdHpVMVRQMXJINXpINjFZUzI3aXNtVXVMZmlNOTd6MTNwenpDOEZtbVVyOENITkEtQVl4SFpDbzFMOEdXTnd2Ym1TSFhxcjdaY0gzU3dvcjV4akI1ZUplMGR2TmJqdVBSZ0poTDZhOHZLVExxZjVxNjNPTzRXanV0aElhSXY3TndTMW5RMkhSNnkwRU9ndHhzMzM5R1NUbXRwZ1gybmJxR0cwZ2d3Y00xbTVyR0EwYUNaMDR4T19lNWFDZzNPNU5yTldUZDFxNlo1a2VlMGJ1cnhVZHNmalhkdXFVdUdoVzRVUF8xcUM0dFFJRldPLWRmYWI2Ym1VeDFTNUJIUFFnMmd2Yk1qckpZWVBodC1VQ19PbmFFcHB0cFVPc21UdWZqVVQxZwp';
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
      page_size: 2000
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
