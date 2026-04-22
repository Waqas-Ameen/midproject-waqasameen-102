import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdDetailPage: React.FC = () => {
  const { slug } = useParams();
  const { apiClient } = useAuth();
  const [ad, setAd] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await apiClient.get(`/ads/${slug}`);
        setAd(res.data.data);
      } catch (err: any) {
        setError('Ad not found or is unavailable.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAd();
  }, [slug, apiClient]);

  if (isLoading) return <div className="text-center py-20 text-gray-600">Loading ad details...</div>;
  if (error || !ad) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
            <Link to="/explore" className="text-blue-600 hover:underline">&larr; Back to explore</Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {ad.media && ad.media.length > 0 && (
            <div className="h-96 bg-gray-900 flex items-center justify-center">
              <img src={ad.media[0].original_url} alt={ad.title} className="max-h-full max-w-full object-contain" />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-blue-600 font-medium mb-2">{ad.categories?.name} &bull; {ad.cities?.name}</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{ad.title}</h1>
                <div className="text-sm text-gray-500">
                  Posted on {new Date(ad.publish_at).toLocaleDateString()}
                </div>
              </div>
              {ad.packages?.is_featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold text-sm">
                  Featured Listing
                </span>
              )}
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
            </div>
            
            <div className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Seller Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="font-semibold text-lg text-gray-900">{ad.users?.name}</p>
                <p className="text-gray-600">Contact: {ad.users?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
