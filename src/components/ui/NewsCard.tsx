import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { NewsItem } from '../../types';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
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
    <div className="card h-full flex flex-col group">
      <div className="relative overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar size={16} className="mr-2" />
          <span>{formatDate(news.date)}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-700 transition-colors">
          {news.title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow">
          {news.summary}
        </p>
        <Link 
          to={`/news/${news.id}`}
          className="flex items-center text-primary-700 font-medium hover:text-primary-800 transition-colors mt-auto"
        >
          Read More <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;