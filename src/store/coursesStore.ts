import { create } from 'zustand';

export interface CourseItem {
  id: number;
  name: string;
  specialization: string;
  imageSrc: string;
  link: string;
}

interface CoursesState {
  courses: CourseItem[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  loading: true,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost/api/public/courses.php');
      const data = await response.json();

      const formattedCourses = (data || []).map((course: any) => ({
        id: course.id,
        name: course.course_name,
        specialization: course.course_specialization,
        imageSrc: course.course_image || '', // fallback handled in UI
        link: `/courses/${course.id}`, // or set a real link if available
      }));

      set({ courses: formattedCourses, loading: false, error: null });
    } catch (err: any) {
      set({ error: 'Failed to load courses', loading: false });
    }
  }
}));
