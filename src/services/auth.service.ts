import api from "../lib/axios";

export const loginAPI = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/auth/login", data);
};

export const logoutAPI = () => {
  return api.post("/auth/logout");
};

export const forgotPasswordAPI = (email: string) => {
   console.log("Calling forgot password API with:", email);
  return api.post("/auth/forgot-password", {
    email,
  });
};