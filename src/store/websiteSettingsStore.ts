// src/stores/websiteSettingsStore.ts

import { create } from 'zustand';
import { WebsiteSettings, WebsiteSettingsStoreState } from '../types'; // Adjust path if needed

// IMPORTANT: Set your API URL correctly here!
const API_URL = 'https://localhost/api/public/websiteSettingsApi.php';
// Example if your PHP file is directly in htdocs: 'http://localhost/websiteSettingsApi.php'
// Example if your PHP file is in htdocs/api: 'http://localhost/api/websiteSettingsApi.php'
// Adjust 'your_api_folder' to your actual folder name.

export const useWebsiteSettingsStore = create<WebsiteSettingsStoreState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchWebsiteSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success) {
        // Ensure that any number fields are explicitly cast if needed, though JSON.parse often handles it
        // and PHP's FETCH_ASSOC might return numbers as strings.
        // For 'established_year', it's INT in DB, so cast to number.
        if (result.data && result.data.established_year !== null) {
            result.data.established_year = Number(result.data.established_year);
        }

        set({ settings: result.data, isLoading: false });
      } else {
        set({ error: result.message || 'Failed to fetch settings.', isLoading: false });
      }
    } catch (err) {
      console.error("Error fetching website settings:", err);
      set({ error: err instanceof Error ? err.message : 'Network Error', isLoading: false });
    }
  },
}));

// Optional: Automatically fetch settings on app start
// You might put this in your App.tsx or PublicLayout.tsx
// to ensure settings are fetched when the app loads.
/*
import { useEffect } from 'react';
import { useWebsiteSettingsStore } from './stores/websiteSettingsStore';

function App() {
  const fetchWebsiteSettings = useWebsiteSettingsStore((state) => state.fetchWebsiteSettings);

  useEffect(() => {
    fetchWebsiteSettings();
  }, [fetchWebsiteSettings]);

  // ... rest of your App component
}
*/