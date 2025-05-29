// src/stores/welcomeMessageStore.ts

import { create } from 'zustand';
import { WelcomeMessage, WelcomeMessageStoreState } from '../types';

// --- API Configuration ---
// Make sure this matches the exact URL of your new PHP API endpoint
const API_URL = 'https://localhost/api/public/welcomeMessageApi.php'; 

// --- Create the Zustand Store ---
export const useWelcomeMessageStore = create<WelcomeMessageStoreState>((set, get) => ({
  // --- State Properties ---
  welcomeMessage: null, // Initially no message
  isLoading: false,
  error: null,

  // --- Actions ---

  /**
   * Fetches the welcome message from the API.
   * Expected to fetch a single object or null.
   */
  fetchWelcomeMessage: async () => {
    console.log('Zustand Store: Starting fetchWelcomeMessage...');
    set({ isLoading: true, error: null }); // Set loading to true and clear any previous errors

    try {
      const response = await fetch(API_URL);
      console.log('Zustand Store: Welcome Message API response received. Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      const result = await response.json();
      console.log('Zustand Store: Welcome Message API result parsed:', result);

      if (result.success) {
        // The API returns 'data: null' if no active message, or 'data: {message_object}'
        const fetchedMessage: WelcomeMessage | null = result.data ? (result.data as WelcomeMessage) : null;

        set({
          welcomeMessage: fetchedMessage,
          isLoading: false,
          error: null,
        });
        console.log('Zustand Store: State updated with welcome message:', fetchedMessage ? 'Found' : 'Not Found');
      } else {
        throw new Error(result.message || 'Failed to fetch welcome message.');
      }
    } catch (error: any) {
      console.error('Zustand Store: Error fetching welcome message:', error);
      set({
        welcomeMessage: null, // Clear message on error
        isLoading: false,
        error: error.message || 'An unknown error occurred.',
      });
      console.log('Zustand Store: State updated with error for welcome message.');
    }
  },
}));