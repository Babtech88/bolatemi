import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/db";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    quoteRequests,
    revenueAgg,
    todayRevenueAgg,
    bestSellers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: { in: ["DELIVERED", "PAID", "SHIPPED", "PROCESSING"] } } }),
    prisma.customer.count(),
    prisma.quote.count({ where: { status: "NEW" } }),
    prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: { not: "CANCELLED" }, createdAt: { gte: startOfToday } }, _sum: { total: true } }),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  res.json({
    success: true,
    data: {
      totalSales: revenueAgg._sum.total ?? 0,
      todaySales: todayRevenueAgg._sum.total ?? 0,
      totalOrders,
      pendingOrders,
      completedOrders,
      quoteRequests,
      totalCustomers,
      bestSellingProducts: bestSellers.map((b: any) => ({ productId: b.productId, name: b.name, unitsSold: b._sum.quantity })),
    },
  });
});
