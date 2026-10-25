import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ArrowRight, HelpCircle } from 'lucide-react';
import { ContactInquiry } from '../types/ecommerce';

interface ContactPageProps {
  onNavigateToTracking: () => void;
  onNavigateToFaq: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateToTracking,
  onNavigateToFaq,
  onShowToast,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    topic: 'General Question',
    orderNumber: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<'fullName' | 'email' | 'phone' | 'message', string>>>({});

  const validateContact = () => {
    const next: Partial<Record<'fullName' | 'email' | 'phone' | 'message', string>> = {};
    if (!formData.fullName.trim()) next.fullName = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      next.email = 'Enter a valid email address';
    }
    if (formData.phone.trim() && formData.phone.trim().length < 7) {
      next.phone = 'Enter a valid phone number';
    }
    if (formData.message.trim().length < 10) {
      next.message = 'Please enter at least 10 characters';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact()) return;

    setSubmitting(true);

    setTimeout(() => {
      const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedTicket(ticketId);
      setSubmitting(false);
      onShowToast(
        'Inquiry Received',
        `Your inquiry ${ticketId} has been logged. Our concierge will email you shortly.`,
        'success'
      );
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      topic: 'General Question',
      orderNumber: '',
      message: '',
    });
    setSubmittedTicket(null);
    setErrors({});
  };

  return (
    <div className="py-4 py-md-5">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 px-3">
        <span className="text-muted small text-uppercase tracking-wider fw-semibold d-block mb-2">
          Concierge & Client Care
        </span>
        <h1 className="display-6 fw-bold text-dark tracking-tight mb-2">How may we assist you?</h1>
        <p className="text-secondary small leading-relaxed">
          Whether you require advice on garments, order inquiries, or custom styling requests, our
          dedicated team is here to assist.
        </p>
      </div>

      <div className="row g-4 g-lg-5">
        {/* Left Column: Inquiry Form */}
        <div className="col-lg-7">
          <div className="card border border-hairline rounded-4 p-4 p-md-5 bg-white shadow-2xs">
            {submittedTicket ? (
              <div className="text-center py-4">
                <div className="bg-light p-3 rounded-circle d-inline-block mb-3 text-dark">
                  <CheckCircle2 size={40} className="text-dark" />
                </div>
                <h4 className="fw-bold text-dark mb-2">Message Dispatched</h4>
                <p className="text-secondary small mb-3">
                  Thank you, <strong>{formData.fullName || 'valued client'}</strong>. Your inquiry
                  has been routed directly to our care atelier under reference ID:
                </p>
                <div className="bg-light border border-hairline py-2 px-3 rounded-3 d-inline-block font-monospace fw-bold text-dark mb-4">
                  {submittedTicket}
                </div>
                <div>
                  <button onClick={handleReset} className="btn btn-outline-dark rounded-pill px-4 btn-sm">
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h4 className="fw-bold text-dark mb-1">Direct Client Inquiry</h4>
                <p className="text-muted small mb-4">
                  Fill in the fields below and we will respond within 2–4 business hours.
                </p>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-medium text-dark mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohsin Gohar"
                      className={`form-control bg-light border-hairline ${errors.fullName ? 'is-invalid' : ''}`}
                      value={formData.fullName}
                      aria-invalid={!!errors.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        setErrors((prev) => ({ ...prev, fullName: undefined }));
                      }}
                    />
                    {errors.fullName && <div className="invalid-feedback d-block">{errors.fullName}</div>}
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-medium text-dark mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={`form-control bg-light border-hairline ${errors.email ? 'is-invalid' : ''}`}
                      value={formData.email}
                      aria-invalid={!!errors.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                    />
                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-medium text-dark mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      className={`form-control bg-light border-hairline ${errors.phone ? 'is-invalid' : ''}`}
                      value={formData.phone}
                      aria-invalid={!!errors.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                    />
                    {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-medium text-dark mb-1">Topic *</label>
                    <select
                      className="form-select bg-light border-hairline"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      <option value="General Question">General Question</option>
                      <option value="Order Status & Delivery">Order Status & Delivery</option>
                      <option value="Sizing & Fit Advice">Sizing & Fit Advice</option>
                      <option value="Return or Exchange">Return or Exchange</option>
                      <option value="Press & Studio Partnership">Press & Studio Partnership</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-medium text-dark mb-1">
                      Order Reference (if applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ORD-2026-8491"
                      className="form-control bg-light border-hairline"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-medium text-dark mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us how we can help with your wardrobe or inquiry..."
                      className={`form-control bg-light border-hairline ${errors.message ? 'is-invalid' : ''}`}
                      value={formData.message}
                      aria-invalid={!!errors.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                    ></textarea>
                    {errors.message && <div className="invalid-feedback d-block">{errors.message}</div>}
                  </div>

                  <div className="col-12 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-dark rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2 fw-medium shadow-xs"
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Submit Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Studio Locations & Quick Actions */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-4">
            {/* Quick Helper Cards */}
            <div className="card border border-hairline rounded-4 p-4 bg-white shadow-2xs">
              <h5 className="fw-bold text-dark mb-3">Instant Self-Service</h5>
              <div className="d-flex flex-column gap-2.5">
                <button
                  onClick={onNavigateToTracking}
                  className="btn btn-light border border-hairline text-start p-3 rounded-3 d-flex align-items-center justify-content-between hover:bg-slate-100"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-dark text-white p-2 rounded-2">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="fw-bold text-dark small">Looking for Order Tracking?</div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Check live fulfillment and dispatch status
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </button>

                <button
                  onClick={onNavigateToFaq}
                  className="btn btn-light border border-hairline text-start p-3 rounded-3 d-flex align-items-center justify-content-between hover:bg-slate-100"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-dark text-white p-2 rounded-2">
                      <HelpCircle size={16} />
                    </div>
                    <div>
                      <div className="fw-bold text-dark small">Browse Common Questions</div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Read policy, returns, and sizing answers
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </button>
              </div>
            </div>

            {/* Direct Studio Channels */}
            <div className="card border border-hairline rounded-4 p-4 bg-white shadow-2xs">
              <h5 className="fw-bold text-dark mb-3">Studio Contact Details</h5>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3">
                  <MapPin size={20} className="text-dark flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark small d-block">Studio Atelier & Showroom</strong>
                    <span className="text-secondary small leading-relaxed d-block">
                      ShopSphere Atelier, 2nd Floor, Executive Heights, Sector F-7/2, Islamabad, Pakistan
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-3 border-top pt-3">
                  <Clock size={20} className="text-dark flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark small d-block">Concierge Operating Hours</strong>
                    <span className="text-secondary small d-block">
                      Monday to Saturday: 9:00 AM – 7:00 PM (PKT)
                    </span>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      Sunday: Reserved for Atelier Pattern Making
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-3 border-top pt-3">
                  <Mail size={20} className="text-dark flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark small d-block">Client Concierge Email</strong>
                    <a
                      href="mailto:care@shopsphere.studio"
                      className="text-decoration-none text-dark fw-medium small hover:underline"
                    >
                      care@shopsphere.studio
                    </a>
                  </div>
                </div>

                <div className="d-flex gap-3 border-top pt-3">
                  <Phone size={20} className="text-dark flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark small d-block">Direct Telephone & WhatsApp</strong>
                    <span className="text-dark fw-medium small d-block tabular-nums">
                      +92 (300) 123-4567
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
