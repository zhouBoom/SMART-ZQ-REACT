import { Avatar } from "antd";
import "./index.less"

const ConversationItem = () => {
    return (
        <div className="conversation-item-container">
            <Avatar></Avatar>
            <div className="content">
                <div className="title">原点</div>
                <div className="desc">12345</div>
                <div className="lastMsg">最后一条消息</div>
            </div>
        </div>
    )
}

export default ConversationItem;