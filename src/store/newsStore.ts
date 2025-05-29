import { create } from 'zustand';
import { NewsItem } from '../types';

interface NewsState {
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  fetchNews: () => Promise<void>;
  addNews: (news: Omit<NewsItem, 'id'>) => Promise<void>;
  updateNews: (id: number, updates: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
}

// Mock news data - in a real app, this would come from the PHP/MySQL backend
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: 'College Receives Major Research Grant',
    slug: 'college-receives-major-research-grant',
    content: '<p>Our college has received a prestigious $2 million grant to fund innovative research in renewable energy technologies. This funding will support faculty and student research projects over the next three years.</p><p>The grant, provided by the National Science Foundation, will allow our engineering department to expand its renewable energy lab and purchase state-of-the-art equipment for testing solar panel efficiency.</p><p>"This is a transformative opportunity for our students to engage in cutting-edge research," said Dr. Sarah Johnson, Dean of Engineering. "The experience they gain will be invaluable as they enter careers in sustainable energy."</p>',
    excerpt: 'Our college has received a prestigious $2 million grant to fund innovative research in renewable energy technologies.',
    image: 'https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Research',
    authorId: 1,
    publishedAt: '2023-09-15T09:00:00Z',
    updatedAt: '2023-09-15T09:00:00Z',
  },
  {
    id: 2,
    title: 'New Computer Science Program Launches This Fall',
    slug: 'new-computer-science-program-launches',
    content: '<p>The Department of Computer Science is excited to announce the launch of our new Artificial Intelligence and Machine Learning degree program. Starting this fall, students can enroll in this cutting-edge program designed to prepare them for careers in the rapidly growing field of AI.</p><p>The curriculum includes courses in neural networks, deep learning, natural language processing, and ethical considerations in AI development. Students will work on real-world projects in collaboration with industry partners.</p><p>"Weve designed this program to address the critical shortage of AI specialists in the job market," explained Dr. Michael Chen, Program Director. "Graduates will be well-positioned for careers in tech companies, healthcare, finance, and many other sectors."</p>',
    excerpt: 'The Department of Computer Science is excited to announce the launch of our new Artificial Intelligence and Machine Learning degree program.',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Academics',
    authorId: 2,
    publishedAt: '2023-08-28T14:30:00Z',
    updatedAt: '2023-08-30T11:15:00Z',
  },
  {
    id: 3,
    title: 'College Basketball Team Reaches National Finals',
    slug: 'college-basketball-team-reaches-national-finals',
    content: '<p>In a thrilling semifinal match, our college basketball team secured a place in the national championship finals for the first time in 15 years. The team overcame a 10-point deficit in the final quarter to win 78-75.</p><p>Team captain Marcus Wilson led the charge with 24 points and 8 rebounds, while freshman sensation Alicia Rodriguez contributed a crucial 18 points including the game-winning three-pointer.</p><p>"This team has shown incredible heart and determination all season," said Coach Thompson. "Were looking forward to bringing home the championship trophy next weekend."</p><p>The final game will be played at Madison Square Garden on Saturday, with a special viewing party planned in the campus gymnasium for students and faculty.</p>',
    excerpt: 'In a thrilling semifinal match, our college basketball team secured a place in the national championship finals for the first time in 15 years.',
    image: 'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Sports',
    authorId: 1,
    publishedAt: '2023-10-02T18:45:00Z',
    updatedAt: '2023-10-03T09:20:00Z',
  },
];

export const useNewsStore = create<NewsState>((set, get) => ({
  news: [],
  isLoading: false,
  error: null,

  fetchNews: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would be a fetch request to a PHP backend
      set({ news: mockNews, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch news', isLoading: false });
    }
  },

  addNews: async (newsItem) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a POST request to the PHP backend
      const newId = Math.max(0, ...get().news.map(n => n.id)) + 1;
      const newNewsItem = {
        ...newsItem,
        id: newId,
        updatedAt: new Date().toISOString(),
      } as NewsItem;
      
      set({ 
        news: [...get().news, newNewsItem],
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to add news item', isLoading: false });
    }
  },

  updateNews: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a PUT/PATCH request to the PHP backend
      const updatedNews = get().news.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date().toISOString() } 
          : item
      );
      
      set({ news: updatedNews, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update news item', isLoading: false });
    }
  },

  deleteNews: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, this would send a DELETE request to the PHP backend
      const filteredNews = get().news.filter(item => item.id !== id);
      
      set({ news: filteredNews, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to delete news item', isLoading: false });
    }
  }
}));