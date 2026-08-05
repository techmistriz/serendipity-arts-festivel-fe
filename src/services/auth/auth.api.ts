import api from "@/src/lib/axios";
import { RegisterPayload } from "./auth.types";

export const registerVisitor = async (
  payload: Omit<RegisterPayload, "role_id">
) => {
  const response = await api.post("/auth/register", {
    ...payload,
    role_id: 3, // Hidden field
  });

  return response.data;
};