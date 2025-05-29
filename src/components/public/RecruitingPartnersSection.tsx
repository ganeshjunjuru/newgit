import React, { useEffect } from 'react';
import { useRecruitingPartnersStore } from '../../store/recruitingPartnersStore'; // Adjust path if needed

const RecruitingPartnersSection: React.FC = () => {
  // Access state and action from the Zustand store
  const { recruitingPartners, isLoading, error, fetchRecruitingPartners } = useRecruitingPartnersStore(
    (state) => ({
      recruitingPartners: state.recruitingPartners,
      isLoading: state.isLoading,
      error: state.error,
      fetchRecruitingPartners: state.fetchRecruitingPartners,
    })
  );

  useEffect(() => {
    // Fetch recruiting partners when the component mounts.
    // This condition prevents unnecessary re-fetches if data is already available or loading,
    // and also respects if a prior error occurred.
    if (!isLoading && recruitingPartners.length === 0 && !error) {
      console.log('RecruitingPartnersSection: Initiating fetch for recruiting partners.');
      fetchRecruitingPartners();
    }
  }, [isLoading, recruitingPartners.length, error, fetchRecruitingPartners]); // Dependencies

  // --- Strict Conditional Rendering for the entire section ---
  // If still loading, an error occurred, or no active recruiting partners are found (after loading),
  // the entire section will not be rendered (returns null).
  if (isLoading || error || recruitingPartners.length === 0) {
    console.log('RecruitingPartnersSection: Not rendering based on conditions.');
    if (isLoading) console.log('Reason: Still loading recruiting partners.');
    if (error) console.log('Reason: Error loading recruiting partners:', error);
    if (recruitingPartners.length === 0) console.log('Reason: No active recruiting partners found.');
    return null; // Return null to render nothing
  }

  // If we reach here, it means:
  // - isLoading is false
  // - error is null
  // - AND recruitingPartners has at least one item (meaning active data is available)

  // Duplicate the fetched partners to create a seamless infinite scroll effect
  // This is done ONLY if there are partners to show.
  const duplicatedPartners = [...recruitingPartners, ...recruitingPartners];

  // Calculate animation duration based on the number of original partners for consistent speed
  // Adjust the multiplier (e.g., 3s per partner) as needed for desired scroll speed
  const scrollDuration = recruitingPartners.length * 4; // Increased to 4s for potentially slower scroll

  return (
    <section className="py-16 bg-white font-inter">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-grow border-t-2 border-blue-200 w-1/4"></div>
            <h2 className="text-4xl font-extrabold text-gray-800 mx-6 uppercase tracking-wider">
              OUR RECRUITING PARTNERS
            </h2>
            <div className="flex-grow border-t-2 border-blue-200 w-1/4"></div>
          </div>
        </div>

        {/* Logos Carousel Container */}
        <div className="overflow-hidden relative py-8">
          {/* The inner container for logos that will scroll */}
          <div className="flex whitespace-nowrap scrolling-logos-container group">
            {duplicatedPartners.map((partner, index) => (
              <div
                // Using index as key is acceptable here because duplicatedPartners is stable
                // and derived from the main recruitingPartners which has unique IDs.
                // However, if the list can change frequently during runtime, a more robust key
                // might be needed, but for a carousel, index is often sufficient.
                key={`${partner.id}-${index}`} // Combine ID and index for unique key across duplicates
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                {/* Conditional rendering for partner image and website link */}
                {partner.image ? ( // Only render image if image URL exists
                  partner.website ? ( // If website exists, wrap image in an anchor tag
                    <a href={partner.website} target="_blank" rel="noopener noreferrer">
                      <img
                        src={partner.image}
                        alt={partner.name || 'Recruiting Partner Logo'} // Use partner name for alt text
                        className="h-16 md:h-20 lg:h-24 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </a>
                  ) : ( // If no website, just render the image
                    <img
                      src={partner.image}
                      alt={partner.name || 'Recruiting Partner Logo'}
                      className="h-16 md:h-20 lg:h-24 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  )
                ) : (
                  // Fallback if no image URL is provided for the partner
                  <div className="h-16 md:h-20 lg:h-24 w-auto min-w-[120px] flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center rounded p-2">
                    {partner.name || 'No Image'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for scrolling animation and hover effects */}
      {/* Moved style tag inside component for direct access to scrollDuration */}
      <style jsx>{`
        @keyframes scrollPartners {
          0% {
            transform: translateX(0%);
          }
          100% {
            /* Scrolls exactly half the width of the duplicated content, creating a seamless loop */
            transform: translateX(-50%);
          }
        }

        .scrolling-logos-container {
          animation: scrollPartners ${scrollDuration}s linear infinite;
          transform: translateZ(0); /* Force hardware acceleration */
          will-change: transform; /* Hint to browser for optimization */
        }

        /* Pause animation on hover */
        .scrolling-logos-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default RecruitingPartnersSection;