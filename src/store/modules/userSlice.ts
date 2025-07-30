import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthApi } from '@/api/getAuthApi';

// 类似Vuex的异步action
export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async () => {
        console.log('fetchUserInfo');
        const response = await getAuthApi();
        return response.data;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload;
        },
        clearUser: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                console.log('第一步', state);
                state.status = 'loading';
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                console.log('第二步', state);
                state.data = action.payload;
                state.status = 'success';
            })
            .addCase(fetchUserInfo.rejected, (state) => {
                console.log('第三步', state);
                state.status = 'error';
            });
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;