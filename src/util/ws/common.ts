import type {TypeListener, TypeMsgQueue} from './interface/index'

let listeners: TypeListener = {}
let messageQueue: TypeMsgQueue = {
    account_unread_msg: [],
    chat_list_unread_msg: [],
    online_status: [],
    update_msg_status: [],
    recv_msg: {},
    account_new_chat: {},
    refresh: false,
    conversation_name_change: {},
    close_conv: {},
    reload_msg: [],
    revoke_msg: {},
    ai_reply_msg: []
}
let _seq = 1
const nextSeq = ()=>{
    _seq ++
    return _seq
}
export {
    listeners,
    nextSeq,
    messageQueue
}