import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useServers } from '../hooks/useServers';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const Servers = () => {
  const { servers, getServers, loading, error } = useServers();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    getServers();
  }, [getServers]);

  const filteredServers = servers.filter(server => {
    if (selectedCategory === 'all') return true;
    return server.category === selectedCategory;
  });

  if (loading) {
    return <Loading size="lg" message="Loading servers..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ARK Servers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Choose your preferred server to start your ARK adventure
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage error={error} onRetry={getServers} />
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'x25', 'x100', 'pvp', 'pve'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Servers' : category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServers.map((server) => (
          <div key={server.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {server.name}
                </h3>
                <p className="text-sm text-gray-600">{server.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{server.rate || 'x1'}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Map:</span>
                <span className="font-medium">{server.map || 'The Island'}</span>
              </div>
            </div>

            <Link
              to={`/servers/${server.id}`}
              className="w-full btn-primary text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredServers.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖥️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No servers found
          </h3>
          <p className="text-gray-600">
            Try selecting a different category or check back later.
          </p>
        </div>
      )}

      {/* Server Info */}
      <div className="card bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Server Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800">X25 Servers</h4>
            <p className="text-blue-700">25x breeding, taming, and harvesting rates</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800">X100 Servers</h4>
            <p className="text-blue-700">100x breeding, taming, and harvesting rates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servers;