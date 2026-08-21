import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiX, HiCube, HiPlusCircle, HiStar, HiSparkles, HiGlobeAlt, HiDatabase } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminApi } from '../utils/adminApi';

const defaultCategories = ['Sparklers', 'Flower Pots', 'Rockets', 'Bombs', 'Gift Boxes', 'Kids Crackers', 'Combo Packs'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ productNumber: '', name: '', category: 'Sparklers', price: '', discountPrice: '', stock: '', description: '', featured: false, imageUrl: '', videoUrl: '' });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverCategories, setServerCategories] = useState([]);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const allCategories = [...new Set([...defaultCategories, ...serverCategories.map(c => c.name || c)])];

  useEffect(() => {
    fetchProducts();
    fetchServerCategories();
  }, []);

  const fetchServerCategories = () => {
    adminApi.getCategories().then(res => {
      setServerCategories(res.data || []);
    }).catch(() => {});
  };

  const fetchProducts = () => {
    adminApi.getAllProducts({ source: 'local' }).then(res => {
      const data = res.data;
      setProducts(Array.isArray(data) ? data : data.products || []);
      setLoading(false);
    }).catch(() => { setLoading(false); });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ productNumber: '', name: '', category: 'Sparklers', price: '', discountPrice: '', stock: '', description: '', featured: false, imageUrl: '', videoUrl: '' });
    setImage(null);
    setShowNewCatInput(false);
    setNewCategory('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ productNumber: p.productNumber || '', name: p.name, category: p.category, price: p.price, discountPrice: p.discountPrice || '', stock: p.stock, description: p.description || '', featured: p.featured || false, imageUrl: p.imageUrl || '', videoUrl: p.videoUrl || '' });
    setImage(null);
    setShowNewCatInput(false);
    setNewCategory('');
    setShowForm(true);
  };

  const addCategory = async () => {
    const cat = newCategory.trim();
    if (!cat) return;
    if (allCategories.includes(cat)) { toast('Category already exists'); return; }
    try {
      const emojis = ['🎆', '🎇', '🚀', '💥', '🎁', '🧨', '📦', '🔥', '✨', '⭐'];
      await adminApi.createCategory({
        name: cat,
        emoji: emojis[serverCategories.length % emojis.length],
        color: 'from-purple-400 to-violet-500'
      });
      await fetchServerCategories();
      setForm({ ...form, category: cat });
      setShowNewCatInput(false);
      setNewCategory('');
      toast.success(`Category "${cat}" added`);
    } catch {
      toast.error('Failed to add category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name and price required');
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.set('discountPrice', form.discountPrice || 0);
      fd.set('stock', form.stock || 0);
      if (image) fd.append('image', image);
      if (editing) {
        await adminApi.updateProduct(editing, fd);
        toast.success('Product updated!');
      } else {
        await adminApi.createProduct(fd);
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center"><HiCube className="text-white text-sm" /></span>
          Products
        </h1>
        <button onClick={openCreate} className="bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 text-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all flex items-center gap-2 border border-yellow-200/40">
          <span className="text-base leading-none">+</span> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-[1.5px] bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-amber-400 shadow-2xl shadow-fuchsia-500/10" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-[calc(1.5rem-1.5px)] overflow-hidden">
              {/* Header */}
              <div className="relative px-5 sm:px-7 pt-5 sm:pt-6 pb-5 bg-gradient-to-r from-sky-500/15 via-fuchsia-500/15 to-amber-500/15 border-b border-white/5 overflow-hidden">
                <div className="absolute -top-8 -right-8 w-36 h-36 bg-fuchsia-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/20 bg-gradient-to-br ${editing ? 'from-amber-400 to-orange-500 shadow-amber-500/30' : 'from-cyan-400 to-blue-600 shadow-cyan-500/30'}`}>
                      {editing ? <HiPencil className="text-white text-xl" /> : <HiSparkles className="text-white text-2xl drop-shadow" />}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-white">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                      <p className="text-xs sm:text-sm font-bold mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300">{editing ? 'Update the details and save' : 'Fill in everything and create'}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all">
                    <HiX className="text-xl" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="px-5 sm:px-7 py-5 sm:py-6 space-y-4">
                {/* Section: Basic Info */}
                <div className="bg-slate-800/40 border border-cyan-500/20 rounded-2xl p-4 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Product ID</label>
                      <input type="text" value={form.productNumber} onChange={(e) => setForm({...form, productNumber: e.target.value})}
                        placeholder="Auto generate" maxLength={10}
                        className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 text-white placeholder-slate-600 text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Name *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                        placeholder="Product name"
                        className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 text-white placeholder-slate-600 text-sm" required />
                    </div>
                  </div>
                </div>

                {/* Section: Category */}
                <div className="bg-slate-800/40 border border-violet-500/20 rounded-2xl p-4 sm:p-5">
                  {showNewCatInput ? (
                    <div className="flex gap-2">
                      <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category"
                        className="flex-1 bg-slate-900/70 border border-violet-500/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/60 text-white placeholder-slate-600 text-sm" autoFocus />
                      <button type="button" onClick={addCategory}
                        className="bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 text-slate-800 px-5 rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all">
                        Add
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                          className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500 text-white text-sm appearance-none">
                          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">▼</div>
                      </div>
                      <button type="button" onClick={() => { setShowNewCatInput(true); setNewCategory(''); }}
                        className="shrink-0 p-2.5 bg-slate-900/70 border border-slate-700 rounded-xl text-slate-400 hover:text-violet-400 hover:border-violet-500/50 hover:scale-105 transition-all">
                        <HiPlusCircle className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Section: Pricing */}
                <div className="bg-slate-800/40 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Price (₹) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold">₹</span>
                        <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}
                          placeholder="0"
                          className="w-full bg-slate-900/70 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 text-white text-sm" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Discount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold">₹</span>
                        <input type="number" value={form.discountPrice} onChange={(e) => setForm({...form, discountPrice: e.target.value})}
                          placeholder="0"
                          className="w-full bg-slate-900/70 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 text-white text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Stock</label>
                      <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})}
                        placeholder="0"
                        className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 text-white text-sm" />
                    </div>
                  </div>
                  {form.discountPrice > 0 && form.price > 0 && (
                    <div className="mt-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl inline-flex items-center gap-2">
                      <HiStar className="text-emerald-400 text-sm" />
                      <span className="text-xs font-black text-emerald-300">{Math.round(((form.price - form.discountPrice) / form.price) * 100)}% OFF!</span>
                    </div>
                  )}
                </div>

                {/* Section: Details */}
                <div className="bg-slate-800/40 border border-amber-500/20 rounded-2xl p-4 sm:p-5">
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Write a short description..."
                    className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500 text-white placeholder-slate-600 text-sm h-24 resize-none" />
                  <div className="mt-3.5 flex items-center gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer group bg-slate-900/70 border border-slate-700 rounded-xl px-3.5 py-2.5 hover:border-amber-500/50 transition-all">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})}
                        className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500/50 bg-slate-900 border-slate-600" />
                      <span className="text-xs font-bold text-slate-300 group-hover:text-amber-300 transition-colors">Featured product</span>
                      {form.featured && <span className="text-[10px] font-black text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded-lg">★ Starred</span>}
                    </label>
                  </div>
                </div>

                {/* Section: Media */}
                <div className="bg-slate-800/40 border border-pink-500/20 rounded-2xl p-4 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Image URL</label>
                      <input type="url" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} placeholder="https://..."
                        className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 text-white placeholder-slate-600 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">YouTube</label>
                      <input type="url" value={form.videoUrl} onChange={(e) => setForm({...form, videoUrl: e.target.value})} placeholder="https://youtube.com/..."
                        className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 text-white placeholder-slate-600 text-sm" />
                    </div>
                  </div>
                  <div className="mt-3.5">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Upload Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
                      className="w-full bg-slate-900/70 border border-dashed border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-400 file:bg-gradient-to-r file:from-pink-500 file:to-rose-600 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:mr-3 file:font-medium file:cursor-pointer hover:border-pink-500/50 transition-all cursor-pointer" />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="sm:flex-1 bg-white text-slate-800 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all shadow-lg shadow-white/10">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="sm:flex-[2] bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 text-slate-800 py-3 rounded-xl font-black text-sm shadow-lg shadow-yellow-500/40 hover:shadow-yellow-500/60 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2">
                    {submitting ? (
                      <><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                    ) : editing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-slate-800 rounded-2xl h-24 animate-pulse border border-slate-700 border-l-4 border-l-slate-600" />)}</div>
      ) : products.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
          <HiCube className="text-5xl text-slate-700 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg">No products yet</p>
          <p className="text-slate-400 text-sm mt-1">Click &quot;Add&quot; to create your first product</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p, i) => {
            const borderColors = ['border-l-cyan-500', 'border-l-pink-500', 'border-l-violet-500', 'border-l-amber-500', 'border-l-emerald-500', 'border-l-indigo-500', 'border-l-rose-500', 'border-l-sky-500'];
            const borderColor = borderColors[i % borderColors.length];
            const avGradients = ['from-cyan-500 to-blue-600', 'from-pink-500 to-rose-600', 'from-violet-500 to-purple-600', 'from-amber-500 to-orange-600', 'from-emerald-500 to-teal-600', 'from-indigo-500 to-blue-600', 'from-rose-500 to-pink-600', 'from-sky-500 to-cyan-600'];
            const avGrad = avGradients[i % avGradients.length];
            return (
            <motion.div key={p._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-slate-800 rounded-2xl p-4 md:px-5 md:py-4 border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-0.5 hover:shadow-xl border-l-4 ${borderColor} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-bl-full" />
              <div className="grid grid-cols-12 gap-3 items-center relative">
                {/* Image + Name */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className={`w-12 h-12 bg-gradient-to-br ${avGrad} rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg ring-2 ring-white/10`}>
                    {p.image || p.imageUrl ? (
                      <img src={p.image || p.imageUrl} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <HiCube className="text-white text-lg" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-black text-white text-sm truncate">{p.name}</p>
                      {p.featured && <span className="text-[9px] font-bold text-amber-400 bg-amber-500/15 px-1 rounded-full shrink-0">★</span>}
                      {p.source === 'django' && (
                        <span className="text-[9px] font-black text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                          <HiGlobeAlt className="text-[8px]" /> Django
                        </span>
                      )}
                      {p.source === 'local' && (
                        <span className="text-[9px] font-black text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                          <HiDatabase className="text-[8px]" /> Local
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[11px] font-black text-cyan-300 font-mono">{p.productNumber || String(i + 1).padStart(3, '0')}</span>
                      <span className="text-slate-700 text-[9px] font-black">|</span>
                      <span className="text-[11px] font-black text-violet-300">{p.category}</span>
                    </div>
                  </div>
                </div>

                {/* Stock */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 justify-center">
                    <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : p.stock > 0 ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'}`} />
                    <span className={`font-black text-sm ${p.stock > 10 ? 'text-emerald-300' : p.stock > 0 ? 'text-amber-300' : 'text-red-300'}`}>
                      {p.stock > 0 ? p.stock : 'Out'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500">
                      {p.stock > 10 ? '● High' : p.stock > 0 ? '● Low' : ''}
                    </span>
                  </div>
                  {p.stock > 0 && (
                    <div className="mt-1.5 w-full max-w-[80px] mx-auto h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((p.stock / 100) * 100, 100)}%` }}
                        transition={{ duration: 0.6 }}
                        className={`h-full rounded-full ${p.stock > 10 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      />
                    </div>
                  )}
                </div>

                {/* Rate */}
                <div className="col-span-2">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-black text-cyan-500 bg-cyan-500/15 px-1.5 py-1 rounded-lg">₹</span>
                    <span className={`font-black text-xl tracking-tight ${
                      p.price >= 500 ? 'text-rose-300' : p.price >= 200 ? 'text-violet-300' : 'text-emerald-300'
                    }`}>{p.price}</span>
                  </div>
                </div>

                {/* Offer */}
                <div className="col-span-2 text-center">
                  {p.discountPrice > 0 ? (
                    <div className="bg-emerald-500/10 rounded-xl py-2 px-1 border border-emerald-500/20">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-xs font-black text-emerald-400">₹</span>
                        <span className="font-black text-emerald-300 text-base">{p.discountPrice}</span>
                      </div>
                      <span className="text-[10px] font-black text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full inline-block mt-1">
                        {Math.round(((p.price - p.discountPrice) / p.price) * 100)}% OFF
                      </span>
                    </div>
                  ) : (
                    <div className="py-2">
                      <span className="text-sm font-black text-slate-600">—</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {p.source !== 'django' ? (
                      <>
                        <button onClick={() => openEdit(p)} className="px-3 py-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-xl font-black text-xs shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40 hover:scale-105 transition-all flex items-center gap-1" title="Edit">
                          <HiPencil className="text-xs" /> Edit
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-black text-xs shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-1" title="Delete">
                          <HiTrash className="text-xs" /> Del
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 italic">Read-only (Django)</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
          })}
        </div>
      )}
    </div>
  );
}