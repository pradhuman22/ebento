"use client";
import React, { useEffect, useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { addPaymentMethod } from "../lib/paymentRepository";

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHED_KEY || "";

if (!stripePublicKey) {
  throw new Error(
    "Stripe publishable key is not set. Please set NEXT_PUBLIC_STRIPE_PUBLISHED_KEY in your environment."
  );
}

const stripePromise = loadStripe(stripePublicKey);

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: {
      color: "#9e21146",
    },
  },
};

const PaymentCardAddForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    setError(null);
    setPending(true);

    // Use SetupIntent client_secret to save the card
    const { error: confirmError } = await stripe.confirmCardSetup(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    setPending(false);

    if (confirmError) {
      setError(confirmError.message ?? "Something went wrong.");
    } else {
      // e.g. refresh or redirect
      window.location.href = "/billing";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Card Number</label>
        <div className="rounded-md border bg-white p-3">
          <CardNumberElement options={ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Expiry</label>
          <div className="rounded-md border bg-white p-3">
            <CardExpiryElement options={ELEMENT_OPTIONS} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">CVC</label>
          <div className="rounded-md border bg-white p-3">
            <CardCvcElement options={ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Saving…" : "Save Card"}
      </Button>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
};

const PaymentCardAdd = ({ id }: { id: string }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    addPaymentMethod(id).then((res) => {
      if (res.error) {
        setError(res.error);
        setClientSecret(null);
      } else {
        setClientSecret(res.clientSecret ?? null);
      }
    });
  }, [id]);

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }
  if (!clientSecret) {
    return (
      <p className="text-muted-foreground text-sm">Loading secure form...</p>
    );
  }
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentCardAddForm clientSecret={clientSecret} />
    </Elements>
  );
};

export default PaymentCardAdd;
