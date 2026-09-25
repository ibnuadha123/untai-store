import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Senja Beaded Strap",
    slug: "senja-beaded-strap",
    description:
      "A hand-strung bead strap in warm sunset tones — raspberry, gold, and deep forest. Named after senja, the Indonesian golden hour.",
    price: 89000,
    stock: 14,
    category: "Beaded",
    imageUrl: "/images/product-beaded-sunset.svg",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Hutan Beaded Strap",
    slug: "hutan-beaded-strap",
    description:
      "Deep forest greens and warm gold beads, strung on a durable nylon cord. Understated and easy to dress up or down.",
    price: 89000,
    stock: 9,
    category: "Beaded",
    imageUrl: "/images/product-beaded-forest.svg",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "3",
    name: "Anyam Clay Woven Strap",
    slug: "anyam-clay-woven-strap",
    description:
      "A flat woven strap in clay and raspberry, finished with reinforced stitching at both lugs for everyday durability.",
    price: 109000,
    stock: 6,
    category: "Woven",
    imageUrl: "/images/product-woven-clay.svg",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "4",
    name: "Anyam Olive Woven Strap",
    slug: "anyam-olive-woven-strap",
    description:
      "Olive and gold in a tight herringbone weave. A quieter alternative to the Clay strap, made from the same cord.",
    price: 109000,
    stock: 0,
    category: "Woven",
    imageUrl: "/images/product-woven-olive.svg",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "5",
    name: "Kulit Slim Leather Strap",
    slug: "kulit-slim-leather-strap",
    description:
      "Vegetable-tanned leather in deep ink, aged to a soft patina with use. The most minimal piece in the collection.",
    price: 129000,
    stock: 11,
    category: "Leather",
    imageUrl: "/images/product-leather-ink.svg",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "6",
    name: "Manik Charm Cluster",
    slug: "manik-charm-cluster",
    description:
      "A small cluster of mixed charms and beads that clips onto any strap. Sold on its own so you can mix it with what you already have.",
    price: 59000,
    stock: 21,
    category: "Charm",
    imageUrl: "/images/product-charm-mixed.svg",
    isFeatured: false,
    isActive: true,
  },
];
