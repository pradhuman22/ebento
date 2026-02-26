"use client";
import z from "zod";
import { contactSchema } from "../schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IconLoader2, IconPhone } from "@tabler/icons-react";

type FORMDATA = z.infer<typeof contactSchema>;
const UpdateContactForm = ({
  contact,
}: {
  contact: string | null | undefined;
}) => {
  const [pending, startTransition] = useTransition();
  const form = useForm<FORMDATA>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contact: contact || "",
    },
  });
  const onSubmit = ({ contact }: FORMDATA) => {
    startTransition(async () => {
      await authClient.updateUser(
        {
          contact,
        },
        {
          onSuccess: () => {
            toast.success("Contact updated successfully");
          },
          onError: () => {
            toast.error("Failed to update contact");
          },
        }
      );
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl">
      <FieldGroup>
        <Controller
          name="contact"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation={"horizontal"}>
              <Input
                placeholder="+81 07034567890"
                {...field}
                className="text-lg placeholder:text-base"
                disabled={pending}
              />
            </Field>
          )}
        />
        <Field orientation={"horizontal"}>
          <Button
            type="submit"
            className="cursor-pointer text-sm"
            disabled={pending}
          >
            {pending && <IconLoader2 className="animate-spin" />} <IconPhone />{" "}
            Update Contact
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default UpdateContactForm;
