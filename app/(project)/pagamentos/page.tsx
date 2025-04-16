"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Pagamentos() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe();

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-10">Pagamentos</h1>

      <button
        type="submit"
        className="border rounded-md px-2 cursor-pointer"
        onClick={() =>
          createPaymentStripeCheckout({
            testeId: "123",
          })
        }
      >
        Criar Pagamento Stripe
      </button>
      <button
        type="submit"
        className="border rounded-md px-2 cursor-pointer"
        onClick={() =>
          createSubscriptionStripeCheckout({
            testeId: "123",
          })
        }
      >
        Criar Assinatura Stripe
      </button>
      <button
        type="submit"
        className="border rounded-md px-2 cursor-pointer"
        onClick={() =>
          handleCreateStripePortal({
            testeId: "123",
          })
        }
      >
        Criar Portal de Pagamentos
      </button>
    </div>
  );
}
