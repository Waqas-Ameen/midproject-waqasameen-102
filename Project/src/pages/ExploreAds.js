import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdCard from '../components/AdCard';

const ExploreAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('ranking');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = { search, category, city, sort, page, limit: 12 };
      const res = await axios.get('/api/ads', { params });
      setAds(res.data.ads);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAds();
  }, [search, category, city, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAds();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Explore Ads</h1>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search ads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="vehicles">Vehicles</option>
            <option value="real-estate">Real Estate</option>
            <option value="services">Services</option>
          </select>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="ranking">Best Match</option>
            <option value="date">Newest</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>

      {/* Ads Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
          
          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-100">{page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * 12 >= total}
                className="px-4 py-2 bg-gray-200 rounded-r hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExploreAds;