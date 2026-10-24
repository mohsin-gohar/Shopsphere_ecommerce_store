import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types/ecommerce';
import {
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onCancel: () => void;
  defaultRole?: UserRole;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onCancel,
  defaultRole,
}) => {
  // Mode: Sign In vs Create Account
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Sign In State
  const isAdminDefault = defaultRole === 'admin';
  const [email, setEmail] = useState(isAdminDefault ? 'admin@shopsphere.studio' : 'mohsingohar759@gmail.com');
  const [password, setPassword] = useState(isAdminDefault ? 'admin123' : 'customer123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [joinVip, setJoinVip] = useState(true);

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // 1-Click Fast Fill for Demonstration
  const handleQuickFill = (type: 'customer' | 'staff') => {
    setAuthMode('signin');
    setError(null);
    if (type === 'staff') {
      setEmail('admin@shopsphere.studio');
      setPassword('admin123');
    } else {
      setEmail('mohsingohar759@gmail.com');
      setPassword('customer123');
    }
  };

  // Sign In Handler with Intelligent Hidden Admin Routing
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Secret Admin Credentials Detection
      const isAdminAccount =
        cleanEmail === 'admin@shopsphere.studio' ||
        cleanEmail === 'admin@shopsphere.com' ||
        cleanEmail === 'admin' ||
        (cleanEmail.startsWith('admin') && ['admin123', 'admin', 'shopsphere2026', '123456'].includes(cleanPassword)) ||
        (cleanPassword === 'admin123' && cleanEmail.includes('admin')) ||
        (cleanPassword === 'shopsphere2026');

      if (isAdminAccount) {
        // Authenticated as Administrator -> Routes seamlessly to ERP Console
        const adminUser: AuthUser = {
          id: 'USR-ADMIN-01',
          name: 'Chief Atelier Director',
          email: cleanEmail.includes('@') ? cleanEmail : 'admin@shopsphere.studio',
          role: 'admin',
          membershipTier: 'Atelier Platinum',
          loyaltyPoints: 9500,
          walletBalance: 250.0,
          phone: '+92 300 9998877',
          address: 'Executive Atelier, Sector F-7/2',
          city: 'Islamabad',
          postalCode: '44000',
          joinedDate: 'Jan 2025',
        };
        onLoginSuccess(adminUser);
      } else {
        // Customer Authentication -> Routes seamlessly to Customer VIP Portal
        const registeredUsersStr = localStorage.getItem('shopsphere_registered_users');
        let registeredList: Array<{ name: string; email: string; phone?: string }> = [];
        try {
          const parsed = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
          if (Array.isArray(parsed)) {
            registeredList = parsed.filter(
              (u) =>
                u &&
                typeof u === 'object' &&
                typeof u.email === 'string' &&
                typeof u.name === 'string'
            );
          }
        } catch {}

        const matchedCustomer = registeredList.find(
          (u) => u.email.toLowerCase() === cleanEmail
        );

        const customerUser: AuthUser = {
          id: matchedCustomer
            ? `USR-CUST-${Math.abs(cleanEmail.split('').reduce((a, b) => a + b.charCodeAt(0), 1000))}`
            : 'USR-CUST-8491',
          name: matchedCustomer
            ? matchedCustomer.name
            : cleanEmail === 'mohsingohar759@gmail.com'
            ? 'Mohsin Gohar'
            : cleanEmail.split('@')[0].replace(/[._]/g, ' ') || 'Valued Customer',
          email: cleanEmail,
          role: 'customer',
          membershipTier: matchedCustomer ? 'Silver Collector' : 'Gold VIP',
          loyaltyPoints: matchedCustomer ? 500 : 1450,
          walletBalance: matchedCustomer ? 25.0 : 45.0,
          phone: matchedCustomer?.phone || '+92 300 1234567',
          address: 'House 14, Street 4, Sector G-11/3',
          city: 'Islamabad',
          postalCode: '44000',
          joinedDate: 'Oct 2026',
        };

        onLoginSuccess(customerUser);
      }
      setLoading(false);
    }, 500);
  };

  // Register New Customer Account Handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    if (!regName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Save new user profile locally
      const registeredUsersStr = localStorage.getItem('shopsphere_registered_users');
      let registeredList: Array<{ name: string; email: string; phone?: string }> = [];
      try {
        const parsed = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
        if (Array.isArray(parsed)) {
          registeredList = parsed.filter(
            (u) =>
              u &&
              typeof u === 'object' &&
              typeof u.email === 'string' &&
              typeof u.name === 'string'
          );
        }
      } catch {}

      const cleanRegEmail = regEmail.trim().toLowerCase();
      const existing = registeredList.find((u) => u.email.toLowerCase() === cleanRegEmail);
      if (!existing) {
        registeredList.push({
          name: regName.trim(),
          email: cleanRegEmail,
          phone: regPhone.trim() || '+92 300 0000000',
        });
        try {
          localStorage.setItem('shopsphere_registered_users', JSON.stringify(registeredList));
        } catch {}
      }

      // Check if registration email was secretly admin
      const isSecretAdmin =
        cleanRegEmail === 'admin@shopsphere.studio' ||
        cleanRegEmail === 'admin@shopsphere.com' ||
        regPassword === 'admin123';

      const newAuthUser: AuthUser = {
        id: isSecretAdmin ? 'USR-ADMIN-01' : `USR-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: regName.trim(),
        email: cleanRegEmail,
        role: isSecretAdmin ? 'admin' : 'customer',
        membershipTier: isSecretAdmin ? 'Atelier Platinum' : 'Silver Collector',
        loyaltyPoints: isSecretAdmin ? 9500 : (joinVip ? 500 : 100),
        walletBalance: isSecretAdmin ? 250.0 : 25.0,
        phone: regPhone.trim() || '+92 300 1234567',
        address: 'Sector F-7/2',
        city: 'Islamabad',
        postalCode: '44000',
        joinedDate: 'Oct 2026',
      };

      setLoading(false);
      onLoginSuccess(newAuthUser);
    }, 600);
  };

  return (
    <div className="py-5 d-flex align-items-center justify-content-center min-vh-75">
      <div className="w-100" style={{ maxWidth: '480px' }}>
        <div className="card border border-hairline rounded-4 p-4 p-md-5 bg-white shadow-lg">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-2xs"
              style={{ width: '52px', height: '52px' }}
            >
              <User size={24} />
            </div>
            <h3 className="fw-extrabold text-dark tracking-tight mb-1">
              {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-secondary small mb-0">
              {authMode === 'signin'
                ? 'Sign in to access your orders, wishlist, and member privileges.'
                : 'Join ShopSphere VIP for express delivery, order tracking, and rewards.'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign In / Create Account) */}
          <div className="d-flex p-1 bg-light rounded-pill border border-hairline mb-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setError(null);
              }}
              className={`btn flex-grow-1 rounded-pill py-2 text-xs fw-semibold transition-all ${
                authMode === 'signin'
                  ? 'btn-dark text-white shadow-2xs'
                  : 'btn-light border-0 text-secondary'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError(null);
              }}
              className={`btn flex-grow-1 rounded-pill py-2 text-xs fw-semibold transition-all ${
                authMode === 'register'
                  ? 'btn-dark text-white shadow-2xs'
                  : 'btn-light border-0 text-secondary'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successNotice && (
            <div className="alert alert-success py-2 px-3 rounded-3 small mb-3">
              {successNotice}
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn}>
              <div className="mb-3">
                <label className="form-label small fw-medium text-dark mb-1">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-hairline border-end-0 text-muted">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    required
                    className="form-control bg-light border-hairline border-start-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-medium text-dark mb-0">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="btn btn-link p-0 text-decoration-none small text-muted hover:text-dark"
                    style={{ fontSize: '0.74rem' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-hairline border-end-0 text-muted">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-control bg-light border-hairline border-start-0 border-end-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                  />
                  <button
                    type="button"
                    className="btn btn-light border-hairline border-start-0 text-muted"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label small text-secondary" htmlFor="rememberMe">
                    Keep me signed in
                  </label>
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-dark w-100 rounded-pill py-2.5 fw-medium d-flex align-items-center justify-content-center gap-2 shadow-2xs"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In to Account <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-link text-secondary text-decoration-none small py-1 hover:text-dark d-inline-flex align-items-center justify-content-center gap-1"
                >
                  <ArrowLeft size={14} /> Return to Storefront
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT (REGISTER) FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label small fw-medium text-dark mb-1">
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-hairline border-end-0 text-muted">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    className="form-control bg-light border-hairline border-start-0"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Mohsin Gohar"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-medium text-dark mb-1">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-hairline border-end-0 text-muted">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    required
                    className="form-control bg-light border-hairline border-start-0"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-medium text-dark mb-1">
                  Phone Number
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-hairline border-end-0 text-muted">
                    <Phone size={15} />
                  </span>
                  <input
                    type="tel"
                    className="form-control bg-light border-hairline border-start-0"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-medium text-dark mb-1">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-hairline border-end-0 text-muted">
                    <Lock size={15} />
                  </span>
                  <input
                    type={regShowPassword ? 'text' : 'password'}
                    required
                    minLength={4}
                    className="form-control bg-light border-hairline border-start-0 border-end-0"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    className="btn btn-light border-hairline border-start-0 text-muted"
                    onClick={() => setRegShowPassword(!regShowPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {regShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-medium text-dark mb-1">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-hairline border-end-0 text-muted">
                    <Lock size={15} />
                  </span>
                  <input
                    type={regShowPassword ? 'text' : 'password'}
                    required
                    className="form-control bg-light border-hairline border-start-0"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div className="card bg-light border border-hairline p-2.5 rounded-3 mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="joinVip"
                    checked={joinVip}
                    onChange={(e) => setJoinVip(e.target.checked)}
                  />
                  <label className="form-check-label small text-dark fw-medium" htmlFor="joinVip">
                    <Sparkles size={13} className="text-warning me-1 d-inline" />
                    Enroll in ShopSphere VIP Club (500 bonus points)
                  </label>
                </div>
                <div className="text-muted small ps-4 mt-0.5" style={{ fontSize: '0.72rem' }}>
                  Includes complimentary express shipping on orders over $75 & private preview access.
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-dark w-100 rounded-pill py-2.5 fw-medium d-flex align-items-center justify-content-center gap-2 shadow-2xs"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create VIP Account <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-link text-secondary text-decoration-none small py-1 hover:text-dark d-inline-flex align-items-center justify-content-center gap-1"
                >
                  <ArrowLeft size={14} /> Return to Storefront
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Fill Options */}
          <div className="pt-3 border-top border-hairline mt-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span
                className="text-muted small d-flex align-items-center gap-1"
                style={{ fontSize: '0.75rem' }}
              >
                <KeyRound size={13} className="text-secondary" /> 1-Click Fast Credentials:
              </span>
              <span className="text-muted small" style={{ fontSize: '0.70rem' }}>
                Instant test login
              </span>
            </div>
            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('customer')}
                className="btn btn-light btn-sm rounded-pill w-100 py-1.5 text-xs text-secondary border border-hairline hover:text-dark hover:bg-white text-start d-flex align-items-center justify-content-between px-3"
                title="Autofill Customer credentials"
              >
                <span>👤 VIP Customer (Mohsin Gohar)</span>
                <span className="badge bg-secondary text-white" style={{ fontSize: '0.65rem' }}>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('staff')}
                className="btn btn-light btn-sm rounded-pill w-100 py-1.5 text-xs text-secondary border border-hairline hover:text-dark hover:bg-white text-start d-flex align-items-center justify-content-between px-3"
                title="Autofill Admin credentials"
              >
                <span>🛡️ Master Admin (Chief Atelier Director)</span>
                <span className="badge bg-dark text-white" style={{ fontSize: '0.65rem' }}>Admin ERP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
            <div className="modal-content rounded-4 border-0 shadow-lg p-4 text-center">
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '48px', height: '48px' }}
              >
                <KeyRound size={22} className="text-dark" />
              </div>
              <h5 className="fw-bold mb-2">Password Recovery</h5>
              <p className="text-secondary small mb-4">
                Enter your registered email address and we'll transmit a secure reset token immediately.
              </p>
              <input
                type="email"
                defaultValue={email}
                className="form-control bg-light border-hairline mb-3"
                placeholder="Enter your email"
              />
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="btn btn-light rounded-pill flex-grow-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setSuccessNotice('Recovery instructions dispatched to your email.');
                  }}
                  className="btn btn-dark rounded-pill flex-grow-1"
                >
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
