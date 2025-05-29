import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ArrowRight
} from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="mb-4">
              <Logo isWhite />
            </div>
            <p className="text-gray-300 mb-6">
              Providing quality education since 1985. Empowering students with knowledge, skills, and values to excel in their chosen fields.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { path: '/about', label: 'About Us' },
                { path: '/courses', label: 'Courses' },
                { path: '/faculty', label: 'Faculty' },
                { path: '/events', label: 'Events' },
                { path: '/gallery', label: 'Gallery' },
                { path: '/contact', label: 'Contact' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <ArrowRight size={16} className="mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin size={20} className="mr-3 flex-shrink-0 text-accent-500" />
                <span className="text-gray-300">123 College Road, Education City, State - 500001</span>
              </li>
              <li className="flex">
                <Phone size={20} className="mr-3 flex-shrink-0 text-accent-500" />
                <span className="text-gray-300">+91 1234567890</span>
              </li>
              <li className="flex">
                <Mail size={20} className="mr-3 flex-shrink-0 text-accent-500" />
                <span className="text-gray-300">info@sreepaadacollege.edu</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Subscribe</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to get updates on events and activities.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="px-4 py-2 bg-secondary-700 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button 
                type="submit" 
                className="bg-accent-500 text-secondary-800 font-medium px-4 py-2 rounded hover:bg-accent-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="bg-secondary-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Sreepaada Degree College. All rights reserved.
            </p>
            <div className="mt-2 md:mt-0">
              <ul className="flex space-x-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;