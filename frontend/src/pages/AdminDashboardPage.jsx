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
  Eye
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
        // Logged in as Admin
      } else {
        setLoginError('This account does not have Admin privileges.');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.message || 'Failed to update order status');
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

  // Calculations for Overview Tab
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalUsersCount = usersList.length || 2;

  // ----------------------------------------------------
  // VIEW 1: ADMIN LOGIN SCREEN (If not logged in as Admin)
  // ----------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <ShieldCheck size={32} />
            </div>
            <h1 className="font-display text-2xl font-black uppercase text-black tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Sign in with administrator credentials to manage SHOP.CO
            </p>
          </div>

          {/* Credentials Hint Box */}
          <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
              <Lock size={14} /> Default Admin Credentials:
            </div>
            <div>Email: <strong className="font-mono text-amber-950">admin@shop.co</strong></div>
            <div>Password: <strong className="font-mono text-amber-950">admin123456</strong></div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Admin Email
              </label>
              <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 gap-2 border border-transparent focus-within:border-black">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-none text-sm font-medium text-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Password
              </label>
              <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 gap-2 border border-transparent focus-within:border-black">
                <Lock size={18} className="text-gray-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-none text-sm font-medium text-black focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-black text-white font-bold py-3.5 rounded-full hover:bg-gray-800 transition-all text-sm shadow-lg hover:shadow-xl mt-2"
            >
              {loginLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: FULL ADMIN DASHBOARD (When Logged in as Admin)
  // ----------------------------------------------------
  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Dashboard Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                ADMIN CONSOLE
              </span>
              <span className="text-xs text-gray-500 font-medium">Logged in as {user.name}</span>
            </div>
            <h1 className="font-display text-3xl font-black uppercase text-black tracking-tight mt-1">
              STORE DASHBOARD
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2.5 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw size={14} /> Refresh Data
            </button>

            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus size={16} /> Manage Garments
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-full border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 flex items-center gap-1 transition-all"
              title="Sign Out Admin"
            >
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>

        {/* ANALYTICS STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Total Revenue</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-black tracking-tight">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>Saved in Backend Database</span>
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Total Orders</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-black tracking-tight">{totalOrdersCount}</div>
            <div className="text-xs text-blue-600 font-semibold mt-1">Customer purchases</div>
          </div>

          {/* Card 3: Products */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Catalog Garments</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Package size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-black tracking-tight">{totalProductsCount}</div>
            <div className="text-xs text-purple-600 font-semibold mt-1">Active inventory</div>
          </div>

          {/* Card 4: Registered Users */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Store Users</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-black tracking-tight">{totalUsersCount}</div>
            <div className="text-xs text-amber-600 font-semibold mt-1">Registered accounts</div>
          </div>
        </div>

        {/* MAIN DASHBOARD TABS NAVIGATION */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'products', label: `Products (${products.length})` },
              { id: 'orders', label: `Orders (${orders.length})` },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
              { id: 'users', label: `Users (${usersList.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & RECENT ACTIVITY */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-black">Recent Orders Activity</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-black underline flex items-center gap-1">
                  View All Orders <ArrowRight size={14} />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl">
                  No orders placed yet.
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-100 text-xs font-extrabold uppercase text-gray-900 border-b">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-black">{order.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-black">{order.customer?.fullName}</div>
                            <div className="text-xs text-gray-500">{order.customer?.city}, {order.customer?.country}</div>
                          </td>
                          <td className="p-4 text-xs font-medium">
                            {order.items?.length} item(s)
                          </td>
                          <td className="p-4 font-black text-black">${order.total}</td>
                          <td className="p-4 text-xs">
                            <span className="px-3 py-1 rounded-full font-extrabold bg-green-100 text-green-800">
                              {order.status || 'Confirmed'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="text-xs font-bold text-black hover:underline"
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

          {/* TAB 2: PRODUCTS CRUD MANAGEMENT */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-black">All Store Products</h3>
                <button
                  onClick={() => setIsProductModalOpen(true)}
                  className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-gray-800"
                >
                  <Plus size={14} /> Add Product with Multer
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-100 text-xs font-extrabold uppercase text-gray-900 border-b">
                    <tr>
                      <th className="p-4">Garment</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Style</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={prod.images && prod.images[0] ? prod.images[0] : ''}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover border bg-gray-100"
                          />
                          <div>
                            <div className="font-extrabold text-black text-sm">{prod.title}</div>
                            <div className="text-xs text-gray-500">ID: {prod.id}</div>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-bold uppercase text-gray-600">{prod.category}</td>
                        <td className="p-4 text-xs font-semibold text-gray-600">{prod.dressStyle}</td>
                        <td className="p-4 font-black text-black">
                          ${prod.price}
                          {prod.discount && (
                            <span className="ml-1 text-xs text-red-500 font-bold">(-{prod.discount}%)</span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-700">{prod.stock || 20}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setIsProductModalOpen(true)}
                            className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800"
                          >
                            Edit / Delete
                          </button>
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
              <h3 className="font-bold text-lg text-black mb-4">Manage Orders</h3>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-100 text-xs font-extrabold uppercase text-gray-900 border-b">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Update Status</th>
                      <th className="p-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-black">{order.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-black">{order.customer?.fullName}</div>
                          <div className="text-xs text-gray-500">{order.customer?.email}</div>
                          <div className="text-xs text-gray-400">{order.customer?.phone}</div>
                        </td>
                        <td className="p-4 text-xs">
                          {order.items?.map(it => (
                            <div key={it.productId} className="font-medium text-gray-800">
                              {it.quantity}x {it.title} ({it.size})
                            </div>
                          ))}
                        </td>
                        <td className="p-4 font-black text-black">${order.total}</td>
                        <td className="p-4">
                          <select
                            value={order.status || 'Confirmed'}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="bg-gray-100 border-none text-xs font-bold rounded-xl px-3 py-1.5 text-black focus:ring-2 focus:ring-black cursor-pointer"
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
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg"
                            title="View full order info"
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
              <h3 className="font-bold text-lg text-black mb-4">Customer Reviews Moderation</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 border border-gray-200 rounded-2xl bg-white relative">
                    <div className="flex items-center justify-between mb-2">
                      <StarRating rating={rev.rating} showScore={false} size={16} />
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="font-bold text-sm text-black">{rev.author}</div>
                    <p className="text-xs text-gray-600 mt-1 italic">"{rev.content}"</p>
                    <div className="text-[10px] text-gray-400 mt-3">{rev.date || 'Recent'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USERS LIST */}
          {activeTab === 'users' && (
            <div>
              <h3 className="font-bold text-lg text-black mb-4">Registered Store Accounts</h3>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-100 text-xs font-extrabold uppercase text-gray-900 border-b">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">User ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-black">{usr.name}</td>
                        <td className="p-4 text-xs font-medium text-gray-600">{usr.email}</td>
                        <td className="p-4 text-xs">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            usr.role === 'admin' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
                          }`}>
                            {usr.role || 'user'}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-gray-400">{usr.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Product CRUD Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onProductChanged={() => fetchDashboardData()}
      />

      {/* Order Details View Modal */}
      {selectedOrderDetails && (
        <div className="modal-overlay" onClick={() => setSelectedOrderDetails(null)}>
          <div className="modal-content max-w-lg bg-white p-6 rounded-3xl relative" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedOrderDetails(null)}>
              <X size={20} />
            </button>

            <h3 className="font-display text-xl font-black uppercase text-black mb-4">
              Order #{selectedOrderDetails.id}
            </h3>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="font-bold text-black mb-1">Customer Info:</div>
                <div>Name: <strong>{selectedOrderDetails.customer?.fullName}</strong></div>
                <div>Email: <strong>{selectedOrderDetails.customer?.email}</strong></div>
                <div>Phone: <strong>{selectedOrderDetails.customer?.phone}</strong></div>
                <div>Address: <strong>{selectedOrderDetails.customer?.address}, {selectedOrderDetails.customer?.city}, {selectedOrderDetails.customer?.country}</strong></div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="font-bold text-black mb-1">Purchased Items:</div>
                {selectedOrderDetails.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-gray-200 last:border-none">
                    <span>{it.quantity}x {it.title} ({it.size})</span>
                    <span className="font-bold">${it.price}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-gray-100 rounded-xl flex justify-between text-sm font-bold text-black">
                <span>Total Amount Paid:</span>
                <span>${selectedOrderDetails.total}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full bg-black text-white font-bold py-2.5 rounded-full text-xs uppercase mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
