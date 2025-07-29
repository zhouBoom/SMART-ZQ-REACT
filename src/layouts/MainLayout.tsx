// src/layouts/MainLayout.tsx
import { Layout, Avatar } from "antd";
import Sidebar from "../components/Sidebar";
import AppRoutes from "../router";
import { UserOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

const MainLayout = () => (
  <Layout style={{ height: "100vh" }}>
    <Sider width={200}>
        <div style={{ padding: 16, textAlign: "center", background: "#fff" }}>
            <Avatar size={64} icon={<UserOutlined />} />
            <div style={{ marginTop: 8 }}>周</div>
            <div style={{ color: "#faad14", fontSize: 12 }}>挂起-其他（在线但不接单）</div>
        </div>
      <Sidebar />
    </Sider>
    <Layout>
      <Content style={{ padding: 24, background: "#fff" }}>
        <AppRoutes />
      </Content>
    </Layout>
  </Layout>
);

export default MainLayout;