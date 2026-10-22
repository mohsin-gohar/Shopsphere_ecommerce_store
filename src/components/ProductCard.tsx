import React, { useState } from 'react';
import { Product } from '../types/ecommerce';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';

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
    <div className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2 col-xxl-2">
      <div
        className="product-card group relative flex flex-col h-full bg-white cursor-pointer shadow-xs"
        onClick={() => onQuickView(product)}
      >
        {/* Editorial Photo Container */}
        <div className="product-card-img-container relative overflow-hidden bg-slate-50">
          <img
            src={imageError ? fallbackImg : product.image}
            alt={product.name}
            className="product-card-img w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {discountPercentage ? (
              <span className="bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                -{discountPercentage}%
              </span>
            ) : product.badge ? (
              <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
                {product.badge}
              </span>
            ) : null}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-600 shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
            onClick={handleWishlistClick}
            title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart
              size={17}
              className={isWishlisted ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}
            />
          </button>

          {/* Hover Quick Add to Bag Bar */}
          <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-300 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
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
                  <ShoppingBag size={14} /> Quick Add to Bag
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card Body & Typography */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-widest font-bold text-[10px] text-slate-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold text-[11px]">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1 mb-1 tracking-tight group-hover:text-slate-600 transition-colors">
            {product.name}
          </h3>

          {/* Short subtitle */}
          <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
            {product.short_desc}
          </p>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between mt-auto pt-2.5 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-slate-900 tabular-nums">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ${product.oldPrice}
                </span>
              )}
            </div>

            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
