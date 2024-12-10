import { create } from 'zustand';
import { z } from 'zod';
import { Activity, ActivityStore,CPMActivity, NormalizedExcelRow } from '@/types/Activity';
import * as XLSX from 'xlsx';
import { toast } from '@/hooks/use-toast';

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

export const excelActivitySchema = z.object({
    name: z.string().min(1, 'Activity name is required'),
    optimistic: z.number().min(0, 'Must be positive'),
    mostLikely: z.number().min(0, 'Must be positive'),
    pessimistic: z.number().min(0, 'Must be positive'),
    dependencies: z.string().optional(),
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

        const getDuration = (activity: CPMActivity) => {
            return Math.round((activity.optimistic + 4 * activity.mostLikely + activity.pessimistic) / 6);
        };

        const addDays = (date: Date, days: number) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };

        for (let i = 0; i < cpmActivities.length; i++) {
            const activity = cpmActivities[i];
            if (activity.dependencies.length === 0) {
                activity.ES = 0;
                activity.startDate = new Date(startDate);
            } else {
                const dependencyEFs = activity.dependencies
                    .map(depName => {
                        const deps = depName.split(',').map(d => d.trim());
                        return deps.map(dep => {
                            const depActivity = cpmActivities.find(a => a.name === dep);
                            return depActivity ? depActivity.EF : 0;
                        });
                    })
                    .flat();

                activity.ES = Math.max(...dependencyEFs);
                activity.startDate = addDays(startDate, activity.ES);
            }
            
            const duration = getDuration(activity);
            activity.EF = activity.ES + duration;
            activity.endDate = addDays(activity.startDate, duration);
        }

        const projectDuration = Math.max(...cpmActivities.map(a => a.EF));

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

    handleFileUpload: (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target?.result) return;

            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rawJsonData = XLSX.utils.sheet_to_json(worksheet);

            const normalizeFieldName = (key: string): string => 
                key.toLowerCase().replace(/[\s_-]/g, '');

            const fieldMappings = {
                name: ['name', 'activityname', 'activity', 'taskname', 'task'],
                optimistic: ['optimistic', 'optimistictime', 'opttime', 'mintime'],
                mostLikely: ['mostlikely', 'likely', 'normaltime', 'expectedtime'],
                pessimistic: ['pessimistic', 'pessimistictime', 'maxtime'],
                dependencies: ['dependencies', 'dependson', 'prerequisite', 'depends']
            };

            const jsonData = (rawJsonData as unknown[]).map((row) => {
                if (typeof row !== 'object' || row === null) {
                    return {};
                }

                const normalizedRow: NormalizedExcelRow = {};
                const rowData = row as Record<string, unknown>;
                
                Object.entries(rowData).forEach(([key, value]) => {
                    const normalizedKey = normalizeFieldName(key);
                    
                    for (const [fieldName, alternatives] of Object.entries(fieldMappings)) {
                        if (alternatives.includes(normalizedKey)) {
                            switch(fieldName) {
                                case 'name':
                                case 'dependencies':
                                    normalizedRow[fieldName] = String(value);
                                    break;
                                case 'optimistic':
                                case 'mostLikely':
                                case 'pessimistic':
                                    normalizedRow[fieldName] = Number(value);
                                    break;
                            }
                            break;
                        }
                    }
                });

                return normalizedRow;
            });

            const currentActivities = get().activities;
            let nextId = currentActivities.length > 0 
                ? Math.max(...currentActivities.map(a => a.id)) + 1 
                : 1;

            const newActivities = [...currentActivities];

            jsonData.forEach((row: unknown) => {
                const result = excelActivitySchema.safeParse(row);
                
                if (result.success) {
                    const validatedData = result.data;
                    const newName = validatedData.name;
                    const isDuplicate = currentActivities.some(activity => activity.name === newName);

                    if (!isDuplicate) {
                        const newActivity: Activity = {
                            id: nextId++,
                            name: newName,
                            optimistic: validatedData.optimistic,
                            mostLikely: validatedData.mostLikely,
                            pessimistic: validatedData.pessimistic,
                            dependencies: validatedData.dependencies ? validatedData.dependencies.split(',').map(d => d.trim()) : [],
                        };
                        
                        newActivities.push(newActivity);
                    }
                } else {
                    console.error('Invalid row data:', result.error);
                    toast({
                        title: 'Error',
                        description: `Invalid data in Excel: ${result.error.message}`,
                        variant: 'destructive'
                    });
                }
            });

            set({ activities: newActivities });

            toast({
                title: 'Data imported successfully',
            });
        };
        reader.readAsArrayBuffer(file);
    },
})); 
