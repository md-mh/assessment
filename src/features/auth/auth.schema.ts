import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email or user ID is required")
    .min(3, "Must be at least 3 characters")
    .test(
      "email-or-user-id",
      "Enter a valid email or user ID",
      (value) => {
        if (!value) return false;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const idOk = /^[a-zA-Z0-9._@-]{3,}$/.test(value);
        return emailOk || idOk;
      },
    ),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const registrationSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  role: yup
    .string()
    .required("Select your role")
    .oneOf(["employer", "candidate"], "Select how you will use the platform"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export type RegistrationFormValues = yup.InferType<typeof registrationSchema>;
