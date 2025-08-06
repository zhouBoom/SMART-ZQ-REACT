import { Avatar } from "antd";
import "./index.less"

interface ConversationItemProps {
    conversation?: any;
    isSelected?: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isSelected = false }) => {
    return (
        <div className={`conversation-item-container ${isSelected ? 'selected' : ''}`}>
            <Avatar src={conversation?.avatar}></Avatar>
            <div className="content">
                <div className="title">{conversation?.wx_user_name || conversation?.chat_name || '未知用户'}</div>
                <div className="desc">{conversation?.wx_userid || ''}</div>
                <div className="lastMsg">{conversation?.last_msg || '暂无消息'}</div>
            </div>
        </div>
    )
}

export default ConversationItem;