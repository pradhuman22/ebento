"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { IconLoader2 } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PlanButton = ({
  action,
  title,
  refId,
  subId,
}: {
  action: string;
  title: string;
  refId?: string;
  subId?: string;
}) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const handleClick = () => {
    startTransition(async () => {
      switch (action) {
        case "upgrade": {
          await authClient.subscription.upgrade(
            {
              plan: "pro",
              successUrl: "/billing",
              cancelUrl: "/billing",
            },
            {
              onError: (ctx) => {
                toast.error(`${ctx.error.message || "Something went wrong."}`);
              },
            }
          );
          break;
        }
        case "cancel": {
          await authClient.subscription.cancel(
            {
              referenceId: refId,
              customerType: "user",
              subscriptionId: subId,
              returnUrl: "/billing",
            },

            {
              onError: (ctx) => {
                toast.error(ctx.error.message);
              },
            }
          );
          break;
        }
        case "restore": {
          await authClient.subscription.restore(
            {
              referenceId: refId,
              subscriptionId: subId,
            },
            {
              onSuccess: () => {
                router.refresh();
              },
              onError: (ctx) => {
                toast.error(`${ctx.error.message || "Something went wrong."}`);
              },
            }
          );
          break;
        }
        default: {
          break;
        }
      }
    });
  };
  return (
    <Button
      size={"lg"}
      onClick={handleClick}
      disabled={pending}
      className="cursor-pointer text-sm"
    >
      {pending && <IconLoader2 className="animate-spin" />}
      {title}
    </Button>
  );
};

export default PlanButton;
