import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as quoteService from "../services/quote.service";

export const createQuote = asyncHandler(async (req: Request, res: Response) => {
  const quote = await quoteService.createQuote(req.body);
  res.status(201).json({
    success: true,
    message: "Thank you. Our sales team will contact you shortly.",
    data: quote,
  });
});

export const listQuotes = asyncHandler(async (req: Request, res: Response) => {
  const { status, page = 1, limit = 20 } = req.query as any;
  const result = await quoteService.listQuotes({ status, page: Number(page), limit: Number(limit) });
  res.json({ success: true, data: result.items, meta: { total: result.total } });
});

export const updateQuote = asyncHandler(async (req: Request, res: Response) => {
  const quote = await quoteService.updateQuote(req.params.id, req.body);
  res.json({ success: true, data: quote });
});
