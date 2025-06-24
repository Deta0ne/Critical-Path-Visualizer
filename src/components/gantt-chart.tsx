import { CartesianGrid, XAxis, YAxis, Scatter, ScatterChart, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivityStore } from '@/store/use-activity-store';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

const chartConfig = {
    desktop: {
        label: 'Expected Time',
        color: 'hsl(var(--chart-1))',
    },
    mobile: {
        label: 'Mobile',
        color: 'hsl(var(--chart-2))',
    },
    label: {
        color: 'hsl(var(--background))',
    },
} satisfies ChartConfig;

export function GanttChart() {
    const [isExpanded, setIsExpanded] = useState(false);
    useActivityStore((state) => state.activities);
    const startDate = useActivityStore((state) => state.startDate);
    const cpmResults = useActivityStore.getState().calculateCPM();

    const chartData = useMemo(() => {
        if (!startDate || !cpmResults.length) return [];

        return cpmResults.map((activity, index) => ({
            x: activity.startDate.getTime(),
            z: activity.endDate.getTime(),
            y: index,
            name: activity.name,
            isOnCriticalPath: activity.isOnCriticalPath,
        }));
    }, [cpmResults, startDate]);

    const xDomain = useMemo(() => {
        const minDate = Math.min(...chartData.map((d) => d.x));
        const maxDate = Math.max(...chartData.map((d) => d.z));
        const padding = 24 * 60 * 60 * 1000;
        return [minDate - padding, maxDate + padding];
    }, [chartData]);

    const yDomain = useMemo(() => [0, chartData.length - 1], [chartData]);

    if (!startDate || !cpmResults.length) {
        return null;
    }

    return (
        <div className={isExpanded ? 'fixed inset-0 p-6 z-50 bg-background' : 'w-full h-full'}>
            <Card className="w-full h-full">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Gantt Chart</CardTitle>
                            <CardDescription>{startDate ? format(startDate, 'PPP') : ''}</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-[hsl(var(--chart-1))]" />
                                <span className="text-sm text-muted-foreground">Critical Path</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-[hsl(var(--chart-2))]" />
                                <span className="text-sm text-muted-foreground">Normal Activity</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="ml-2"
                            >
                                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-40px)] w-full pt-0">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <ScatterChart data={chartData} margin={{ left: -40 }}>
                            <CartesianGrid horizontal={false} />
                            <XAxis
                                type="number"
                                dataKey="x"
                                domain={xDomain}
                                tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                            />
                            <YAxis
                                type="number"
                                dataKey="y"
                                domain={yDomain}
                                tickFormatter={(value) => chartData[value]?.name || ''}
                                padding={{ top: 20, bottom: 20 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Scatter data={chartData} shape={<CustomBar />} />
                        </ScatterChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomBar = (props: any) => {
    const { cx, cy, payload, xAxis } = props;
    const barHeight = 25;

    if (!payload || !xAxis || !xAxis.scale || typeof cx !== 'number' || typeof cy !== 'number') {
        return null;
    }

    const width = xAxis.scale(payload.z) - xAxis.scale(payload.x);
    const barWidth = isNaN(width) ? 0 : Math.max(width, 0);

    const truncateText = (text: string, maxWidth: number) => {
        if (!text || maxWidth <= 0) return '';
        const charWidth = 6;
        const maxChars = Math.floor(maxWidth / charWidth);
        if (text.length > maxChars) {
            return text.slice(0, maxChars - 3) + '...';
        }
        return text;
    };

    const truncatedText = truncateText(payload.name || '', barWidth - 10);

    return (
        <g>
            <rect
                x={cx}
                y={cy - barHeight / 2}
                width={barWidth}
                height={barHeight}
                fill={payload.isOnCriticalPath ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))'}
                rx={4}
                ry={4}
            />
            {barWidth > 30 && truncatedText && (
                <text
                    x={cx + 5}
                    y={cy}
                    fill="hsl(var(--background))"
                    fontSize={12}
                    textAnchor="start"
                    dominantBaseline="middle"
                >
                    {truncatedText}
                </text>
            )}
        </g>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                    <span className="text-[0.70rem]  text-muted-foreground">Activity</span>
                    <span className="font-bold">{data.name}</span>
                </div>
                <div className="flex flex-row gap-2">
                    <span className="text-[0.70rem]  text-muted-foreground">Start Date</span>
                    <span className="font-bold">{format(new Date(data.x), 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex flex-row gap-2">
                    <span className="text-[0.70rem]  text-muted-foreground">End Date</span>
                    <span className="font-bold">{format(new Date(data.z), 'dd/MM/yyyy')}</span>
                </div>
            </div>
        </div>
    );
};
