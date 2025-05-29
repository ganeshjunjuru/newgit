import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react'; // Importing icons
import ContactForm from '../../components/public/ContactForm'; // Import the new ContactForm component

const ContactUsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Hero Section */}
            <section className="relative bg-blue-800 text-white py-24 md:py-32 overflow-hidden shadow-xl rounded-b-lg">
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
                        Reach Us Here
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
                        We'd love to hear from you. Send us a message or find our location.
                    </p>
                </div>
            </section>

            {/* Main Content Section: Form and Contact Details */}
            <section className="py-16 md:py-20 bg-gray-100">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg shadow-xl p-8 md:p-12">
                        {/* Left Column: Contact Form (Now a separate component) */}
                        <ContactForm />

                        {/* Right Column: Administrative Office & Map */}
                        <div className="lg:pl-8 lg:border-l lg:border-gray-200">
                            {/* Administrative Office */}
                            <div className="mb-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">Administrative Office</h2>
                                <div className="space-y-4 text-lg text-gray-700">
                                    <p className="flex items-center">
                                        <Phone className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                                        <span className="font-semibold">Contact:</span> +91 9703073871
                                    </p>
                                    <p className="flex items-center">
                                        <Mail className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                                        <span className="font-semibold">Email:</span> sreepaada.ug@gmail.com
                                    </p>
                                    <p className="flex items-start">
                                        <MapPin className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                                        <span className="font-semibold">Address:</span> D.NO:39-33-2/3, HIG-96, RTA OFFICE ROAD, MADHAVADHARA, VISAKHAPATNAM, PINCODE 530018
                                    </p>
                                </div>
                            </div>

                            {/* Locate Our Campus */}
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">Locate Our Campus</h2>
                                <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                                    <iframe
                                        title="College Location Map"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.0063255153215!2d83.25055037500001!3d17.74712498305716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395b28a8d1a1b1%3A0x8e5f2e8f1d7a7b8a!2sRTA%20Office%20Road%2C%20Madhavadhara%2C%20Visakhapatnam%2C%20Andhra%20Pradesh%20530018!5e0!3m2!1sen!2sin!4v1716912345678!5m2!1sen!2sin"
                                        width="100%"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                                <p className="text-sm text-gray-500 mt-4 text-center">
                                    <a
                                        href="https://www.google.com/maps/search/D.NO:39-33-2/3,+HIG-96,+RTA+OFFICE+ROAD,+MADHAVADHARA,+VISAKHAPATNAM,+PINCODE+530018"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View larger map
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 md:py-20 bg-blue-900 text-white text-center rounded-t-lg">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Have Questions?</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                        Our team is ready to assist you with any inquiries.
                    </p>
                    <a
                        href="mailto:sreepaada.ug@gmail.com"
                        className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg
                                   hover:bg-gray-200 transition-colors duration-300 text-lg uppercase tracking-wide"
                    >
                        Email Us Directly
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ContactUsPage;
