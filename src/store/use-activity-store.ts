import { create } from 'zustand';
import { z } from 'zod';

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

export type Activity = {
    id: number;
    name: string;
    optimistic: number;
    mostLikely: number;
    pessimistic: number;
    dependencies: string[];
};

interface ActivityState {
    activities: Activity[];
    addActivity: () => void;
    updateActivity: (id: number, data: Partial<Activity>) => void;
    deleteActivity: (id: number) => void;
    validateActivity: (activity: Activity) => z.SafeParseReturnType<Activity, Activity>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
    activities: [],
    
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
})); 