import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiX, HiSparkles, HiArrowLeft } from 'react-icons/hi';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const defaultCategories = ['Sparklers', 'Flower Pots', 'Rockets', 'Bombs', 'Gift Boxes', 'Kids Crackers', 'Combo Packs'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categories, setCategories] = useState(defaultCategories);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const categoryFilter = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const timer = useRef(null);

  useEffect(() => {
    productAPI.getCategories().then(res => {
      if (res.data?.length) setCategories(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    params.page = page;
    params.limit = 12;
    productAPI.getAll(params).then(res => {
      const data = res.data;
      setProducts(Array.isArray(data) ? data : data.products || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total ?? (Array.isArray(data) ? data.length : (data.products || []).length));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, categoryFilter, page]);

  const goToPage = useCallback((p) => {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete('page');
    else next.set('page', String(p));
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!loading && products.length === 0 && page > 1) {
      goToPage(1);
    }
  }, [products, page, loading, goToPage]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat && cat !== categoryFilter) next.set('category', cat);
    else if (cat === categoryFilter) next.delete('category');
    next.delete('page');
    setSearchParams(next);
  };

  const clearCategory = () => setSearchParams({});

  const handleSearch = (e) => {
    const val = e.target.value;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSearch(val);
      const next = new URLSearchParams(searchParams);
      next.delete('page');
      setSearchParams(next);
    }, 300);
  };

  const clearSearch = () => {
    setSearch('');
    if (searchParam) {
      const next = new URLSearchParams(searchParams);
      next.delete('search');
      next.delete('page');
      setSearchParams(next);
    }
    document.getElementById('searchInput').value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/70 via-white to-white">
      <Seo
        title={categoryFilter ? `${categoryFilter} Crackers` : 'Buy Crackers Online'}
        description={`${categoryFilter ? `Shop premium ${categoryFilter.toLowerCase()} online at factory prices.` : 'Shop premium crackers online at factory prices.'} Certified quality fireworks from Sri Shanmuga Grand Crackers, Sivakasi.`}
      />
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#1a0b2e] via-[#3b0d3f] to-[#5c0f2e] overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-yellow-400 rounded-full blur-[100px]" />
          <div className="absolute -bottom-16 right-10 w-72 h-72 bg-amber-400 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 relative z-10 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block text-5xl mb-3">🧨</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-black text-white mb-2">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400">Crackers</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/70 text-sm md:text-base">
            Explore our full collection of safe & premium fireworks
          </motion.p>
        </div>
      </div>

      {/* Search + categories */}
      <div className="sticky top-16 md:top-20 z-20 bg-white/85 backdrop-blur-lg border-b border-yellow-100/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="relative max-w-xl mx-auto">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 text-lg" />
            <input
              id="searchInput"
              type="text"
              onChange={handleSearch}
              placeholder="Search crackers..."
              className="w-full pl-11 pr-10 py-3 bg-yellow-50/60 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:bg-white transition-all"
            />
            {search && (
              <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <HiX className="text-lg" />
              </button>
            )}
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar md:flex-wrap md:justify-center md:overflow-visible">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  categoryFilter === cat
                    ? 'bg-yellow-400 text-slate-900 shadow-md shadow-yellow-500/40 ring-2 ring-yellow-400/50'
                    : 'bg-white text-gray-600 border border-yellow-200/70 hover:border-yellow-400 hover:text-yellow-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            {categoryFilter && (
              <button onClick={clearCategory} className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700 mb-1">
                <HiArrowLeft /> Clear filter
              </button>
            )}
            <h2 className="text-xl md:text-2xl font-black text-gray-900">
              {categoryFilter || 'All Products'}
            </h2>
          </div>
          <span className="chip bg-yellow-100 text-yellow-700">{total} items</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="card h-72 animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800">No products found</h3>
            <p className="text-gray-400 text-sm mt-1">Try a different category or search</p>
            <Link to="/products" className="btn-primary px-8 py-3 mt-6" onClick={clearCategory}>
              <HiSparkles /> View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-5 py-2.5 rounded-full text-sm font-bold border border-yellow-200 text-yellow-700 hover:bg-yellow-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            <span className="text-sm font-bold text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="px-5 py-2.5 rounded-full text-sm font-bold bg-yellow-400 text-slate-900 shadow-md shadow-yellow-500/30 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
