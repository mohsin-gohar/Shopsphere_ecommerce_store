import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { FaqItem } from '../types/ecommerce';

interface FaqPageProps {
  onNavigateToContact: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigateToContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'shipping' | 'returns' | 'sizing' | 'payment'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'shipping',
      question: 'How long does shipping take and what are the delivery charges?',
      answer:
        'Standard domestic delivery takes 2 to 4 business days. Express next-day dispatch is available on all orders placed before 2:00 PM. We offer 100% FREE express shipping on all orders above $75. For orders below $75, a nominal flat rate of $10 applies.',
    },
    {
      id: 'faq-2',
      category: 'shipping',
      question: 'Do you provide a tracking number after ordering?',
      answer:
        'Yes, immediately once your order is packaged in our studio, an automated Airway Bill (AWB) tracking number is generated. You can paste your Order ID into our "Order Tracking" page to inspect real-time courier checkpoints.',
    },
    {
      id: 'faq-3',
      category: 'returns',
      question: 'What is your 30-day exchange and return policy?',
      answer:
        'We offer a straightforward 30-day return policy. If your garment or footwear does not fit as expected, simply contact our concierge or initiate an exchange. All items must be unwashed, unworn, and accompanied by original packaging.',
    },
    {
      id: 'faq-4',
      category: 'returns',
      question: 'How are refunds processed for Cash on Delivery (COD) orders?',
      answer:
        'For COD orders, refunds can be dispatched directly to your Bank Account, JazzCash, or EasyPaisa wallet within 24 to 48 hours after our quality control atelier inspects the returned parcel.',
    },
    {
      id: 'faq-5',
      category: 'sizing',
      question: 'How do I choose the correct garment size?',
      answer:
        'Our apparel follows standard contemporary relaxed sizing (S, M, L, XL). We recommend selecting your true standard size for an intentional modern drape, or sizing down if you prefer a slim tailored fit. Detailed measurements are listed in each product view.',
    },
    {
      id: 'faq-6',
      category: 'sizing',
      question: 'What fabrics and materials are used in your collection?',
      answer:
        'We utilize 100% pre-shrunk combed organic cotton (240 GSM), vegetable-tanned full-grain leather, and sustainable linen blends. All garments are pre-washed to eliminate shrinkage after household laundering.',
    },
    {
      id: 'faq-7',
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer:
        'We support Cash on Delivery (COD) across Pakistan, Visa & MasterCard credit/debit cards, Direct Bank Transfers, as well as mobile wallets including JazzCash and EasyPaisa.',
    },
    {
      id: 'faq-8',
      category: 'payment',
      question: 'Are online transactions safe and encrypted?',
      answer:
        'Yes, all digital transactions are secured via 256-bit SSL encryption. We never store raw CVV codes or payment credentials on our servers.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      if (activeCategory !== 'all' && faq.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = faq.question.toLowerCase().includes(query);
        const matchesA = faq.answer.toLowerCase().includes(query);
        return matchesQ || matchesA;
      }
      return true;
    });
  }, [faqs, activeCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="py-4 py-md-5">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 px-3">
        <span className="text-muted small text-uppercase tracking-wider fw-semibold d-block mb-2">
          Knowledge Base & Help Desk
        </span>
        <h1 className="display-6 fw-bold text-dark tracking-tight mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-secondary small leading-relaxed">
          Find transparent answers regarding shipments, sizing standards, payment security, and our
          guarantee.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-4">
        <div className="input-group shadow-2xs rounded-pill overflow-hidden border border-hairline bg-white">
          <span className="input-group-text bg-white border-0 ps-3 text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-control border-0 py-2.5 bg-white small"
            placeholder="Search answers (e.g. shipping time, refund, sizing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-4">
        <button
          onClick={() => setActiveCategory('all')}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium ${
            activeCategory === 'all'
              ? 'btn-dark text-white'
              : 'btn-light border border-hairline text-secondary'
          }`}
        >
          All Topics
        </button>
        <button
          onClick={() => setActiveCategory('shipping')}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium ${
            activeCategory === 'shipping'
              ? 'btn-dark text-white'
              : 'btn-light border border-hairline text-secondary'
          }`}
        >
          Shipping & Delivery
        </button>
        <button
          onClick={() => setActiveCategory('returns')}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium ${
            activeCategory === 'returns'
              ? 'btn-dark text-white'
              : 'btn-light border border-hairline text-secondary'
          }`}
        >
          Returns & Refunds
        </button>
        <button
          onClick={() => setActiveCategory('sizing')}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium ${
            activeCategory === 'sizing'
              ? 'btn-dark text-white'
              : 'btn-light border border-hairline text-secondary'
          }`}
        >
          Sizing & Materials
        </button>
        <button
          onClick={() => setActiveCategory('payment')}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium ${
            activeCategory === 'payment'
              ? 'btn-dark text-white'
              : 'btn-light border border-hairline text-secondary'
          }`}
        >
          Payments & COD
        </button>
      </div>

      {/* Accordion Questions List */}
      <div className="max-w-3xl mx-auto mb-5">
        {filteredFaqs.length === 0 ? (
          <div className="card border border-hairline rounded-4 p-5 text-center bg-white shadow-2xs">
            <HelpCircle size={36} className="mx-auto text-muted mb-2" />
            <h6 className="fw-bold text-dark mb-1">No matching questions found</h6>
            <p className="text-muted small mb-3">
              We couldn't find an answer matching "{searchQuery}". You can submit a direct inquiry to
              our concierge.
            </p>
            <div>
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-outline-dark rounded-pill px-3 py-1.5 btn-sm"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2.5">
            {filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="card border border-hairline rounded-3 bg-white shadow-2xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="btn text-start p-3.5 d-flex align-items-center justify-content-between w-100 bg-white"
                  >
                    <span className="fw-semibold text-dark small pe-3">{faq.question}</span>
                    <span className="text-muted flex-shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-0 text-secondary small border-top pt-3 leading-relaxed bg-light bg-opacity-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Concierge Help Banner */}
      <div className="max-w-3xl mx-auto card border border-hairline rounded-4 p-4 bg-light text-center">
        <h5 className="fw-bold text-dark mb-1">Still require assistance?</h5>
        <p className="text-secondary small mb-3">
          Our client concierge is on standby to assist with custom styling, orders, and inquiries.
        </p>
        <div>
          <button
            onClick={onNavigateToContact}
            className="btn btn-dark rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 fw-medium btn-sm"
          >
            <MessageSquare size={16} /> Contact Studio Concierge <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
