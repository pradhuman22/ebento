"use client";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "../schema";
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
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type FORMDATA = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [pending, startTransition] = useTransition();
  const [displayPassword, setDisplayPassword] = useState(false);
  const form = useForm<FORMDATA>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = ({ email, password }: FORMDATA) => {
    startTransition(async () => {
      await authClient.signIn.email(
        { email, password },
        {
          onSuccess: () => {
            router.push(callbackUrl || "/dashboard");
            router.refresh();
          },
          onError: async (ctx) => {
            if (ctx.error.status === 403) {
              await authClient.sendVerificationEmail({
                email,
                callbackURL: callbackUrl || "/dashboard",
              });
              toast.error(
                `Verification email has been send. Please verify your email.`
              );
            } else {
              toast.error(`${ctx.error.message ?? "Something went wrong."}`);
            }
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
        {/* password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="text-foreground flex items-center">
                <FieldLabel htmlFor="password" className="text-sm font-medium">
                  Password
                </FieldLabel>
                <Link
                  href={"/forgot-password"}
                  className="ml-auto text-xs underline-offset-4"
                >
                  Forgot your password?
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="******"
                  type={displayPassword ? "text" : "password"}
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
            Sign In
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default SignInForm;
