import React, { useState } from 'react';
import { Phone, Facebook, Instagram, ArrowLeft, ArrowRight } from 'lucide-react';

interface FloatingActionBarProps {
  position?: 'left' | 'right';
  items?: {
    id: string;
    icon: React.ElementType;
    color: string;
    link: string;
    newTab?: boolean;
    label: string;
  }[];
}

const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  position = 'left',
  items = [
    { id: 'phone', icon: Phone, color: '#32CD32', link: 'tel:+1234567890', label: 'Call Us' },
    { id: 'facebook', icon: Facebook, color: '#3b5998', link: 'https://facebook.com/yourpage', newTab: true, label: 'Facebook' },
    { id: 'instagram', icon: Instagram, color: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', newTab: true, label: 'Instagram' },
  ]
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default for a cleaner initial look

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior (scrolling to top)
    setIsCollapsed(!isCollapsed);
  };

  const toggleIcon =
    position === 'left'
      ? (isCollapsed ? ArrowRight : ArrowLeft)
      : (isCollapsed ? ArrowLeft : ArrowRight); // Logic unchanged for icon direction

  return (
    <nav className={`floating-action-bar-container ${position} ${isCollapsed ? 'collapsed' : ''}`} aria-label="Quick Links Menu">
      <ul className="floating-action-bar-inner">
        {/* Toggle Button - Now a list item containing a button-like element */}
        <li className="fab-item-wrapper">
          <button
            onClick={handleToggleCollapse}
            className="fab-item fab-toggle-btn"
            style={{ background: '#000' }}
            aria-label={isCollapsed ? 'Expand quick links menu' : 'Collapse quick links menu'}
            aria-expanded={!isCollapsed}
          >
            <IconComponent icon={toggleIcon} size={24} strokeWidth={2} /> {/* Slightly smaller icon */}
          </button>
        </li>

        {/* Other items, conditionally rendered */}
        {!isCollapsed && (
          <>
            {items.map(item => {
              const IconComponent = item.icon;
              return (
                <li key={item.id} className="fab-item-wrapper">
                  <a
                    href={item.link}
                    className="fab-item"
                    style={{ background: item.color }}
                    target={item.newTab ? '_blank' : '_self'}
                    rel={item.newTab ? 'noopener noreferrer' : ''}
                    aria-label={item.label}
                  >
                    <IconComponent size={24} strokeWidth={2} /> {/* Consistent icon size */}
                  </a>
                </li>
              );
            })}
          </>
        )}
      </ul>
    </nav>
  );
};

// Helper component for rendering Lucid Icons
const IconComponent: React.FC<{ icon: React.ElementType; size: number; strokeWidth: number }> = ({ icon: Icon, size, strokeWidth }) => (
  <Icon size={size} strokeWidth={strokeWidth} />
);

export default FloatingActionBar;