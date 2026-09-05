import { Request, Response } from "express";
import slugify from "slugify";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError";

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  res.json({ success: true, data: categories });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const slug = slugify(req.body.name, { lower: true, strict: true });
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw ApiError.conflict("A category with this name already exists");

  const category = await prisma.category.create({ data: { ...req.body, slug } });
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Category deleted" });
});
