import React, { useState } from 'react';
import { AuthUser, Order, Product } from '../types/ecommerce';
import { copyToClipboard } from '../utils/clipboard';
import {
  User,
  ShoppingBag,
  Heart,
  Award,
  MapPin,
  Clock,
  Truck,
  Eye,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Copy,
  Check,
  Gift,
  ExternalLink,
} from 'lucide-react';

interface CustomerPortalPageProps {
  user: AuthUser;
  orders: Order[];
  wishlistProducts: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onNavigateToTracking: (orderId: string) => void;
  onNavigateToShop: () => void;
  onSwitchToAdmin: () => void;
  onLogout: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  onUpdateUser?: (updated: AuthUser) => void;
}

export const CustomerPortalPage: React.FC<CustomerPortalPageProps> = ({
  user,
  orders,
  wishlistProducts,
  onAddToCart,
  onRemoveFromWishlist,
  onNavigateToTracking,
  onNavigateToShop,
  onSwitchToAdmin,
  onLogout,
  onShowToast,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'rewards' | 'profile'>('orders');
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    address: user.address,
  });

  React.useEffect(() => {
    setProfileForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      address: user.address,
    });
  }, [user]);

  // Filter orders for this customer (admins can inspect all orders)
  const customerOrders = React.useMemo(() => {
    if (user.role === 'admin') return orders;
    return orders.filter(
      (order) => (order.customer?.email || '').toLowerCase() === user.email.toLowerCase()
    );
  }, [orders, user]);

  const handleCopyVoucher = async (code: string) => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopiedCode(code);
      onShowToast('Voucher Copied', `Promo code ${code} copied to clipboard!`, 'success');
      setTimeout(() => setCopiedCode(null), 2500);
    } else {
      onShowToast('Copy Failed', 'Unable to copy to clipboard.', 'danger');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success text-white';
      case 'In Transit':
        return 'bg-primary text-white';
      case 'Dispatched':
        return 'bg-info text-dark';
      case 'Processing in Studio':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="py-4 py-md-5">
      {/* If Admin is viewing this customer portal */}
      {user.role === 'admin' && (
        <div className="alert bg-slate-950 text-white border border-slate-800 rounded-4 p-3.5 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 shadow-2xs">
          <div className="d-flex align-items-center gap-2.5">
            <div className="bg-white/10 text-white p-2 rounded-3 flex-shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <strong className="text-white small d-block">
                Master Admin Mode Active (Customer Experience View)
              </strong>
              <span className="text-slate-400 small" style={{ fontSize: '0.78rem' }}>
                You have dual-dashboard clearance. You can inspect customer orders or return to the
                full ERP/CRM suite.
              </span>
            </div>
          </div>
          <button
            onClick={onSwitchToAdmin}
            className="btn btn-light btn-sm rounded-pill px-3.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-sm text-nowrap text-slate-950"
          >
            Open Admin ERP/CRM Console <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Customer Header Banner */}
      <div className="card border border-hairline rounded-4 p-4 p-md-5 bg-white shadow-2xs mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow-2xs flex-shrink-0"
                style={{ width: '64px', height: '64px', fontSize: '1.4rem' }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h3 className="fw-extrabold text-dark tracking-tight mb-0">{user.name}</h3>
                  <span className="badge bg-dark rounded-pill px-2.5 py-1 text-xs">
                    {user.membershipTier}
                  </span>
                  {user.role === 'admin' && (
                    <span className="badge bg-primary rounded-pill px-2 py-0.5 text-xs">Admin</span>
                  )}
                </div>
                <div className="text-muted small">
                  {user.email} · Member since {user.joinedDate}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="d-flex flex-wrap align-items-center justify-content-lg-end gap-3">
              <div className="p-3 bg-light rounded-3 border border-hairline text-center">
                <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                  Studio Points
                </span>
                <strong className="text-dark fs-5 tabular-nums">
                  {user.loyaltyPoints.toLocaleString()}
                </strong>
              </div>

              <div className="p-3 bg-light rounded-3 border border-hairline text-center">
                <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                  Store Credit
                </span>
                <strong className="text-success fs-5 tabular-nums">
                  ${user.walletBalance.toFixed(2)}
                </strong>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-outline-danger rounded-pill px-3.5 py-2 btn-sm fw-medium d-inline-flex align-items-center gap-1.5"
                title="Sign out of account"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Tabs */}
      <div className="d-flex border-bottom border-hairline mb-4 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`btn btn-sm px-4 py-2.5 fw-semibold text-nowrap rounded-top-3 border-0 ${
            activeTab === 'orders'
              ? 'bg-white text-dark border-top border-start border-end border-hairline shadow-2xs'
              : 'text-secondary hover:text-dark'
          }`}
        >
          <ShoppingBag size={16} className="me-1.5" /> My Orders ({customerOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`btn btn-sm px-4 py-2.5 fw-semibold text-nowrap rounded-top-3 border-0 ${
            activeTab === 'wishlist'
              ? 'bg-white text-dark border-top border-start border-end border-hairline shadow-2xs'
              : 'text-secondary hover:text-dark'
          }`}
        >
          <Heart size={16} className="me-1.5" /> Saved Items ({wishlistProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`btn btn-sm px-4 py-2.5 fw-semibold text-nowrap rounded-top-3 border-0 ${
            activeTab === 'rewards'
              ? 'bg-white text-dark border-top border-start border-end border-hairline shadow-2xs'
              : 'text-secondary hover:text-dark'
          }`}
        >
          <Gift size={16} className="me-1.5" /> Rewards & VIP Perks
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`btn btn-sm px-4 py-2.5 fw-semibold text-nowrap rounded-top-3 border-0 ${
            activeTab === 'profile'
              ? 'bg-white text-dark border-top border-start border-end border-hairline shadow-2xs'
              : 'text-secondary hover:text-dark'
          }`}
        >
          <MapPin size={16} className="me-1.5" /> Delivery Address & Profile
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="card border border-hairline rounded-4 bg-white shadow-2xs p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold text-dark mb-0">Your Order History</h5>
              <small className="text-muted">
                Track live parcels, inspect itemized receipts, or re-order garments
              </small>
            </div>
            <button onClick={onNavigateToShop} className="btn btn-outline-dark btn-sm rounded-pill px-3">
              Shop More
            </button>
          </div>

          {customerOrders.length === 0 ? (
            <div className="text-center py-5">
              <ShoppingBag size={40} className="mx-auto text-muted mb-2 opacity-50" />
              <h6 className="fw-bold text-dark mb-1">No orders placed yet</h6>
              <p className="text-muted small mb-3">
                Items you purchase at checkout will automatically appear here with live tracking.
              </p>
              <button onClick={onNavigateToShop} className="btn btn-dark rounded-pill px-4 btn-sm">
                Explore Studio Collection
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="card border border-hairline rounded-3 p-3.5 bg-white shadow-2xs"
                >
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-3 mb-3">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <strong className="text-dark font-monospace">{ord.id}</strong>
                        <span className={`badge rounded-pill px-2.5 py-1 ${getStatusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-muted small">Placed on {ord.date}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={() => onNavigateToTracking(ord.id)}
                        className="btn btn-dark btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1.5"
                      >
                        <Truck size={14} /> Track Delivery
                      </button>
                      <button
                        onClick={() => setSelectedReceipt(ord)}
                        className="btn btn-light border border-hairline btn-sm rounded-pill px-3"
                      >
                        <Eye size={14} className="me-1" /> Receipt
                      </button>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="row g-2 align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex flex-wrap gap-2">
                        {ord.items.map((i) => (
                          <div
                            key={i.product.id}
                            className="d-flex align-items-center gap-2 bg-light p-1.5 px-2 rounded-2 border border-hairline"
                          >
                            <img
                              src={i.product.image}
                              alt={i.product.name}
                              className="rounded object-fit-cover"
                              style={{ width: '30px', height: '30px' }}
                            />
                            <span className="small text-dark fw-medium text-truncate" style={{ maxWidth: '140px' }}>
                              {i.product.name}
                            </span>
                            <span className="badge bg-secondary text-white rounded-pill" style={{ fontSize: '0.65rem' }}>
                              {i.quantity}x
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-4 text-md-end">
                      <span className="text-muted small d-block">Grand Total</span>
                      <strong className="text-dark fs-6 tabular-nums">${ord.total.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="card border border-hairline rounded-4 bg-white shadow-2xs p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold text-dark mb-0">Your Curated Wishlist</h5>
              <small className="text-muted">Saved garments and accessories ready for your wardrobe</small>
            </div>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-5">
              <Heart size={40} className="mx-auto text-muted mb-2 opacity-50" />
              <h6 className="fw-bold text-dark mb-1">Your wishlist is currently empty</h6>
              <p className="text-muted small mb-3">
                Click the heart icon on any product in the store to save it here for later.
              </p>
              <button onClick={onNavigateToShop} className="btn btn-dark rounded-pill px-4 btn-sm">
                Discover Pieces
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="col-sm-6 col-md-4 col-lg-3">
                  <div className="card h-100 border border-hairline rounded-3 p-3 bg-white shadow-2xs d-flex flex-column">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="rounded-2 object-fit-cover w-100 mb-2"
                      style={{ height: '160px' }}
                    />
                    <div className="text-muted text-uppercase small" style={{ fontSize: '0.7rem' }}>
                      {p.category}
                    </div>
                    <h6 className="fw-bold text-dark text-truncate mb-1">{p.name}</h6>
                    <div className="fw-bold text-dark mb-3 tabular-nums">${p.price}</div>
                    <div className="mt-auto d-flex gap-2">
                      <button
                        onClick={() => onAddToCart(p)}
                        className="btn btn-dark btn-sm rounded-pill flex-grow-1"
                      >
                        Add to Bag
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(p)}
                        className="btn btn-outline-secondary btn-sm rounded-pill px-2.5"
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REWARDS & VIP PERKS */}
      {activeTab === 'rewards' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border border-hairline rounded-4 bg-white shadow-2xs p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Award size={22} className="text-dark" />
                <h5 className="fw-bold text-dark mb-0">VIP Tier Status: {user.membershipTier}</h5>
              </div>
              <p className="text-secondary small leading-relaxed mb-4">
                You earn <strong>10 Studio Points</strong> for every $1 spent at ShopSphere. As an
                esteemed member, you enjoy priority atelier dispatch and complimentary alterations.
              </p>

              <div className="p-3 bg-light rounded-3 border border-hairline mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1 small">
                  <span className="fw-semibold text-dark">Progress to Next Atelier Privilege</span>
                  <span className="text-muted tabular-nums">
                    {user.loyaltyPoints.toLocaleString()} / 2,000 pts
                  </span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-dark"
                    role="progressbar"
                    style={{
                      width: `${Math.min(100, Math.round((user.loyaltyPoints / 2000) * 100))}%`,
                    }}
                    aria-valuenow={Math.min(100, Math.round((user.loyaltyPoints / 2000) * 100))}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <span className="text-muted mt-1 d-block" style={{ fontSize: '0.72rem' }}>
                  {user.loyaltyPoints >= 2000
                    ? 'Congratulations! You have reached Atelier Platinum tier.'
                    : `Earn ${Math.max(0, 2000 - user.loyaltyPoints).toLocaleString()} more points to unlock dedicated concierge styling.`}
                </span>
              </div>

              <h6 className="fw-bold text-dark small mb-2">Member Privileges:</h6>
              <div className="d-flex flex-column gap-2 small text-secondary">
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={16} className="text-dark" />
                  <span>Free express courier shipping with no minimum spend</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={16} className="text-dark" />
                  <span>Extended 45-day return window on tailored garments</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={16} className="text-dark" />
                  <span>Early private access to seasonal drops 24h prior</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border border-hairline rounded-4 bg-white shadow-2xs p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Gift size={22} className="text-dark" />
                <h5 className="fw-bold text-dark mb-0">Active Rewards Coupons</h5>
              </div>
              <p className="text-muted small mb-4">
                Copy and apply these private discount codes directly at checkout.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="p-3 border border-hairline rounded-3 bg-light d-flex align-items-center justify-content-between">
                  <div>
                    <span className="badge bg-dark rounded-1 mb-1">STUDENT20</span>
                    <div className="fw-bold text-dark small">20% Off Complete Order</div>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Valid on all apparel and leather shoes
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyVoucher('STUDENT20')}
                    className="btn btn-outline-dark btn-sm rounded-pill px-3"
                  >
                    {copiedCode === 'STUDENT20' ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <div className="p-3 border border-hairline rounded-3 bg-light d-flex align-items-center justify-content-between">
                  <div>
                    <span className="badge bg-dark rounded-1 mb-1">WELCOME10</span>
                    <div className="fw-bold text-dark small">10% Welcome Credit</div>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Applicable on first-time collection items
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyVoucher('WELCOME10')}
                    className="btn btn-outline-dark btn-sm rounded-pill px-3"
                  >
                    {copiedCode === 'WELCOME10' ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <div className="p-3 border border-hairline rounded-3 bg-light d-flex align-items-center justify-content-between">
                  <div>
                    <span className="badge bg-dark rounded-1 mb-1">SAVE15</span>
                    <div className="fw-bold text-dark small">$15 Flat Studio Voucher</div>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Orders exceeding $60
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyVoucher('SAVE15')}
                    className="btn btn-outline-dark btn-sm rounded-pill px-3"
                  >
                    {copiedCode === 'SAVE15' ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE & ADDRESS */}
      {activeTab === 'profile' && (
        <div className="card border border-hairline rounded-4 bg-white shadow-2xs p-4 max-w-2xl">
          <h5 className="fw-bold text-dark mb-1">Delivery Address & Account Profile</h5>
          <p className="text-muted small mb-4">
            Manage your default shipping destination and personal contact preferences
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updated: AuthUser = {
                ...user,
                name: profileForm.name,
                email: profileForm.email,
                phone: profileForm.phone,
                city: profileForm.city,
                address: profileForm.address,
              };
              if (onUpdateUser) {
                onUpdateUser(updated);
              } else {
                onShowToast('Profile Saved', 'Your address preferences were updated.', 'success');
              }
            }}
          >
            <div className="row g-3">
              <div className="col-sm-6">
                <label className="form-label small fw-medium text-dark mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control bg-light"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label small fw-medium text-dark mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control bg-light"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label small fw-medium text-dark mb-1">Contact Phone</label>
                <input
                  type="tel"
                  className="form-control bg-light"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label small fw-medium text-dark mb-1">City</label>
                <input
                  type="text"
                  required
                  className="form-control bg-light"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-medium text-dark mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  className="form-control bg-light"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                />
              </div>

              <div className="col-12 pt-2">
                <button
                  type="submit"
                  className="btn btn-dark rounded-pill px-4 btn-sm fw-medium shadow-2xs"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1090 }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom bg-light py-3 px-4">
                <div>
                  <span className="text-muted small">Customer Receipt</span>
                  <h6 className="fw-bold text-dark font-monospace mb-0">{selectedReceipt.id}</h6>
                </div>
                <button
                  type="button"
                  className="btn btn-light rounded-circle p-2"
                  onClick={() => setSelectedReceipt(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body p-4 bg-white">
                <div className="small mb-3">
                  <div className="text-muted">Order Date: {selectedReceipt.date}</div>
                  <div className="text-muted">Carrier: {selectedReceipt.carrier}</div>
                  <div className="text-muted font-monospace">AWB: {selectedReceipt.trackingNumber}</div>
                </div>

                <div className="border rounded-3 p-3 bg-light mb-3">
                  {selectedReceipt.items.map((i) => (
                    <div
                      key={i.product.id}
                      className="d-flex justify-content-between align-items-center small py-1"
                    >
                      <span className="text-dark">
                        {i.product.name} × {i.quantity}
                      </span>
                      <strong className="text-dark tabular-nums">
                        ${i.product.price * i.quantity}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="text-end small">
                  <div>Subtotal: ${selectedReceipt.subtotal.toFixed(2)}</div>
                  {selectedReceipt.discount > 0 && (
                    <div className="text-success">
                      Discount: -${selectedReceipt.discount.toFixed(2)}
                    </div>
                  )}
                  <div className="fw-bold fs-6 text-dark pt-1 border-top mt-1">
                    Total: ${selectedReceipt.total.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top bg-light py-2 px-4 d-flex justify-content-end">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="btn btn-outline-secondary rounded-pill px-4 btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
