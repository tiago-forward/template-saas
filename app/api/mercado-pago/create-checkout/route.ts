import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";

export async function POST(req: NextRequest) {
  const { testeId, userEmail } = await req.json();

  try {
    const preference = new Preference(mpClient);

    const createdPreference = await preference.create({
      body: {
        external_reference: testeId, // Isso impacta na pontuação do Mercado Pago
        metadata: {
          testeId, // Essa variavel é convertida para snake_case -> teste_id
        },
        items: [
          {
            id: "",
            description: "",
            title: "",
            quantity: 1,
            unit_price: 1,
            currency_id: "BRL",
            category_id: "services",
          },
        ],
        payment_methods: {
          //   installments: 12,
          //   excluded_payment_methods: [
          //     {
          //       id: "bolbradesco",
          //     },
          //     {
          //       id: "pec",
          //     },
          //   ],
          //   excluded_payment_types: [
          //     {
          //       id: "debit_card",
          //     },
          //     {
          //       id: "credit_card",
          //     },
          //   ],
        },
        auto_return: "appproved",
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
        },
      },
      ...(userEmail && { payer: { email: userEmail } }),
    });

    if (!createdPreference.id) {
      return NextResponse.json(
        { error: "Erro ao criar checkout com Mercado Pago" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      init_point: createdPreference.init_point,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar checkout com Mercado Pago" },
      { status: 500 }
    );
  }
}
