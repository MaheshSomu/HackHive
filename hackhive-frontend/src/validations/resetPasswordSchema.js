import { z } from "zod";

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(1, "New password is required")
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password cannot exceed 100 characters"),

        confirmPassword: z
            .string()
            .min(1, "Confirm password is required"),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
