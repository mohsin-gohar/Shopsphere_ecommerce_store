import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText, Lock } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>('shipping');

  return (
    <div className="py-4 py-md-5">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 px-3">
        <span className="text-muted small text-uppercase tracking-wider fw-semibold d-block mb-2">
          Transparency & Guarantees
        </span>
        <h1 className="display-6 fw-bold text-dark tracking-tight mb-2">Store Policies & Terms</h1>
        <p className="text-secondary small leading-relaxed">
          Clear, honest commitments regarding your orders, shipments, returns, and digital privacy.
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="d-flex border-bottom overflow-x-auto gap-2 pb-2">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`btn btn-sm px-3 py-2 fw-semibold text-nowrap rounded-3 d-flex align-items-center gap-2 ${
              activeTab === 'shipping'
                ? 'btn-dark text-white'
                : 'btn-light border border-hairline text-secondary'
            }`}
          >
            <Truck size={16} /> Shipping Policy
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`btn btn-sm px-3 py-2 fw-semibold text-nowrap rounded-3 d-flex align-items-center gap-2 ${
              activeTab === 'returns'
                ? 'btn-dark text-white'
                : 'btn-light border border-hairline text-secondary'
            }`}
          >
            <RotateCcw size={16} /> 30-Day Returns
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`btn btn-sm px-3 py-2 fw-semibold text-nowrap rounded-3 d-flex align-items-center gap-2 ${
              activeTab === 'privacy'
                ? 'btn-dark text-white'
                : 'btn-light border border-hairline text-secondary'
            }`}
          >
            <Lock size={16} /> Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`btn btn-sm px-3 py-2 fw-semibold text-nowrap rounded-3 d-flex align-items-center gap-2 ${
              activeTab === 'terms'
                ? 'btn-dark text-white'
                : 'btn-light border border-hairline text-secondary'
            }`}
          >
            <FileText size={16} /> Terms of Service
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto">
        <div className="card border border-hairline rounded-4 p-4 p-md-5 bg-white shadow-2xs leading-relaxed">
          {activeTab === 'shipping' && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Truck size={24} className="text-dark" />
                <h4 className="fw-bold text-dark mb-0">Shipping & Dispatch Policy</h4>
              </div>
              <p className="text-muted small mb-4">Last revised: October 2026</p>

              <h6 className="fw-bold text-dark mb-2">1. Delivery Timeframes & Carriers</h6>
              <p className="text-secondary small mb-4">
                All confirmed orders are packaged within our studio within 24 business hours. Deliveries
                are conducted in partnership with authorized couriers (TCS Express, Leopard, and DHL).
                Standard domestic transit requires 2 to 4 business days depending on geographical location.
              </p>

              <h6 className="fw-bold text-dark mb-2">2. Free Shipping Threshold</h6>
              <p className="text-secondary small mb-4">
                We provide complimentary express shipping on all orders totaling $75 or above (after coupon
                discounts). For orders beneath this threshold, a flat $10 handling and courier fee is applied.
              </p>

              <h6 className="fw-bold text-dark mb-2">3. Shipment Tracking & Notifications</h6>
              <p className="text-secondary small mb-4">
                Upon package pickup from our studio atelier, an SMS and email notification with an Airway
                Bill (AWB) number is transmitted. Clients can inspect live parcel progress at any time via
                our dedicated "Order Tracking" portal.
              </p>

              <h6 className="fw-bold text-dark mb-2">4. Damaged or Delayed Parcels</h6>
              <p className="text-secondary small mb-0">
                In the rare event of transit damage or delays exceeding 7 business days, our concierge will
                immediately dispatch an expedited replacement package at zero surcharge.
              </p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <RotateCcw size={24} className="text-dark" />
                <h4 className="fw-bold text-dark mb-0">30-Day Return & Exchange Guarantee</h4>
              </div>
              <p className="text-muted small mb-4">Last revised: October 2026</p>

              <h6 className="fw-bold text-dark mb-2">1. Eligibility Criteria</h6>
              <p className="text-secondary small mb-4">
                We take immense pride in our craftsmanship. If you are not entirely satisfied with fit,
                drape, or aesthetic, you may request a return or size exchange within 30 days of parcel
                receipt. Garments must be unwashed, unworn, and preserved in original packaging.
              </p>

              <h6 className="fw-bold text-dark mb-2">2. Exchange Process</h6>
              <p className="text-secondary small mb-4">
                Size exchanges are free of charge. Simply contact our support concierge with your Order ID,
                and our courier will deliver the replacement size directly to your door while collecting the
                original item.
              </p>

              <h6 className="fw-bold text-dark mb-2">3. Refund Disbursement</h6>
              <p className="text-secondary small mb-0">
                Refunds for Cash on Delivery (COD) orders are transferred within 48 hours to your Bank
                Account, JazzCash, or EasyPaisa. Credit/debit card refunds revert to the original card
                within 3 to 5 banking days.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Lock size={24} className="text-dark" />
                <h4 className="fw-bold text-dark mb-0">Privacy & Data Security Policy</h4>
              </div>
              <p className="text-muted small mb-4">Last revised: October 2026</p>

              <h6 className="fw-bold text-dark mb-2">1. Information Collection & Storage</h6>
              <p className="text-secondary small mb-4">
                ShopSphere collects solely the essential information required to fulfill orders: your name,
                delivery address, email, and contact number. We strictly never sell, trade, or distribute
                client information to third-party advertisers.
              </p>

              <h6 className="fw-bold text-dark mb-2">2. Payment Encryption Standards</h6>
              <p className="text-secondary small mb-4">
                All communications and transactions are protected under 256-bit SSL encryption. Credit card
                information is processed via tokenized gateway standards; no payment card CVV codes are
                stored on our infrastructure.
              </p>

              <h6 className="fw-bold text-dark mb-2">3. Local Storage Usage</h6>
              <p className="text-secondary small mb-0">
                Our application utilizes browser localStorage solely to preserve your active shopping bag
                and saved wishlist between sessions for your convenience.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FileText size={24} className="text-dark" />
                <h4 className="fw-bold text-dark mb-0">Terms of Service</h4>
              </div>
              <p className="text-muted small mb-4">Last revised: October 2026</p>

              <h6 className="fw-bold text-dark mb-2">1. Agreement to Terms</h6>
              <p className="text-secondary small mb-4">
                By accessing and placing orders through ShopSphere, you agree to be bound by these Terms of
                Service, our shipping stipulations, and return guidelines.
              </p>

              <h6 className="fw-bold text-dark mb-2">2. Product Descriptions & Pricing</h6>
              <p className="text-secondary small mb-4">
                We strive for absolute accuracy in color calibration and textile representations. Prices are
                stated in USD ($) and are subject to promotional coupons as advertised.
              </p>

              <h6 className="fw-bold text-dark mb-2">3. Intellectual Property</h6>
              <p className="text-secondary small mb-0">
                All visual imagery, studio designs, copy, and code are intellectual property of ShopSphere.
                Unauthorized commercial duplication is prohibited.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
