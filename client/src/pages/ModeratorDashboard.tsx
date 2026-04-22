import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ReviewAdModal } from '../components/ReviewAdModal';

export const ModeratorDashboard: React.FC = () => {
  const { user, logout, apiClient } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<any>(null);

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/moderator/queue');
      setQueue(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch queue', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleReviewed = () => {
    setSelectedAd(null);
    fetchQueue(); // refresh queue
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Moderator Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Reviewing as {user?.name}</span>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Review Queue</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {queue.length} Pending
            </span>
          </div>

          <div className="p-0">
            {isLoading ? (
              <p className="text-center py-12 text-gray-500">Loading queue...</p>
            ) : queue.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-2">The queue is empty! 🎉</p>
                <p className="text-gray-400">Great job catching up with all the reviews.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {queue.map(ad => (
                  <div key={ad.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                            Under Review
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {ad.description}
                        </p>

                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>📍 {ad.cities?.name}</span>
                          <span>🏷️ {ad.categories?.name}</span>
                          <span>👤 {ad.users?.name}</span>
                          <span>🕒 {new Date(ad.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="ml-6 flex items-center">
                        <button
                          onClick={() => setSelectedAd(ad)}
                          className="px-5 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 font-medium whitespace-nowrap"
                        >
                          Review Content
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedAd && (
        <ReviewAdModal
          ad={selectedAd}
          onClose={() => setSelectedAd(null)}
          onReviewed={handleReviewed}
        />
      )}
    </div>
  );
};