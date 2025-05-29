import React, { useState, useEffect } from 'react';
import { getActiveFaculty, FacultyData } from '../../store/FacultyFetchStore'; // Adjust path as needed to your FacultyFetchStore.ts

const FacultyPage: React.FC = () => {
    const [faculty, setFaculty] = useState<FacultyData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const activeFaculty = await getActiveFaculty();
                setFaculty(activeFaculty);
            } catch (err: any) {
                console.error("Error fetching faculty:", err);
                setError(err.message || "Failed to load faculty data.");
            } finally {
                setLoading(false);
            }
        };

        fetchFacultyData();
    }, []); // Empty dependency array means this runs once on component mount

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl text-blue-800">Loading faculty details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800 p-4 rounded-lg m-4">
                <p className="text-xl">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Hero Section */}
            <section className="relative bg-blue-800 text-white py-24 md:py-32 overflow-hidden shadow-xl rounded-b-lg">
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
                        Our Esteemed Faculty
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
                        Meet the dedicated educators who inspire and guide our students.
                    </p>
                </div>
            </section>

            {/* Faculty Directory Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-12">
                        Active Faculty Members
                    </h2>
                    {faculty.length === 0 ? (
                        <p className="text-center text-gray-600 text-lg">No active faculty members found at this time.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {faculty.map((member) => (
                                <div
                                    key={member.id}
                                    className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center text-center
                                               hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-500 shadow-lg">
                                        <img
                                            src={member.image_url || `https://placehold.co/150x150/E0E7FF/4338CA?text=${member.name.split(' ')[0] || 'Faculty'}`}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback for broken images: replace with a placeholder based on name
                                                e.currentTarget.src = `https://placehold.co/150x150/E0E7FF/4338CA?text=${member.name.split(' ')[0] || 'Faculty'}`;
                                            }}
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-blue-800 mb-1">{member.name}</h3>
                                    <p className="text-md text-gray-600 mb-1 font-medium">{member.qualification}</p>
                                    <p className="text-sm text-gray-700 mb-2">{member.designation}</p>
                                    <p className="text-sm text-gray-500 italic">{member.experience_years} Years Experience</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 md:py-20 bg-blue-900 text-white text-center rounded-t-lg">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Interested in Our Programs?</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                        Explore our diverse academic offerings and discover your future.
                    </p>
                    <a
                        href="/admissions" // Link to your admissions page or relevant section
                        className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg
                                   hover:bg-gray-200 transition-colors duration-300 text-lg uppercase tracking-wide"
                    >
                        Apply Now
                    </a>
                </div>
            </section>
        </div>
    );
};

export default FacultyPage;
