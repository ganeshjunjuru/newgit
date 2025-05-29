// src/stores/principalMessageStore.ts

import { create } from 'zustand';
// Reusing DirectorMessage as the structure is identical
import { DirectorMessage, DirectorsMessageStoreState } from '../types'; 

// --- API Configuration ---
// Make sure this matches the exact URL of your new PHP API endpoint
const API_URL = 'https://localhost/api/public/principalMessageApi.php'; 

// --- Create the Zustand Store ---
// The state interface is the same as DirectorsMessageStoreState because the data shape is identical
export const usePrincipalMessageStore = create<DirectorsMessageStoreState>((set, get) => ({
  // --- State Properties ---
  messages: [], // Will store principal messages
  isLoading: false,
  error: null,

  // --- Actions ---

  /**
   * Fetches principal's messages from the API and stores only the active ones.
   */
  fetchDirectorsMessages: async () => { // Action name remains generic 'fetchMessages' or specific 'fetchPrincipalMessages'
    console.log('Zustand Store: Starting fetchPrincipalMessages...'); 
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_URL);
      console.log('Zustand Store: Principal API response received. Status:', response.status); 

      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      const result = await response.json();
      console.log('Zustand Store: Principal API result parsed:', result); 

      if (result.success && Array.isArray(result.data)) {
        console.log('Zustand Store: Original principal data from API (before filter):', result.data); 

        // Filter out messages where is_visible is false (or 0 from PHP)
        const activeMessages: DirectorMessage[] = result.data.filter((message: DirectorMessage) => {
          console.log(`Zustand Store: Checking principal message ID ${message.id}, is_visible raw:`, message.is_visible, ' -> after !! conversion:', !!message.is_visible); 
          return !!message.is_visible; 
        });

        console.log('Zustand Store: Filtered active principal messages:', activeMessages); 

        set({
          messages: activeMessages, // Store ONLY active messages
          isLoading: false,
          error: null,
        });
        console.log('Zustand Store: State updated with active principal messages. Current messages count:', activeMessages.length); 
      } else {
        throw new Error(result.message || 'Failed to fetch principal data from API (success: false or data not array).');
      }
    } catch (error: any) {
      console.error('Zustand Store: Error fetching principal messages:', error); 
      set({
        messages: [],
        isLoading: false,
        error: error.message || 'An unknown error occurred.',
      });
      console.log('Zustand Store: State updated with error for principal messages.'); 
    }
  },
}));