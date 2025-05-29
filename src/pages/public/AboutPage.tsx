import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-blue-800 text-white py-24 md:py-32 overflow-hidden shadow-xl">
        {/* Subtle background pattern for professionalism */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            About [College Name]
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Dedicated to academic excellence, innovation, and community impact since <span className="font-semibold">19XX</span>.
          </p>
        </div>
      </section>

      {/* Introduction/Overview Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">
            Our Legacy of Learning and Leadership
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed text-center mb-8">
            At [College Name], we believe in nurturing intellectual curiosity and fostering a vibrant community
            where students are inspired to achieve their full potential. Our commitment extends beyond academics,
            aiming to develop well-rounded individuals prepared for the challenges of a dynamic world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            <div>
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To deliver exceptional education, drive impactful research, and cultivate ethical leaders
                who contribute positively to society.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">Our Vision</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To be a globally recognized institution, renowned for academic innovation and a profound
                commitment to societal advancement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Milestones Section */}
      <section className="py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">Our Journey</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Established in <span className="font-semibold text-blue-600">19XX</span>, [College Name] began with a clear purpose:
              to provide high-quality higher education accessible to all. From our humble beginnings, we have steadily grown,
              marked by significant milestones that reflect our dedication to progress.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-6 ml-4">
              <li><span className="font-semibold text-blue-600">YYYY:</span> Inauguration of our first research facility.</li>
              <li><span className="font-semibold text-blue-600">ZZZZ:</span> Launch of comprehensive international exchange programs.</li>
              <li><span className="font-semibold text-blue-600">AAAA:</span> Achieved top-tier national accreditation.</li>
              <li><span className="font-semibold text-blue-600">BBBB:</span> Expanded campus to include state-of-the-art laboratories.</li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we continue to build on this rich legacy, embracing innovation while upholding the core values
              that have guided us for decades.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-20 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Guiding Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-3">Excellence</h3>
              <p className="text-blue-100 text-base">
                Commitment to the highest standards in all academic and administrative pursuits.
              </p>
            </div>
            <div className="bg-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-3">Integrity</h3>
              <p className="text-blue-100 text-base">
                Upholding honesty, transparency, and ethical conduct in every interaction.
              </p>
            </div>
            <div className="bg-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-3">Innovation</h3>
              <p className="text-blue-100 text-base">
                Fostering creativity and embracing new ideas to advance knowledge and practice.
              </p>
            </div>
            <div className="bg-blue-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-3">Community</h3>
              <p className="text-blue-100 text-base">
                Building an inclusive and supportive environment that values diversity and collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation & Affiliations Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-10">Accreditation & Partnerships</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            [College Name] is proud to hold full accreditation from <span className="font-semibold text-blue-600">[Accrediting Body Name]</span>,
            a testament to our unwavering commitment to academic rigor and quality.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We actively collaborate with leading organizations and institutions, including
            <span className="font-semibold text-blue-600"> [Partner Organization 1], [Partner Organization 2]</span>,
            to enrich our curriculum, expand research opportunities, and enhance student experiences.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20 bg-blue-900 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Discover how [College Name] can help you achieve your academic and professional aspirations.
          </p>
          <a
            href="/contact-us" // Link to your contact page
            className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg
                       hover:bg-gray-200 transition-colors duration-300 text-lg uppercase tracking-wide"
          >
            Connect With Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
