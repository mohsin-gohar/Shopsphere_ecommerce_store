import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  Heart,
  X,
  Menu,
  User,
  ShieldCheck,
  LogOut,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { PageType, AuthUser, Product } from '../types/ecommerce';

interface NavbarProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  currentUser: AuthUser | null;
  onLogout?: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAssignmentInfo?: () => void;
  products?: Product[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  currentUser,
  onLogout,
  onOpenCart,
  onOpenWishlist,
  onOpenAssignmentInfo,
  products = [],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut (⌘K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (activePage !== 'shop') {
          onNavigate('shop');
        }
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage, onNavigate]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions =
    searchQuery.trim().length >= 2
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 6)
      : [];
  const baseNavLinks: { label: string; page: PageType }[] = [
    { label: 'Shop', page: 'shop' },
    { label: 'About', page: 'about' },
    { label: 'Track Order', page: 'tracking' },
    { label: 'FAQ', page: 'faq' },
    { label: 'Contact', page: 'contact' },
    { label: 'Policies', page: 'policies' },
  ];

  return (
    <header className="sticky-top w-100" style={{ zIndex: 1040 }}>
      {/* Main Luxury Glass Navbar */}
      <nav className="luxury-navbar navbar navbar-expand-lg py-2.5 py-lg-3">
        <div className="container d-flex align-items-center justify-content-between gap-2 gap-md-4">
          {/* Zone 1: Brand Wordmark & Monogram */}
          <button
            onClick={() => {
              onNavigate('shop');
              setMobileMenuOpen(false);
            }}
            className="navbar-brand d-flex align-items-center gap-2.5 border-0 bg-transparent p-0 text-decoration-none cursor-pointer"
            aria-label="ShopSphere Home"
          >
            <div
              className="bg-slate-950 text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div className="d-flex flex-column text-start">
              <span className="fs-4 font-extrabold tracking-tight text-slate-900 whitespace-nowrap lh-1" style={{ letterSpacing: '-0.03em' }}>
                ShopSphere
              </span>
              <span className="text-slate-500 fw-bold" style={{ fontSize: '0.62rem', letterSpacing: '0.12em' }}>
                ATELIER &amp; COMMERCE
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            {baseNavLinks.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`luxury-nav-link border-0 ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Portal Switcher for Logged-In Roles */}
            {currentUser?.role === 'admin' ? (
              <div className="d-flex align-items-center gap-1 ms-2 ps-2 border-start border-slate-200">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`btn btn-sm rounded-pill px-3 py-1 text-xs fw-semibold transition-all ${
                    activePage === 'dashboard'
                      ? 'btn-dark text-white shadow-2xs'
                      : 'btn-outline-dark hover:bg-slate-100'
                  }`}
                  title="Admin ERP Console"
                >
                  <ShieldCheck size={13} className="me-1 d-inline" />
                  ERP Console
                </button>
                <button
                  onClick={() => onNavigate('customer-portal')}
                  className={`btn btn-sm rounded-pill px-2.5 py-1 text-xs fw-semibold transition-all ${
                    activePage === 'customer-portal'
                      ? 'btn-dark text-white shadow-2xs'
                      : 'btn-light border border-hairline hover:bg-slate-100'
                  }`}
                  title="Customer Portal"
                >
                  Portal
                </button>
              </div>
            ) : currentUser?.role === 'customer' ? (
              <div className="ms-2 ps-2 border-start border-slate-200">
                <button
                  onClick={() => onNavigate('customer-portal')}
                  className={`btn btn-sm rounded-pill px-3 py-1 text-xs fw-semibold transition-all ${
                    activePage === 'customer-portal'
                      ? 'btn-dark text-white shadow-2xs'
                      : 'btn-outline-dark hover:bg-slate-100'
                  }`}
                >
                  <User size={13} className="me-1 d-inline" />
                  My Portal
                </button>
              </div>
            ) : null}
          </div>

          {/* Zone 3: Interactive Action Suite */}
          <div className="d-flex align-items-center gap-2">
            {/* Search Box (Desktop) */}
            <div
              ref={searchContainerRef}
              className="d-none d-xl-flex align-items-center luxury-search-box px-2.5 py-1 position-relative"
              style={{ width: '220px' }}
            >
              <Search size={14} className="text-slate-400 me-2 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                className="border-0 bg-transparent p-0 small text-slate-800 w-100 focus:outline-none"
                style={{ fontSize: '0.82rem', outline: 'none' }}
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                  if (activePage !== 'shop') onNavigate('shop');
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="btn btn-link p-0 text-slate-400 hover:text-slate-700 border-0 ms-1"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              ) : (
                <kbd className="luxury-kbd ms-1 d-none d-xxl-inline">⌘K</kbd>
              )}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="position-absolute top-100 start-0 mt-2 w-100 bg-white border border-slate-200 rounded-3 shadow-lg overflow-hidden" style={{ zIndex: 1080, minWidth: '260px' }}>
                  {searchSuggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="w-100 border-0 bg-transparent text-start px-3 py-2 hover:bg-slate-50 d-flex align-items-center gap-2"
                      onClick={() => {
                        onSearchChange(product.name);
                        setShowSuggestions(false);
                        if (activePage !== 'shop') onNavigate('shop');
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <div className="small fw-semibold text-slate-900 text-truncate">{product.name}</div>
                        <div className="text-slate-500 text-2xs">{product.category} · ${product.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Account / Sign In Pill */}
            {currentUser ? (
              <div className="d-none d-sm-flex align-items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-pill p-1 ps-2.5">
                <div className="d-flex align-items-center gap-1.5 me-1">
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck size={14} className="text-primary" />
                  ) : (
                    <User size={14} className="text-slate-700" />
                  )}
                  <button
                    onClick={() => onNavigate(currentUser.role === 'admin' ? 'dashboard' : 'customer-portal')}
                    className="btn btn-link p-0 text-decoration-none text-slate-900 fw-bold text-xs"
                    style={{ fontSize: '0.78rem', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={currentUser.name}
                  >
                    {currentUser.name.split(' ')[0]}
                  </button>
                  <span
                    className={`badge rounded-pill text-2xs px-2 py-0.5 ${
                      currentUser.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                    style={{ fontSize: '0.65rem' }}
                  >
                    {currentUser.role === 'admin' ? 'Admin' : 'VIP'}
                  </span>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="btn btn-light rounded-circle p-1 text-slate-400 hover:text-danger border-0"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut size={13} />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className={`btn btn-sm rounded-pill d-none d-sm-inline-flex align-items-center gap-1.5 px-3 py-1.5 transition-all ${
                  activePage === 'auth'
                    ? 'btn-dark text-white shadow-2xs'
                    : 'btn-light border border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
                title="Sign in to your account"
              >
                <User size={14} />
                <span className="small fw-semibold">Sign In</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="btn btn-light border border-slate-200 rounded-pill btn-sm d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 position-relative hover:bg-slate-100 transition-all"
              aria-label="Wishlist"
              title="Saved Items"
            >
              <Heart
                size={16}
                className={wishlistCount > 0 ? 'text-danger' : 'text-slate-600'}
                fill={wishlistCount > 0 ? '#ef4444' : 'none'}
              />
              <span className="small fw-medium d-none d-md-inline text-slate-700">Saved</span>
              {wishlistCount > 0 && (
                <span
                  className="badge bg-danger rounded-pill px-1.5 py-0.5 text-white fw-bold shadow-2xs"
                  style={{ fontSize: '0.65rem' }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button (High-End Luxury Dark Pill) */}
            <button
              onClick={onOpenCart}
              className="btn btn-dark rounded-pill btn-sm d-inline-flex align-items-center gap-2 px-3 py-1.5 shadow-sm transition-transform active:scale-95"
              style={{
                backgroundColor: '#0f172a',
                borderColor: '#0f172a',
              }}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={15} />
              <span className="small fw-semibold d-none d-sm-inline">Bag</span>
              <span
                className="badge bg-white text-slate-950 rounded-pill px-1.5 py-0.5 fw-bold"
                style={{ fontSize: '0.7rem' }}
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="btn btn-light border border-slate-200 rounded-3 p-1.5 d-lg-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} className="text-slate-800" /> : <Menu size={20} className="text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Sheet */}
        {mobileMenuOpen && (
          <div className="d-lg-none w-100 border-top mt-2 pt-3 px-3 bg-white shadow-lg animate__animated animate__fadeIn">
            {/* Search Bar for Mobile */}
            <div className="mb-3">
              <div className="luxury-search-box d-flex align-items-center px-3 py-2">
                <Search size={15} className="text-slate-400 me-2" />
                <input
                  type="text"
                  className="border-0 bg-transparent small text-slate-800 w-100 focus:outline-none"
                  placeholder="Search products, atelier, fabrics..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (activePage !== 'shop') onNavigate('shop');
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="btn btn-link p-0 text-slate-400 border-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* User status card for mobile */}
            <div className="p-3 mb-3 bg-slate-50 rounded-3 border border-slate-200 d-flex align-items-center justify-content-between">
              {currentUser ? (
                <div className="d-flex align-items-center gap-2.5">
                  <div className="bg-slate-900 text-white rounded-circle p-2 d-flex align-items-center justify-content-center">
                    {currentUser.role === 'admin' ? <ShieldCheck size={16} /> : <User size={16} />}
                  </div>
                  <div>
                    <div className="fw-bold text-slate-900 small">{currentUser.name}</div>
                    <span className="text-slate-500 text-xs">
                      {currentUser.role === 'admin' ? 'Master Administrator' : 'VIP Studio Client'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-slate-200 text-slate-600 rounded-circle p-2">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="fw-bold text-slate-800 small">Guest Visitor</div>
                    <span className="text-slate-500 text-xs">Sign in for VIP perks</span>
                  </div>
                </div>
              )}

              {currentUser ? (
                <button
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 text-xs fw-semibold"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('auth');
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-dark btn-sm rounded-pill px-3 py-1 text-xs fw-semibold"
                >
                  Sign In / Join
                </button>
              )}
            </div>

            {/* Role-Specific Portal Buttons for Mobile */}
            {currentUser && (
              <div className="row g-2 mb-3">
                <div className={currentUser.role === 'admin' ? 'col-6' : 'col-12'}>
                  <button
                    onClick={() => {
                      onNavigate('customer-portal');
                      setMobileMenuOpen(false);
                    }}
                    className={`btn w-100 btn-sm rounded-3 py-2 text-xs fw-semibold ${
                      activePage === 'customer-portal' ? 'btn-dark text-white' : 'btn-outline-dark'
                    }`}
                  >
                    Customer Portal
                  </button>
                </div>
                {currentUser.role === 'admin' && (
                  <div className="col-6">
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className={`btn w-100 btn-sm rounded-3 py-2 text-xs fw-semibold ${
                        activePage === 'dashboard' ? 'btn-dark text-white' : 'btn-outline-dark'
                      }`}
                    >
                      Admin ERP
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Links List */}
            <div className="d-flex flex-column gap-1 mb-3">
              <span className="text-slate-400 small text-uppercase tracking-wider fw-bold px-2 mb-1" style={{ fontSize: '0.68rem' }}>
                Store Directory
              </span>
              {baseNavLinks.map((item) => (
                <button
                  key={item.page}
                  className={`btn text-start rounded-3 px-3 py-2 small d-flex align-items-center justify-content-between ${
                    activePage === item.page ? 'btn-dark text-white fw-bold' : 'btn-light text-slate-800'
                  }`}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={14} className={activePage === item.page ? 'text-white' : 'text-slate-400'} />
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
