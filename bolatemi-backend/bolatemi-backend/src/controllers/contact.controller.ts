import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/db";
import { sendMail } from "../services/email.service";
import { env } from "../config/env";

export const submitContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await prisma.contactMessage.create({ data: req.body });

  if (env.smtp.user) {
    await sendMail({
      to: env.smtp.user,
      subject: `New contact message: ${req.body.subject ?? "General enquiry"}`,
      html: `<p>From: ${req.body.name} (${req.body.email}${req.body.phone ? `, ${req.body.phone}` : ""})</p><p>${req.body.message}</p>`,
    });
  }

  res.status(201).json({ success: true, message: "Thank you for reaching out — we'll respond shortly.", data: message });
});

export const listContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: messages });
});

export const markContactMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const message = await prisma.contactMessage.update({ where: { id: req.params.id }, data: { isRead: true } });
  res.json({ success: true, data: message });
});
