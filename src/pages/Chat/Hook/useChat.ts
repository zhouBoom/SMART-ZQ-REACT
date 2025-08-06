import { useConversation } from './useConversation';
import { useMessage } from './useMessage';
import { useConversationActions } from './useConversationActions';
import { useCustomerInfo } from './useCustomerInfo';

export const useChat = () => {
  const conversation = useConversation();
  const message = useMessage();
  const actions = useConversationActions();
  const customerInfo = useCustomerInfo();

  return {
    // 会话相关
    conversations: conversation.conversations,
    currentConversation: conversation.currentConversation,
    conversationStatus: conversation.status,
    fetchConversations: conversation.fetchConversations,
    setCurrentConversation: conversation.setCurrentConversation,
    init: conversation.init,

    // 消息相关
    inputText: message.inputText,
    msgList: message.msgList,
    sendMessage: message.sendMessage,
    handleInputChange: message.handleInputChange,

    // 操作相关
    transferConversation: actions.transferConversation,
    closeConversation: actions.closeConversation,
    quickReply: actions.quickReply,
    hasCurrentConversation: actions.hasCurrentConversation,

    // 客户信息相关
    customerInfo: customerInfo.customerInfo,
    customerLoading: customerInfo.loading,
    updateCustomerRemark: customerInfo.updateCustomerRemark,
  };
}; 