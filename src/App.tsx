import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import FloatingActionBar from './components/ui/FloatingActionBar';

import ScrollToTopButton from './components/ui/ScrollToTopButton';

import { useWebsiteSettingsStore } from './store/websiteSettingsStore';
import { useAuthStore } from './store/authStore';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/public/HomePage';
import ContactUsPage from './pages/public/ContactUsPage';
import AboutPage from './pages/public/AboutPage';
import GalleryPage from './pages/public/GalleryPage';
import AdministrationPage from './pages/public/AdministrationPage';

import AdminLoginPage from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/DashboardAdminPage';
import AddContentPopup from './pages/admin/AddContentPopup';
import AdminNotificationsPage from './pages/admin/NotificationsAdminPage';
import CircularsAdminPage from './pages/admin/CircularsAdminPage';
import CoursesAdminPage from './pages/admin/CoursesAdminPage';
import DirectorsMessageAdminPage from './pages/admin/DirectorsMessageAdminPage';
import PrincipalsMessageAdminPage from './pages/admin/PrincipalsMessageAdminPage';
import VisionMissionAdminPage from './pages/admin/VisionMissionAdminPage';
import AssociationsAdminPage from './pages/admin/AssociationsAdminPage';
import RecruitingPartnersAdminPage from './pages/admin/RecruitingPartnersAdminPage';
import ContactQueriesAdminPage from './pages/admin/ContactQueriesAdminPage';
import LeadsManagement from './pages/admin/LeadsManagement';
import AdminSettings from './pages/admin/AdminSettings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      initializeAuth();
    }
  }, [isAuthenticated, loading, initializeAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const { settings, isLoading, error, fetchWebsiteSettings } = useWebsiteSettingsStore(
    (state) => ({
      settings: state.settings,
      isLoading: state.isLoading,
      error: state.error,
      fetchWebsiteSettings: state.fetchWebsiteSettings,
    })
  );

  const location = useLocation();
  const isAdminLoginPath = location.pathname === '/admin/login';

  useEffect(() => {
    initializeAuth();
    fetchWebsiteSettings();
  }, [initializeAuth, fetchWebsiteSettings]);

  const isMaintenanceModeEnabled = settings?.is_maintenance_mode === true;
  const maintenanceMessage = settings?.maintenance_message || 'Our website is currently undergoing scheduled maintenance. We will be back online shortly!';

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <p className="text-xl">Loading website status...</p>
      </div>
    );
  }

  if (error && !settings) {
    console.error("Failed to load website settings for app:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-700 p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Website Unavailable</h1>
        <p className="text-lg">Apologies, we're currently experiencing technical difficulties.</p>
        <p className="text-md">Please try again later or contact support if the issue persists.</p>
        <p className="text-sm mt-4">Error: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  if (isMaintenanceModeEnabled && !isAdminLoginPath) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-900 text-white p-6 text-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Under Maintenance</h1>
          <p className="text-lg md:text-xl mb-8">{maintenanceMessage}</p>
          <p className="text-md md:text-lg">Thank you for your patience.</p>
          {settings?.site_logo && (
            <img
              src={settings.site_logo}
              alt={settings.site_name || 'Site Logo'}
              className="mt-8 mx-auto h-24 w-auto filter grayscale opacity-75"
            />
          )}
          {settings?.contact_email && (
            <p className="mt-4 text-sm">
              For urgent queries, contact: <a href={`mailto:${settings.contact_email}`} className="text-blue-300 hover:underline">{settings.contact_email}</a>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="contact-us" element={<ContactUsPage />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="administration" element={<AdministrationPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="notifications" element={<AdminNotificationsPage />} />
                  <Route path="circulars" element={<CircularsAdminPage />} />
                  <Route path="courses" element={<CoursesAdminPage />} />
                  <Route path="directors-message" element={<DirectorsMessageAdminPage />} />
                  <Route path="principals-message" element={<PrincipalsMessageAdminPage />} />
                  <Route path="vision-mission" element={<VisionMissionAdminPage />} />
                  <Route path="associations" element={<AssociationsAdminPage />} />
                  <Route path="recruiting-partners" element={<RecruitingPartnersAdminPage />} />
                  <Route path="contact-queries" element={<ContactQueriesAdminPage />} />
                  <Route path="leads" element={<LeadsManagement />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="add-popup" element={<AddContentPopup />} />

                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="*" element={
                    <div className="p-4 text-center text-red-500">
                      Admin Page Not Found
                    </div>
                  } />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <h1 className="text-3xl text-gray-700">404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
      <ScrollToTopButton />
      <FloatingActionBar position="right" />
    </>
  );
}

const AppWrapper: React.FC = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;