import React from 'react';
import { GraduationCap } from 'lucide-react';

interface LogoProps {
  isWhite?: boolean;
  isAdmin?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isWhite = false, isAdmin = false }) => {
  return (
    <div className="flex items-center">
      <div className={`flex items-center justify-center ${isAdmin ? 'bg-primary-700' : 'bg-primary-700'} w-10 h-10 rounded-md`}>
        <GraduationCap size={24} className="text-white" />
      </div>
      <div className="ml-2 flex flex-col">
        <span className={`font-serif font-bold text-lg leading-tight ${isWhite ? 'text-white' : 'text-primary-700'}`}>
          Sreepaada
        </span>
        <span className={`text-xs font-medium ${isWhite ? 'text-gray-300' : 'text-gray-600'}`}>
          {isAdmin ? 'Admin Panel' : 'Degree College'}
        </span>
      </div>
    </div>
  );
};

export default Logo;