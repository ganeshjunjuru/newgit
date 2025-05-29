import React from 'react';
import { GalleryImage } from '../../types';

interface GalleryItemProps {
  image: GalleryImage;
  onClick: (image: GalleryImage) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image, onClick }) => {
  return (
    <div 
      className="relative overflow-hidden rounded-lg cursor-pointer group"
      onClick={() => onClick(image)}
    >
      <img 
        src={image.image} 
        alt={image.title}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-secondary-800 bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
        <div className="text-white text-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <h3 className="text-lg font-semibold">{image.title}</h3>
          <span className="text-sm text-gray-300">{image.category}</span>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;