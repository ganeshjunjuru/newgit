// webscrollStore.ts
import { create } from 'zustand';

// Define the structure of an image object as returned by your PHP API
// and used by your React carousel.
export interface CarouselImage {
  imageUrl: string;  // Corresponds to 'image_link' from DB, mapped in PHP
  altText: string;   // Your PHP script provides a default 'Carousel Image' for this
  linkedTo?: string; // Optional, as 'linked_to' can be NULL in your DB
}

// Define the state structure for the carousel store
interface CarouselState {
  images: CarouselImage[];
  loading: boolean;
  error: string | null;
  fetchImages: () => Promise<void>;
}

/**
 * Zustand store for managing carousel images.
 * It handles fetching active images from the PHP API,
 * and managing loading and error states.
 */
export const useCarouselStore = create<CarouselState>((set) => ({
  // Initial state values
  images: [],
  loading: true, // Set to true initially as we'll fetch data on component mount
  error: null,

  /**
   * Asynchronously fetches active carousel images from the PHP API.
   * Updates the store's 'images', 'loading', and 'error' states based on the API response.
   */
  fetchImages: async () => {
    // Set loading to true and clear any previous errors before starting the fetch
    set({ loading: true, error: null });
    try {
      // IMPORTANT: Replace this placeholder with the actual URL to your PHP API script.
      // This URL should be the one you've verified works in your browser.
      const apiUrl = 'https://localhost/api/public/api_carousel_images.php'; // <<< === REPLACE THIS === >>>

      const response = await fetch(apiUrl);

      // Check if the HTTP response itself was successful (e.g., 200 OK)
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody && errorBody.message) {
            errorMessage += ` - ${errorBody.message}`;
          }
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
        throw new Error(errorMessage);
      }

      // Parse the JSON response from your PHP script
      // It's expected to have { success: boolean; data: ApiImage[]; message: string }
      const result: { success: boolean; data: CarouselImage[]; message: string } = await response.json();

      // Check the 'success' flag returned by your PHP API
      if (!result.success) {
        throw new Error(`API call failed: ${result.message || 'Unknown API error'}`);
      }

      // Update the store with the fetched images and set loading to false
      set({ images: result.data, loading: false, error: null });

    } catch (err: any) {
      // If an error occurs, update the store's error state and set loading to false
      console.error('Error fetching active carousel images:', err);
      set({ error: err.message || 'Failed to load carousel images', loading: false });
    }
  }
}));
