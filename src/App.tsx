import './App.css';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { SidebarInset } from './components/ui/sidebar';
import { Separator } from './components/ui/separator';
import { AppSidebar } from './components/app-sidebar';
import { routes } from './config/routes';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ModeToggle } from './components/mode-toggle';

function App() {
    const { t } = useTranslation();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1>{t('common.title')}</h1>
                    <div className="flex-1 flex justify-end gap-2">
                        <LanguageSwitcher />
                        <ModeToggle />
                    </div>
                </header>
                <main className="flex-1">
                    <Routes>
                        {routes.map(({ path, element: Element }) => (
                            <Route key={path} path={path} element={<Element />} />
                        ))}
                    </Routes>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default App;
