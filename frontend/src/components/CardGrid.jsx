// src/components/CardGrid.js
import React from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';

const CardGrid = () => {
  const { cards, loading, error } = useSelector((state) => state.home);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-xl h-full">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="card-body">
              <div className="h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mt-2"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading content: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          imageUrl={card.imageUrl}
          ctaText={card.ctaText}
          ctaLink={card.ctaLink}
        />
      ))}
    </div>
  );
};

export default CardGrid;