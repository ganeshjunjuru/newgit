// src/components/layout/Footer.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWebsiteSettingsStore } from '../../store/websiteSettingsStore'; // Adjust path based on your structure
import { useFooterMenuStore } from '../../store/footerMenuStore'; // Import the new footer menu store

// Import Lucide icons
import {
  ChevronRight, // For list items (replaces faChevronRight)
  Phone,        // For phone number (replaces faPhoneAlt)
  Mail,         // For email (replaces faEnvelope)
  MapPin,       // For address (replaces faMapMarkerAlt)
  Facebook,     // For Facebook brand icon (replaces faFacebookF)
  Twitter,      // For Twitter brand icon (replaces faTwitter)
  Instagram,    // For Instagram brand icon (replaces faInstagram)
  Linkedin,     // For LinkedIn brand icon (replaces faLinkedinIn)
  Youtube       // For YouTube brand icon (replaces faYoutube)
} from 'lucide-react';


const Footer: React.FC = () => {
  const { settings, isLoading: settingsLoading, error: settingsError } = useWebsiteSettingsStore();
  // Destructure footer menu store
  const { menus, isLoading: menusLoading, error: menusError, fetchMenus } = useFooterMenuStore();

  const currentYear = new Date().getFullYear();

  // Fetch footer menus when the component mounts
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // --- Dynamic Content from Website Settings Store with robust fallbacks ---
  const collegeName = settings?.site_name || 'Sreepaada Degree College';
  const establishedYear = settings?.established_year || 2003;
  const footerDescription = settings?.short_description || `Established in ${establishedYear} under the auspices of the SPR Memorial Educational Society, ${collegeName} has been a beacon of excellence in higher education for over two decades. Nestled in the heart of Visakapatnam city, our college offers a conducive environment for holistic learning and personal growth. We take pride in our commitment to academic excellence and holistic development. With a diverse range of courses including BCA, BBA, BCom and BSc Honours, our institution is dedicated to nurturing the intellectual curiosity and professional acumen of our students.`;

  const contactPhone = settings?.phone_number || '9703073871'; // Using phone_number from settings
  const contactEmail = settings?.email_address || 'sreepaada.ug@gmail.com'; // Using email_address from settings
  const siteAddress = settings?.address || 'D.NO:39-33-2/3, HIG-96, RTA OFFICE ROAD, MADHAVADHARA, VISAKHAPATNAM, PINCODE-530018';
  const developerName = settings?.developer_name || 'Pixel Clients';
  const developerWebsite = settings?.developer_website_url || 'https://www.pixelclients.com'; // Added developer website URL

  // --- Image and Link URLs directly from settings ---
  const siteLogoUrl = settings?.site_logo;
  const footerLogoUrl = settings?.footer_logo;
  const mandatoryDisclosureImageUrl = settings?.mandatory_disclosure_image;
  const mandatoryDisclosureLinkUrl = settings?.mandatory_disclosure_link;

  // Social Media URLs
  const facebookUrl = settings?.facebook_url || '#';
  const twitterUrl = settings?.twitter_url || '#';
  const instagramUrl = settings?.instagram_url || '#';
  const linkedinUrl = settings?.linkedin_url || '#';
  const youtubeUrl = settings?.youtube_url || '#';

  // --- Filter menus from the store based on their name ---
  const coursesOfferedMenu = menus.find(menu => menu.menu_name === 'Courses Offered');
  const usefulLinksMenu = menus.find(menu => menu.menu_name === 'Useful Links');
  const getInTouchMenu = menus.find(menu => menu.menu_name === 'Get In Touch'); // Although its items aren't used, we might use its presence

  // Combine loading states
  const overallLoading = settingsLoading || menusLoading;
  // Combine error states
  const overallError = settingsError || menusError;

  // --- Render nothing or a simplified footer if settings/menus aren't loaded or error exists ---
  if (overallLoading && (!settings || menus.length === 0)) {
    return (
      <footer className="bg-white text-gray-800 py-8 text-center shadow-md">
        <p>Loading footer content...</p>
      </footer>
    );
  }

  if (overallError && (!settings || menus.length === 0)) {
    console.error("Failed to load footer data:", overallError);
    return (
      <footer className="bg-white text-gray-800 py-8 text-center shadow-md">
        <p>Error loading footer content. Some elements may be missing. Please check server logs or network connection.</p>
        <p className="mt-4">
          &copy; {currentYear} {collegeName} || All Right Reserved.<br/>
          Powered by <a href={developerWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">{developerName}</a>
        </p>
      </footer>
    );
  }

  // --- Main Footer Rendering ---
  return (
    <footer className="bg-white text-gray-800 py-10 shadow-md">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* College Info Section */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col items-start">
            <div className="mb-3 flex items-center flex-wrap">
              {/* LOGO DISPLAY */}
              {(footerLogoUrl || siteLogoUrl) && (
                <img
                  src={footerLogoUrl || siteLogoUrl || ''}
                  alt={`${collegeName} Logo`}
                  className="h-14 inline-block mr-4"
                  onError={(e) => {
                    console.error(`Failed to load image: ${(e.target as HTMLImageElement).src}`);
                  }}
                />
              )}
            </div>
            {/* FULL DESCRIPTION DISPLAY */}
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {footerDescription}
            </p>
          </div>

          {/* Courses Offered Section (Dynamically rendered) */}
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-bold text-lg mb-3 uppercase">Courses Offered</h3>
            <ul className="space-y-1 text-sm">
              {coursesOfferedMenu?.items.map(item => (
                <li key={item.id} className="flex items-center">
                  <ChevronRight className="inline-block w-3 h-3 mr-2" />
                  {item.item_url && item.item_url.trim() !== '' ? ( // Check if URL is available and not empty
                    <Link to={item.item_url} target={item.target_blank ? '_blank' : '_self'} rel={item.target_blank ? 'noopener noreferrer' : undefined} className="text-gray-700 hover:text-blue-600 transition-colors">
                      {item.item_text}
                    </Link>
                  ) : (
                    <span className="text-gray-700">{item.item_text}</span> // Render as plain text if no URL
                  )}
                </li>
              ))}
              {/* Fallback for no items or loading state */}
              {(!coursesOfferedMenu || coursesOfferedMenu.items.length === 0) && !overallLoading && (
                <li><span className="text-gray-500 text-sm">No courses listed.</span></li>
              )}
            </ul>
          </div>

          {/* Useful Links Section (Dynamically rendered) */}
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-bold text-lg mb-3 uppercase">Useful Links</h3>
            <ul className="space-y-1 text-sm">
              {usefulLinksMenu?.items.map(item => (
                <li key={item.id} className="flex items-center">
                  <ChevronRight className="inline-block w-3 h-3 mr-2" />
                  {item.item_url && item.item_url.trim() !== '' ? ( // Check if URL is available and not empty
                    <Link to={item.item_url} target={item.target_blank ? '_blank' : '_self'} rel={item.target_blank ? 'noopener noreferrer' : undefined} className="text-gray-700 hover:text-blue-600 transition-colors">
                      {item.item_text}
                    </Link>
                  ) : (
                    <span className="text-gray-700">{item.item_text}</span> // Render as plain text if no URL
                  )}
                </li>
              ))}
              {/* Fallback for no items or loading state */}
              {(!usefulLinksMenu || usefulLinksMenu.items.length === 0) && !overallLoading && (
                <li><span className="text-gray-500 text-sm">No useful links listed.</span></li>
              )}
            </ul>
          </div>

          {/* Get In Touch Section (Using Website Settings for contact info) */}
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-bold text-lg mb-3 uppercase">Get In Touch</h3>
            <ul className="space-y-1 text-sm">
              {contactPhone && (
                <li>
                  <a href={`tel:${contactPhone}`} className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                    <Phone className="inline-block w-4 h-4 mr-2" />{contactPhone}
                  </a>
                </li>
              )}
              {contactEmail && (
                <li>
                  <a href={`mailto:${contactEmail}`} className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                    <Mail className="inline-block w-4 h-4 mr-2" />{contactEmail}
                  </a>
                </li>
              )}
              {siteAddress && (
                <li>
                  <span className="text-gray-700 flex items-start">
                    <MapPin className="inline-block w-4 h-4 mt-1 mr-2" />
                    {siteAddress}
                  </span>
                </li>
              )}
              {/* Fallback if no contact info from settings */}
              {(!contactPhone && !contactEmail && !siteAddress) && !overallLoading && (
                <li><span className="text-gray-500 text-sm">Contact info not available.</span></li>
              )}
            </ul>

            {/* Social Media Links */}
            <div className="flex justify-start space-x-3 mt-4">
              {facebookUrl && facebookUrl !== '#' && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-400">
                  <Facebook className="inline-block w-5 h-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {twitterUrl && twitterUrl !== '#' && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-400">
                  <Twitter className="inline-block w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {instagramUrl && instagramUrl !== '#' && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-400">
                  <Instagram className="inline-block w-5 h-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {linkedinUrl && linkedinUrl !== '#' && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-400">
                  <Linkedin className="inline-block w-5 h-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              {youtubeUrl && youtubeUrl !== '#' && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-400">
                  <Youtube className="inline-block w-5 h-5" />
                  <span className="sr-only">YouTube</span>
                </a>
              )}
            </div>

            {/* MANDATORY DISCLOSURE IMAGE & LINK DISPLAY */}
            {(mandatoryDisclosureImageUrl && mandatoryDisclosureLinkUrl) && (
              <a href={mandatoryDisclosureLinkUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex justify-end">
                <img
                  src={mandatoryDisclosureImageUrl}
                  alt="Mandatory Disclosure"
                  className="h-16"
                  onError={(e) => {
                    console.error(`Failed to load image: ${(e.target as HTMLImageElement).src}`);
                  }}
                />
              </a>
            )}
          </div>
        </div>

        {/* Copyright and Power By section */}
        <div className="border-t border-gray-300 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p className="mb-2 md:mb-0">
            © {currentYear} <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">{collegeName}</Link> || All Right Reserved.
          </p>
          <p>
            Powered by {' '}
            <a href={developerWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
              {developerName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;