export type PaymentStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUND_PENDING"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";

export interface PaymentOrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  pincode: string;
  preferredItems?: string | null;
  notes?: string | null;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: PaymentStatus;
  orderStatus: "new" | "packed" | "shipped" | "delivered" | "cancelled";
  subtotalInr: number;
  shippingInr: number;
  totalInr: number;
  currency: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  failureReason?: string | null;
  failureCode?: string | null;
  refundId?: string | null;
  refundAmountInr?: number | null;
  webhookEventIds?: string[];
  createdAt: string;
  updatedAt: string;
  items: Array<{
    productSlug: string;
    productName: string;
    unitPriceInr: number;
    quantity: number;
    lineTotalInr: number;
  }>;
}

// In-memory payment store for fast server-side access and SSR consistency
const memoryOrderStore = new Map<string, PaymentOrderRecord>();
const processedWebhookIds = new Set<string>();

export function savePaymentOrderRecord(record: PaymentOrderRecord): PaymentOrderRecord {
  const updated = {
    ...record,
    updatedAt: new Date().toISOString(),
  };
  memoryOrderStore.set(record.orderNumber, updated);
  if (record.razorpayOrderId) {
    memoryOrderStore.set(record.razorpayOrderId, updated);
  }
  return updated;
}

export function getPaymentOrderRecord(orderIdentifier: string): PaymentOrderRecord | undefined {
  if (!orderIdentifier) return undefined;
  return memoryOrderStore.get(orderIdentifier);
}

export function getAllPaymentOrders(): PaymentOrderRecord[] {
  const uniqueOrders = new Map<string, PaymentOrderRecord>();
  for (const order of memoryOrderStore.values()) {
    uniqueOrders.set(order.orderNumber, order);
  }
  return Array.from(uniqueOrders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function isWebhookProcessed(eventId: string): boolean {
  return processedWebhookIds.has(eventId);
}

export function markWebhookProcessed(eventId: string): void {
  processedWebhookIds.add(eventId);
}
