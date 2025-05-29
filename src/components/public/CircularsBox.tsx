import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCircularsStore } from '../../store/circularsStore';
import { Circular } from '../types'; // Assuming this is defined correctly

const CircularsBox: React.FC = () => {
  // Destructure directly from the store for cleaner access
  const { circulars, isLoading, error, fetchCirculars } = useCircularsStore(
    (state) => ({
      circulars: state.circulars,
      isLoading: state.isLoading,
      error: state.error,
      fetchCirculars: state.fetchCirculars,
    })
  );

  const listRef = useRef<HTMLUListElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // --- FIX START ---
  // This useEffect will run only once when the component mounts.
  useEffect(() => {
    // Only fetch if we are not already loading and don't have circulars yet.
    // Zustand's isLoading will prevent redundant fetches if fetchCirculars is called properly within the store.
    if (circulars.length === 0 && !isLoading && !error) {
      console.log('CircularsBox: Initiating fetch for circulars.');
      fetchCirculars();
    }
  }, [fetchCirculars, circulars.length, isLoading, error]); // Add circulars.length, isLoading, error as dependencies
  // We add these dependencies so if, for some reason, the state changes to indicate no data,
  // or an error, or loading completes without data, it might re-evaluate.
  // However, the primary control is inside `fetchCirculars` in your Zustand store.
  // The goal is that `fetchCirculars` itself should prevent duplicate API calls if one is already in progress.
  // --- FIX END ---


  // This effect calculates scroll distance when circulars change or window resizes.
  useEffect(() => {
    const calculateAndSetScrollDistance = () => {
      if (listRef.current && circulars.length > 0) {
        let totalHeightOfOneSet = 0;
        const children = Array.from(listRef.current.children);
        // Only calculate for the first set of circulars, not the duplicated ones
        for (let i = 0; i < circulars.length; i++) {
          const child = children[i] as HTMLElement;
          if (child) {
            totalHeightOfOneSet += child.offsetHeight;
            if (i < circulars.length - 1) {
              const style = window.getComputedStyle(child);
              totalHeightOfOneSet += parseFloat(style.marginBottom);
            }
          }
        }
        setScrollDistance(totalHeightOfOneSet);
      }
    };

    // Recalculate on initial render and when circulars data is available/changes
    calculateAndSetScrollDistance();

    // Add event listener for window resize
    window.addEventListener('resize', calculateAndSetScrollDistance);

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', calculateAndSetScrollDistance);
  }, [circulars]); // Dependency: Recalculate if circulars array changes

  const isNewCircular = (circularDateStr: string | null): boolean => {
    if (!circularDateStr) return false;
    try {
      const circularDate = new Date(circularDateStr);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Go back 7 days
      return circularDate >= sevenDaysAgo;
    } catch (e) {
      console.error("Error parsing circular date:", circularDateStr, e);
      return false;
    }
  };

  let boxContent;

  if (isLoading) {
    boxContent = (
      <div className="flex justify-center items-center h-full text-gray-400">
        <p>Loading circulars...</p>
      </div>
    );
  } else if (error) {
    boxContent = (
      <div className="flex justify-center items-center h-full text-red-600 text-center">
        Error loading circulars.
      </div>
    );
  } else if (circulars.length === 0) {
    boxContent = (
      <div className="flex flex-col justify-center items-center h-full text-gray-500 text-center p-4">
        <p className="text-lg font-semibold mb-2">No Latest Circulars Available</p>
        <p className="text-sm">Keep checking this space!</p>
      </div>
    );
  } else {
    // Duplicated items for continuous scrolling effect
    const duplicatedItems: Circular[] = [...circulars, ...circulars];
    const pixelsPerSecond = 40; // Adjust speed as needed
    const scrollDuration = scrollDistance > 0 ? scrollDistance / pixelsPerSecond : 0;

    boxContent = (
      <>
        <div className="overflow-hidden h-[320px]">
          <ul ref={listRef} className="space-y-4 scrolling-list group">
            {duplicatedItems.map((item, index) => (
              <li
                key={`${item.id}-${index}`} // Use a combined key for uniqueness
                className={`p-4 rounded-md shadow-sm border border-gray-200 min-h-[80px] transition-all duration-200 hover:shadow-md hover:border-blue-200 relative
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {item.link ? (
                  <Link to={item.link} target="_blank" rel="noopener noreferrer" className="flex flex-col justify-between text-gray-700 h-full w-full no-underline">
                    <div className="flex items-start">
                      <span className="blinking-text flex-1 overflow-wrap-anywhere pr-2">{item.text}</span>
                      {isNewCircular(item.date) && (
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
                      {isNewCircular(item.date) && (
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
            transform: translateZ(0); /* Hardware acceleration */
            will-change: transform; /* Hint to browser */
          }

          .scrolling-list:hover {
            animation-play-state: paused;
          }
        `}</style>
      </>
    );
  }

  return (
    <div className="lg:col-span-1 border-2 border-blue-100 rounded-lg p-6 shadow-xl bg-white h-[400px] flex flex-col">
      <h3 className="font-serif text-xl font-bold text-gray-800 mb-4 border-b pb-2">Circulars</h3>
      {boxContent}
    </div>
  );
};

export default CircularsBox;