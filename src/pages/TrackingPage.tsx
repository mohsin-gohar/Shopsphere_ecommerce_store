import React, { useState } from 'react';
import { Order } from '../types/ecommerce';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin, Printer, AlertCircle } from 'lucide-react';

interface TrackingPageProps {
  orders: Order[];
  onExploreShop: () => void;
  initialOrderId?: string | null;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ orders, onExploreShop, initialOrderId }) => {
  // Pre-seed a default demo order if none exists
  const defaultDemoOrder: Order = {
    id: 'ORD-2026-8491',
    date: 'Oct 21, 2026',
    customer: {
      fullName: 'Mohsin Gohar',
      email: 'mohsingohar759@gmail.com',
      phone: '+92 300 1234567',
      address: 'House 14, Street 4, Sector G-11/3',
      city: 'Islamabad',
      postalCode: '44000',
      paymentMethod: 'cod',
    },
    items: [
      {
        product: {
          id: 1,
          name: 'Classic Oversized Shirt',
          category: 'Men',
          price: 59,
          rating: 4.9,
          reviews: 124,
          short_desc: 'Relaxed oversized shirt offering timeless style.',
          long_description: 'Designed with a relaxed oversized silhouette.',
          image:
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85',
        },
        quantity: 1,
      },
      {
        product: {
          id: 3,
          name: 'Essential Leather Sneakers',
          category: 'Shoes',
          price: 79,
          rating: 4.9,
          reviews: 156,
          short_desc: 'Premium leather sneakers combining clean design.',
          long_description: 'These essential leather sneakers bring together clean aesthetic.',
          image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
        },
        quantity: 1,
      },
    ],
    subtotal: 138,
    discount: 27.6,
    shipping: 0,
    tax: 5.52,
    total: 115.92,
    couponCode: 'STUDENT20',
    status: 'In Transit',
    trackingNumber: 'TCS-EXP-98421034',
    carrier: 'TCS Express Air Direct',
    estimatedDeliveryDate: 'Tomorrow, by 5:00 PM',
  };

  const allAvailableOrders = React.useMemo(() => {
    const list = [...orders];
    if (!list.some((o) => o.id === defaultDemoOrder.id)) {
      list.unshift(defaultDemoOrder);
    }
    return list;
  }, [orders]);

  // Initialize with initialOrderId if matched, otherwise default demo order
  const getInitialOrder = () => {
    if (initialOrderId) {
      const match = allAvailableOrders.find(
        (o) =>
          o.id.toLowerCase() === initialOrderId.trim().toLowerCase() ||
          (o.trackingNumber && o.trackingNumber.toLowerCase() === initialOrderId.trim().toLowerCase())
      );
      if (match) return match;
    }
    return allAvailableOrders[0] || defaultDemoOrder;
  };

  const [searchQuery, setSearchQuery] = useState(() => getInitialOrder()?.id || defaultDemoOrder.id);
  const [activeOrder, setActiveOrder] = useState<Order | null>(getInitialOrder);
  const [hasSearched, setHasSearched] = useState(false);

  React.useEffect(() => {
    if (initialOrderId) {
      const match = allAvailableOrders.find(
        (o) =>
          o.id.toLowerCase() === initialOrderId.trim().toLowerCase() ||
          (o.trackingNumber && o.trackingNumber.toLowerCase() === initialOrderId.trim().toLowerCase())
      );
      if (match) {
        setActiveOrder(match);
        setSearchQuery(match.id);
        setHasSearched(false);
      }
    }
  }, [initialOrderId, allAvailableOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = allAvailableOrders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.customer.email.toLowerCase() === query ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === query)
    );

    setActiveOrder(found || null);
  };

  const selectOrder = (ord: Order) => {
    setSearchQuery(ord.id);
    setActiveOrder(ord);
    setHasSearched(false);
  };

  const trackingSteps = [
    { label: 'Order Confirmed', detail: 'Payment verified & order recorded' },
    { label: 'Processing in Studio', detail: 'Garments tailored & inspected' },
    { label: 'Dispatched', detail: 'Handed over to carrier courier' },
    { label: 'In Transit', detail: 'En route through sorting facility' },
    { label: 'Delivered', detail: 'Out for final doorstep delivery' },
  ];

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return 0;
      case 'Processing in Studio':
        return 1;
      case 'Dispatched':
        return 2;
      case 'In Transit':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 3; // Default to In Transit for demo
    }
  };

  const currentStepIndex = getStepIndex(activeOrder?.status);

  return (
    <div className="py-4 py-md-5">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 px-3">
        <span className="text-muted small text-uppercase tracking-wider fw-semibold d-block mb-2">
          Real-Time Shipment Hub
        </span>
        <h1 className="display-6 fw-bold text-dark tracking-tight mb-2">Track Your Delivery</h1>
        <p className="text-secondary small leading-relaxed">
          Enter your Order ID or email address to view live milestone fulfillment and courier
          transit updates.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="max-w-xl mx-auto mb-4">
        <form onSubmit={handleSearch}>
          <div className="input-group input-group-lg shadow-2xs rounded-pill overflow-hidden border border-hairline bg-white">
            <span className="input-group-text bg-white border-0 ps-4 text-muted">
              <Search size={20} />
            </span>
            <input
              type="text"
              className="form-control border-0 py-3 bg-white"
              placeholder="Enter Order ID (e.g. ORD-2026-8491) or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-dark px-4 fw-medium">
              Track
            </button>
          </div>
        </form>

        {/* Quick Demo Pickers */}
        <div className="d-flex align-items-center justify-content-center gap-2 mt-3 small text-muted">
          <span>Quick Samples:</span>
          <button
            type="button"
            onClick={() => selectOrder(defaultDemoOrder)}
            className="btn btn-link p-0 text-dark small text-decoration-none fw-semibold hover:underline"
          >
            Demo #{defaultDemoOrder.id}
          </button>
          {orders.length > 0 && orders[0].id !== defaultDemoOrder.id && (
            <>
              <span>•</span>
              <button
                type="button"
                onClick={() => selectOrder(orders[0])}
                className="btn btn-link p-0 text-primary small text-decoration-none fw-semibold hover:underline"
              >
                Recent Order ({orders[0].id})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Order Not Found State */}
      {!activeOrder && (
        <div className="card border border-hairline rounded-4 p-5 text-center max-w-lg mx-auto bg-white shadow-2xs my-4">
          <div className="bg-light p-3 rounded-circle d-inline-block mx-auto mb-3 text-muted">
            <AlertCircle size={36} />
          </div>
          <h5 className="fw-bold text-dark mb-1">No Matching Shipment Found</h5>
          <p className="text-muted small mb-4">
            We couldn't locate an active order matching <strong>"{searchQuery}"</strong>. Please
            check your order receipt confirmation or verify your details.
          </p>
          <div>
            <button
              onClick={() => selectOrder(defaultDemoOrder)}
              className="btn btn-dark rounded-pill px-4 btn-sm"
            >
              Load Demo Order
            </button>
          </div>
        </div>
      )}

      {/* Order Details & Visual Timeline */}
      {activeOrder && (
        <div className="max-w-4xl mx-auto">
          {/* Status Header Card */}
          <div className="card border border-hairline rounded-4 p-4 bg-white shadow-2xs mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-3 mb-4">
              <div>
                <span className="text-muted small d-block">Order Reference Number</span>
                <h4 className="fw-bold text-dark mb-0 font-monospace">{activeOrder.id}</h4>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-light text-dark border px-3 py-1.5 rounded-pill fw-semibold">
                  Status: {activeOrder.status || 'In Transit'}
                </span>
                <button
                  onClick={() => window.print()}
                  className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-1 px-3"
                  title="Print shipment receipt"
                >
                  <Printer size={14} /> Print
                </button>
              </div>
            </div>

            {/* 5-Step Visual Timeline */}
            <div className="py-2">
              <h6 className="fw-bold text-dark small text-uppercase tracking-wider mb-4">
                Fulfillment Milestone Journey
              </h6>

              <div className="row g-2 text-center position-relative">
                {trackingSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={idx} className="col">
                      <div className="d-flex flex-column align-items-center">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-2xs ${
                            isDone ? 'bg-dark text-white' : 'bg-light text-muted border'
                          }`}
                          style={{ width: '38px', height: '38px' }}
                        >
                          {isDone ? <CheckCircle2 size={18} /> : <Clock size={16} />}
                        </div>
                        <span
                          className={`small fw-bold d-block mb-1 ${
                            isCurrent ? 'text-dark' : isDone ? 'text-secondary' : 'text-muted'
                          }`}
                          style={{ fontSize: '0.8rem' }}
                        >
                          {step.label}
                        </span>
                        <span
                          className="text-muted d-none d-md-block"
                          style={{ fontSize: '0.7rem', lineHeight: '1.2' }}
                        >
                          {step.detail}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shipment & Package Metadata Grid */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card h-100 border border-hairline rounded-4 p-4 bg-white shadow-2xs">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <Truck size={18} className="text-dark" /> Courier Information
                </h6>
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex justify-content-between text-muted">
                    <span>Carrier Service:</span>
                    <strong className="text-dark">{activeOrder.carrier || 'TCS Express Air Direct'}</strong>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <span>Tracking Airway Bill:</span>
                    <strong className="text-dark font-monospace">
                      {activeOrder.trackingNumber || 'TCS-EXP-98421034'}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <span>Estimated Arrival:</span>
                    <strong className="text-success fw-bold">
                      {activeOrder.estimatedDeliveryDate || 'Tomorrow, by 5:00 PM'}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <span>Payment Mode:</span>
                    <span className="text-dark text-uppercase fw-semibold">
                      {activeOrder.customer.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border border-hairline rounded-4 p-4 bg-white shadow-2xs">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <MapPin size={18} className="text-dark" /> Delivery Destination
                </h6>
                <div className="small">
                  <strong className="text-dark d-block mb-1">{activeOrder.customer.fullName}</strong>
                  <span className="text-secondary d-block">{activeOrder.customer.address}</span>
                  <span className="text-secondary d-block">
                    {activeOrder.customer.city}, {activeOrder.customer.postalCode}
                  </span>
                  <span className="text-muted d-block mt-2 tabular-nums">
                    Phone: {activeOrder.customer.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Order Package Details */}
          <div className="card border border-hairline rounded-4 p-4 bg-white shadow-2xs">
            <h6 className="fw-bold text-dark mb-3">Package Contents ({activeOrder.items.length})</h6>
            <div className="d-flex flex-column gap-3">
              {activeOrder.items.map((item) => (
                <div
                  key={item.product.id}
                  className="d-flex align-items-center justify-content-between border-bottom pb-3"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="rounded-2 object-fit-cover"
                      style={{ width: '56px', height: '56px' }}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div>
                      <h6 className="fw-bold text-dark mb-0 small">{item.product.name}</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Qty: {item.quantity} • ${item.product.price} each
                      </span>
                    </div>
                  </div>
                  <span className="fw-bold text-dark small tabular-nums">
                    ${item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-3 text-end small d-flex flex-column gap-1">
              <div className="text-muted">
                Subtotal: <span className="text-dark fw-semibold">${activeOrder.subtotal.toFixed(2)}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="text-success">
                  Coupon Discount: -${activeOrder.discount.toFixed(2)}
                </div>
              )}
              <div className="text-muted">
                Shipping:{' '}
                <span className="text-dark fw-semibold">
                  {activeOrder.shipping === 0 ? 'FREE' : `$${activeOrder.shipping}`}
                </span>
              </div>
              <div className="fw-bold text-dark fs-6 pt-2 border-top mt-1">
                Total Paid: <span className="text-dark tabular-nums">${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
