import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("payment_id");

  const testeId = searchParams.get("external_reference");

  if (!paymentId || !testeId) {
    return NextResponse.json(
      {
        error: "Payment ID or teste ID not found",
      },
      { status: 400 }
    );
  }

  const payment = new Payment(mpClient);

  const paymentData = await payment.get({
    id: paymentId,
  });

  if (paymentData.status === "approved" || paymentData.date_approved !== null) {
    return NextResponse.json(new URL(`/success`, req.url));
  }

  return NextResponse.json(new URL(`/failure`, req.url));
}
