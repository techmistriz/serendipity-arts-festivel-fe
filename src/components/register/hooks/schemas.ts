import { z } from "zod";

export const ROLE_IDS = {
    general: 3,
    guest: 5,
    sea: 9,
};

// Define schemas for each mode with std_code added
export const baseSchema = {
    email: z.string().min(1, "Email is required").email("Invalid email"),
    fullName: z.string().min(3, "Full name is required"),
    std_code: z.string().default("91"),
    terms: z.literal(true, {
        errorMap: () => ({ message: "Accept Terms & Conditions" }),
    }),
};

export const generalSchema = z.object({
    ...baseSchema,
    gender: z.string().optional(),
    age: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    whatsapp: z.string().optional(),
    otp: z.string().optional(),
    newsletter: z.boolean().optional(),
    heard: z.string().optional(),
    interests: z.array(z.string()).optional(),
    visitedYears: z.array(z.string()).optional(),
});

export const seaSchema = z.object({
    ...baseSchema,
    gender: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    whatsapp: z.string().min(10, "Valid WhatsApp number is required"),
    otp: z.string().min(4, "OTP is required"),
    newsletter: z.boolean().optional(),
});

export const guestSchema = z.object({
    ...baseSchema,
    contact: z.string().min(10, "Contact number is required"),
    dates: z.array(z.string()).min(1, "Select at least one date"),
    travel: z.string().min(1, "Please select an option"),
    lodging: z.string().min(1, "Please select an option"),
    accom: z.string().min(1, "Please select an option"),
    accompanied: z.string().min(1, "Please select an option"),
    accompaniedPersons: z.string().optional(),
    additionalRequests: z.string().optional(),
});

export type GeneralFormData = z.infer<typeof generalSchema>;
export type SEAFormData = z.infer<typeof seaSchema>;
export type GuestFormData = z.infer<typeof guestSchema>;