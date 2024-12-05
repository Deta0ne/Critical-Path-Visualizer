import './App.css';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { SidebarInset } from './components/ui/sidebar';
import { Separator } from './components/ui/separator';
import { AppSidebar } from './components/app-sidebar';
import { useCounterStore } from './store/store';

function App() {
    const { t } = useTranslation();
    const count = useCounterStore((state) => state.count);
    const increment = useCounterStore((state) => state.increment);
    const decrement = useCounterStore((state) => state.decrement);
    const incrementAsync = useCounterStore((state) => state.incrementAsync);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1>{t('common.title')}</h1>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div>
                        <div className="flex gap-4 items-center">
                            <Button>{t('common.add')}</Button>
                            <ModeToggle />
                            <LanguageSwitcher />
                            <p>{count}</p>
                            <Button onClick={() => increment()}>Increment</Button>
                            <Button onClick={() => decrement()}>Decrement</Button>
                            <Button onClick={() => incrementAsync()}>Increment Async</Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default App;
