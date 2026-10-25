import React, { useState } from 'react';
import { CartItem, CustomerInfo, Order, AuthUser } from '../types/ecommerce';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Printer,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: string | null;
  onApplyCoupon?: (code: string) => { success: boolean; message: string };
  onRemoveCoupon?: () => void;
  currentUser?: AuthUser | null;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  currentUser,
  onOrderComplete,
}) => {
  const [customer, setCustomer] = useState<CustomerInfo>(() => ({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    postalCode: currentUser?.postalCode || '',
    paymentMethod: 'cod',
    notes: '',
  }));

  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  const validateCustomer = () => {
    const next: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.fullName.trim()) next.fullName = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      next.email = 'Enter a valid email address';
    }
    if (customer.phone.trim().length < 7) next.phone = 'Enter a valid phone number';
    if (!customer.address.trim()) next.address = 'Street address is required';
    if (!customer.city.trim()) next.city = 'City is required';
    if (!/^\d{4,10}$/.test(customer.postalCode.trim())) {
      next.postalCode = 'Enter a valid postal code';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };


  // Sync if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setCustomer((prev) => ({
        ...prev,
        fullName: currentUser.name || prev.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        postalCode: currentUser.postalCode || prev.postalCode,
      }));
    }
  }, [currentUser]);

  const handleModalClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleModalClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  // Totals calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon === 'STUDENT20') {
    discount = subtotal * 0.2;
  } else if (appliedCoupon === 'WELCOME10') {
    discount = subtotal * 0.1;
  } else if (appliedCoupon === 'SAVE15') {
    discount = Math.min(15, subtotal);
  }

  const isFreeShipping = subtotal - discount >= 75 || subtotal === 0;
  const shipping = isFreeShipping ? 0 : 10;
  const tax = Math.max(0, subtotal - discount) * 0.05;
  const total = Math.max(0, subtotal - discount + shipping + tax);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCustomer()) return;

    setSubmitting(true);

    setTimeout(() => {
      const order: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: [...items],
        subtotal,
        discount,
        shipping,
        tax,
        total,
        customer,
        couponCode: appliedCoupon || undefined,
        status: 'Confirmed',
        trackingNumber: `TCS-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        carrier: 'TCS Express Air Direct',
        estimatedDeliveryDate: 'In 2-3 business days',
      };

      setCompletedOrder(order);
      setSubmitting(false);
      onOrderComplete(order);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1085 }}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom bg-light py-3 px-4">
            <h5 id="checkout-modal-title" className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <ShoppingBag size={20} className="text-primary" />
              {completedOrder ? 'Order Confirmation Receipt' : 'Secure Checkout'}
            </h5>
            <button
              type="button"
              className="btn btn-light rounded-circle p-2"
              onClick={handleModalClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal-body p-4 bg-white">
            {completedOrder ? (
              /* Receipt View */
              <div className="text-center py-2" id="order-receipt-print">
                <div className="bg-success-subtle text-success p-3 rounded-circle d-inline-block mb-3">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="fw-extrabold text-dark mb-1">Thank You for Your Order!</h3>
                <p className="text-muted small mb-4">
                  Your order has been confirmed and is being prepped for dispatch.
                </p>

                <div className="card bg-light border p-4 rounded-4 text-start mb-4">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div>
                      <span className="text-muted small">Order Number</span>
                      <h6 className="fw-bold mb-0 text-dark">{completedOrder.id}</h6>
                    </div>
                    <div className="text-end">
                      <span className="text-muted small">Order Date</span>
                      <h6 className="fw-bold mb-0 text-dark">{completedOrder.date}</h6>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <span className="text-muted small d-block">Shipping Address:</span>
                      <strong className="text-dark small">{completedOrder.customer.fullName}</strong>
                      <div className="text-muted small">{completedOrder.customer.address}</div>
                      <div className="text-muted small">
                        {completedOrder.customer.city}, {completedOrder.customer.postalCode}
                      </div>
                      <div className="text-muted small">{completedOrder.customer.phone}</div>
                    </div>

                    <div className="col-sm-6">
                      <span className="text-muted small d-block">Payment Method:</span>
                      <strong className="text-dark small text-uppercase">
                        {completedOrder.customer.paymentMethod === 'cod'
                          ? 'Cash on Delivery (COD)'
                          : completedOrder.customer.paymentMethod}
                      </strong>
                      <div className="text-success small fw-medium mt-1">
                        Status: Order Confirmed
                      </div>
                    </div>
                  </div>

                  {/* Items breakdown in receipt */}
                  <div className="border-top pt-3">
                    <h6 className="fw-bold text-dark small mb-2">Ordered Items:</h6>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {completedOrder.items.map((i) => (
                        <div
                          key={i.product.id}
                          className="d-flex justify-content-between align-items-center small"
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-secondary rounded-pill">{i.quantity}x</span>
                            <span className="text-dark fw-medium">{i.product.name}</span>
                          </div>
                          <span className="fw-semibold text-dark">
                            ${i.product.price * i.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-top pt-2 small d-flex flex-column gap-1">
                      <div className="d-flex justify-content-between text-muted">
                        <span>Subtotal:</span>
                        <span>${completedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      {completedOrder.discount > 0 && (
                        <div className="d-flex justify-content-between text-success">
                          <span>Discount ({completedOrder.couponCode}):</span>
                          <span>-${completedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between text-muted">
                        <span>Shipping:</span>
                        <span>
                          {completedOrder.shipping === 0 ? 'FREE' : `$${completedOrder.shipping}`}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between text-muted">
                        <span>Estimated Tax:</span>
                        <span>${completedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between fw-bold text-dark fs-6 pt-2 border-top">
                        <span>Grand Total:</span>
                        <span className="text-primary">${completedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="btn btn-outline-secondary rounded-pill px-4 d-inline-flex align-items-center gap-2"
                  >
                    <Printer size={16} /> Print Receipt
                  </button>
                  <button
                    onClick={handleModalClose}
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-5">
                <div className="bg-light p-3 rounded-circle d-inline-block mb-3 text-muted">
                  <ShoppingBag size={40} className="text-muted opacity-50" />
                </div>
                <h5 className="fw-bold text-dark mb-1">Your Shopping Bag is Empty</h5>
                <p className="text-muted small mb-4">
                  Please add some items from the catalog before checking out.
                </p>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                >
                  Return to Store
                </button>
              </div>
            ) : (
              /* Checkout Form View */
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Left Column: Customer and Shipping Form */}
                  <div className="col-md-7">
                    <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                      <Truck size={18} className="text-primary" /> Delivery Information
                    </h6>

                    <div className="row g-2 mb-3">
                      <div className="col-12">
                        <label className="form-label small text-muted mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                          value={customer.fullName}
                          aria-invalid={!!errors.fullName}
                          onChange={(e) => {
                            setCustomer({ ...customer, fullName: e.target.value });
                            setErrors((prev) => ({ ...prev, fullName: undefined }));
                          }}
                          placeholder="Your full name"
                        />
                        {errors.fullName && (
                          <div className="invalid-feedback d-block">{errors.fullName}</div>
                        )}
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label small text-muted mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={customer.email}
                          aria-invalid={!!errors.email}
                          onChange={(e) => {
                            setCustomer({ ...customer, email: e.target.value });
                            setErrors((prev) => ({ ...prev, email: undefined }));
                          }}
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <div className="invalid-feedback d-block">{errors.email}</div>
                        )}
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label small text-muted mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          value={customer.phone}
                          aria-invalid={!!errors.phone}
                          onChange={(e) => {
                            setCustomer({ ...customer, phone: e.target.value });
                            setErrors((prev) => ({ ...prev, phone: undefined }));
                          }}
                          placeholder="+92 300 1234567"
                        />
                        {errors.phone && (
                          <div className="invalid-feedback d-block">{errors.phone}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label small text-muted mb-1">Street Address *</label>
                        <input
                          type="text"
                          required
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                          value={customer.address}
                          aria-invalid={!!errors.address}
                          onChange={(e) => {
                            setCustomer({ ...customer, address: e.target.value });
                            setErrors((prev) => ({ ...prev, address: undefined }));
                          }}
                          placeholder="House/Apartment #, Street, Area"
                        />
                        {errors.address && (
                          <div className="invalid-feedback d-block">{errors.address}</div>
                        )}
                      </div>

                      <div className="col-sm-7">
                        <label className="form-label small text-muted mb-1">City *</label>
                        <input
                          type="text"
                          required
                          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                          value={customer.city}
                          aria-invalid={!!errors.city}
                          onChange={(e) => {
                            setCustomer({ ...customer, city: e.target.value });
                            setErrors((prev) => ({ ...prev, city: undefined }));
                          }}
                          placeholder="e.g. Islamabad, Lahore, Karachi"
                        />
                        {errors.city && (
                          <div className="invalid-feedback d-block">{errors.city}</div>
                        )}
                      </div>

                      <div className="col-sm-5">
                        <label className="form-label small text-muted mb-1">Postal Code *</label>
                        <input
                          type="text"
                          required
                          className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                          value={customer.postalCode}
                          aria-invalid={!!errors.postalCode}
                          onChange={(e) => {
                            setCustomer({ ...customer, postalCode: e.target.value });
                            setErrors((prev) => ({ ...prev, postalCode: undefined }));
                          }}
                          placeholder="44000"
                        />
                        {errors.postalCode && (
                          <div className="invalid-feedback d-block">{errors.postalCode}</div>
                        )}
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark mb-3 mt-4 d-flex align-items-center gap-2">
                      <CreditCard size={18} className="text-dark" /> Payment Method
                    </h6>

                    <div className="d-flex flex-column gap-2 mb-3">
                      <label
                        className={`card p-3 border rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                          customer.paymentMethod === 'cod'
                            ? 'border-dark bg-slate-100'
                            : 'bg-light'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={customer.paymentMethod === 'cod'}
                            onChange={() =>
                              setCustomer({ ...customer, paymentMethod: 'cod' })
                            }
                            className="form-check-input mt-0"
                          />
                          <div>
                            <div className="fw-bold small text-dark">Cash on Delivery (COD)</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Pay with cash when package arrives
                            </div>
                          </div>
                        </div>
                        <span className="badge bg-dark rounded-pill">Recommended</span>
                      </label>

                      <label
                        className={`card p-3 border rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                          customer.paymentMethod === 'card'
                            ? 'border-dark bg-slate-100'
                            : 'bg-light'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={customer.paymentMethod === 'card'}
                            onChange={() =>
                              setCustomer({ ...customer, paymentMethod: 'card' })
                            }
                            className="form-check-input mt-0"
                          />
                          <div>
                            <div className="fw-bold small text-dark">Credit / Debit Card</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Visa, MasterCard, UnionPay
                            </div>
                          </div>
                        </div>
                        <span className="badge bg-secondary rounded-pill">Encrypted</span>
                      </label>

                      <label
                        className={`card p-3 border rounded-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${
                          customer.paymentMethod === 'jazzcash'
                            ? 'border-dark bg-slate-100'
                            : 'bg-light'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={customer.paymentMethod === 'jazzcash'}
                            onChange={() =>
                              setCustomer({ ...customer, paymentMethod: 'jazzcash' })
                            }
                            className="form-check-input mt-0"
                          />
                          <div>
                            <div className="fw-bold small text-dark">JazzCash / EasyPaisa</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Instant mobile wallet transfer
                            </div>
                          </div>
                        </div>
                        <span className="badge bg-danger rounded-pill">Mobile Wallet</span>
                      </label>
                    </div>
                  </div>

                  {/* Right Column: Order Summary */}
                  <div className="col-md-5">
                    <div className="card bg-light border rounded-4 p-3.5 sticky-top">
                      <h6 className="fw-bold text-dark mb-3">Order Summary ({items.length})</h6>

                      <div
                        className="d-flex flex-column gap-2 mb-3 overflow-y-auto pe-1"
                        style={{ maxHeight: '180px' }}
                      >
                        {items.map((item) => (
                          <div
                            key={item.product.id}
                            className="d-flex align-items-center justify-content-between small"
                          >
                            <div className="d-flex align-items-center gap-2 text-truncate">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="rounded object-fit-cover"
                                style={{ width: '36px', height: '36px' }}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
                                }}
                              />
                              <div className="text-truncate" style={{ maxWidth: '140px' }}>
                                <div className="text-truncate fw-semibold text-dark">
                                  {item.product.name}
                                </div>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="fw-bold text-dark tabular-nums">
                              ${item.product.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Promo Code Input at Checkout */}
                      <div className="mb-3 pt-2 border-top">
                        {appliedCoupon ? (
                          <div className="d-flex align-items-center justify-content-between p-2 bg-success-subtle text-success rounded-3 small">
                            <span className="fw-semibold" style={{ fontSize: '0.75rem' }}>
                              ✓ Code '{appliedCoupon}' active
                            </span>
                            {onRemoveCoupon && (
                              <button
                                type="button"
                                onClick={onRemoveCoupon}
                                className="btn btn-link text-danger p-0 small text-decoration-none"
                                style={{ fontSize: '0.75rem' }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="input-group input-group-sm">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Promo code (e.g. STUDENT20)"
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-dark"
                                onClick={() => {
                                  if (!promoInput.trim() || !onApplyCoupon) return;
                                  const res = onApplyCoupon(promoInput.trim().toUpperCase());
                                  setPromoMessage({ text: res.message, success: res.success });
                                  if (res.success) setPromoInput('');
                                }}
                              >
                                Apply
                              </button>
                            </div>
                            {promoMessage && (
                              <div
                                className={`small mt-1 ${
                                  promoMessage.success ? 'text-success' : 'text-danger'
                                }`}
                                style={{ fontSize: '0.72rem' }}
                              >
                                {promoMessage.text}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="border-top pt-2 small d-flex flex-column gap-1 mb-3">
                        <div className="d-flex justify-content-between text-muted">
                          <span>Subtotal</span>
                          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="d-flex justify-content-between text-success">
                            <span>Promo Discount</span>
                            <span className="tabular-nums">-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="d-flex justify-content-between text-muted">
                          <span>Shipping</span>
                          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="d-flex justify-content-between text-muted">
                          <span>Estimated Tax</span>
                          <span className="tabular-nums">${tax.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between border-top pt-2 mt-1 fw-bold fs-6">
                          <span>Total to Pay</span>
                          <span className="text-dark tabular-nums">${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                        <ShieldCheck size={16} className="text-success" />
                        <span>256-Bit SSL Secured Checkout</span>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || items.length === 0}
                        className="btn btn-dark w-100 rounded-pill py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      >
                        {submitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Processing Order...
                          </>
                        ) : (
                          <>
                            Place Order (${total.toFixed(2)}) <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
