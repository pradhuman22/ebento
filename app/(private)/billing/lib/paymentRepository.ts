"use server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

export async function listPaymentMethod(stripeCustomerId: string) {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });
    const cards = paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand ?? "",
      last4: pm.card?.last4 ?? "",
      expMonth: pm.card?.exp_month ?? 0,
      expYear: pm.card?.exp_year ?? 0,
    }));
    return { cards, error: null };
  } catch (err) {
    console.error("listSavedCards error:", err);
    return {
      cards: [],
      error: err instanceof Error ? err.message : "Failed to list cards",
    };
  }
}

export async function addPaymentMethod(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true, name: true },
    });
    if (!user) {
      return { clientSecret: null, error: "User not found" };
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });
    const clientSecret = setupIntent.client_secret ?? null;
    if (!clientSecret) {
      return { clientSecret: null, error: "Failed to create Setup Intent" };
    }
    return { clientSecret, error: null };
  } catch (err) {
    console.error("createSetupIntent error:", err);
    return {
      clientSecret: null,
      error:
        err instanceof Error ? err.message : "Failed to create Setup Intent",
    };
  }
}

export async function removePaymentMethod(
  stripeCustomerId: string,
  paymentMethodId: string
) {
  try {
    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
    const customerId =
      typeof pm.customer === "string" ? pm.customer : (pm.customer?.id ?? null);
    if (customerId !== stripeCustomerId) {
      return {
        success: false,
        error: "Payment method does not belong to this customer",
      };
    }
    await stripe.paymentMethods.detach(paymentMethodId);
    revalidatePath("/billing");
    return { success: true, error: null };
  } catch (err) {
    console.error("removeSavedCard error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to remove card",
    };
  }
}

export async function getPrivatePaymentHistory(customerId: string) {
  if (!customerId) return [];
  try {
    const response = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 10,
      expand: ["data.latest_charge"],
    });
    return response.data.map((intent) => {
      const charge = intent.latest_charge as Stripe.Charge;
      let displayStatus = intent.status;
      // Use type assertion to satisfy type checker, as "refunded" and "partially refunded" may not be in Status union.
      if (charge?.refunded) {
        displayStatus = "refunded" as typeof intent.status;
      } else if (charge?.amount_refunded > 0) {
        displayStatus = "partially refunded" as typeof intent.status;
      }
      return {
        id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        status: displayStatus,
        created: intent.created,
      };
    });
  } catch (error) {
    console.error(
      `[STRIPE_ERROR]: Failed to fetch history for ${customerId}`,
      error
    );
    return [];
  }
}
