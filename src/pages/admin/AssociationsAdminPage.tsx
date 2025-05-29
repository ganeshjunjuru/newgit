import React, { useState, useEffect } from 'react';

// Basic interface for an Association Logo item
interface AssociationLogo {
  id: string;
  src: string; // URL for the logo image
  alt: string; // Alt text for accessibility
  link?: string; // Optional: link to the association's website
}

const AssociationsAdminPage: React.FC = () => {
  // Placeholder state for association logos
  const [logos, setLogos] = useState<AssociationLogo[]>([
    { id: 'l1', src: 'https://placehold.co/120x120/F0F0F0/000000?text=University+Logo', alt: 'Affiliating University Logo' },
    { id: 'l2', src: 'https://placehold.co/120x120/F0F0F0/000000?text=NSS+Logo', alt: 'National Service Scheme Logo' },
    { id: 'l3', src: 'https://placehold.co/120x120/F0F0F0/000000?text=NIRF+Logo', alt: 'NIRF National Institutional Ranking Framework Logo' },
    { id: 'l4', src: 'https://placehold.co/120x120/F0F0F0/000000?text=UBA+Logo', alt: 'Unnat Bharat Abhiyan Logo' },
    { id: 'l5', src: 'https://placehold.co/180x120/F0F0F0/000000?text=AICTE+Approved', alt: 'AICTE Approved Logo' },
  ]);

  // State for the form to add/edit a logo
  const [newLogo, setNewLogo] = useState<Omit<AssociationLogo, 'id'>>({ src: '', alt: '', link: '' });
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null);

  // In a real application, you would fetch this data from a backend on component mount
  useEffect(() => {
    // Example: fetch('/api/associations').then(res => res.json()).then(data => setLogos(data));
  }, []);

  const handleAddOrUpdateLogo = () => {
    if (!newLogo.src || !newLogo.alt) {
      alert('Image URL and Alt Text are required.');
      return;
    }

    if (editingLogoId) {
      // Update existing logo
      setLogos(logos.map(logo =>
        logo.id === editingLogoId ? { ...newLogo, id: editingLogoId } : logo
      ));
      alert('Logo updated successfully!');
    } else {
      // Add new logo
      setLogos([...logos, { ...newLogo, id: Date.now().toString() }]); // Simple ID generation
      alert('Logo added successfully!');
    }
    setNewLogo({ src: '', alt: '', link: '' });
    setEditingLogoId(null);
  };

  const handleEditClick = (logo: AssociationLogo) => {
    setNewLogo({ src: logo.src, alt: logo.alt, link: logo.link });
    setEditingLogoId(logo.id);
  };

  const handleDeleteLogo = (id: string) => {
    if (confirm(`Are you sure you want to delete this logo?`)) {
      setLogos(logos.filter(logo => logo.id !== id));
      alert('Logo deleted!');
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Associations</h1>

      {/* Add/Edit Logo Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{editingLogoId ? 'Edit Logo' : 'Add New Logo'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="logoSrc" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              id="logoSrc"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newLogo.src}
              onChange={(e) => setNewLogo({ ...newLogo, src: e.target.value })}
              placeholder="e.g., https://example.com/logo.png"
            />
          </div>
          <div>
            <label htmlFor="logoAlt" className="block text-sm font-medium text-gray-700">Alt Text</label>
            <input
              type="text"
              id="logoAlt"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newLogo.alt}
              onChange={(e) => setNewLogo({ ...newLogo, alt: e.target.value })}
              placeholder="e.g., University Logo"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="logoLink" className="block text-sm font-medium text-gray-700">Link (Optional)</label>
            <input
              type="text"
              id="logoLink"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newLogo.link || ''}
              onChange={(e) => setNewLogo({ ...newLogo, link: e.target.value })}
              placeholder="e.g., https://example.com"
            />
          </div>
        </div>
        <button
          onClick={handleAddOrUpdateLogo}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
        >
          {editingLogoId ? 'Update Logo' : 'Add Logo'}
        </button>
        {editingLogoId && (
          <button
            onClick={() => { setNewLogo({ src: '', alt: '', link: '' }); setEditingLogoId(null); }}
            className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Current Logos Display */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Associated Logos</h2>
        {logos.length === 0 ? (
          <p className="text-gray-500">No logos found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {logos.map((logo) => (
              <div key={logo.id} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <img src={logo.src} alt={logo.alt} className="h-20 w-auto object-contain mb-2" />
                <p className="text-sm text-gray-700 text-center mb-2">{logo.alt}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(logo)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-1 px-2 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLogo(logo.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociationsAdminPage;
