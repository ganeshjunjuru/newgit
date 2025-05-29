import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { useNewsStore } from '../../store/newsStore';
import { Card, CardContent, CardImage, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const NewsHighlights: React.FC = () => {
  const { news, fetchNews, isLoading } = useNewsStore();
  
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  // Get the latest 3 news items
  const latestNews = [...news]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Loading News...</h2>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold mb-4">Latest News & Announcements</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest happenings, achievements, and announcements from our college community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.map((item) => (
            <Card key={item.id} hoverEffect className="h-full flex flex-col">
              <CardImage 
                src={item.image} 
                alt={item.title} 
              />
              <CardContent className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="primary">
                    {item.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {formatDate(item.publishedAt)}
                  </div>
                </div>
                <CardTitle className="mb-2">{item.title}</CardTitle>
                <p className="text-gray-600 mb-4 flex-grow">
                  {item.excerpt}
                </p>
                <Link 
                  to={`/news/${item.slug}`} 
                  className="mt-auto inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More <ArrowRight size={16} className="ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/news" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View All News <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsHighlights;