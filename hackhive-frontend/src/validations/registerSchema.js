import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .max(100, "Full name cannot exceed 100 characters"),

    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email"),

    phoneNumber: z
        .string()
        .trim()
        .max(15, "Phone number cannot exceed 15 characters")
        .optional()
        .or(z.literal("")),

    role: z.enum(["STUDENT", "ORGANIZER"], {
        message: "Please select a role",
    }),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters"),

    confirmPassword: z
        .string()
        .min(1, "Please confirm your password"),
}).refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
