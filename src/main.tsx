import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
// Global resilience: replace any broken image with a neutral fallback.
document.addEventListener(
  'error',
  (event) => {
    const target = event.target as HTMLImageElement | null;
    if (target && target.tagName === 'IMG' && target.src && target.src !== FALLBACK_IMAGE) {
      target.src = FALLBACK_IMAGE;
    }
  },
  true
);

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
