export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatar?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  authorId: number;
  publishedAt: string;
  updatedAt: string;
}

export interface Program {
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
}

export interface Faculty {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  bio: string;
  image: string;
  specializations: string[];
  education: string[];
  featured: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  organizer: string;
  featured: boolean;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  head: string;
  email: string;
  phone: string;
  image?: string;
}