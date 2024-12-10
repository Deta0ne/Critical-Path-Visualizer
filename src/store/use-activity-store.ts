import { create } from 'zustand';
import { z } from 'zod';
import { Activity, ActivityStore } from '@/types/Activity';

export interface CPMActivity {
    ES: number;  // Early Start
    EF: number;  // Early Finish
    LS: number;  // Late Start
    LF: number;  // Late Finish
    slack: number;
    isOnCriticalPath: boolean;
    dependencies: string[];
    name: string;
    optimistic: number;
    mostLikely: number;
    pessimistic: number;
    id: number;

}

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
        const activities = get().activities;
        const cpmActivities: CPMActivity[] = activities.map(activity => ({
            ...activity,
            ES: 0,
            EF: 0,
            LS: 0,
            LF: 0,
            slack: 0,
            isOnCriticalPath: false
        }));

        // Helper function to calculate duration
        const getDuration = (activity: CPMActivity) => {
            return (activity.optimistic + 4 * activity.mostLikely + activity.pessimistic) / 6;
        };

        // Forward Pass
        for (let i = 0; i < cpmActivities.length; i++) {
            const activity = cpmActivities[i];
            if (activity.dependencies.length === 0) {
                activity.ES = 0;
            } else {
                activity.ES = Math.max(...activity.dependencies.map(depName => {
                    const dep = cpmActivities.find(a => a.name === depName);
                    return dep ? dep.EF : 0;
                }));
            }
            activity.EF = activity.ES + getDuration(activity);
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
            
            activity.LS = activity.LF - getDuration(activity);
            activity.slack = activity.LS - activity.ES;
            activity.isOnCriticalPath = activity.slack === 0;
        }

        return cpmActivities;
    },
})); 
