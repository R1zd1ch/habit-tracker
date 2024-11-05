import { z } from 'zod';

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name is too long' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Email is invalid' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    passwordConfirm: z.string().min(1, { message: 'Password confirmation is required' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });
