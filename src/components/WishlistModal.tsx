import React from 'react';
import { Product } from '../types/ecommerce';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onQuickView,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fallbackImg =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1075 }}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div className="modal-header border-bottom bg-light py-3 px-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-danger text-white p-2 rounded-3">
                <Heart size={18} fill="currentColor" />
              </div>
              <div>
                <h5 id="wishlist-modal-title" className="modal-title fw-bold text-dark mb-0">Your Wishlist</h5>
                <small className="text-muted">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                </small>
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
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-5">
                <div className="bg-slate-100 p-3.5 rounded-circle d-inline-block mb-3 text-slate-400">
                  <Heart size={36} />
                </div>
                <h6 className="fw-bold text-slate-950 mb-1">Your Wishlist is Empty</h6>
                <p className="text-slate-500 small mb-3">
                  Click the heart icon on any piece in the archive to curate your personal collection.
                </p>
                <button
                  onClick={onClose}
                  className="btn btn-dark rounded-pill px-4 btn-sm fw-semibold"
                >
                  Explore Archive
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="card border border-slate-200/80 rounded-3 p-3 bg-white shadow-2xs d-flex flex-row gap-3 align-items-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-2 object-fit-cover cursor-pointer"
                      loading="lazy"
                      decoding="async"
                      style={{ width: '65px', height: '65px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImg;
                      }}
                      onClick={() => onQuickView(product)}
                    />
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-bold text-slate-950 small text-truncate" title={product.name}>
                        {product.name}
                      </div>
                      <div className="text-slate-500" style={{ fontSize: '0.75rem' }}>
                        {product.category} Atelier
                      </div>
                      <div className="font-black text-slate-950 small mt-1 tabular-nums">${product.price}</div>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="btn btn-dark btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1 shadow-2xs"
                      >
                        <ShoppingBag size={14} /> Add
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="btn btn-light btn-sm text-danger rounded-pill px-2 py-0.5 border"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer border-top bg-light py-2 px-4 d-flex justify-content-end">
            <button onClick={onClose} className="btn btn-outline-secondary rounded-pill px-4 btn-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
