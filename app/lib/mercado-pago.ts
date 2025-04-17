import { MercadoPagoConfig } from "mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export default mpClient;
