import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthSession, AuthState } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearSession: (state) => {
      state.user = null;
      state.token = null;
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
