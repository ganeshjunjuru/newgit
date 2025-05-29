import React, { useState, useEffect } from 'react';

// Define the props for the WebsiteLoadPopup component
interface WebsiteLoadPopupProps {
  // Content to display in the popup
  // You can choose to pass an image URL, a video URL, or just a message
  imageUrl?: string;
  videoUrl?: string; // For YouTube or other embeddable videos
  message?: string;

  // Control when the popup appears
  showOncePerSession?: boolean; // If true, only shows once per browser session
  showOncePerDay?: boolean;     // If true, only shows once per day (uses localStorage)
  delay?: number;               // Delay in milliseconds before showing the popup (default: 500ms)
}

const WebsiteLoadPopup: React.FC<WebsiteLoadPopupProps> = ({
  imageUrl,
  videoUrl,
  message,
  showOncePerSession = false,
  showOncePerDay = false,
  delay = 500,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopupSession = sessionStorage.getItem('hasSeenPopupSession');
    const lastSeenPopupDay = localStorage.getItem('lastSeenPopupDay');
    const today = new Date().toDateString(); // "Fri May 24 2025"

    let shouldShow = true;

    if (showOncePerSession && hasSeenPopupSession) {
      shouldShow = false;
    }

    if (showOncePerDay && lastSeenPopupDay === today) {
      shouldShow = false;
    }

    if (shouldShow) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        if (showOncePerSession) {
          sessionStorage.setItem('hasSeenPopupSession', 'true');
        }
        if (showOncePerDay) {
          localStorage.setItem('lastSeenPopupDay', today);
        }
      }, delay);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [delay, showOncePerSession, showOncePerDay]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null; // Don't render anything if the popup is not open
  }

  return (
    // Overlay for the popup
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-inter">
      {/* Popup content container */}
      <div className="bg-white rounded-lg shadow-2xl p-6 relative max-w-lg w-full max-h-[90vh] overflow-y-auto transform scale-100 animate-fade-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
          aria-label="Close popup"
        >
          &times;
        </button>

        {/* Dynamic content rendering */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Popup content"
            className="w-full h-auto rounded-md mb-4 object-contain"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x300/E0F2F7/000000?text=Image+Not+Found'; // Fallback
            }}
          />
        )}

        {videoUrl && (
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
            <iframe
              src={videoUrl}
              title="Popup Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-md mb-4"
            ></iframe>
          </div>
        )}

        {message && (
          <p className="text-gray-800 text-lg text-center mb-4">{message}</p>
        )}

        {/* Optional: Add a button or link inside the popup */}
        {/*
        <div className="text-center">
          <a href="/some-page" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Learn More
          </a>
        </div>
        */}
      </div>

      {/* CSS for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WebsiteLoadPopup;
