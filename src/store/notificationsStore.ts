// src/stores/notificationsStore.ts

import { create } from 'zustand';
import { Notification, NotificationsStoreState } from '../types';

// --- API Configuration ---
// Make sure this matches the exact URL of your new PHP API endpoint
const API_URL = 'https://localhost/api/public/notificationsApi.php'; 

// --- Create the Zustand Store ---
export const useNotificationsStore = create<NotificationsStoreState>((set, get) => ({
  // --- State Properties ---
  notifications: [], // Initially empty array
  isLoading: false,
  error: null,

  // --- Actions ---

  /**
   * Fetches notifications from the API.
   * Notifications are not filtered by 'is_visible' as per the table schema.
   */
  fetchNotifications: async () => {
    console.log('Zustand Store: Starting fetchNotifications...');
    set({ isLoading: true, error: null }); // Set loading to true and clear any previous errors

    try {
      const response = await fetch(API_URL);
      console.log('Zustand Store: Notifications API response received. Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      const result = await response.json();
      console.log('Zustand Store: Notifications API result parsed:', result);

      if (result.success && Array.isArray(result.data)) {
        console.log('Zustand Store: Original notifications data:', result.data);

        // No 'is_visible' filtering needed as per schema.
        // Cast to Notification[] to ensure type correctness.
        const fetchedNotifications: Notification[] = result.data as Notification[];

        set({
          notifications: fetchedNotifications, // Store all fetched notifications
          isLoading: false,
          error: null,
        });
        console.log('Zustand Store: State updated with notifications. Count:', fetchedNotifications.length);
      } else {
        throw new Error(result.message || 'Failed to fetch notifications (success: false or data not array).');
      }
    } catch (error: any) {
      console.error('Zustand Store: Error fetching notifications:', error);
      set({
        notifications: [], // Clear notifications on error
        isLoading: false,
        error: error.message || 'An unknown error occurred.',
      });
      console.log('Zustand Store: State updated with error for notifications.');
    }
  },
}));