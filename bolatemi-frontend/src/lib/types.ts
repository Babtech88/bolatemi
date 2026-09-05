export interface Category {
  id: string;
  name: string;
  slug: string;
  code?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: Category;
  categoryId: string;
  description: string;
  specifications?: Record<string, string> | null;
  material?: string | null;
  brand?: string | null;
  size?: string | null;
  priceMode: "FIXED" | "REQUEST_QUOTE";
  price?: string | null;
  discountPrice?: string | null;
  currency: string;
  stockQuantity: number;
  isAvailable: boolean;
  images: ProductImage[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  meta?: { total: number; page?: number; limit?: number; totalPages?: number };
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
