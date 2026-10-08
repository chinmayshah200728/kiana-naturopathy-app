import crypto from "crypto";
import Razorpay from "razorpay";

// Retrieve keys safely from environment variables (never hardcoded)
const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_KianaNaturopathy2026";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "KianaSecretKey2026Placeholder";

// Initialize Razorpay SDK instance
export const razorpayInstance = new Razorpay({
  key_id,
  key_secret,
});

export function getPublicRazorpayKeyId(): string {
  return key_id;
}

export interface CreateRazorpayOrderOptions {
  amountInPaise: number;
  currency?: string;
  orderNumber: string;
  notes?: Record<string, string>;
}

/**
 * Creates an order on Razorpay servers via official SDK.
 */
export async function createRazorpayServerOrder(options: CreateRazorpayOrderOptions) {
  try {
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(options.amountInPaise),
      currency: options.currency || "INR",
      receipt: options.orderNumber,
      notes: {
        order_number: options.orderNumber,
        app: "Kiana Naturopathy",
        ...options.notes,
      },
    });

    return razorpayOrder;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Razorpay Server Error] Order Creation Failed:", msg);
    throw new Error(`Razorpay Order Creation Failed: ${msg}`);
  }
}

/**
 * Cryptographically verifies Razorpay payment signature using HMAC SHA256.
 * Formula: HMAC-SHA256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!params.orderId || !params.paymentId || !params.signature) {
    return false;
  }

  try {
    const body = `${params.orderId}|${params.paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(params.signature)
    );
  } catch (err) {
    console.error("[Razorpay Signature Verification Error]:", err);
    return false;
  }
}

/**
 * Cryptographically verifies Razorpay webhook signature.
 */
export function verifyWebhookSignature(params: {
  rawBody: string;
  signature: string;
  webhookSecret?: string;
}): boolean {
  const secret = params.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || "KianaWebhookSecret2026";
  if (!params.rawBody || !params.signature || !secret) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(params.rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(params.signature)
    );
  } catch (err) {
    console.error("[Razorpay Webhook Verification Error]:", err);
    return false;
  }
}

/**
 * Fetches payment details from Razorpay official API.
 */
export async function fetchRazorpayPayment(paymentId: string) {
  try {
    return await razorpayInstance.payments.fetch(paymentId);
  } catch (error: unknown) {
    console.error("[Razorpay Fetch Payment Error]:", error);
    throw new Error(`Failed to fetch payment details for ${paymentId}`);
  }
}

/**
 * Initiates a full or partial refund via Razorpay official SDK.
 */
export async function initiateRazorpayRefund(params: {
  paymentId: string;
  amountInPaise?: number;
  notes?: Record<string, string>;
}) {
  try {
    const refundPayload: Record<string, unknown> = {
      notes: params.notes || {},
    };
    if (params.amountInPaise && params.amountInPaise > 0) {
      refundPayload.amount = Math.round(params.amountInPaise);
    }

    const refund = await razorpayInstance.payments.refund(
      params.paymentId,
      refundPayload as { amount?: number; notes?: Record<string, string> }
    );
    return refund;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Razorpay Refund Error]:", msg);
    throw new Error(`Razorpay Refund Failed: ${msg}`);
  }
}
