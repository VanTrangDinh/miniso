export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  purchaseCount?: number;
  brand?: string;
} 