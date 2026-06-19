import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email("Invalid Email Address - Custom Message").min(3).max(100),
  password: z.string().min(8),
});
