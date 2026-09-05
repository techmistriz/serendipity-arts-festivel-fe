export const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
export const getInitials = (firstName = "", lastName = "") =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
