import React, { useState } from 'react';
import { CartItem } from '../types/ecommerce';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface CartOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
}

export const CartOffcanvas: React.FC<CartOffcanvasProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    text: string;
    type: 'success' | 'danger';
  } | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate calculations
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon === 'STUDENT20') {
    discountAmount = subtotal * 0.2;
  } else if (appliedCoupon === 'WELCOME10') {
    discountAmount = subtotal * 0.1;
  } else if (appliedCoupon === 'SAVE15') {
    discountAmount = Math.min(15, subtotal);
  }

  // Shipping: Free if subtotal after discount >= $75, else $10
  const isFreeShipping = subtotal - discountAmount >= 75 || subtotal === 0;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 10;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.05; // 5% tax
  const grandTotal = Math.max(0, taxableAmount + shippingFee + tax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = onApplyCoupon(couponInput.trim().toUpperCase());
    if (res.success) {
      setCouponFeedback({ text: res.message, type: 'success' });
      setCouponInput('');
    } else {
      setCouponFeedback({ text: res.message, type: 'danger' });
    }
  };

  const freeShippingThreshold = 75;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
        style={{ zIndex: 1070 }}
        onClick={onClose}
      />

      {/* Offcanvas Drawer */}
      <div
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column cart-drawer"
        style={{ zIndex: 1080 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Drawer Header */}
        <div className="p-3.5 border-bottom d-flex align-items-center justify-content-between bg-white">
          <div className="d-flex align-items-center gap-2.5">
            <div className="bg-slate-950 text-white p-2 rounded-3 shadow-2xs">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h5 id="cart-drawer-title" className="fw-black mb-0 text-slate-950 tracking-tight">Your Shopping Bag</h5>
              <small className="text-slate-500">
                {totalItemCount} {totalItemCount === 1 ? 'piece' : 'pieces'} selected
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm rounded-pill px-2.5 py-1"
                onClick={onClearCart}
                title="Clear entire cart"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className="btn btn-light rounded-circle p-2"
              onClick={onClose}
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress bar */}
        {items.length > 0 && (
          <div className="bg-slate-50 p-2.5 border-bottom px-3.5">
            <div className="d-flex align-items-center justify-content-between small mb-1.5">
              <span className="text-slate-900 fw-semibold d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
                <Truck size={14} className="text-slate-800" />
                {amountToFreeShipping > 0
                  ? `Add $${amountToFreeShipping.toFixed(2)} more for Complimentary Express Courier`
                  : '✓ Complimentary Express Courier Unlocked'}
              </span>
              <span className="text-slate-900 fw-bold tabular-nums" style={{ fontSize: '0.75rem' }}>{progressPercent}%</span>
            </div>
            <div className="progress bg-slate-200" style={{ height: '5px' }}>
              <div
                className="progress-bar bg-slate-950"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        {/* Items Container */}
        <div className="flex-grow-1 overflow-y-auto p-3">
          {items.length === 0 ? (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
              <div className="bg-slate-100 p-4 rounded-circle mb-3 text-slate-400">
                <ShoppingBag size={44} />
              </div>
              <h5 className="fw-bold text-slate-950 mb-1">Your Shopping Bag is Empty</h5>
              <p className="text-slate-500 small mb-4">
                Explore our seasonal archive to add tailored garments and leather goods.
              </p>
              <button
                onClick={onClose}
                className="btn btn-dark rounded-pill px-4 py-2.5 shadow-2xs fw-semibold"
              >
                Explore Archive
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="card border rounded-3 p-2.5 shadow-2xs bg-white"
                >
                  <div className="d-flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="rounded-2 object-fit-cover flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                      style={{ width: '70px', height: '70px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
                      }}
                    />

                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="pe-2">
                          <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                            {item.product.name}
                          </h6>
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {item.product.category} • ${item.product.price} each
                          </small>
                        </div>
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0 hover:opacity-75"
                          onClick={() => onRemoveItem(item.product.id)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls and Total */}
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="input-group input-group-sm" style={{ width: '90px' }}>
                          <button
                            type="button"
                            className="btn btn-outline-secondary px-2 py-0.5"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="form-control text-center py-0.5 px-1 bg-white fw-semibold small">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline-secondary px-2 py-0.5"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="fw-bold text-dark small">
                          ${item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Calculations and Checkout */}
        {items.length > 0 && (
          <div className="border-top p-3 bg-light">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="mb-3">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Tag size={14} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Promo code (e.g. STUDENT20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit" className="btn btn-dark fw-medium px-3">
                  Apply
                </button>
              </div>

              {couponFeedback && (
                <div
                  className={`small mt-1 ${
                    couponFeedback.type === 'success' ? 'text-success' : 'text-danger'
                  }`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {couponFeedback.text}
                </div>
              )}

              {appliedCoupon && (
                <div className="d-flex align-items-center justify-content-between mt-2 p-1.5 px-2 bg-success-subtle text-success rounded-2 small">
                  <span className="d-flex align-items-center gap-1 fw-semibold">
                    <CheckCircle size={14} /> Code '{appliedCoupon}' active
                  </span>
                  <button
                    type="button"
                    className="btn btn-link text-danger p-0 small text-decoration-none"
                    onClick={onRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="small d-flex flex-column gap-1 mb-3">
              <div className="d-flex justify-content-between text-muted">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="text-dark fw-semibold">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="d-flex justify-content-between text-success">
                  <span>Coupon Discount</span>
                  <span className="fw-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between text-muted">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="badge bg-success-subtle text-success">FREE</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="d-flex justify-content-between text-muted">
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between border-top pt-2 mt-1">
                <span className="fw-bold text-slate-950 fs-6">Total Amount:</span>
                <span className="fw-black text-slate-950 fs-5 tabular-nums">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="btn btn-dark w-100 rounded-pill py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
