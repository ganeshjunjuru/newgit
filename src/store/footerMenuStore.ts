// src/store/footerMenuStore.ts
import { create } from 'zustand';

// Define the structure for a single footer menu item
interface FooterMenuItem {
  id: number;
  menu_id: number;
  item_text: string;
  item_url: string;
  order_index: number; // Changed from display_order to order_index to match your DB
  is_active: boolean;
  icon_class: string | null;
  target_blank: boolean;
  // No 'children' property as your footer_menu_items table doesn't have parent_id
}

// Define the structure for a complete footer menu section (e.g., 'Courses Offered')
interface FooterMenu {
  id: number;
  menu_name: string; // From 'name AS menu_name' in API
  order_index: number; // From 'order_index' in API
  items: FooterMenuItem[]; // Array of items belonging to this menu
}

// Define the state structure for the footer menu store
interface FooterMenuState {
  menus: FooterMenu[];
  isLoading: boolean;
  error: string | null;
  fetchMenus: () => Promise<void>;
}

// Create the Zustand store
export const useFooterMenuStore = create<FooterMenuState>((set) => ({
  menus: [],
  isLoading: false,
  error: null,

  fetchMenus: async () => {
    set({ isLoading: true, error: null });
    try {
      // Adjust the API endpoint URL if different (e.g., your_domain.com/api/get_footer_navigation.php)
      const response = await fetch('https://localhost/api/public/get_footer_navigation.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.success) {
        set({ menus: data.data, isLoading: false });
      } else {
        set({ error: data.message || 'Failed to fetch footer menus.', isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch footer menus:", error);
      set({ error: (error as Error).message || 'An unknown error occurred.', isLoading: false });
    }
  },
}));