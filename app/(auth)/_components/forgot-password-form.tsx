"use client";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schema";
import { useTransition } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";

type FORMDATA = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [pending, startTransition] = useTransition();
  const form = useForm<FORMDATA>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = ({ email }: FORMDATA) => {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          email: email,
          redirectTo: "/reset-password",
        },
        {
          onSuccess: () => {
            toast.success(`Reset link sent to ${email}.`);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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
                disabled={pending}
              />
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
            {pending && <IconLoader2 className="animate-spin" />} Send Reset
            Email
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default ForgotPasswordForm;
