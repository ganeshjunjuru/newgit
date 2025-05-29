import React, { useState, useEffect } from 'react';

// Basic interface for a Notification item - matches your MySQL table structure
interface Notification {
  id: string; // Ensure this is a string as your API sends it, or adjust to number if your PHP casts it.
  text: string;
  link: string;
  date: string; // e.g., "YYYY-MM-DD"
}

const NotificationsAdminPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the form (for adding/editing)
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<Notification, 'id'> & { id?: string }>(
    { text: '', link: '', date: '' }
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // --- API Endpoint Configuration ---
  // IMPORTANT: Change this to your actual PHP API base URL.
  // Example: 'http://localhost/your-php-api-folder' if your PHP files are in a folder named 'your-php-api-folder'
  // and your API scripts are inside a subfolder named 'api' within it.
  const API_BASE_URL = 'https://web.sreepaadadegreecollege.org'; 

  // --- Fetch Notifications ---
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Adjust path if your 'api' folder is directly under 'php_api'
      const response = await fetch(`${API_BASE_URL}/api/get_notifications.php`); 
      if (!response.ok) {
        // Attempt to read error message from response body
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || 'Unknown error'}`);
      }
      const data: Notification[] = await response.json();
      setNotifications(data);
    } catch (err: any) {
      setError(`Failed to fetch notifications: ${err.message}`);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, []); // Empty dependency array means this runs once on mount

  // --- Handle Form Input Changes ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Handle Add/Edit Form Submission ---
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Determine API endpoint based on whether we're editing or adding
    const url = isEditing
      ? `${API_BASE_URL}/api/update_notification.php`
      : `${API_BASE_URL}/api/add_notification.php`;
    
    // Always use POST for simplicity with form submissions;
    // For RESTful APIs, PUT is typically used for updates.
    const method = 'POST'; 
    const body = JSON.stringify(formData);

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // If you implement authentication, you'd add headers like:
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      if (result.success) {
        alert(result.message); // Show success message from API
        setShowForm(false); // Close the form
        setFormData({ text: '', link: '', date: '' }); // Reset form
        setIsEditing(false); // Reset editing state
        fetchNotifications(); // Re-fetch notifications to update the list
      } else {
        setError(result.message || 'Operation failed without specific message.');
      }
      
    } catch (err: any) {
      setError(`Failed to ${isEditing ? 'update' : 'add'} notification: ${err.message}`);
      console.error(`Error ${isEditing ? 'updating' : 'adding'} notification:`, err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Add Notification Button Click ---
  const handleAddNotificationClick = () => {
    setFormData({ text: '', link: '', date: '' }); // Clear form for new entry
    setIsEditing(false); // Set to add mode
    setShowForm(true); // Show the form
  };

  // --- Handle Edit Notification Button Click ---
  const handleEditNotification = (notification: Notification) => {
    // Populate form with existing data
    setFormData(notification); 
    setIsEditing(true); // Set to edit mode
    setShowForm(true); // Show the form
  };

  // --- Handle Delete Notification ---
  const handleDeleteNotification = async (id: string) => {
    if (!confirm(`Are you sure you want to delete notification ID: ${id}?`)) {
      return; // User cancelled
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete_notification.php`, {
        method: 'POST', // Or 'DELETE' if your PHP setup handles DELETE requests via raw body
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Send ID as JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        fetchNotifications(); // Re-fetch notifications to update the list
      } else {
        setError(result.message || 'Deletion failed without specific message.');
      }
      
    } catch (err: any) {
      setError(`Failed to delete notification: ${err.message}`);
      console.error('Error deleting notification:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Notifications</h1>

      <div className="mb-6">
        <button
          onClick={handleAddNotificationClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
        >
          Add New Notification
        </button>
      </div>

      {/* Notification Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {isEditing ? 'Edit Notification' : 'Add New Notification'}
          </h2>
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">
                Notification Text:
              </label>
              <input
                type="text"
                id="text"
                name="text"
                value={formData.text}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="link" className="block text-gray-700 text-sm font-bold mb-2">
                Link:
              </label>
              <input
                type="text"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                Date (YYYY-MM-DD):
              </label>
              <input
                type="date" // Use type="date" for a native date picker
                id="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isEditing ? 'Update Notification' : 'Add Notification')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ text: '', link: '', date: '' }); // Clear form on cancel
                  setIsEditing(false); // Reset editing state
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading and Error Messages */}
      {loading && <p className="text-blue-600 text-lg mb-4">Loading notifications...</p>}
      {error && <p className="text-red-600 text-lg mb-4">Error: {error}</p>}

      {/* Current Notifications List */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Notifications</h2>
        {!loading && !error && notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-md shadow-sm border border-gray-200"
              >
                <div className="mb-2 sm:mb-0 sm:mr-4">
                  <p className="font-semibold text-gray-800 text-lg">{notif.text}</p>
                  <p className="text-sm text-gray-500">Link: <a href={notif.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{notif.link}</a></p>
                  <p className="text-sm text-gray-500">Date: {notif.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditNotification(notif)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notif.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsAdminPage;