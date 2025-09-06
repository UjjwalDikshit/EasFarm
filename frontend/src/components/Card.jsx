// src/components/Card.js
import React from 'react';

const Card = ({ title, description, imageUrl, ctaText, ctaLink }) => {
  return (
    <div className="card bg-base-100 shadow-xl h-full">
      <figure>
        <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end mt-4">
          <a href={ctaLink} className="btn btn-primary">{ctaText}</a>
        </div>
      </div>
    </div>
  );
};

export default Card;