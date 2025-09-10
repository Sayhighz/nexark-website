import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useServers } from '../hooks/useServers';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import StarBackground from '../components/site/StarBackground';
import Navbar from '../components/site/Navbar';
import { SpotlightCard } from '../components/ui/SpotlightCard';

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
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <Navbar />
        <StarBackground />
        <div className="relative z-20 pt-20">
          <Loading size="lg" message="Loading servers..." />
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
                ARK Servers
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Choose your preferred server to start your ARK adventure
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
            <ErrorMessage error={error} onRetry={getServers} />
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {['all', 'x25', 'x100', 'pvp', 'pve'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                }`}
              >
                {category === 'all' ? 'All Servers' : category.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Servers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredServers.map((server, index) => (
              <SpotlightCard
                key={server.id}
                hsl
                hslMin={200 + (index * 20)}
                hslMax={280 + (index * 10)}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5 hover:bg-white/15 transition-all duration-300"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {server.name || server.server_name}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">{server.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rate:</span>
                      <span className="font-medium text-blue-400">{server.rate || 'x1'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Map:</span>
                      <span className="font-medium text-green-400">{server.map || 'The Island'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Players:</span>
                      <span className="font-medium text-gray-300">{server.current_players || 0}/{server.max_players || 70}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-medium ${server.is_online ? 'text-green-400' : 'text-red-400'}`}>
                        {server.is_online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/servers/${server.server_id || server.id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center block transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Empty State */}
          {filteredServers.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖥️</div>
              <h3 className="text-lg font-medium text-white mb-2">
                No servers found
              </h3>
              <p className="text-gray-400">
                Try selecting a different category or check back later.
              </p>
            </div>
          )}

          {/* Server Info */}
          <SpotlightCard
            hsl
            hslMin={180}
            hslMax={240}
            className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
          >
            <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-6">
                Server Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-600/30">
                  <h4 className="font-bold text-blue-400 text-lg mb-2">X25 Servers</h4>
                  <p className="text-blue-300">25x breeding, taming, and harvesting rates</p>
                </div>
                <div className="bg-green-600/20 rounded-lg p-4 border border-green-600/30">
                  <h4 className="font-bold text-green-400 text-lg mb-2">X100 Servers</h4>
                  <p className="text-green-300">100x breeding, taming, and harvesting rates</p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Servers;