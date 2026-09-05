import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError";
import { generateOrderNumber } from "../utils/orderNumber";
import { initializePaystackTransaction, verifyPaystackTransaction } from "./payment.service";
import { sendMail, orderConfirmationEmail } from "./email.service";
import { generateReceiptPdf } from "./receipt.service";

interface CreateOrderInput {
  customer: { fullName: string; phone: string; email?: string; whatsapp?: string; company?: string };
  items: { productId: string; quantity: number }[];
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryNotes?: string;
}

// Creates the order + snapshot line items, then hands back a Paystack
// checkout URL. Stock is only decremented on confirmed payment (see
// confirmPayment) so an abandoned checkout never locks up inventory.
export async function createOrder(input: CreateOrderInput) {
  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
  });

  if (products.length !== input.items.length) {
    throw ApiError.badRequest("One or more products in the cart no longer exist");
  }

  for (const item of input.items) {
    const product = products.find((p: any) => p.id === item.productId)!;
    if (product.priceMode === "REQUEST_QUOTE") {
      throw ApiError.badRequest(`${product.name} requires a quote — it can't be checked out directly`);
    }
    if (product.stockQuantity < item.quantity) {
      throw ApiError.badRequest(`${product.name} only has ${product.stockQuantity} units in stock`);
    }
  }

  const lineItems = input.items.map((item) => {
    const product = products.find((p: any) => p.id === item.productId)!;
    const unitPrice = product.discountPrice ?? product.price!;
    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      unitPrice,
      quantity: item.quantity,
      lineTotal: Number(unitPrice) * item.quantity,
    };
  });

  const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
  const deliveryFee = 0; // TODO: wire up a real delivery-fee calculation (by state/weight)
  const total = subtotal + deliveryFee;

  const customer = await prisma.customer.upsert({
    where: { phone: input.customer.phone },
    update: { fullName: input.customer.fullName, email: input.customer.email, whatsapp: input.customer.whatsapp, company: input.customer.company },
    create: input.customer,
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: customer.id,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress: input.deliveryAddress,
      deliveryCity: input.deliveryCity,
      deliveryState: input.deliveryState,
      deliveryNotes: input.deliveryNotes,
      items: { create: lineItems },
    },
    include: { items: true },
  });

  const paystack = await initializePaystackTransaction({
    email: input.customer.email ?? `${input.customer.phone}@guest.bolatemiglobal.com`,
    amountNaira: total,
    reference: order.orderNumber,
    metadata: { orderId: order.id },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "PAYSTACK",
      reference: order.orderNumber,
      amount: total,
    },
  });

  return { order, checkoutUrl: paystack.authorization_url };
}

// Verifies with Paystack directly (source of truth) rather than trusting
// the client redirect, then marks the order paid and decrements stock.
export async function confirmPayment(reference: string) {
  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: { order: { include: { items: true, customer: true } } },
  });
  if (!payment) throw ApiError.notFound("Payment record not found");

  if (payment.status === "SUCCESS") return payment.order; // idempotent

  const verification = await verifyPaystackTransaction(reference);

  if (verification.status !== "success") {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", rawResponse: verification as any } });
    throw ApiError.badRequest("Payment was not successful");
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCESS", paidAt: new Date(), rawResponse: verification as any },
    }),
    prisma.order.update({ where: { id: payment.orderId }, data: { status: "PAID" } }),
    ...payment.order.items.map((item: any) =>
      prisma.product.update({ where: { id: item.productId }, data: { stockQuantity: { decrement: item.quantity } } })
    ),
  ]);

  await finalizeOrderPayment(payment.orderId, payment.reference);

  return prisma.order.findUnique({ where: { id: payment.orderId }, include: { items: true, payment: true } });
}

// Shared by the redirect-verify route and the webhook — whichever hits
// first wins, the other is a safe no-op thanks to the SUCCESS check above.
// Generates the PDF receipt and sends it immediately, synchronously, as
// part of confirming payment — not queued or deferred — so the customer's
// inbox has it within seconds of paying, matching the "receipt sent" promise
// already shown on the payment-success page.
async function finalizeOrderPayment(orderId: string, paymentReference: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, customer: true },
  });
  if (!order || !order.customer.email) return; // no email on file — nothing to send

  const receiptPdf = await generateReceiptPdf({
    orderNumber: order.orderNumber,
    paidAt: new Date(),
    customerName: order.customer.fullName,
    customerPhone: order.customer.phone,
    customerEmail: order.customer.email,
    deliveryAddress: order.deliveryAddress,
    deliveryCity: order.deliveryCity,
    deliveryState: order.deliveryState,
    items: order.items.map((i: any) => ({
      name: i.name,
      sku: i.sku,
      unitPrice: Number(i.unitPrice),
      quantity: i.quantity,
      lineTotal: Number(i.lineTotal),
    })),
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    paymentReference,
  });

  await sendMail({
    to: order.customer.email,
    subject: `Order confirmed — ${order.orderNumber}`,
    html: orderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customer.fullName,
      items: order.items.map((i: any) => ({
        name: i.name,
        sku: i.sku,
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
      })),
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      total: Number(order.total),
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryState: order.deliveryState,
    }),
    attachments: [
      {
        filename: `Receipt-${order.orderNumber}.pdf`,
        content: receiptPdf,
        contentType: "application/pdf",
      },
    ],
  });
}

export async function listOrders(params: { status?: string; page: number; limit: number }) {
  const where = params.status ? { status: params.status as any } : {};
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      include: { customer: true, payment: true, items: true },
    }),
    prisma.order.count({ where }),
  ]);
  return { items, total };
}

export async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, payment: true, items: { include: { product: true } } },
  });
  if (!order) throw ApiError.notFound("Order not found");
  return order;
}
