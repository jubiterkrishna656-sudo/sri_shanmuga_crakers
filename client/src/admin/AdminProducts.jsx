import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiSparkles, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { productAPI } from '../utils/api';

const defaultCategories = ['Sparklers', 'Flower Pots', 'Rockets', 'Bombs', 'Gift Boxes', 'Kids Crackers', 'Combo Packs'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Sparklers', price: '', discountPrice: '', stock: '', description: '', featured: false, imageUrl: '', videoUrl: '' });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    productAPI.getAll().then(res => { setProducts(res.data); setLoading(false); });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', category: 'Sparklers', price: '', discountPrice: '', stock: '', description: '', featured: false, imageUrl: '', videoUrl: '' });
    setImage(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({ name: product.name, category: product.category, price: product.price, discountPrice: product.discountPrice || '', stock: product.stock, description: product.description || '', featured: product.featured || false, imageUrl: product.imageUrl || '', videoUrl: product.videoUrl || '' });
    setImage(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name and price are required');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('price', form.price);
      fd.append('discountPrice', form.discountPrice || 0);
      fd.append('stock', form.stock || 0);
      fd.append('description', form.description || '');
      fd.append('featured', form.featured);
      fd.append('imageUrl', form.imageUrl || '');
      fd.append('videoUrl', form.videoUrl || '');
      if (image) fd.append('image', image);

      if (editing) {
        await productAPI.update(editing, fd);
        toast.success('Product updated!');
      } else {
        await productAPI.create(fd);
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-green-800">Products</h1>
        <button onClick={openCreate} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition flex items-center space-x-2">
          <HiPlus /> <span>Add Product</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-green-400 hover:text-green-600"><HiX className="text-2xl" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Product Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500">
                  {defaultCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Discount Price</label>
                  <input type="number" value={form.discountPrice} onChange={(e) => setForm({...form, discountPrice: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
                    <span className="text-sm font-medium text-green-700">Featured</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 h-24 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Product Image URL</label>
                <input type="url" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} placeholder="https://example.com/image.jpg" className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Upload Image File</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">YouTube Video Link</label>
                <input type="url" value={form.videoUrl} onChange={(e) => setForm({...form, videoUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." className="w-full border border-green-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50">
                {submitting ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-green-100 rounded-xl"></div>)}</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <HiSparkles className="text-5xl text-green-300 mx-auto mb-4" />
          <p className="text-green-500 font-semibold">No products yet</p>
          <p className="text-green-400 text-sm">Click "Add Product" to create your first product</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Image</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Category</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Price</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Stock</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-t border-green-100 hover:bg-orange-50 transition">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover rounded-xl" /> : p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" /> : <HiSparkles className="text-orange-300" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-green-800">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-green-500">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-orange-500">₹{p.discountPrice || p.price}</span>
                      {p.discountPrice > 0 && <span className="text-xs text-green-400 line-through ml-1">₹{p.price}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEdit(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><HiPencil /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><HiTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
