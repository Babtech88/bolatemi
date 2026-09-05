import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as orderService from "../services/order.service";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { order, checkoutUrl } = await orderService.createOrder(req.body);
  res.status(201).json({ success: true, data: { order, checkoutUrl } });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.confirmPayment(req.params.reference);
  res.json({ success: true, data: order });
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, page = 1, limit = 20 } = req.query as any;
  const result = await orderService.listOrders({ status, page: Number(page), limit: Number(limit) });
  res.json({ success: true, data: result.items, meta: { total: result.total } });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrder(req.params.id);
  res.json({ success: true, data: order });
});
