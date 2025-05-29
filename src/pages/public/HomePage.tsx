import React, { useEffect } from 'react';
import { useCoursesStore } from '../../store/coursesStore';
import { useNewsStore } from '../../store/newsStore';
import { useEventsStore } from '../../store/eventsStore';
import { useFacultyStore } from '../../store/facultyStore';

import ImageCarousel from '../../components/public/ImageCarousel';
import ScrollingTextBar from '../../components/public/ScrollingTextBar';
import WelcomeSection from '../../components/public/WelcomeSection';
import NotificationsBox from '../../components/public/NotificationsBox';
import CircularsBox from '../../components/public/CircularsBox';
import CoursesOffered from '../../components/public/CoursesOffered';
import QuickStatsSection from '../../components/public/QuickStatsSection';
import DirectorsMessageSection from '../../components/public/DirectorsMessageSection';
import PrincipalsMessageSection from '../../components/public/PrincipalsMessageSection';
import VisionMissionSection from '../../components/public/VisionMissionSection';
import AssociatedWithSection from '../../components/public/AssociatedWithSection';
import RecruitingPartnersSection from '../../components/public/RecruitingPartnersSection';
import QueryContactSection from '../../components/public/QueryContactSection';
import Spacer from '../../components/public/Spacer';

const HomePage: React.FC = () => {
  const fetchCourses = useCoursesStore((state) => state.fetchCourses);
  const fetchNews = useNewsStore((state) => state.fetchNews);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const fetchFaculty = useFacultyStore((state) => state.fetchFaculty);

  useEffect(() => {
    fetchCourses?.();
    fetchNews?.();
    fetchEvents?.();
    fetchFaculty?.();
  }, [fetchCourses, fetchNews, fetchEvents, fetchFaculty]);

  const stats = [
    { label: 'Founded', value: '1965' },
    { label: 'Students', value: '12,500+' },
    { label: 'Faculty', value: '850' },
    { label: 'Programs', value: '120+' },
  ];

  const carouselImages = [
    {
      src: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Students walking on campus',
    },
    {
      src: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Modern college building',
    },
    {
      src: 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Students in a library',
    },
    {
      src: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Graduation ceremony',
    },
  ];

  return (
    <div>
      <section className="pt-24 md:pt-28 lg:pt-32">
        <ImageCarousel images={carouselImages} interval={5000} />
      </section>

      <ScrollingTextBar
        text="Sreepaada Degree College Madhavadhara Visakhapatanam"
        speed="normal"
        backgroundColor="#0b3d64"
        textColor="#ffffff"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <WelcomeSection />
            <NotificationsBox />
            <CircularsBox />
          </div>
        </div>
      </section>

      <CoursesOffered />

      <QuickStatsSection stats={stats} />

      <Spacer height="h-24" />

      <DirectorsMessageSection />
	  

      <PrincipalsMessageSection />

      <VisionMissionSection />

      <AssociatedWithSection />

      <RecruitingPartnersSection />

      <QueryContactSection />

     
    </div>
  );
};

export default HomePage;
