import { Activity } from '@/types/Activity';

export const sortActivitiesByDependencies = (activities: Activity[]): Activity[] => {
    // Create a map of activity name to activity object for quick lookup
    const nameToActivity = new Map<string, Activity>();
    activities.forEach(activity => {
        nameToActivity.set(activity.name, activity);
    });

    // Create adjacency list representation of the dependency graph
    const graph = new Map<string, Set<string>>();
    const inDegree = new Map<string, number>();

    // Initialize graph and in-degree count
    activities.forEach(activity => {
        graph.set(activity.name, new Set<string>());
        inDegree.set(activity.name, 0);
    });

    // Build the graph and count in-degrees
    activities.forEach(activity => {
        activity.dependencies.forEach(dep => {
            if (nameToActivity.has(dep)) {
                graph.get(activity.name)?.add(dep);
                inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
            }
        });
    });

    // Queue for activities with no dependencies (in-degree = 0)
    const queue: string[] = [];
    activities.forEach(activity => {
        if ((inDegree.get(activity.name) || 0) === 0) {
            queue.push(activity.name);
        }
    });

    // Result array to store the sorted activities
    const sortedNames: string[] = [];

    // Process the queue (Kahn's algorithm)
    while (queue.length > 0) {
        const activityName = queue.shift()!;
        sortedNames.push(activityName);

        const dependencies = graph.get(activityName) || new Set<string>();
        dependencies.forEach(dep => {
            inDegree.set(dep, (inDegree.get(dep) || 0) - 1);
            if (inDegree.get(dep) === 0) {
                queue.push(dep);
            }
        });
    }

    // Check for cycles
    if (sortedNames.length !== activities.length) {
        console.warn('Circular dependencies detected in activities');
        // Return original array if there are cycles
        return activities;
    }

    // Map the sorted names back to Activity objects
    return sortedNames
        .map(name => nameToActivity.get(name))
        .filter((activity): activity is Activity => activity !== undefined)
        .reverse();
}; 