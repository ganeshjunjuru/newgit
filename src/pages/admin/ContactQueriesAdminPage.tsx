import React, { useState, useEffect } from 'react';

// Basic interface for a Contact Query item
interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string; // e.g., "YYYY-MM-DD HH:MM:SS"
  isRead: boolean;
  phoneNumber: string; // Added phone number field
}

const ContactQueriesAdminPage: React.FC = () => {
  // Placeholder state for contact queries
  const [queries, setQueries] = useState<ContactQuery[]>([
    {
      id: 'q1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Admission Query - BCA Honours',
      message: 'I am interested in the BCA Honours course. Could you please provide details on eligibility and application process?',
      timestamp: '2025-05-23 10:30:00',
      isRead: false,
      phoneNumber: '9876543210', // Added phone number
    },
    {
      id: 'q2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      subject: 'Fee Structure for BBA',
      message: 'What is the fee structure for the BBA course and are there any scholarship options available?',
      timestamp: '2025-05-22 14:00:00',
      isRead: true,
      phoneNumber: '8765432109', // Added phone number
    },
    {
      id: 'q3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      subject: 'Placement Opportunities',
      message: 'Could you tell me more about the placement opportunities for computer science graduates?',
      timestamp: '2025-05-21 09:15:00',
      isRead: false,
      phoneNumber: '7654321098', // Added phone number
    },
  ]);

  // In a real application, you would fetch this data from a backend on component mount
  useEffect(() => {
    // Example: fetch('/api/contact-queries').then(res => res.json()).then(data => setQueries(data));
  }, []);

  const handleMarkAsRead = (id: string) => {
    setQueries(queries.map(query =>
      query.id === id ? { ...query, isRead: !query.isRead } : query
    ));
    // In a real app, update this status in your backend
  };

  const handleDeleteQuery = (id: string) => {
    if (confirm(`Are you sure you want to delete this query from ${queries.find(q => q.id === id)?.name}?`)) {
      setQueries(queries.filter(query => query.id !== id));
      // In a real app, delete from your backend
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Contact Enquiries</h1>

      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Incoming Queries</h2>
        {queries.length === 0 ? (
          <p className="text-gray-500">No new queries found.</p>
        ) : (
          <div className="overflow-x-auto"> {/* Added for horizontal scrolling on small screens */}
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Subject</th>
                  <th className="py-3 px-6 text-left">Message</th>
                  <th className="py-3 px-6 text-left">Phone Number</th> {/* New column header */}
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {queries.map((query) => (
                  <tr
                    key={query.id}
                    className={`border-b border-gray-200 hover:bg-gray-100 ${!query.isRead ? 'bg-blue-50 bg-opacity-70 font-medium' : ''}`}
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {query.name}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {query.email}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {query.subject}
                    </td>
                    <td className="py-3 px-6 text-left max-w-xs overflow-hidden text-ellipsis">
                      {query.message.substring(0, 50)}...
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {query.phoneNumber} {/* Display phone number */}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {new Date(query.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        query.isRead ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        {query.isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2"> {/* Changed to flex-col for buttons */}
                        <button
                          onClick={() => handleMarkAsRead(query.id)}
                          className={`w-full text-white text-xs py-1 px-2 rounded-md transition-colors ${
                            query.isRead ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {query.isRead ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <a
                          href={`https://wa.me/+91${query.phoneNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded-md transition-colors text-center"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`tel:+91${query.phoneNumber}`} // Added +91 here for direct call
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded-md transition-colors text-center"
                        >
                          Call
                        </a>
                        <button
                          onClick={() => handleDeleteQuery(query.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded-md transition-colors"
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

export default ContactQueriesAdminPage;
