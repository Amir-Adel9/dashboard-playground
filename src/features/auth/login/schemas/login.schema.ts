import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
})

export const otpViewSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 characters long.'),
})
