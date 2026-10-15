import {z} from 'zod'

export const signinSchema = z.object({
    email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

    password: z
    .string()
    .min(1, 'Password is required')
})

export const signupSchema = z.object({
    name: z
    .string()
    .trim()
    .min(1, 'Please enter your name'),

    email: z
    .string()
    .trim()
    .email('Enter a valid email address'),

    password: z
    .string()
    .min(6, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%?&]/, 'Password must contain a special character'),

    confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')

})

.refine(data => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ['confirmPassword']
})

export type SigninForm = z.infer<typeof signinSchema>;
export type SignupForm = z.infer<typeof signupSchema>;