// 会话相关api
import request from "@/util/axios";
import type { HttpSuccessData } from '@/util/type';
import utils from "@/util/utils";

// 获取会话列表 API

interface Conversation {
    staff_workcode: string;
    user_id: number;
    id: number;
    wx_userid: string;
    wx_ext_userid: string;
    wx_user_name: string;
    chat_name: string;
    wx_ext_name: string;
    is_read: string;
    status: string;
    avatar: string;
    last_msg: string;
    last_time: string;
}

interface ConversationListData {
    list: Conversation[];
    page: number;
    pageSize: number;
    total_page: number;
    total_rows: number;
}
export const getConversationList = (page: number, pageSize: number): Promise<HttpSuccessData<ConversationListData>> => {
    // 真实请求
    return request.post(utils.getUdcapi() + '/zhuque/api/conversation/list', { page, pageSize }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export type {
    Conversation,
    ConversationListData
}