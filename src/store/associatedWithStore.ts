// src/stores/associatedWithStore.ts

import { create } from 'zustand';
import { AssociatedEntity, AssociatedWithStoreState } from '../types';

// --- API Configuration ---
// Make sure this matches the exact URL of your new PHP API endpoint
const API_URL = 'https://localhost/api/public/associatedWithApi.php'; 

// --- Create the Zustand Store ---
export const useAssociatedWithStore = create<AssociatedWithStoreState>((set, get) => ({
  // --- State Properties ---
  associatedEntities: [], // Initially empty array
  isLoading: false,
  error: null,

  // --- Actions ---

  /**
   * Fetches associated entities from the API and stores only the visible ones.
   */
  fetchAssociatedEntities: async () => {
    console.log('Zustand Store: Starting fetchAssociatedEntities...');
    set({ isLoading: true, error: null }); // Set loading to true and clear any previous errors

    try {
      const response = await fetch(API_URL);
      console.log('Zustand Store: Associated With API response received. Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      const result = await response.json();
      console.log('Zustand Store: Associated With API result parsed:', result);

      if (result.success && Array.isArray(result.data)) {
        console.log('Zustand Store: Original associated entities data (before filter):', result.data);

        // Filter out entities where is_visible is false (or 0 from PHP)
        const visibleEntities: AssociatedEntity[] = result.data.filter((entity: AssociatedEntity) => {
          console.log(`Zustand Store: Checking entity ID ${entity.id}, name: ${entity.name}, is_visible raw:`, entity.is_visible, ' -> after !! conversion:', !!entity.is_visible);
          return !!entity.is_visible; // Ensure is_visible is treated as a boolean
        });

        console.log('Zustand Store: Filtered visible associated entities:', visibleEntities);

        set({
          associatedEntities: visibleEntities, // Store ONLY visible entities
          isLoading: false,
          error: null,
        });
        console.log('Zustand Store: State updated with visible associated entities. Count:', visibleEntities.length);
      } else {
        throw new Error(result.message || 'Failed to fetch associated entities (success: false or data not array).');
      }
    } catch (error: any) {
      console.error('Zustand Store: Error fetching associated entities:', error);
      set({
        associatedEntities: [], // Clear entities on error
        isLoading: false,
        error: error.message || 'An unknown error occurred.',
      });
      console.log('Zustand Store: State updated with error for associated entities.');
    }
  },
}));