import React, { useState, useEffect } from 'react';
import {
  Settings, Edit, Save, XCircle, UploadCloud, Eye,
  Globe, Layout, Mail, BarChart2, Zap,
  Database, Info, Lock, Users
} from 'lucide-react';

// Import the dashboard settings store
import { useDashboardSettingsStore } from '../../store/dashboardSettingsStore'; // Adjust path if necessary based on your project structure

// NOTE: In a real application, 'Button' and 'Input' components
// would be imported from your project's UI library or component directory.
// For this complete script demonstration, simple placeholder components are used.

// --- PLACEHOLDER UI COMPONENTS (YOU SHOULD REPLACE THESE WITH YOUR ACTUAL COMPONENTS) ---
interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200';
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-600 text-white hover:bg-blue-700';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      break;
    case 'danger':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700';
      break;
  }
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', ...rest }) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
      {...rest}
    />
  </div>
);

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-700 font-medium">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer
        peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
        ${checked ? 'peer-checked:bg-blue-600' : ''}`}
      ></div>
    </label>
  </div>
);

// --- END OF PLACEHOLDER UI COMPONENTS ---


// Define a type for a single setting item
// This type should match the 'Setting' type in your dashboardSettingsStore.ts
type SettingItem = {
  key: string;
  value: string | boolean; // Value can be string or boolean for 'boolean' type
  type: 'text' | 'textarea' | 'email' | 'url' | 'code' | 'image' | 'boolean';
};

// Define the structure of the settings object from your JSON response
// This type should match the 'SettingsGroup' type in your dashboardSettingsStore.ts
type SettingsData = {
  [group: string]: SettingItem[];
};


const AdminSettings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Use the zustand store to get settings, loading state, error, and the fetch function
  const { settings, loading, error, fetchSettings } = useDashboardSettingsStore();

  // Local state to manage changes before saving, initialized from the store's settings
  const [currentEditedSettings, setCurrentEditedSettings] = useState<SettingsData>({});
  // State to hold the original settings fetched from the store, for reverting
  const [originalSettings, setOriginalSettings] = useState<SettingsData>({});

  // Effect to fetch settings from the store when the component mounts
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]); // Depend on fetchSettings so it's called if the function reference changes (though it's stable with zustand)

  // Effect to update local state when settings from the store change
  useEffect(() => {
    if (settings) {
      setCurrentEditedSettings(settings);
      setOriginalSettings(settings);
    }
  }, [settings]); // Depend on 'settings' from the store


  // Function to handle changes in setting values in the local state
  const handleSettingChange = (category: string, key: string, newValue: string | boolean) => {
    setCurrentEditedSettings(prevSettings => ({
      ...prevSettings,
      [category]: (prevSettings[category] || []).map(item =>
        item.key === key ? { ...item, value: newValue } : item
      )
    }));
  };

  // Define your tabs structure
  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
    { id: 'branding', label: 'Branding', icon: <Layout size={18} /> },
    { id: 'social', label: 'Social', icon: <Users size={18} /> },
    { id: 'seo', label: 'SEO', icon: <BarChart2 size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <Zap size={18} /> },
    { id: 'advance', label: 'Advance', icon: <Database size={18} /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Lock size={18} /> },
  ];

  // Function to render individual setting inputs based on their type
  const renderSettingInput = (category: string, item: SettingItem) => {
    // Generate a user-friendly label from the key (e.g., "cache_management" -> "Cache Management")
    const label = item.key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const commonProps = {
      id: item.key,
      label: label,
      disabled: !isEditing,
      value: String(item.value), // Ensure value is a string for HTML inputs
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleSettingChange(category, item.key, e.target.value),
      className: 'mb-4' // Add some margin for spacing (adjust as per your CSS)
    };

    switch (item.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <Input
            type={item.type === 'email' ? 'email' : 'text'}
            {...commonProps}
          />
        );
      case 'textarea':
      case 'code': // For code, render as a textarea
        return (
          <div className="mb-4">
            <label htmlFor={item.key} className="block text-gray-700 text-sm font-bold mb-2">
              {commonProps.label}
            </label>
            <textarea
              {...commonProps}
              rows={item.type === 'code' ? 6 : 3} // More rows for code snippets
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        );
      case 'boolean':
        return (
          <Toggle
            label={commonProps.label}
            checked={item.value === true || item.value === 'true'} // Handle both boolean and string 'true'/'false'
            onChange={(checked) => handleSettingChange(category, item.key, checked)}
            disabled={!isEditing}
          />
        );
      case 'image':
        return (
          <div className="mb-4">
            <label htmlFor={item.key} className="block text-gray-700 text-sm font-bold mb-2">
              {commonProps.label}
            </label>
            <div className="flex items-center">
              <Input type="text" {...commonProps} className="flex-grow mr-2" />
              {/* Image preview */}
              {item.value && typeof item.value === 'string' && (
                <img
                  src={item.value}
                  alt={`${item.key} preview`}
                  className="h-10 w-10 object-contain border border-gray-200 p-1 rounded"
                />
              )}
              {isEditing && (
                <Button variant="secondary" className="ml-2">
                  <UploadCloud size={18} />
                </Button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Function to render content for the active tab
  const renderTabContent = () => {
    const currentCategory = activeTab as keyof SettingsData;

    // Use currentEditedSettings for rendering as this holds user's potential changes
    const items = currentEditedSettings[currentCategory];

    if (loading) return <p className="text-center text-blue-600">Loading settings...</p>;
    if (error) return <p className="text-center text-red-600">Error: {error}</p>;
    if (!items || items.length === 0) return <p className="text-gray-500">No settings available for this category.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.key}>
            {renderSettingInput(currentCategory, item)}
          </div>
        ))}
      </div>
    );
  };

  // NOTE: Assuming useAuthStore provides a way to check user permissions
  // Replace `true` with your actual authorization check
  const userCanEdit = true;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 text-blue-600" size={32} />
            Website Settings
          </h1>
          {/* Action Buttons */}
          {userCanEdit && (
            <>
              {isEditing ? (
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      // Here you would typically send currentEditedSettings to your backend
                      // This might involve calling another action in your zustand store,
                      // or a direct API call from this component.
                      setIsEditing(false);
                      // On successful save, update originalSettings to reflect the new state
                      setOriginalSettings(currentEditedSettings);
                      console.log('Settings saved:', currentEditedSettings);
                      alert('Settings saved successfully!');
                    }}
                    variant="primary"
                    className="flex items-center px-5 py-2"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      // Revert changes by setting currentEditedSettings back to originalSettings
                      setCurrentEditedSettings(originalSettings);
                      alert('Changes discarded.');
                    }}
                    variant="secondary"
                    className="flex items-center px-5 py-2"
                  >
                    <XCircle size={18} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  className="flex items-center px-5 py-2"
                >
                  <Edit size={18} className="mr-2" />
                  Edit Settings
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="border-b border-gray-200 mb-6 overflow-x-auto pb-2">
          <nav className="-mb-px flex space-x-6 sm:space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;