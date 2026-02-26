import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PlanButton from "./_components/plan-button";
import PaymentHistory from "./_components/payment-history";
import PaymentCardList from "./_components/payment-card-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import PaymentCardAdd from "./_components/payment-card-add";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BillingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) {
    redirect("/signin");
  }
  /** get current user subscription list */
  const subscriptions = await auth.api.listActiveSubscriptions({
    query: {
      referenceId: session.user.id,
    },
    headers: await headers(),
  });
  const activeSubcription = subscriptions.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="grid gap-8 py-8">
        <div>
          <h1 className="text-xl font-medium">Payment Methods</h1>
          <p className="text-muted-foreground text-sm">
            You saved payment methods are encrypted and stored securely by
            Stripe.
          </p>
        </div>
        <div>
          {/* card list */}
          {session.user.stripeCustomerId && (
            <PaymentCardList id={session?.user.stripeCustomerId} />
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer text-sm">
              <IconPlus /> Add Card
            </Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Add Card
              </DialogTitle>
              <DialogDescription className="text-sm">
                Add a card to quick payment. Your information is encrypted and
                securely processed by Stripe.
              </DialogDescription>
            </DialogHeader>
            <PaymentCardAdd id={session.user.id} />
          </DialogContent>
        </Dialog>

        <Separator />
        <div>
          <h1 className="text-xl font-medium">Subscription</h1>
          <p className="text-muted-foreground text-sm">
            Manage your current subscription plan and billing details.
          </p>
        </div>
        {activeSubcription ? (
          activeSubcription.cancelAt ? (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm font-semibold">
                Your pro plans ends at{" "}
                {activeSubcription.cancelAt.toLocaleDateString()}
              </div>
              <PlanButton
                title={"Restore Pro Plan Subscription"}
                action="restore"
                refId={session.user.id}
                subId={activeSubcription.stripeSubscriptionId}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm font-semibold">
                Your pro plans ends at{" "}
                {activeSubcription.periodEnd?.toLocaleDateString()}
              </div>
              <PlanButton
                title={"Cancel Pro Plan Subscription"}
                action="cancel"
                refId={session.user.id}
                subId={activeSubcription.stripeSubscriptionId}
              />
            </div>
          )
        ) : (
          <PlanButton title={"Upgrade To Pro Plan"} action="upgrade" />
        )}
        <Separator />
        <div>
          <h1 className="text-xl font-medium">Payment History</h1>
          <p className="text-muted-foreground text-sm">
            View your past invoices and payment activity.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="h-64 w-full animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <PaymentHistory id={session?.user.stripeCustomerId} />
        </Suspense>
      </div>
    </div>
  );
};

export default BillingPage;
