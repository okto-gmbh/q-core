import { z } from 'zod'

const email = z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim())

const password = z
    .string()
    .min(6)
    .max(100)
    .transform((str) => str.trim())

export const Signup = z.object({
    email,
    password,
})

export const Login = z.object({
    email,
    password: z.string(),
})

export const ForgotPassword = z.object({
    email,
})

export const RenewPassword = z.object({
    password,
    token: z.string(),
    userId: z.string(),
})
