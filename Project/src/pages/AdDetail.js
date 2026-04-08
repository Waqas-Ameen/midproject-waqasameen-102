import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AdDetail = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await axios.get(`/api/ads/${id}`);
        setAd(res.data.ad);
      } catch (error) {
        console.error('Error fetching ad:', error);
      }
      setLoading(false);
    };
    fetchAd();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!ad) return <div>Ad not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {ad.normalized_thumbnails && ad.normalized_thumbnails.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {ad.normalized_thumbnails.map((url, index) => (
              <img key={index} src={url} alt={`Media ${index + 1}`} className="w-full h-64 object-cover rounded" />
            ))}
          </div>
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
          <p className="text-gray-600 mb-4">{ad.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Category:</strong> {ad.categories?.name}
            </div>
            <div>
              <strong>City:</strong> {ad.city}
            </div>
            <div>
              <strong>Package:</strong> {ad.packages?.name} (${ad.packages?.price})
            </div>
            <div>
              <strong>Expires:</strong> {new Date(ad.expiry_date).toLocaleDateString()}
            </div>
          </div>
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Contact Seller</h2>
            <p><strong>Name:</strong> {ad.users?.full_name}</p>
            <p><strong>Phone:</strong> {ad.users?.phone}</p>
            <button
              onClick={() => axios.post('/api/analytics/track', { ad_id: ad.id, event_type: 'click' })}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Contact Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;