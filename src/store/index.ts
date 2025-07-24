import {configureStore} from '@reduxjs/toolkit';
import chatReducer from './modules/chatSlice';

const store = configureStore({
    reducer: {
        chat: chatReducer
        // 这里可以继续添加其他模块
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;