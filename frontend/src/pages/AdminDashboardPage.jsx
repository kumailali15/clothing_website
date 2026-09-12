import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AdminProductModal from '../components/AdminProductModal';
import StarRating from '../components/StarRating';
import {
  Lock,
  Mail,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight,
  LogOut,
  RefreshCw,
  Search,
  Eye,
  Globe,
  Sparkles,
  Edit3,
  SlidersHorizontal,
  ChevronRight,
  Check
} from 'lucide-react';

const AdminDashboardPage = ({ onNavigate }) => {
  const { user, login, logout } = useAuth();

  // Admin login form state
  const [loginEmail, setLoginEmail] = useState('admin@shop.co');
  const [loginPassword, setLoginPassword] = useState('admin123456');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'reviews', 'users'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@shop.co');

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const [prodRes, orderRes, revRes, userRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getOrders(),
        api.getReviews(),
        api.getUsers()
      ]);
      setProducts(prodRes.products || []);
      setOrders(orderRes || []);
      setReviews(revRes || []);
      setUsersList(userRes || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.user && (res.user.role === 'admin' || res.user.email === 'admin@shop.co')) {
        if (onNavigate) {
          onNavigate('home');
        }
      } else {
        setLoginError('This account does not have Admin privileges.');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Analytics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalUsersCount = usersList.length || 2;

  // Filtered products list for search
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // ----------------------------------------------------
  // VIEW 1: ADMIN LOGIN GATE SCREEN (Website Light Theme)
  // ----------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F2F0F1] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Decorative Background Vector Elements */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-black/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/5 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-12 left-12 opacity-15 hidden sm:block animate-spin" style={{ animationDuration: '30s' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M50 0C50 27.6142 72.3858 50 100 50C72.3858 50 50 72.3858 50 100C50 72.3858 27.6142 50 0 50C27.6142 50 50 27.6142 50 0Z" fill="#000000" />
          </svg>
        </div>
        <div className="absolute bottom-12 right-12 opacity-15 hidden sm:block animate-spin" style={{ animationDuration: '40s' }}>
          <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
            <path d="M50 0C50 27.6142 72.3858 50 100 50C72.3858 50 50 72.3858 50 100C50 72.3858 27.6142 50 0 50C27.6142 50 50 27.6142 50 0Z" fill="#000000" />
          </svg>
        </div>

        <div className="max-w-md w-full bg-white border border-black/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-black">
          <div className="text-center mb-8">
            <div className="inline-block bg-black text-white font-display font-black text-xl tracking-tighter px-5 py-1.5 rounded-full mb-4 shadow-md">
              SHOP.CO
            </div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black">
              LOGIN AS ADMIN
            </h1>
            <p className="text-xs text-black/60 font-medium mt-2">
              Enter Administrator credentials to unlock full store & management access
            </p>
          </div>

          {/* Credentials Info Badge */}
          <div className="mb-6 p-4 bg-[#F2F0F1] border border-black/10 rounded-2xl text-xs text-black/80">
            <div className="font-bold flex items-center gap-1.5 mb-2 text-black uppercase tracking-wider text-[11px]">
              <ShieldCheck size={16} className="text-black" /> Default Admin Credentials:
            </div>
            <div className="flex justify-between py-1 border-b border-black/10">
              <span className="text-black/60 font-medium">Email:</span>
              <strong className="font-mono text-black">admin@shop.co</strong>
            </div>
            <div className="flex justify-between py-1 pt-1.5">
              <span className="text-black/60 font-medium">Password:</span>
              <strong className="font-mono text-black">admin123456</strong>
            </div>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-center gap-2">
              <span>⚠️</span> {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black uppercase text-black/70 mb-2 tracking-wider">
                Email Address
              </label>
              <div className="flex items-center bg-[#F2F0F1] rounded-2xl px-4 py-3.5 gap-3 border border-black/10 focus-within:border-black transition-all">
                <Mail size={18} className="text-black/50" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@shop.co"
                  required
                  className="w-full bg-transparent border-none text-sm font-semibold text-black focus:outline-none placeholder-black/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-black/70 mb-2 tracking-wider">
                Password
              </label>
              <div className="flex items-center bg-[#F2F0F1] rounded-2xl px-4 py-3.5 gap-3 border border-black/10 focus-within:border-black transition-all">
                <Lock size={18} className="text-black/50" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-none text-sm font-semibold text-black focus:outline-none placeholder-black/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-black text-white font-black py-4 rounded-full hover:bg-black/90 active:scale-[0.99] transition-all text-sm shadow-xl flex items-center justify-center gap-2 mt-6 uppercase tracking-wider"
            >
              {loginLoading ? 'Authenticating...' : 'Login as Admin'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: ULTRA-PREMIUM HIGH-FASHION DASHBOARD (Post-Login)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-16">
      {/* Top Header Bar */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 max-w-7xl h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl font-black tracking-tighter text-white uppercase">
              SHOP.CO
            </span>
            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full border border-zinc-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> CONTROL CENTER
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Prominent Button to View Live Customer Store */}
            <button
              onClick={() => onNavigate('home')}
              className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-full font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all uppercase tracking-wider"
              title="Open the live public store website"
            >
              <Globe size={16} /> View Store Website
            </button>

            <button
              onClick={logout}
              className="p-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              title="Sign Out Admin"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="container mx-auto px-4 max-w-7xl pt-8">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Revenue */}
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider">Total Revenue</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
              <CheckCircle size={14} /> Database synced
            </div>
          </div>

          {/* Orders */}
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider">Total Orders</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">{totalOrdersCount}</div>
            <div className="text-xs text-blue-400 font-semibold mt-2">Customer purchases</div>
          </div>

          {/* Garments */}
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider">Store Garments</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Package size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">{totalProductsCount}</div>
            <div className="text-xs text-purple-400 font-semibold mt-2">Active catalog items</div>
          </div>

          {/* Users */}
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider">Registered Users</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Users size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">{totalUsersCount}</div>
            <div className="text-xs text-amber-400 font-semibold mt-2">Verified user accounts</div>
          </div>
        </div>

        {/* MAIN NAVIGATION TABS & DASHBOARD CARD */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          {/* Navigation Pill Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-5 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'overview', label: '📊 Overview' },
                { id: 'products', label: `👕 Garments CRUD (${products.length})` },
                { id: 'orders', label: `🛒 Customer Orders (${orders.length})` },
                { id: 'reviews', label: `⭐ Reviews (${reviews.length})` },
                { id: 'users', label: `👥 Users (${usersList.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchDashboardData}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-all"
                title="Refresh database data"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="bg-white text-black hover:bg-zinc-200 px-4 py-2.5 rounded-full text-xs font-black uppercase flex items-center gap-1.5 transition-all"
              >
                <Plus size={16} /> Add Garment (Multer Upload)
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & RECENT ACTIVITY */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase text-white font-display">
                  Recent Orders Activity
                </h2>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1">
                  View All Orders <ChevronRight size={14} />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                  No customer orders recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto border border-zinc-800 rounded-2xl">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="bg-zinc-800/60 text-xs font-black uppercase text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-white">{order.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-white">{order.customer?.fullName}</div>
                            <div className="text-xs text-zinc-400">{order.customer?.city}, {order.customer?.country}</div>
                          </td>
                          <td className="p-4 text-xs font-medium text-zinc-400">
                            {order.items?.length} item(s)
                          </td>
                          <td className="p-4 font-black text-white">${order.total}</td>
                          <td className="p-4 text-xs">
                            <span className="px-3 py-1 rounded-full font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {order.status || 'Confirmed'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="text-xs font-bold text-white hover:underline bg-zinc-800 px-3 py-1.5 rounded-lg"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD TABLE */}
          {activeTab === 'products' && (
            <div>
              {/* Search and Category Filter Strip */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                <div className="flex items-center gap-3 flex-1 max-w-md bg-zinc-800/80 border border-zinc-700/60 rounded-2xl px-4 py-2.5">
                  <Search size={18} className="text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search garments by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none w-full text-xs text-white placeholder-zinc-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {['all', 't-shirts', 'jeans', 'shirts', 'hoodies', 'shorts', 'jackets'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                        categoryFilter === cat ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-zinc-800 rounded-2xl">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-800/60 text-xs font-black uppercase text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Garment</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Style</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={prod.images && prod.images[0] ? prod.images[0] : ''}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-700 bg-zinc-800"
                          />
                          <div>
                            <div className="font-extrabold text-white text-sm">{prod.title}</div>
                            <div className="text-xs text-zinc-500 font-mono">ID: {prod.id}</div>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-bold uppercase text-zinc-400">{prod.category}</td>
                        <td className="p-4 text-xs font-semibold text-zinc-400">{prod.dressStyle}</td>
                        <td className="p-4 font-black text-white">
                          ${prod.price}
                          {prod.discount && (
                            <span className="ml-1.5 text-xs text-red-400 font-bold">(-{prod.discount}%)</span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-bold text-zinc-300">{prod.stock || 20}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setIsProductModalOpen(true)}
                              className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-all"
                            >
                              Edit / Upload
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.title)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-all"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
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

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-black uppercase text-white font-display mb-4">
                Manage Orders & Shipping Status
              </h2>

              <div className="overflow-x-auto border border-zinc-800 rounded-2xl">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-800/60 text-xs font-black uppercase text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status Dropdown</th>
                      <th className="p-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">{order.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{order.customer?.fullName}</div>
                          <div className="text-xs text-zinc-400">{order.customer?.email}</div>
                          <div className="text-xs text-zinc-500">{order.customer?.phone}</div>
                        </td>
                        <td className="p-4 text-xs">
                          {order.items?.map(it => (
                            <div key={it.productId} className="font-medium text-zinc-300">
                              {it.quantity}x {it.title} ({it.size})
                            </div>
                          ))}
                        </td>
                        <td className="p-4 font-black text-white">${order.total}</td>
                        <td className="p-4">
                          <select
                            value={order.status || 'Confirmed'}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-xl px-3 py-1.5 text-white focus:outline-none cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-black uppercase text-white font-display mb-4">
                Customer Reviews Moderation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 border border-zinc-800 rounded-2xl bg-zinc-950/60 relative">
                    <div className="flex items-center justify-between mb-2">
                      <StarRating rating={rev.rating} showScore={false} size={16} />
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-950/40 rounded-lg"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="font-bold text-sm text-white">{rev.author}</div>
                    <p className="text-xs text-zinc-400 mt-1 italic">"{rev.content}"</p>
                    <div className="text-[10px] text-zinc-500 mt-3">{rev.date || 'Recent'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USERS LIST */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-black uppercase text-white font-display mb-4">
                Registered User Accounts
              </h2>

              <div className="overflow-x-auto border border-zinc-800 rounded-2xl">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-800/60 text-xs font-black uppercase text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">User ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-zinc-800/40">
                        <td className="p-4 font-bold text-white">{usr.name}</td>
                        <td className="p-4 text-xs font-medium text-zinc-400">{usr.email}</td>
                        <td className="p-4 text-xs">
                          <span className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase ${
                            usr.role === 'admin' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300'
                          }`}>
                            {usr.role || 'user'}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-zinc-500">{usr.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Admin Product CRUD Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onProductChanged={() => fetchDashboardData()}
      />

      {/* Order Details Inspector Modal */}
      {selectedOrderDetails && (
        <div className="modal-overlay" onClick={() => setSelectedOrderDetails(null)}>
          <div className="modal-content max-w-lg bg-zinc-900 text-white border border-zinc-800 p-6 rounded-3xl relative" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn text-zinc-400 hover:text-white" onClick={() => setSelectedOrderDetails(null)}>
              <X size={20} />
            </button>

            <h3 className="font-display text-xl font-black uppercase text-white mb-4">
              Order #{selectedOrderDetails.id} Receipt
            </h3>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="font-bold text-white mb-1">Customer Info:</div>
                <div>Name: <strong>{selectedOrderDetails.customer?.fullName}</strong></div>
                <div>Email: <strong>{selectedOrderDetails.customer?.email}</strong></div>
                <div>Phone: <strong>{selectedOrderDetails.customer?.phone}</strong></div>
                <div>Address: <strong>{selectedOrderDetails.customer?.address}, {selectedOrderDetails.customer?.city}, {selectedOrderDetails.customer?.country}</strong></div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="font-bold text-white mb-1">Purchased Garments:</div>
                {selectedOrderDetails.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-zinc-800 last:border-none">
                    <span>{it.quantity}x {it.title} ({it.size})</span>
                    <span className="font-bold text-white">${it.price}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-zinc-800 rounded-xl flex justify-between text-sm font-bold text-white">
                <span>Total Amount Paid:</span>
                <span>${selectedOrderDetails.total}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full bg-white text-black font-extrabold py-3 rounded-full text-xs uppercase mt-4"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
