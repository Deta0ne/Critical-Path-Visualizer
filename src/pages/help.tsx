import { useTranslation } from 'react-i18next';

export default function HelpPage() {
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('pages.help.title')}</h1>
            <div className="space-y-4">
                <section>
                    <h2 className="text-xl font-semibold mb-2">{t('pages.help.faq')}</h2>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2">{t('pages.help.contact')}</h2>
                </section>
            </div>
        </div>
    );
}
