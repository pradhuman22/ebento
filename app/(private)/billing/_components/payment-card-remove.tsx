"use client";
import { useTransition } from "react";
import { removePaymentMethod } from "../lib/paymentRepository";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconLoader2, IconTrash } from "@tabler/icons-react";

type PaymentCardRemoveProps = {
  stripeCustomerId: string;
  paymentMethodId: string;
};

const PaymentCardRemove = ({
  stripeCustomerId,
  paymentMethodId,
}: PaymentCardRemoveProps) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleRemove = () => {
    startTransition(async () => {
      await removePaymentMethod(stripeCustomerId, paymentMethodId);
      router.refresh(); // re-run server component, list updates
    });
  };
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={handleRemove}
      className="cursor-pointer"
    >
      {pending ? (
        <IconLoader2 className="animate-spin" />
      ) : (
        <IconTrash className="text-red-500" />
      )}
    </Button>
  );
};

export default PaymentCardRemove;
