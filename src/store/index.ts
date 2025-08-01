import {configureStore, combineReducers} from '@reduxjs/toolkit';
import chatReducer from './modules/chatSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import userReducer from './modules/userSlice';
import conversationReducer from './modules/conversationSlice';

const rootReducer = combineReducers({
    chat: chatReducer,
    user: userReducer,
    conversation: conversationReducer,
    // 其他 slice
});

const persistConfig = {
    key: 'root',
    storage,
    whiteList: ['chat', 'user']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;