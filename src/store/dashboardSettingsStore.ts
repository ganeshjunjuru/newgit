// stores/dashboardSettingsStore.ts
import { create } from 'zustand';
import axios from 'axios';

type Setting = {
  key: string;
  value: string;
  type: string;
};

type SettingsGroup = {
  [group: string]: Setting[];
};

type DashboardSettingsStore = {
  settings: SettingsGroup;
  loading: boolean;
  error: string;
  fetchSettings: () => Promise<void>;
};

export const useDashboardSettingsStore = create<DashboardSettingsStore>((set) => ({
  settings: {},
  loading: false,
  error: '',

  fetchSettings: async () => {
    set({ loading: true, error: '' });
    try {
      const res = await axios.get('https://localhost/api/fetch_settings.php');
      if (res.data.status === 'success') {
        set({ settings: res.data.settings });
      } else {
        set({ error: 'Failed to load settings' });
      }
    } catch (e) {
      set({ error: 'Server error' });
      console.error(e);
    } finally {
      set({ loading: false });
    }
  }
}));
