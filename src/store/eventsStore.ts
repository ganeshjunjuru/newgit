import { create } from 'zustand';
import { Event } from '../types';

interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: number, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

// Mock events data - in a real app, this would come from the PHP/MySQL backend
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Fall Semester Orientation',
    description: 'Welcome session for all new students starting in the fall semester. Includes campus tour, department introductions, and student services information. Lunch will be provided.',
    startDate: '2023-08-28T09:00:00Z',
    endDate: '2023-08-28T16:00:00Z',
    location: 'Main Campus Auditorium',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizer: 'Student Affairs',
    featured: true,
  },
  {
    id: 2,
    title: 'Research Symposium',
    description: 'Annual research symposium showcasing faculty and graduate student research projects. Includes poster presentations, panel discussions, and keynote speaker Dr. Angela Martinez from MIT.',
    startDate: '2023-10-15T10:00:00Z',
    endDate: '2023-10-16T17:00:00Z',
    location: 'Science Building Conference Center',
    image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizer: 'Research Department',
    featured: true,
  },
  {
    id: 3,
    title: 'Career Fair',
    description: 'Connect with over 50 employers from various industries looking to hire interns and full-time employees. Bring your resume and dress professionally. Open to current students and recent graduates.',
    startDate: '2023-11-05T11:00:00Z',
    endDate: '2023-11-05T16:00:00Z',
    location: 'Student Union Ballroom',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizer: 'Career Services',
    featured: true,
  },
  {
    id: 4,
    title: 'Guest Lecture: Artificial Intelligence Ethics',
    description: 'Distinguished lecture by Dr. Robert Chang discussing the ethical implications of AI in healthcare, privacy concerns, and future regulatory challenges.',
    startDate: '2023-09-20T15:00:00Z',
    endDate: '2023-09-20T17:00:00Z',
    location: 'Computer Science Building, Room 105',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizer: 'Computer Science Department',
    featured: false,
  },
];

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would be a fetch request to a PHP backend
      set({ events: mockEvents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch events', isLoading: false });
    }
  },

  addEvent: async (event) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a POST request to the PHP backend
      const newId = Math.max(0, ...get().events.map(e => e.id)) + 1;
      const newEvent = {
        ...event,
        id: newId,
      } as Event;
      
      set({ 
        events: [...get().events, newEvent],
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to add event', isLoading: false });
    }
  },

  updateEvent: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a PUT/PATCH request to the PHP backend
      const updatedEvents = get().events.map(event => 
        event.id === id 
          ? { ...event, ...updates } 
          : event
      );
      
      set({ events: updatedEvents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update event', isLoading: false });
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a DELETE request to the PHP backend
      const filteredEvents = get().events.filter(event => event.id !== id);
      
      set({ events: filteredEvents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to delete event', isLoading: false });
    }
  }
}));