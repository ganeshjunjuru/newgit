import React, { useState, useEffect } from 'react';

// Basic interface for a Recruiting Partner Logo item
interface PartnerLogo {
  id: string;
  src: string; // URL for the logo image
  alt: string; // Alt text for accessibility
  link?: string; // Optional: link to the partner's website
}

const RecruitingPartnersAdminPage: React.FC = () => {
  // Placeholder state for recruiting partner logos
  const [logos, setLogos] = useState<PartnerLogo[]>([
    { id: 'p1', src: 'https://placehold.co/180x60/FFFFFF/000000?text=Mahindra+Pride', alt: 'Mahindra Pride School Logo' },
    { id: 'p2', src: 'https://placehold.co/180x60/FFFFFF/000000?text=Navata+Road+Transport', alt: 'Navata Road Transport Logo' },
    { id: 'p3', src: 'https://placehold.co/180x60/FFFFFF/000000?text=Apollo+Pharmacy', alt: 'Apollo Pharmacy Logo' },
    { id: 'p4', src: 'https://placehold.co/180x60/FFFFFF/000000?text=Deccan+Fine+Chemicals', alt: 'Deccan Fine Chemicals Logo' },
  ]);

  // State for the form to add/edit a logo
  const [newLogo, setNewLogo] = useState<Omit<PartnerLogo, 'id'>>({ src: '', alt: '', link: '' });
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null);

  // In a real application, you would fetch this data from a backend on component mount
  useEffect(() => {
    // Example: fetch('/api/recruiting-partners').then(res => res.json()).then(data => setLogos(data));
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
      alert('Partner Logo updated successfully!');
    } else {
      // Add new logo
      setLogos([...logos, { ...newLogo, id: Date.now().toString() }]); // Simple ID generation
      alert('Partner Logo added successfully!');
    }
    setNewLogo({ src: '', alt: '', link: '' });
    setEditingLogoId(null);
  };

  const handleEditClick = (logo: PartnerLogo) => {
    setNewLogo({ src: logo.src, alt: logo.alt, link: logo.link });
    setEditingLogoId(logo.id);
  };

  const handleDeleteLogo = (id: string) => {
    if (confirm(`Are you sure you want to delete this partner logo?`)) {
      setLogos(logos.filter(logo => logo.id !== id));
      alert('Partner Logo deleted!');
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Recruiting Partners</h1>

      {/* Add/Edit Logo Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{editingLogoId ? 'Edit Partner Logo' : 'Add New Partner Logo'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="logoSrc" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              id="logoSrc"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newLogo.src}
              onChange={(e) => setNewLogo({ ...newLogo, src: e.target.value })}
              placeholder="e.g., https://example.com/partner.png"
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
              placeholder="e.g., Company Name Logo"
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
              placeholder="e.g., https://company.com"
            />
          </div>
        </div>
        <button
          onClick={handleAddOrUpdateLogo}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
        >
          {editingLogoId ? 'Update Partner' : 'Add Partner'}
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
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Recruiting Partner Logos</h2>
        {logos.length === 0 ? (
          <p className="text-gray-500">No partner logos found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {logos.map((logo) => (
              <div key={logo.id} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <img src={logo.src} alt={logo.alt} className="h-16 w-auto object-contain mb-2" />
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

export default RecruitingPartnersAdminPage;
