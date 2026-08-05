import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email"),

  fullName: z
    .string()
    .min(3, "Full name is required"),

  gender: z.string().optional(),

  age: z.string().optional(),

  country: z.string().optional(),

  state: z.string().optional(),

  city: z.string().optional(),

  whatsapp: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[0-9]{10}$/.test(value),
      {
        message: "Enter valid WhatsApp number",
      }
    ),

  otp: z.string().optional(),

  terms: z.literal(true, {
    errorMap: () => ({
      message: "Accept Terms & Conditions",
    }),
  }),

  newsletter: z.boolean().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;