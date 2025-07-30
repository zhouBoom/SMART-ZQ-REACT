import MainLayout from "./layouts/MainLayout";
// import { getLoginStatusApi, getAuthApi } from "@/api/getAuthApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "@/store/modules/userSlice";
import type { RootState } from "@/store/index";

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
  const { data, status, error } = useSelector((state: RootState) => state.user);
  console.log('data', data);
  console.log('status', status);
  console.log('error', error);
  // 监听data和status变化
  useEffect(() => {
    // 初始化socket连接
    // 如果status为success并且data不为空，则初始化socket连接或者重新初始化
  }, [data, status]);

  return (
    <MainLayout />
  )
}

export default App
