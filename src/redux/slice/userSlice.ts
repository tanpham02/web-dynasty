import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { Users } from '~/models/user';
import userService from '~/services/userService';

type initialStateType = {
  user: Users;
};

const initialState: initialStateType = {
  user: {},
};

export const signOut = createAsyncThunk('user/signOut', async () => {
  try {
    await authService.signOut();
  } catch (error) {
    console.log(error);
  }
});

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (userId: string, { dispatch }) => {
    try {
      const userRes = await userService.getUserByUserId(userId);
      dispatch(setUserInfo(userRes));
    } catch (error) {
      console.log('Error when login zalo', error);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
  },
});

const { reducer, actions } = userSlice;

export const { setUserInfo } = actions;

export default reducer;
