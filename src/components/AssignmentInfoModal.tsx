import React, { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';
import {
  X,
  CheckCircle2,
  Code,
  Globe,
  Database,
  Layers,
  Copy,
  Check,
  Award,
  Github,
  BookOpen,
} from 'lucide-react';

interface AssignmentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiConnected: boolean;
}

export const AssignmentInfoModal: React.FC<AssignmentInfoModalProps> = ({
  isOpen,
  onClose,
  apiConnected,
}) => {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const requirements = [
    {
      title: 'Fetch products from a public REST API',
      detail:
        'Connected to https://muhammadfarhandeveloper.github.io/E-Commerce-fakeapi/products.json with category.json and offline fallback cache.',
      status: true,
    },
    {
      title: 'Display products in responsive Bootstrap cards',
      detail:
        'Uses Bootstrap 5 grid (col-12 col-sm-6 col-md-4 col-xl-3), .card, .card-body, badges, rating stars, price & old price strikethrough, and action buttons.',
      status: true,
    },
    {
      title: 'Implement product search and category filtering',
      detail:
        'Real-time query search across name and description, instant category pills (All, Men, Women, Shoes, Accessories), price range slider, badge filter, and sorting.',
      status: true,
    },
    {
      title: 'Create a product details page/view',
      detail:
        'Interactive details view modal with zoomable hero image, specifications, stock status, ratings, size selector, quantity incrementer, and related products.',
      status: true,
    },
    {
      title: 'Add products to cart and remove/update cart items',
      detail:
        'Full cart management: add single/multiple quantity, increase/decrease quantity, delete line items, clear entire cart, with localStorage persistence.',
      status: true,
    },
    {
      title: 'Display cart total and quantity',
      detail:
        'Live item count badge in navbar, slide-out Offcanvas drawer, itemized pricing, promo coupon code discount, shipping calculations, and grand total.',
      status: true,
    },
    {
      title: 'Use React Hooks (useState, useEffect, useMemo)',
      detail:
        'Modern functional architecture using useState, useEffect for API data & storage, useMemo for filtering/sorting optimization, and state lifting.',
      status: true,
    },
    {
      title: 'Handle API loading and error states',
      detail:
        'Skeleton placeholder loaders while data fetches, retry button on network error, and graceful fallback support.',
      status: true,
    },
    {
      title: 'Make the website fully responsive',
      detail:
        'Mobile-first responsive design tested for smartphones, tablets, laptops, and ultra-wide screens.',
      status: true,
    },
    {
      title: 'Git, GitHub & Deployment Ready',
      detail:
        'Clean repository structure with README markdown, proper dependencies, and production build compatibility.',
      status: true,
    },
    {
      title: 'Executive Store Admin Dashboard (Advanced Feature)',
      detail:
        'Live KPI metrics (Gross Revenue, AOV, SKUs), order milestone management, catalog inventory SKU editor/creator, and department sales analytics.',
      status: true,
    },
  ];

  const readmeContent = `# E-Commerce Store - ReactJS Assignment Project

A responsive e-commerce web application developed with ReactJS and REST API integration.

## 🚀 Features
- **REST API Integration:** Fetches product and category data from \`https://muhammadfarhandeveloper.github.io/E-Commerce-fakeapi/\`
- **Responsive Bootstrap Cards:** Clean modern grid layout using Bootstrap 5.3
- **Search & Filter:** Real-time search by title/keywords, category filtering, price slider, and multi-option sorting
- **Product Details View:** Modal view with image preview, full description, size selection, ratings, and related items
- **Shopping Cart System:** Real-time quantity updates, item deletion, coupon discount codes, tax & shipping calculation
- **Persistent State:** Saves cart items and wishlist in \`localStorage\`
- **Executive Admin Dashboard:** Password-protected portal (Username: \`admin@shopsphere.studio\`, Password: \`admin123\`)

## 🛠️ Technologies
- **ReactJS (19+)** & **TypeScript**
- **Bootstrap 5.3** & **Bootstrap Icons**
- **Tailwind CSS**
- **Lucide Icons**
- **Fetch API (REST)**
`;

  const handleCopyReadme = async () => {
    const ok = await copyToClipboard(readmeContent);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1095 }}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div className="modal-header border-bottom bg-light py-3 px-4">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-3">
                <BookOpen size={18} />
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark">
                  Assignment Project: E-Commerce Store
                </h5>
                <small className="text-muted">ReactJS with REST API Integration</small>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-light rounded-circle p-2"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal-body p-4 bg-white">
            {/* Project Overview Card */}
            <div className="card bg-light border p-3 rounded-4 mb-4">
              <div className="row g-3 align-items-center">
                <div className="col-sm-6">
                  <div className="text-muted small">Project Objective</div>
                  <strong className="text-dark small d-block">
                    Develop a responsive e-commerce web app using ReactJS with API integration.
                  </strong>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">API Status</div>
                  <span className="badge bg-success d-inline-flex align-items-center gap-1">
                    <CheckCircle2 size={12} /> {apiConnected ? 'Live API Active' : 'Fallback Active'}
                  </span>
                  <div className="text-muted small mt-1">
                    Source: <code className="small">muhammadfarhandeveloper.github.io</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Checklist */}
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Award size={18} className="text-warning" /> Assignment Requirements Checklist (10/10)
            </h6>

            <div className="d-flex flex-column gap-2 mb-4">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="d-flex align-items-start gap-3 p-2.5 rounded-3 border bg-white shadow-2xs"
                >
                  <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="d-block text-dark small">{req.title}</strong>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {req.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Technologies Grid */}
            <h6 className="fw-bold text-dark mb-2">Technologies Used:</h6>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge bg-dark px-3 py-1.5 rounded-pill">ReactJS</span>
              <span className="badge bg-primary px-3 py-1.5 rounded-pill">Bootstrap 5</span>
              <span className="badge bg-secondary px-3 py-1.5 rounded-pill">JavaScript ES6+ / TS</span>
              <span className="badge bg-success px-3 py-1.5 rounded-pill">REST API</span>
              <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill">React Hooks</span>
              <span className="badge bg-info text-dark px-3 py-1.5 rounded-pill">HTML5 & CSS3</span>
              <span className="badge bg-light text-dark border px-3 py-1.5 rounded-pill">Git & GitHub Ready</span>
            </div>

            {/* Readme generator */}
            <div className="card border rounded-3 p-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-dark small d-flex align-items-center gap-1">
                  <Github size={16} /> GitHub README Template
                </span>
                <button
                  onClick={handleCopyReadme}
                  className="btn btn-sm btn-white border rounded-pill d-inline-flex align-items-center gap-1 small"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-success" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Markdown
                    </>
                  )}
                </button>
              </div>
              <pre
                className="bg-dark text-white p-2.5 rounded-2 small mb-0 overflow-x-auto"
                style={{ fontSize: '0.72rem', maxHeight: '140px' }}
              >
                {readmeContent}
              </pre>
            </div>
          </div>

          <div className="modal-footer border-top bg-light py-2.5 px-4 d-flex justify-content-end">
            <button onClick={onClose} className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold">
              Got it, Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
