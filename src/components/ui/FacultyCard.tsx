import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { Faculty } from '../../types';

interface FacultyCardProps {
  faculty: Faculty;
}

const FacultyCard: React.FC<FacultyCardProps> = ({ faculty }) => {
  return (
    <div className="card h-full flex flex-col group">
      <div className="relative overflow-hidden">
        <img 
          src={faculty.image} 
          alt={faculty.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-primary-700 font-medium mb-1">{faculty.department}</span>
        <h3 className="text-xl font-bold mb-1 group-hover:text-primary-700 transition-colors">
          {faculty.name}
        </h3>
        <p className="text-gray-600 mb-2">{faculty.position}</p>
        <p className="text-gray-500 mb-4">{faculty.qualification}</p>
        <div className="flex items-center text-gray-600 mb-4">
          <Mail size={16} className="mr-2 text-primary-700" />
          <a href={`mailto:${faculty.email}`} className="hover:text-primary-700 transition-colors">
            {faculty.email}
          </a>
        </div>
        <Link 
          to={`/faculty/${faculty.id}`}
          className="flex items-center text-primary-700 font-medium hover:text-primary-800 transition-colors mt-auto"
        >
          View Profile <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default FacultyCard;