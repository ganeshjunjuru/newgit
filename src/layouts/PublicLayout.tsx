import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header'; // Adjust path if necessary
import Footer from '../components/layout/Footer'; // Adjust path if necessary

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* This is where your page components will be rendered */}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;