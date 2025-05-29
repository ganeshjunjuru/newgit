import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar'; // Adjust path to your sidebar
import AdminHeader from '../components/layout/AdminHeader'; // Adjust path to your AdminHeader

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar - Now Fixed */}
      {/*
        The sidebar is made fixed, occupying the full height on the left.
        w-64 sets a fixed width (e.g., 256px).
        z-50 ensures it stays on top of other content.
        bg-gray-800 (or your sidebar's background color) for visual separation.
      */}
      <div className="fixed top-0 bottom-0 left-0 w-64 z-50 bg-gray-800 shadow-lg">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      {/*
        ml-64 adds a left margin to the main content, pushing it away
        from the fixed sidebar, so content doesn't get hidden underneath.
        flex-1 ensures it takes up the remaining horizontal space.
        flex-col arranges its children (header and main content) vertically.
      */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Header for all admin pages */}
        {/*
          The header is already fixed at the top, full width.
          It has a z-index to stay above other content but below the sidebar.
        */}
        <AdminHeader />

        {/* Main content area, pushed down by the fixed header */}
        {/*
          mt-20 adds a top margin to the main content, moving it below the fixed header.
          p-6 adds internal padding.
          flex-1 allows it to grow and fill available vertical space.
        */}
        <main className="flex-1 p-6 mt-20">
          <Outlet /> {/* This is where the specific admin page components (Dashboard, Notifications, etc.) will render */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
