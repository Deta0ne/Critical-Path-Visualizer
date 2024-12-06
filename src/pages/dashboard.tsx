import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/data-table';
import { NetworkView } from '@/components/network-view';
import { useActivityStore } from '@/store/use-activity-store';

export default function DashboardPage() {
    const { t } = useTranslation();
    const activities = useActivityStore((state) => state.activities);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('pages.dashboard.title')}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataTable />
                <NetworkView activities={activities} />
            </div>
        </div>
    );
}
