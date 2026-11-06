export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export type PaymentGatewayProvider = "stripe" | "paypal" | "razorpay" | "cod" | "wallet";

export interface PaymentIntentRequest {
  orderId: string;
  amount: number;
  currency: string;
  provider: PaymentGatewayProvider;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentIntentResponse {
  success: boolean;
  transactionId: string;
  provider: PaymentGatewayProvider;
  amount: number;
  currency: string;
  status: "requires_payment_method" | "succeeded" | "pending" | "failed";
  clientSecret?: string;
  approvalUrl?: string;
  message: string;
}

/**
 * Enterprise Payment Gateway Adapter & Orchestrator
 * Supports Stripe (client secret), PayPal (order intent), Razorpay (order token), and COD/Wallet.
 */
export async function createPaymentIntent(
  request: PaymentIntentRequest
): Promise<PaymentIntentResponse> {
  const sanitizedAmount = round2(Math.max(0, request.amount));
  const txId = `TXN-${request.provider.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (request.provider === "stripe") {
    return {
      success: true,
      transactionId: txId,
      provider: "stripe",
      amount: sanitizedAmount,
      currency: request.currency.toUpperCase(),
      status: sanitizedAmount === 0 ? "succeeded" : "requires_payment_method",
      clientSecret: `pi_mock_${txId}_secret_${Math.random().toString(36).slice(2, 9)}`,
      message: "Stripe payment intent successfully initiated.",
    };
  }

  if (request.provider === "paypal") {
    return {
      success: true,
      transactionId: txId,
      provider: "paypal",
      amount: sanitizedAmount,
      currency: request.currency.toUpperCase(),
      status: "pending",
      approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=EC-${txId}`,
      message: "PayPal checkout approval token created.",
    };
  }

  if (request.provider === "razorpay") {
    return {
      success: true,
      transactionId: txId,
      provider: "razorpay",
      amount: sanitizedAmount,
      currency: request.currency.toUpperCase(),
      status: "pending",
      clientSecret: `order_${txId}`,
      message: "Razorpay payment order generated.",
    };
  }

  // COD or Wallet Direct Settlement
  return {
    success: true,
    transactionId: txId,
    provider: request.provider,
    amount: sanitizedAmount,
    currency: request.currency.toUpperCase(),
    status: "succeeded",
    message: `${request.provider.toUpperCase()} settlement recorded.`,
  };
}
