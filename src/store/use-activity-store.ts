import { create } from 'zustand';
import { z } from 'zod';
import { Activity, ActivityStore,CPMActivity } from '@/types/Activity';



export const activitySchema = z.object({
    id: z.number(),
    name: z.string().min(1, 'Activity name is required'),
    optimistic: z.number().min(0, 'Must be positive'),
    mostLikely: z.number().min(0, 'Must be positive'),
    pessimistic: z.number().min(0, 'Must be positive'),
    dependencies: z.array(z.string()).default([]),
}).refine((data) => {
    return data.optimistic <= data.mostLikely && data.mostLikely <= data.pessimistic;
}, {
    message: "Times must be in order: optimistic <= most likely <= pessimistic",
    path: ["times"]
});

export const useActivityStore = create<ActivityStore>((set, get) => ({
    activities: [],
    startDate: undefined,
    setStartDate: (date) => set({ startDate: date }),
    
    addActivity: () => {
        const activities = get().activities;
        const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
        
        const newActivity: Activity = {
            id: newId,
            name: '',
            optimistic: 0,
            mostLikely: 0,
            pessimistic: 0,
            dependencies: [],
        };
        
        set({ activities: [...activities, newActivity] });
    },
    
    updateActivity: (id: number, data: Partial<Activity>) => {
        set((state) => ({
            activities: state.activities.map((activity) =>
                activity.id === id ? { ...activity, ...data } : activity
            ),
        }));
    },
    
    deleteActivity: (id: number) => {
        set((state) => ({
            activities: state.activities.filter((activity) => activity.id !== id),
        }));
    },

    validateActivity: (activity: Activity) => {
        return activitySchema.safeParse(activity);
    },

    calculateCPM: () => {
        const startDate = get().startDate;
        if (!startDate) return [];
        const activities = get().activities as Activity[];
        const cpmActivities: CPMActivity[] = activities.map(activity => ({
            ...activity,
            ES: 0,
            EF: 0,
            LS: 0,
            LF: 0,
            startDate: new Date(startDate),
            endDate: new Date(startDate),
            slack: 0,
            isOnCriticalPath: false
        }));

        // Helper function to calculate duration
        const getDuration = (activity: CPMActivity) => {
            return Math.round((activity.optimistic + 4 * activity.mostLikely + activity.pessimistic) / 6);
        };

        // Helper function to add days to a date
        const addDays = (date: Date, days: number) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };

        // Forward Pass
        for (let i = 0; i < cpmActivities.length; i++) {
            const activity = cpmActivities[i];
            if (activity.dependencies.length === 0) {
                activity.ES = 0;
                activity.startDate = new Date(startDate);
            } else {
                // Her bağımlılık için ES değerlerini kontrol et
                const dependencyEFs = activity.dependencies
                    .map(depName => {
                        // Virgülle ayrılmış bağımlılıkları işle
                        const deps = depName.split(',').map(d => d.trim());
                        // Her bir bağımlılık için EF değerlerini bul
                        return deps.map(dep => {
                            const depActivity = cpmActivities.find(a => a.name === dep);
                            return depActivity ? depActivity.EF : 0;
                        });
                    })
                    .flat(); // Tüm EF değerlerini düz bir diziye çevir

                // En büyük EF değerini al
                activity.ES = Math.max(...dependencyEFs);
                activity.startDate = addDays(startDate, activity.ES);
            }
            
            const duration = getDuration(activity);
            activity.EF = activity.ES + duration;
            activity.endDate = addDays(activity.startDate, duration);
        }

        // Find project duration
        const projectDuration = Math.max(...cpmActivities.map(a => a.EF));

        // Backward Pass
        for (let i = cpmActivities.length - 1; i >= 0; i--) {
            const activity = cpmActivities[i];
            const dependents = cpmActivities.filter(a => a.dependencies.includes(activity.name));

            if (dependents.length === 0) {
                activity.LF = projectDuration;
            } else {
                activity.LF = Math.min(...dependents.map(dep => dep.LS));
            }
            
            const duration = getDuration(activity);
            activity.LS = activity.LF - duration;
            activity.slack = activity.LS - activity.ES;
            activity.isOnCriticalPath = activity.slack === 0;
        }

        return cpmActivities;
    },
})); 
