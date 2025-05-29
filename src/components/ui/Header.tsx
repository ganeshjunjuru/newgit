import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User } from 'lucide-react'; // Ensure all necessary icons are imported
import Logo from './Logo'; // Adjust this path if your Logo component is elsewhere

interface NavItem {
  path?: string;
  label: string;
  children?: NavItem[];
  icon?: JSX.Element; // For items with an icon, like Login
}

interface HeaderProps {
  onHeightChange: (height: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onHeightChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null); // Ref for the main <header> element

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define items for the very top dark blue bar
  const topNavItems: NavItem[] = [
    { path: '/gallery', label: 'Gallery' },
    { path: '/alumni', label: 'Alumni' },
    { path: '/mandatory-disclosure', label: 'Mandatory Disclosure' },
    { path: '/grievance', label: 'Grievance' },
    { path: '/nirf', label: 'NIRF' },
    { path: '/events', label: 'Events' },
    { path: '/login', label: 'Login', icon: <User size={16} className="mr-1" /> },
  ];

  // Define items for the main white navigation bar
  const mainNavItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/administration', label: 'Administration' }, // Assuming this has a path now
    { path: '/contact', label: 'Contact Us' },
    {
      label: 'Academics',
      children: [
        { path: '/courses', label: 'Courses' },
        { path: '/faculty', label: 'Faculty' },
        // Add more academic sub-items as needed
      ]
    },
    {
      label: 'Campus Life',
      children: [
        { path: '/campus-events', label: 'Events' }, // Renamed to avoid confusion with topNavItems 'Events'
        { path: '/campus-gallery', label: 'Gallery' }, // Renamed for same reason
        // Add more campus sub-items as needed
      ]
    },
    { path: '/news', label: 'News' },
  ];


  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Set a scroll threshold (e.g., 50 pixels) for when the top bar should hide
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Effect to measure header height and pass it up to the parent layout
  useEffect(() => {
    const measureHeaderHeight = () => {
      if (headerRef.current) {
        // Use requestAnimationFrame for measurement after potential layout changes
        requestAnimationFrame(() => {
          const height = headerRef.current!.offsetHeight;
          console.log('Measured Header Height:', height); // Log the height for debugging
          onHeightChange(height);
        });
      }
    };

    // 1. Initial measurement on component mount
    measureHeaderHeight();

    // 2. Use a MutationObserver for robust height measurement.
    // This observes changes to the DOM within the header, which is essential
    // when elements (like the top bar or mobile menu) change their height.
    const observer = new MutationObserver(() => {
      measureHeaderHeight();
    });

    if (headerRef.current) {
      observer.observe(headerRef.current, {
        attributes: true,        // Watch for attribute changes (e.g., class for max-h-0)
        childList: true,         // Watch for direct child changes (e.g., mobile menu content)
        subtree: true,           // Watch for changes in all descendants
        attributeFilter: ['class', 'style'] // Only trigger for class or style changes
      });
    }

    // 3. Re-measure on window resize (important for responsive layouts)
    window.addEventListener('resize', measureHeaderHeight);

    // Cleanup function for event listeners and observer
    return () => {
      window.removeEventListener('resize', measureHeaderHeight);
      observer.disconnect(); // Disconnect the MutationObserver
    };
  }, [onHeightChange]); // Re-run only if the onHeightChange callback itself changes


  // Helper class function for dynamic styling of main navigation links
  const getMainNavClasses = (isActive: boolean) => `
    px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
    ${isActive
      ? 'text-primary-700 bg-primary-50 lg:bg-transparent lg:text-primary-700'
      : `${isScrolled ? 'text-gray-700 hover:text-[#0b3d64]' : 'text-white hover:text-gray-300'}`}
  `;

  // Helper class function for desktop dropdown menu button text color
  const getDesktopDropdownButtonClasses = () => `
    flex items-center
    ${isScrolled ? 'text-gray-700 hover:text-primary-700' : 'text-white hover:text-primary-200'}
    transition-colors duration-200
  `;

  return (
    <header
      ref={headerRef} // Attach the ref to the outermost <header> element
      className="fixed w-full z-30 transition-all duration-300 font-inter"
    >
      {/* Top Bar (dark blue) - This div controls the visibility and height
        based on the 'isScrolled' state.
        - max-h-0 and py-0 combined with overflow-hidden will collapse its height.
        - opacity-0 makes it invisible.
        - pointer-events-none prevents interaction when hidden.
        - md:flex ensures it is treated as a flex container on medium screens and above
          (important if it's hidden on small screens even when not scrolled).
      */}
      <div className={`
        bg-[#0b3d64] text-white px-4 flex justify-end items-center
        transition-all duration-300 ease-in-out
        overflow-hidden
        ${isScrolled
          ? 'max-h-0 py-0 opacity-0 pointer-events-none' // Styles when scrolled (hidden)
          : 'max-h-screen py-2 opacity-100'} // Styles when NOT scrolled (visible)
        md:flex // This class ensures it's a flex container on desktop regardless of scroll
      `}>
        <nav className="hidden md:flex space-x-6 text-sm">
          {topNavItems.map((item, index) => (
            <Link key={index} to={item.path || '#'} className="hover:text-gray-300 transition-colors rounded-md px-2 py-1 flex items-center">
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        {/* Mobile menu button for the top bar (only visible on mobile) */}
        {/* This button will trigger the main mobile menu (the one that slides down) */}
        <button
          className="md:hidden text-white focus:outline-none p-2 rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Navigation Bar (white) - This div contains the logo and main navigation.
        Its padding and background color might change based on scroll.
      */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-white py-2 shadow-md' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            {/* Logo component - pass scrolled prop if it needs to adapt */}
            <Logo scrolled={isScrolled} />
          </Link>

          {/* Desktop Main Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item, index) => (
              item.children ? ( // Render dropdown if item has children
                <div key={index} className="relative group">
                  <button className={`${getDesktopDropdownButtonClasses()} group-hover:text-primary-700`}>
                    {item.label}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {/* Dropdown content */}
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {item.children.map((child, childIndex) => (
                        <NavLink
                          key={childIndex}
                          to={child.path!}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm ${isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-100'}`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : ( // Render simple link if no children
                <NavLink
                  key={index}
                  to={item.path!}
                  className={({ isActive }) => getMainNavClasses(isActive)}
                >
                  {item.label}
                </NavLink>
              )
            ))}
            {/* Exam Results Button */}
            <button className="ml-4 bg-gradient-to-r from-[#800000] to-[#c0392b] text-white px-5 py-2 rounded-md text-base font-medium shadow-md hover:opacity-90 transition-opacity">Exam Results</button>
          </nav>
          {/* Mobile Menu Button for Main Nav (only visible on mobile, used for the main slide-down menu) */}
          <button
            className="md:hidden text-gray-700 focus:outline-none p-2 rounded-md"
            onClick={toggleMenu} // Uses the same toggle function for the overall mobile menu
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu (slides down) - This div controls the visibility
        and height of the mobile menu.
      */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`px-4 py-2 space-y-2 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
          {/* Top Bar Items in Mobile Menu */}
          {topNavItems.map((item, index) => (
            <Link key={`mobile-top-${index}`} to={item.path || '#'} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0b3d64] hover:bg-gray-50 transition-colors">
              {item.label}
            </Link>
          ))}
          {/* Main Nav Items in Mobile Menu */}
          {mainNavItems.map((item, index) => (
            item.children ? (
              <div key={`mobile-${index}`} className="space-y-1">
                <div className="px-3 py-2 font-medium text-gray-800 border-l-4 border-transparent">
                  {item.label}
                </div>
                <div className="pl-4 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <NavLink
                      key={`mobile-child-${childIndex}`}
                      to={child.path!}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-sm rounded-md ${
                          isActive
                            ? 'text-primary-700 bg-primary-50 border-l-4 border-primary-700'
                            : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={`mobile-${index}`}
                to={item.path!}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive
                      ? 'text-primary-700 bg-primary-50 border-l-4 border-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          ))}
          {/* Exam Results Button in Mobile Menu */}
          <button className="w-full mt-4 bg-gradient-to-r from-[#800000] to-[#c0392b] text-white px-5 py-2 rounded-md text-base font-medium shadow-md hover:opacity-90 transition-opacity">Exam Results</button>
        </div>
      </div>
    </header>
  );
};

export default Header;