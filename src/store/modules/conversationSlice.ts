import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConversationList, setCurrentConversation } from '@/api/conversationApi';

interface ConversationListData {
    list: any[];
    page: number;
    page_size: number;
    total_page: number;
    total_rows: number;
}

interface ConversationState {
    data: ConversationListData | null;
    currentConversation: any;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
}



export const fetchConversationList = createAsyncThunk(
    'conversation/fetchConversationList',
    async (params: { page: number, page_size: number }) => {
        const response = await getConversationList(params.page, params.page_size);
        return response.data?.data as ConversationListData;
    }
);

export const fetchSetCurrentConversation = createAsyncThunk(
    'conversation/setCurrentConversation',
    async (convId: number) => {
        const response = await setCurrentConversation(convId);
        return response.data?.data as ConversationListData;
    }
);

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        data: null as ConversationListData | null,
        status: 'idle',
        error: null,
        currentConversation: null as any,
    } as ConversationState,
    reducers: {
        setConversation: (state, action) => {
            state.data = action.payload;
        },
        clearConversation: (state) => {
            state.data = null;
        },
        setCurrentConversationData: (state, action) => {
            state.currentConversation = action.payload;
        },
    },
    extraReducers: (builder) => {
        // 统一处理所有异步请求的 pending 状态
        builder.addMatcher(
            (action) => action.type.endsWith('/pending'),
            (state) => {
                state.status = 'loading';
            }
        );

        // 统一处理所有异步请求的 fulfilled 状态
        builder.addMatcher(
            (action) => action.type.endsWith('/fulfilled'),
            (state, action: any) => {
                console.log('==action.payload==', action.payload);
                state.status = 'success';
                // 使用对象映射处理不同的 action
                const actionHandlers: Record<string, () => void> = {
                    'fetchConversationList': () => {
                        console.log('==处理获取列表==', action.payload);
                        state.data = action.payload;
                        if (action.payload.list && action.payload.list.length > 0) {
                            const firstConversation = action.payload.list[0];
                            state.currentConversation = firstConversation;
                        }
                    },
                    'fetchSetCurrentConversation': () => {
                        // 这个 action 不需要特殊处理，只更新状态
                    }
                };
                
                // 根据 action 名称执行对应的处理函数
                const actionName = Object.keys(actionHandlers).find(name => 
                    action.type.includes(name)
                );
                
                if (actionName && actionHandlers[actionName]) {
                    actionHandlers[actionName]();
                }
            }
        );

        // 统一处理所有异步请求的 rejected 状态
        builder.addMatcher(
            (action) => action.type.endsWith('/rejected'),
            (state) => {
                state.status = 'error';
            }
        );
    },
});

export const { setConversation, clearConversation, setCurrentConversationData } = conversationSlice.actions;
export default conversationSlice.reducer;