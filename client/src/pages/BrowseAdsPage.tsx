import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const BrowseAdsPage: React.FC = () => {
  const { apiClient } = useAuth();
  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAds = useCallback(async (searchQuery = '') => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/ads?search=${searchQuery}`);
      setAds(res.data.data || []);
    } catch (err) {
      console.error('Fetch ads failed', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAds(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, fetchAds]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">Filters</h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Search Keywords</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-blue-500"
                  placeholder="e.g. laptop, car..."
                />
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Explore Ads</h1>
              <span className="text-gray-500">{ads.length} results found</span>
            </div>

            {isLoading ? (
              <p className="text-gray-500">Loading ads...</p>
            ) : ads.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-lg shadow-sm text-gray-500">
                No ads found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad: any) => (
                  <Link key={ad.id} to={`/ads/${ad.slug}`} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      {ad.media && ad.media.length > 0 && (
                        <img src={ad.media[0].original_url} alt={ad.title} className="w-full h-full object-cover" />
                      )}
                      {ad.packages?.is_featured && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-blue-600 mb-1 font-medium">
                        {ad.categories?.name}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 truncate">
                        {ad.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {ad.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>📍 {ad.cities?.name}</span>
                        <span>
                          {new Date(ad.publish_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};