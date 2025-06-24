import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/data-table';
import { NetworkView } from '@/components/network-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GanttChart } from '@/components/gantt-chart';
import PertPanel from '@/components/pert-panel';

export default function DashboardPage() {
    const { t } = useTranslation();

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">{t('pages.dashboard.title')}</h1>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                <div className="h-[510px]">
                    <DataTable />
                </div>
                <div className="h-[510px]">
                    <Tabs defaultValue="gantt" className="h-full">
                        <TabsList>
                            <TabsTrigger value="network">{t('analysis.networkDiagram')}</TabsTrigger>
                            <TabsTrigger value="gantt">{t('analysis.ganttChart')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="gantt" className="h-[calc(100%-47px)]">
                            <GanttChart />
                        </TabsContent>
                        <TabsContent value="network" className="h-[calc(100%-47px)]">
                            <NetworkView />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="h-auto">
                <PertPanel />
            </div>
        </div>
    );
}
