import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError";

export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { search, page = 1, limit = 20 } = req.query as any;
  const where = search
    ? { OR: [{ fullName: { contains: search, mode: "insensitive" as const } }, { phone: { contains: search } }, { email: { contains: search, mode: "insensitive" as const } }] }
    : {};

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: { _count: { select: { orders: true, quotes: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  res.json({ success: true, data: items, meta: { total } });
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: { orders: { orderBy: { createdAt: "desc" } }, quotes: { orderBy: { createdAt: "desc" } }, addresses: true },
  });
  if (!customer) throw ApiError.notFound("Customer not found");
  res.json({ success: true, data: customer });
});
