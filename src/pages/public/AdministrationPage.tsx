// src/pages/public/FacultyPage.tsx
import React from 'react';
import FacultySection from '../../components/public/FacultySection'; // Adjust path if necessary

const FacultyPage: React.FC = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#333' }}>Our Academic Faculty</h1>
            <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
                Explore the profiles of our highly qualified and experienced faculty members who are dedicated to fostering academic excellence.
            </p>

            {/* This is the reusable section that now comes from components/public/FacultySection */}
            <FacultySection />

            <section style={{ marginTop: '30px' }}>
                <h2 style={{ color: '#555' }}>Department-Specific Information</h2>
                <p>
                    Here you can add more detailed lists of faculty per department, their research interests, publications, and contact information.
                </p>
                {/* Example of department specific content */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                    <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px', flex: 1 }}>
                        <h3>Computer Science</h3>
                        <ul>
                            <li>Dr. Emily White</li>
                            <li>Prof. David Green</li>
                        </ul>
                    </div>
                    <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px', flex: 1 }}>
                        <h3>Business Administration</h3>
                        <ul>
                            <li>Dr. Frank Black</li>
                            <li>Ms. Grace Red</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FacultyPage;