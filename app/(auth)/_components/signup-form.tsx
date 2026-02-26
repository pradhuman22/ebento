"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpScehma } from "../schema";
import { useState, useTransition } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FORMDATA = z.infer<typeof signUpScehma>;

const SignUpForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [displayPassword, setDisplayPassword] = useState(false);
  const form = useForm<FORMDATA>({
    resolver: zodResolver(signUpScehma),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = ({ name, email, password }: FORMDATA) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          name,
          email,
          password,
        },
        {
          onSuccess: () => {
            toast.success(
              "Your account has been created. Check your email for a verification link."
            );
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(`${ctx.error.message ?? "Something went wrong"}`);
          },
        }
      );
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="name"
                className="text-foreground text-sm font-medium"
              >
                Full Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg: Hari Bahadur Shrestha"
                className="placeholder:text-sm"
                disabled={pending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg: hari@example.com"
                className="placeholder:text-sm"
                disabled={pending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="password"
                className="text-foreground text-sm font-medium"
              >
                Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="******"
                  type={displayPassword ? "text" : "password"}
                  className="placeholder:text-sm"
                  disabled={pending}
                />
                <InputGroupAddon
                  align={"inline-end"}
                  className="cursor-pointer"
                  onClick={() => setDisplayPassword(!displayPassword)}
                >
                  {displayPassword ? <IconEyeOff /> : <IconEye />}
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            className="cursor-pointer text-sm"
            disabled={pending}
          >
            {pending && <IconLoader2 className="animate-spin" />}
            Sign Up
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default SignUpForm;
