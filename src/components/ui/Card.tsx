import React, { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  className = '', 
  children, 
  hoverEffect = false 
}) => {
  const hoverStyles = hoverEffect 
    ? 'transition-transform duration-300 hover:shadow-lg hover:-translate-y-1'
    : '';
    
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export const CardImage: React.FC<CardImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'video' 
}) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  };
  
  return (
    <div className={`overflow-hidden ${aspectRatioClasses[aspectRatio]}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
};

export interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <h3 className={`text-xl font-bold mb-2 text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

export interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`text-gray-600 ${className}`}>
      {children}
    </div>
  );
};

export interface CardFooterProps {
  className?: string;
  children: ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export { Card };