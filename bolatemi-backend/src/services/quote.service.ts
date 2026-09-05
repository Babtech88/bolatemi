import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError";
import { sendMail, quoteReceivedEmail, newQuoteAlertEmail } from "./email.service";
import { env } from "../config/env";

export async function createQuote(input: any) {
  const quote = await prisma.quote.create({ data: input });

  console.log(`[quote] New ${input.isBulkOrder ? "bulk " : ""}quote request from ${input.fullName} (${input.phone})`);

  if (input.email) {
    await sendMail({ to: input.email, subject: "We've received your request — Bolatemi Global and Sons", html: quoteReceivedEmail(input.fullName) });
  }
  if (env.smtp.user) {
    // Internal alert to the sales inbox itself, using the same SMTP account.
    await sendMail({
      to: env.smtp.user,
      subject: `New ${input.isBulkOrder ? "bulk order" : "quote"} request — ${input.fullName}`,
      html: newQuoteAlertEmail({ name: input.fullName, phone: input.phone, product: input.productRequired, bulk: Boolean(input.isBulkOrder) }),
    });
  }

  return quote;
}

export async function listQuotes(params: { status?: string; page: number; limit: number }) {
  const where = params.status ? { status: params.status as any } : {};
  const [items, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    }),
    prisma.quote.count({ where }),
  ]);
  return { items, total };
}

export async function updateQuote(id: string, input: any) {
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) throw ApiError.notFound("Quote not found");
  return prisma.quote.update({ where: { id }, data: input });
}
