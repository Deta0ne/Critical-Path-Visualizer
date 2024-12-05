import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const LanguageSwitcher: FC = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const changeLanguage = (lng: 'en' | 'tr') => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex gap-2">
            <Button variant={currentLanguage === 'tr' ? 'default' : 'outline'} onClick={() => changeLanguage('tr')}>
                TR
            </Button>
            <Button variant={currentLanguage === 'en' ? 'default' : 'outline'} onClick={() => changeLanguage('en')}>
                EN
            </Button>
        </div>
    );
};

export default LanguageSwitcher;
