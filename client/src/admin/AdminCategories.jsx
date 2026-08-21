import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiSearch, HiX, HiCheck } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import { adminApi } from '../utils/adminApi';

const emojiOptions = ['🎆', '🎇', '🚀', '💥', '🎁', '🧨', '📦', '🔥', '✨', '⭐', '🎊', '🎯', '💎', '🌟', '💫', '🏮', '🪔'];
const colorOptions = [
  'from-yellow-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-blue-400 to-indigo-500',
  'from-red-500 to-rose-600',
  'from-green-400 to-emerald-500',
  'from-cyan-400 to-sky-500',
  'from-purple-400 to-violet-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
  'from-fuchsia-400 to-pink-500',
];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', emoji: '🎆', color: colorOptions[0] });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.getCategories();
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', emoji: '🎆', color: colorOptions[0] });
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditing(cat._id);
    setForm({ name: cat.name, emoji: cat.emoji, color: cat.color });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Category name is required');

    try {
      if (editing) {
        await adminApi.updateCategory(editing, { name: form.name.trim(), emoji: form.emoji, color: form.color });
        toast.success('Category updated!');
      } else {
        await adminApi.createCategory({ name: form.name.trim(), emoji: form.emoji, color: form.color });
        toast.success('Category added!');
      }
      await fetchCategories();
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Category deleted!');
      await fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} total categories</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all">
          <HiPlus className="text-lg" /> Add Category
        </button>
      </div>

      <div className="relative mb-6">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg truncate">{cat.name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{cat.color}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="w-9 h-9 rounded-xl bg-slate-700/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all">
                    <HiPencil className="text-sm" />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="w-9 h-9 rounded-xl bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all">
                    <HiTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No categories found</p>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                  <HiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Category Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sparklers"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {emojiOptions.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setForm({ ...form, emoji: em })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                          form.emoji === em
                            ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-110'
                            : 'bg-slate-800 border border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Color Theme</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((cl) => (
                      <button
                        key={cl}
                        type="button"
                        onClick={() => setForm({ ...form, color: cl })}
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cl} transition-all ${
                          form.color === cl ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-5 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all">
                    <HiCheck className="text-lg" />
                    {editing ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
