import React, { useMemo } from 'react';
import { Product, Category, SortOption, FilterState } from '../types/ecommerce';
import { ProductCard } from './ProductCard';
import { Filter, RotateCcw, AlertTriangle, ArrowUpDown, DollarSign, X } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: number[];
  onToggleWishlist: (product: Product) => void;
  dataSource: 'api' | 'fallback';
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  loading,
  error,
  onRetry,
  onAddToCart,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  dataSource,
}) => {
  // Find highest price for slider max
  const maxAvailablePrice = useMemo(() => {
    if (products.length === 0) return 200;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  // Unique badges from products
  const availableBadges = useMemo(() => {
    const badges = new Set<string>();
    products.forEach((p) => {
      if (p.badge) badges.add(p.badge);
    });
    return Array.from(badges);
  }, [products]);

  // Check if any non-default filter is applied
  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.sortBy !== 'featured' ||
    filters.maxPrice < maxAvailablePrice ||
    filters.badge !== 'All';

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (
          filters.category !== 'All' &&
          product.category.toLowerCase() !== filters.category.toLowerCase()
        ) {
          return false;
        }

        // Search query filter
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesDesc = product.short_desc.toLowerCase().includes(query);
          const matchesCategory = product.category.toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesCategory) {
            return false;
          }
        }

        // Max price filter
        if (product.price > filters.maxPrice) {
          return false;
        }

        // Badge filter
        if (filters.badge !== 'All' && product.badge !== filters.badge) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'reviews':
            return b.reviews - a.reviews;
          case 'discount': {
            const discA = a.oldPrice ? a.oldPrice - a.price : 0;
            const discB = b.oldPrice ? b.oldPrice - b.price : 0;
            return discB - discA;
          }
          default:
            return a.id - b.id;
        }
      });
  }, [products, filters]);

  return (
    <div className="catalog-section" id="products-catalog">
      {/* Filter and Control Bar */}
      <div className="card border-0 rounded-4 shadow-xs bg-white p-3 p-md-4 mb-4">
        <div className="row g-3 align-items-center">
          {/* Active Category Title & Counts */}
          <div className="col-lg-4 col-md-5">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-dark text-white p-2 rounded-3 shadow-2xs">
                <Filter size={18} />
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {filters.category === 'All' ? 'All Products' : `${filters.category} Collection`}
                </h5>
                <small className="text-muted">
                  Showing <span className="fw-semibold text-dark">{filteredProducts.length}</span> of{' '}
                  <span className="fw-semibold text-dark">{products.length}</span> items
                  {dataSource === 'fallback' && ' (Demo Cache)'}
                </small>
              </div>
            </div>
          </div>

          {/* Controls: Price Slider, Badge Filter, Sort By */}
          <div className="col-lg-8 col-md-7">
            <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-3">
              {/* Badge Filter */}
              <div className="d-flex align-items-center gap-1.5">
                <select
                  className="form-select form-select-sm rounded-pill border-secondary-subtle bg-light px-3 py-1.5"
                  value={filters.badge}
                  onChange={(e) => onFilterChange({ badge: e.target.value })}
                  aria-label="Filter by tag"
                >
                  <option value="All">All Badges</option>
                  {availableBadges.map((badge) => (
                    <option key={badge} value={badge}>
                      {badge}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="d-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill border border-secondary-subtle">
                <DollarSign size={14} className="text-muted" />
                <span className="small text-muted text-nowrap" style={{ fontSize: '0.75rem' }}>
                  Max: <strong className="text-dark">${Math.min(filters.maxPrice, maxAvailablePrice)}</strong>
                </span>
                <input
                  type="range"
                  className="form-range"
                  style={{ width: '90px' }}
                  min="20"
                  max={maxAvailablePrice}
                  step="5"
                  value={Math.min(filters.maxPrice, maxAvailablePrice)}
                  onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                  aria-label="Price range"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="d-flex align-items-center gap-1.5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light border-secondary-subtle rounded-start-pill text-muted px-2.5">
                    <ArrowUpDown size={14} />
                  </span>
                  <select
                    className="form-select form-select-sm rounded-end-pill border-secondary-subtle bg-light py-1.5"
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
                    aria-label="Sort products"
                  >
                    <option value="featured">Featured / Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated (Stars)</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                </div>
              </div>

              {/* Reset Filters button */}
              {hasActiveFilters && (
                <button
                  onClick={onResetFilters}
                  className="btn btn-sm btn-outline-danger rounded-pill d-inline-flex align-items-center gap-1 px-3 py-1.5 text-nowrap"
                  title="Reset all filters"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Pill Tags */}
        {hasActiveFilters && (
          <div className="d-flex flex-wrap align-items-center gap-2 pt-3 mt-3 border-top">
            <span className="text-muted small fw-semibold">Active Filters:</span>
            {filters.category !== 'All' && (
              <span className="badge bg-light text-dark border rounded-pill d-inline-flex align-items-center gap-1 px-2.5 py-1.5">
                Category: {filters.category}
                <button
                  type="button"
                  className="btn-close ms-1 p-0"
                  style={{ fontSize: '0.55rem' }}
                  onClick={() => onFilterChange({ category: 'All' })}
                />
              </span>
            )}
            {filters.search && (
              <span className="badge bg-light text-dark border rounded-pill d-inline-flex align-items-center gap-1 px-2.5 py-1.5">
                Query: "{filters.search}"
                <button
                  type="button"
                  className="btn-close ms-1 p-0"
                  style={{ fontSize: '0.55rem' }}
                  onClick={() => onFilterChange({ search: '' })}
                />
              </span>
            )}
            {filters.badge !== 'All' && (
              <span className="badge bg-light text-dark border rounded-pill d-inline-flex align-items-center gap-1 px-2.5 py-1.5">
                Badge: {filters.badge}
                <button
                  type="button"
                  className="btn-close ms-1 p-0"
                  style={{ fontSize: '0.55rem' }}
                  onClick={() => onFilterChange({ badge: 'All' })}
                />
              </span>
            )}
            {filters.maxPrice < maxAvailablePrice && (
              <span className="badge bg-light text-dark border rounded-pill d-inline-flex align-items-center gap-1 px-2.5 py-1.5">
                Under ${filters.maxPrice}
                <button
                  type="button"
                  className="btn-close ms-1 p-0"
                  style={{ fontSize: '0.55rem' }}
                  onClick={() => onFilterChange({ maxPrice: maxAvailablePrice })}
                />
              </span>
            )}
            <button
              onClick={onResetFilters}
              className="btn btn-link btn-sm text-decoration-none text-muted p-0 small ms-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Loading State: Skeletons */}
      {loading && (
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2 col-xxl-2">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                <div
                  className="placeholder-glow"
                  style={{ height: '180px', backgroundColor: '#e2e8f0' }}
                >
                  <span className="placeholder w-100 h-100"></span>
                </div>
                <div className="card-body p-3 placeholder-glow">
                  <div className="placeholder col-4 mb-2 rounded"></div>
                  <div className="placeholder col-8 mb-2 rounded"></div>
                  <div className="placeholder col-12 mb-3 rounded"></div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <div className="placeholder col-4 py-2 rounded"></div>
                    <div className="placeholder col-3 py-2 rounded-pill"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="card border-0 rounded-4 shadow-sm bg-white p-5 text-center my-4">
          <div className="mx-auto mb-3 bg-danger-subtle text-danger p-3 rounded-circle d-inline-block">
            <AlertTriangle size={36} />
          </div>
          <h4 className="fw-bold text-dark">Failed to load live products</h4>
          <p className="text-muted max-w-md mx-auto mb-4">{error}</p>
          <div className="d-flex justify-content-center gap-3">
            <button onClick={onRetry} className="btn btn-primary rounded-pill px-4 py-2 shadow-xs">
              <RotateCcw size={16} className="me-1" /> Retry REST API
            </button>
          </div>
        </div>
      )}

      {/* Empty Filter Results State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="card border-0 rounded-4 shadow-sm bg-white p-5 text-center my-4">
          <div className="mx-auto mb-3 bg-light text-muted p-4 rounded-circle d-inline-block">
            <Filter size={40} />
          </div>
          <h4 className="fw-bold text-dark">No products match your criteria</h4>
          <p className="text-muted max-w-md mx-auto mb-4">
            Try adjusting your search keywords, clearing selected category filters, or expanding the price range slider.
          </p>
          <div>
            <button
              onClick={onResetFilters}
              className="btn btn-primary rounded-pill px-4 py-2 shadow-xs d-inline-flex align-items-center gap-2"
            >
              <RotateCcw size={16} /> Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
