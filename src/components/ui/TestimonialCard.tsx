import React from 'react';
import { Quote } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="absolute -top-4 left-6 bg-primary-700 rounded-full p-2">
        <Quote size={20} className="text-white" />
      </div>
      <div className="pt-6 pb-4">
        <p className="text-gray-600 italic">"{testimonial.quote}"</p>
      </div>
      <div className="flex items-center mt-4">
        <img 
          src={testimonial.image} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.position}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;