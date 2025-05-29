import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  FileText,
  GraduationCap,
  BarChart,
  MessageSquareText,
  UserSquare,
  Lightbulb,
  Handshake,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  ChevronDown, // For dropdown arrow
  ChevronUp,    // For dropdown arrow
  Building2      // Added Building2 import for 'Homepage Content' icon
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Define a type for a navigation item, supporting nested items
interface NavItem {
  name: string;
  path?: string; // Path is optional for parent items
  icon: React.ReactNode;
  children?: NavItem[]; // Optional children for nested menus
}

// Props for AdminSidebar, now including collapse state and toggle function
interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void; // Keeping this prop in case it's used for other internal toggles
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { logout } = useAuthStore();

  // State to manage the expanded/collapsed status of menu groups (e.g., "Homepage Content")
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Homepage Content': true, // Keep Homepage Content expanded by default
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />
    },
	
	{
      name: 'Add Popup Notification',
      path: '/admin/add-popup',
      icon: <Briefcase size={20} />
    },
	
	
    {
      name: 'Homepage Content',
      icon: <Building2 size={20} />, // Using Building2 for general college content
      children: [
        { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={20} /> },
        { name: 'Circulars', path: '/admin/circulars', icon: <FileText size={20} /> },
        { name: 'Courses', path: '/admin/courses', icon: <GraduationCap size={20} /> },
        { name: 'Quick Stats', path: '/admin/quick-stats', icon: <BarChart size={20} /> },
        { name: "Director's Message", path: '/admin/directors-message', icon: <MessageSquareText size={20} /> },
        { name: "Principal's Message", path: '/admin/principals-message', icon: <UserSquare size={20} /> },
        { name: 'Vision & Mission', path: '/admin/vision-mission', icon: <Lightbulb size={20} /> },
        { name: 'Associations', path: '/admin/associations', icon: <Handshake size={20} /> },
        { name: 'Recruiting Partners', path: '/admin/recruiting-partners', icon: <Briefcase size={20} /> },
        { name: 'Contact Queries', path: '/admin/contact-queries', icon: <Mail size={20} /> },
      ]
    },
	
	{
      name: 'About Page',
      icon: <Building2 size={20} />, // Using Building2 for general college content
      children: [
        { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={20} /> },
        
      ]
    },
	
	{
      name: 'Administration',
      icon: <Building2 size={20} />, // Using Building2 for general college content
      children: [
        { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={20} /> },
        
      ]
    },
	
	{
      name: 'Contact Us',
      icon: <Building2 size={20} />, // Using Building2 for general college content
      children: [
        { name: 'Contact Us', path: '/admin/contact-us', icon: <Bell size={20} /> },
        
      ]
    },

	
	
	{
      name: 'Whatsapp Integration',
      icon: <Building2 size={20} />, // Using Building2 for general college content
      children: [
        { name: 'Notifications', path: '/admin/whatsapp-integration', icon: <Bell size={20} /> },
        
      ]
    },
	
	
	{
      name: 'Leads',
      path: '/admin/leads',
      icon: <Briefcase size={20} />
    },
	
	

	
	{
      name: 'Raise Ticket',
      path: '/admin/raise-ticket',
      icon: <Briefcase size={20} />
    },
	

	
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    // Sidebar container: width changes based on isCollapsed prop
    <div className={`bg-gray-900 h-screen shadow-2xl flex flex-col text-white
      ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out`}>

      {/* Top Section: College Logo, Admin Title, and Collapse Button */}
      <div className="py-4 px-4 border-b border-gray-800 flex items-center justify-center flex-shrink-0">
        <Link to="/admin/dashboard" className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'w-auto'}`}>
          {/* College Logo */}
          <img
            src="https://placehold.co/50x50/FFFFFF/000000?text=LOGO" // Placeholder for college logo
            alt="College Logo"
            className={`w-12 h-12 object-cover rounded-full mb-2 border-2 border-gray-600 ${isCollapsed ? 'mr-0' : 'mr-3'}`}
          />
          {/* Admin Title - hidden when collapsed */}
          {!isCollapsed && (
            <span className="font-serif text-lg font-bold text-white tracking-wide whitespace-nowrap">Sreepaada Admin</span>
          )}
        </Link>
        {/* Collapse/Expand Button is removed from here as it's now in AdminLayout */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.children ? ( // If item has children, it's a collapsible group
                <>
                  <button
                    onClick={() => toggleGroup(item.name)}
                    className={`w-full flex items-center py-2.5 rounded-lg text-sm font-medium justify-between
                      text-gray-100 hover:bg-gray-700 transition-colors duration-200
                      ${isCollapsed ? 'px-2 justify-center' : 'px-4'}`} // Adjust padding for collapsed state
                  >
                    <span className="flex items-center">
                      <span className={`${isCollapsed ? 'mr-0' : 'mr-3'}`}>{item.icon}</span>
                      {!isCollapsed && item.name} {/* Hide name when collapsed */}
                    </span>
                    {!isCollapsed && ( // Hide chevron when collapsed
                      expandedGroups[item.name] ? <ChevronUp size={16} className="text-white" /> : <ChevronDown size={16} className="text-white" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                      ${expandedGroups[item.name] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <ul className={`mt-1 space-y-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}> {/* Indent children */}
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path!}
                            className={`flex items-center py-2.5 rounded-lg text-sm font-medium
                              ${isActive(child.path!)
                                ? 'bg-gray-700 text-white shadow-md'
                                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                              } transition-colors duration-200
                              ${isCollapsed ? 'px-2 justify-center' : 'px-4'}`} // Adjust padding for collapsed state
                          >
                            <span className={`${isCollapsed ? 'mr-0' : 'mr-3'}`}>{child.icon}</span>
                            {!isCollapsed && child.name} {/* Hide name when collapsed */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : ( // Regular navigation item
                <Link
                  to={item.path!}
                  className={`flex items-center py-2.5 rounded-lg text-sm font-medium
                    ${isActive(item.path!)
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-gray-100 hover:bg-gray-700 hover:text-white'
                    } transition-colors duration-200
                    ${isCollapsed ? 'px-2 justify-center' : 'px-4'}`} // Adjust padding for collapsed state
                >
                  <span className={`${isCollapsed ? 'mr-0' : 'mr-3'}`}>{item.icon}</span>
                  {!isCollapsed && item.name} {/* Hide name when collapsed */}
                </Link>
              )}
            </li>
          ))}

          {/* Logout Button */}
          <li className="mt-8">
            <button
              onClick={logout}
              className={`w-full flex items-center py-2.5 rounded-lg text-sm font-medium
                text-gray-100 hover:bg-red-700 hover:text-white transition-colors duration-200
                ${isCollapsed ? 'px-2 justify-center' : 'px-4'}`} // Adjust padding for collapsed state
            >
              <span className={`${isCollapsed ? 'mr-0' : 'mr-3'}`}><LogOut size={20} /></span>
              {!isCollapsed && 'Log Out'} {/* Hide text when collapsed */}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
