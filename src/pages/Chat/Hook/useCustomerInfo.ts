import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface CustomerInfo {
  nickname: string;
  remark: string;
  description: string;
  avatar: string;
  phone?: string;
  email?: string;
}

export const useCustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { currentConversation } = useSelector((state: RootState) => state.conversation);

  // 获取客户信息
  const fetchCustomerInfo = async (customerId: string) => {
    if (!customerId) return;

    setLoading(true);
    try {
      // 这里可以调用获取客户信息的API
      console.log('获取客户信息:', customerId);
      
      // 模拟数据
      const mockCustomerInfo: CustomerInfo = {
        nickname: currentConversation?.name || '未知客户',
        remark: '客户备注',
        description: '客户描述',
        avatar: currentConversation?.avatar || '',
        phone: '13800138000',
        email: 'customer@example.com',
      };
      
      setCustomerInfo(mockCustomerInfo);
    } catch (error) {
      console.error('获取客户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 当当前会话改变时，获取客户信息
  useEffect(() => {
    if (currentConversation?.id) {
      fetchCustomerInfo(currentConversation.id.toString());
    }
  }, [currentConversation?.id]);

  // 更新客户备注
  const updateCustomerRemark = async (remark: string) => {
    if (!currentConversation?.id) return;

    try {
      // 这里可以调用更新客户备注的API
      console.log('更新客户备注:', remark);
      setCustomerInfo(prev => prev ? { ...prev, remark } : null);
    } catch (error) {
      console.error('更新客户备注失败:', error);
    }
  };

  return {
    customerInfo,
    loading,
    fetchCustomerInfo,
    updateCustomerRemark,
  };
}; 