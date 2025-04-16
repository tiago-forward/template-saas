import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { auth } from "@/app/lib/auth";
import { getOrCreateCustomer } from "@/app/server/stripe/get-customer-id";

export async function POST(req: NextRequest) {
  const { testeId } = await req.json();

  const price = process.env.SUBSCRIPTION_PRICE_ID;

  if (!price) {
    return NextResponse.json({ error: "Price ID not found" }, { status: 500 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (!userId || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const metadada = {
    testeId,
    price,
  };

  // Criado um cliente na STRIPE para ter referência dele quando for criar o portal
  const customerId = await getOrCreateCustomer(userId, userEmail);

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1 }],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: metadada,
      customer: customerId,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Session creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
