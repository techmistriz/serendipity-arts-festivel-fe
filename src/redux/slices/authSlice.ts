import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthSession, AuthState } from "@/types/auth";

const initialState: AuthState = {
  session: null,
  user: null,
  accessToken: null,
  loading: true,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.session = action.payload;
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.isAuthenticated = Boolean(action.payload.token);
      state.loading = false;
    },
    clearSession: (state) => {
      state.session = null;
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { clearSession, setAuthLoading, setSession } = authSlice.actions;

export default authSlice.reducer;
