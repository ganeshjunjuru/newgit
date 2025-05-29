import React, { useState } from 'react';

// Basic interface for a Course item
interface Course {
  id: string;
  name: string; // e.g., "BCA Honours"
  category: string; // e.g., "Undergraduate", "Postgraduate"
  duration: string; // e.g., "3 Years"
  description: string; // A brief description
}

const CoursesAdminPage: React.FC = () => {
  // Placeholder state for courses
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c_bca_hon',
      name: 'BCA Honours',
      category: 'Undergraduate',
      duration: '3 Years',
      description: 'Bachelor of Computer Applications with advanced focus.'
    },
    {
      id: 'c_bba_hon',
      name: 'BBA Honours',
      category: 'Undergraduate',
      duration: '3 Years',
      description: 'Bachelor of Business Administration with specialized studies.'
    },
    {
      id: 'c_bsc_ds',
      name: 'BSC Data Science',
      category: 'Undergraduate',
      duration: '3 Years',
      description: 'Bachelor of Science in Data Science, focusing on data analysis.'
    },
    {
      id: 'c_bsc_comp',
      name: 'BSC Computer',
      category: 'Undergraduate',
      duration: '3 Years',
      description: 'Bachelor of Science in Computer Science.'
    },
    {
      id: 'c_bcom_comp',
      name: 'BCOM Computer',
      category: 'Undergraduate',
      duration: '3 Years',
      description: 'Bachelor of Commerce with Computer Applications.'
    },
    {
      id: 'c_bcom_it',
      name: 'BCOM IT',
      category: 'Undergraduate',
      duration: '3 Years',
      description: 'Bachelor of Commerce with Information Technology.'
    },
  ]);

  // Placeholder for adding/editing logic (to be implemented later)
  const handleAddCourse = () => {
    alert('Add new course form would open here!');
    // In a real app, this would open a modal or navigate to a form page
  };

  const handleEditCourse = (id: string) => {
    alert(`Edit course with ID: ${id}`);
    // In a real app, this would populate a form with existing data
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm(`Are you sure you want to delete course: ${courses.find(c => c.id === id)?.name}?`)) {
      setCourses(courses.filter(course => course.id !== id));
      alert('Course deleted!');
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Courses</h1>

      <div className="mb-6">
        <button
          onClick={handleAddCourse}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
        >
          Add New Course
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Courses</h2>
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses found.</p>
        ) : (
          <div className="overflow-x-auto"> {/* Added for horizontal scrolling on small screens */}
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Course Name</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Duration</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {course.name}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {course.category}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {course.duration}
                    </td>
                    <td className="py-3 px-6 text-left max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {course.description}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditCourse(course.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesAdminPage;
