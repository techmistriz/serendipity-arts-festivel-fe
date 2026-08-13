import api from "./axios";

export const loginAPI = (data: { email: string; password: string }) => {
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

export const resetPasswordAPI = async (
  token: string,
  email: string,
  password: string,
  password_confirmation: string,
) => {
  const response = await api.post("/auth/reset-password", {
    token,
    email,
    password,
    password_confirmation,
  });

  return response.data;
};
