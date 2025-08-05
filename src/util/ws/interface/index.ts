type TypeAccountOnlineStatusResult = {
    type: 'online' | 'offline',
    wx_userid: string,
    wx_corp_id: string
}
type TypeRefreshCallback = {
    event_id?: number,
    callback: (refresh: Boolean)=>void
}
type TypeCloseConvCallback = {
    event_id: number,
    callback: (res: TypeCloseMsg) => void
}
type TypeConversationNameChangeCallback = {
    event_id?: number,
    callback: (res: TypeConversationNameChangeResult)=>void
}
type TypeAccountOnlineStatusCallback = {
    event_id?: number,
    callback: (res: TypeAccountOnlineStatusResult) => void
}
type TypeAccountMsgCountResult = {
    wx_userid: string,
    wx_corp_id: string,
    unread_total: number
}
type TypeAccountMsgCountCallback = {
    event_id?: number,
    callback: (res: TypeAccountMsgCountResult) => void
}
export type TypeChatMsgCountResult = {
    wx_userid?: string,
    wx_corp_id?: string,
    conv_type?: number, // 1 客户，2 群
    conv_id?: string,
    conv_new?: boolean,
    send_type?: number,
    tmp_id?: string,
    conv_object_info?: {
        name?: string,
        remark?: string,
        avatar?: string
    },
    sender_info: {
        avatar?: string,
        name?:string,
        remark?:string
    },
    receiver_info: {
        avatar?: string,
        name?:string,
        remark?:string
    },
    unread_num?: number,
    sender?: string,
    receiver?: string,
    status?: number, //发送状态
    msgid?: number,
    send_time?: number,
    content?: {
        type?: string,
        text?: {
            content?: string
        },
        voice?: {
            url: string,
            media_id: string,
            md5: string,
            text: string,
            duration: number
        },
        image?: {
            url?:string,
            md5?: string
        },
        file?: {
            url?: string,
            md5?: string,
            name?: string
        },
        video?: {
            url?: string,
            md5?: string
        }
    },
    is_important: number,
    is_transfer: number
}

type TypeConversationNameChangeResult = {
    workcode?: string,
    wx_userid?: string,
    wx_corp_id?: string,
    conv_id?: string,
    conv_type?: number, // 1 客户，2 群
    receiver?: string,
    receiver_info?: {
        wxid?: string,
        name?: string,
        remark?: string,
        avatar?: string
    },
    send_type: number,
    msgid?: number,
    send_time?: number
}

type TypeChatMsgCountCallback = {
    event_id: number,
    callback: (res: TypeChatMsgCountResult) => void
}

type TypeAccountNewChatCallback = {
    event_id: number,
    callback: (res: TypeChatMsgCountResult) => void
}

type TypeMsgType = "TEXT" | "IMG" | "FILE" | "VIDEO" | "VOICE"
type ReCallMsgType = {
    quote_msg_type: number,
    quote_msg_content: string,
    quote_msg_send_time: number,
    quote_msg_sender: string,
    quote_msg_sender_name: string,
    quote_msg_file_path: string,
    quote_msg_file_name: string,
    revoke: number
}
type TypeMsgContent = {
        type?: TypeMsgType,
        text?: ReCallMsgType & {
            content?: string
        },
        video?: ReCallMsgType & {
            url?: string,
            md5?: string,
            name?: string,
            media_id?: string,
            thumb_url?: string
        },
        voice?: ReCallMsgType & {
            url?: string,
            md5?: string,
            duration?: number,
            name?: string,
            text?: string,
            media_id?: string
        },
        image?: ReCallMsgType & {
            url?: string,
            md5?: string,
            name?: string,
            media_id?: string
        },
        file?: ReCallMsgType & {
            url?: string,
            md5?: string,
            name?: string,
            media_id?: string
        },
        video_call?: ReCallMsgType & {
            duration?: number
        },
        voice_call?: ReCallMsgType & {
            duration?: number
        },
        link?: ReCallMsgType & {
            title: string,
            desc: string,
            url: string
        },
        card: ReCallMsgType & {
            avatar: string,
            nickname: string
        },
        emotion: ReCallMsgType & {
            url: string
        },
        we_app: any,
        sph_video: any,
        sph_live: any,
        sph_card: any,
        quote_msg_type?: number,
        quote_msg_content?: string,
        quote_msg_send_time?: number,
        quote_msg_sender?: string,
        quote_msg_sender_name?: string,
        quote_msg_file_path?: string,
        quote_msg_file_name?: string,
        revoke?:number
}
type TypeMsg = {
    is_hide_revoke?:boolean,
    unread_num?: number,
    is_update?: boolean,
    send_type?: number,
    errcode?: number,
    errmsg?: string,
    resend_tmp_id?: string,// 重发时候的旧临时id，用于删除本地的消息记录，不需要发送到服务端
    tmp_id?: string,// 临时id，用于更新
    wx_userid?: string,
    wx_corp_id?:string,
    workcode?: string,
    conv_id?: number,
    conv_type?: number,
    sender?: string,
    receiver?: string,
    status?: number,
    msgid?: number,
    local_id?: number,
    server_id?: number,
    send_time?: number,
    revoke_time?:number,
    revoke_user_type?:number,
    content?: TypeMsgContent,
    process?:number,
    sender_info?: {
        name: string,
        avatar: string
    },
    receiver_info?: {
        name: string,
        avatar: string
    },
    is_transfer: number
}
type TypeCloseMsg = {
    conv_id: number,
    workcode:string,
    close_time:string,
    close_msg: string,
}
type TypeNewMsgCallback = {
    event_id: number,
    callback: (res: TypeMsg) => void
}

type TypeAiReplyMsgCallback = {
    event_id: number,
    callback: (res: TypeAiReplyMsgResult) => void
}

type TypeRevokeCallback = {
    event_id: number,
    callback: (res: TypeRevokeMsgResult) => void
}

type TypeUpdateMsgStatusCallbackObj = {
    start: (tempId: string)=> void,//// 获取该信息的临时标识，为后续去重做好准备, 消息开始以发送中状态展示到界面上，sending状态不做额外处理
    fail: (errcode: number, errmsg: string)=>void,
    success: (tempId: string, msgId: string)=>void,
    upload: (callback: Function, tmp_id: string)=>void
}
type TypeUpdateMsgStatusCallback =  {
    event_id: number,
    callback: TypeUpdateMsgStatusCallbackObj
}

type TypeLogoutCallback = {
    event_id?: number,
    callback: ()=>void
} 
type TypeUpdateStatusResult = {
    content?: TypeMsgContent,
    is_update?: boolean,
    wx_userid?: string,
    wx_corp_id?: string,
    server_id?: number,
    local_id?: number,
    conv_id: number,
    conv_type?: number,
    sender?: string,
    receiver?: string,
    send_type?: number,
    status?: number,
    tmp_id?: string,
    msgid?: number,
    send_time?: number,
    errcode?: number,
    errmsg?: string
}
type TypeAiReplyMsgResult = {
    answer: {
        answer_id: number,
        msg_id: number,
        error_status: number,
        choice_status: number,
        send_status: number,
        content_list: Array<{
            content_type: number,
            content: {
                content: string,
                file_md5: string,
                file_name: string,
                file_size: number,
                file_url: string
            }
        }>
    },
    question: {
        msg_id: number,
        content: string,
        content_type: number,
        send_time: number,
        workcode: string,
        wx_corp_id: string
    }
}
type TypeRevokeMsgResult = {
    workcode?: string,
    wx_userid?: string,
    wx_corp_id?: string,
    conv_id: number,
    conv_type?: number,
    sender?: string,
    receiver?: string,
    errcode?: number,
    errmsg?: string,
    msgid?: number,
    server_id?: number,
    local_id?: number,
    revoke_time?:number,
    revoke_user_type?:number
}
type TypeMsgQueue = {
    recv_msg?: {
        [conv_id:string]: Array<TypeMsg>
    },
    online_status?: Array<TypeAccountOnlineStatusResult>
    account_unread_msg?: Array<TypeAccountMsgCountResult>,
    chat_list_unread_msg?: Array<TypeChatMsgCountResult>,
    update_msg_status?: Array<TypeUpdateStatusResult>,
    close_conv?: {
        [conv_id:string]: Array<TypeCloseMsg>
    },
    account_new_chat?: {
        [account_id: string]: Array<TypeChatMsgCountResult>
    },
    refresh?: boolean,
    conversation_name_change?: {
        [conv_id:string]: Array<TypeConversationNameChangeResult>
    },
    reload_msg?: Array<TypeUpdateStatusResult>,
    revoke_msg?: {[conv_id:string]:Array<TypeRevokeMsgResult>},
    ai_reply_msg?: Array<TypeAiReplyMsgResult>
}

type TypeListener = {
    recv_msg?: {
        [conv_id:string]: Array<TypeNewMsgCallback>
    },
    online_status?: Array<TypeAccountOnlineStatusCallback>,
    logout?: Array<TypeLogoutCallback>,
    account_unread_msg?: Array<TypeAccountMsgCountCallback>,
    chat_list_unread_msg?: {
        [conversation_id: string]: Array<TypeChatMsgCountCallback>
    },
    update_msg_status?:{
        [conversation_id: string]: Array<TypeUpdateMsgStatusCallback>
    },
    account_new_chat?: {
        [account_id: string]: Array<TypeAccountNewChatCallback>
    },
    refresh?: Array<TypeRefreshCallback>,
    close_conv?: {
        [conv_id:string]: Array<TypeCloseConvCallback>
    },
    conversation_name_change?: {
        [account_id: string]: Array<TypeConversationNameChangeCallback>
    },
    reload_msg?: {
        [conversation_id: string]: Array<TypeNewMsgCallback>
    },
    ai_reply_msg?: Array<TypeAiReplyMsgCallback>,
    revoke_msg?: {
        [conversation_id: string]: Array<TypeRevokeCallback>
    }
}

type TypeSendMsgParams = {
    resend_tmp_id?: string, // 该参数用于重发的时候，本地用于删除列表中 resend_tmp_id对应的消息，不需要传给服务端
    workcode?: string,
    wx_corp_id?: string,
    conv_id?: number,
    conv_type?: number,
    sender?: string,
    receiver?: string,
    is_local_file?:boolean,
    content?: TypeMsgContent
}

export type {
    TypeAccountOnlineStatusCallback,
    TypeAccountMsgCountCallback,
    TypeChatMsgCountCallback,
    TypeNewMsgCallback,
    TypeUpdateMsgStatusCallback,
    TypeUpdateMsgStatusCallbackObj,
    TypeMsgQueue,
    TypeListener,
    TypeLogoutCallback,
    TypeMsg,
    TypeMsgContent,
    TypeSendMsgParams,
    TypeAccountNewChatCallback,
    TypeRefreshCallback,
    TypeCloseConvCallback,
    TypeConversationNameChangeCallback,
    TypeAiReplyMsgCallback
}