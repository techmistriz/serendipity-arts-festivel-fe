import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/redux/slices/authSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
});
