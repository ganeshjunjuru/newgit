import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom for navigation

// Define interfaces for better type safety
interface WebsiteUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  link?: string; // Optional: if the update links to a specific public page
}

interface PreviousWork {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., "Web Development", "Branding", "SEO"
  imageUrl?: string; // Optional image for the work
  link: string; // Link to the detailed case study/project page
}

const DashboardAdminPage: React.FC = () => {
  // Placeholder state for key metrics (you'd fetch these from backend)
  const [totalQueries, setTotalQueries] = useState(15);
  const [unreadQueries, setUnreadQueries] = useState(3);
  const [totalCourses, setTotalCourses] = useState(6);
  const [totalCirculars, setTotalCirculars] = useState(12);

  // State for latest website updates
  const [latestUpdates, setLatestUpdates] = useState<WebsiteUpdate[]>([]);

  // New state for previous works/portfolio items
  const [previousWorks, setPreviousWorks] = useState<PreviousWork[]>([]);

  // State for current date and time for the header
  const [currentDateTime, setCurrentDateTime] = useState('');

  // --- Data Fetching & Date/Time Update Placeholder ---
  useEffect(() => {
    // In a real application, you would fetch all dashboard data here:
    // fetch('/api/dashboard-metrics').then(res => res.json()).then(data => {
    //   setTotalQueries(data.totalQueries);
    //   setUnreadQueries(data.unreadQueries);
    //   setTotalCourses(data.totalCourses);
    //   setTotalCirculars(data.totalCirculars);
    // });

    // Simulate fetching latest updates
    const fetchedUpdates: WebsiteUpdate[] = [
      {
        id: '1',
        title: 'New Service: Career Counseling & Placement Assistance',
        description: 'We are thrilled to announce the launch of our enhanced career counseling and placement assistance program to help our students achieve their dream jobs!',
        date: 'May 20, 2025',
        link: '/services/career-counseling',
      },
      {
        id: '2',
        title: 'Admissions Open for 2025-26 Academic Year',
        description: 'Applications are now being accepted for all undergraduate and postgraduate programs. Apply early to secure your spot!',
        date: 'May 15, 2025',
        link: '/admissions',
      },
      {
        id: '3',
        title: 'Partnership with Tech Innovators Inc.',
        description: 'Our college has officially partnered with Tech Innovators Inc. to provide cutting-edge industry training and internship opportunities.',
        date: 'May 10, 2025',
        link: '/news/tech-partnership',
      },
    ];
    setLatestUpdates(fetchedUpdates);

    // Simulate fetching previous works
    // In a real app, this would be: fetch('/api/previous-works').then(...)
    const fetchedPreviousWorks: PreviousWork[] = [
      {
        id: 'pw1',
        title: 'E-commerce Platform for "ShopEase"',
        description: 'Developed a scalable e-commerce solution with integrated payment gateways and inventory management for a retail startup.',
        category: 'Web Development',
        imageUrl: 'https://via.placeholder.com/400x250/A78BFA/FFFFFF?text=Project+1', // Placeholder image
        link: '/portfolio/shopease', // Link to detailed case study page
      },
      {
        id: 'pw2',
        title: 'Brand Identity for "GreenThumb Gardens"',
        description: 'Created a complete brand identity package including logo, color palette, typography, and marketing collaterals for a sustainable gardening brand.',
        category: 'Branding & Design',
        imageUrl: 'https://via.placeholder.com/400x250/60A5FA/FFFFFF?text=Project+2',
        link: '/portfolio/greenthumb',
      },
      {
        id: 'pw3',
        title: 'SEO & Content Strategy for "FitLife Gym"',
        description: 'Implemented a comprehensive SEO and content marketing strategy, significantly boosting organic traffic and membership sign-ups.',
        category: 'Digital Marketing',
        imageUrl: 'https://via.placeholder.com/400x250/F87171/FFFFFF?text=Project+3',
        link: '/portfolio/fitlife',
      },
      {
        id: 'pw4',
        title: 'Mobile App Development for "QuickServe"',
        description: 'Designed and developed a user-friendly mobile application for on-demand home services, available on iOS and Android.',
        category: 'Mobile Development',
        imageUrl: 'https://via.placeholder.com/400x250/34D399/FFFFFF?text=Project+4',
        link: '/portfolio/quickserve',
      },
    ];
    setPreviousWorks(fetchedPreviousWorks);


    // Update date and time every second
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
      }));
    };

    updateDateTime(); // Initial call
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>

      {/* Dashboard Header / Greeting */}
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div>
          <p className="text-xl font-semibold">Welcome Back, Admin!</p>
          <p className="text-sm opacity-90">Manage your college website with ease.</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium">{currentDateTime}</p>
          <p className="text-xs opacity-80">Visakhapatnam, Andhra Pradesh</p>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Enquiries</h3>
            <p className="text-3xl font-bold text-blue-600">{totalQueries}</p>
          </div>
          <Link to="/admin/contact-queries" className="text-blue-500 hover:text-blue-700 text-sm">View All</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Unread Enquiries</h3>
            <p className="text-3xl font-bold text-red-500">{unreadQueries}</p>
          </div>
          <Link to="/admin/contact-queries" className="text-blue-500 hover:text-blue-700 text-sm">View Unread</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Courses</h3>
            <p className="text-3xl font-bold text-green-600">{totalCourses}</p>
          </div>
          <Link to="/admin/courses" className="text-blue-500 hover:text-blue-700 text-sm">Manage</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Circulars</h3>
            <p className="text-3xl font-bold text-purple-600">{totalCirculars}</p>
          </div>
          <Link to="/admin/circulars" className="text-blue-500 hover:text-blue-700 text-sm">Manage</Link>
        </div>
      </div>

      {/* Latest Website Updates Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <svg className="w-7 h-7 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L10 13.414l1.293 1.293a1 1 0 001.414-1.414L11.414 12l1.293-1.293a1 1 0 00-1.414-1.414L10 10.586 8.707 9.293z" clipRule="evenodd"></path>
          </svg>
          Latest Website Updates
        </h2>
        <p className="text-md opacity-90 mb-6">Highlight key achievements, new services, and important announcements to attract clients and showcase value.</p>

        {latestUpdates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestUpdates.map((update) => (
              <div key={update.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white border-opacity-20 transition duration-300 ease-in-out hover:scale-105">
                <h3 className="text-xl font-semibold mb-2">{update.title}</h3>
                <p className="text-sm opacity-80 mb-3">{update.description}</p>
                <div className="flex justify-between items-center text-sm opacity-70">
                  <span>{update.date}</span>
                  {update.link && (
                    <a
                      href={update.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-200 font-medium transition duration-200 ease-in-out underline"
                    >
                      Learn More &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg opacity-70">No new updates available. Post exciting news from your agency panel!</p>
        )}
      </div>

      {/* Our Previous Works Section - Designed to showcase expertise */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-7 h-7 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 10H4V6h12v8z" clipRule="evenodd"></path>
          </svg>
          Our Previous Works
        </h2>
        <p className="text-md text-gray-600 mb-6">Showcase successful projects and case studies to demonstrate capabilities and encourage new service engagements.</p>

        {previousWorks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousWorks.map((work) => (
              <div key={work.id} className="bg-gray-50 border border-gray-200 rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
                {work.imageUrl && (
                  <img src={work.imageUrl} alt={work.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full mb-2 inline-block">{work.category}</span>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{work.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{work.description}</p>
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition duration-200 ease-in-out"
                  >
                    View Case Study
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">No previous work entries found. Add your successful projects from your agency panel!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardAdminPage;