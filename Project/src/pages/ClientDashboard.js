import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    package_id: '',
    media_urls: [],
    city: ''
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      // Assuming we add a route for client's ads
      const res = await axios.get('/api/ads'); // Need to modify to get user's ads
      setAds(res.data.ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/ads', formData);
      setShowCreateForm(false);
      setFormData({ title: '', description: '', category_id: '', package_id: '', media_urls: [], city: '' });
      fetchAds();
    } catch (error) {
      console.error('Error creating ad:', error);
    }
  };

  const handleSubmitAd = async (id) => {
    try {
      await axios.post(`/api/ads/${id}/submit`, { payment_proof: { transaction_id: 'sample' } });
      fetchAds();
    } catch (error) {
      console.error('Error submitting ad:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Client Dashboard</h1>
      
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showCreateForm ? 'Cancel' : 'Create New Ad'}
      </button>

      {showCreateForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="px-3 py-2 border rounded"
              required
            />
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="px-3 py-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="cat1">Electronics</option>
              <option value="cat2">Vehicles</option>
            </select>
            <select
              value={formData.package_id}
              onChange={(e) => setFormData({...formData, package_id: e.target.value})}
              className="px-3 py-2 border rounded"
              required
            >
              <option value="">Select Package</option>
              <option value="pkg1">Basic</option>
              <option value="pkg2">Standard</option>
            </select>
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border rounded mt-4"
            rows="4"
            required
          />
          <input
            type="url"
            placeholder="Media URL"
            value={formData.media_urls[0] || ''}
            onChange={(e) => setFormData({...formData, media_urls: [e.target.value]})}
            className="w-full px-3 py-2 border rounded mt-4"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-4">
            Create Ad
          </button>
        </form>
      )}

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
                  {ad.status === 'draft' && (
                    <button
                      onClick={() => handleSubmitAd(ad.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Submit
                    </button>
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

export default ClientDashboard;