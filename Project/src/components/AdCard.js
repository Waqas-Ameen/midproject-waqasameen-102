import React from 'react';
import { Link } from 'react-router-dom';

const AdCard = ({ ad }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {ad.normalized_thumbnails && ad.normalized_thumbnails[0] && (
        <img src={ad.normalized_thumbnails[0]} alt={ad.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          <Link to={`/ad/${ad.id}`} className="text-blue-600 hover:text-blue-800">
            {ad.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-2">{ad.description.substring(0, 100)}...</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">{ad.city}</span>
          <span className="text-green-600 font-semibold">${ad.packages?.price}</span>
        </div>
        {ad.is_featured && (
          <span className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
            Featured
          </span>
        )}
      </div>
    </div>
  );
};

export default AdCard;