import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import i18n from './i18n/i18n.ts';
import App from './App.tsx';
import { ThemeProvider } from '@/components/theme-provider';

createRoot(document.getElementById('root')!).render(
    <I18nextProvider i18n={i18n}>
        <BrowserRouter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <StrictMode>
                    <App />
                </StrictMode>
            </ThemeProvider>
        </BrowserRouter>
    </I18nextProvider>,
);
