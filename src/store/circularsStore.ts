// src/stores/circularsStore.ts

import { create } from 'zustand';
// Fix: Corrected import path. Assuming your types.ts is in src/types.ts
import { Circular, CircularsStoreState } from '../types';

// --- API Configuration --- // Fix: Changed comment syntax
// Make sure this matches the exact URL of your new PHP API endpoint
const API_URL = 'https://localhost/api/public/circularsApi.php'; // Using http as per previous examples, ensure it matches your server

// --- Create the Zustand Store --- // Fix: Changed comment syntax
export const useCircularsStore = create<CircularsStoreState>((set, get) => ({
  // --- State Properties --- // Fix: Changed comment syntax
  circulars: [],
  isLoading: false,
  error: null,

  // --- Actions --- // Fix: Changed comment syntax

  /**
   * Fetches circulars from the API.
   * Circulars are not filtered by 'is_visible' as per the table schema.
   */
  fetchCirculars: async () => {
    console.log('Zustand Store: Starting fetchCirculars...');
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_URL);
      console.log('Zustand Store: Circulars API response received. Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      const result = await response.json();
      console.log('Zustand Store: Circulars API result parsed:', result);

      if (result.success && Array.isArray(result.data)) {
        console.log('Zustand Store: Original circulars data:', result.data);

        const fetchedCirculars: Circular[] = result.data as Circular[];

        set({
          circulars: fetchedCirculars,
          isLoading: false,
          error: null,
        });
        console.log('Zustand Store: State updated with circulars. Count:', fetchedCirculars.length);
      } else {
        throw new Error(result.message || 'Failed to fetch circulars (success: false or data not array).');
      }
    } catch (error: any) {
      console.error('Zustand Store: Error fetching circulars:', error);
      set({
        circulars: [],
        isLoading: false,
        error: error.message || 'An unknown error occurred.',
      });
      console.log('Zustand Store: State updated with error for circulars.');
    }
  },
}));