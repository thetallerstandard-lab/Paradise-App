import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters")
  .max(128, "Use at most 128 characters");

export const signUpInputSchema = z.object({
  displayName: z.string().trim().min(1, "Enter your name").max(120),
  email: emailSchema,
  password: passwordSchema,
});

export const signInInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export const forgotPasswordInputSchema = z.object({
  email: emailSchema,
});

/**
 * Email confirmation code. The project sends 8 digits (Supabase "Email OTP
 * length"); accept 6–10 so changing that setting does not break the form.
 * Spaces and dashes users paste from the email are stripped.
 */
export const verificationCodeSchema = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^\d{6,10}$/, "Enter the code from your email"));

export const verifyEmailInputSchema = z.object({
  email: emailSchema,
  code: verificationCodeSchema,
});

export const resendCodeInputSchema = z.object({
  email: emailSchema,
});

export const resetPasswordInputSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type SignInInput = z.infer<typeof signInInputSchema>;
