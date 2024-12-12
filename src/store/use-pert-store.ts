import { create } from 'zustand';
import { PertStore, PertCalculation, Activity, CPMActivity } from '@/types/Activity';
import { calculateZScore } from '@/lib/z-score';

export const usePertStore = create<PertStore>((set, get) => ({
    calculations: null,

    calculatePertMetrics: (activities: Activity[], cpmResults: CPMActivity[]) => {
        // Compare with previous calculations
        const prevCalc = get().calculations;
        if (prevCalc && 
            prevCalc.projectDuration === Math.max(...cpmResults.map((a) => a.EF)) &&
            prevCalc.criticalPath.length === cpmResults.filter(a => a.isOnCriticalPath).length) {
            return; // Do not calculate if there is no change
        }

        if (activities.length === 0 || cpmResults.length === 0) {
            set({ calculations: null });
            return;
        }

        // Critical path calculation
        const criticalPath = cpmResults.filter((activity) => activity.isOnCriticalPath);
        
        // Project duration calculation
        const projectDuration = Math.max(...cpmResults.map((a) => a.EF));

        // Total variance calculation (for critical path only)
        const totalVariance = criticalPath.reduce((sum, activity) => {
            const variance = Math.pow(activity.pessimistic - activity.optimistic, 2) / 36;
            return sum + variance;
        }, 0);

        // Standard deviation calculation
        const standardDeviation = Math.sqrt(totalVariance);

        // Probability times calculation
        const probabilityLevels = [80, 90, 95];
        const probabilityDurations = probabilityLevels.map((prob) => ({
            probability: prob,
            duration: (projectDuration + calculateZScore(prob) * standardDeviation).toFixed(1),
        }));

        const calculations: PertCalculation = {
            criticalPath,
            projectDuration,
            totalVariance,
            standardDeviation,
            probabilityDurations,
        };

        set({ calculations });
    },
})); 