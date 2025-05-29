// src/stores/visionMissionStore.ts

import { create } from 'zustand';
import { VisionMission, VisionMissionStoreState } from '../types';

const API_URL = 'https://localhost/api/public/visionMissionApi.php'; 

export const useVisionMissionStore = create<VisionMissionStoreState>((set, get) => ({
  vision: null,
  mission: null,
  isLoading: false,
  error: null,

  fetchVisionMission: async () => {
    console.log('Zustand Store: Starting fetchVisionMission...');
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_URL);
      console.log('Zustand Store: Vision/Mission API response received. Status:', response.status);


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      const result = await response.json();
      console.log('Zustand Store: Vision/Mission API result parsed:', result);

      if (result.success && Array.isArray(result.data)) {
        console.log('Zustand Store: Original Vision/Mission data from API (before filter):', result.data);

        const activeEntries: VisionMission[] = result.data.filter((entry: VisionMission) => {
          console.log(`Zustand Store: Filtering entry ID ${entry.id}, type: ${entry.type}, is_visible raw:`, entry.is_visible, ' -> after !! conversion:', !!entry.is_visible);
          return !!entry.is_visible;
        });

        console.log('Zustand Store: Filtered active Vision/Mission entries:', activeEntries);
        // --- ADDED LOG HERE ---
        console.log('Zustand Store: Number of active entries found:', activeEntries.length);


        let activeVision: VisionMission | null = null;
        let activeMission: VisionMission | null = null;

        activeEntries.forEach((entry) => {
          console.log(`Zustand Store: Processing entry for assignment - ID: ${entry.id}, Type: ${entry.type}`); // ADDED LOG
          if (entry.type === 'vision' && activeVision === null) {
            activeVision = entry;
            console.log('Zustand Store: Assigned Vision:', activeVision.id); // ADDED LOG
          } else if (entry.type === 'mission' && activeMission === null) {
            activeMission = entry;
            console.log('Zustand Store: Assigned Mission:', activeMission.id); // ADDED LOG
          }
        });

        set({
          vision: activeVision,
          mission: activeMission,
          isLoading: false,
          error: null,
        });
        console.log('Zustand Store: State updated with active Vision/Mission data.');
        console.log('Zustand Store: Final Current Vision in store:', get().vision); // ADDED LOG
        console.log('Zustand Store: Final Current Mission in store:', get().mission); // ADDED LOG

      } else {
        throw new Error(result.message || 'Failed to fetch Vision/Mission data from API (success: false or data not array).');
      }
    } catch (error: any) {
      console.error('Zustand Store: Error fetching Vision/Mission:', error);
      set({
        vision: null,
        mission: null,
        isLoading: false,
        error: error.message || 'An unknown error occurred.',
      });
      console.log('Zustand Store: State updated with error for Vision/Mission.');
    }
  },
}));