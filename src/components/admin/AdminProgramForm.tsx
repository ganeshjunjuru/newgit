import React, { useState } from 'react';
import { useProgramsStore } from '../../store/programsStore';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AdminProgramFormProps {
  initialData?: Partial<{
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    level: 'undergraduate' | 'graduate' | 'certificate';
    duration: string;
    credits: number;
    department: string;
    featured: boolean;
  }>;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminProgramForm: React.FC<AdminProgramFormProps> = ({
  initialData,
  onSuccess,
  onCancel
}) => {
  const { addProgram, updateProgram, isLoading } = useProgramsStore();
  const isEditing = !!initialData?.id;
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    level: initialData?.level || 'undergraduate',
    duration: initialData?.duration || '',
    credits: initialData?.credits || 0,
    department: initialData?.department || '',
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
    
    // Handle number input
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from title if slug field is empty
    if (name === 'title' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.credits) newErrors.credits = 'Credits are required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      if (isEditing && initialData?.id) {
        await updateProgram(initialData.id, formData);
      } else {
        await addProgram(formData);
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
          label="Program Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
        
        <Input
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          error={errors.slug}
          helperText="URL-friendly version of the title"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          error={errors.image}
          helperText="Enter a URL for the program image"
          required
        />
        
        <div>
          <label className="block text-gray-700 font-medium mb-1">Program Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.level ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select Level</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="certificate">Certificate</option>
          </select>
          {errors.level && (
            <p className="mt-1 text-sm text-red-600">{errors.level}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          error={errors.duration}
          placeholder="e.g., 4 years"
          required
        />
        
        <Input
          label="Credits"
          type="number"
          name="credits"
          value={formData.credits.toString()}
          onChange={handleChange}
          error={errors.credits}
          min={0}
          required
        />
        
        <Input
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          error={errors.department}
          required
        />
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
          Featured Program (displayed on homepage)
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
          {isEditing ? 'Update Program' : 'Add Program'}
        </Button>
      </div>
    </form>
  );
};

export default AdminProgramForm;