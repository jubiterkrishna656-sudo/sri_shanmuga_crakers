import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingCart, HiStar, HiFilter, HiSparkles } from 'react-icons/hi';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';

const categories = ['all', 'Sparklers', 'Flower Pots', 'Rockets', 'Bombs', 'Gift Boxes', 'Kids Crackers', 'Combo Packs'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const activeCat = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    productAPI.getAll({ category: activeCat, search }).then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeCat, search]);

  const handleCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) params.set('search', e.target.value);
    else params.delete('search');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-800">Our <span className="text-orange-500">Products</span></h1>
          <p className="text-green-500">{products.length} products found</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <input type="text" value={search} onChange={handleSearch} placeholder="Search crackers..." className="border border-green-300 rounded-full px-4 py-2 pl-10 focus:outline-none focus:border-orange-500 w-48 md:w-64" />
            <svg className="absolute left-3 top-3 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="md:hidden bg-orange-500 text-white p-2 rounded-full"><HiFilter className="text-xl" /></button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className={`md:block w-48 shrink-0 ${showFilter ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-2xl p-4 shadow-md sticky top-20">
            <h3 className="font-bold text-green-800 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => handleCategory(cat)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${activeCat === cat ? 'bg-orange-500 text-white' : 'text-green-600 hover:bg-orange-50'}`}>
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse"></div>)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <HiSparkles className="text-6xl text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-500">No products found</h3>
              <p className="text-green-400">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all group">
                  <Link to={`/products/${product._id}`}>
                    <div className="h-40 md:h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center overflow-hidden relative">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <HiSparkles className="text-5xl text-orange-300" />
                      )}
                      {product.discountPrice > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{Math.round((1 - product.discountPrice/product.price) * 100)}% OFF</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <p className="text-xs text-orange-500 font-medium">{product.category}</p>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-semibold text-green-800 text-sm line-clamp-1 hover:text-orange-500">{product.name}</h3>
                    </Link>
                    <div className="flex items-center space-x-1 my-1">
                      {[1,2,3,4,5].map(s => <HiStar key={s} className="text-yellow-400 text-xs" />)}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        {product.discountPrice > 0 ? (
                          <><span className="text-orange-500 font-bold">₹{product.discountPrice}</span><span className="text-green-400 text-xs line-through ml-1">₹{product.price}</span></>
                        ) : (
                          <span className="text-orange-500 font-bold">₹{product.price}</span>
                        )}
                      </div>
                      <button onClick={() => addToCart(product._id)} disabled={product.stock <= 0} className={`p-1.5 rounded-full ${product.stock > 0 ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-green-200 text-green-400 cursor-not-allowed'} transition text-sm`}>
                        <HiShoppingCart />
                      </button>
                    </div>
                    {product.stock <= 0 && <p className="text-red-500 text-xs mt-1">Out of stock</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
