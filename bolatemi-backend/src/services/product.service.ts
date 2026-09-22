import slugify from "slugify";
import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError";

interface ListParams {
  category?: string;
  search?: string;
  featured?: boolean;
  page: number;
  limit: number;
  sort: "newest" | "price_asc" | "price_desc";
}

export async function listProducts(params: ListParams) {
  const { category, search, featured, page, limit, sort } = params;

  const where = {
    isAvailable: true,
    ...(featured ? { isFeatured: true } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } : sort === "price_desc" ? { price: "desc" as const } : { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}


export async function listAdminProducts(params: Omit<ListParams, "featured">) {
  const { category, search, page, limit, sort } = params;
  const where = {
    ...(category ? { category: { slug: category } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } : sort === "price_desc" ? { price: "desc" as const } : { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) throw ApiError.notFound("Product not found");

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isAvailable: true },
    take: 4,
    include: { images: { take: 1 } },
  });

  return { product, related };
}

function uniqueSlug(name: string) {
  return `${slugify(name, { lower: true, strict: true })}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function createProduct(input: any) {
  const existingSku = await prisma.product.findUnique({ where: { sku: input.sku } });
  if (existingSku) throw ApiError.conflict(`SKU "${input.sku}" is already in use`);

  const { images, ...rest } = input;

  return prisma.product.create({
    data: {
      ...rest,
      slug: uniqueSlug(input.name),
      images: images?.length ? { create: images.map((img: any, i: number) => ({ ...img, sortOrder: i })) } : undefined,
    },
    include: { images: true },
  });
}

export async function updateProduct(id: string, input: any) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw ApiError.notFound("Product not found");

  const { images, ...rest } = input;

  return prisma.product.update({
    where: { id },
    data: rest,
    include: { images: true },
  });
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw ApiError.notFound("Product not found");
  await prisma.product.delete({ where: { id } });
}

export async function adjustStock(id: string, delta: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw ApiError.notFound("Product not found");
  const newQty = product.stockQuantity + delta;
  if (newQty < 0) throw ApiError.badRequest("Insufficient stock");
  return prisma.product.update({ where: { id }, data: { stockQuantity: newQty } });
}
