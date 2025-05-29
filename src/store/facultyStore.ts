import { create } from 'zustand';
import { Faculty } from '../types';

interface FacultyState {
  faculty: Faculty[];
  isLoading: boolean;
  error: string | null;
  fetchFaculty: () => Promise<void>;
  addFaculty: (faculty: Omit<Faculty, 'id'>) => Promise<void>;
  updateFaculty: (id: number, updates: Partial<Faculty>) => Promise<void>;
  deleteFaculty: (id: number) => Promise<void>;
}

// Mock faculty data - in a real app, this would come from the PHP/MySQL backend
const mockFaculty: Faculty[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Dean of Engineering',
    department: 'Engineering',
    email: 'sjohnson@college.edu',
    phone: '(555) 123-4567',
    bio: 'Dr. Johnson has over 20 years of experience in mechanical engineering and has published numerous papers on renewable energy technologies. She leads our engineering department with a focus on innovation and practical applications.',
    image: 'https://images.pexels.com/photos/3772509/pexels-photo-3772509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specializations: ['Mechanical Engineering', 'Renewable Energy', 'Materials Science'],
    education: ['Ph.D. Mechanical Engineering, MIT', 'M.S. Materials Science, Stanford University', 'B.S. Engineering, CalTech'],
    featured: true,
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    title: 'Professor of Computer Science',
    department: 'Computer Science',
    email: 'mchen@college.edu',
    phone: '(555) 234-5678',
    bio: 'Dr. Chen specializes in artificial intelligence and machine learning. His research has been funded by major tech companies and he has developed several patented algorithms currently used in industry applications.',
    image: 'https://images.pexels.com/photos/5684307/pexels-photo-5684307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specializations: ['Artificial Intelligence', 'Machine Learning', 'Neural Networks'],
    education: ['Ph.D. Computer Science, UC Berkeley', 'M.S. Computer Science, University of Washington', 'B.S. Computer Engineering, University of Illinois'],
    featured: true,
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    title: 'Associate Professor of Psychology',
    department: 'Psychology',
    email: 'erodriguez@college.edu',
    phone: '(555) 345-6789',
    bio: 'Dr. Rodriguez conducts research on cognitive development in children and adolescents. She has published extensively in top psychology journals and serves on the editorial board of the Journal of Developmental Psychology.',
    image: 'https://images.pexels.com/photos/7242908/pexels-photo-7242908.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specializations: ['Developmental Psychology', 'Cognitive Psychology', 'Educational Psychology'],
    education: ['Ph.D. Psychology, Harvard University', 'M.A. Child Development, Columbia University', 'B.A. Psychology, NYU'],
    featured: false,
  },
  {
    id: 4,
    name: 'Prof. David Wilson',
    title: 'Assistant Professor of Business',
    department: 'Business Administration',
    email: 'dwilson@college.edu',
    phone: '(555) 456-7890',
    bio: 'Professor Wilson brings 15 years of industry experience as a former marketing executive. His research focuses on digital marketing strategies and consumer behavior in e-commerce environments.',
    image: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specializations: ['Marketing', 'Consumer Behavior', 'E-commerce'],
    education: ['MBA, Wharton School of Business', 'B.S. Marketing, University of Michigan'],
    featured: false,
  },
];

export const useFacultyStore = create<FacultyState>((set, get) => ({
  faculty: [],
  isLoading: false,
  error: null,

  fetchFaculty: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would be a fetch request to a PHP backend
      set({ faculty: mockFaculty, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch faculty data', isLoading: false });
    }
  },

  addFaculty: async (faculty) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a POST request to the PHP backend
      const newId = Math.max(0, ...get().faculty.map(f => f.id)) + 1;
      const newFaculty = {
        ...faculty,
        id: newId,
      } as Faculty;
      
      set({ 
        faculty: [...get().faculty, newFaculty],
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to add faculty member', isLoading: false });
    }
  },

  updateFaculty: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a PUT/PATCH request to the PHP backend
      const updatedFaculty = get().faculty.map(faculty => 
        faculty.id === id 
          ? { ...faculty, ...updates } 
          : faculty
      );
      
      set({ faculty: updatedFaculty, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update faculty member', isLoading: false });
    }
  },

  deleteFaculty: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a DELETE request to the PHP backend
      const filteredFaculty = get().faculty.filter(faculty => faculty.id !== id);
      
      set({ faculty: filteredFaculty, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to delete faculty member', isLoading: false });
    }
  }
}));