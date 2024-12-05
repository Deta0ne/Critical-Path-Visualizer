import { useTranslation } from 'react-i18next';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('pages.settings.title')}</h1>
            <p className="text-muted-foreground mb-6">{t('pages.settings.description')}</p>
            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-2">{t('pages.settings.appearance')}</h2>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <LanguageSwitcher />
                    </div>
                </section>
                <Separator />
                <section>
                    <h2 className="text-xl font-semibold mb-2">{t('pages.settings.preferences')}</h2>
                </section>
            </div>
        </div>
    );
}
