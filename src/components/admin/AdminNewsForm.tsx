import React, { useState } from 'react';
import { useNewsStore } from '../../store/newsStore';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AdminNewsFormProps {
  initialData?: Partial<{
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string;
    category: string;
  }>;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminNewsForm: React.FC<AdminNewsFormProps> = ({
  initialData,
  onSuccess,
  onCancel
}) => {
  const { addNews, updateNews, isLoading } = useNewsStore();
  const isEditing = !!initialData?.id;
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    image: initialData?.image || '',
    category: initialData?.category || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
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
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      if (isEditing && initialData.id) {
        await updateNews(initialData.id, formData);
      } else {
        await addNews({
          ...formData,
          authorId: 1, // In a real app, this would be the current user's ID
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
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
          label="Title"
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
        <label className="block text-gray-700 font-medium mb-1">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-1">Excerpt</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.excerpt ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          error={errors.image}
          helperText="Enter a URL for the news image"
          required
        />
        
        <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select Category</option>
            <option value="Academics">Academics</option>
            <option value="Research">Research</option>
            <option value="Campus Life">Campus Life</option>
            <option value="Events">Events</option>
            <option value="Sports">Sports</option>
            <option value="Alumni">Alumni</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
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
          {isEditing ? 'Update News' : 'Publish News'}
        </Button>
      </div>
    </form>
  );
};

export default AdminNewsForm;