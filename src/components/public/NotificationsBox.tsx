import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationsStore } from '../../store/notificationsStore'; // Import the notifications store
import { Notification } from '../types'; // Import the Notification interface

const NotificationsBox: React.FC = () => {
  // Access state and action from the Zustand store
  const { notifications, isLoading, error, fetchNotifications } = useNotificationsStore(
    (state) => ({
      notifications: state.notifications,
      isLoading: state.isLoading,
      error: state.error,
      fetchNotifications: state.fetchNotifications,
    })
  );

  const listRef = useRef<HTMLUListElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  // Add a state to track if the initial fetch attempt has completed
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Only attempt to fetch if not already loading, no data, and no prior error
    if (!isLoading && notifications.length === 0 && !error) {
      console.log('NotificationsBox: Initiating fetch for notifications.');
      fetchNotifications().then(() => {
        // Set hasFetched to true once the fetch (success or failure) completes
        setHasFetched(true);
      });
    } else if (!isLoading && (notifications.length > 0 || error)) {
      // If loading is complete and we either have data or an error, mark as fetched
      if (!hasFetched) { // Prevent re-setting if already true
        setHasFetched(true);
      }
    }
  }, [isLoading, notifications.length, error, fetchNotifications, hasFetched]);

  // Effect to calculate the necessary scroll distance after notifications are loaded
  useEffect(() => {
    const calculateAndSetScrollDistance = () => {
      // Only calculate if there are notifications to display
      if (listRef.current && notifications.length > 0) {
        let totalHeightOfOneSet = 0;
        const children = Array.from(listRef.current.children);
        // Sum heights of the first 'notifications.length' children
        for (let i = 0; i < notifications.length; i++) {
          const child = children[i] as HTMLElement;
          if (child) {
            totalHeightOfOneSet += child.offsetHeight;
            if (i < notifications.length - 1) {
              const style = window.getComputedStyle(child);
              totalHeightOfOneSet += parseFloat(style.marginBottom);
            }
          }
        }
        setScrollDistance(totalHeightOfOneSet);
      }
    };

    calculateAndSetScrollDistance();
    window.addEventListener('resize', calculateAndSetScrollDistance);

    return () => window.removeEventListener('resize', calculateAndSetScrollDistance);
  }, [notifications]); // Dependency array ensures it runs when notifications data changes

  // Helper function to determine if a notification is "new" (e.g., within the last 7 days)
  const isNewNotification = (notificationDateStr: string | null): boolean => {
    if (!notificationDateStr) return false;
    try {
      const notificationDate = new Date(notificationDateStr);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return notificationDate >= sevenDaysAgo;
    } catch (e) {
      console.error("Error parsing notification date:", notificationDateStr, e);
      return false;
    }
  };

  // --- Determine content to display inside the box ---
  let boxContent;

  // Only show "No Latest Notifications" or error if fetch has already completed
  if (hasFetched && notifications.length === 0) {
    boxContent = (
      <div className="flex flex-col justify-center items-center h-full text-gray-500 text-center p-4">
        <p className="text-lg font-semibold mb-2">No Latest Notifications Available</p>
        <p className="text-sm">Keep checking this space!</p>
      </div>
    );
  } else if (hasFetched && error) {
      boxContent = (
        <div className="flex justify-center items-center h-full text-red-600 text-center">
          Error loading notifications.
        </div>
      );
  } else if (notifications.length > 0) {
    // If we have data, prepare for scrolling
    const duplicatedItems: Notification[] = [...notifications, ...notifications];
    const pixelsPerSecond = 40; // Adjust for scroll speed
    const scrollDuration = scrollDistance > 0 ? scrollDistance / pixelsPerSecond : 0;

    boxContent = (
      <>
        {/* Increased height here: h-[320px] from h-[240px] */}
        <div className="overflow-hidden h-[320px]">
          <ul ref={listRef} className="space-y-4 scrolling-list group">
            {duplicatedItems.map((item, index) => (
              <li
                key={`${item.id}-${index}`} // Unique key for duplicated items
                className={`p-4 rounded-md shadow-sm border border-gray-200 min-h-[80px] transition-all duration-200 hover:shadow-md hover:border-blue-200 relative
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {item.link ? (
                  <Link to={item.link} className="flex flex-col justify-between text-gray-700 h-full w-full no-underline">
                    <div className="flex items-start">
                      <span className="blinking-text flex-1 overflow-wrap-anywhere pr-2">{item.text}</span>
                      {isNewNotification(item.date) && (
                        <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full flex-shrink-0">New</span>
                      )}
                    </div>
                    {item.date && (
                      <span className="text-xs text-gray-500 self-start mt-1">Date: {item.date}</span>
                    )}
                    <span className="text-xs text-blue-700 font-extrabold self-end mt-2">Click here</span>
                  </Link>
                ) : (
                  <div className="flex flex-col justify-between text-gray-700 h-full w-full">
                     <div className="flex items-start">
                      <span className="blinking-text flex-1 overflow-wrap-anywhere pr-2">{item.text}</span>
                      {isNewNotification(item.date) && (
                        <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full flex-shrink-0">New</span>
                      )}
                    </div>
                    {item.date && (
                      <span className="text-xs text-gray-500 self-start mt-1">Date: {item.date}</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* CSS for blinking animation, word wrapping, and scrolling */}
        <style jsx>{`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.1; }
            100% { opacity: 1; }
          }

          .blinking-text {
            animation: blink 1.5s linear infinite;
          }

          .overflow-wrap-anywhere {
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-${scrollDistance}px); }
          }

          .scrolling-list {
            animation: scrollUp ${scrollDuration}s linear infinite;
            transform: translateZ(0);
            will-change: transform;
          }

          .scrolling-list:hover {
            animation-play-state: paused;
          }
        `}</style>
      </>
    );
  } else {
    // If it's still fetching initially, show an empty space
    boxContent = (
      <div className="flex justify-center items-center h-full text-gray-400">
        &nbsp;
      </div>
    );
  }

  return (
    // Increased height here: h-[400px] from h-[320px]
    <div className="lg:col-span-1 border-2 border-blue-100 rounded-lg p-6 shadow-xl bg-white h-[400px] flex flex-col">
      <h3 className="font-serif text-xl font-bold text-gray-800 mb-4 border-b pb-2">Notice Board</h3>
      {boxContent}
    </div>
  );
};

export default NotificationsBox;