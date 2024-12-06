import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        // Local storage'dan tema tercihini al
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        // Sistem temasını kontrol et
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        // HTML elementinden tema bilgisini al ve senkronize et
        const root = document.documentElement;
        const isDark = root.classList.contains('dark');
        if (isDark && theme === 'light') {
            root.classList.remove('dark');
        } else if (!isDark && theme === 'dark') {
            root.classList.add('dark');
        }

        // Tema değişikliklerini local storage'a kaydet
        localStorage.setItem('theme', theme);

        // Sistem tema değişikliklerini dinle
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return {
        theme,
        toggleTheme,
        isDark: theme === 'dark'
    };
}
