// headermenuStore.ts
import { create } from 'zustand';

// --- 1. Define TypeScript Interfaces to match your API response ---

// Interface for individual menu items
interface MenuItem {
  id: number;
  menu_id: number;
  item_text: string;    // Matches 'item_text' alias from API
  item_url: string;     // Matches 'item_url' alias from API
  display_order: number; // Matches 'display_order' alias from API (from order_index)
  parent_id: number | null;
  is_active: boolean;   // API sends 0 or 1, TypeScript will treat as boolean
  icon_class: string | null;
  target_blank: boolean; // API sends 0 or 1, TypeScript will treat as boolean
}

// Interface for a main header menu (e.g., "Main Navigation", "User Account Menu")
interface HeaderMenu {
  id: number;
  menu_name: string;    // Matches 'menu_name' alias from API
  items: MenuItem[];    // Nested array of menu items
}

// Interface for the overall API response structure
interface ApiResponse {
  success: boolean;
  message: string;
  data: HeaderMenu[]; // Array of HeaderMenu objects
}

// --- 2. Define the Store's State and Actions ---

interface HeaderMenuState {
  menus: HeaderMenu[]; // Array to hold the fetched header menus
  isLoading: boolean;  // Loading state for API calls
  error: string | null; // Error message if API call fails
  message: string;     // Message from the API response (e.g., "No active header menus found.")
  
  // Action to fetch menus from the API
  fetchMenus: () => Promise<void>;
}

// --- 3. Create the Zustand Store ---

const API_ENDPOINT = 'https://localhost/api/public/get_header_navigation.php'; // <<< IMPORTANT: Adjust this to your actual API URL

export const useHeaderMenuStore = create<HeaderMenuState>((set) => ({
  menus: [], // Initial state: empty array of menus
  isLoading: false, // Initial state: not loading
  error: null,      // Initial state: no error
  message: '',      // Initial state: empty message

  fetchMenus: async () => {
    set({ isLoading: true, error: null, message: '' }); // Set loading, clear previous error/message
    try {
      const response = await fetch(API_ENDPOINT);
      
      // Check if the HTTP response itself was successful
      if (!response.ok) {
        const errorText = await response.text(); // Get raw text for more info
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      const result: ApiResponse = await response.json();

      // Check the 'success' flag from your custom API response
      if (result.success) {
        set({
          menus: result.data,
          message: result.message,
          isLoading: false,
          error: null,
        });
      } else {
        // API returned success: false, but HTTP status was 200 (e.g., database query error)
        set({
          menus: [], // Clear menus on API-level error
          message: result.message,
          isLoading: false,
          error: result.message, // Use the API's message as the error
        });
      }

    } catch (err: any) {
      console.error("Failed to fetch header menus:", err);
      set({
        menus: [], // Clear menus on fetch error
        isLoading: false,
        error: err.message || 'An unknown error occurred during fetch.',
        message: 'Failed to load navigation.', // General message for UI
      });
    }
  },
}));