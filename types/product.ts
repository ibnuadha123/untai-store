export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: "Beaded" | "Woven" | "Leather" | "Charm";
  imageUrl: string;
  secondaryImageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
}
