import React from "react";
import { Navigate } from "react-router-dom";

// isLogin判断登陆状态
const isLogin = () => {
    // 这里可以用全局状态、localStorage、cookie等判断
  return !!localStorage.getItem("token");
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isLogin() ? <>{children}</> : <Navigate to="/login" replace />;
  };

export default PrivateRoute;