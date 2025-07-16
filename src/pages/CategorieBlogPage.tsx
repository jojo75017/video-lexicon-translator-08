
import React from 'react';
import { useParams } from 'react-router-dom';

const CategorieBlogPage = () => {
  const { categorieSlug } = useParams<{ categorieSlug: string }>();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold">Catégorie: {categorieSlug}</h1>
      <p className="mt-4">Cette page est en cours de développement.</p>
    </div>
  );
};

export default CategorieBlogPage;
