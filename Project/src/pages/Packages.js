import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Packages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get('/api/packages');
      setPackages(res.data.packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Ad Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
            <p className="text-3xl font-bold text-green-600 mb-4">${pkg.price}</p>
            <p className="text-gray-600 mb-4">Duration: {pkg.duration_days} days</p>
            <ul className="text-sm text-gray-600 mb-4">
              {pkg.features && Object.entries(pkg.features).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Select Package
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;