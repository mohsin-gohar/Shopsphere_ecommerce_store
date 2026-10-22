import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Award } from 'lucide-react';

interface HeroBannerProps {
  onExplore: (category?: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore }) => {
  return (
    <div className="mb-5">
      {/* Editorial Campaign Hero Showcase */}
      <div className="rounded-4 overflow-hidden border border-hairline bg-white shadow-2xs position-relative">
        <div className="row g-0 align-items-stretch">
          {/* Left Hero Content */}
          <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center">
            <div className="mb-3">
              <span className="text-muted small text-uppercase tracking-wider fw-semibold">
                Studio Edition 2026 · REST API Live
              </span>
            </div>

            <h1 className="display-5 fw-bold text-dark tracking-tight mb-3">
              Essential Forms for Everyday Elegance
            </h1>

            <p className="lead text-secondary mb-4 pe-lg-3" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
              Designed with architectural restraint and crafted from natural textiles.
              Explore refined oversized tailoring, hand-finished footwear, and minimal leather goods.
            </p>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => onExplore('All')}
                className="btn btn-dark rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2 fw-medium shadow-2xs"
              >
                Shop All Collection <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onExplore('Men')}
                className="btn btn-light border border-hairline rounded-pill px-3 py-2 text-dark small fw-medium"
              >
                Men
              </button>
              <button
                onClick={() => onExplore('Women')}
                className="btn btn-light border border-hairline rounded-pill px-3 py-2 text-dark small fw-medium"
              >
                Women
              </button>
              <button
                onClick={() => onExplore('Shoes')}
                className="btn btn-light border border-hairline rounded-pill px-3 py-2 text-dark small fw-medium"
              >
                Footwear
              </button>
              <button
                onClick={() => onExplore('Accessories')}
                className="btn btn-light border border-hairline rounded-pill px-3 py-2 text-dark small fw-medium"
              >
                Accessories
              </button>
            </div>

            <div className="d-flex align-items-center gap-3 text-muted small pt-2 border-top border-hairline">
              <span>✓ 100% Cotton & Genuine Leather</span>
              <span aria-hidden="true">·</span>
              <span>✓ Complimentary Express Shipping</span>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="col-lg-5 position-relative bg-light min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
              alt="Editorial Studio Showcase"
              className="w-100 h-100 object-fit-cover"
              loading="eager"
              decoding="async"
              style={{ minHeight: '340px' }}
            />
            <div className="position-absolute bottom-0 start-0 m-3 p-2 px-3 bg-white bg-opacity-95 rounded-3 border border-hairline shadow-2xs">
              <div className="fw-bold text-dark small">New Season Curations</div>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                Handpicked essentials from $59
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Campaign Features */}
      <div className="row g-2.5 mt-2">
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-3 border border-slate-200 d-flex align-items-center gap-2.5 shadow-2xs">
            <Truck size={17} className="text-slate-800 flex-shrink-0" />
            <div>
              <div className="fw-bold text-dark small" style={{ fontSize: '0.78rem' }}>Express Courier</div>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>Free over $150</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-3 border border-slate-200 d-flex align-items-center gap-2.5 shadow-2xs">
            <ShieldCheck size={17} className="text-slate-800 flex-shrink-0" />
            <div>
              <div className="fw-bold text-dark small" style={{ fontSize: '0.78rem' }}>Certified Ethical</div>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>Natural textiles</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-3 border border-slate-200 d-flex align-items-center gap-2.5 shadow-2xs">
            <RotateCcw size={17} className="text-slate-800 flex-shrink-0" />
            <div>
              <div className="fw-bold text-dark small" style={{ fontSize: '0.78rem' }}>30-Day Returns</div>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>Doorstep pickup</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-3 border border-slate-200 d-flex align-items-center gap-2.5 shadow-2xs">
            <Award size={17} className="text-slate-800 flex-shrink-0" />
            <div>
              <div className="fw-bold text-dark small" style={{ fontSize: '0.78rem' }}>Atelier Standard</div>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>1,200+ Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
