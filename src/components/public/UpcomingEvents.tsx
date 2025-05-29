import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { useEventsStore } from '../../store/eventsStore';
import { Card, CardContent, CardImage, CardTitle } from '../ui/Card';

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to format time
const formatTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  };
  return new Date(dateString).toLocaleTimeString('en-US', options);
};

const UpcomingEvents: React.FC = () => {
  const { events, fetchEvents, isLoading } = useEventsStore();
  
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  // Get upcoming events (events with start date in the future)
  const upcomingEvents = events
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);
  
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Loading Events...</h2>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join us for these upcoming events and be part of our vibrant campus community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <Card key={event.id} hoverEffect className="h-full flex flex-col">
              <CardImage 
                src={event.image || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                alt={event.title} 
              />
              <CardContent className="flex flex-col flex-1">
                <div className="flex items-center text-primary-600 mb-3">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <CardTitle className="mb-2">{event.title}</CardTitle>
                <p className="text-gray-600 mb-4 flex-grow">
                  {event.description.length > 120 
                    ? `${event.description.substring(0, 120)}...` 
                    : event.description}
                </p>
                
                <div className="mt-auto space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2" />
                    <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <Link 
                  to={`/events/${event.id}`} 
                  className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Event Details <ArrowRight size={16} className="ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/events" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Events <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;