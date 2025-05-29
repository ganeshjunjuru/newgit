import React, { useEffect } from 'react';
import { useScrollingTextStore } from '../../store/scrollingTextStore'; // Adjust path based on your project structure

// Props interface for the ScrollingTextBar component
interface ScrollingTextBarProps {
  speed?: 'slow' | 'normal' | 'fast'; // Optional: scrolling speed (default: 'normal')
  backgroundColor?: string; // Optional: background color (default: '#0b3d64' - dark blue)
  textColor?: string; // Optional: text color (default: '#ffffff' - white)
}

const ScrollingTextBar: React.FC<ScrollingTextBarProps> = ({
  speed = 'normal',
  backgroundColor = '#0b3d64', // Default background color from the image
  textColor = '#ffffff',     // Default text color from the image
}) => {
  // Use the Zustand store to get texts, loading state, and the fetch function
  const { texts, isLoading, error, fetchScrollingTexts } = useScrollingTextStore();

  // Fetch texts when the component mounts
  useEffect(() => {
    fetchScrollingTexts();
  }, [fetchScrollingTexts]); // Dependency array ensures it runs only when fetchScrollingTexts changes

  // Define animation durations based on speed prop
  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow':
        return '40s'; // Slower scroll
      case 'fast':
        return '15s'; // Faster scroll
      case 'normal':
      default:
        return '25s'; // Default scroll speed
    }
  };

  const animationDuration = getAnimationDuration();

  // --- Handle Loading, Error, and No Texts States ---
  if (isLoading) {
    // Optionally render a simple bar with a loading message
    return (
      <div
        className="w-full py-2 flex items-center justify-center"
        style={{ backgroundColor: backgroundColor, color: textColor }}
      >
        <p>Loading announcements...</p>
      </div>
    );
  }

  if (error) {
    // Optionally render a bar with an error message
    return (
      <div
        className="w-full py-2 flex items-center justify-center"
        style={{ backgroundColor: backgroundColor, color: 'red' }}
      >
        <p>Error loading announcements: {error}</p>
      </div>
    );
  }

  if (texts.length === 0) {
    // Optionally render a bar with a "no announcements" message
    return (
      <div
        className="w-full py-2 flex items-center justify-center"
        style={{ backgroundColor: backgroundColor, color: textColor }}
      >
        <p>No new announcements.</p>
      </div>
    );
  }

  // Combine all texts into a single string for continuous scrolling
  // Separating them with ' | ' for readability
  const combinedText = texts.map(item => item.text_content).join(' | ');

  return (
    // Outer container for the scrolling bar, ensuring full width and overflow hidden
    <div
      className="w-full overflow-hidden py-2"
      style={{ backgroundColor: backgroundColor }} // Apply custom background color
    >
      {/* Inner container for the text, which will be animated */}
      {/* Uses flexbox to allow text repetition and applies the scrolling animation */}
      <div
        className="flex whitespace-nowrap" // Prevents text from wrapping
        style={{
          animation: `scrollText ${animationDuration} linear infinite`, // Apply CSS animation
        }}
      >
        {/* Repeat the combined text multiple times to ensure continuous scrolling without gaps */}
        {/* Adjust the number of repetitions based on the length of your combined text and desired smoothness */}
        {[...Array(3)].map((_, i) => ( // Repeat the combined text 3 times
          <span key={i} className="px-8 text-lg font-medium" style={{ color: textColor }}>
            {combinedText}
          </span>
        ))}
      </div>

      {/* Define the CSS animation keyframes */}
      <style>{`
        @keyframes scrollText {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%); /* Scrolls the text completely to the left */
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollingTextBar;