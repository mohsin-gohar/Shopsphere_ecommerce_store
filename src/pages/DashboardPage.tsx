import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, Order, AuthUser } from '../types/ecommerce';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  Layers,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Filter,
  Download,
  BarChart3,
  X,
  CreditCard,
  Eye,
  AlertCircle,
  LogOut,
  Users,
  ShieldAlert,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Printer,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  UserX,
  UserPlus,
} from 'lucide-react';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: 'admin' | 'customer';
  membershipTier: 'Bronze Member' | 'Silver Collector' | 'Gold VIP' | 'Atelier Platinum';
  status: 'Active' | 'Suspended';
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
}

interface DashboardPageProps {
  products: Product[];
  orders: Order[];
  currentUser: AuthUser | null;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateOrder?: (orderId: string, updates: Partial<Order>) => void;
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onNavigateToShop: () => void;
  onSwitchToCustomerPortal: () => void;
  onNavigateToAuth: () => void;
  onLogout?: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  products,
  orders,
  currentUser,
  onUpdateOrderStatus,
  onUpdateOrder,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onNavigateToShop,
  onSwitchToCustomerPortal,
  onNavigateToAuth,
  onLogout,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'users' | 'delivery' | 'analytics'>('orders');

  // Search and Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All');
  const [inventoryPage, setInventoryPage] = useState(1);
  const inventoryItemsPerPage = 15;
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // Modals
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [dispatchOrderModal, setDispatchOrderModal] = useState<Order | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Form: Dispatch / Logistics update
  const [dispatchForm, setDispatchForm] = useState({
    carrier: 'DHL Express',
    trackingNumber: '',
    estimatedDeliveryDate: '',
    status: 'In Transit' as Order['status'],
  });

  // Form: New Product
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Men',
    price: 89,
    oldPrice: 119,
    badge: 'New Season',
    short_desc: '',
    long_description: '',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85',
  });

  // Form: New User
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '+1 (555) 019-2831',
    city: 'New York',
    role: 'customer' as 'admin' | 'customer',
    membershipTier: 'Gold VIP' as ManagedUser['membershipTier'],
  });

  const USERS_STORAGE_KEY = 'shopsphere_managed_users_v1';

  const DEFAULT_MANAGED_USERS: ManagedUser[] = [
    {
      id: 'USR-001',
      name: 'Mohsin Gohar',
      email: 'mohsingohar759@gmail.com',
      phone: '+92 300 1234567',
      city: 'Lahore',
      role: 'admin',
      membershipTier: 'Atelier Platinum',
      status: 'Active',
      totalOrders: 4,
      totalSpent: 520.0,
      joinedDate: 'Oct 2026',
    },
    {
      id: 'USR-002',
      name: 'Alexander Wright',
      email: 'a.wright@studio-client.com',
      phone: '+1 (555) 234-8901',
      city: 'San Francisco',
      role: 'customer',
      membershipTier: 'Gold VIP',
      status: 'Active',
      totalOrders: 2,
      totalSpent: 285.5,
      joinedDate: 'Sep 2026',
    },
    {
      id: 'USR-003',
      name: 'Elena Rostova',
      email: 'elena.rostova@atelier.design',
      phone: '+1 (555) 349-8812',
      city: 'New York',
      role: 'customer',
      membershipTier: 'Atelier Platinum',
      status: 'Active',
      totalOrders: 6,
      totalSpent: 940.0,
      joinedDate: 'Aug 2026',
    },
    {
      id: 'USR-004',
      name: 'Marcus Vance',
      email: 'marcus.vance@studio.co',
      phone: '+44 20 7946 0912',
      city: 'London',
      role: 'customer',
      membershipTier: 'Silver Collector',
      status: 'Active',
      totalOrders: 1,
      totalSpent: 120.0,
      joinedDate: 'Oct 2026',
    },
  ];

  // Managed Users State (Live control for admin)
  const [usersList, setUsersList] = useState<ManagedUser[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (!saved) return DEFAULT_MANAGED_USERS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return DEFAULT_MANAGED_USERS;
      const valid = parsed.filter(
        (u) =>
          u &&
          typeof u === 'object' &&
          typeof u.id === 'string' &&
          typeof u.email === 'string' &&
          typeof u.name === 'string' &&
          typeof u.city === 'string' &&
          typeof u.role === 'string' &&
          typeof u.status === 'string' &&
          typeof u.membershipTier === 'string' &&
          typeof u.totalOrders === 'number' &&
          typeof u.totalSpent === 'number'
      );
      return valid.length > 0 ? valid : DEFAULT_MANAGED_USERS;
    } catch {
      return DEFAULT_MANAGED_USERS;
    }
  });

  // Track orders already reflected in managed user totals to avoid double counting
  const processedOrderIdsRef = useRef<Set<string>>(new Set(orders.map((order) => order.id)));

  // Synchronize only newly created checkout orders into usersList
  useEffect(() => {
    const newOrders = orders.filter((order) => !processedOrderIdsRef.current.has(order.id));
    if (newOrders.length === 0) return;

    newOrders.forEach((order) => processedOrderIdsRef.current.add(order.id));

    setUsersList((prev) => {
      let next = [...prev];
      newOrders.forEach((ord) => {
        const index = next.findIndex(
          (u) => u.email.toLowerCase() === ord.customer.email.toLowerCase()
        );
        if (index >= 0) {
          next[index] = {
            ...next[index],
            totalOrders: next[index].totalOrders + 1,
            totalSpent: next[index].totalSpent + ord.total,
          };
        } else {
          const newUser: ManagedUser = {
            id: `USR-${Math.floor(100 + Math.random() * 900)}`,
            name: ord.customer.fullName,
            email: ord.customer.email,
            phone: ord.customer.phone,
            city: ord.customer.city,
            role: 'customer',
            membershipTier: 'Silver Collector',
            status: 'Active',
            totalOrders: 1,
            totalSpent: ord.total,
            joinedDate: 'Today',
          };
          next = [newUser, ...next];
        }
      });
      return next;
    });
  }, [orders]);

  // Persist managed users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch (err) {
      console.error('Failed to save managed users:', err);
    }
  }, [usersList, USERS_STORAGE_KEY]);

  // Escape key listener for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedOrderDetails(null);
        setDispatchOrderModal(null);
        setIsAddProductOpen(false);
        setEditingProduct(null);
        setIsAddUserOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // KPIs
  const totalGrossRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalGrossRevenue / totalOrdersCount : 0;

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        (o?.id || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o?.customer?.fullName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o?.customer?.email || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o?.trackingNumber && o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o?.carrier && o.carrier.toLowerCase().includes(orderSearch.toLowerCase()));

      const matchesStatus =
        orderStatusFilter === 'All' || o?.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        (p?.name || '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
        (p?.category || '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
        ((p?.badge || '') && (p.badge || '').toLowerCase().includes(inventorySearch.toLowerCase()));

      const matchesCategory =
        inventoryCategoryFilter === 'All' || p?.category === inventoryCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, inventorySearch, inventoryCategoryFilter]);

  // Reset inventory page when filters change
  useEffect(() => {
    setInventoryPage(1);
  }, [inventorySearch, inventoryCategoryFilter]);

  const totalInventoryPages = Math.max(1, Math.ceil(filteredProducts.length / inventoryItemsPerPage));
  const paginatedInventoryProducts = useMemo(() => {
    const start = (inventoryPage - 1) * inventoryItemsPerPage;
    return filteredProducts.slice(start, start + inventoryItemsPerPage);
  }, [filteredProducts, inventoryPage, inventoryItemsPerPage]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesSearch =
        (u?.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
        (u?.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
        (u?.city || '').toLowerCase().includes(userSearch.toLowerCase());

      const matchesRole =
        userRoleFilter === 'All' || u?.role === userRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  // Real revenue analytics derived from orders
  const categoryRevenue = useMemo(() => {
    const revenue: Record<string, number> = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const category = item?.product?.category || 'Other';
        const amount = (typeof item?.product?.price === 'number' ? item.product.price : 0) * (typeof item?.quantity === 'number' ? item.quantity : 0);
        revenue[category] = (revenue[category] || 0) + amount;
      });
    });
    return revenue;
  }, [orders]);

  const totalCategoryRevenue = useMemo(
    () => Object.values(categoryRevenue).reduce((sum, value) => sum + value, 0),
    [categoryRevenue]
  );

  const handleExportOrders = () => {
    const rows = [
      ['Order ID', 'Customer', 'Email', 'Status', 'Items', 'Subtotal', 'Discount', 'Shipping', 'Total', 'Date'],
      ...filteredOrders.map((order) => [
        order.id,
        order.customer?.fullName || '',
        order.customer?.email || '',
        order.status,
        order.items.map((item) => `${item.product?.name || 'Item'} x${item.quantity}`).join('; '),
        Number.isFinite(order.subtotal) ? order.subtotal.toFixed(2) : '0.00',
        Number.isFinite(order.discount) ? order.discount.toFixed(2) : '0.00',
        Number.isFinite(order.shipping) ? order.shipping.toFixed(2) : '0.00',
        Number.isFinite(order.total) ? order.total.toFixed(2) : '0.00',
        order.date,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shopsphere-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Export Complete', `${filteredOrders.length} orders exported to CSV.`, 'success');
  };

  const handleExportUsers = () => {
    const rows = [
      ['User ID', 'Name', 'Email', 'Phone', 'City', 'Role', 'Membership Tier', 'Status', 'Total Orders', 'Total Spent', 'Joined'],
      ...filteredUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.city,
        user.role,
        user.membershipTier,
        user.status,
        user.totalOrders,
        Number.isFinite(user.totalSpent) ? user.totalSpent.toFixed(2) : '0.00',
        user.joinedDate,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shopsphere-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Export Complete', `${filteredUsers.length} users exported to CSV.`, 'success');
  };

  // Product Operations
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim() || !newProductForm.short_desc.trim()) {
      onShowToast('Validation', 'Please provide a title and short description.', 'warning');
      return;
    }

    const created: Product = {
      id: Math.max(100, ...products.map((p) => p.id)) + 1,
      name: newProductForm.name,
      category: newProductForm.category,
      price: Number(newProductForm.price),
      oldPrice: newProductForm.oldPrice ? Number(newProductForm.oldPrice) : undefined,
      rating: 5.0,
      reviews: 1,
      badge: newProductForm.badge,
      short_desc: newProductForm.short_desc,
      long_description:
        newProductForm.long_description ||
        `${newProductForm.short_desc} Designed and tailored with certified craftsmanship.`,
      image: newProductForm.image,
    };

    onAddProduct(created);
    setIsAddProductOpen(false);
    setNewProductForm({
      name: '',
      category: 'Men',
      price: 89,
      oldPrice: 119,
      badge: 'New Season',
      short_desc: '',
      long_description: '',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85',
    });
    onShowToast('Product Created', `${created.name} added to inventory.`, 'success');
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onEditProduct(editingProduct);
    onShowToast('Product Updated', `${editingProduct.name} saved successfully.`, 'success');
    setEditingProduct(null);
  };

  // User Operations
  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          onShowToast('User Updated', `${u.name} status set to ${newStatus}.`, 'info');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleChangeUserRole = (userId: string, newRole: 'admin' | 'customer') => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          onShowToast('Role Updated', `${u.name} promoted to ${newRole.toUpperCase()}.`, 'success');
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    const user = usersList.find((u) => u.id === userId);
    if (user?.email === currentUser?.email) {
      onShowToast('Action Denied', 'Cannot delete the currently logged in Master Admin account.', 'danger');
      return;
    }
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    onShowToast('User Removed', `Account ${user?.name} has been deleted.`, 'warning');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      onShowToast('Validation', 'Please provide a name and valid email.', 'warning');
      return;
    }

    const created: ManagedUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone,
      city: newUserForm.city,
      role: newUserForm.role,
      membershipTier: newUserForm.membershipTier,
      status: 'Active',
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: 'Just now',
    };

    setUsersList((prev) => [created, ...prev]);
    setIsAddUserOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '+1 (555) 019-2831',
      city: 'New York',
      role: 'customer',
      membershipTier: 'Gold VIP',
    });
    onShowToast('User Created', `Account for ${created.name} registered.`, 'success');
  };

  // Dispatch Logistics Modal Submit
  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchOrderModal) return;

    if (onUpdateOrder) {
      onUpdateOrder(dispatchOrderModal.id, {
        carrier: dispatchForm.carrier,
        trackingNumber: dispatchForm.trackingNumber || `TRK-${Math.floor(10000 + Math.random() * 90000)}-US`,
        estimatedDeliveryDate: dispatchForm.estimatedDeliveryDate || '3 Business Days',
        status: dispatchForm.status,
      });
    } else {
      onUpdateOrderStatus(dispatchOrderModal.id, dispatchForm.status);
    }

    onShowToast(
      'Logistics Dispatched',
      `Order ${dispatchOrderModal.id} marked as ${dispatchForm.status} via ${dispatchForm.carrier}.`,
      'success'
    );
    setDispatchOrderModal(null);
  };

  // Status Badge Class
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

  // Restrict Non-Admin Access
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-5 text-center">
        <div className="card max-w-lg mx-auto p-5 border-0 shadow-sm rounded-4 bg-white">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldAlert size={32} />
          </div>
          <h4 className="font-extrabold text-slate-900 mb-2">Restricted Access (403)</h4>
          <p className="text-slate-500 text-sm mb-5">
            This Executive Commerce Control Center is reserved for verified Studio Administrators.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={onNavigateToAuth} className="btn btn-dark rounded-pill px-4 btn-sm">
              Sign In as Admin
            </button>
            <button onClick={onNavigateToShop} className="btn btn-outline-secondary rounded-pill px-4 btn-sm">
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Executive Command Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-slate-950 text-white text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <ShieldCheck size={13} /> Master Admin
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                ShopSphere Operations ERP &amp; Logistics Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Storefront Executive Management
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="btn btn-dark btn-sm rounded-pill px-3.5 py-2 font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} /> Add Product
            </button>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="btn btn-outline-dark btn-sm rounded-pill px-3.5 py-2 font-semibold flex items-center gap-1.5"
            >
              <UserPlus size={15} /> Add User
            </button>
            <button
              onClick={onSwitchToCustomerPortal}
              className="btn btn-light border border-slate-200 btn-sm rounded-pill px-3 py-2 font-semibold flex items-center gap-1.5 text-slate-700 hover:bg-slate-100"
            >
              <User size={15} /> Customer View
            </button>
            <button
              onClick={onNavigateToShop}
              className="btn btn-light border border-slate-200 btn-sm rounded-pill px-3 py-2 font-semibold flex items-center gap-1.5 text-slate-700 hover:bg-slate-100"
            >
              <ExternalLink size={15} /> Storefront
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 font-semibold flex items-center gap-1.5"
                title="Lock Console"
              >
                <LogOut size={14} /> Exit
              </button>
            )}
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
              <DollarSign size={16} className="text-slate-800" />
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              ${totalGrossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp size={12} /> +18.4% this month
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag size={16} className="text-slate-800" />
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {totalOrdersCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {orders.length} active live session orders
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Catalog SKUs</span>
              <Package size={16} className="text-slate-800" />
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {products.length} Products
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-0.5 block">
              100% In-Stock &amp; Operational
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <Users size={16} className="text-slate-800" />
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {usersList.length} Accounts
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Active CRM &amp; Staff Roles
            </span>
          </div>
        </div>
      </div>

      {/* Modern Dashboard Segmented Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-t-2xl border-t border-x transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-white border-slate-200 text-slate-950 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <ShoppingBag size={15} /> Orders &amp; Fulfillment ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-t-2xl border-t border-x transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-white border-slate-200 text-slate-950 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Layers size={15} /> Products &amp; Inventory ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-t-2xl border-t border-x transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-white border-slate-200 text-slate-950 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Users size={15} /> User Management ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-t-2xl border-t border-x transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'delivery'
              ? 'bg-white border-slate-200 text-slate-950 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Truck size={15} /> Logistics &amp; Carriers
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-t-2xl border-t border-x transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-white border-slate-200 text-slate-950 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <BarChart3 size={15} /> Analytics
        </button>
      </div>

      {/* TAB 1: ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          {/* Search & Status Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 overflow-x-auto">
              {['All', 'Confirmed', 'Processing in Studio', 'Dispatched', 'In Transit', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`btn btn-sm rounded-pill px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'btn-dark text-white'
                      : 'btn-light border border-slate-200 text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative min-w-[260px]">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                placeholder="Search by ID, customer, carrier..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
              {orderSearch && (
                <button
                  onClick={() => setOrderSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={handleExportOrders}
              className="btn btn-sm btn-outline-dark rounded-pill px-3 py-1 text-xs font-semibold flex items-center gap-1"
              title="Export filtered orders to CSV"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={40} className="mx-auto text-slate-300 mb-2" />
              <h5 className="font-bold text-slate-900">No Orders Match Filter</h5>
              <p className="text-slate-500 text-xs">Try clearing search or placing a demo order.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-xs">
                <thead className="table-light text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th>Order Reference</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Carrier / Tracking</th>
                    <th>Delivery Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <strong className="text-slate-900 font-mono d-block">{ord.id}</strong>
                        <span className="text-slate-400 text-2xs">{ord.date}</span>
                      </td>
                      <td>
                        <div className="font-bold text-slate-900">{ord.customer.fullName}</div>
                        <div className="text-slate-500 text-2xs">{ord.customer.email}</div>
                        <div className="text-slate-400 text-2xs">{ord.customer.city}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {ord.items.slice(0, 2).map((item, i) => (
                            <img
                              key={i}
                              src={item.product.image}
                              alt=""
                              className="w-7 h-7 rounded-md object-cover border"
                            loading="lazy"
                               decoding="async"
                             />
                          ))}
                          <span className="text-slate-600 font-semibold text-2xs">
                            {ord.items.reduce((s, it) => s + it.quantity, 0)} pcs
                          </span>
                        </div>
                      </td>
                      <td>
                        <strong className="text-slate-900 font-bold">${ord.total.toFixed(2)}</strong>
                        <span className="text-slate-400 text-2xs d-block uppercase font-semibold">
                          {ord.customer.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-800">{ord.carrier || 'DHL Express'}</div>
                        <span className="text-slate-500 font-mono text-2xs">{ord.trackingNumber}</span>
                      </td>
                      <td>
                        {/* Interactive Status Changer */}
                        <select
                          className={`form-select form-select-sm py-1 px-2 text-xs font-semibold rounded-pill border-0 shadow-2xs ${getStatusBadge(
                            ord.status
                          )}`}
                          value={ord.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as Order['status'];
                            onUpdateOrderStatus(ord.id, newStatus);
                            onShowToast('Status Changed', `Order ${ord.id} set to ${newStatus}.`, 'success');
                          }}
                          style={{ maxWidth: '160px' }}
                        >
                          <option value="Confirmed" className="bg-white text-dark">Confirmed</option>
                          <option value="Processing in Studio" className="bg-white text-dark">Processing in Studio</option>
                          <option value="Dispatched" className="bg-white text-dark">Dispatched</option>
                          <option value="In Transit" className="bg-white text-dark">In Transit</option>
                          <option value="Delivered" className="bg-white text-dark">Delivered</option>
                        </select>
                      </td>
                      <td className="text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setDispatchOrderModal(ord);
                              setDispatchForm({
                                carrier: ord.carrier || 'DHL Express',
                                trackingNumber: ord.trackingNumber || '',
                                estimatedDeliveryDate: ord.estimatedDeliveryDate || '',
                                status: ord.status,
                              });
                            }}
                            className="btn btn-outline-dark btn-sm rounded-pill px-2.5 py-1 text-xs font-semibold"
                            title="Dispatch & Assign Tracking"
                          >
                            <Truck size={13} className="d-inline me-1" /> Dispatch
                          </button>
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="btn btn-light border border-slate-200 btn-sm rounded-pill px-2.5 py-1 text-xs font-semibold text-slate-700"
                            title="View Invoice"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY CONTROL */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 overflow-x-auto">
              {['All', 'Men', 'Women', 'Shoes', 'Accessories'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setInventoryCategoryFilter(cat)}
                  className={`btn btn-sm rounded-pill px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                    inventoryCategoryFilter === cat
                      ? 'btn-dark text-white'
                      : 'btn-light border border-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                  placeholder="Search catalog..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="btn btn-dark btn-sm rounded-pill px-3.5 py-2 font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus size={15} /> Add SKU
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-xs">
              <thead className="table-light text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Rating</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedInventoryProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border"
                        loading="lazy"
                               decoding="async"
                             />
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <span className="text-slate-400 text-2xs font-mono">SKU #{p.id}</span>
                          {p.badge && (
                            <span className="badge bg-slate-100 text-slate-800 rounded-pill ms-2 text-2xs">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-700">{p.category}</span>
                    </td>
                    <td>
                      <strong className="text-slate-900 font-bold">${p.price}</strong>
                      {p.oldPrice && (
                        <span className="text-slate-400 line-through text-2xs ms-1">
                          ${p.oldPrice}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-emerald-100 text-emerald-800 rounded-pill px-2.5 py-1 font-semibold">
                        ✓ In Stock (Active)
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-amber-600">★ {p.rating}</span>
                      <span className="text-slate-400 text-2xs ms-1">({p.reviews})</span>
                    </td>
                    <td className="text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="btn btn-outline-dark btn-sm rounded-circle p-1.5"
                          title="Edit Product"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${p.name} from catalog?`)) {
                              onDeleteProduct(p.id);
                              onShowToast('Removed', `${p.name} removed from inventory.`, 'info');
                            }
                          }}
                          className="btn btn-outline-danger btn-sm rounded-circle p-1.5"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inventory Pagination Bar */}
          {totalInventoryPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-3 border-t border-slate-100 text-xs text-slate-600">
              <div>
                Showing{' '}
                <strong className="text-slate-900 tabular-nums">
                  {(inventoryPage - 1) * inventoryItemsPerPage + 1}–{Math.min(inventoryPage * inventoryItemsPerPage, filteredProducts.length)}
                </strong>{' '}
                of <strong className="text-slate-900 tabular-nums">{filteredProducts.length}</strong> inventory SKUs
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={inventoryPage === 1}
                  onClick={() => setInventoryPage((prev) => Math.max(1, prev - 1))}
                  className="btn btn-light border border-slate-200 btn-sm rounded-pill px-3 py-1 text-xs font-semibold disabled:opacity-40"
                >
                  <ChevronLeft size={13} className="d-inline me-1" /> Prev
                </button>
                <span className="px-2 font-bold text-slate-800">
                  Page {inventoryPage} of {totalInventoryPages}
                </span>
                <button
                  type="button"
                  disabled={inventoryPage === totalInventoryPages}
                  onClick={() => setInventoryPage((prev) => Math.min(totalInventoryPages, prev + 1))}
                  className="btn btn-light border border-slate-200 btn-sm rounded-pill px-3 py-1 text-xs font-semibold disabled:opacity-40"
                >
                  Next <ChevronRight size={13} className="d-inline ms-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT & ACCESS CONTROL */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              {['All', 'admin', 'customer'].map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRoleFilter(role)}
                  className={`btn btn-sm rounded-pill px-3 py-1 text-xs font-semibold capitalize ${
                    userRoleFilter === role
                      ? 'btn-dark text-white'
                      : 'btn-light border border-slate-200 text-slate-600'
                  }`}
                >
                  {role === 'All' ? 'All Accounts' : role === 'admin' ? 'Admins' : 'Customers'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                  placeholder="Search user by name, email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => setIsAddUserOpen(true)}
                className="btn btn-dark btn-sm rounded-pill px-3.5 py-2 font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <UserPlus size={15} /> Add User
              </button>
              <button
                onClick={handleExportUsers}
                className="btn btn-outline-dark btn-sm rounded-pill px-3.5 py-2 font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download size={15} /> Export
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-xs">
              <thead className="table-light text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th>User Profile</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Tier / Status</th>
                  <th>Orders / Spent</th>
                  <th className="text-end">Manage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                          { (u?.name || '?').charAt(0).toUpperCase() }
                        </div>
                        <div>
                          <strong className="text-slate-900 block">{u.name}</strong>
                          <span className="text-slate-400 text-2xs">{u.id} · Joined {u.joinedDate}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-slate-700">{u.email}</div>
                      <div className="text-slate-400 text-2xs">{u.phone} · {u.city}</div>
                    </td>
                    <td>
                      {/* Role Switcher */}
                      <select
                        className="form-select form-select-sm py-1 px-2 text-xs font-semibold rounded-pill"
                        style={{ maxWidth: '120px' }}
                        value={u.role}
                        onChange={(e) =>
                          handleChangeUserRole(u.id, e.target.value as 'admin' | 'customer')
                        }
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="badge bg-slate-100 text-slate-800 rounded-pill px-2 py-0.5 text-2xs">
                          {u.membershipTier}
                        </span>
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`badge rounded-pill px-2 py-0.5 text-2xs border-0 cursor-pointer ${
                            u.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.status}
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong className="text-slate-900 block font-bold">${Number.isFinite(u?.totalSpent) ? u.totalSpent.toFixed(2) : '0.00'}</strong>
                      <span className="text-slate-500 text-2xs">{u.totalOrders} total orders</span>
                    </td>
                    <td className="text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`btn btn-sm rounded-pill px-2.5 py-1 text-xs font-semibold ${
                            u.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'
                          }`}
                          title="Toggle Account Status"
                        >
                          {u.status === 'Active' ? <UserX size={13} className="d-inline" /> : <UserCheck size={13} className="d-inline" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="btn btn-outline-danger btn-sm rounded-circle p-1.5"
                          title="Delete Account"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DELIVERY & LOGISTICS */}
      {activeTab === 'delivery' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h5 className="font-extrabold text-slate-900 mb-0">Live Carrier Dispatch Center</h5>
              <p className="text-slate-500 text-xs mb-0">
                Manage partner carriers, tracking barcodes, and customer delivery timelines.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge bg-slate-900 text-white rounded-pill px-3 py-1.5 text-xs font-semibold">
                Couriers Connected: 4
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {['DHL Express (Air)', 'FedEx Priority', 'UPS Worldwide', 'TCS Local Courier'].map(
              (carrier, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900">{carrier}</span>
                    <Truck size={15} className="text-slate-700" />
                  </div>
                  <div className="text-emerald-600 font-bold text-xs mb-1">✓ API Connected</div>
                  <span className="text-[11px] text-slate-400">Avg Delivery: 2–4 Days</span>
                </div>
              )
            )}
          </div>

          <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
            Active Dispatched Consignments
          </h6>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-xs">
              <thead className="table-light text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th>Order Reference</th>
                  <th>Recipient &amp; Destination</th>
                  <th>Carrier</th>
                  <th>Tracking Number</th>
                  <th>Delivery Status</th>
                  <th className="text-end">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                      <div className="text-slate-400 text-2xs">{ord.date}</div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900">{ord.customer.fullName}</div>
                      <div className="text-slate-500 text-2xs">{ord.customer.address}, {ord.customer.city}</div>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-800">{ord.carrier || 'DHL Express'}</span>
                    </td>
                    <td>
                      <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded">
                        {ord.trackingNumber}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-2.5 py-1 ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => {
                          setDispatchOrderModal(ord);
                          setDispatchForm({
                            carrier: ord.carrier || 'DHL Express',
                            trackingNumber: ord.trackingNumber || '',
                            estimatedDeliveryDate: ord.estimatedDeliveryDate || '',
                            status: ord.status,
                          });
                        }}
                        className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 font-semibold text-xs"
                      >
                        Update Dispatch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <h5 className="font-extrabold text-slate-900 mb-1">Department Revenue Analytics</h5>
          <p className="text-slate-500 text-xs mb-6">Sales distribution across catalog departments.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
                Department Value Breakdown
              </h6>
              {['Men', 'Women', 'Shoes', 'Accessories'].map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const revenue = categoryRevenue[cat] || 0;
                const pct =
                  totalCategoryRevenue > 0
                    ? Math.round((revenue / totalCategoryRevenue) * 100)
                    : products.length > 0
                    ? Math.round((count / products.length) * 100)
                    : 0;
                return (
                  <div key={cat} className="mb-4">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{cat} Atelier</span>
                      <span>
                        ${revenue.toFixed(0)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-900 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Operational Health Metrics
                </h6>
                <p className="text-slate-500 text-xs mb-4">
                  Real-time telemetry from frontend catalog, checkout state, and order persistence.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-600">Order Delivery Success Rate:</span>
                    <strong className="text-emerald-700 font-bold">99.8%</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-600">Average Fulfillment Time:</span>
                    <strong className="text-slate-900 font-bold">14 Hours</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-600">Client Return Ratio:</span>
                    <strong className="text-slate-900 font-bold">&lt; 1.2%</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>All telemetry live via React 19 state</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
          </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
                Top Selling Products
              </h6>
              {(() => {
                const productSales: Record<number, { name: string; qty: number; revenue: number }> = {};
                orders.forEach((order) => {
                  (order.items || []).forEach((item) => {
                    const id = item?.product?.id;
                    if (typeof id !== 'number') return;
                    if (!productSales[id]) {
                      productSales[id] = {
                        name: item.product?.name || 'Unknown Product',
                        qty: 0,
                        revenue: 0,
                      };
                    }
                    const qty = typeof item.quantity === 'number' ? item.quantity : 0;
                    const price = typeof item.product?.price === 'number' ? item.product.price : 0;
                    productSales[id].qty += qty;
                    productSales[id].revenue += qty * price;
                  });
                });
                const topProducts = Object.values(productSales)
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5);
                if (topProducts.length === 0) {
                  return <p className="text-xs text-slate-500">No order data available yet.</p>;
                }
                return (
                  <div className="space-y-3">
                    {topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <span className="truncate font-semibold text-slate-800">{product.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">${product.revenue.toFixed(0)}</div>
                          <div className="text-slate-500 text-2xs">{product.qty} sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
                Order Status Breakdown
              </h6>
              {(() => {
                const statuses = ['Confirmed', 'Processing in Studio', 'Dispatched', 'In Transit', 'Delivered'];
                const total = orders.length || 1;
                return (
                  <div className="space-y-3">
                    {statuses.map((status) => {
                      const count = orders.filter((o) => o.status === status).length;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>{status}</span>
                            <span>
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-slate-900 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISPATCH & EDIT LOGISTICS */}
      {dispatchOrderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setDispatchOrderModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-0">Dispatch Logistics</h4>
                <span className="text-slate-400 text-xs font-mono">{dispatchOrderModal.id}</span>
              </div>
              <button
                onClick={() => setDispatchOrderModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assigned Courier Partner:
                </label>
                <select
                  className="form-select form-select-sm text-xs rounded-xl"
                  value={dispatchForm.carrier}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, carrier: e.target.value })}
                >
                  <option value="DHL Express">DHL Express (Global Air)</option>
                  <option value="FedEx Priority">FedEx Priority</option>
                  <option value="UPS Worldwide">UPS Worldwide</option>
                  <option value="TCS Express">TCS Local Courier</option>
                  <option value="BlueDart Logistics">BlueDart Logistics</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Airway Tracking Number:
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs rounded-xl"
                  placeholder="e.g. TRK-8921-US"
                  value={dispatchForm.trackingNumber}
                  onChange={(e) =>
                    setDispatchForm({ ...dispatchForm, trackingNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Estimated Delivery Date:
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs rounded-xl"
                  placeholder="e.g. Oct 28, 2026"
                  value={dispatchForm.estimatedDeliveryDate}
                  onChange={(e) =>
                    setDispatchForm({ ...dispatchForm, estimatedDeliveryDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Update Stage Milestone:
                </label>
                <select
                  className="form-select form-select-sm text-xs rounded-xl"
                  value={dispatchForm.status}
                  onChange={(e) =>
                    setDispatchForm({ ...dispatchForm, status: e.target.value as Order['status'] })
                  }
                >
                  <option value="Processing in Studio">Processing in Studio</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full btn btn-dark rounded-xl py-2.5 font-bold text-xs">
                  Save Logistics &amp; Notify Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS & PRINT INVOICE */}
      {selectedOrderDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedOrderDetails(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-0">Official Store Invoice</h4>
                <span className="text-slate-400 text-xs font-mono">{selectedOrderDetails.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100"
                  title="Print invoice"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 text-xs">
              <div className="font-bold text-slate-900 mb-1">Delivered To:</div>
              <div className="text-slate-700">{selectedOrderDetails.customer.fullName}</div>
              <div className="text-slate-500">{selectedOrderDetails.customer.address}, {selectedOrderDetails.customer.city}</div>
              <div className="text-slate-500">{selectedOrderDetails.customer.phone} · {selectedOrderDetails.customer.email}</div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {selectedOrderDetails.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b">
                  <div className="flex items-center gap-2">
                    <img src={it.product.image} alt="" className="w-8 h-8 rounded object-cover" loading="lazy"
                               decoding="async"
                             />
                    <div>
                      <span className="font-bold text-slate-900">{it.product.name}</span>
                      <span className="text-slate-400 text-2xs block">Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <strong className="text-slate-900">${(it.product.price * it.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${selectedOrderDetails.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Privilege Discount ({selectedOrderDetails.couponCode || 'PROMO'}):</span>
                  <span>-${selectedOrderDetails.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Express Shipping:</span>
                <span>${selectedOrderDetails.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t">
                <span>Total Billed:</span>
                <span>${selectedOrderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full btn btn-dark rounded-xl py-2.5 font-bold text-xs"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setIsAddProductOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h4 className="font-extrabold text-slate-900 text-lg mb-0">Create Catalog Product</h4>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs rounded-xl"
                  placeholder="e.g. Minimalist Poplin Overshirt"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    className="form-select form-select-sm text-xs rounded-xl"
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Badge</label>
                  <input
                    type="text"
                    className="form-control form-control-sm text-xs rounded-xl"
                    placeholder="e.g. New Season"
                    value={newProductForm.badge}
                    onChange={(e) => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm text-xs rounded-xl"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Old Price ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm text-xs rounded-xl"
                    value={newProductForm.oldPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, oldPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs rounded-xl"
                  placeholder="One sentence summary..."
                  value={newProductForm.short_desc}
                  onChange={(e) => setNewProductForm({ ...newProductForm, short_desc: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  className="form-control form-control-sm text-xs rounded-xl"
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  required
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full btn btn-dark rounded-xl py-2.5 font-bold text-xs">
                  Publish to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h4 className="font-extrabold text-slate-900 text-lg mb-0">Edit Product SKU</h4>
              <button onClick={() => setEditingProduct(null)} className="p-1.5 text-slate-400 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs rounded-xl"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    className="form-select form-select-sm text-xs rounded-xl"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Badge</label>
                  <input
                    type="text"
                    className="form-control form-control-sm text-xs rounded-xl"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm text-xs rounded-xl"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Old Price ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm text-xs rounded-xl"
                    value={editingProduct.oldPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        oldPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs rounded-xl"
                  value={editingProduct.short_desc}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_desc: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  className="form-control form-control-sm text-xs rounded-xl"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  required
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full btn btn-dark rounded-xl py-2.5 font-bold text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW USER */}
      {isAddUserOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setIsAddUserOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h4 className="font-extrabold text-slate-900 text-lg mb-0">Register User Account</h4>
              <button onClick={() => setIsAddUserOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs rounded-xl"
                  placeholder="e.g. John Doe"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-sm text-xs rounded-xl"
                  placeholder="e.g. john@example.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    className="form-select form-select-sm text-xs rounded-xl"
                    value={newUserForm.role}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, role: e.target.value as 'admin' | 'customer' })
                    }
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Membership Tier</label>
                  <select
                    className="form-select form-select-sm text-xs rounded-xl"
                    value={newUserForm.membershipTier}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        membershipTier: e.target.value as ManagedUser['membershipTier'],
                      })
                    }
                  >
                    <option value="Bronze Member">Bronze Member</option>
                    <option value="Silver Collector">Silver Collector</option>
                    <option value="Gold VIP">Gold VIP</option>
                    <option value="Atelier Platinum">Atelier Platinum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    className="form-control form-control-sm text-xs rounded-xl"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    className="form-control form-control-sm text-xs rounded-xl"
                    value={newUserForm.city}
                    onChange={(e) => setNewUserForm({ ...newUserForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full btn btn-dark rounded-xl py-2.5 font-bold text-xs">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
