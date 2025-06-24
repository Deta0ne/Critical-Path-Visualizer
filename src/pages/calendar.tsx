import { useTranslation } from 'react-i18next';

export default function CalendarPage() {
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('pages.calendar.title')}</h1>
        </div>
    );
}
