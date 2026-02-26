"use client";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../schema";
import { useState, useTransition } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type FORMDATA = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const [pending, startTranstion] = useTransition();
  const [displayPassword, setDisplayPassword] = useState(false);
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);
  const form = useForm<FORMDATA>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = ({ password }: FORMDATA) => {
    startTranstion(async () => {
      await authClient.resetPassword(
        {
          newPassword: password,
          token: token,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successful.");
            router.push("/signin");
          },
          onError: async (ctx) => {
            toast.error(`${ctx.error.message ?? "Something went wrong"}`);
          },
        }
      );
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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
        {/* confirm password */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="confirmPassword"
                className="text-foreground text-sm font-medium"
              >
                Confirm Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="******"
                  type={displayConfirmPassword ? "text" : "password"}
                  className="placeholder:text-sm"
                  disabled={pending}
                />
                <InputGroupAddon
                  align={"inline-end"}
                  className="cursor-pointer"
                  onClick={() =>
                    setDisplayConfirmPassword(!displayConfirmPassword)
                  }
                >
                  {displayConfirmPassword ? <IconEyeOff /> : <IconEye />}
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" className="cursor-pointer text-sm">
            {pending && <IconLoader2 className="animate-spin" />} Reset Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default ResetPasswordForm;
