import React from 'react';
import { ArrowRight, Sparkles, Feather, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onExploreShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onExploreShop }) => {
  return (
    <div className="py-4 py-md-5">
      {/* Hero Headline Section */}
      <div className="text-center max-w-3xl mx-auto mb-5 px-3">
        <span className="text-muted small text-uppercase tracking-wider fw-semibold d-block mb-2">
          About ShopSphere Studio
        </span>
        <h1 className="display-5 fw-bold text-dark tracking-tight mb-3">
          Quiet luxury, architectural silhouettes, and lasting daily utility.
        </h1>
        <p className="lead text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
          Founded with a singular conviction: clothing and accessories should be thoughtfully
          crafted, enduring in quality, and completely stripped of unnecessary noise.
        </p>
      </div>

      {/* Hero Visual Banner with Fallback */}
      <div className="rounded-4 overflow-hidden mb-5 border border-hairline position-relative shadow-2xs">
        <div
          className="w-100 position-relative d-flex align-items-end p-4 p-md-5"
          style={{
            minHeight: '400px',
            backgroundImage: `linear-gradient(to top, rgba(17, 24, 39, 0.85) 0%, rgba(17, 24, 39, 0.2) 60%, transparent 100%), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-white max-w-xl position-relative z-1">
            <span className="small text-uppercase tracking-widest text-light opacity-75 d-block mb-1">
              Our Studio Philosophy
            </span>
            <h3 className="fw-bold mb-2">Designed in the Atelier, Crafted for the World</h3>
            <p className="small text-light opacity-90 mb-0">
              Each garment in our collection is tested for drape, wash longevity, and seamless
              versatility across seasons.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="mb-5">
        <div className="d-flex align-items-baseline justify-content-between border-bottom pb-3 mb-4">
          <h4 className="fw-bold text-dark mb-0">Our Core Pillars</h4>
          <span className="text-muted small">01 — 04 Standards</span>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 p-4 border border-hairline rounded-3 bg-white shadow-2xs">
              <span className="text-muted small fw-semibold font-monospace d-block mb-2">01.</span>
              <h5 className="fw-bold text-dark mb-2">Material Integrity</h5>
              <p className="text-secondary small mb-0 leading-relaxed">
                We select heavyweight organic cottons, genuine full-grain leathers, and breathable
                linen blends designed to age gracefully over time.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card h-100 p-4 border border-hairline rounded-3 bg-white shadow-2xs">
              <span className="text-muted small fw-semibold font-monospace d-block mb-2">02.</span>
              <h5 className="fw-bold text-dark mb-2">Minimalist Form</h5>
              <p className="text-secondary small mb-0 leading-relaxed">
                Our silhouettes embrace neutral geometry, eliminating loud branding and gaudy
                embellishments in favor of clean proportions.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card h-100 p-4 border border-hairline rounded-3 bg-white shadow-2xs">
              <span className="text-muted small fw-semibold font-monospace d-block mb-2">03.</span>
              <h5 className="fw-bold text-dark mb-2">Fair Transparency</h5>
              <p className="text-secondary small mb-0 leading-relaxed">
                Direct-to-consumer model without distributor markups. We state true production costs
                and maintain strict ethical labor standards.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card h-100 p-4 border border-hairline rounded-3 bg-white shadow-2xs">
              <span className="text-muted small fw-semibold font-monospace d-block mb-2">04.</span>
              <h5 className="fw-bold text-dark mb-2">Sustainable Circle</h5>
              <p className="text-secondary small mb-0 leading-relaxed">
                100% plastic-free packaging, low-impact non-toxic dyes, and biodegradable shipping
                cartons standard on all orders worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Lookbook & Craft Story */}
      <div className="card border border-hairline rounded-4 p-4 p-md-5 bg-white mb-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <span className="text-muted small text-uppercase tracking-wider fw-semibold d-block mb-2">
              From Concept to Wardrobe
            </span>
            <h3 className="fw-bold text-dark mb-3">
              Craftsmanship you can feel from the first wear.
            </h3>
            <p className="text-secondary small leading-relaxed mb-3">
              Every seam, cuff, and stitch has been calibrated by our pattern makers. Rather than
              chasing fast-fashion micro-trends that end up in landfills, we produce limited curated
              drops intended to form the permanent foundation of your personal style.
            </p>
            <div className="d-flex flex-column gap-2 mb-4">
              <div className="d-flex align-items-center gap-2 small text-dark">
                <CheckCircle2 size={16} className="text-dark flex-shrink-0" />
                <span>Heavyweight 240 GSM pre-shrunk cotton jerseys</span>
              </div>
              <div className="d-flex align-items-center gap-2 small text-dark">
                <CheckCircle2 size={16} className="text-dark flex-shrink-0" />
                <span>Vegetable-tanned full-grain leather goods</span>
              </div>
              <div className="d-flex align-items-center gap-2 small text-dark">
                <CheckCircle2 size={16} className="text-dark flex-shrink-0" />
                <span>Ergonomic cushioned footwear engineered for all-day walking</span>
              </div>
            </div>
            <button
              onClick={onExploreShop}
              className="btn btn-dark rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2 fw-medium"
            >
              Browse The Collection <ArrowRight size={16} />
            </button>
          </div>

          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-6">
                <img
                  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=700&q=80"
                  alt="Tailored craft"
                  className="w-100 rounded-3 object-fit-cover shadow-2xs"
                  style={{ height: '220px' }}
                />
              </div>
              <div className="col-6">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80"
                  alt="Minimal drape dress"
                  className="w-100 rounded-3 object-fit-cover shadow-2xs"
                  style={{ height: '220px' }}
                />
              </div>
              <div className="col-12">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
                  alt="Leather Sneaker Craft"
                  className="w-100 rounded-3 object-fit-cover shadow-2xs"
                  style={{ height: '180px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="row g-3 text-center mb-5">
        <div className="col-6 col-md-3">
          <div className="p-3 bg-light rounded-3 border border-hairline">
            <div className="fs-3 fw-bold text-dark tabular-nums">120+</div>
            <div className="text-muted small">Curated Essentials</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-light rounded-3 border border-hairline">
            <div className="fs-3 fw-bold text-dark tabular-nums">100%</div>
            <div className="text-muted small">Ethical Craftsmanship</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-light rounded-3 border border-hairline">
            <div className="fs-3 fw-bold text-dark tabular-nums">4.9 ★</div>
            <div className="text-muted small">Verified Client Score</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-light rounded-3 border border-hairline">
            <div className="fs-3 fw-bold text-dark tabular-nums">30 Days</div>
            <div className="text-muted small">Hassle-Free Returns</div>
          </div>
        </div>
      </div>

      {/* Global Flagship Ateliers */}
      <div className="card border border-hairline rounded-4 p-4 p-md-5 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <span className="text-muted small text-uppercase tracking-wider fw-semibold d-block mb-1">
            Global Presence
          </span>
          <h4 className="fw-bold text-dark mb-2">Our Flagship Boutiques &amp; Private Ateliers</h4>
          <p className="text-secondary small mb-0">
            Experience our textiles, custom bespoke alterations, and private client styling sessions in person.
          </p>
        </div>

        <div className="row g-3">
          <div className="col-sm-6 col-lg-3">
            <div className="p-3 rounded-3 bg-light border border-hairline h-100">
              <span className="badge bg-dark rounded-pill mb-2">New York</span>
              <h6 className="fw-bold text-dark mb-1">SoHo Flagship</h6>
              <div className="text-muted small mb-2">482 Broome Street, New York, NY 10013</div>
              <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                Mon – Sat: 11:00 AM – 7:00 PM<br />Sun: 12:00 PM – 6:00 PM
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="p-3 rounded-3 bg-light border border-hairline h-100">
              <span className="badge bg-dark rounded-pill mb-2">Milan</span>
              <h6 className="fw-bold text-dark mb-1">Brera Studio</h6>
              <div className="text-muted small mb-2">Via Fiori Chiari 14, 20121 Milano, Italy</div>
              <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                Tue – Sat: 10:30 AM – 7:30 PM<br />Private VIP appointments on Mon
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="p-3 rounded-3 bg-light border border-hairline h-100">
              <span className="badge bg-dark rounded-pill mb-2">London</span>
              <h6 className="fw-bold text-dark mb-1">Mayfair Townhouse</h6>
              <div className="text-muted small mb-2">24 Mount Street, Mayfair, London W1K 2RB</div>
              <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                Mon – Sat: 10:00 AM – 6:30 PM<br />Complimentary espresso lounge
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="p-3 rounded-3 bg-light border border-hairline h-100">
              <span className="badge bg-dark rounded-pill mb-2">Islamabad</span>
              <h6 className="fw-bold text-dark mb-1">F-7 Atelier Suite</h6>
              <div className="text-muted small mb-2">Kohsar Plaza, F-7/3, Islamabad 44000</div>
              <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                Mon – Sat: 11:00 AM – 8:00 PM<br />Bespoke tailoring &amp; express pickups
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
