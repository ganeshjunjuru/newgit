import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// Importing specific icons for clarity and control
import { User, Settings, LogOut, AlertCircle, Clock, Bell, Users, HelpCircle, GraduationCap } from 'lucide-react'; // Added GraduationCap for logo

const AdminHeader: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPackageExpired, setIsPackageExpired] = useState(false);
  // Set to a past date to demonstrate the 'expired' state by default for the user.
  const [packageExpiryDate, setPackageExpiryDate] = useState('2024-01-01');

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New student registered: John Doe', time: '2 mins ago' },
    { id: 2, message: 'Course "Web Dev 101" updated', time: '1 hour ago' },
    { id: 3, message: 'Critical system update available', time: 'Yesterday' },
  ]);
  const [liveUsersCount, setLiveUsersCount] = useState(125); // Example live users count

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiry = new Date(packageExpiryDate);
      expiry.setHours(0, 0, 0, 0);

      setIsPackageExpired(today >= expiry);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    const handleClickOutside = (event: MouseEvent) => {
      // Close notification dialog if click is outside of it
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [packageExpiryDate]);

  const handleLogout = () => {
    alert('Logging out...');
    // Implement your logout logic here
  };

  const handleRenewPackage = () => {
    alert('Initiating package renewal...');
    // Implement renewal logic here
  };

  const handleHelpAndSupport = () => {
    alert('Navigating to Help and Support...');
    // Implement navigation to a dedicated help/support page, e.g., navigate('/admin/help');
  };

  const toggleNotificationDialog = () => {
    setIsNotificationOpen(prev => !prev);
  };

  return (
    <header className="bg-gray-800 text-white py-4 shadow-lg fixed top-0 left-0 w-full z-40 font-sans"> {/* Darker background, slightly more vertical padding */}
      <div className="container mx-auto flex justify-between items-center px-6"> {/* Increased horizontal padding */}

        {/* Left side: College Logo & Admin Panel Title */}
        <div className="flex items-center space-x-3"> {/* Spacing for logo and text */}
          {/* Using a placeholder for a university logo, could be an SVG or image */}
          <div className="bg-blue-500 p-2 rounded-full flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-wide">Admin Panel</h1> {/* Slightly larger, semi-bold, letter-spacing */}
            <p className="text-xs opacity-75">University Dashboard</p> {/* More generic subtitle */}
          </div>
        </div>

        {/* Center Section: Package Expiry Warning (if applicable) */}
        {isPackageExpired && (
          <div className="flex items-center bg-red-600 px-5 py-2 rounded-full shadow-md animate-pulse transition-all duration-300 ease-in-out"> {/* More rounded, subtle animation */}
            <AlertCircle size={20} className="mr-3 text-white" />
            <div className="text-sm">
              <p className="font-bold">Package Expired!</p>
              <p className="opacity-90 text-xs">Renew for uninterrupted service.</p> {/* Refined message */}
            </div>
            <button
              onClick={handleRenewPackage}
              className="ml-5 bg-white text-red-700 px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-sm"
            >
              Renew Now
            </button>
          </div>
        )}

        {/* Right side: Utility Icons, Date/Time, Profile */}
        <div className="flex items-center space-x-8"> {/* Increased spacing for elegance */}

          {/* Utility Icons Group: Notifications, Live Users, Help */}
          <div className="flex items-center space-x-5"> {/* Spacing for icons */}
            {/* Notification Button and Dialog */}
            <div className="relative group" ref={notificationRef}>
              <button
                onClick={toggleNotificationDialog}
                className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 relative"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-300 group-hover:text-white" /> {/* Subtle icon color */}
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                    {notifications.length}
                  </span>
                )}
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50 animate-fade-in-down border border-gray-200"> {/* Larger width, more shadow, subtle border */}
                  <h3 className="px-4 py-3 text-lg font-bold text-gray-800 border-b border-gray-200">Notifications</h3> {/* Larger, bolder heading */}
                  {notifications.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto"> {/* Taller scroll area */}
                      {notifications.map(notification => (
                        <div key={notification.id} className="block px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                          <p className="font-medium text-gray-700">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-500">No new notifications.</p>
                  )}
                  <div className="px-4 py-3 border-t border-gray-200">
                    <Link to="/admin/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-150">
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Live Users Display - now more integrated and subtle */}
            <div className="flex items-center text-sm font-medium text-gray-300"> {/* Subtle text color */}
              <Users size={18} className="mr-2 text-blue-400" /> {/* Accent color for icon */}
              <span>{liveUsersCount} Live</span> {/* Simpler text */}
            </div>

            {/* Help and Support Button - elegant icon-only button */}
            <button
              onClick={handleHelpAndSupport}
              className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
              aria-label="Help and Support"
            >
              <HelpCircle size={20} className="text-gray-300 hover:text-white" /> {/* Subtle icon color */}
            </button>
          </div>

          {/* Date and Time Display */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-300">{currentDateTime}</p> {/* Subtle text color */}
            <p className="text-xs opacity-70">Visakhapatnam, Andhra Pradesh</p> {/* Slightly less opaque */}
          </div>

          {/* Profile Icon and Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsProfileMenuOpen(true)}
            onMouseLeave={() => setIsProfileMenuOpen(false)}
            ref={profileMenuRef}
          >
            <button
              className="p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 overflow-hidden"
              aria-label="User Profile"
            >
              <img
                src="https://placehold.co/40x40/60A5FA/FFFFFF?text=AD" // Example: User initials or default admin icon
                alt="Admin User"
                className="w-10 h-10 object-cover rounded-full border-2 border-blue-400" // Slightly larger, with a subtle border
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50 animate-fade-in-down border border-gray-200"> {/* More shadow, rounded-lg */}
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-150"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User size={16} className="text-gray-600" /> <span>Profile</span>
                </Link>
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-150"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings size={16} className="text-gray-600" /> <span>Settings</span>
                </Link>
                {!isPackageExpired && (
                  <>
                    <hr className="my-1 border-gray-100" /> {/* Lighter hr */}
                    <Link
                      to="/admin/billing"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-orange-600 transition-colors duration-150"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Clock size={16} /> <span>Package Details</span>
                    </Link>
                  </>
                )}
                <hr className="my-1 border-gray-100" /> {/* Lighter hr */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-150"
                >
                  <LogOut size={16} /> <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;