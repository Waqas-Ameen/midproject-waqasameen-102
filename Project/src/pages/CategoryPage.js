import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams();
  return <div>Ads in category: {slug}</div>;
};

export default CategoryPage;