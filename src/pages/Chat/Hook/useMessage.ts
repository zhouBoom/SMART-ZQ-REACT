import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { addNewMsgListener } from '@/util/ws/index';
import { clickToSendMsg } from './send';
import type { Message } from '@/types/message';

export const useMessage = () => {
  const [inputText, setInputText] = useState('');
  const [msgList, setMsgList] = useState<Message[]>([]);
  const currentNewMsgListenerId = useRef<number>(0);
  
  const { currentConversation } = useSelector((state: RootState) => state.conversation);

  // 添加测试数据
  useEffect(() => {
    const testMessages: Message[] = [
      {
        id: '1',
        content: '你好，我是客服小助手，有什么可以帮助您的吗？',
        sender: '客服',
        receiver: '用户',
        timestamp: Date.now() - 60000,
        type: 'TEXT',
        isSelf: false,
        status: 'sent',
        avatar: '',
      },
      {
        id: '2',
        content: '我想咨询一下产品信息',
        sender: '用户',
        receiver: '客服',
        timestamp: Date.now() - 30000,
        type: 'TEXT',
        isSelf: true,
        status: 'sent',
        avatar: '',
      },
      {
        id: '3',
        content: '好的，请问您想了解哪个产品呢？',
        sender: '客服',
        receiver: '用户',
        timestamp: Date.now() - 10000,
        type: 'TEXT',
        isSelf: false,
        status: 'sent',
        avatar: '',
      },
    ];
    setMsgList(testMessages);
  }, []);

  // 发送消息
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    console.log('发送消息:', inputText);
    
    // 创建新消息
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: '用户',
      receiver: '客服',
      timestamp: Date.now(),
      type: 'TEXT',
      isSelf: true,
      status: 'sending',
      avatar: '',
    };
    
    // 添加到消息列表
    setMsgList(prev => [...prev, newMessage]);
    
    // 发送消息
    clickToSendMsg(inputText);
    setInputText('');
    
    // 模拟发送成功
    setTimeout(() => {
      setMsgList(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    }, 1000);
  };

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // 注册消息监听器
  const registerMessageListener = (convId: string) => {
    if (!convId) return;

    // 清理之前的监听器
    if (currentNewMsgListenerId.current) {
      // 这里可以添加清理监听器的逻辑
    }

    currentNewMsgListenerId.current = addNewMsgListener(convId, (res) => {
      console.log('==收到的消息==', res);
      // 处理接收到的消息
      const receivedMessage: Message = {
        id: Date.now().toString(),
        content: typeof res.content === 'string' ? res.content : '收到新消息',
        sender: typeof res.sender === 'string' ? res.sender : '客服',
        receiver: '用户',
        timestamp: Date.now(),
        type: 'TEXT',
        isSelf: false,
        status: 'sent',
        avatar: '',
      };
      setMsgList(prev => [...prev, receivedMessage]);
    });
  };

  // 当当前会话改变时，重新注册监听器
  useEffect(() => {
    if (currentConversation?.id) {
      registerMessageListener(currentConversation.id.toString());
    }
  }, [currentConversation?.id]);

  return {
    inputText,
    msgList,
    sendMessage,
    handleInputChange,
    registerMessageListener,
  };
}; 