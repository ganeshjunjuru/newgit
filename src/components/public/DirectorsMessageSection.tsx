import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDirectorsMessageStore } from '../../store/directorsMessageStore'; // Adjust path if needed
import { DirectorMessage } from '../types'; // Adjust path if needed

const DirectorsMessageSection: React.FC = () => {
  // Use the Zustand hook to select relevant state and actions
  const { messages, isLoading, error, fetchDirectorsMessages } = useDirectorsMessageStore(
    (state) => ({
      messages: state.messages,
      isLoading: state.isLoading,
      error: state.error,
      fetchDirectorsMessages: state.fetchDirectorsMessages,
    })
  );

  useEffect(() => {
    // Only fetch if not already loading, no messages are present yet, and no error occurred previously.
    if (!isLoading && messages.length === 0 && !error) {
      console.log('DirectorsMessageSection: Initiating fetch for messages.');
      fetchDirectorsMessages();
    }
  }, [isLoading, messages.length, error, fetchDirectorsMessages]);

  // Conditional Rendering Logic:
  // If loading, error, or no active messages are found after filtering, don't render the section.
  if (isLoading || error || messages.length === 0) {
    if (isLoading) {
      console.log('DirectorsMessageSection: Not rendering - still loading.');
    }
    if (error) {
      console.error('DirectorsMessageSection: Not rendering - an error occurred:', error);
    }
    if (messages.length === 0 && !isLoading && !error) {
      console.log('DirectorsMessageSection: Not rendering - no active messages found after fetch.');
    }
    return null; // Don't render anything if the conditions aren't met
  }

  // If we reach here, it means isLoading is false, no error, and messages.length > 0.
  // We'll use the first active message for the section.
  const directorMessage: DirectorMessage = messages[0];
  console.log('DirectorsMessageSection: Rendering with active message:', directorMessage);


  return (
    <section className="bg-[#0b3d64] text-white py-16 font-inter"> {/* Dark blue background */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Left Column: Text Content - Populated dynamically */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold mb-6">
              {directorMessage.title || "Director's Message"} <br /> Sreepaada Degree College
            </h2>
            <p className="text-lg leading-relaxed mb-6 opacity-90">
              {directorMessage.content}
            </p>
            {directorMessage.read_more_link ? ( // Use dynamic link if available
              <Link
                to={directorMessage.read_more_link}
                className="text-white text-lg font-semibold hover:underline transition-colors"
                target="_blank" // Consider if this should always open in a new tab
                rel="noopener noreferrer"
              >
                Read More
              </Link>
            ) : ( // Fallback to original static link if no specific link
              <Link to="/directors-message" className="text-white text-lg font-semibold hover:underline transition-colors">
                Read More
              </Link>
            )}
          </div>

          {/* Right Column: Image - Populated dynamically */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            {directorMessage.image ? ( // Use dynamic image if available
              <img
                src={directorMessage.image}
                alt={directorMessage.title || "Director of Sreepaada Degree College"}
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ objectFit: 'cover' }}
              />
            ) : ( // Fallback to original placeholder image
              <img
                src="https://placehold.co/600x400/FFFFFF/000000?text=Director+Image"
                alt="Director of Sreepaada Degree College"
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorsMessageSection;