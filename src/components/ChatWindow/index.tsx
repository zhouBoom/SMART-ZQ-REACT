import React, { useEffect, useRef } from 'react';
import type { Message, MessageGroup } from '@/types/message';
import MessageBubble from '../MessageBubble';
import './index.less';

interface ChatWindowProps {
  messages: Message[];
  loading?: boolean;
  onLoadMore?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages = [], 
  loading = false, 
  onLoadMore 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 按日期分组消息
  const groupMessagesByDate = (messages: Message[]): MessageGroup[] => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('zh-CN');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="chat-window">
      <div className="message-list">
        {loading && (
          <div className="loading-messages">
            加载中...
          </div>
        )}
        
        {messageGroups.length === 0 && !loading ? (
          <div className="empty-messages">
            <div className="empty-icon">💬</div>
            <div>暂无消息，开始聊天吧！</div>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={group.date} className="message-group">
              <div className="message-date">{group.date}</div>
              {group.messages.map((message, messageIndex) => (
                <MessageBubble 
                  key={`${message.id}-${messageIndex}`}
                  message={message}
                  showTime={true}
                  showStatus={true}
                />
              ))}
            </div>
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;