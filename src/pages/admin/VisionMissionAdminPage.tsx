import React, { useState, useEffect } from 'react';

const VisionMissionAdminPage: React.FC = () => {
  // Placeholder state for Vision and Mission messages
  const [vision, setVision] = useState<string>(
    `To foster a dynamic and inclusive learning environment that empowers
    students to excel academically, embrace diversity, and cultivate critical thinking
    skills, preparing them to be responsible global citizens.`
  );
  const [mission, setMission] = useState<string>(
    `Our mission is to provide quality higher education that nurtures intellectual
    curiosity, promotes ethical values, and develops practical skills. We strive to
    create a supportive community where faculty and students collaborate in the
    pursuit of knowledge, innovation, and personal growth.`
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // In a real application, you would fetch this data from a backend on component mount
  useEffect(() => {
    // Example: fetch('/api/vision-mission').then(res => res.json()).then(data => {
    //   setVision(data.vision);
    //   setMission(data.mission);
    // });
  }, []);

  const handleSave = () => {
    // In a real application, you would send this data to your backend
    // Example: fetch('/api/vision-mission', { method: 'POST', body: JSON.stringify({ vision, mission }) });
    alert('Vision and Mission Saved!');
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Vision & Mission</h1>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Statements</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Vision</h3>
          {isEditing ? (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={vision}
              onChange={(e) => setVision(e.target.value)}
            ></textarea>
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{vision}</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Mission</h3>
          {isEditing ? (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
            ></textarea>
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{mission}</p>
          )}
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
                  // Optionally, reset to original fetched data if needed
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
              Edit Statements
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionMissionAdminPage;
