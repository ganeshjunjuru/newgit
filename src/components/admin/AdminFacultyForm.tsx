import React, { useState } from 'react';
import { useFacultyStore } from '../../store/facultyStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X, Plus } from 'lucide-react';

interface AdminFacultyFormProps {
  initialData?: Partial<{
    id: number;
    name: string;
    title: string;
    department: string;
    email: string;
    phone: string;
    bio: string;
    image: string;
    specializations: string[];
    education: string[];
    featured: boolean;
  }>;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminFacultyForm: React.FC<AdminFacultyFormProps> = ({
  initialData,
  onSuccess,
  onCancel
}) => {
  const { addFaculty, updateFaculty, isLoading } = useFacultyStore();
  const isEditing = !!initialData?.id;
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    title: initialData?.title || '',
    department: initialData?.department || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    bio: initialData?.bio || '',
    image: initialData?.image || '',
    specializations: initialData?.specializations || [''],
    education: initialData?.education || [''],
    featured: initialData?.featured || false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox input
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleArrayChange = (
    field: 'specializations' | 'education',
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };
  
  const handleAddArrayItem = (field: 'specializations' | 'education') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  
  const handleRemoveArrayItem = (field: 'specializations' | 'education', index: number) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    
    // Validate that specializations and education arrays have at least one non-empty value
    if (!formData.specializations.some(s => s.trim())) {
      newErrors.specializations = 'At least one specialization is required';
    }
    
    if (!formData.education.some(e => e.trim())) {
      newErrors.education = 'At least one education entry is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Clean up arrays by removing empty values
    const cleanedFormData = {
      ...formData,
      specializations: formData.specializations.filter(s => s.trim()),
      education: formData.education.filter(e => e.trim())
    };
    
    try {
      if (isEditing && initialData?.id) {
        await updateFaculty(initialData.id, cleanedFormData);
      } else {
        await addFaculty(cleanedFormData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <Input
          label="Title/Position"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Psychology">Psychology</option>
            <option value="Liberal Arts">Liberal Arts</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Natural Sciences">Natural Sciences</option>
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department}</p>
          )}
        </div>
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone (optional)"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        
        <Input
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          error={errors.image}
          helperText="Enter a URL for the faculty profile image"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-1">Biography</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.bio ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
        )}
      </div>
      
      {/* Specializations */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700 font-medium">Specializations</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddArrayItem('specializations')}
          >
            <Plus size={16} className="mr-1" /> Add
          </Button>
        </div>
        {errors.specializations && (
          <p className="mt-1 text-sm text-red-600 mb-2">{errors.specializations}</p>
        )}
        
        {formData.specializations.map((specialization, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              value={specialization}
              onChange={(e) => handleArrayChange('specializations', index, e.target.value)}
              className="flex-grow"
            />
            {formData.specializations.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveArrayItem('specializations', index)}
                className="ml-2 p-2 text-gray-500 hover:text-red-500"
                aria-label="Remove specialization"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Education */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700 font-medium">Education</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddArrayItem('education')}
          >
            <Plus size={16} className="mr-1" /> Add
          </Button>
        </div>
        {errors.education && (
          <p className="mt-1 text-sm text-red-600 mb-2">{errors.education}</p>
        )}
        
        {formData.education.map((education, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              value={education}
              onChange={(e) => handleArrayChange('education', index, e.target.value)}
              placeholder="e.g., Ph.D. Computer Science, MIT"
              className="flex-grow"
            />
            {formData.education.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveArrayItem('education', index)}
                className="ml-2 p-2 text-gray-500 hover:text-red-500"
                aria-label="Remove education"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="featured" className="ml-2 text-gray-700">
          Featured Faculty (displayed on homepage)
        </label>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isLoading}
        >
          {isEditing ? 'Update Faculty' : 'Add Faculty'}
        </Button>
      </div>
    </form>
  );
};

export default AdminFacultyForm;