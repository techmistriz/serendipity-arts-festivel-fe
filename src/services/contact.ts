import api from "@/lib/api-client";

export const contactUsAPI = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const response = await api.post("/contact-us", data);

  return response.data;
};
