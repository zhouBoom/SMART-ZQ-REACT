// src/pages/Chat/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { addMessage, clearMessages, fetchMessages } from "../../store/modules/chatSlice";
import { fetchSetCurrentConversation } from "../../store/modules/conversationSlice";
import store from "../../store";
import { Layout, Avatar, Button, Tabs, Input, List, Card } from "antd";
import HeaderBar from "../../components/HeaderBar";
import ConversationList from "../../components/ConversationList";
import ChatWindow from "../../components/ChatWindow"
// ws
import { addNewMsgListener } from "../../util/ws/index";
import { clickToSendMsg } from "./Hook/send";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;
// const dispatch = useDispatch();
  // const [input, setInput] = useState("");
const ChatPage: React.FC = () => {
  const [msgList, setMsgList] = useState<Array<any[]>>([]);
  const [inputText, setInputText] = useState("");
  // const [convId, setConvId] = useState("");
  const convId = useRef("100146");
  let currentNewMsgListenerId = 0;
  useEffect(() => {
    // dispatch(fetchMessages("123"));
    init();
  }, []);
  const init = async () => {
    await store.dispatch(fetchSetCurrentConversation(Number(convId.current)) as any);
    registerRecvNewMsgListener(msgList)
  }
  const registerRecvNewMsgListener = (msgList: any) => {
    if(!convId)return
    currentNewMsgListenerId = addNewMsgListener(convId.current + '', (res) => {
      console.log('==收到的消息==', res)
    })
  }
  const sendMsg = () => {
    console.log("sendMsg");
    clickToSendMsg(inputText);
  }
  const handleInputTextChange = (e: any) => {
    const value = e.target.value;
    setInputText(value);
  }
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
        {/* 聊天窗口 */}
        <div style={{ display: "flex", height: "100%" }}>
          {/* 聊天消息区 */}
          <div style={{ flex: 2, marginRight: 24, display: "flex", flexDirection: "column" }}>
            {/* 顶部操作按钮 */}
            <div style={{ marginBottom: 16 }}>
              <Button danger>转移会话</Button>
              <Button type="primary" ghost>关闭会话</Button>
            </div>
            {/* 消息列表 */}
            <ChatWindow />
            {/* <div style={{ flex: 1, background: "#fafafa", marginBottom: 16, padding: 16, overflowY: "auto" }}>
              <div>（这里显示消息气泡、图片等）</div>
            </div> */}
            {/* 输入框 */}
            <div>
              <Input.TextArea value={inputText} onChange={handleInputTextChange} rows={2} placeholder="请输入..." />
              <Button type="primary" style={{ marginTop: 8 }} onClick={sendMsg}>发送</Button>
            </div>
          </div>
          {/* 右侧 tab 区域 */}
          <div style={{ flex: 1 }}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="客户详情" key="1">
                <Card title="客户基本信息" size="small">
                  <p>客户昵称：起点</p>
                  <p>客户备注：起点</p>
                  <p>客户描述：QNSN100661E</p>
                  {/* ...更多信息 */}
                </Card>
              </TabPane>
              <TabPane tab="快捷回复" key="2">
                <div>（快捷回复内容）</div>
              </TabPane>
              <TabPane tab="咨询记录" key="3">
                <div>（咨询记录内容）</div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Content>
    </Layout>
    </Layout>
  )
}

export default ChatPage;