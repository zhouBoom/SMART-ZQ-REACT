// src/pages/Chat/index.tsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { addMessage, clearMessages, fetchMessages } from "../../store/modules/chatSlice";
import store from "../../store";

const Chat: React.FC = () => {
  const { messages, loading, error } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState("");
  useEffect(() => {
    dispatch(fetchMessages("123"));
  }, [dispatch]);
  return (
    <div>
      <h1>聊天页 Chat</h1>
      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="输入消息"
        />
        <button onClick={() => {
          if (input.trim()) {
            dispatch(addMessage(input));
            setInput("");
          }
        }}>发送</button>
        <button onClick={() => dispatch(clearMessages())}>清空</button>
        <button onClick={() => console.log(store.getState())}>打印当前state</button>
        <button onClick={() => dispatch(fetchMessages('123'))}>获取消息</button>
      </div>
      <ul>
        {messages.map((msg, idx) => <li key={idx}>{msg}</li>)}
      </ul>
    </div>
  );
};

export default Chat;