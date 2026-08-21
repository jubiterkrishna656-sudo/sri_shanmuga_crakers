import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiX, HiSparkles, HiArrowLeft, HiFilter, HiViewGrid } from 'react-icons/hi';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const catColors = [
  'from-yellow-400 to-amber-500',
  'from-gray-800 to-gray-900',
  'from-gray-600 to-gray-700',
  'from-yellow-500 to-yellow-600',
  'from-gray-700 to-gray-800',
  'from-amber-400 to-yellow-500',
  'from-gray-500 to-gray-600',
  'from-yellow-300 to-amber-400',
  'from-gray-900 to-black',
  'from-amber-500 to-orange-500',
  'from-gray-600 to-gray-800',
  'from-yellow-400 to-yellow-500',
];

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
      if (res.data?.length) {
        const names = res.data.map(c => typeof c === 'string' ? c : c.name);
        setCategories(names);
      }
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/50 via-white to-white">
      <Seo
        title={categoryFilter ? `${categoryFilter} Crackers` : 'Buy Crackers Online'}
        description={`${categoryFilter ? `Shop premium ${categoryFilter.toLowerCase()} online at factory prices.` : 'Shop premium crackers online at factory prices.'} Certified quality fireworks from Sri Shanmuga Grand Crackers, Sivakasi.`}
      />

      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-yellow-400 rounded-full blur-[100px]" />
          <div className="absolute -bottom-16 right-10 w-72 h-72 bg-yellow-300 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-400 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-xs mb-4 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all backdrop-blur-sm">
            <HiArrowLeft /> Home
          </Link>
          <div className="text-center">
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block text-4xl mb-2">🧨</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-black text-white mb-1">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400">Crackers</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-sm">
              Explore our full collection of safe & premium fireworks
            </motion.p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Search + Categories */}
      <div className="sticky top-[100px] md:top-[120px] z-20 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {/* Search */}
          <div className="relative max-w-lg mx-auto mb-3">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="searchInput"
              type="text"
              onChange={handleSearch}
              defaultValue={searchParam}
              placeholder="Search crackers..."
              className="w-full pl-11 pr-10 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:bg-white focus:shadow-lg transition-all border border-gray-200"
            />
            {search && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all">
                <HiX className="text-xs text-gray-500" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar md:flex-wrap md:justify-center md:overflow-visible">
            <button
              onClick={() => { if (categoryFilter) clearCategory(); }}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 ${
                !categoryFilter
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <HiViewGrid className="text-xs" /> All
            </button>
            {categories.map((cat, i) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    active
                      ? `bg-gradient-to-r ${catColors[i % catColors.length]} text-white shadow-md`
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Info Bar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            {categoryFilter && (
              <button onClick={clearCategory} className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gray-700 mb-0.5 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-full transition-all">
                <HiX className="text-[10px]" /> Clear filter
              </button>
            )}
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              {categoryFilter ? (
                <>
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  {categoryFilter}
                </>
              ) : 'All Products'}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200">
            <HiFilter className="text-xs" /> {total} items
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-40 bg-gradient-to-br from-yellow-100 to-amber-50" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                  <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-5 bg-gray-200 rounded-full w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-[1.5rem] bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center shadow-lg shadow-yellow-200/50">
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1">No products found</h3>
            <p className="text-gray-400 text-sm mb-5">Try a different category or search term</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg hover:bg-gray-800 transition-all" onClick={clearCategory}>
              <HiSparkles className="text-base" /> View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                p === page
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-800'
              }`}
            >
                {p}
              </button>
            ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-black text-white shadow-md hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
