import React, { useState } from 'react';
import { Product } from '../types/ecommerce';
import { ShoppingBag, Heart, Star, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const discountPercentage =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const fallbackImg =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div
        className="product-card group relative flex flex-col h-full bg-white cursor-pointer shadow-xs"
        onClick={() => onQuickView(product)}
      >
        {/* Editorial Portrait Photo Container */}
        <div className="product-card-img-container relative overflow-hidden bg-slate-100">
          <img
            src={imageError || !product?.image ? fallbackImg : product.image}
            alt={product.name}
            className="product-card-img w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercentage ? (
              <span className="bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
                -{discountPercentage}%
              </span>
            ) : null}
            {product.badge && (
              <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200/90 shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Top-right Action Buttons (Wishlist + Quick Inspect) */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-600 shadow-sm hover:scale-110 active:scale-95 transition-all"
              onClick={handleWishlistClick}
              title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
              aria-label="Wishlist toggle"
            >
              <Heart
                size={16}
                className={isWishlisted ? 'text-rose-600 fill-rose-600' : 'text-slate-700'}
              />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md hidden sm:flex items-center justify-center text-slate-700 hover:text-slate-950 shadow-sm opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              title="Quick Atelier View"
              aria-label="Quick view"
            >
              <Eye size={15} />
            </button>
          </div>

          {/* Hover Quick Add to Bag Bar */}
          <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-300 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950/95 backdrop-blur-md text-white hover:bg-black'
              }`}
              onClick={handleAdd}
            >
              {addedAnimation ? (
                <>
                  <Check size={14} /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> Quick Add · ${product.price}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card Body & Typography */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-grow">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="uppercase tracking-widest font-bold text-[10px] text-slate-500">
              {product.category} Atelier
            </span>
            <div className="flex items-center gap-1 text-slate-800 font-bold text-[11px]">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviews || 42})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-950 line-clamp-1 mb-1 tracking-tight group-hover:text-slate-600 transition-colors">
            {product.name}
          </h3>

          {/* Short subtitle */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product.short_desc}
          </p>

          {/* Pricing & Color Swatch Row */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-slate-950 tabular-nums">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ${product.oldPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5" title="Available Atelier Shades">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300 border border-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 border border-slate-300" />
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full ms-1">
                In Stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;

