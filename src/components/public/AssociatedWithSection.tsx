import React, { useEffect } from 'react';
import { useAssociatedWithStore } from '../../store/associatedWithStore'; // Import the new store

const AssociatedWithSection: React.FC = () => {
  // Access state and action from the Zustand store
  const { associatedEntities, isLoading, error, fetchAssociatedEntities } = useAssociatedWithStore(
    (state) => ({
      associatedEntities: state.associatedEntities,
      isLoading: state.isLoading,
      error: state.error,
      fetchAssociatedEntities: state.fetchAssociatedEntities,
    })
  );


  useEffect(() => {
    // Fetch associated entities when the component mounts.
    // Ensure we only fetch if not already loading and no entities are present,
    // and no prior error occurred.
    if (!isLoading && associatedEntities.length === 0 && !error) {
      console.log('AssociatedWithSection: Initiating fetch for associated entities.');
      fetchAssociatedEntities();
    }
  }, [isLoading, associatedEntities.length, error, fetchAssociatedEntities]);

  // --- Conditional Rendering for the entire section ---
  // If still loading, an error occurred, or no active entities are found (after loading),
  // the entire section will not be rendered (returns null).
  if (isLoading || error || associatedEntities.length === 0) {
    console.log('AssociatedWithSection: Not rendering based on conditions.');
    if (isLoading) console.log('Reason: Still loading associated entities.');
    if (error) console.log('Reason: Error loading associated entities:', error);
    if (associatedEntities.length === 0) console.log('Reason: No active associated entities found.');
    return null; // Return null to render nothing
  }

  // If we reach here, it means:
  // - isLoading is false
  // - error is null
  // - AND associatedEntities has at least one item (meaning active data is available)

  return (
    <section className="py-20 bg-gray-50 font-inter">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          {/* Enhanced Decorative lines and title */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex-grow border-t-2 border-blue-200 w-1/4"></div>
            <h2 className="text-4xl font-extrabold text-gray-800 mx-6 uppercase tracking-wider">
              ASSOCIATED WITH
            </h2>
            <div className="flex-grow border-t-2 border-blue-200 w-1/4"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our commitment to excellence is reflected in our proud associations with leading national bodies and initiatives.
          </p>
        </div>

        {/* Logos Grid - Now maps dynamically fetched associatedEntities */}
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-20">
          {associatedEntities.map((entity) => ( // Use dynamic 'entity' instead of 'logo'
            <div
              key={entity.id} // Use entity.id as key for better performance and stability
              className="flex-shrink-0 p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Conditional rendering for logo and website link */}
              {entity.logo ? ( // Only render image if logo URL exists
                entity.website ? ( // If website exists, wrap image in an anchor tag
                  <a href={entity.website} target="_blank" rel="noopener noreferrer">
                    <img
                      src={entity.logo}
                      alt={entity.name || 'Associated Entity Logo'} // Use entity name for alt text
                      className="h-24 md:h-28 lg:h-32 w-auto object-contain"
                    />
                  </a>
                ) : ( // If no website, just render the image
                  <img
                    src={entity.logo}
                    alt={entity.name || 'Associated Entity Logo'}
                    className="h-24 md:h-28 lg:h-32 w-auto object-contain"
                  />
                )
              ) : (
                // Fallback if no logo URL is provided for the entity
                <div className="h-24 md:h-28 lg:h-32 w-24 md:w-28 lg:w-32 flex items-center justify-center bg-gray-200 text-gray-500 text-xs text-center rounded">
                  No Logo
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssociatedWithSection;