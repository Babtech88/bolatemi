import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/db";

// Public — anyone can submit a testimonial, but it only appears on the site
// once an admin approves it (isApproved defaults to false). Matches the
// spec's "admin-managed testimonial system, no fake reviews" requirement.
export const submitTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const testimonial = await prisma.testimonial.create({ data: req.body });
  res.status(201).json({ success: true, message: "Thank you — your review is pending approval.", data: testimonial });
});

export const listApprovedTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await prisma.testimonial.findMany({ where: { isApproved: true }, orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: testimonials });
});

export const listAllTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: testimonials });
});

export const setTestimonialApproval = asyncHandler(async (req: Request, res: Response) => {
  const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data: { isApproved: req.body.isApproved } });
  res.json({ success: true, data: testimonial });
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Testimonial deleted" });
});
