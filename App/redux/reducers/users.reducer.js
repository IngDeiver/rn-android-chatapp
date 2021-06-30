import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers } from '../../services/api.service';
import { show } from '../../utils/toast';

const initialState = {
    data: null,
    refreshing: false
}

export const fetchUsersThunk = createAsyncThunk('users/fetch', async (userId, _) => {

    const response = await getUsers()
     return response.data.users.map(user => ({...user, unreadMessages: 0})).filter(user => user._id !== userId)
})

const usersSlice = createSlice({
    name: 'users/fetch',
    initialState,
    reducers:{
        updateCounterUnreadMsg(state, action){
            const user = state.data?.find(user => user._id == action.payload.userId)
            if(user) user.unreadMessages = user.unreadMessages +1
            return state
        },
        resetCounterUnreadMsg(state, action){
            const user = state.data?.find(user => user._id == action.payload.userId)
            if(user) user.unreadMessages = 0
            return state
        }
    },
    extraReducers:{
        [fetchUsersThunk.pending]: (state, ) => {
            return {
                ...state,
                refreshing: true
            }
        },
        [fetchUsersThunk.fulfilled]: (_, action) => {
            return {
                data: action.payload,
                refreshing: false
            }
        },
        [fetchUsersThunk.rejected]: (state, action) => {
            show('error', 'Login error', action.error.message);
            return  {
                ...state,
                refreshing: false
            }
        }
        
    }
})
export const { updateCounterUnreadMsg, resetCounterUnreadMsg } = usersSlice.actions
export default  usersSlice.reducer