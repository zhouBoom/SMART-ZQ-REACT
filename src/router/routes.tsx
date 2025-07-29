// src/router/routes.ts
import {
    MessageOutlined,
    TeamOutlined,
    DatabaseOutlined,
  } from "@ant-design/icons";
  import ChatPage from "../pages/Chat";
  import HomePage from "../pages/Home";
  import LoginPage from "../pages/Login";
  
  export interface RouteConfig {
    path: string;
    name: string;
    icon?: React.ReactNode;
    element?: React.ReactNode;
    children?: RouteConfig[];
    hideInMenu?: boolean; // 可选：不显示在菜单
  }
  
  export const routes: RouteConfig[] = [
    {
      path: "/",
      name: "首页",
      icon: <DatabaseOutlined />,
      element: <HomePage />,
    },
    {
      path: "/chat",
      name: "会话",
      icon: <MessageOutlined />,
      element: <ChatPage />,
    },
    {
      path: "/login",
      name: "登录",
      icon: <TeamOutlined />,
      element: <LoginPage />,
    },
    // ... 其他路由
  ];