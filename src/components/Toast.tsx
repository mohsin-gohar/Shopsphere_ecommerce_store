import React, { useEffect } from 'react';
import { ToastMessage } from '../types/ecommerce';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-container-custom d-flex flex-column gap-2" style={{ maxWidth: '380px' }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="text-success flex-shrink-0" size={20} />;
      case 'danger':
        return <AlertCircle className="text-danger flex-shrink-0" size={20} />;
      case 'warning':
        return <AlertCircle className="text-warning flex-shrink-0" size={20} />;
      default:
        return <Info className="text-primary flex-shrink-0" size={20} />;
    }
  };

  const getBorderClass = () => {
    switch (toast.type) {
      case 'success':
        return 'border-start border-4 border-success';
      case 'danger':
        return 'border-start border-4 border-danger';
      case 'warning':
        return 'border-start border-4 border-warning';
      default:
        return 'border-start border-4 border-primary';
    }
  };

  return (
    <div
      className={`card shadow-lg border-0 ${getBorderClass()} bg-white p-3 d-flex flex-row align-items-center justify-content-between rounded-3`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex align-items-center gap-3">
        {getIcon()}
        <div>
          <div className="fw-semibold text-dark small">{toast.title}</div>
          <div className="text-muted" style={{ fontSize: '0.825rem' }}>{toast.message}</div>
        </div>
      </div>
      <button
        type="button"
        className="btn-close ms-2"
        style={{ fontSize: '0.75rem' }}
        onClick={() => onDismiss(toast.id)}
        aria-label="Close"
      ></button>
    </div>
  );
};
