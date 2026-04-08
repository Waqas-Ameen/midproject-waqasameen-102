import React from 'react';
import { useParams } from 'react-router-dom';

const CityPage = () => {
  const { city } = useParams();
  return <div>Ads in city: {city}</div>;
};

export default CityPage;