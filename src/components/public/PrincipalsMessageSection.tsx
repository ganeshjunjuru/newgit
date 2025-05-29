import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePrincipalMessageStore } from '../../store/principalMessageStore'; // Import the Principal's message store
import { DirectorMessage } from '../types'; // Reuse DirectorMessage interface as columns are same

const PrincipalsMessageSection: React.FC = () => {
  // Use the Zustand hook to select relevant state and actions from the principal message store
  const { messages, isLoading, error, fetchDirectorsMessages } = usePrincipalMessageStore(
    (state) => ({
      messages: state.messages,
      isLoading: state.isLoading,
      error: state.error,
      fetchDirectorsMessages: state.fetchDirectorsMessages, // This action name is generic, but acts on principal messages
    })
  );

  useEffect(() => {
    // Fetch principal messages when the component mounts
    // Only fetch if not already loading, no messages present, and no prior error
    if (!isLoading && messages.length === 0 && !error) {
      console.log('PrincipalsMessageSection: Initiating fetch for principal messages.');
      fetchDirectorsMessages(); // Call the fetch action from the principal store
    }
  }, [isLoading, messages.length, error, fetchDirectorsMessages]);

  // Conditional Rendering Logic:
  // If loading, an error occurred, or no active principal messages are found, don't render the section.
  if (isLoading || error || messages.length === 0) {
    if (isLoading) {
      console.log('PrincipalsMessageSection: Not rendering - still loading.');
    }
    if (error) {
      console.error('PrincipalsMessageSection: Not rendering - an error occurred:', error);
    }
    if (messages.length === 0 && !isLoading && !error) {
      console.log('PrincipalsMessageSection: Not rendering - no active principal messages found after fetch.');
    }
    return null; // Don't render anything if conditions aren't met
  }

  // If we reach here, it means isLoading is false, no error, and messages.length > 0.
  // We'll use the first active principal message for the section.
  const principalMessage: DirectorMessage = messages[0];
  console.log('PrincipalsMessageSection: Rendering with active principal message:', principalMessage);

  return (
    <section className="bg-white py-16 font-inter">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Left Column: Image - Populated dynamically from principalMessage */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start">
            {principalMessage.image ? ( // Use dynamic image if available
              <img
                src={principalMessage.image}
                alt={principalMessage.title || "Principal of Sreepaada Degree College"}
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ objectFit: 'cover' }}
              />
            ) : ( // Fallback to your original placeholder image
              <img
                src="https://placehold.co/600x400/E0F2F7/000000?text=Principal+Image"
                alt="Principal of Sreepaada Degree College"
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Right Column: Text Content - Populated dynamically from principalMessage */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-[#0b3d64] mb-6">
              {principalMessage.title || "A Word From the Principal"}
            </h2>
            <p className="text-lg leading-relaxed mb-6 opacity-90 text-gray-700">
              {principalMessage.content}
            </p>
            {principalMessage.read_more_link ? ( // Use dynamic link if available
              <Link
                to={principalMessage.read_more_link}
                className="text-[#0b3d64] text-lg font-semibold hover:underline transition-colors"
                target="_blank" // Consider if this should always open in a new tab
                rel="noopener noreferrer"
              >
                Read Full Message
              </Link>
            ) : ( // Fallback to your original static link if no specific link
              <Link to="/principals-message" className="text-[#0b3d64] text-lg font-semibold hover:underline transition-colors">
                Read Full Message
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalsMessageSection;