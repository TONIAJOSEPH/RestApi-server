import { z } from "zod";

export const createSessionSchema = z.object({
  body: z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  }),
});
