import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as productService from "../services/product.service";

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.listProducts(req.query as any);
  res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

export const listAdminProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.listAdminProducts(req.query as any);
  res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getProductBySlug(req.params.slug);
  res.json({ success: true, data: result.product, related: result.related });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id);
  res.json({ success: true, message: "Product deleted" });
});
