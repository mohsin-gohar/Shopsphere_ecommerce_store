import React from 'react';
import { Category } from '../types/ecommerce';
import { Layers, ArrowUpRight } from 'lucide-react';

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
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-3">
        <div>
          <span className="text-slate-500 text-uppercase tracking-widest fw-bold d-block mb-0.5" style={{ fontSize: '0.68rem' }}>
            Curated Departments
          </span>
          <h4 className="fw-black text-slate-950 mb-0 d-flex align-items-center gap-2 tracking-tight">
            <Layers size={20} className="text-slate-900" /> Browse by Atelier Division
          </h4>
        </div>
        <button
          onClick={() => onSelectCategory('All')}
          className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-semibold transition-all ${
            activeCategory === 'All' ? 'btn-dark text-white shadow-2xs' : 'btn-outline-dark'
          }`}
        >
          View Complete Archive ({totalProductsCount})
        </button>
      </div>

      <div className="row g-3">
        {/* 'All' Category Tile */}
        <div className="col-6 col-md-4 col-lg">
          <div
            onClick={() => onSelectCategory('All')}
            className={`card rounded-4 overflow-hidden h-100 transition-all ${
              activeCategory === 'All'
                ? 'border-2 border-slate-950 bg-slate-950 text-white shadow-sm'
                : 'border border-slate-200/90 bg-white hover:border-slate-400 shadow-2xs'
            }`}
            style={{ cursor: 'pointer', minHeight: '116px', transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="p-3.5 d-flex flex-column justify-content-between h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span
                  className={`badge rounded-pill text-xs px-2.5 py-1 ${
                    activeCategory === 'All' ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
                  }`}
                >
                  Archive
                </span>
                <span
                  className="small fw-bold tabular-nums"
                  style={{
                    fontSize: '0.75rem',
                    color: activeCategory === 'All' ? '#cbd5e1' : '#64748b',
                  }}
                >
                  {totalProductsCount} pieces
                </span>
              </div>
              <div>
                <h6
                  className={`fw-bold mb-0.5 d-flex align-items-center justify-content-between ${
                    activeCategory === 'All' ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  <span>All Collections</span>
                  <ArrowUpRight size={14} className="opacity-75" />
                </h6>
                <small
                  style={{
                    fontSize: '0.74rem',
                    color: activeCategory === 'All' ? '#94a3b8' : '#64748b',
                  }}
                >
                  Full seasonal curation
                </small>
              </div>
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
                    ? 'border-2 border-slate-950 bg-slate-950 text-white shadow-sm'
                    : 'border border-slate-200/90 bg-white hover:border-slate-400 shadow-2xs'
                }`}
                style={{ cursor: 'pointer', minHeight: '116px', transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="position-absolute top-0 end-0 bottom-0 w-40 opacity-20 overflow-hidden">
                  <img
                    src={cat?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
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
                <div className="p-3.5 d-flex flex-column justify-content-between h-100 position-relative z-1">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className={`badge rounded-pill px-2.5 py-1 ${
                        isActive ? 'bg-white text-slate-950' : 'bg-slate-100 text-slate-900 border border-slate-200'
                      }`}
                    >
                      {cat.name}
                    </span>
                    <span
                      className="small fw-bold tabular-nums"
                      style={{
                        fontSize: '0.75rem',
                        color: isActive ? '#cbd5e1' : '#64748b',
                      }}
                    >
                      {count} pieces
                    </span>
                  </div>
                  <div>
                    <h6
                      className={`fw-bold mb-0.5 d-flex align-items-center justify-content-between ${
                        isActive ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ArrowUpRight size={14} className="opacity-75" />
                    </h6>
                    <small
                      className="text-truncate d-block"
                      style={{
                        fontSize: '0.74rem',
                        color: isActive ? '#94a3b8' : '#64748b',
                      }}
                    >
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

