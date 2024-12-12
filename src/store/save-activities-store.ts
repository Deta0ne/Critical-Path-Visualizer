import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useActivityStore } from '@/store/use-activity-store';
import { SaveActivitiesStore, SavedActivity } from '@/types/Activity';

export const useSaveActivitiesStore = create<SaveActivitiesStore>()(
  persist(
    (set) => ({
      savedActivities: [],
      saveCurrentActivities: (name, activities) => {
        const startDate = useActivityStore.getState().startDate;
        set((state) => ({
          savedActivities: [
            ...state.savedActivities,
            {
              id: crypto.randomUUID(),
              name,
              activities,
              startDate: startDate || new Date(),
            },
          ],
        }));
      },
      loadSavedActivities: (id) => {
        const { setActivities, setStartDate } = useActivityStore.getState();
        set((state) => {
          const savedActivity = state.savedActivities.find((activity) => activity.id === id);
          if (savedActivity) {
            setActivities(savedActivity.activities);
            setStartDate(new Date(savedActivity.startDate));
          }
          return state;
        });
      },
      deleteSavedActivities: (id) => {
        set((state) => ({
          savedActivities: state.savedActivities.filter((activity) => activity.id !== id),
        }));
      },
    }),
    {
      name: 'saved-activities',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          if (data.state.savedActivities) {
            data.state.savedActivities = data.state.savedActivities.map((activity: SavedActivity) => ({
              ...activity,
              startDate: new Date(activity.startDate),
            }));
          }
          return data;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
); 