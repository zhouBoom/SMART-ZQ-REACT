import { sendMsg } from "@/util/ws/index";
import store from "@/store";

const clickToSendMsg = (text: string) => {
    if (text.length === 0) return;
    
    const currentConversation = store.getState().conversation.currentConversation;
    console.log('==currentConversation==', currentConversation)
    if (!currentConversation) {
        console.error('No current conversation selected');
        return;
    }
    
    const sendParams = {
        workcode: "224596",
        wx_corp_id: currentConversation.wx_corp_id,
        wx_userid: currentConversation.wx_userid,
        conv_id: currentConversation.id || '0',
        conv_type: 1,
        sender: currentConversation.wx_userid,
        receiver: currentConversation.wx_ext_userid,
        is_local_file: false,
        content: {
            type: "TEXT",
            text: {
                content: text
            }
        },
        quote_msg_type: "TEXT",
        quote_msg_content: text,
        quote_msg_send_time: Date.now(),
        quote_msg_sender: currentConversation.wx_userid,
        quote_msg_sender_name: currentConversation.name,
        quote_msg_file_path: "",
        quote_msg_file_name: "",
        revoke: false
    };
    console.log('==sendParams==', sendParams)
    sendMsg(sendParams);
};

export {
    clickToSendMsg
}