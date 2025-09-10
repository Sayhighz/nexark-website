import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import { useAuthContext } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import StarBackground from '../components/site/StarBackground';
import Navbar from '../components/site/Navbar';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const Shop = () => {
  const { categories, items, getCategories, getItems, addToCart, loading, error } = useShop();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getCategories();
    getItems();
  }, [getCategories, getItems]);

  const filteredItems = items.filter(item => {
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    const matchesSearch = !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (item) => {
    // Require login only when attempting to purchase/add to cart
    if (!isAuthenticated) {
      navigate('/login', { replace: false, state: { from: location } });
      return;
    }
    try {
      await addToCart({
        item_id: item.id,
        server_id: 1, // TODO: allow selecting target server before purchase
        quantity: 1,
      });
      alert('Item added to cart successfully!');
    } catch {
      alert('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <Navbar />
        <StarBackground />
        <div className="relative z-20 pt-20">
          <Loading size="lg" message="Loading shop..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />
      <StarBackground />
      
      {/* Hero Section */}
      <div className="relative pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
        <div
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.discordapp.com/attachments/820713052684419082/1002956012493471884/Server_Banner.png')`
          }}
        >
          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-5xl font-bold mb-4 text-white">
                Shop
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Purchase items and boosts for your ARK adventure
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          {/* Error Message */}
          {error && (
            <ErrorMessage error={error} onRetry={() => {
              getCategories();
              getItems();
            }} />
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredItems.map((item, index) => (
              <SpotlightCard
                key={item.id}
                hsl
                hslMin={200 + (index * 15)}
                hslMax={280 + (index * 10)}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5 hover:bg-white/15 transition-all duration-300"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
                <div className="relative">
                  <div className="aspect-w-1 aspect-h-1 mb-4">
                    <img
                      src={item.image_url || '/placeholder-item.png'}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">
                        ฿{item.price}
                      </span>
                      <span className="text-sm text-blue-400 bg-blue-600/20 px-2 py-1 rounded">
                        {item.category?.name}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-medium text-white mb-2">
                No items found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or category filter.
              </p>
            </div>
          )}

          {/* Shop Info */}
          <SpotlightCard
            hsl
            hslMin={120}
            hslMax={160}
            className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
          >
            <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-4">
                💡 Shopping Tips
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>All purchases are processed instantly</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Items are delivered directly to your selected server</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Use credits from your account balance</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Contact support if you need help with purchases</li>
              </ul>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Shop;