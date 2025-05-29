import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you'll use react-router-dom for navigation

const QueryContactSection: React.FC = () => {
  return (
    <section className="bg-[#0b3d64] py-16 font-inter"> {/* Dark blue background */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Column: Query Text */}
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Do You Have Any Query Regarding Your Career ?
          </h2>
        </div>

        {/* Right Column: Contact Us Button */}
        <div className="flex-shrink-0">
          <Link
            to="/contact" // Link to your contact page
            className="inline-block bg-white text-[#0b3d64] font-bold text-lg px-8 py-3 rounded-md shadow-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QueryContactSection;
