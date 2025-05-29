import React, { useEffect } from 'react';
import { useVisionMissionStore } from '../../store/visionMissionStore'; // Adjust path if needed

const VisionMissionSection: React.FC = () => {
  const { vision, mission, isLoading, error, fetchVisionMission } = useVisionMissionStore(
    (state) => ({
      vision: state.vision,
      mission: state.mission,
      isLoading: state.isLoading,
      error: state.error,
      fetchVisionMission: state.fetchVisionMission,
    })
  );

  useEffect(() => {
    // Only fetch if not already loading and data hasn't been loaded yet.
    // This also implicitly handles the case where error is true, preventing re-fetching on error.
    if (!isLoading && !vision && !mission && !error) {
      console.log('VisionMissionSection: Initiating fetch for Vision & Mission data.');
      fetchVisionMission();
    }
  }, [isLoading, vision, mission, error, fetchVisionMission]);

  // --- Strict Conditional Rendering ---
  // If still loading, or an error occurred, or (after loading) no active vision OR no active mission data is found,
  // the entire component will return null, showing nothing at all.
  if (isLoading || error || (!vision && !mission)) {
    console.log('VisionMissionSection: Not rendering based on conditions.');
    if (isLoading) console.log('Reason: Still loading.');
    if (error) console.log('Reason: Error occurred:', error);
    if (!vision && !mission) console.log('Reason: No active Vision or Mission data available.');
    return null; // Return null to render nothing
  }

  // If we reach here, it means:
  // - isLoading is false
  // - error is null
  // - AND (vision is NOT null OR mission is NOT null)
  // So, at least one active piece of data is available to display.

  return (
    <section className="py-16 font-inter">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Our Vision Card - Renders ONLY if 'vision' data is available and active */}
          {vision && (
            <div className="bg-gray-800 text-white p-10 rounded-lg shadow-xl text-center">
              {/* Optional: Display icon_image if available */}
              {vision.icon_image && (
                <img
                  src={vision.icon_image}
                  alt={vision.type + " icon"}
                  className="mx-auto mb-4 w-20 h-20 object-contain"
                />
              )}
              <h2 className="text-4xl font-extrabold mb-6">Our Vision</h2> {/* Original static title */}
              <p className="text-lg leading-relaxed opacity-90">
                {vision.content} {/* Dynamic content from the store */}
              </p>
            </div>
          )}

          {/* Our Mission Card - Renders ONLY if 'mission' data is available and active */}
          {mission && (
            <div className="bg-red-800 text-white p-10 rounded-lg shadow-xl text-center">
              {/* Optional: Display icon_image if available */}
              {mission.icon_image && (
                <img
                  src={mission.icon_image}
                  alt={mission.type + " icon"}
                  className="mx-auto mb-4 w-20 h-20 object-contain"
                />
              )}
              <h2 className="text-4xl font-extrabold mb-6">Our Mission</h2> {/* Original static title */}
              <p className="text-lg leading-relaxed opacity-90">
                {mission.content} {/* Dynamic content from the store */}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;