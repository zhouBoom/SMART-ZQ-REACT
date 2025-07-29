import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
    messages: string[];
    loading: boolean;
    error: string | null;
}

// 异步获取消息列表
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (chatId: string) => {
      const res = await fetch(`/api/chat/${chatId}/messages`);
      return (await res.json()) as string[];
    }
  );

const initialState: ChatState = {
    messages: [],
    loading: false,
    error: null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // 同步reducers
      addMessage(state, action: PayloadAction<string>) {
        state.messages.push(action.payload);
      },
      clearMessages(state) {
        state.messages = [];
      },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMessages.pending, state => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<string[]>) => {
            state.loading = false;
            state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || '请求失败';
            });
        }
  });
  
  export const { addMessage, clearMessages } = chatSlice.actions;
  export default chatSlice.reducer;