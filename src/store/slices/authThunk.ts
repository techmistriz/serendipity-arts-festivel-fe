import { AppDispatch } from "../store";
import {
  loginSuccess,
  logout,
  setLoading,
} from "./auth/authSlice";

import {
  loginAPI,
  logoutAPI,
} from "@/src/services/auth.service";

export const login =
  (email: string, password: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      const response = await loginAPI({
        email,
        password,
      });

      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(
        loginSuccess({
          user,
          token,
        })
      );

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  
export const logoutUser =
  () => async (dispatch: AppDispatch) => {
    try {
      await logoutAPI();
    } catch {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());
  };