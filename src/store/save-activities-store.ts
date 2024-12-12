import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useActivityStore } from '@/store/use-activity-store';
import { SaveActivitiesStore } from '@/types/Activity';



export const useSaveActivitiesStore = create<SaveActivitiesStore>()(
  persist(
    (set) => ({
      savedActivities: [],
      saveCurrentActivities: (name, activities) => {
        set((state) => ({
          savedActivities: [
            ...state.savedActivities,
            {
              id: crypto.randomUUID(),
              name,
              activities,
            },
          ],
        }));
      },
      loadSavedActivities: (id) => {
        const { setActivities } = useActivityStore.getState();
        set((state) => {
          const savedActivity = state.savedActivities.find((activity) => activity.id === id);
          if (savedActivity) {
            setActivities(savedActivity.activities);
            console.log(savedActivity.activities);
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
    }
  )
); 