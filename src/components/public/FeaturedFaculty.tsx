import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { useFacultyStore } from '../../store/facultyStore';
import { Card, CardContent, CardTitle } from '../ui/Card';

const FeaturedFaculty: React.FC = () => {
  const { faculty, fetchFaculty, isLoading } = useFacultyStore();
  
  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);
  
  const featuredFaculty = faculty.filter(f => f.featured).slice(0, 4);
  
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Loading Faculty...</h2>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold mb-4">Meet Our Distinguished Faculty</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our professors are leaders in their fields, dedicated to academic excellence and student success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredFaculty.map((faculty) => (
            <Card key={faculty.id} hoverEffect>
              <div className="aspect-square overflow-hidden">
                <img 
                  src={faculty.image} 
                  alt={faculty.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent>
                <CardTitle>{faculty.name}</CardTitle>
                <p className="text-primary-700 font-medium mb-2">{faculty.title}</p>
                <p className="text-gray-600 text-sm mb-3">{faculty.department}</p>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Mail size={14} className="mr-2 text-primary-600" />
                  <a href={`mailto:${faculty.email}`} className="hover:text-primary-600 transition-colors">
                    {faculty.email}
                  </a>
                </div>
                
                <Link 
                  to={`/faculty/${faculty.id}`} 
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Profile <ArrowRight size={16} className="ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/faculty" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Faculty <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFaculty;