import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConversationList } from '@/api/conversationApi';

interface ConversationListData {
    list: any[];
    page: number;
    page_size: number;
    total_page: number;
    total_rows: number;
}

interface ConversationState {
    data: ConversationListData | null;
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

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        data: null as ConversationListData | null,
        status: 'idle',
        error: null,
    } as ConversationState,
    reducers: {
        setConversation: (state, action) => {
            state.data = action.payload;
        },
        clearConversation: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversationList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchConversationList.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'success';
            })
            .addCase(fetchConversationList.rejected, (state) => {
                state.status = 'error';
            });
    },
});

export const { setConversation, clearConversation } = conversationSlice.actions;
export default conversationSlice.reducer;