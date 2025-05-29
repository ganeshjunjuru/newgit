import React, { useEffect } from 'react';
import { useCoursesStore } from '../../store/coursesStore';

const CoursesOffered: React.FC = () => {
  const { courses, loading, error, fetchCourses } = useCoursesStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-100 font-inter flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-700">Loading courses...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-red-100 text-red-700 font-inter p-4 rounded-lg flex items-center justify-center min-h-[400px]">
        <p>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white font-inter">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 uppercase tracking-wide">
            COURSES OFFERED
          </h2>
          <div className="flex justify-center mt-2 mb-4">
            <div className="w-24 h-1 bg-blue-800 rounded-full"></div>
          </div>
          <p className="text-xl font-semibold text-blue-800">
            Explore Honours Courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <a
                key={course.id}
                href={course.link}
                className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="bg-[#0b3d64] text-white text-center py-3 font-bold text-lg rounded-t-lg group-hover:bg-blue-900 transition-colors">
                  {course.name}
                </div>

                {/* Image container with fixed aspect ratio */}
                <div className="w-full aspect-[3/4] overflow-hidden rounded-b-lg">
                  <img
                    src={course.imageSrc}
                    alt={course.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/300x400/F0F0F0/000000?text=${encodeURIComponent(course.name || 'Course Image')}`;
                    }}
                  />
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No courses available. Please ensure your API is returning data.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesOffered;
