import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/data-table';

export default function DashboardPage() {
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('pages.dashboard.title')}</h1>
            <DataTable />
        </div>
    );
}