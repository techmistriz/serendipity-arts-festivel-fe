import { z } from "zod";

export const ROLE_IDS = {
  general: 3,
  guest: 5,
  sea: 9,
};

export const baseSchema = {
  email: z.string().min(1, "Email is required").email("Invalid email"),
  fullName: z.string().min(3, "Full name is required"),
  gender: z.string().min(1, "Please select your gender"),
  std_code: z.string().default("91"),
  terms: z.literal(true, {
    message: "Accept Terms & Conditions",
  }),
};

export const generalSchema = z
  .object({
    ...baseSchema,

    gender: z.string().min(1, "Gender is required"),
    age: z.string().min(1, "Age is required"),

    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    custom_city: z.string().trim().optional(),

    whatsapp: z
      .string()
      .trim()
      .min(1, "WhatsApp number is required")
      .regex(/^\d{10,15}$/, "Enter a valid WhatsApp number"),

    otp: z
      .string()
      .trim()
      .regex(/^\d{4,6}$/, "Enter a valid OTP"),

    newsletter: z.boolean().optional(),
    heard: z.string().min(1, "Please select how you heard about us"),
    interests: z.array(z.string()).min(1, "Select at least one interest"),
    visitedYears: z.array(z.string()).min(1, "Select at least one previous visit year"),
  })
  .superRefine((data, ctx) => {
    if (data.city === "-1" && !data.custom_city?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["custom_city"],
        message: "City name is required",
      });
    }
  });

export const seaSchema = z
  .object({
    ...baseSchema,

    gender: z.string().optional(),

    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    custom_city: z.string().trim().optional(),

    whatsapp: z
      .string()
      .trim()
      .min(1, "WhatsApp number is required")
      .regex(/^\d{10,15}$/, "Enter a valid WhatsApp number"),

    otp: z
      .string()
      .trim()
      .regex(/^\d{4,6}$/, "Enter a valid OTP"),

    newsletter: z.boolean().optional(),
    std_code: z.string().default("91"),
  })
  .superRefine((data, ctx) => {
    if (data.city === "-1" && !data.custom_city?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["custom_city"],
        message: "City name is required",
      });
    }
  });

export const guestSchema = z.object({
  ...baseSchema,

  contact: z
    .string()
    .trim()
    .min(1, "Contact number is required")
    .regex(/^\d{10,15}$/, "Enter a valid contact number"),

  dates: z.array(z.string()).min(1, "Select at least one date"),
  travel: z.string().min(1, "Please select an option"),
  lodging: z.string().min(1, "Please select an option"),
  accom: z.string().min(1, "Please select an option"),
  accompanied: z.string().min(1, "Please select an option"),

  accompaniedPersons: z.string().optional(),
  additionalRequests: z.string().optional(),
  newsletter: z.boolean().optional(),
});

export type GeneralFormData = z.infer<typeof generalSchema>;
export type SEAFormData = z.infer<typeof seaSchema>;
export type GuestFormData = z.infer<typeof guestSchema>;
