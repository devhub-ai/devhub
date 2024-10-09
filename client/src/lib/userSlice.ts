import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string | null;
  friends: string[];
  friendStatus: { [key: string]: boolean };
}

const initialState: UserState = {
  username: null,
  friends: [],
  friendStatus: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
    },
    setUsername(state, action: PayloadAction<string | null>) {
      state.username = action.payload;
    },
    setFriends(state, action: PayloadAction<string[]>) {
      state.friends = action.payload;
    },
    setFriendStatus(state, action: PayloadAction<{ username: string; isFriend: boolean }>) {
      state.friendStatus[action.payload.username] = action.payload.isFriend;
    },
  },
});

export const { setUser, setUsername, setFriends, setFriendStatus } = userSlice.actions;
export default userSlice.reducer;
export type { UserState };