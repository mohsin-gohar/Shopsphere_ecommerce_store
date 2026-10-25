import React, { useMemo, useState, useEffect } from 'react';
import { Product, Category, SortOption, FilterState } from '../types/ecommerce';
import { ProductCard } from './ProductCard';
import { Filter, RotateCcw, AlertTriangle, ArrowUpDown, DollarSign, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(24);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Find highest price for slider max
  const maxAvailablePrice = useMemo(() => {
    if (products.length === 0) return 200;
    return Math.max(...products.map((p) => Number(p?.price) || 0));
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
    filters.minRating > 0 ||
    filters.badge !== 'All';

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (
          filters.category !== 'All' &&
          (product?.category || '').toLowerCase() !== filters.category.toLowerCase()
        ) {
          return false;
        }

        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchesName = (product?.name || '').toLowerCase().includes(query);
          const matchesDesc = (product?.short_desc || '').toLowerCase().includes(query);
          const matchesCategory = (product?.category || '').toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesCategory) {
            return false;
          }
        }

        if ((Number(product?.price) || 0) > filters.maxPrice) {
          return false;
        }

        if (filters.minRating > 0 && (Number(product?.rating) || 0) < filters.minRating) {
          return false;
        }

        if (filters.badge !== 'All' && product?.badge !== filters.badge) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return (Number(a?.price) || 0) - (Number(b?.price) || 0);
          case 'price-high':
            return (Number(b?.price) || 0) - (Number(a?.price) || 0);
          case 'rating':
            return (Number(b?.rating) || 0) - (Number(a?.rating) || 0);
          case 'reviews':
            return (Number(b?.reviews) || 0) - (Number(a?.reviews) || 0);
          case 'discount': {
            const discA = a?.oldPrice ? Number(a.oldPrice) - Number(a.price || 0) : 0;
            const discB = b?.oldPrice ? Number(b.oldPrice) - Number(b.price || 0) : 0;
            return discB - discA;
          }
          default:
            return (Number(a?.id) || 0) - (Number(b?.id) || 0);
        }
      });
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="catalog-section" id="products-catalog">
      {/* Filter and Control Bar */}
      <div className="card border border-slate-200/80 rounded-4 shadow-2xs bg-white p-3.5 p-md-4 mb-4">
        <div className="row g-3 align-items-center">
          {/* Active Category Title & Counts */}
          <div className="col-lg-4 col-md-5">
            <div className="d-flex align-items-center gap-2.5">
              <div className="bg-slate-950 text-white p-2.5 rounded-3 shadow-2xs">
                <Filter size={18} />
              </div>
              <div>
                <h5 className="fw-black mb-0 text-slate-950 tracking-tight">
                  {filters.category === 'All' ? 'Curated Archive' : `${filters.category} Collection`}
                </h5>
                <small className="text-slate-500">
                  Showing{' '}
                  <span className="fw-bold text-slate-900 tabular-nums">
                    {filteredProducts.length === 0
                      ? 0
                      : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                          currentPage * itemsPerPage,
                          filteredProducts.length
                        )}`}
                  </span>{' '}
                  of <span className="fw-bold text-slate-900 tabular-nums">{filteredProducts.length}</span> pieces
                  {dataSource === 'fallback' && ' · Verified Cache'}
                </small>
              </div>
            </div>
          </div>

          {/* Controls: Price Slider, Badge Filter, Sort By */}
          <div className="col-lg-8 col-md-7">
            <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-2.5">
              {/* Badge Filter */}
              <div className="d-flex align-items-center">
                <select
                  className="form-select form-select-sm rounded-pill border-slate-200 bg-slate-50 px-3 py-1.5 fw-medium text-slate-800"
                  value={filters.badge}
                  onChange={(e) => onFilterChange({ badge: e.target.value })}
                  aria-label="Filter by tag"
                >
                  <option value="All">All Editions</option>
                  {availableBadges.map((badge) => (
                    <option key={badge} value={badge}>
                      {badge}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Rating Filter */}
              <div className="d-flex align-items-center">
                <select
                  className="form-select form-select-sm rounded-pill border-slate-200 bg-slate-50 px-3 py-1.5 fw-medium text-slate-800"
                  value={filters.minRating}
                  onChange={(e) => onFilterChange({ minRating: Number(e.target.value) })}
                  aria-label="Filter by minimum rating"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4.0★ &amp; Above</option>
                  <option value={4.5}>4.5★ &amp; Above</option>
                  <option value={4.8}>4.8★ &amp; Above</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="d-flex align-items-center gap-2 bg-slate-50 px-3 py-1 rounded-pill border border-slate-200">
                <DollarSign size={14} className="text-slate-500" />
                <span className="small text-slate-600 text-nowrap" style={{ fontSize: '0.75rem' }}>
                  Max: <strong className="text-slate-950 tabular-nums">${Math.min(filters.maxPrice, maxAvailablePrice)}</strong>
                </span>
                <input
                  type="range"
                  className="form-range"
                  style={{ width: '85px' }}
                  min="20"
                  max={maxAvailablePrice}
                  step="5"
                  value={Math.min(filters.maxPrice, maxAvailablePrice)}
                  onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                  aria-label="Price range"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="d-flex align-items-center">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-slate-50 border-slate-200 rounded-start-pill text-slate-500 px-2.5">
                    <ArrowUpDown size={14} />
                  </span>
                  <select
                    className="form-select form-select-sm rounded-end-pill border-slate-200 bg-slate-50 py-1.5 fw-medium text-slate-800"
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
                    aria-label="Sort products"
                  >
                    <option value="featured">Curated Order</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="discount">Largest Privilege</option>
                  </select>
                </div>
              </div>

              {/* Reset Filters button */}
              {hasActiveFilters && (
                <button
                  onClick={onResetFilters}
                  className="btn btn-sm btn-outline-dark rounded-pill d-inline-flex align-items-center gap-1 px-3 py-1.5 text-nowrap fw-semibold"
                  title="Reset all filters"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Pill Tags */}
        {hasActiveFilters && (
          <div className="d-flex flex-wrap align-items-center gap-2 pt-3 mt-3 border-top border-slate-100">
            <span className="text-slate-500 small fw-semibold">Active Refinements:</span>
            {filters.category !== 'All' && (
              <span className="badge bg-slate-100 text-slate-900 border border-slate-200 rounded-pill d-inline-flex align-items-center gap-1.5 px-3 py-1.5">
                Division: {filters.category}
                <button
                  type="button"
                  className="btn-close ms-1 p-0"
                  style={{ fontSize: '0.55rem' }}
                  onClick={() => onFilterChange({ category: 'All' })}
                />
              </span>
            )}
            {filters.search && (
              <span className="badge bg-slate-100 text-slate-900 border border-slate-200 rounded-pill d-inline-flex align-items-center gap-1.5 px-3 py-1.5">
                Query: &ldquo;{filters.search}&rdquo;
                <button
                  type="button"
                  className="btn-close ms-1 p-0"
                  style={{ fontSize: '0.55rem' }}
                  onClick={() => onFilterChange({ search: '' })}
                />
              </span>
            )}
            {filters.badge !== 'All' && (
              <span className="badge bg-slate-100 text-slate-900 border border-slate-200 rounded-pill d-inline-flex align-items-center gap-1.5 px-3 py-1.5">
                Edition: {filters.badge}
                <button
                  type="button"
                  className="btn-close ms-1 p-0"
                  style={{ fontSize: '0.55rem' }}
                  onClick={() => onFilterChange({ badge: 'All' })}
                />
              </span>
            )}
            {filters.minRating > 0 && (
              <span className="badge bg-slate-100 text-slate-900 border border-slate-200 rounded-pill d-inline-flex align-items-center gap-1.5 px-3 py-1.5">
                Rating: {filters.minRating}★+
                <button
                  type="button"
                  className="btn-close ms-1 p-0"
                  style={{ fontSize: '0.55rem' }}
                  onClick={() => onFilterChange({ minRating: 0 })}
                />
              </span>
            )}
            {filters.maxPrice < maxAvailablePrice && (
              <span className="badge bg-slate-100 text-slate-900 border border-slate-200 rounded-pill d-inline-flex align-items-center gap-1.5 px-3 py-1.5">
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
              className="btn btn-link btn-sm text-decoration-none text-slate-600 hover:text-slate-950 p-0 small ms-1 fw-semibold"
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
            <div key={i} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-2xs border border-slate-200/80 rounded-4 overflow-hidden bg-white">
                <div
                  className="placeholder-glow"
                  style={{ height: '260px', backgroundColor: '#f1f5f9' }}
                >
                  <span className="placeholder w-100 h-100"></span>
                </div>
                <div className="card-body p-3.5 placeholder-glow">
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
        <div className="card border border-slate-200 rounded-4 shadow-2xs bg-white p-5 text-center my-4">
          <div className="mx-auto mb-3 bg-danger-subtle text-danger p-3 rounded-circle d-inline-block">
            <AlertTriangle size={36} />
          </div>
          <h4 className="fw-bold text-slate-950">Failed to load live products</h4>
          <p className="text-slate-500 max-w-md mx-auto mb-4">{error}</p>
          <div className="d-flex justify-content-center gap-3">
            <button onClick={onRetry} className="btn btn-dark rounded-pill px-4 py-2 shadow-2xs">
              <RotateCcw size={16} className="me-1" /> Retry REST API
            </button>
          </div>
        </div>
      )}

      {/* Empty Filter Results State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="card border border-slate-200 rounded-4 shadow-2xs bg-white p-5 text-center my-4">
          <div className="mx-auto mb-3 bg-slate-100 text-slate-500 p-4 rounded-circle d-inline-block">
            <Filter size={40} />
          </div>
          <h4 className="fw-bold text-slate-950">No pieces match your current refinement</h4>
          <p className="text-slate-500 max-w-md mx-auto mb-4">
            Try adjusting your search keywords, clearing selected department filters, or expanding the maximum price slider.
          </p>
          <div>
            <button
              onClick={onResetFilters}
              className="btn btn-dark rounded-pill px-4 py-2.5 shadow-2xs d-inline-flex align-items-center gap-2 fw-semibold"
            >
              <RotateCcw size={16} /> Reset All Refinements
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && paginatedProducts.length > 0 && (
        <>
          <div className="row g-4">
            {paginatedProducts.map((product) => (
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

          {/* Luxury Pagination & Archive Density Bar */}
          {filteredProducts.length > 24 && (
            <div className="card border border-slate-200/80 rounded-4 bg-white p-3.5 px-4 mt-5 shadow-2xs d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-2 small text-slate-600">
                <Layers size={15} className="text-slate-900" />
                <span>
                  Viewing page <strong className="text-slate-950 tabular-nums">{currentPage}</strong> of{' '}
                  <strong className="text-slate-950 tabular-nums">{totalPages}</strong> ({filteredProducts.length} archive pieces)
                </span>
              </div>

              {totalPages > 1 && (
                <div className="d-flex align-items-center gap-1.5 flex-wrap justify-content-center">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageSelect(currentPage - 1)}
                    className="btn btn-sm btn-light border border-slate-200 rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1 fw-semibold disabled:opacity-40"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageSelect(page)}
                      className={`btn btn-sm rounded-circle fw-bold tabular-nums ${
                        currentPage === page
                          ? 'btn-dark text-white shadow-2xs'
                          : 'btn-light border border-slate-200 text-slate-700'
                      }`}
                      style={{ width: '34px', height: '34px', padding: 0 }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageSelect(currentPage + 1)}
                    className="btn btn-sm btn-light border border-slate-200 rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1 fw-semibold disabled:opacity-40"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (itemsPerPage === 24) {
                      setItemsPerPage(200);
                      setCurrentPage(1);
                    } else {
                      setItemsPerPage(24);
                      setCurrentPage(1);
                    }
                  }}
                  className="btn btn-sm btn-outline-dark rounded-pill px-3.5 py-1.5 fw-semibold"
                >
                  {itemsPerPage === 24
                    ? `Show All ${filteredProducts.length} Pieces`
                    : 'Paginate (24 / Page)'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

