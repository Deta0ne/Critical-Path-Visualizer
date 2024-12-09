import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/data-table';
import { NetworkView } from '@/components/network-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GanttChart } from '@/components/gantt-chart';

export default function DashboardPage() {
    const { t } = useTranslation();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('pages.dashboard.title')}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataTable />
                <Tabs defaultValue="network" className="w-full">
                    <TabsList>
                        <TabsTrigger value="network">{t('analysis.networkDiagram')}</TabsTrigger>
                        <TabsTrigger value="gantt">{t('analysis.ganttChart')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="network">
                        <NetworkView />
                    </TabsContent>
                    <TabsContent value="gantt">
                        <GanttChart />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
