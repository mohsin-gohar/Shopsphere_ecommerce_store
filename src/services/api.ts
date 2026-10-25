import { Product, Category } from '../types/ecommerce';
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from './mockData';

const BASE_API_URL = 'https://muhammadfarhandeveloper.github.io/E-Commerce-fakeapi';
const DUMMY_JSON_API_URL = 'https://dummyjson.com/products?limit=100';

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

function mapDummyJsonToProduct(item: DummyJsonItem, index: number): Product {
  let category = 'Accessories';
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || '').toLowerCase();

  if (
    cat.includes('mens-shirts') ||
    cat.includes('mens-clothing') ||
    title.includes('shirt') ||
    title.includes('suit') ||
    title.includes('hoodie') ||
    title.includes('jacket') ||
    title.includes('pant') ||
    title.includes('t-shirt')
  ) {
    category = 'Men';
  } else if (
    cat.includes('womens-dresses') ||
    cat.includes('tops') ||
    title.includes('dress') ||
    title.includes('blouse') ||
    title.includes('gown') ||
    title.includes('skirt') ||
    title.includes('sari')
  ) {
    category = 'Women';
  } else if (
    cat.includes('shoes') ||
    title.includes('shoe') ||
    title.includes('sneaker') ||
    title.includes('boot') ||
    title.includes('loafer') ||
    title.includes('heel') ||
    title.includes('sandal')
  ) {
    category = 'Shoes';
  } else if (
    cat.includes('watch') ||
    cat.includes('bag') ||
    cat.includes('jewel') ||
    cat.includes('sunglass') ||
    cat.includes('beauty') ||
    cat.includes('fragrance') ||
    cat.includes('skin') ||
    cat.includes('wallet')
  ) {
    category = 'Accessories';
  } else {
    const fallbackCats = ['Men', 'Women', 'Shoes', 'Accessories'];
    category = fallbackCats[index % fallbackCats.length];
  }

  let badge: string | undefined = undefined;
  if ((item.discountPercentage ?? 0) > 15) badge = 'Sale';
  else if ((item.rating ?? 0) >= 4.7) badge = 'Top Rated';
  else if (index % 7 === 0) badge = 'Best Seller';
  else if (index % 5 === 0) badge = 'New';
  else if ((item.stock ?? 10) < 12) badge = 'Limited';

  const price = Math.round(item.price < 20 ? item.price * 2.5 : item.price);
  const oldPrice = Math.round(price * (1 + ((item.discountPercentage || 18) / 100)));

  return {
    id: 1000 + index,
    name: item.title,
    category,
    price,
    oldPrice,
    rating: Number((item.rating || 4.5).toFixed(1)),
    reviews: Array.isArray(item.reviews)
      ? item.reviews.length * 15 + ((index * 7) % 80)
      : 45 + ((index * 5) % 100),
    badge,
    short_desc: (item.description || 'Premium atelier piece crafted for everyday elegance.').slice(0, 110) + '...',
    long_description: item.description || 'Architectural design tailored with certified ethically sourced materials.',
    image:
      item.thumbnail ||
      (item.images && item.images[0]) ||
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85',
  };
}

/**
 * Fetch products from the public REST API and DummyJSON fake API (100 products), with timeout and fallback
 */
export async function fetchProducts(): Promise<{ data: Product[]; source: 'api' | 'fallback' }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const [primaryRes, dummyRes] = await Promise.allSettled([
      fetch(`${BASE_API_URL}/products.json`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      }),
      fetch(DUMMY_JSON_API_URL, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      }),
    ]);

    clearTimeout(timeoutId);

    let baseProducts: Product[] = [];
    if (primaryRes.status === 'fulfilled' && primaryRes.value.ok) {
      const data: Product[] = await primaryRes.value.json();
      if (Array.isArray(data) && data.length > 0) {
        baseProducts = data.filter((p) =>
          ['Men', 'Women', 'Shoes', 'Accessories'].includes(p.category)
        );
      }
    }

    let dummyProducts: Product[] = [];
    if (dummyRes.status === 'fulfilled' && dummyRes.value.ok) {
      const dummyJson = await dummyRes.value.json();
      if (Array.isArray(dummyJson.products) && dummyJson.products.length > 0) {
        const fashionOnly = dummyJson.products.filter((item: DummyJsonItem) => {
          const category = (item.category || '').toLowerCase();
          const nonFashionCategories = [
            'furniture',
            'groceries',
            'home-decoration',
            'kitchen-accessories',
            'laptops',
            'mobile-accessories',
            'motorcycle',
            'smartphones',
            'sports-accessories',
            'tablets',
            'vehicle',
            'beauty',
            'fragrances',
            'skin-care',
            'cosmetics',
          ];
          return !nonFashionCategories.some((blocked) => category.includes(blocked));
        });
        dummyProducts = fashionOnly.map(mapDummyJsonToProduct);
      }
    }

    const combined = [...baseProducts, ...dummyProducts];
    if (combined.length >= 20) {
      return { data: combined, source: 'api' };
    }

    throw new Error('Not enough products fetched from live APIs');
  } catch (error) {
    console.warn('API fetchProducts failed or timed out, using fallback dataset:', error);
    const blockedTerms = [
      'home-decoration',
      'kitchen-accessories',
      'groceries',
      'laptops',
      'smartphones',
      'furniture',
      'tablets',
      'motorcycle',
      'vehicle',
      'mobile-accessories',
      'beauty',
      'fragrances',
      'skin-care',
      'sports-accessories',
      'table',
      'chair',
      'lamp',
      'sieve',
      'laptop',
      'notebook',
      'computer',
    ];
    const fashionFallback = FALLBACK_PRODUCTS.filter((product) => {
      const image = (product.image || '').toLowerCase();
      const name = (product.name || '').toLowerCase();
      return !blockedTerms.some((term) => image.includes(term) || name.includes(term));
    });
    return { data: fashionFallback.length >= 20 ? fashionFallback : FALLBACK_PRODUCTS, source: 'fallback' };
  }
}

/**
 * Fetch categories from the public REST API with timeout and fallback
 */
export async function fetchCategories(): Promise<{ data: Category[]; source: 'api' | 'fallback' }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${BASE_API_URL}/category.json`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Category[] = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return { data, source: 'api' };
    }
    throw new Error('Empty or invalid categories payload');
  } catch (error) {
    console.warn('API fetchCategories failed or timed out, using fallback dataset:', error);
    return { data: FALLBACK_CATEGORIES, source: 'fallback' };
  }
}
