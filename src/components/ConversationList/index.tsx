// 会话列表
import React, { useEffect } from "react";
import { Input, List, Avatar } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { fetchConversationList, setCurrentConversationData } from "@/store/modules/conversationSlice";
import "./index.less";
import ConversationItem from "../ConversationItem";

const ConversationList = () => {
    const dispatch = useDispatch();
    const { data, currentConversation, status } = useSelector((state: RootState) => state.conversation);

    useEffect(() => {
        // 组件加载时获取会话列表
        dispatch(fetchConversationList({ page: 1, page_size: 10 }) as any);
    }, [dispatch]);

    const handleConversationClick = (conversation: any) => {
        // 点击会话时设置当前会话
        dispatch(setCurrentConversationData({
            wx_corp_id: conversation.wx_corp_id || '',
            wx_userid: conversation.wx_userid || '',
            id: conversation.id || 0,
            wx_ext_userid: conversation.wx_ext_userid || '',
            name: conversation.wx_user_name || conversation.chat_name || '',
        }));
    };

    return (
        <div className="conversation-list-container">
            <Input.Search placeholder="输入用户名备注" style={{ marginBottom: 16 }} />
            
            {status === 'loading' && <div>加载中...</div>}
            
            {data && data.list && (
                <List
                    dataSource={data.list}
                    renderItem={(item) => (
                        <div 
                            key={item.id}
                            onClick={() => handleConversationClick(item)}
                            style={{ 
                                cursor: 'pointer',
                                backgroundColor: currentConversation?.id === item.id ? '#f0f0f0' : 'transparent',
                                padding: '8px',
                                borderRadius: '4px'
                            }}
                        >
                            <ConversationItem 
                                conversation={item}
                                isSelected={currentConversation?.id === item.id}
                            />
                        </div>
                    )}
                />
            )}
        </div>
    );
};

export default ConversationList;