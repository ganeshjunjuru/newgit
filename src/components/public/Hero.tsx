import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { logger } from '@/utils/logger'; // ✅ import logger

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  imageSrc,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}) => {
  // ✅ Development-only log
  logger.log('Rendering Hero component with props:', {
    title,
    subtitle,
    imageSrc,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
  });

  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageSrc} 
          alt="College campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {subtitle}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {primaryButtonText && primaryButtonLink && (
              <Button 
                as={Link} 
                to={primaryButtonLink}
                variant="secondary"
                size="lg"
                className="font-semibold"
              >
                {primaryButtonText}
              </Button>
            )}
            
            {secondaryButtonText && secondaryButtonLink && (
              <Button
                as={Link}
                to={secondaryButtonLink}
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold"
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
