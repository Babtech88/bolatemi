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

export async function sendMail(params: { to: string; subject: string; html: string }) {
  if (!transporter) {
    console.log(`[email:skipped — SMTP not configured] to=${params.to} subject="${params.subject}"`);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
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

export function orderConfirmationEmail(params: { orderNumber: string; total: string }) {
  return `<p>Your order <strong>${params.orderNumber}</strong> has been confirmed.</p><p>Total paid: ${params.total}</p><p>We'll be in touch with delivery details shortly.</p>`;
}
