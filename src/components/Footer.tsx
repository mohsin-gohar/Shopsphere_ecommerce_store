import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { PageType } from '../types/ecommerce';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onSelectCategory: (cat: string) => void;
  onOpenAssignmentInfo?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory, onOpenAssignmentInfo }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4500);
  };

  const socialLinks = [
    { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { Icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  ];

  return (
    <footer
      className="w-100 text-slate-400 mt-5 border-top"
      style={{
        backgroundColor: '#0a0e17',
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container py-5">
        {/* VIP Atelier Privilege Newsletter Banner */}
        <div
          className="p-4 p-md-5 rounded-4 mb-5 position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge rounded-pill bg-white text-dark text-xs fw-bold px-2.5 py-1" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                  STUDIO PRIVILEGE
                </span>
                <span className="text-slate-400 text-xs" style={{ fontSize: '0.78rem' }}>
                  Seasonal Private Preview &amp; Lookbooks
                </span>
              </div>
              <h3 className="fw-black text-white tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
                Join the ShopSphere Atelier Club
              </h3>
              <p className="text-slate-400 small mb-0" style={{ maxWidth: '520px', lineHeight: '1.6' }}>
                Subscribe to unlock private seasonal lookbook releases, archive pieces, and receive an instant 20% privilege code at checkout.
              </p>
            </div>

            <div className="col-lg-5">
              <form onSubmit={handleSubscribe}>
                <div
                  className="d-flex align-items-center bg-slate-900 rounded-pill p-1.5 border border-slate-700 shadow-sm"
                >
                  <input
                    type="email"
                    className="form-control border-0 bg-transparent text-white px-3 py-1.5 small shadow-none placeholder-slate-500"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  <button
                    type="submit"
                    className="btn btn-light rounded-pill px-4 py-2 small fw-bold text-dark d-inline-flex align-items-center gap-1.5 flex-shrink-0 transition-transform active:scale-95"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                {subscribed && (
                  <div className="text-emerald-400 text-xs mt-2 d-flex align-items-center gap-1.5 animate__animated animate__fadeIn">
                    <CheckCircle2 size={14} />
                    <span>
                      Privilege confirmed! Use code <strong className="text-white">STUDENT20</strong> for 20% savings.
                    </span>
                  </div>
                )}
              </form>
              <span className="text-slate-500 mt-1.5 d-block" style={{ fontSize: '0.68rem' }}>
                We respect your privacy. Unsubscribe anytime with 1-click.
              </span>
            </div>
          </div>
        </div>

        {/* 4 Service Pillars (Clean Minimalist Luxury Strip) */}
        <div className="row g-4 pb-5 mb-5 border-bottom text-slate-300" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="col-6 col-lg-3">
            <div className="d-flex align-items-start gap-3">
              <div
                className="rounded-circle p-2 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <Truck size={18} />
              </div>
              <div>
                <h6 className="fw-bold text-white small mb-1" style={{ fontSize: '0.82rem' }}>
                  Express Courier
                </h6>
                <p className="text-slate-400 text-xs mb-0 lh-base" style={{ fontSize: '0.74rem' }}>
                  Complimentary global delivery on all orders over $150.
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="d-flex align-items-start gap-3">
              <div
                className="rounded-circle p-2 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <RotateCcw size={18} />
              </div>
              <div>
                <h6 className="fw-bold text-white small mb-1" style={{ fontSize: '0.82rem' }}>
                  30-Day Concierge Return
                </h6>
                <p className="text-slate-400 text-xs mb-0 lh-base" style={{ fontSize: '0.74rem' }}>
                  Prepaid return labels with door-to-door courier collection.
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="d-flex align-items-start gap-3">
              <div
                className="rounded-circle p-2 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <h6 className="fw-bold text-white small mb-1" style={{ fontSize: '0.82rem' }}>
                  Ethical Atelier Standard
                </h6>
                <p className="text-slate-400 text-xs mb-0 lh-base" style={{ fontSize: '0.74rem' }}>
                  Certified organic fibers and vegetable-tanned hides.
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="d-flex align-items-start gap-3">
              <div
                className="rounded-circle p-2 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <Headphones size={18} />
              </div>
              <div>
                <h6 className="fw-bold text-white small mb-1" style={{ fontSize: '0.82rem' }}>
                  24/7 Client Advisory
                </h6>
                <p className="text-slate-400 text-xs mb-0 lh-base" style={{ fontSize: '0.74rem' }}>
                  Personal styling guidance and dedicated post-purchase care.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Column Editorial Luxury Directory */}
        <div className="row g-4 g-lg-5 pb-5">
          {/* Col 1: Brand Ethos */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="bg-white text-dark rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
              >
                <ShoppingBag size={17} className="text-slate-900" />
              </div>
              <div className="d-flex flex-column text-start">
                <span className="fs-5 fw-extrabold text-white tracking-tight lh-1" style={{ letterSpacing: '-0.02em' }}>
                  ShopSphere
                </span>
                <span className="text-slate-500 fw-bold" style={{ fontSize: '0.58rem', letterSpacing: '0.12em' }}>
                  ATELIER &amp; COMMERCE
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed mb-4" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
              An architectural fashion studio synthesizing contemporary minimalism with certified ethical craftsmanship.
              Engineered with enterprise REST API services, client portal, and real-time ERP console.
            </p>

            <div className="d-flex align-items-center gap-2 mb-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="d-inline-flex align-items-center justify-content-center rounded-circle text-white transition-all"
                  style={{
                    width: '34px',
                    height: '34px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                  }}
                  title={social.label}
                >
                  <social.Icon size={14} />
                </a>
              ))}
            </div>

            <div className="d-flex align-items-center gap-1.5 text-slate-400 text-xs" style={{ fontSize: '0.72rem' }}>
              <Globe size={12} className="text-slate-500" />
              <span>Global Dispatch · USD ($)</span>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3.5" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
              Collections
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2.5 text-xs mb-0">
              <li>
                <button
                  onClick={() => {
                    onNavigate('shop');
                    onSelectCategory('All');
                  }}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('shop');
                    onSelectCategory('Men');
                  }}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Men's Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('shop');
                    onSelectCategory('Women');
                  }}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Women's Line
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('shop');
                    onSelectCategory('Shoes');
                  }}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Footwear &amp; Shoes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('shop');
                    onSelectCategory('Accessories');
                  }}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Leather Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Care */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3.5" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
              Client Care
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2.5 text-xs mb-0">
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Track Active Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Help Center &amp; FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Contact Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies')}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Shipping &amp; Delivery Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies')}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Returns &amp; Warranty Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Architecture */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3.5" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
              The Studio
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2.5 text-xs mb-0">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  About Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('auth')}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Customer VIP Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('auth')}
                  className="footer-link-white"
                  style={{ color: '#ffffff' }}
                >
                  Admin ERP Console
                </button>
              </li>
              {onOpenAssignmentInfo && (
                <li>
                  <button
                    onClick={onOpenAssignmentInfo}
                    className="footer-link-white fw-semibold"
                    style={{ color: '#ffffff' }}
                  >
                    <Sparkles size={12} className="text-info" />
                    <span>Specs (10/10 Rubric)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 5: Direct Concierge Contact */}
          <div className="col-lg-3 col-md-6 col-12">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3.5" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
              Private Concierge
            </h6>
            <div className="d-flex flex-column gap-2.5 text-xs text-slate-400" style={{ fontSize: '0.78rem' }}>
              <div className="d-flex align-items-center gap-2">
                <Phone size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-slate-300 font-semibold">+1 (800) 555-0199</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                <span>concierge@shopsphere.studio</span>
              </div>
              <div className="d-flex align-items-start gap-2">
                <MapPin size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <span>48 Mercer Street, SoHo, New York, NY 10013</span>
              </div>
              <div className="p-2.5 rounded-3 bg-slate-900 border border-slate-800 text-2xs text-slate-400 mt-1" style={{ fontSize: '0.72rem' }}>
                Dedicated client stylists available 24 hours daily.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Verified Payments */}
        <div
          className="pt-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-xs text-slate-500"
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div className="text-center text-md-start">
            <span>© {new Date().getFullYear()} ShopSphere Studio Inc. All rights reserved.</span>
          </div>

          {/* Legal Links */}
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => onNavigate('policies')}
              className="footer-link-white"
              style={{ color: '#ffffff', fontSize: '0.75rem' }}
            >
              Privacy
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onNavigate('policies')}
              className="footer-link-white"
              style={{ color: '#ffffff', fontSize: '0.75rem' }}
            >
              Terms
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onNavigate('policies')}
              className="footer-link-white"
              style={{ color: '#ffffff', fontSize: '0.75rem' }}
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
