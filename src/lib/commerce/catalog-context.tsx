import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchCategories, fetchProducts } from "./api";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "./catalog";
import { useCommerce } from "./store";
import type { Category, Product } from "./types";

type CatalogValue = {
  products: Product[];
  categories: Category[];
  source: "cache" | "api" | "fallback";
  loading: boolean;
  refresh: () => void;
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [source, setSource] = useState<CatalogValue["source"]>("cache");
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    void Promise.resolve(useCommerce.persist.rehydrate()).finally(() => {
      if (live) useCommerce.setState({ hydrated: true });
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    void Promise.all([fetchProducts(), fetchCategories()]).then(([productRes, categoryRes]) => {
      if (cancel) return;
      setProducts(productRes.data);
      setCategories(categoryRes.data);
      setSource(productRes.source === "api" ? "api" : "fallback");
      setLoading(false);
    });
    return () => {
      cancel = true;
    };
  }, [tick]);

  const value = useMemo(
    () => ({
      products,
      categories,
      source,
      loading,
      refresh: () => setTick((n) => n + 1),
    }),
    [products, categories, source, loading],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  return (
    useContext(CatalogContext) ?? {
      products: FALLBACK_PRODUCTS,
      categories: FALLBACK_CATEGORIES,
      source: "cache",
      loading: false,
      refresh: () => undefined,
    }
  );
}
