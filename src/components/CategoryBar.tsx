import React from 'react';
import { Category } from '../types/ecommerce';
import { Layers } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  productCounts: Record<string, number>;
  totalProductsCount: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  productCounts,
  totalProductsCount,
}) => {
  return (
    <div className="mb-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Layers size={22} className="text-primary" /> Browse by Department
          </h4>
          <p className="text-muted small mb-0">Select a category to filter the catalog collection</p>
        </div>
        <button
          onClick={() => onSelectCategory('All')}
          className={`btn btn-sm rounded-pill px-3 ${
            activeCategory === 'All' ? 'btn-primary' : 'btn-outline-secondary'
          }`}
        >
          View All ({totalProductsCount})
        </button>
      </div>

      <div className="row g-3">
        {/* 'All' Category Tile */}
        <div className="col-6 col-md-4 col-lg">
          <div
            onClick={() => onSelectCategory('All')}
            className={`card rounded-4 overflow-hidden cursor-pointer h-100 transition-all ${
              activeCategory === 'All'
                ? 'border-2 border-dark bg-slate-100 shadow-xs'
                : 'border border-hairline bg-white hover:border-dark shadow-2xs'
            }`}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
          >
            <div className="p-3 d-flex flex-column justify-content-between h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-dark text-white rounded-pill text-xs">Catalog</span>
                <span className="text-muted small fw-semibold">{totalProductsCount} items</span>
              </div>
              <h6 className="fw-bold text-dark mb-0">All Collections</h6>
              <small className="text-muted">Complete archive</small>
            </div>
          </div>
        </div>

        {/* Dynamic categories from API */}
        {categories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
          const count = productCounts[cat.name] || 0;

          return (
            <div key={cat.id} className="col-6 col-md-4 col-lg">
              <div
                onClick={() => onSelectCategory(cat.name)}
                className={`card rounded-4 overflow-hidden h-100 transition-all position-relative ${
                  isActive
                    ? 'border-2 border-dark bg-slate-100 shadow-xs'
                    : 'border border-hairline bg-white hover:border-dark shadow-2xs'
                }`}
                style={{ cursor: 'pointer', minHeight: '110px' }}
              >
                <div className="position-absolute top-0 end-0 bottom-0 w-40 opacity-20 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-100 h-100 object-fit-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
                <div className="p-3 d-flex flex-column justify-content-between h-100 position-relative z-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className={`badge rounded-pill ${isActive ? 'bg-primary text-white' : 'bg-light text-dark border'}`}>
                      {cat.name}
                    </span>
                    <span className="text-muted small fw-semibold">{count} items</span>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{cat.name}</h6>
                    <small className="text-muted text-truncate d-block" style={{ fontSize: '0.75rem' }}>
                      {cat.description}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
