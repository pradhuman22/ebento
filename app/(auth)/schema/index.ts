import * as z from "zod";

export const signUpScehma = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required." })
    .min(3, { message: " Name must be atleast 2 characters or more." })
    .trim(),
  email: z.email({
    error: (issue) =>
      issue.input == "" ? "Email is required." : "Invalid email.",
  }),
  password: z
    .string()
    .nonempty({ message: "Password is required." })
    .min(6, { message: "Password must be atleast 6 characters or more." }),
});

export const signInSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input == "" ? "Email is required." : "Invalid email.",
  }),
  password: z
    .string()
    .nonempty({ message: "Password is required." })
    .min(6, { message: "Password must be atleast 6 characters or more." }),
});
