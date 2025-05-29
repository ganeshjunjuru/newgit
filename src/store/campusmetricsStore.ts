// src/stores/campusmetricsStore.ts (or src/hooks/campusmetricsStore.ts)

import { create } from 'zustand';

// 1. Define the type for a single metric
interface Metric {
  metric_name: string;
  metric_value: string;
}

// 2. Define the shape of our store's state
interface CampusMetricsState {
  metrics: Metric[];
  loading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
}

// 3. Create the Zustand store
export const useCampusMetricsStore = create<CampusMetricsState>((set) => ({
  metrics: [],
  loading: false,
  error: null,

  // Async function to fetch data from the API
  fetchMetrics: async () => {
    set({ loading: true, error: null }); // Set loading to true and clear any previous error

    try {
      // Replace with the actual URL of your PHP API endpoint
      const response = await fetch('https://localhost/api/public/CampusMetrics.php'); 
      
      // Check if the response was successful (status code 2xx)
      if (!response.ok) {
        // Attempt to parse error message from server if available
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: Metric[] = await response.json(); // Parse the JSON response
      set({ metrics: data, loading: false }); // Update metrics and set loading to false

    } catch (err: any) {
      // Catch any errors during fetch or JSON parsing
      console.error("Failed to fetch campus metrics:", err);
      set({ error: err.message || 'An unknown error occurred', loading: false }); // Set error and loading to false
    }
  },
}));