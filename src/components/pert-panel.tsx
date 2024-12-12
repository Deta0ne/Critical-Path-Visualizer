import { useActivityStore } from '@/store/use-activity-store';
import { usePertStore } from '@/store/use-pert-store';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, ChartBarIcon, GanttChartSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const PertPanel = () => {
    const { t } = useTranslation();
    const activities = useActivityStore((state) => state.activities);
    const startDate = useActivityStore((state) => state.startDate);
    const calculatePertMetrics = usePertStore((state) => state.calculatePertMetrics);
    const calculations = usePertStore((state) => state.calculations);

    useEffect(() => {
        if (startDate && activities.length > 0) {
            const cpmResults = useActivityStore.getState().calculateCPM();
            calculatePertMetrics(activities, cpmResults);
        }
    }, [activities, startDate, calculatePertMetrics]);

    if (!startDate || activities.length === 0) {
        return (
            <div className="p-4 text-center">
                {!startDate ? t('analysis.setStartDate') : t('analysis.addActivities')}
            </div>
        );
    }

    if (!calculations) return null;

    return (
        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
                className={cn(
                    'transition-all duration-300',
                    'hover:shadow-[0_4px_12px_0_hsl(var(--chart-3))]',
                    'animate-in fade-in duration-700',
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[hsl(var(--chart-3))]">
                        {t('analysis.criticalPath')}
                    </CardTitle>
                    <Activity className="h-4 w-4 text-[hsl(var(--chart-2))]" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {calculations.criticalPath.map((activity) => (
                            <div key={activity.id} className="flex justify-between items-center">
                                <span>{activity.name}</span>
                                <span className="font-semibold text-primary">
                                    {Math.round(
                                        (activity.optimistic + 4 * activity.mostLikely + activity.pessimistic) / 6,
                                    )}{' '}
                                    {t('analysis.days')}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card
                className={cn(
                    'transition-all duration-300',
                    'hover:shadow-[0_4px_12px_0_hsl(var(--chart-3))]',
                    'animate-in fade-in duration-700',
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[hsl(var(--chart-3))]">
                        {t('analysis.projectStatistics')}
                    </CardTitle>
                    <ChartBarIcon className="h-4 w-4 text-[hsl(var(--chart-2))]" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>{t('analysis.expectedDuration')}:</span>
                            <span className="font-semibold text-primary">
                                {calculations.projectDuration} {t('analysis.days')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('analysis.durationRange')}:</span>
                            <span className="font-semibold text-primary">
                                {Math.min(...calculations.criticalPath.map((a) => a.optimistic))} -{' '}
                                {Math.max(...calculations.criticalPath.map((a) => a.pessimistic))} {t('analysis.days')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('analysis.totalVariance')}:</span>
                            <span className="font-semibold text-primary">{calculations.totalVariance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('analysis.standardDeviation')}:</span>
                            <span className="font-semibold text-primary">
                                {calculations.standardDeviation.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('analysis.confidenceInterval')}:</span>
                            <span className="font-semibold text-primary">
                                ±{(calculations.standardDeviation * 1.96).toFixed(1)} {t('analysis.days')}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card
                className={cn(
                    'transition-all duration-300',
                    'hover:shadow-[0_4px_12px_0_hsl(var(--chart-3))]',
                    'animate-in fade-in duration-700',
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[hsl(var(--chart-3))]">
                        {t('analysis.completionProbability')}
                    </CardTitle>
                    <GanttChartSquare className="h-4 w-4 text-[hsl(var(--chart-2))]" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {calculations.probabilityDurations.map(({ probability, duration }) => (
                            <div key={probability} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-primary">
                                        {duration} {t('analysis.days')}
                                    </span>
                                    <span className="font-semibold text-primary">{probability}%</span>
                                </div>
                                <Progress
                                    value={probability}
                                    className={cn(
                                        'h-2',
                                        'transition-all duration-500',
                                        'animate-in fade-in-50',
                                        '[&>div]:bg-[hsl(var(--chart-1))]',
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PertPanel;
