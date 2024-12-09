import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useActivityStore } from '@/store/use-activity-store';
import { Node } from '@/types/Activity';

const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];
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

const expectedDuration = (activity: Node) => {
    return ((activity.optimistic + 4 * activity.mostLikely + activity.pessimistic) / 6).toFixed(3);
};
export function GanttChart() {
    const activities = useActivityStore((state) => state.activities as Node[]);
    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-2">
                <CardTitle>Gantt Chart</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart
                        accessibilityLayer
                        data={
                            activities.map((activity) => ({
                                month: activity.name,
                                desktop: expectedDuration(activity),
                            })) || chartData
                        }
                        layout="vertical"
                        margin={{
                            left: -50,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} />
                        <XAxis dataKey="desktop" type="number" domain={[0, 'auto']} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="desktop" layout="vertical" fill="var(--color-desktop)" radius={4} barSize={30}>
                            <LabelList
                                dataKey="month"
                                position="insideLeft"
                                offset={8}
                                className="fill-[--color-label]"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="desktop"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
