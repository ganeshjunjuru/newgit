// src/stores/scrollingTextStore.ts

import { create } from 'zustand';
// Import the ScrollingText interface from your types file.
// IMPORTANT: Adjust the path if your types.ts file is located elsewhere.
import { ScrollingText } from '../types'; 

// --- API Configuration ---
// IMPORTANT: Set this URL correctly!
// This should be the exact, publicly accessible path to your scrollingTextApi.php file on your server.
// Examples:
// - If your file is in C:\xampp\htdocs\scrollingTextApi.php, use 'http://localhost/scrollingTextApi.php'
// - If your file is in C:\xampp\htdocs\api\scrollingTextApi.php, use 'http://localhost/api/scrollingTextApi.php'
const API_URL_SCROLLING = 'https://localhost/api/public/scrollingTextApi.php'; 

// --- Interface for the Zustand Store State ---
// This defines the shape of the data and actions that the store will manage.
interface ScrollingTextStoreState {
  texts: ScrollingText[]; // An array to hold all fetched scrolling text objects
  isLoading: boolean;     // A boolean flag to indicate if data is currently being loaded
  error: string | null;   // Stores any error message if a fetch operation fails
  
  // --- Actions ---
  // Functions that components can call to interact with the store's state.
  fetchScrollingTexts: () => Promise<void>; // Fetches all active scrolling texts from the API
  addScrollingText: (textContent: string) => Promise<boolean>; // Adds a new scrolling text via the API
  // You might add other actions here later, e.g., updateScrollingText, deleteScrollingText, toggleActiveStatus
}

// --- Create the Zustand Store ---
// `create` is the core function from Zustand to define a store.
// It takes a function that returns the initial state and actions.
export const useScrollingTextStore = create<ScrollingTextStoreState>((set, get) => ({
  // --- Initial State ---
  texts: [],      // Initially, no scrolling texts are loaded
  isLoading: false, // Not loading when the app first starts
  error: null,    // No error initially

  // --- Actions Implementation ---

  /**
   * `fetchScrollingTexts` Action:
   * Asynchronously fetches all active scrolling texts from the backend API.
   * Updates the store's `texts`, `isLoading`, and `error` states based on the API response.
   */
  fetchScrollingTexts: async () => {
    // Set loading state to true and clear any previous errors before starting the fetch.
    set({ isLoading: true, error: null });

    try {
      // Perform the GET request to the scrolling texts API endpoint.
      const response = await fetch(API_URL_SCROLLING);

      // Check if the HTTP response was successful (status code 200-299).
      if (!response.ok) {
        // If not successful, throw an error with the HTTP status.
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Parse the JSON response body.
      const result = await response.json();

      // Check the 'success' flag in the API's JSON response.
      if (result.success) {
        // If successful, update the store's `texts` with the fetched data.
        // Ensure `result.data` is an array of `ScrollingText` objects.
        set({ texts: result.data as ScrollingText[], isLoading: false });
      } else {
        // If the API reported a failure (success: false), set the error message.
        set({ error: result.message || 'Failed to fetch scrolling texts from API.', isLoading: false });
      }
    } catch (err: any) {
      // Catch any network errors or errors thrown during the fetch/parsing process.
      console.error("Error fetching scrolling texts:", err);
      // Set the error state, ensuring it's a string message.
      set({ error: err instanceof Error ? err.message : 'Network Error occurred while fetching scrolling texts.', isLoading: false });
    }
  },

  /**
   * `addScrollingText` Action:
   * Asynchronously sends a POST request to the API to add a new scrolling text.
   * After successful addition, it re-fetches all texts to update the store's list.
   * @param textContent The content of the new scrolling message.
   * @returns A boolean indicating whether the text was successfully added.
   */
  addScrollingText: async (textContent: string): Promise<boolean> => {
    // Clear any previous errors before attempting to add.
    set({ error: null }); 
    try {
      // Perform the POST request to the scrolling texts API endpoint.
      const response = await fetch(API_URL_SCROLLING, {
        method: 'POST', // Specify POST method for adding data
        headers: {
          'Content-Type': 'application/json', // Indicate that the request body is JSON
        },
        // Send the text content and set is_active to true by default.
        body: JSON.stringify({ text_content: textContent, is_active: true }),
      });

      // Parse the JSON response from the server.
      const result = await response.json();

      // Check the 'success' flag in the API's JSON response.
      if (result.success) {
        // If successful, immediately re-fetch all scrolling texts to update the list
        // in the store, ensuring the newly added text appears.
        await get().fetchScrollingTexts();
        return true; // Indicate success
      } else {
        // If the API reported a failure, log and set the error message.
        console.error("Failed to add scrolling text:", result.message);
        set({ error: result.message });
        return false; // Indicate failure
      }
    } catch (err: any) {
      // Catch any network errors or errors thrown during the add process.
      console.error("Error adding scrolling text:", err);
      // Set the error state.
      set({ error: err instanceof Error ? err.message : 'Network Error occurred while adding scrolling text.' });
      return false; // Indicate failure
    }
  },
}));