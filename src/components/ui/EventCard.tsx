import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="card flex flex-col md:flex-row h-full group">
      <div className="md:w-1/3 relative overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="md:w-2/3 p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-700 transition-colors">
          {event.title}
        </h3>
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-primary-700" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2 text-primary-700" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="text-gray-600">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default EventCard;