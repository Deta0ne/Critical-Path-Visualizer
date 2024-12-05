import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const LanguageSwitcher: FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: 'en' | 'tr') => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex gap-2">
            <Button onClick={() => changeLanguage('tr')}>TR</Button>
            <Button onClick={() => changeLanguage('en')}>EN</Button>
        </div>
    );
};

export default LanguageSwitcher;
