import { z } from 'zod';
export type Activity = {
    id: number;
    name: string;
    optimistic: number;
    mostLikely: number;
    pessimistic: number;
    dependencies: string[];
};

export interface ActivityState {
    activities: Activity[];
    addActivity: () => void;
    updateActivity: (id: number, data: Partial<Activity>) => void;
    deleteActivity: (id: number) => void;
    validateActivity: (activity: Activity) => z.SafeParseReturnType<Activity, Activity>;
}

export interface Node extends d3.SimulationNodeDatum {
    id: number;
    name: string;
    optimistic: number;
    mostLikely: number;
    pessimistic: number;
    dependencies: string[];
}
export interface Link extends d3.SimulationLinkDatum<Node> {
    source: Node;
    target: Node;
}

export interface ActivityStore {
    activities: Activity[];
    startDate: Date | undefined;
    setStartDate: (date: Date | undefined) => void;
    addActivity: () => void;
    updateActivity: (id: number, data: Partial<Activity>) => void;
    deleteActivity: (id: number) => void;
    validateActivity: (activity: Activity) => z.SafeParseReturnType<Activity, Activity>;
    calculateCPM: () => CPMActivity[];
    handleFileUpload: (file: File) => void;
    setActivities: (activities: Activity[]) => void;
}
export interface CPMActivity {
    ES: number; 
    EF: number;  
    LS: number; 
    LF: number;  
    startDate: Date;  
    endDate: Date;    
    slack: number;
    isOnCriticalPath: boolean;
    dependencies: string[];
    name: string;
    optimistic: number;
    mostLikely: number;
    pessimistic: number;
    id: number;
}

export interface NormalizedExcelRow {
    name?: string;
    optimistic?: number;
    mostLikely?: number;
    pessimistic?: number;
    dependencies?: string;
}

export interface SavedActivity {
    id: string;
    name: string;
    activities: Activity[]; 
  }

export interface SaveActivitiesStore {
  savedActivities: SavedActivity[];
  saveCurrentActivities: (name: string, activities: Activity[]) => void;
  loadSavedActivities: (id: string) => void;
  deleteSavedActivities: (id: string) => void;
}