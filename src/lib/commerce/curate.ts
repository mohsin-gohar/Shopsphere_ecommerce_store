import type { Product } from "./types";

const FASHION_IMAGE =
  /images\.unsplash\.com|plus\.unsplash\.com|dummyjson\.com\/product-images\/(mens-shirts|mens-shoes|mens-watches|womens-dresses|womens-shoes|womens-watches|womens-bags|womens-jewellery|tops|sunglasses)\//i;

const JUNK_NAME =
  /\b(potato|potatoes|onion|onions|rice|strawberry|protein powder|soft drinks?|tissue|whisk|ice cube|rolling pin|peeler|mascara|eyeshadow|lipstick|nail polish|eau de|fragrance|perfume|bathroom sink|powder canister|gigabyte|aorus)\b/i;

const ROOM_FROM_IMAGE: Array<[RegExp, Product["category"]]> = [
  [/mens-shirts|\/tops\//, "Men"],
  [/womens-dresses/, "Women"],
  [/mens-shoes|womens-shoes/, "Shoes"],
  [/mens-watches|womens-watches|womens-bags|womens-jewellery|sunglasses/, "Accessories"],
];

function roomFromImage(image: string): Product["category"] | null {
  for (const [pattern, category] of ROOM_FROM_IMAGE) {
    if (pattern.test(image)) return category;
  }
  return null;
}

function nameKey(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function curateCatalog(products: Product[]): Product[] {
  const seen = new Set<string>();
  const next: Product[] = [];
  for (const product of products) {
    if (!product?.name || !product.image) continue;
    if (!FASHION_IMAGE.test(product.image)) continue;
    if (JUNK_NAME.test(`${product.name} ${product.short_desc}`)) continue;
    if (product.price < 12 || product.price > 500) continue;
    const category = roomFromImage(product.image) ?? product.category;
    if (!["Men", "Women", "Shoes", "Accessories"].includes(category)) continue;
    const key = nameKey(product.name);
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(category === product.category ? product : { ...product, category });
  }
  return next;
}
