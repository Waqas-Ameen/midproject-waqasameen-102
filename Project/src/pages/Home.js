import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdCard from '../components/AdCard';

const Home = () => {
  const [featuredAds, setFeaturedAds] = useState([]);
  const [recentAds, setRecentAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          axios.get('/api/ads?limit=4&sort=ranking'),
          axios.get('/api/ads?limit=8&sort=date')
        ]);
        setFeaturedAds(featuredRes.data.ads);
        setRecentAds(recentRes.data.ads);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };
    fetchAds();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find What You Need</h1>
          <p className="text-xl mb-8">Browse sponsored listings from trusted sellers</p>
          <Link to="/explore" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Explore Ads
          </Link>
        </div>
      </section>

      {/* Featured Ads */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Ads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAds.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Ads */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Recent Ads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentAds.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/explore" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
              View All Ads
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;