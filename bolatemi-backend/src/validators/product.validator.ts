import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string(),
  sku: z.string().min(2),
  description: z.string().min(10),
  specifications: z.record(z.string()).optional(), // e.g. { "Diameter": "50mm", "Standard": "ASTM A53" }
  material: z.string().optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
  weightKg: z.number().positive().optional(),
  priceMode: z.enum(["FIXED", "REQUEST_QUOTE"]).default("FIXED"),
  price: z.number().positive().optional(),
  discountPrice: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0).default(0),
  isFeatured: z.boolean().optional(),
  images: z.array(z.object({ url: z.string().url(), altText: z.string().optional() })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  featured: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
});

export const createCategorySchema = z.object({
  name: z.string().min(2),
  code: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().optional(),
});
