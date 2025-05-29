import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronUp, User, Phone, Mail } from 'lucide-react';
import { useWebsiteSettingsStore } from '../../store/websiteSettingsStore';
import { useHeaderMenuStore } from '../../store/headermenuStore';
import { NavLink } from 'react-router-dom';

// Define the structure for a single menu item
interface MenuItem {
  id: number;
  menu_id: number;
  item_text: string;
  item_url: string;
  display_order: number;
  parent_id: number | null;
  is_active: boolean;
  icon_class: string | null;
  target_blank: boolean;
  children?: MenuItem[]; // For nested menu items
}

// Define the structure for a complete header menu (e.g., 'Web Top Menu')
interface HeaderMenu {
  id: number;
  menu_name: string;
  items: MenuItem[];
}

// MobileMenuItem component for rendering responsive, nested mobile menus
interface MobileMenuItemProps {
  item: MenuItem;
  onLinkClick: () => void; // Callback to close the main mobile menu when a link is clicked
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ item, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  // Determine if the item itself should be clickable based on item_url
  const isClickable = item.item_url && item.item_url.trim() !== '';

  const handleLinkClick = () => {
    // Only close the main mobile menu if it's a leaf node (no children) AND it's a clickable link
    if (!hasChildren && isClickable) {
      onLinkClick();
    }
    // If it has children, clicking the parent item just toggles the dropdown, it doesn't navigate.
    // If it's not clickable, it's just text, so no navigation occurs.
  };

  return (
    <li className="w-full">
      <div className="flex items-center justify-between">
        {isClickable ? ( // Render as a link if URL is available
          item.target_blank ? (
            <a
              href={item.item_url}
              target="_blank"
              rel="noopener noreferrer" // Recommended for target="_blank" for security
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0b3d64] hover:bg-gray-50 transition-colors flex-grow"
              onClick={handleLinkClick}
            >
              {item.icon_class && <i className={`${item.icon_class} mr-1`}></i>}
              {item.item_text}
            </a>
          ) : (
            <NavLink
              to={item.item_url}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0b3d64] hover:bg-gray-50 transition-colors flex-grow ${isActive ? "active" : ""}`
              }
            >
              {item.icon_class && <i className={`${item.icon_class} mr-1`}></i>}
              {item.item_text}
            </NavLink>
          )
        ) : ( // Render as plain text if no URL
          <span className="block px-3 py-2 text-base font-medium text-gray-700 flex-grow">
            {item.icon_class && <i className={`${item.icon_class} mr-1`}></i>}
            {item.item_text}
          </span>
        )}
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-expanded={isOpen}
            aria-controls={`submenu-${item.id}`} // Accessibility attribute
          >
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <ul id={`submenu-${item.id}`} className="ml-4 space-y-2 list-none border-l border-gray-200 pl-2">
          {item.children?.map(child => (
            // Nested mobile menu items also use MobileMenuItem for consistent clickable logic
            <MobileMenuItem key={child.id} item={child} onLinkClick={onLinkClick} />
          ))}
        </ul>
      )}
    </li>
  );
};


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu open/close
  const [isScrolled, setIsScrolled] = useState(false); // State for sticky header effect

  // --- Website Settings Store ---
  // Fetches general website settings like logo, site name, dynamic button, top bar visibility, contact info.
  const { settings, isLoading: settingsLoading, error: settingsError, fetchWebsiteSettings } = useWebsiteSettingsStore(
    (state) => ({
      settings: state.settings,
      isLoading: state.isLoading,
      error: state.error,
      fetchWebsiteSettings: state.fetchWebsiteSettings,
    })
  );

  useEffect(() => {
    fetchWebsiteSettings();
  }, [fetchWebsiteSettings]);

  // --- Header Menu Store ---
  // Fetches different navigation menus from the API (e.g., 'Web Top Menu', 'Web Menu', 'Mobile Menu').
  const { menus, isLoading: menusLoading, error: menusError, fetchMenus } = useHeaderMenuStore();

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Effect to add/remove scroll event listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Set scrolled state after 50px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
  }, []);

  // Extract common settings to variables for easier access
  const currentSiteLogo = settings?.site_logo || null;
  const currentSiteName = settings?.site_name || 'Sreepaada College';
  const isDynamicButtonVisible = settings?.button_visible === true;
  const dynamicButtonText = settings?.button_text;
  const dynamicButtonLink = settings?.button_link;
  const isTopBarVisibleInSettings = settings?.show_top_bar !== false; // Default to true if setting is missing/null
  const phoneNumber = settings?.phone_number;
  const emailAddress = settings?.email_address;

  // Find specific menus by name from the fetched 'menus' array
  const topBarMenu = menus.find(menu => menu.menu_name.trim() === 'Web Top Menu');
  const mainNavigationMenu = menus.find(menu => menu.menu_name.trim() === 'Web Menu');
  const mobileMainMenu = menus.find(menu => menu.menu_name.trim() === 'Mobile Menu');
  const mobileTopBarMenu = menus.find(menu => menu.menu_name.trim() === 'Mobile Top Menu');


  // Helper function to build nested menu structure and filter active items
  const buildNestedMenuItems = (items: MenuItem[]): MenuItem[] => {
    // Filter items to include only those marked as active
    const activeItems = items.filter(item => item.is_active === true || item.is_active === 1);

    // Find top-level items (parent_id is null) and sort them by display order
    const topLevelItems = activeItems.filter(item => item.parent_id === null).sort((a, b) => a.display_order - b.display_order);

    // Recursively attach children to their parents
    const nestedItems: MenuItem[] = topLevelItems.map(item => ({
      ...item,
      children: activeItems.filter(child => child.parent_id === item.id).sort((a, b) => a.display_order - b.display_order)
    }));
    return nestedItems;
  };

  // --- Web Top Menu Links (for the blue bar) ---
  // Get original menu items from the API for the Web Top Menu
  const topNavLinksOriginal = topBarMenu ? buildNestedMenuItems(topBarMenu.items) : [];
  // Initialize the list that will be rendered; it starts with the original fetched links
  const topNavLinks: MenuItem[] = [...topNavLinksOriginal];

  // Condition to add the "Login" button: only if Web Top Menu is active (found) AND has no items (and not loading)
  const shouldAddLoginToWebTopBar =
      topBarMenu && // The Web Top Menu itself was found
      topNavLinksOriginal.length === 0 && // But it has no active items
      !settingsLoading && !menusLoading; // Ensure all data has finished loading

  if (shouldAddLoginToWebTopBar) {
      // Add Login link if it's not already present (prevents duplicates if API somehow sends it AND condition met)
      if (!topNavLinks.some(item => item.item_text === 'Login')) {
          topNavLinks.push({
              id: Date.now() + 1, // Unique ID for this generated link
              menu_id: 0, // Not tied to a specific menu ID from API
              item_text: 'Login',
              item_url: '/login', // Standard login URL
              display_order: 9999, // High display order to place it last
              parent_id: null,
              is_active: true, // Always active
              icon_class: null, // No icon by default, can add 'User' from Lucide if desired
              target_blank: false
          });
      }
  }

  // --- Main Navigation Links (for the white bar) ---
  const mainNavLinks = mainNavigationMenu ? buildNestedMenuItems(mainNavigationMenu.items) : [];

  // --- Mobile Navigation Links Logic ---
  let mobileCombinedLinks: MenuItem[] = []; // This array will hold all links for the mobile menu

  // Process mobile-specific menus first
  const mobileMainLinksProcessed = mobileMainMenu ? buildNestedMenuItems(mobileMainMenu.items) : [];
  const mobileTopLinksProcessed = mobileTopBarMenu ? buildNestedMenuItems(mobileTopBarMenu.items) : [];

  // Add mobile-specific main menu items if available
  if (mobileMainLinksProcessed.length > 0) {
    mobileCombinedLinks = [...mobileCombinedLinks, ...mobileMainLinksProcessed];
  }
  // Add mobile-specific top bar menu items if available
  if (mobileTopLinksProcessed.length > 0) {
    mobileCombinedLinks = [...mobileCombinedLinks, ...mobileTopLinksProcessed];
  }

  // Fallback: If no mobile-specific menus yielded items, use the Web Main Menu as a fallback for mobile
  if (mobileCombinedLinks.length === 0) {
    if (mainNavigationMenu) {
      mobileCombinedLinks = [...mobileCombinedLinks, ...buildNestedMenuItems(mainNavigationMenu.items)];
    }
  }

  // Add the dynamic action button to mobile menu if visible
  if (isDynamicButtonVisible && dynamicButtonText && dynamicButtonLink) {
      mobileCombinedLinks.push({
          id: Date.now(), // Unique ID
          menu_id: 0,
          item_text: dynamicButtonText,
          item_url: dynamicButtonLink,
          display_order: 999, // Place it after other dynamic links
          parent_id: null,
          is_active: true,
          icon_class: null,
          target_blank: true // Dynamic button often opens in new tab
      });
  }

  // Condition to add the "Login" button to Mobile Menu:
  // If Web Top Menu OR Mobile Top Menu is active (found) AND has no items (and not loading)
  const shouldAddLoginToMobileMenu =
      (!settingsLoading && !menusLoading) &&
      (
          (topBarMenu && topNavLinksOriginal.length === 0) || // Web Top Menu is active but empty
          (mobileTopBarMenu && mobileTopLinksProcessed.length === 0) // OR Mobile Top Menu is active but empty
      );

  if (shouldAddLoginToMobileMenu) {
      if (!mobileCombinedLinks.some(item => item.item_text === 'Login')) {
          mobileCombinedLinks.push({
              id: Date.now() + 2, // Unique ID
              menu_id: 0,
              item_text: 'Login',
              item_url: '/login',
              display_order: 10000, // Very high display order to ensure it's last
              parent_id: null,
              is_active: true,
              icon_class: null,
              target_blank: false
          });
      }
  }
  const mobileNavLinks = mobileCombinedLinks; // Final array for mobile menu rendering
  // --- End Mobile Navigation Links Logic ---


  // Log errors if any during data fetching
  if (settingsError || menusError) {
    console.error("Header: Error loading settings or menus:", settingsError || menusError);
  }

  // Dynamic header height based on scroll and top bar visibility
  const headerHeight = isTopBarVisibleInSettings && !isScrolled ? 'h-[120px]' : 'h-[80px]';
  const headerTopOffset = 'top-0'; // Keep header at the very top of the viewport

  // Helper function to render individual navigation links for desktop
  // 'type' prop is used to apply correct styling (e.g., text color for top bar vs. main nav)
  const renderNavLink = (link: MenuItem | { name: string; href: string }, type: 'top' | 'main') => {
    const isApiItem = 'item_text' in link; // Check if it's an API-fetched MenuItem or a custom object
    const name = isApiItem ? link.item_text : link.name;
    const href = isApiItem ? link.item_url : link.href;
    const targetBlank = isApiItem ? link.target_blank : false;
    const iconClass = isApiItem ? link.icon_class : null;
    const hasChildren = isApiItem && link.children && link.children.length > 0;
    // Determine if the link should be clickable based on href
    const isClickable = href && href.trim() !== '';

    const LinkComponent = targetBlank ? 'a' : NavLink;

    const baseClasses = `px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center`;
    let specificClasses;

    if (type === 'top') {
        // Styling for top blue bar: white text with subtle hover
        specificClasses = `text-white hover:text-gray-300 hover:bg-gray-700/20`;
    } else { // type === 'main'
        // Styling for main white navigation bar: dark text with subtle hover
        specificClasses = `text-gray-700 hover:text-[#0b3d64] hover:bg-gray-50`;
    }

    const combinedClasses = `${baseClasses} ${specificClasses}`;

    return (
      <li key={name} className={`relative group ${hasChildren ? 'has-dropdown' : ''}`}>
        {isClickable ? ( // Render as a link if URL is available
          targetBlank ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={combinedClasses}
            >
              {iconClass && <i className={`${iconClass} mr-1`}></i>}
              {name}
            </a>
          ) : (
            <LinkComponent
              to={href}
              className={({ isActive }) =>
                `${combinedClasses} ${isActive ? "active" : ""}`
              }
            >
              {iconClass && <i className={`${iconClass} mr-1`}></i>}
              {name}
            </LinkComponent>
          )
        ) : ( // Render as plain text if no URL
          <span className={combinedClasses}>
            {iconClass && <i className={`${iconClass} mr-1`}></i>}
            {name}
          </span>
        )}

        {/* Render dropdown for nested items in desktop view */}
        {hasChildren && (
          <ul className="absolute left-0 top-full mt-0 hidden group-hover:block bg-white shadow-lg rounded-md overflow-hidden z-40 min-w-[200px] border border-gray-100 list-none">
            {link.children?.map(child => (
              // Nested desktop menu items also apply clickable logic
              <li key={child.id}>
                {child.item_url && child.item_url.trim() !== '' ? (
                  <NavLink
                    to={child.item_url}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0b3d64] transition-colors ${isActive ? "active" : ""}`
                    }
                  >
                    {child.item_text}
                  </NavLink>
                ) : (
                  <span className="block px-4 py-2 text-sm text-gray-700">
                    {child.item_text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };


  return (
    <header className={`fixed w-full z-30 transition-all duration-300 font-inter ${isScrolled ? 'shadow-md' : ''} ${headerTopOffset}`}>

      {/* Blue Top Navigation Bar - Conditionally rendered based on settings and content */}
      {isTopBarVisibleInSettings && (topNavLinks.length > 0 || phoneNumber || emailAddress || settingsLoading || menusLoading) && (
        <div className={`bg-[#0b3d64] text-white px-4 flex justify-end items-center transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-screen opacity-100 py-2' // Hide when scrolled
        }`}>
          {/* Conditional Phone/Email Display for Web Top Bar (only if original top menu was empty) */}
          {topNavLinksOriginal.length === 0 && !settingsLoading && !menusLoading && (phoneNumber || emailAddress) && (
            <div className="flex items-center space-x-4 text-sm mr-auto"> {/* mr-auto pushes these to the left */}
                {phoneNumber && (
                    <a href={`tel:${phoneNumber}`} className="flex items-center hover:text-gray-300 transition-colors">
                        <Phone size={16} className="mr-1" /> {phoneNumber}
                    </a>
                )}
                {emailAddress && (
                    <a href={`mailto:${emailAddress}`} className="flex items-center hover:text-gray-300 transition-colors">
                        <Mail size={16} className="mr-1" /> {emailAddress}
                    </a>
                )}
            </div>
          )}

          {/* Desktop Top Bar Navigation */}
          <nav className="hidden md:flex space-x-6 text-sm">
            <ul className="flex space-x-6 text-sm list-none">
              {topNavLinks.length > 0 ? (
                topNavLinks.map((link) => renderNavLink(link, 'top')) // Pass 'top' type for styling
              ) : (
                (settingsLoading || menusLoading) ? <span className="text-gray-400">Loading top nav...</span> : null
              )}
            </ul>
          </nav>
        </div>
      )}

      {/* White Main Header Section */}
      <div className={`bg-white ${headerHeight} flex items-center transition-all duration-300`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo Section */}
          {/* Added flex-shrink-0 to prevent the logo from unintended shrinking */}
          <a href="#" className="flex items-center flex-shrink-0">
            {(settingsLoading || menusLoading) && (!settings || menus.length === 0) ? (
              // Placeholder for loading state of logo
              <div className="flex items-center">
                <div className="h-[70px] w-[200px] bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            ) : (
              // Render actual logo or site name abbreviation
              <>
                {currentSiteLogo ? (
                  <img
                    src={currentSiteLogo}
                    alt={currentSiteName}
                    // Responsive height: 40px tall & max 180px wide on small screens, 70px tall & no max-width from md breakpoint
                    className="h-[40px] w-auto rounded-md max-w-[180px] md:h-[70px] md:max-w-none"
                  />
                ) : (
                  <div className="h-[70px] flex items-center pr-3">
                    <span
                      // Responsive font size for text logo: lg on small screens, 3xl from md breakpoint
                      className="text-lg md:text-3xl font-bold text-[#0b3d64]"
                    >
                      {currentSiteName.split(' ').map(word => word.charAt(0)).join('') || 'S'}
                    </span>
                  </div>
                )}
              </>
            )}
          </a>

          {/* Desktop Main Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6 list-none">
              {mainNavLinks.length > 0 ? (
                mainNavLinks.map((link) => renderNavLink(link, 'main')) // Pass 'main' type for styling
              ) : (
                (settingsLoading || menusLoading) ? <span className="text-gray-400">Loading main nav...</span> : null
              )}
            </ul>

            {/* Dynamic Action Button for Desktop */}
            {/* Conditional rendering based on dynamicButtonLink availability */}
            {isDynamicButtonVisible && dynamicButtonText && dynamicButtonLink && dynamicButtonLink.trim() !== '' ? (
              <a
                href={dynamicButtonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-md text-base font-medium shadow-md hover:opacity-90 transition-opacity"
              >
                {dynamicButtonText}
              </a>
            ) : isDynamicButtonVisible && dynamicButtonText ? (
              // Render as plain text if button is visible but link is not available
              <span className="ml-4 bg-gray-200 text-gray-700 px-5 py-2 rounded-md text-base font-medium">
                {dynamicButtonText}
              </span>
            ) : null}
          </nav>

          {/* Mobile menu toggle button (visible only on small screens) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#0b3d64] focus:outline-none p-2 rounded-md"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu (slides down) */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isMenuOpen ? 'max-h-screen bg-white shadow-lg py-4' : 'max-h-0' // Controls open/close animation
      }`}>
        {/* Conditional Phone/Email for Mobile Menu (only if dynamic top menu items are empty) */}
        {((mobileTopLinksProcessed.length === 0 && topNavLinksOriginal.length === 0) && !settingsLoading && !menusLoading && (phoneNumber || emailAddress)) && (
            <div className="px-4 py-2 space-y-2 border-b border-gray-100 pb-2 mb-2">
                {phoneNumber && (
                    <a href={`tel:${phoneNumber}`} className="flex items-center text-gray-700 hover:text-[#0b3d64] transition-colors">
                        <Phone size={16} className="mr-2" /> {phoneNumber}
                    </a>
                )}
                {emailAddress && (
                    <a href={`mailto:${emailAddress}`} className="flex items-center text-gray-700 hover:text-[#0b3d64] transition-colors">
                        <Mail size={16} className="mr-2" /> {emailAddress}
                    </a>
                )}
            </div>
        )}
        <div className="px-4 py-2 space-y-2">
          <ul className="space-y-2 list-none">
            {mobileNavLinks.length > 0 ? (
              mobileNavLinks.map((link) => (
                <MobileMenuItem key={link.id || link.item_text} item={link} onLinkClick={() => setIsMenuOpen(false)} />
              ))
            ) : (
              (settingsLoading || menusLoading) ? <span className="text-gray-400">Loading mobile nav...</span> : null
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;