import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <HiSparkles className="text-orange-400 text-2xl" />
              <span className="text-xl font-bold">Shanmuga Crackers</span>
            </div>
            <p className="text-green-400 text-sm">Your trusted destination for premium quality crackers. Celebrate every festival with safety and joy.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-green-400 hover:text-orange-400 text-sm">Home</Link>
              <Link to="/products" className="block text-green-400 hover:text-orange-400 text-sm">Products</Link>
              <Link to="/cart" className="block text-green-400 hover:text-orange-400 text-sm">Cart</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <div className="space-y-2 text-sm text-green-400">
              <p>Sparklers</p>
              <p>Flower Pots</p>
              <p>Rockets</p>
              <p>Gift Boxes</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-green-400">
              <p>📍 Sivakasi, Tamil Nadu</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ info@shanmugacrackers.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-500 text-sm">
          <p>© {new Date().getFullYear()} Shanmuga Crackers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
