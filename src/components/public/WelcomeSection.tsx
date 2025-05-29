import React, { useEffect } from 'react';
import { useWelcomeMessageStore } from '../../store/welcomeMessageStore';
import { WelcomeMessage } from '../types';

const WelcomeSection: React.FC = () => {
  const { welcomeMessage, isLoading, error, fetchWelcomeMessage } = useWelcomeMessageStore(
    (state) => ({
      welcomeMessage: state.welcomeMessage,
      isLoading: state.isLoading,
      error: state.error,
      fetchWelcomeMessage: state.fetchWelcomeMessage,
    })
  );

  const [hasFetched, setHasFetched] = React.useState(false);

  useEffect(() => {
    if (!isLoading && !welcomeMessage && !error) {
      console.log('WelcomeSection: Initiating fetch for welcome message.');
      fetchWelcomeMessage().then(() => {
        setHasFetched(true);
      });
    } else if (!isLoading && (welcomeMessage || error)) {
      if (!hasFetched) {
        setHasFetched(true);
      }
    }
  }, [isLoading, welcomeMessage, error, fetchWelcomeMessage, hasFetched]);

  const defaultTitle: string = "Welcome to Sreepaada Degree College";
  const defaultContent: string = `Established in 2003 under the auspices of the SPR Memorial Educational Society, Sreepaada Degree College has been a beacon of excellence in higher education for over two decades. Nestled in the heart of Visakhapatnam city, our college offers a conducive environment for holistic learning and personal growth.

We take pride in our commitment to academic excellence and holistic development. With a diverse range of courses including BCA, BBA, BCom and BSc Honours, our institution is dedicated to nurturing the intellectual curiosity and professional acumen of our students.`;
  const defaultImage: string | null = null;

  let sectionContent;

  if (isLoading && !hasFetched) {
    sectionContent = (
      <div className="flex-grow flex items-center justify-center min-h-[250px] lg:min-h-[300px]">
        &nbsp;
      </div>
    );
    console.log('WelcomeSection: Initial loading, showing empty space.');
  } else if (hasFetched && (!welcomeMessage || !welcomeMessage.is_visible)) {
    sectionContent = (
      <div className="flex-grow flex flex-col justify-center items-center text-center p-4 min-h-[250px] lg:min-h-[300px]">
        <p className="text-xl font-semibold text-gray-500 mb-2">No Welcome Message Available</p>
        <p className="text-md text-gray-400">Please check back later.</p>
      </div>
    );
    console.log('WelcomeSection: No active welcome message found, displaying message.');
  } else if (hasFetched && error) {
    console.log('WelcomeSection: Fetch error, falling back to static content.');
    sectionContent = (
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-10">
        {defaultImage && (
          <div className="flex-shrink-0 w-full lg:w-1/3 mb-6 lg:mb-0">
            <img
              src={defaultImage}
              alt={defaultTitle}
              className="w-full h-auto object-cover rounded-lg shadow-md max-h-[350px] lg:max-h-[400px]"
            />
          </div>
        )}
        <div className="lg:flex-grow text-center lg:text-left">
          {/* Reduced mb-6 to mb-3 for the title */}
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-3">{defaultTitle}</h2>
          {defaultContent.split('\n\n').map((paragraph, index) => (
            // Reduced mb-4 to mb-2 for paragraphs
            <p key={index} className="text-gray-600 mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  } else if (welcomeMessage && welcomeMessage.is_visible) {
    console.log('WelcomeSection: Displaying dynamic content.');
    const dynamicTitle = welcomeMessage.title;
    const dynamicContent = welcomeMessage.content;
    const dynamicImage = welcomeMessage.image;

    sectionContent = (
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-10">
        {dynamicImage && (
          <div className="flex-shrink-0 w-full lg:w-1/3 mb-6 lg:mb-0">
            <img
              src={dynamicImage}
              alt={dynamicTitle || "Welcome Image"}
              className="w-full h-auto object-cover rounded-lg shadow-md max-h-[350px] lg:max-h-[400px]"
            />
          </div>
        )}
        <div className="lg:flex-grow text-center lg:text-left">
          {/* Reduced mb-6 to mb-3 for the title */}
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-3">{dynamicTitle}</h2>
          {dynamicContent.split('\n\n').map((paragraph, index) => (
            // Reduced mb-4 to mb-2 for paragraphs
            <p key={index} className="text-gray-600 mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  } else {
    console.log('WelcomeSection: Default fallback to static content (initial render).');
    sectionContent = (
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-10">
        {defaultImage && (
          <div className="flex-shrink-0 w-full lg:w-1/3 mb-6 lg:mb-0">
            <img
              src={defaultImage}
              alt={defaultTitle}
              className="w-full h-auto object-cover rounded-lg shadow-md max-h-[350px] lg:max-h-[400px]"
            />
          </div>
        )}
        <div className="lg:flex-grow text-center lg:text-left">
          {/* Reduced mb-6 to mb-3 for the title */}
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-3">{defaultTitle}</h2>
          {defaultContent.split('\n\n').map((paragraph, index) => (
            // Reduced mb-4 to mb-2 for paragraphs
            <p key={index} className="text-gray-600 mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    // Reduced py-8 lg:py-12 to py-6 lg:py-8 for the main container
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {sectionContent}
    </div>
  );
};

export default WelcomeSection;