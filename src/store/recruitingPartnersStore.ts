// src/stores/recruitingPartnersStore.ts

import { create } from 'zustand';
import { RecruitingPartner, RecruitingPartnersStoreState } from '../types';

// --- API Configuration ---
// Make sure this matches the exact URL of your new PHP API endpoint
const API_URL = 'https://localhost/api/public/recruitingPartnersApi.php'; 

// --- Create the Zustand Store ---
export const useRecruitingPartnersStore = create<RecruitingPartnersStoreState>((set, get) => ({
  // --- State Properties ---
  recruitingPartners: [], // Initially empty array
  isLoading: false,
  error: null,

  // --- Actions ---

  /**
   * Fetches recruiting partners from the API and stores only the visible ones.
   */
  fetchRecruitingPartners: async () => {
    console.log('Zustand Store: Starting fetchRecruitingPartners...');
    set({ isLoading: true, error: null }); // Set loading to true and clear any previous errors

    try {
      const response = await fetch(API_URL);
      console.log('Zustand Store: Recruiting Partners API response received. Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      const result = await response.json();
      console.log('Zustand Store: Recruiting Partners API result parsed:', result);

      if (result.success && Array.isArray(result.data)) {
        console.log('Zustand Store: Original recruiting partners data (before filter):', result.data);

        // Filter out entities where is_visible is false (or 0 from PHP)
        const visiblePartners: RecruitingPartner[] = result.data.filter((partner: RecruitingPartner) => {
          console.log(`Zustand Store: Checking partner ID ${partner.id}, name: ${partner.name}, is_visible raw:`, partner.is_visible, ' -> after !! conversion:', !!partner.is_visible);
          return !!partner.is_visible; // Ensure is_visible is treated as a boolean
        });

        console.log('Zustand Store: Filtered visible recruiting partners:', visiblePartners);

        set({
          recruitingPartners: visiblePartners, // Store ONLY visible partners
          isLoading: false,
          error: null,
        });
        console.log('Zustand Store: State updated with visible recruiting partners. Count:', visiblePartners.length);
      } else {
        throw new Error(result.message || 'Failed to fetch recruiting partners (success: false or data not array).');
      }
    } catch (error: any) {
      console.error('Zustand Store: Error fetching recruiting partners:', error);
      set({
        recruitingPartners: [], // Clear partners on error
        isLoading: false,
        error: error.message || 'An unknown error occurred.',
      });
      console.log('Zustand Store: State updated with error for recruiting partners.');
    }
  },
}));