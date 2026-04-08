import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get('/api/ads'); // Modify to get approved ads
      setAds(res.data.ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleVerifyPayment = async (id) => {
    try {
      await axios.post(`/api/ads/${id}/verify-payment`);
      fetchAds();
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.post(`/api/ads/${id}/publish`);
      fetchAds();
    } catch (error) {
      console.error('Error publishing ad:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
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
                  {ad.status === 'approved' && (
                    <>
                      <button
                        onClick={() => handleVerifyPayment(ad.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Verify Payment
                      </button>
                      <button
                        onClick={() => handlePublish(ad.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Publish
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;