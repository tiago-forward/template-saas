import { useRouter } from "next/navigation";

export function useMercadoPago() {
  const router = useRouter();

  async function createMercadoPagoCheckout({
    testeId,
    userEmail,
  }: {
    testeId: string;
    userEmail: string;
  }) {
    try {
      const response = await fetch("api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testeId,
          userEmail,
        }),
      });

      const data = await response.json();

      router.push(data.initPoint);
    } catch (error) {
      console.error(error);
      //   toast.error("Erro ao criar checkout");
    }
  }

  return {
    createMercadoPagoCheckout,
  };
}
