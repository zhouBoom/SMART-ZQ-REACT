// 会话列表
import { Input } from "antd";
import "./index.less";
import ConversationItem from "../ConversationItem"
const ConversationList = () => {
    return (
        <div className="conversation-list-container">
            <Input.Search placeholder="输入用户名备注" style={{ marginBottom: 16 }} />
            <ConversationItem></ConversationItem>
        </div>
    )
}

export default ConversationList;