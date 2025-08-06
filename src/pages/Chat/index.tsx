// src/pages/Chat/index.tsx
import React from "react";
import { Layout, Button, Tabs, Input, Card } from "antd";
import HeaderBar from "../../components/HeaderBar";
import ConversationList from "../../components/ConversationList";
import ChatWindow from "../../components/ChatWindow";
import { useChat } from "./Hook/useChat";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const ChatPage: React.FC = () => {
  const {
    // 会话相关
    currentConversation,
    conversationStatus,
    
    // 消息相关
    inputText,
    msgList,
    sendMessage,
    handleInputChange,
  } = useChat();
  return (
    <Layout style={{ height: "100vh" }}>
      <HeaderBar />
    {/* 主内容区 */}
    <Layout>
      <Sider width={300} style={{ background: "#fff", borderRight: "1px solid #eee" }}>
        {/* 会话列表区 */}
        {/* <div style={{ padding: 12 }}>
          <Input.Search placeholder="输入用户名备注" style={{ marginBottom: 16 }} />
          <List
            header={<div>我的待处理会话：1个</div>}
            bordered
            dataSource={["雷默_世纪"]}
            renderItem={item => (
              <List.Item>
                <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <span>{item}</span>
              </List.Item>
            )}
          />
        </div> */}
        <ConversationList />
      </Sider>
      <Content style={{ padding: 24, background: "#fff" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flex: 2, marginRight: 24, display: "flex", flexDirection: "column" }}>
            {/* <div style={{ marginBottom: 16 }}>
              <Button 
                danger 
                disabled={!hasCurrentConversation}
                onClick={transferConversation}
              >
                转移会话
              </Button>
              <Button 
                type="primary" 
                ghost 
                disabled={!hasCurrentConversation}
                onClick={closeConversation}
              >
                关闭会话
              </Button>
            </div> */}
            {/* 消息列表 */}
            <ChatWindow 
              messages={msgList}
              loading={false}
            />
            {/* <div style={{ flex: 1, background: "#fafafa", marginBottom: 16, padding: 16, overflowY: "auto" }}>
              <div>（这里显示消息气泡、图片等）</div>
            </div> */}
            {/* 输入框 */}
            <div>
              <Input.TextArea value={inputText} onChange={handleInputChange} rows={2} placeholder="请输入..." />
              <Button type="primary" style={{ marginTop: 8 }} onClick={sendMessage}>发送</Button>
            </div>
          </div>
          {/* 右侧 tab 区域 */}
          <div style={{ flex: 1 }}>
            {/* <Tabs defaultActiveKey="1">
              <TabPane tab="客户详情" key="1">
                <Card title="客户基本信息" size="small" loading={customerLoading}>
                  <p>客户昵称：{customerInfo?.nickname || '未选择'}</p>
                  <p>客户备注：{customerInfo?.remark || '未选择'}</p>
                  <p>客户描述：{customerInfo?.description || '未选择'}</p>
                  <p>联系电话：{customerInfo?.phone || '未选择'}</p>
                  <p>邮箱地址：{customerInfo?.email || '未选择'}</p>
                </Card>
              </TabPane>
              <TabPane tab="快捷回复" key="2">
                <div>（快捷回复内容）</div>
              </TabPane>
              <TabPane tab="咨询记录" key="3">
                <div>（咨询记录内容）</div>
              </TabPane>
            </Tabs> */}
          </div>
        </div>
      </Content>
    </Layout>
    </Layout>
  )
}

export default ChatPage;