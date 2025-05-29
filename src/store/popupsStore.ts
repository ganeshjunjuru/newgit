// popupsStore.ts
import { create } from 'zustand';

export interface PopupItem {
  id: number;
  type: 'text' | 'image' | 'video';
  image_url: string | null;
  video_url: string | null;
  title_text: string | null;
  content_text: string | null;
  button_link: string | null;
  display_rules: string | null;
  status: 'active' | 'inactive' | 'deleted';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
}

interface FetchPopupsParams {
  id?: number;
  status?: 'active' | 'inactive' | 'deleted' | 'all';
}

interface PopupsState {
  popups: PopupItem[];
  loading: boolean;
  error: string | null;
  currentPopup: PopupItem | null;
  fetchPopups: (params?: FetchPopupsParams) => Promise<void>;
  addPopup: (newPopupData: Omit<PopupItem, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'status'> & { status?: 'active' | 'inactive' | 'deleted' }) => Promise<PopupItem | null>;
  updatePopup: (id: number, updatedData: Partial<Omit<PopupItem, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>>) => Promise<boolean>;
  deletePopup: (id: number) => Promise<boolean>;
}

const POPUPS_API_URL = 'http://localhost/api/public/api_popups.php'; // <<<=== UPDATE THIS ===>>>

export const usePopupsStore = create<PopupsState>((set, get) => ({
  popups: [],
  loading: false,
  error: null,
  currentPopup: null,

  fetchPopups: async (params?: FetchPopupsParams) => {
    set({ loading: true, error: null });
    try {
      let url = new URL(POPUPS_API_URL);
      if (params) {
        if (params.id) url.searchParams.append('id', params.id.toString());
        if (params.status) url.searchParams.append('status', params.status);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch popups from API.');
      }

      set({
        popups: result.data || [],
        loading: false,
        error: null,
        currentPopup: params?.id ? result.data[0] || null : null
      });
    } catch (err: any) {
      console.error('Error fetching popups:', err);
      set({ error: err.message || 'Failed to load popups.', loading: false });
    }
  },

  addPopup: async (newPopupData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(POPUPS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: newPopupData.type,
            image_url: newPopupData.image_url,
            video_url: newPopupData.video_url,
            title_text: newPopupData.title_text,
            content_text: newPopupData.content_text,
            button_link: newPopupData.button_link,
            display_rules: newPopupData.display_rules,
            status: newPopupData.status || 'inactive',
            start_date: newPopupData.start_date,
            end_date: newPopupData.end_date
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to add popup.');
      }

      const addedPopup: PopupItem = {
          ...newPopupData as PopupItem,
          id: result.data.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'System User',
          updated_by: 'System User',
          status: newPopupData.status || 'inactive'
      };

      set((state) => ({
          popups: [...state.popups, addedPopup],
          loading: false,
          error: null,
      }));
      return addedPopup;
    } catch (err: any) {
      console.error('Error adding popup:', err);
      set({ error: err.message || 'Failed to add popup.', loading: false });
      return null;
    }
  },

  updatePopup: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(POPUPS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
            type: updatedData.type,
            image_url: updatedData.image_url,
            video_url: updatedData.video_url,
            title_text: updatedData.title_text,
            content_text: updatedData.content_text,
            button_link: updatedData.button_link,
            display_rules: updatedData.display_rules,
            status: updatedData.status,
            start_date: updatedData.start_date,
            end_date: updatedData.end_date
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update popup.');
      }

      set((state) => ({
        popups: state.popups.map((popup) =>
          popup.id === id ? { ...popup, ...updatedData, updated_at: new Date().toISOString(), updated_by: 'System User' } : popup
        ),
        loading: false,
        error: null,
      }));
      return true;
    } catch (err: any) {
      console.error('Error updating popup:', err);
      set({ error: err.message || 'Failed to update popup.', loading: false });
      return false;
    }
  },

  deletePopup: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(POPUPS_API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete popup.');
      }

      set((state) => ({
        popups: state.popups.map((popup) =>
          popup.id === id ? { ...popup, status: 'deleted', updated_at: new Date().toISOString(), updated_by: 'System User' } : popup
        ),
        loading: false,
        error: null,
      }));
      return true;
    } catch (err: any) {
      console.error('Error deleting popup:', err);
      set({ error: err.message || 'Failed to delete popup.', loading: false });
      return false;
    }
  },
}));