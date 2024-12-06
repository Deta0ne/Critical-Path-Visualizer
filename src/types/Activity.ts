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
    x?: number;
    y?: number;
}
export interface Link extends d3.SimulationLinkDatum<Node> {
    source: Node;
    target: Node;
}