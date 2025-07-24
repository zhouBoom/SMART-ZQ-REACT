import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
    messages: string[];
}

const initialState: ChatState = {
    messages: []
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
      addMessage(state, action: PayloadAction<string>) {
        state.messages.push(action.payload);
      },
      clearMessages(state) {
        state.messages = [];
      },
    },
  });
  
  export const { addMessage, clearMessages } = chatSlice.actions;
  export default chatSlice.reducer;