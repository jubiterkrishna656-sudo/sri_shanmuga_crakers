import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiX, HiCube, HiPlusCircle, HiSearch, HiChevronDown, HiCheck, HiPhotograph } from 'react-icons/hi';
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
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverCategories, setServerCategories] = useState([]);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
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
    setImagePreview(null);
    setShowNewCatInput(false);
    setNewCategory('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ productNumber: p.productNumber || '', name: p.name, category: p.category, price: p.price, discountPrice: p.discountPrice || '', stock: p.stock, description: p.description || '', featured: p.featured || false, imageUrl: p.imageUrl || '', videoUrl: p.videoUrl || '' });
    setImage(null);
    setImagePreview(p.image || p.imageUrl || null);
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
        color: 'from-gray-400 to-gray-500'
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.productNumber && p.productNumber.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <HiCube className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Products</h1>
            <p className="text-xs text-slate-400">{products.length} total</p>
          </div>
        </div>
        <button onClick={openCreate} className="bg-white text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 active:scale-[0.97] transition-all flex items-center gap-2 shadow-lg shadow-white/10">
          <HiPlusCircle className="text-base" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-600 transition-all" />
        </div>
        <div className="relative">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="appearance-none w-full sm:w-48 pl-4 pr-9 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer">
            <option value="All">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="bg-slate-800 rounded-xl h-20 animate-pulse border border-slate-700" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
          <HiCube className="text-4xl text-slate-600 mx-auto mb-3" />
          <p className="text-white font-semibold">{search || filterCategory !== 'All' ? 'No matches found' : 'No products yet'}</p>
          <p className="text-slate-400 text-sm mt-1">{search || filterCategory !== 'All' ? 'Try a different search or filter' : 'Click "Add Product" to create one'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Product</div>
            <div className="col-span-2 text-center">Stock</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Offer</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {filtered.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all p-4">
              <div className="grid grid-cols-12 gap-3 items-center">
                {/* Product Info */}
                <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-slate-600">
                    {p.image || p.imageUrl ? (
                      <img src={p.image || p.imageUrl} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <HiCube className="text-slate-500 text-lg" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-white text-sm truncate">{p.name}</p>
                      {p.featured && <span className="text-[9px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-md shrink-0">Featured</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400 font-mono">{p.productNumber || `#${i + 1}`}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400">{p.category}</span>
                    </div>
                  </div>
                </div>

                {/* Stock */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-400' : p.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  <span className={`text-sm font-bold ${p.stock > 10 ? 'text-green-300' : p.stock > 0 ? 'text-yellow-300' : 'text-red-300'}`}>
                    {p.stock > 0 ? p.stock : 'Out'}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-start md:justify-center">
                  <span className="text-sm font-black text-white">Rs. {p.price}</span>
                </div>

                {/* Offer */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-start md:justify-center">
                  {p.discountPrice > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-300">Rs. {p.discountPrice}</span>
                      <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-md">
                        {Math.round(((p.price - p.discountPrice) / p.price) * 100)}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-600 text-sm">—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-end md:justify-center gap-2">
                  {p.source !== 'django' ? (
                    <>
                      <button onClick={() => openEdit(p)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all" title="Edit">
                        <HiPencil className="text-xs" /> Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all" title="Delete">
                        <HiTrash className="text-xs" /> Del
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">Read-only</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editing ? 'bg-yellow-400/10 border border-yellow-400/30' : 'bg-white/5 border border-slate-600'}`}>
                  {editing ? <HiPencil className="text-yellow-400" /> : <HiPlusCircle className="text-white" />}
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-xs text-slate-400">{editing ? 'Update product details' : 'Fill in the details below'}</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-all">
                <HiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Basic Info */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Basic Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Product ID</label>
                    <input type="text" value={form.productNumber} onChange={(e) => setForm({...form, productNumber: e.target.value})}
                      placeholder="Auto generate" maxLength={10}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-600 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Name <span className="text-red-400">*</span></label>
                    <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Product name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-slate-600 transition-all" required />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category</h3>
                {showNewCatInput ? (
                  <div className="flex gap-2">
                    <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category name"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" autoFocus />
                    <button type="button" onClick={addCategory}
                      className="px-4 py-2.5 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-1.5">
                      <HiCheck className="text-sm" /> Add
                    </button>
                    <button type="button" onClick={() => { setShowNewCatInput(false); setNewCategory(''); }}
                      className="px-3 py-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-sm transition-all">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                        className="appearance-none w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer">
                        {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => { setShowNewCatInput(true); setNewCategory(''); }}
                      className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-all" title="Add new category">
                      <HiPlusCircle className="text-lg" />
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pricing & Stock</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Price (Rs.) <span className="text-red-400">*</span></label>
                    <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}
                      placeholder="0" min="0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Offer Price</label>
                    <input type="number" value={form.discountPrice} onChange={(e) => setForm({...form, discountPrice: e.target.value})}
                      placeholder="0" min="0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Stock</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})}
                      placeholder="0" min="0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
                  </div>
                </div>
                {form.discountPrice > 0 && form.price > 0 && form.discountPrice < form.price && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-green-400/10 text-green-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                    <HiCheck className="text-sm" />
                    {Math.round(((form.price - form.discountPrice) / form.price) * 100)}% OFF — Customers save Rs. {form.price - form.discountPrice}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Write a short product description..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all h-24 resize-none" />
                <div className="mt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})}
                      className="w-4 h-4 text-yellow-400 rounded bg-slate-800 border-slate-600 focus:ring-yellow-400/50" />
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Mark as featured product</span>
                  </label>
                </div>
              </div>

              {/* Image */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Image</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Image URL</label>
                    <input type="url" value={form.imageUrl} onChange={(e) => { setForm({...form, imageUrl: e.target.value}); setImagePreview(e.target.value || imagePreview); }}
                      placeholder="https://..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">YouTube Video</label>
                    <input type="url" value={form.videoUrl} onChange={(e) => setForm({...form, videoUrl: e.target.value})}
                      placeholder="https://youtube.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Upload Image</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-slate-800 border border-dashed border-slate-600 rounded-lg px-4 py-3 cursor-pointer hover:border-slate-500 transition-all">
                      <HiPhotograph className="text-slate-400" />
                      <span className="text-sm text-slate-400">{image ? image.name : 'Choose image file'}</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-600 shrink-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-[2] py-3 rounded-xl font-black text-sm bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10">
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Saving...
                    </>
                  ) : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
