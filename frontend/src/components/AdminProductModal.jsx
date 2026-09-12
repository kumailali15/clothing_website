import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Upload, Check, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

const AdminProductModal = ({ isOpen, onClose, onProductChanged }) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'form'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 't-shirts',
    dressStyle: 'Casual',
    price: '',
    originalPrice: '',
    discount: '',
    stock: 25,
    description: '',
    images: [''],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
    colors: [{ name: 'Black', hex: '#000000' }]
  });

  const availableCategories = ['t-shirts', 'jeans', 'shirts', 'hoodies', 'shorts', 'jackets'];
  const availableStyles = ['Casual', 'Formal', 'Party', 'Gym'];
  const availableSizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', '2X-Large'];
  const presetColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Olive Green', hex: '#4F583E' },
    { name: 'Navy Blue', hex: '#1E293B' },
    { name: 'Crimson', hex: '#881337' },
    { name: 'Emerald', hex: '#064E3B' },
    { name: 'Classic Blue', hex: '#3B82F6' },
    { name: 'Dune Sand', hex: '#D4C5B9' }
  ];

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 50 });
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProductsList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 't-shirts',
      dressStyle: 'Casual',
      price: '',
      originalPrice: '',
      discount: '',
      stock: 25,
      description: '',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'],
      sizes: ['Small', 'Medium', 'Large', 'X-Large'],
      colors: [{ name: 'Black', hex: '#000000' }]
    });
    setError('');
    setSuccessMsg('');
  };

  const handleOpenAddForm = () => {
    resetForm();
    setActiveTab('form');
  };

  const handleOpenEditForm = (prod) => {
    setEditingId(prod.id);
    setFormData({
      title: prod.title || '',
      category: prod.category || 't-shirts',
      dressStyle: prod.dressStyle || 'Casual',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      discount: prod.discount || '',
      stock: prod.stock || 20,
      description: prod.description || '',
      images: prod.images && prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'],
      sizes: prod.sizes || ['Small', 'Medium', 'Large'],
      colors: prod.colors || [{ name: 'Black', hex: '#000000' }]
    });
    setError('');
    setSuccessMsg('');
    setActiveTab('form');
  };

  // Image Upload via Multer
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      const res = await api.uploadImage(file);
      // Prepend or replace first image URL
      const fullUrl = res.url.startsWith('/') ? `${window.location.origin}${res.url}` : res.url;
      setFormData(prev => ({
        ...prev,
        images: [fullUrl, ...prev.images.filter(img => img && img !== 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80')]
      }));
      setSuccessMsg('Image uploaded successfully via Multer!');
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (onProductChanged) onProductChanged();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price) {
      setError('Product title and price are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        dressStyle: formData.dressStyle,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        discount: formData.discount ? Number(formData.discount) : null,
        stock: Number(formData.stock) || 20,
        description: formData.description.trim(),
        images: formData.images.filter(img => img.trim() !== ''),
        sizes: formData.sizes,
        colors: formData.colors
      };

      if (editingId) {
        await api.updateProduct(editingId, payload);
        setSuccessMsg(`Successfully updated "${formData.title}"!`);
      } else {
        await api.createProduct(payload);
        setSuccessMsg(`Successfully created new product "${formData.title}"!`);
      }

      await fetchProductsList();
      if (onProductChanged) onProductChanged();
      setTimeout(() => {
        setActiveTab('list');
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSize = (sz) => {
    setFormData(prev => {
      const exists = prev.sizes.includes(sz);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter(s => s !== sz) : [...prev.sizes, sz]
      };
    });
  };

  const toggleColor = (colorObj) => {
    setFormData(prev => {
      const exists = prev.colors.some(c => c.name === colorObj.name);
      return {
        ...prev,
        colors: exists ? prev.colors.filter(c => c.name !== colorObj.name) : [...prev.colors, colorObj]
      };
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-4xl w-full p-6 bg-white rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-black uppercase text-black tracking-tight">
              Product CRUD Dashboard
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Manage inventory, add new streetwear garments with Multer image upload
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6 bg-gray-100 p-1.5 rounded-full max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-4 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'list'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            type="button"
            onClick={handleOpenAddForm}
            className={`flex-1 py-2 px-4 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Plus size={16} /> {editingId ? 'Edit Product' : 'Add New Product'}
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <Check size={16} /> {successMsg}
          </div>
        )}

        {/* TAB 1: PRODUCT LIST TABLE */}
        {activeTab === 'list' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">
                Showing {products.length} garments in database
              </span>
              <button
                onClick={fetchProductsList}
                className="text-xs font-semibold flex items-center gap-1 text-gray-700 hover:text-black"
              >
                <RefreshCw size={14} /> Refresh List
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading catalog...</div>
            ) : products.length === 0 ? (
              <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl">
                No products found. Click "Add New Product" to create one!
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-100 text-xs font-bold text-gray-900 uppercase border-b">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img
                            src={prod.images && prod.images[0] ? prod.images[0] : ''}
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                          <div>
                            <div className="font-bold text-gray-900 text-sm leading-snug">{prod.title}</div>
                            <div className="text-xs text-gray-500">{prod.dressStyle}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold capitalize text-gray-600">
                          {prod.category}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          ${prod.price}
                          {prod.discount && (
                            <span className="ml-1.5 text-xs text-red-500 font-normal">(-{prod.discount}%)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${
                            (prod.stock || 20) > 10 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {prod.stock || 20} in stock
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditForm(prod)}
                              className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg transition-all"
                              title="Edit product"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.title)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
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
            )}
          </div>
        )}

        {/* TAB 2: ADD / EDIT PRODUCT FORM */}
        {activeTab === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <h3 className="font-bold text-lg text-black">
              {editingId ? `Editing: ${formData.title}` : 'Add New Streetwear Garment'}
            </h3>

            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acid Wash Graphic T-Shirt"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-black capitalize"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  placeholder="145"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  placeholder="180"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  placeholder="20"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                  className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Dress Style
                </label>
                <select
                  value={formData.dressStyle}
                  onChange={(e) => setFormData(prev => ({ ...prev, dressStyle: e.target.value }))}
                  className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-black"
                >
                  {availableStyles.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Multer Image Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Upload Image (Multer Backend)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all">
                  <Upload size={16} />
                  <span>{uploadingImage ? 'Uploading via Multer...' : 'Choose File to Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                <span className="text-xs text-gray-400">or enter image URL below</span>
              </div>

              {/* Image Preview & URL input */}
              <div className="mt-3 flex items-center gap-3">
                {formData.images[0] && (
                  <img
                    src={formData.images[0]}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover border"
                  />
                )}
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
                  className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-xs font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Product details, fabric info, fit style..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Sizes selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(sz => {
                  const selected = formData.sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selected ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                Available Colors
              </label>
              <div className="flex flex-wrap gap-3">
                {presetColors.map(c => {
                  const selected = formData.colors.some(col => col.name === c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleColor(c)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected ? 'border-black scale-110 shadow-sm' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selected && (
                        <Check size={14} color={c.name === 'Pure White' ? '#000000' : '#ffffff'} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Action buttons */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-black text-white font-bold py-3 rounded-full hover:bg-gray-800 transition-all text-sm"
              >
                {submitting ? 'Saving Garment...' : editingId ? 'Update Garment' : 'Create Garment'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-6 py-3 border border-gray-300 font-semibold rounded-full hover:bg-gray-50 text-sm text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProductModal;
