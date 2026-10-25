import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types/ecommerce';
import { copyToClipboard } from '../utils/clipboard';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Ruler,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  relatedProducts,
  onSelectProduct,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Onyx Noir');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');
  const [copiedLink, setCopiedLink] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const fallbackImg =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85';

  // Realistic alternate gallery photos
  const galleryImages = [
    product?.image || fallbackImg,
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
  ];

  const colors = [
    { name: 'Onyx Noir', hex: '#0f172a' },
    { name: 'Heather Grey', hex: '#64748b' },
    { name: 'Warm Oat', hex: '#d4c4b5' },
    { name: 'Midnight Navy', hex: '#1e3a8a' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    setImageError(false);
    setActiveImageIndex(0);
    setQuantity(1);
    modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSizeGuideOpen) {
          setIsSizeGuideOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSizeGuideOpen]);

  const discountPercentage =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleShare = async () => {
    const ok = await copyToClipboard(window.location.href);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4"
      style={{
        backgroundColor: 'rgba(9, 13, 22, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalScrollRef}
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl relative border border-slate-100 animate__animated animate__fadeInUp animate__faster"
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-20">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={onClose} className="hover:text-slate-900 transition-colors">
              Collection
            </button>
            <span>/</span>
            <span className="text-slate-700">{product.category}</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-[160px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
              title="Share item"
              aria-label="Share"
            >
              {copiedLink ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
              aria-label="Close details"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Product Presentation Body */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Gallery & Thumbnails */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails list */}
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-xl overflow-hidden w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-slate-900 shadow-sm scale-102'
                        : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={idx === 0 && imageError ? fallbackImg : imgUrl}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              {/* Main Feature View */}
              <div className="relative flex-1 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group">
                <img
                  src={
                    activeImageIndex === 0 && imageError
                      ? fallbackImg
                      : galleryImages[activeImageIndex] || fallbackImg
                  }
                  alt={product.name}
                  className="w-full h-[380px] sm:h-[480px] object-cover transition-transform duration-500 group-hover:scale-104"
                  onError={() => setImageError(true)}
                />

                {/* Overlays */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {product.badge && (
                    <span className="bg-slate-950/85 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  {discountPercentage && (
                    <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm">
                      Save {discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Wishlist Icon Button */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-all text-slate-700 hover:scale-110 active:scale-95"
                  title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}
                  />
                </button>
              </div>
            </div>

            {/* Right Column: Editorial Details & Purchasing */}
            <div className="lg:col-span-5 flex flex-col">
              {/* Category & Stock Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                  {product.category} Atelier
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock — Dispatches in 24h
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                {product.name}
              </h1>

              {/* Rating Review Summary */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill={star <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                      stroke={star <= Math.round(product.rating) ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-900">{product.rating}</span>
                <span className="text-xs text-slate-400">
                  ({product.reviews || 84} verified reviews)
                </span>
              </div>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-slate-400 line-through">
                    ${product.oldPrice}
                  </span>
                )}
                {discountPercentage && product.oldPrice && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full ml-auto">
                    Save ${(product.oldPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Editorial Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {product.short_desc}
              </p>

              {/* Color Swatches */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Color: <span className="text-slate-900 font-bold">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColor === c.name
                          ? 'border-slate-900 scale-110 shadow-sm'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Select Size:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 underline underline-offset-2"
                  >
                    <Ruler size={13} /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSize === s
                          ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA Bar */}
              <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-950 disabled:opacity-30 rounded-lg hover:bg-white transition-colors"
                    >
                      -
                    </button>
                    <span className="w-9 text-center font-bold text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-950 rounded-lg hover:bg-white transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                      addedToast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 text-white hover:bg-black'
                    }`}
                  >
                    {addedToast ? (
                      <>
                        <CheckCircle2 size={18} /> Added to Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} /> Add to Bag · ${(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Express Checkout Button */}
                <button
                  type="button"
                  onClick={() => onBuyNow(product, quantity)}
                  className="w-full py-3 px-6 rounded-2xl font-bold text-sm text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} className="text-slate-700" /> Express Checkout
                </button>
              </div>

              {/* Guarantees Strip */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <Truck size={16} className="mx-auto text-slate-700 mb-1" />
                  <span className="block text-[11px] font-bold text-slate-800">Free Courier</span>
                  <span className="block text-[10px] text-slate-500">Over $75</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <RotateCcw size={16} className="mx-auto text-slate-700 mb-1" />
                  <span className="block text-[11px] font-bold text-slate-800">30-Day Return</span>
                  <span className="block text-[10px] text-slate-500">Doorstep pickup</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <ShieldCheck size={16} className="mx-auto text-slate-700 mb-1" />
                  <span className="block text-[11px] font-bold text-slate-800">Atelier Quality</span>
                  <span className="block text-[10px] text-slate-500">100% Genuine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Tabs Section: Craftsmanship, Shipping, Reviews */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex border-b border-slate-200 gap-6 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Fabric &amp; Craftsmanship
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Shipping &amp; Free Returns
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Client Reviews ({product.reviews || 84})
              </button>
            </div>

            {/* Tab 1: Details */}
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl text-sm text-slate-600 leading-relaxed animate__animated animate__fadeIn">
                <p>{product.long_description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block text-xs mb-1">
                      Material Composition
                    </span>
                    <span className="text-xs">
                      100% Certified Organic Combed Fiber / Full-Grain Tanned Leather. Pre-shrunk
                      for long-lasting structure.
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block text-xs mb-1">
                      Care Instructions
                    </span>
                    <span className="text-xs">
                      Machine wash cold on delicate cycle. Do not tumble dry. Use mild eco-friendly
                      detergents.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Shipping */}
            {activeTab === 'shipping' && (
              <div className="space-y-3 max-w-3xl text-sm text-slate-600 leading-relaxed animate__animated animate__fadeIn">
                <p>
                  Orders placed before 2:00 PM EST are dispatched the same business day from our
                  central studio warehouse.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>
                    <strong>Standard Express:</strong> 2–4 business days (Complimentary on orders
                    over $75).
                  </li>
                  <li>
                    <strong>Global Air Priority:</strong> 3–6 business days worldwide with tracked
                    courier delivery.
                  </li>
                  <li>
                    <strong>30-Day Hassle-Free Returns:</strong> Includes prepaid return shipping
                    label with door-to-door courier collection.
                  </li>
                </ul>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 max-w-3xl animate__animated animate__fadeIn">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-3xl font-extrabold text-slate-900">{product.rating}</div>
                    <div className="flex items-center text-amber-500 justify-center sm:justify-start my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill="#f59e0b" stroke="#f59e0b" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">96% of verified buyers recommend this</span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1 w-full sm:w-64">
                    <div className="flex items-center gap-2">
                      <span>5★</span>
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[85%]"></div>
                      </div>
                      <span>85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>4★</span>
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[12%]"></div>
                      </div>
                      <span>12%</span>
                    </div>
                  </div>
                </div>

                {/* Sample Verified Customer Testimonials */}
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 border border-slate-100 rounded-xl bg-white shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">Julian K. · Verified Buyer</span>
                      <span className="text-[11px] text-slate-400">3 days ago</span>
                    </div>
                    <div className="flex text-amber-500 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} fill="#f59e0b" stroke="#f59e0b" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 mb-0">
                      Exceptional silhouette and weight. The fabric drape is genuinely architectural,
                      and the fit is true to size. Delivered in 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related / Complete the Look */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900">Complete the Look</h3>
                <span className="text-xs text-slate-500">Curated from {product.category}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      setQuantity(1);
                    }}
                    className="cursor-pointer group bg-slate-50 hover:bg-white rounded-2xl p-2.5 border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all"
                  >
                    <div className="overflow-hidden rounded-xl mb-2 bg-slate-200 aspect-square">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallbackImg;
                        }}
                      />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate mb-0.5">{rel.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">${rel.price}</span>
                      <span className="text-[11px] text-amber-600 font-semibold">★ {rel.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal Sub-View */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate__animated animate__fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h4 className="text-lg font-extrabold text-slate-900">Standard Size Guide</h4>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              All measurements are in inches. Studio pieces are tailored for a modern relaxed fit.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2">Size</th>
                    <th className="p-2">Chest (in)</th>
                    <th className="p-2">Waist (in)</th>
                    <th className="p-2">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-bold">XS</td>
                    <td className="p-2">34 - 36</td>
                    <td className="p-2">28 - 30</td>
                    <td className="p-2">27.0</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">S</td>
                    <td className="p-2">36 - 38</td>
                    <td className="p-2">30 - 32</td>
                    <td className="p-2">27.5</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">M</td>
                    <td className="p-2">38 - 40</td>
                    <td className="p-2">32 - 34</td>
                    <td className="p-2">28.5</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">L</td>
                    <td className="p-2">40 - 42</td>
                    <td className="p-2">34 - 36</td>
                    <td className="p-2">29.5</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">XL</td>
                    <td className="p-2">42 - 44</td>
                    <td className="p-2">36 - 38</td>
                    <td className="p-2">30.5</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">XXL</td>
                    <td className="p-2">44 - 46</td>
                    <td className="p-2">38 - 40</td>
                    <td className="p-2">31.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
