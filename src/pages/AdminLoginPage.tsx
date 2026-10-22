import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('admin@shopsphere.studio');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Valid passwords accepted: 'admin123', 'admin', or '123456'
      const validPasswords = ['admin123', 'admin', '123456', 'shopsphere2026'];
      if (validPasswords.includes(password.trim())) {
        onLoginSuccess();
      } else {
        setError('Incorrect administrator password. Hint: Default demo password is admin123');
        setLoading(false);
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setUsername('admin@shopsphere.studio');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="py-5 d-flex align-items-center justify-content-center min-vh-75">
      <div className="w-100" style={{ maxWidth: '440px' }}>
        <div className="card border border-hairline rounded-4 p-4 p-md-5 bg-white shadow-lg">
          {/* Lock Badge Icon */}
          <div className="text-center mb-4">
            <div
              className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
              style={{ width: '56px', height: '56px' }}
            >
              <Lock size={26} />
            </div>
            <h3 className="fw-extrabold text-dark tracking-tight mb-1">Admin Portal</h3>
            <p className="text-secondary small mb-0">
              Enter authorized administrator credentials to manage orders, inventory, and sales KPIs.
            </p>
          </div>

          {/* Quick Demo Credentials Info Callout */}
          <div className="card bg-light border border-hairline p-3 rounded-3 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="small fw-bold text-dark d-flex align-items-center gap-1.5">
                <KeyRound size={14} className="text-primary" /> Demo Access Key
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn btn-dark btn-sm rounded-pill px-2.5 py-0.5 text-xs fw-medium d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.72rem' }}
              >
                <Sparkles size={11} /> 1-Click Auto Fill
              </button>
            </div>
            <div className="small text-muted font-monospace" style={{ fontSize: '0.78rem' }}>
              Username: <span className="text-dark">admin@shopsphere.studio</span>
              <br />
              Password: <span className="text-dark fw-bold">admin123</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3 d-flex align-items-center gap-2">
              <span className="fw-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-medium text-dark mb-1">Staff Username / Email</label>
              <input
                type="text"
                required
                className="form-control bg-light border-hairline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@shopsphere.studio"
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-medium text-dark mb-1">Admin Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-control bg-light border-hairline border-end-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
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

            <div className="d-flex flex-column gap-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark w-100 rounded-pill py-2.5 fw-medium d-flex align-items-center justify-content-center gap-2 shadow-2xs"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Authenticating Session...
                  </>
                ) : (
                  <>
                    Unlock Admin Dashboard <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="btn btn-link text-secondary text-decoration-none small py-1.5 hover:text-dark d-inline-flex align-items-center justify-content-center gap-1"
              >
                <ArrowLeft size={14} /> Return to Storefront
              </button>
            </div>
          </form>

          {/* Security Guarantee */}
          <div className="border-top border-hairline pt-3 mt-4 text-center">
            <span className="text-muted d-flex align-items-center justify-content-center gap-1.5" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={14} className="text-success" />
              256-Bit SSL Protected Administrative Environment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
