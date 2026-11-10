import { curateCatalog } from "./curate";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "./catalog";
import type { Category, Product } from "./types";

const BASE_API_URL = "https://muhammadfarhandeveloper.github.io/E-Commerce-fakeapi";
const DUMMY_JSON_API_URL = "https://dummyjson.com/products?limit=100";

interface DummyJsonItem {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  reviews?: Array<{ rating: number; comment: string; reviewerName: string }>;
  thumbnail?: string;
  images?: string[];
}

const FASHION_ROOMS: Record<string, Product["category"]> = {
  "mens-shirts": "Men",
  tops: "Women",
  "womens-dresses": "Women",
  "mens-shoes": "Shoes",
  "womens-shoes": "Shoes",
  "mens-watches": "Accessories",
  "womens-watches": "Accessories",
  "womens-bags": "Accessories",
  "womens-jewellery": "Accessories",
  sunglasses: "Accessories",
};

function mapDummy(item: DummyJsonItem, index: number, category: Product["category"]): Product {
  let badge: string | undefined;
  if ((item.discountPercentage ?? 0) > 15) badge = "Sale";
  else if ((item.rating ?? 0) >= 4.7) badge = "Top Rated";
  else if (index % 7 === 0) badge = "Best Seller";
  else if (index % 5 === 0) badge = "New";
  else if ((item.stock ?? 10) < 12) badge = "Limited";

  const price = Math.round(item.price < 20 ? item.price * 2.5 : item.price);
  const oldPrice = Math.round(price * (1 + (item.discountPercentage || 18) / 100));
  const description = item.description || "Cut and finished in the ShopSphere atelier.";

  return {
    id: 1000 + index,
    name: item.title,
    category,
    price,
    oldPrice,
    rating: Number((item.rating || 4.5).toFixed(1)),
    reviews: Array.isArray(item.reviews) ? item.reviews.length * 15 + ((index * 7) % 80) : 45 + ((index * 5) % 100),
    badge,
    short_desc: description.slice(0, 110),
    long_description: description,
    image: item.thumbnail || item.images?.[0] || FALLBACK_PRODUCTS[0].image,
  };
}

export async function fetchProducts(): Promise<{ data: Product[]; source: "api" | "fallback" }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);
    const [primaryRes, dummyRes] = await Promise.allSettled([
      fetch(`${BASE_API_URL}/products.json`, { signal: controller.signal, headers: { Accept: "application/json" } }),
      fetch(DUMMY_JSON_API_URL, { signal: controller.signal, headers: { Accept: "application/json" } }),
    ]);
    clearTimeout(timeoutId);

    let baseProducts: Product[] = [];
    if (primaryRes.status === "fulfilled" && primaryRes.value.ok) {
      const data = (await primaryRes.value.json()) as Product[];
      if (Array.isArray(data)) {
        baseProducts = data.filter((p) => ["Men", "Women", "Shoes", "Accessories"].includes(p.category));
      }
    }

    let dummyProducts: Product[] = [];
    if (dummyRes.status === "fulfilled" && dummyRes.value.ok) {
      const dummyJson = (await dummyRes.value.json()) as { products?: DummyJsonItem[] };
      const fashion = (dummyJson.products ?? []).flatMap((item) => {
        const category = FASHION_ROOMS[(item.category || "").toLowerCase()];
        return category ? [item] : [];
      });
      dummyProducts = fashion.map((item, index) => mapDummy(item, index, FASHION_ROOMS[item.category.toLowerCase()]));
    }

    const combined = curateCatalog(dedupe([...baseProducts, ...dummyProducts]));
    if (combined.length >= 20) return { data: combined, source: "api" };
    throw new Error("Catalog response was too thin");
  } catch (error) {
    console.warn("Live catalog unavailable, using the house archive.", error);
    return { data: FALLBACK_PRODUCTS, source: "fallback" };
  }
}

export async function fetchCategories(): Promise<{ data: Category[]; source: "api" | "fallback" }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const response = await fetch(`${BASE_API_URL}/category.json`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as Category[];
    if (Array.isArray(data) && data.length > 0) return { data, source: "api" };
    throw new Error("Empty categories");
  } catch (error) {
    console.warn("Live categories unavailable, using the house archive.", error);
    return { data: FALLBACK_CATEGORIES, source: "fallback" };
  }
}

function dedupe(products: Product[]) {
  const seen = new Set<number>();
  return products.filter((product) => {
    if (!product || typeof product.id !== "number" || seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}
