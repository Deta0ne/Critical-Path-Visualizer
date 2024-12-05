import './App.css';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

function App() {
    const { t } = useTranslation();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{t('common.title')}</h1>
            <div className="flex gap-4 items-center">
                <Button>{t('common.add')}</Button>
                <ModeToggle />
                <LanguageSwitcher />
            </div>
        </div>
    );
}

export default App;
