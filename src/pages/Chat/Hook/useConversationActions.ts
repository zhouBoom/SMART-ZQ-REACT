import { message } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export const useConversationActions = () => {
  const { currentConversation } = useSelector((state: RootState) => state.conversation);

  // 转移会话
  const transferConversation = async () => {
    if (!currentConversation) {
      message.warning('请先选择一个会话');
      return;
    }

    try {
      // 这里可以调用转移会话的API
      console.log('转移会话:', currentConversation.id);
      message.success('会话转移成功');
    } catch (error) {
      console.error('转移会话失败:', error);
      message.error('转移会话失败');
    }
  };

  // 关闭会话
  const closeConversation = async () => {
    if (!currentConversation) {
      message.warning('请先选择一个会话');
      return;
    }

    try {
      // 这里可以调用关闭会话的API
      console.log('关闭会话:', currentConversation.id);
      message.success('会话关闭成功');
    } catch (error) {
      console.error('关闭会话失败:', error);
      message.error('关闭会话失败');
    }
  };

  // 快捷回复
  const quickReply = (replyText: string) => {
    if (!currentConversation) {
      message.warning('请先选择一个会话');
      return;
    }

    console.log('快捷回复:', replyText);
    // 这里可以调用发送消息的API
  };

  return {
    transferConversation,
    closeConversation,
    quickReply,
    hasCurrentConversation: !!currentConversation,
  };
}; 