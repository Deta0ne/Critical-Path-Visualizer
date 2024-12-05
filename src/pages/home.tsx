import { useTranslation } from 'react-i18next';

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('pages.home.title')}</h1>
            <p>{t('pages.home.description')}</p>
        </div>
    );
}
