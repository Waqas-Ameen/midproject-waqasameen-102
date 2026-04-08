import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ModeratorDashboard = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      // Assuming a route for review queue
      const res = await axios.get('/api/ads'); // Modify to get submitted ads
      setAds(res.data.ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleReview = async (id, status, notes) => {
    try {
      await axios.post(`/api/ads/${id}/review`, { status, notes });
      fetchAds();
    } catch (error) {
      console.error('Error reviewing ad:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Moderator Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad.id} className="border-b">
                <td className="p-4">{ad.title}</td>
                <td className="p-4">{ad.status}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleReview(ad.id, 'approved', '')}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(ad.id, 'rejected', 'Rejected')}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModeratorDashboard;