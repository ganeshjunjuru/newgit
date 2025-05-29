import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="card h-full flex flex-col group">
      <div className="relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-primary-700 text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded">
          {course.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Clock size={16} className="mr-2" />
          <span>{course.duration}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow">
          {course.description.length > 120 
            ? `${course.description.substring(0, 120)}...` 
            : course.description}
        </p>
        <Link 
          to={`/courses/${course.id}`}
          className="flex items-center text-primary-700 font-medium hover:text-primary-800 transition-colors mt-auto"
        >
          Learn More <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;