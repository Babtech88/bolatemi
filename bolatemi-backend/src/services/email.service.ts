import nodemailer from "nodemailer";
import { env } from "../config/env";

// If SMTP isn't configured (local dev, or before the client provides
// credentials), we log instead of throwing — so quote/order flows never
// break just because email isn't wired up yet.
const isConfigured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    })
  : null;

export async function sendMail(params: { to: string; subject: string; html: string; attachments?: { filename: string; content: Buffer; contentType?: string }[] }) {
  if (!transporter) {
    console.log(`[email:skipped — SMTP not configured] to=${params.to} subject="${params.subject}"`);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    attachments: params.attachments,
  });
}

export function quoteReceivedEmail(name: string) {
  return `<p>Hi ${name},</p><p>Thanks for reaching out to Bolatemi Global and Sons Enterprises. Our sales team has received your request and will contact you shortly.</p>`;
}

export function newQuoteAlertEmail(params: { name: string; phone: string; product: string; bulk: boolean }) {
  return `<p>New ${params.bulk ? "bulk order" : "quote"} request</p>
    <ul>
      <li>Name: ${params.name}</li>
      <li>Phone: ${params.phone}</li>
      <li>Product: ${params.product}</li>
    </ul>`;
}

interface OrderConfirmationParams {
  orderNumber: string;
  customerName: string;
  items: { name: string; sku: string; unitPrice: number; quantity: number; lineTotal: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
}

const nairaHtml = (n: number) => `₦${n.toLocaleString("en-NG")}`;

// Itemized HTML receipt in the email body itself (not just relying on the
// PDF attachment) — some mail clients preview or clip attachments, and a
// customer should be able to see what they paid for without opening one.
export function orderConfirmationEmail(params: OrderConfirmationParams) {
  const rows = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 6px;border-bottom:1px solid #E2DDD1;font-size:13px;">${item.name}<br><span style="color:#8A8A85;font-size:11px;">${item.sku}</span></td>
        <td style="padding:8px 6px;border-bottom:1px solid #E2DDD1;font-size:13px;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 6px;border-bottom:1px solid #E2DDD1;font-size:13px;text-align:right;">${nairaHtml(item.lineTotal)}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
    <div style="background:#0F1922;padding:24px;text-align:center;">
      <h1 style="color:#fff;font-size:18px;margin:0;">Bolatemi Global and Sons Enterprises</h1>
      <p style="color:#F5B700;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:6px 0 0;">Payment Confirmed</p>
    </div>
    <div style="padding:24px;background:#fff;">
      <p style="font-size:14px;color:#161615;">Hi ${params.customerName},</p>
      <p style="font-size:14px;color:#4B4B48;">Your order <strong>${params.orderNumber}</strong> is confirmed — thank you for your business. A full PDF receipt is attached to this email.</p>

      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 6px;border-bottom:2px solid #0F1922;font-size:11px;text-transform:uppercase;color:#4B4B48;">Item</th>
            <th style="text-align:center;padding:8px 6px;border-bottom:2px solid #0F1922;font-size:11px;text-transform:uppercase;color:#4B4B48;">Qty</th>
            <th style="text-align:right;padding:8px 6px;border-bottom:2px solid #0F1922;font-size:11px;text-transform:uppercase;color:#4B4B48;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <table style="width:100%;margin-top:12px;">
        <tr><td style="font-size:13px;color:#4B4B48;padding:3px 6px;">Subtotal</td><td style="font-size:13px;text-align:right;padding:3px 6px;">${nairaHtml(params.subtotal)}</td></tr>
        <tr><td style="font-size:13px;color:#4B4B48;padding:3px 6px;">Delivery Fee</td><td style="font-size:13px;text-align:right;padding:3px 6px;">${nairaHtml(params.deliveryFee)}</td></tr>
        <tr><td style="font-size:15px;font-weight:bold;padding:8px 6px;border-top:1px solid #0F1922;">Total Paid</td><td style="font-size:15px;font-weight:bold;text-align:right;padding:8px 6px;border-top:1px solid #0F1922;">${nairaHtml(params.total)}</td></tr>
      </table>

      <p style="font-size:13px;color:#4B4B48;margin-top:20px;"><strong>Delivering to:</strong><br>${params.deliveryAddress}<br>${params.deliveryCity}, ${params.deliveryState}</p>
      <p style="font-size:13px;color:#4B4B48;">We'll be in touch with delivery details shortly. If you have questions about this order, reply to this email or reach us on WhatsApp.</p>
    </div>
    <div style="background:#EDEAE3;padding:14px;text-align:center;font-size:11px;color:#8A8A85;">
      Bolatemi Global and Sons Enterprises — Agbara, Ogun State, Nigeria
    </div>
  </div>`;
}
