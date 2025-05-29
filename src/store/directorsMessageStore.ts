// src/stores/directorsMessageStore.ts

import { create } from 'zustand';
import { DirectorMessage, DirectorsMessageStoreState } from '../types'; 

const API_URL = 'https://localhost/api/public/directorsMessageApi.php'; 

export const useDirectorsMessageStore = create<DirectorsMessageStoreState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchDirectorsMessages: async () => {
    console.log('Zustand Store: Starting fetchDirectorsMessages...'); 
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_URL);
      console.log('Zustand Store: API response received. Status:', response.status); 

      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      const result = await response.json();
      console.log('Zustand Store: API result parsed:', result); 

      if (result.success && Array.isArray(result.data)) {
        console.log('Zustand Store: Original data from API (before filter):', result.data); 

        const activeMessages: DirectorMessage[] = result.data.filter((message: DirectorMessage) => {
          // This is the robust filter for is_visible
          console.log(`Zustand Store: Checking message ID ${message.id}, is_visible raw:`, message.is_visible, ' -> after !! conversion:', !!message.is_visible); 
          return !!message.is_visible; 
        });

        console.log('Zustand Store: Filtered active messages (after filter):', activeMessages); 

        set({
          messages: activeMessages,
          isLoading: false,
          error: null,
        });
        console.log('Zustand Store: State updated with active messages. Current messages count:', activeMessages.length); 
      } else {
        throw new Error(result.message || 'Failed to fetch data from API (success: false or data not array).');
      }
    } catch (error: any) {
      console.error('Zustand Store: Error fetching directors messages:', error); 
      set({
        messages: [],
        isLoading: false,
        error: error.message || 'An unknown error occurred.',
      });
      console.log('Zustand Store: State updated with error.'); 
    }
  },
}));