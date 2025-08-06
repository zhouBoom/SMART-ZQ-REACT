import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { fetchConversationList, fetchSetCurrentConversation, setCurrentConversationData } from '@/store/modules/conversationSlice';

export const useConversation = () => {
  const dispatch = useDispatch();
  const { data, currentConversation, status } = useSelector((state: RootState) => state.conversation);
  const convId = useRef("100146");

  // 获取会话列表
  const fetchConversations = async (page: number = 1, pageSize: number = 10) => {
    try {
      await dispatch(fetchConversationList({ page, page_size: pageSize }) as any);
    } catch (error) {
      console.error('获取会话列表失败:', error);
    }
  };

  // 设置当前会话
  const setCurrentConversation = (conversation: any) => {
    dispatch(setCurrentConversationData(conversation));
  };

  // 初始化会话数据
  const init = async () => {
    console.log('=== 开始初始化 ===');
    console.log('初始状态 - data:', data);
    console.log('初始状态 - currentConversation:', currentConversation);
    
    // 首先获取会话列表
    await fetchConversations();
    
    console.log('获取会话列表后 - data:', data);
    console.log('获取会话列表后 - currentConversation:', currentConversation);
    
    // 然后设置当前会话
    await dispatch(fetchSetCurrentConversation(Number(convId.current)) as any);
  };

  // 初始化
  useEffect(() => {
    init();
  }, []);

  return {
    conversations: data?.list || [],
    currentConversation,
    status,
    fetchConversations,
    setCurrentConversation,
    init,
  };
}; 