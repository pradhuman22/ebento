"use client";
import React, { useTransition } from "react";
import z from "zod";
import { profileSchema } from "../schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { uploadImageToCloudinaryAction } from "@/lib/upload";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { IconArrowUp, IconLoader2, IconUserCheck } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FORMDATA = z.infer<typeof profileSchema>;
const ProfileUpdateForm = ({ user }: { user: Session["user"] }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<FORMDATA>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      bio: user.bio || "",
    },
  });
  const onSubmit = ({ image, name, bio }: FORMDATA) => {
    startTransition(async () => {
      await authClient.updateUser(
        {
          image,
          name,
          bio,
        },
        {
          onError: () => {
            toast.error("Failed to update profile");
          },
          onSuccess: () => {
            toast.success("Updated successfully");
            router.refresh();
          },
        }
      );
    });
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const url = await uploadImageToCloudinaryAction("users", formData);
    if (url) {
      form.setValue("image", url as string, { shouldDirty: true });
    } else {
      toast.error("Something went wrong", {
        style: { color: "red" },
      });
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-between gap-20 md:flex-row">
        <div className="order-2 flex-3/4 space-y-4">
          <FieldGroup>
            {/* name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name" className="text-base">
                    Name
                  </FieldLabel>
                  <Input
                    placeholder="Enter your name or nickname."
                    {...field}
                    className="text-lg placeholder:text-base"
                    disabled={pending}
                  />
                </Field>
              )}
            />
            {/* bio */}
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bio" className="text-base">
                    Bio
                  </FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Write something that describes you."
                    className="h-40 text-lg placeholder:text-base"
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
                {pending ? (
                  <IconLoader2 className="animate-spin" />
                ) : (
                  <IconUserCheck />
                )}
                Save Changes
              </Button>
            </Field>
          </FieldGroup>
        </div>
        <div className="order-1 flex-1/4 md:order-2">
          <FieldGroup>
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="relative mx-auto flex max-w-40 cursor-pointer items-center justify-center rounded-full border"
                  >
                    <Avatar className="h-40 w-40">
                      {field.value && (
                        <AvatarImage
                          src={field.value}
                          alt={form.getValues("name")}
                        />
                      )}
                      <AvatarFallback className="text-2xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                      <AvatarBadge className="right-0 bottom-2 group-data-[size=default]/avatar:size-10 group-data-[size=default]/avatar:[&>svg]:size-6">
                        <IconArrowUp />
                      </AvatarBadge>
                    </Avatar>
                  </FieldLabel>

                  <Input
                    id={field.name}
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;
