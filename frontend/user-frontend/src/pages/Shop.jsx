import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import { useAuthContext } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

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
    } catch (err) {
      alert('Failed to add item to cart');
    }
  };

  if (loading) {
    return <Loading size="lg" message="Loading shop..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
          <p className="mt-1 text-sm text-gray-600">
            Purchase items and boosts for your ARK adventure
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage error={error} onRetry={() => {
          getCategories();
          getItems();
        }} />
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              !selectedCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="card hover:shadow-lg transition-shadow">
            <div className="aspect-w-1 aspect-h-1 mb-4">
              <img
                src={item.image_url || '/placeholder-item.png'}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ฿{item.price}
                </span>
                <span className="text-sm text-gray-500">
                  {item.category?.name}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(item)}
                className="w-full btn-primary"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or category filter.
          </p>
        </div>
      )}

      {/* Shop Info */}
      <div className="card bg-green-50">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          💡 Shopping Tips
        </h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• All purchases are processed instantly</li>
          <li>• Items are delivered directly to your selected server</li>
          <li>• Use credits from your account balance</li>
          <li>• Contact support if you need help with purchases</li>
        </ul>
      </div>
    </div>
  );
};

export default Shop;