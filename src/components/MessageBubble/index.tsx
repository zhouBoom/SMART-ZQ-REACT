import React from 'react';
import { Avatar, Tooltip } from 'antd';
import type { Message } from '@/types/message';
import './index.less';

interface MessageBubbleProps {
  message: Message;
  showTime?: boolean;
  showStatus?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  showTime = true, 
  showStatus = true 
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'sending':
        return '发送中...';
      case 'sent':
        return '已发送';
      case 'failed':
        return '发送失败';
      default:
        return '';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'sending':
        return '#1890ff';
      case 'sent':
        return '#52c41a';
      case 'failed':
        return '#ff4d4f';
      default:
        return '#999';
    }
  };

  return (
    <div className={`message-bubble-container ${message.isSelf ? 'self' : 'other'}`}>
      {!message.isSelf && (
        <Avatar 
          size="small" 
          src={message.avatar}
          className="message-avatar"
        >
          {message.sender?.charAt(0)}
        </Avatar>
      )}
      
      <div className="message-content">
        <div className={`message-bubble ${message.isSelf ? 'self' : 'other'}`}>
          <div className="message-text">{message.content}</div>
          
          {showTime && (
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          )}
          
          {showStatus && message.isSelf && message.status && (
            <div 
              className="message-status"
              style={{ color: getStatusColor(message.status) }}
            >
              {getStatusText(message.status)}
            </div>
          )}
        </div>
      </div>
      
      {message.isSelf && (
        <Avatar 
          size="small" 
          src={message.avatar}
          className="message-avatar"
        >
          {message.sender?.charAt(0)}
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble; 