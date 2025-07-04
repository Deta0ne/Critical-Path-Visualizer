import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useActivityStore } from '@/store/use-activity-store';
import { SaveActivitiesStore, SavedActivity } from '@/types/Activity';
import { toast } from '@/hooks/use-toast';
import i18next from 'i18next';

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
        toast({
          title: i18next.t('projectNotifications.saveSuccess'),
          description: i18next.t('projectNotifications.saveDescription', { name }),
        });
      },

      loadSavedActivities: (id) => {
        const { setActivities, setStartDate } = useActivityStore.getState();
        set((state) => {
          const savedActivity = state.savedActivities.find((activity) => activity.id === id);
          if (savedActivity) {
            setActivities(savedActivity.activities);
            setStartDate(new Date(savedActivity.startDate));
            toast({
              title: i18next.t('projectNotifications.loadSuccess'),
              description: i18next.t('projectNotifications.loadDescription'),
            });
          }
          return state;
        });
      },

      deleteSavedActivities: (id) => {
        set((state) => ({
          savedActivities: state.savedActivities.filter((activity) => activity.id !== id),
        }));
        toast({
          title: i18next.t('projectNotifications.deleteSuccess'),
          description: i18next.t('projectNotifications.deleteDescription'),
        });
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