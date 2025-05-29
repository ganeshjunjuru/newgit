import React, { useState, useEffect } from 'react';

const PrincipalsMessageAdminPage: React.FC = () => {
  // Placeholder state for Principal's message and image URL
  const [message, setMessage] = useState<string>(
    `Dear Students, Parents, and Esteemed Faculty,
    It is with immense pleasure and pride that I welcome you to Sreepaada Degree College, located in the vibrant city of Visakhapatnam. Our college is committed to providing a transformative educational experience that nurtures academic excellence, fosters critical thinking, and promotes holistic development.
    We strive to create a learning environment where students are empowered to reach their full potential, equipped with the knowledge and skills necessary to excel in their chosen fields and contribute meaningfully to society. Our dedicated faculty members are passionate about teaching and mentoring, ensuring that each student receives personalized attention and guidance.
    We believe in a student-centric approach, focusing on innovative teaching methodologies and a curriculum that is relevant to the evolving needs of the industry. Alongside academic rigor, we encourage participation in co-curricular and extracurricular activities that enhance personal growth and leadership skills.
    I invite you to explore the opportunities that Sreepaada Degree College offers. Together, we can embark on a journey of learning, growth, and achievement.`
  );
  const [imageUrl, setImageUrl] = useState<string>('https://placehold.co/600x400/E0F2F7/000000?text=Principal+Image'); // Placeholder image URL
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // In a real application, you would fetch this data from a backend on component mount
  useEffect(() => {
    // Example: fetch('/api/principal-message').then(res => res.json()).then(data => {
    //   setMessage(data.message);
    //   setImageUrl(data.imageUrl);
    // });
  }, []);

  const handleSave = () => {
    // In a real application, you would send this data to your backend
    // Example: fetch('/api/principal-message', { method: 'POST', body: JSON.stringify({ message, imageUrl }) });
    alert('Principal\'s Message Saved!');
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file); // For preview, in production you'd upload to storage and get a URL
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Principal's Message</h1>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Message and Image</h2>

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-6">
          {/* Image Section (Left) */}
          <div className="md:w-1/3 flex flex-col items-center order-1 md:order-1"> {/* order-1 for left on desktop */}
            <img
              src={imageUrl}
              alt="Principal"
              className="w-48 h-48 object-cover rounded-full shadow-lg mb-4"
            />
            {isEditing && (
              <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-md transition-colors">
                Upload New Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          {/* Message Text Area (Right) */}
          <div className="md:w-2/3 w-full order-2 md:order-2"> {/* order-2 for right on desktop */}
            {isEditing ? (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  // Optionally, reset message/image to original if needed
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
            >
              Edit Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrincipalsMessageAdminPage;
