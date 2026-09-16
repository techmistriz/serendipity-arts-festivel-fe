export type NotifyMeData = {
  program_id: number;
  user_id: number;
  name: string;
  email: string;
  contact: string;
  status: number;
  updated_at: string;
  created_at: string;
  id: number;
};

export type NotifyMePayload = {
  name: string;
  email: string;
  contact: string;
  user_id?: string | number | "";
  program_id: string | number;
};
