import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Award, Sparkles, Compass } from 'lucide-react';

interface HeroBannerProps {
  onExplore: (category?: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore }) => {
  return (
    <div className="mb-5">
      {/* Editorial Campaign Hero Showcase */}
      <div className="rounded-4 overflow-hidden border border-slate-200/90 bg-white shadow-xs position-relative">
        <div className="row g-0 align-items-stretch">
          {/* Left Hero Content */}
          <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-slate-100 border border-slate-200 mb-3">
                <Sparkles size={13} className="text-slate-900" />
                <span className="text-slate-800 text-uppercase tracking-widest fw-bold" style={{ fontSize: '0.68rem' }}>
                  Autumn / Winter 2026 Archive · SoHo &amp; Milan Atelier
                </span>
              </div>

              <h1 className="display-5 font-black text-slate-950 tracking-tight mb-3" style={{ lineHeight: '1.12' }}>
                Architectural Silhouette Meets Quiet Luxury.
              </h1>

              <p className="lead text-slate-600 mb-4 pe-lg-4" style={{ fontSize: '1.02rem', lineHeight: '1.68' }}>
                Crafted from heavyweight organic cottons, full-grain Italian leathers, and
                fine merino blends. Discover 120+ permanent wardrobe foundations designed to
                transcend seasonal trends.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-2.5 mb-4">
                <button
                  onClick={() => onExplore('All')}
                  className="btn btn-dark rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2 fw-bold shadow-xs"
                >
                  Explore Full Archive <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => onExplore('Men')}
                  className="btn btn-light border border-slate-200 rounded-pill px-3.5 py-2 text-slate-800 small fw-semibold hover:border-slate-900 transition-all"
                >
                  Menswear
                </button>
                <button
                  onClick={() => onExplore('Women')}
                  className="btn btn-light border border-slate-200 rounded-pill px-3.5 py-2 text-slate-800 small fw-semibold hover:border-slate-900 transition-all"
                >
                  Womenswear
                </button>
                <button
                  onClick={() => onExplore('Shoes')}
                  className="btn btn-light border border-slate-200 rounded-pill px-3.5 py-2 text-slate-800 small fw-semibold hover:border-slate-900 transition-all"
                >
                  Footwear
                </button>
                <button
                  onClick={() => onExplore('Accessories')}
                  className="btn btn-light border border-slate-200 rounded-pill px-3.5 py-2 text-slate-800 small fw-semibold hover:border-slate-900 transition-all"
                >
                  Objects &amp; Leather
                </button>
              </div>
            </div>

            {/* Editorial Metrics Strip */}
            <div className="pt-3 border-top border-slate-100 d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-4">
                <div>
                  <div className="font-black text-slate-950 tabular-nums" style={{ fontSize: '1.05rem' }}>120+</div>
                  <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Curated Editions</div>
                </div>
                <div className="vr opacity-25" />
                <div>
                  <div className="font-black text-slate-950 tabular-nums" style={{ fontSize: '1.05rem' }}>4.9 ★</div>
                  <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Verified Client Score</div>
                </div>
                <div className="vr opacity-25" />
                <div>
                  <div className="font-black text-slate-950 tabular-nums" style={{ fontSize: '1.05rem' }}>24h</div>
                  <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Atelier Dispatch</div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-1.5 text-slate-500" style={{ fontSize: '0.75rem' }}>
                <Compass size={14} className="text-slate-800" />
                <span>Complimentary Express Courier Over $75</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image (LCP Candidate) */}
          <div className="col-lg-5 position-relative bg-slate-100" style={{ minHeight: '360px' }}>
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
              alt="ShopSphere Studio Autumn/Winter 2026 Editorial Lookbook"
              className="w-100 h-100 object-fit-cover"
              fetchPriority="high"
              decoding="async"
              style={{ minHeight: '380px' }}
            />
            <div
              className="position-absolute bottom-0 start-0 end-0 m-3 p-3 rounded-3 border border-white/40 shadow-sm d-flex align-items-center justify-content-between"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <div>
                <span className="badge bg-slate-950 text-white rounded-pill mb-1" style={{ fontSize: '0.62rem' }}>
                  LOOKBOOK 04 / 26
                </span>
                <div className="fw-bold text-slate-900 small">The Monolith Tailoring Capsule</div>
                <span className="text-slate-500" style={{ fontSize: '0.72rem' }}>
                  240 GSM Organic Cotton &amp; Italian Calfskin · From $59
                </span>
              </div>
              <button
                type="button"
                onClick={() => onExplore('Women')}
                className="btn btn-dark btn-sm rounded-circle p-2 flex-shrink-0"
                aria-label="Explore Women Lookbook"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Campaign Value Pillars */}
      <div className="row g-2.5 mt-2">
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-3 border border-slate-200/80 d-flex align-items-center gap-2.5 shadow-2xs">
            <div className="p-2 rounded-2 bg-slate-100 text-slate-900 flex-shrink-0">
              <Truck size={16} />
            </div>
            <div>
              <div className="fw-bold text-slate-900" style={{ fontSize: '0.78rem' }}>Complimentary Express</div>
              <span className="text-slate-500" style={{ fontSize: '0.7rem' }}>Free air courier over $75</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-3 border border-slate-200/80 d-flex align-items-center gap-2.5 shadow-2xs">
            <div className="p-2 rounded-2 bg-slate-100 text-slate-900 flex-shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="fw-bold text-slate-900" style={{ fontSize: '0.78rem' }}>Provenance Guaranteed</div>
              <span className="text-slate-500" style={{ fontSize: '0.7rem' }}>100% certified natural fibers</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-3 border border-slate-200/80 d-flex align-items-center gap-2.5 shadow-2xs">
            <div className="p-2 rounded-2 bg-slate-100 text-slate-900 flex-shrink-0">
              <RotateCcw size={16} />
            </div>
            <div>
              <div className="fw-bold text-slate-900" style={{ fontSize: '0.78rem' }}>30-Day Concierge Return</div>
              <span className="text-slate-500" style={{ fontSize: '0.7rem' }}>Prepaid doorstep collection</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-3 border border-slate-200/80 d-flex align-items-center gap-2.5 shadow-2xs">
            <div className="p-2 rounded-2 bg-slate-100 text-slate-900 flex-shrink-0">
              <Award size={16} />
            </div>
            <div>
              <div className="fw-bold text-slate-900" style={{ fontSize: '0.78rem' }}>VIP Studio Privilege</div>
              <span className="text-slate-500" style={{ fontSize: '0.7rem' }}>Use code STUDENT20 for 20% off</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

