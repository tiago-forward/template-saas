import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      setStripe(stripeInstance);
    }

    loadStripeAsync();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function createPaymentStripeCheckout(checkoutData: any) {
    if (!stripe) {
      throw new Error("Stripe not loaded");
    }

    try {
      const response = await fetch("/api/stripe/create-pay-checkout", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new Error("Failed to create checkout session");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function createSubscriptionStripeCheckout(checkoutData: any) {
    if (!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-subscription-checkout", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Error creating subscription checkout session:", error);
      throw new Error("Failed to create subscription checkout session");
    }
  }

  async function handleCreateStripePortal(p0: { testeId: string; }) {
    const response = await fetch("/api/stripe/create-portal", {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
    });

    const data = await response.json();

    window.location.href = data.url;
  }

  return {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  };
}
