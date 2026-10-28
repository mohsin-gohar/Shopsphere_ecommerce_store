import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import {
  Product,
  Category,
  CartItem,
  FilterState,
  ToastMessage,
  Order,
  PageType,
  AuthUser,
} from './types/ecommerce';
import { fetchProducts, fetchCategories } from './services/api';
import { INITIAL_SAMPLE_ORDERS } from './services/mockData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { CartOffcanvas } from './components/CartOffcanvas';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
import { AssignmentInfoModal } from './components/AssignmentInfoModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

// Store Pages (lazy-loaded for production performance)
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const TrackingPage = lazy(() => import('./pages/TrackingPage').then((m) => ({ default: m.TrackingPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const PoliciesPage = lazy(() => import('./pages/PoliciesPage').then((m) => ({ default: m.PoliciesPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const CustomerPortalPage = lazy(() => import('./pages/CustomerPortalPage').then((m) => ({ default: m.CustomerPortalPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));

const CART_STORAGE_KEY = 'shopsphere_cart_v2';
const WISHLIST_STORAGE_KEY = 'shopsphere_wishlist_v2';
const ORDERS_STORAGE_KEY = 'shopsphere_orders_v2';
const AUTH_USER_KEY = 'shopsphere_auth_user_v1';

export default function App() {
  // Navigation active page
  const [activePage, setActivePage] = useState<PageType>('shop');

  // Products and categories state from REST API
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'fallback'>('api');

  // Filter state for Shop
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    sortBy: 'featured',
    maxPrice: 3000,
    minRating: 0,
    badge: 'All',
  });

  // Shopping cart state (with localStorage persistence)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter(
            (item) =>
              item &&
              typeof item === 'object' &&
              item.product &&
              typeof item.product.id === 'number' &&
              typeof item.quantity === 'number' &&
              item.quantity > 0
          )
        : [];
    } catch {
      return [];
    }
  });

  // Wishlist state (persisted in localStorage)
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : [];
    } catch {
      return [];
    }
  });

  // Orders history (persisted in localStorage for tracking)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!saved) return INITIAL_SAMPLE_ORDERS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return INITIAL_SAMPLE_ORDERS;
      const validOrders = parsed.filter(
        (order) =>
          order &&
          typeof order === 'object' &&
          typeof order.id === 'string' &&
          order.customer &&
          typeof order.customer.email === 'string' &&
          Array.isArray(order.items) &&
          typeof order.total === 'number'
      );
      return validOrders.length > 0 ? validOrders : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  // Unified RBAC Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const isValid =
        parsed &&
        typeof parsed === 'object' &&
        typeof parsed.id === 'string' &&
        typeof parsed.email === 'string' &&
        (parsed.role === 'admin' || parsed.role === 'customer');
      return isValid ? parsed : null;
    } catch {
      return null;
    }
  });

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('shopsphere_recently_viewed_v1');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAssignmentInfoOpen, setIsAssignmentInfoOpen] = useState<boolean>(false);

  // Promo code & Toasts
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('shopsphere_applied_coupon_v1');
      return saved ? saved : null;
    } catch {
      return null;
    }
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  const addToast = useCallback(
    (title: string, message: string, type: ToastMessage['type'] = 'success') => {
      const newToast: ToastMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        message,
        type,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial API data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setDataSource(productsRes.source === 'api' ? 'api' : 'fallback');
    } catch (err: unknown) {
      console.warn('API call issue, falling back to local dataset:', err);
      setError('Unable to fetch live API data. Showing curated collection fallback.');
      setDataSource('fallback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Scroll progress & back-to-top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0);
      setShowBackToTop(scrollTop > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  // Persist applied coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('shopsphere_applied_coupon_v1', appliedCoupon);
      } else {
        localStorage.removeItem('shopsphere_applied_coupon_v1');
      }
    } catch (err) {
      console.error('Failed to persist coupon:', err);
    }
  }, [appliedCoupon]);
  // Persist recently viewed
  useEffect(() => {
    try {
      localStorage.setItem('shopsphere_recently_viewed_v1', JSON.stringify(recentlyViewed));
    } catch (err) {
      console.error('Failed to persist recently viewed:', err);
    }
  }, [recentlyViewed]);

  // Record recently viewed product
  useEffect(() => {
    if (!selectedProduct) return;
    setRecentlyViewed((prev) => {
      const next = [selectedProduct.id, ...prev.filter((id) => id !== selectedProduct.id)];
      return next.slice(0, 8);
    });
  }, [selectedProduct]);
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to save wishlist to localStorage:', err);
    }
  }, [wishlist]);

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.error('Failed to save orders to localStorage:', err);
    }
  }, [orders]);

  // Persist auth user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (err) {
      console.error('Failed to persist auth user:', err);
    }
  }, [currentUser]);

  // Navigation handler
  const handleNavigate = (page: PageType) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter actions
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      sortBy: 'featured',
      maxPrice: 3000,
      minRating: 0,
      badge: 'All',
    });
  };

  const handleSelectCategory = (catName?: string) => {
    const selected = catName || 'All';
    setFilters((prev) => ({
      ...prev,
      category: selected,
      search: '',
    }));
    if (activePage !== 'shop') {
      setActivePage('shop');
    }
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      const nextQuantity = existing.quantity + quantity;
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: nextQuantity } : item
        )
      );
      addToast('Cart Updated', `Increased quantity of ${product.name} to ${nextQuantity}.`, 'success');
    } else {
      setCart((prev) => [...prev, { product, quantity }]);
      addToast('Added to Bag', `${product.name} added to your shopping bag.`, 'success');
    }
  };

  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      addToast('Removed', `${item.product.name} removed from your bag.`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
    addToast('Cart Cleared', 'All items removed from shopping bag.', 'info');
  };

  // Buy Now direct flow
  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.includes(product.id);
    setWishlist((prev) =>
      exists ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
    if (exists) {
      addToast('Wishlist', `${product.name} removed.`, 'info');
    } else {
      addToast('Saved', `${product.name} added to your wishlist.`, 'success');
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((id) => id !== product.id));
    addToast('Removed', `${product.name} removed from saved wishlist.`, 'info');
  };

  // Coupon application
  const handleApplyCoupon = (code: string): { success: boolean; message: string } => {
    const validCodes: Record<string, string> = {
      STUDENT20: '20% Student Privilege Applied!',
      WELCOME10: '10% Welcome Discount Applied!',
      SAVE15: '$15 Studio Voucher Applied!',
    };

    if (validCodes[code]) {
      setAppliedCoupon(code);
      return { success: true, message: validCodes[code] };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon Removed', 'Promotional discount removed.', 'info');
  };

  // Checkout order placement
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    addToast(
      'Order Confirmed!',
      `Order ${newOrder.id} confirmed. Tracking number: ${newOrder.trackingNumber}`,
      'success'
    );
  };

  // Executive Dashboard CRUD Handlers
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Unified RBAC Auth Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    addToast(
      'Welcome Back',
      `Signed in as ${user.name} (${user.role === 'admin' ? 'Master Admin' : 'VIP Customer'}).`,
      'success'
    );

    // Route to designated dashboard
    if (user.role === 'admin') {
      setActivePage('dashboard');
    } else {
      setActivePage('customer-portal');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addToast('Signed Out', 'You have been safely signed out.', 'info');
    setActivePage('shop');
  };

  const handleUpdateUser = (updatedUser: AuthUser) => {
    const previousEmail = currentUser?.email;
    if (previousEmail && previousEmail !== updatedUser.email) {
      setOrders((prev) =>
        prev.map((order) =>
          order.customer.email === previousEmail
            ? {
                ...order,
                customer: {
                  ...order.customer,
                  fullName: updatedUser.name,
                  email: updatedUser.email,
                  phone: updatedUser.phone,
                  address: updatedUser.address,
                  city: updatedUser.city,
                  postalCode: updatedUser.postalCode,
                },
              }
            : order
        )
      );
    }
    setCurrentUser(updatedUser);
    addToast('Profile Saved', 'Your address & account preferences have been updated.', 'success');
  };

  // Derived counts
  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const categoryProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
    );
  }, [products, selectedProduct]);

  return (
    <ErrorBoundary>
      <Suspense
      fallback={
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="spinner-border text-dark" role="status" aria-label="Loading" />
        </div>
      }
    >
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#fcfcfd' }}>
      {/* Scroll progress */}
      <div className="position-fixed top-0 start-0 w-100" style={{ height: '3px', zIndex: 1090, pointerEvents: 'none' }}>
        <div
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #6366f1, #ec4899)',
            transition: 'width 0.1s linear',
          }}
        />
      </div>
      {/* 3-Zone Clean Top Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        searchQuery={filters.search}
        onSearchChange={(query) => {
          if (activePage !== 'shop') {
            setActivePage('shop');
          }
          handleFilterChange({ search: query });
        }}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAssignmentInfo={() => setIsAssignmentInfoOpen(true)}
        products={products}
      />

      {/* Main Page Content Body */}
      <main className="container flex-grow-1 py-3 py-md-4">
        {/* VIEW 1: SHOP / CATALOG */}
        {activePage === 'shop' && (
          <>
            <HeroBanner onExplore={handleSelectCategory} />
            <CategoryBar
              categories={categories}
              activeCategory={filters.category}
              onSelectCategory={handleSelectCategory}
              productCounts={categoryProductCounts}
              totalProductsCount={products.length}
            />
            <ProductGrid
              products={products}
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              loading={loading}
              error={error}
              onRetry={loadData}
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setSelectedProduct(prod)}
              wishlistIds={wishlist}
              onToggleWishlist={handleToggleWishlist}
              dataSource={dataSource}
            />

            {recentlyViewed.length > 0 && (
              <section className="mt-5">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="font-extrabold text-slate-900 mb-0">Recently Viewed</h5>
                  <button
                    type="button"
                    className="btn btn-link text-slate-500 text-xs p-0"
                    onClick={() => setRecentlyViewed([])}
                  >
                    Clear
                  </button>
                </div>
                <div className="row g-3">
                  {recentlyViewed
                    .map((id) => products.find((p) => p.id === id))
                    .filter(Boolean)
                    .map((product) => (
                      <ProductCard
                        key={product!.id}
                        product={product!}
                        onAddToCart={handleAddToCart}
                        onQuickView={(prod) => setSelectedProduct(prod)}
                        isWishlisted={wishlist.includes(product!.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* VIEW 2: ABOUT US */}
        {activePage === 'about' && (
          <AboutPage onExploreShop={() => handleNavigate('shop')} />
        )}

        {/* VIEW 3: CONTACT US */}
        {activePage === 'contact' && (
          <ContactPage
            onNavigateToTracking={() => handleNavigate('tracking')}
            onNavigateToFaq={() => handleNavigate('faq')}
            onShowToast={addToast}
          />
        )}

        {/* VIEW 4: ORDER TRACKING */}
        {activePage === 'tracking' && (
          <TrackingPage
            orders={orders}
            onExploreShop={() => handleNavigate('shop')}
            initialOrderId={trackingOrderId}
          />
        )}

        {/* VIEW 5: FAQ & KNOWLEDGE BASE */}
        {activePage === 'faq' && (
          <FaqPage onNavigateToContact={() => handleNavigate('contact')} />
        )}

        {/* VIEW 6: POLICIES & TERMS */}
        {activePage === 'policies' && <PoliciesPage />}

        {/* VIEW 7: UNIFIED AUTH PAGE */}
        {activePage === 'auth' && (
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => handleNavigate('shop')}
            defaultRole="customer"
          />
        )}

        {/* VIEW 8: CUSTOMER PORTAL */}
        {activePage === 'customer-portal' && (
          !currentUser ? (
            <AuthPage
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => handleNavigate('shop')}
              defaultRole="customer"
            />
          ) : (
            <CustomerPortalPage
              user={currentUser}
              orders={orders}
              wishlistProducts={wishlistProducts}
              onAddToCart={handleAddToCart}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              onNavigateToTracking={(orderId) => {
                setTrackingOrderId(orderId);
                handleNavigate('tracking');
              }}
              onNavigateToShop={() => handleNavigate('shop')}
              onSwitchToAdmin={() => handleNavigate('dashboard')}
              onLogout={handleLogout}
              onShowToast={addToast}
              onUpdateUser={handleUpdateUser}
            />
          )
        )}

        {/* VIEW 9: EXECUTIVE ADMIN ERP & CRM CONSOLE */}
        {activePage === 'dashboard' && (
          !currentUser || currentUser.role !== 'admin' ? (
            <AuthPage
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => handleNavigate('shop')}
              defaultRole="admin"
            />
          ) : (
            <DashboardPage
              products={products}
              orders={orders}
              currentUser={currentUser}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateOrder={handleUpdateOrder}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onNavigateToShop={() => handleNavigate('shop')}
              onSwitchToCustomerPortal={() => handleNavigate('customer-portal')}
              onNavigateToAuth={() => handleNavigate('auth')}
              onLogout={handleLogout}
              onShowToast={addToast}
            />
          )
        )}
      </main>

      {/* Product Details Modal / PDP */}
      {selectedProduct && (
        <ProductDetailView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          relatedProducts={relatedProducts}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
        />
      )}

      {/* Slide-out Shopping Cart Offcanvas */}
      <CartOffcanvas
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* Checkout and Printable Receipt Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderComplete={handlePlaceOrder}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        currentUser={currentUser}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onQuickView={(prod) => setSelectedProduct(prod)}
      />

      {/* Assignment Evaluation Specs Modal */}
      <AssignmentInfoModal
        isOpen={isAssignmentInfoOpen}
        onClose={() => setIsAssignmentInfoOpen(false)}
        apiConnected={dataSource === 'api'}
      />

      {/* Back to top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn btn-dark rounded-circle position-fixed shadow-lg"
          style={{ bottom: '24px', right: '24px', width: '44px', height: '44px', zIndex: 1060 }}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* Real-time Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Global Clean Studio Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
        onOpenAssignmentInfo={() => setIsAssignmentInfoOpen(true)}
      />
    </div>
    </Suspense>
    </ErrorBoundary>
  );
}
