export const PRODUCT_CATEGORIES = ["Beaded", "Woven", "Leather", "Charm"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
