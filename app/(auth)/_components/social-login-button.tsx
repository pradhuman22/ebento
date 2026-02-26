"use client";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { IconBrandGoogleFilled, IconLoader2 } from "@tabler/icons-react";

const SocialLoginContent = () => {
  const searchParams = useSearchParams();
  const [isPending, setPending] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl");
  const handleSocialLogin = async () => {
    setPending(false);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl || "/dashboard",
      errorCallbackURL: "/signin",
    });
    setPending(false);
  };
  useEffect(() => {
    if (searchParams.get("error") === "account_not_linked") {
      toast.error("Email already register to other provider", {
        style: { color: "red" },
      });
    }
  }, [searchParams]);

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size={"lg"}
        className="w-full cursor-pointer text-sm"
        variant={"outline"}
        onClick={handleSocialLogin}
        disabled={isPending}
      >
        {isPending && <IconLoader2 className="animate-spin" />}
        <IconBrandGoogleFilled />
        Google
      </Button>
    </div>
  );
};

export default function SocialLoginButton() {
  return (
    <Suspense>
      <SocialLoginContent />
    </Suspense>
  );
}
