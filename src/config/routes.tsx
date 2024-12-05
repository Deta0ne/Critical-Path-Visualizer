import { Home, LayoutDashboard, ChartNoAxesColumn, Calendar, CircleHelp, Settings } from 'lucide-react';
import HomePage from '@/pages/home';
import DashboardPage from '@/pages/dashboard';
import ProjectsPage from '@/pages/projects';
import CalendarPage from '@/pages/calendar';
import HelpPage from '@/pages/help';
import SettingsPage from '@/pages/settings';
export const routes = [
    {
        path: '/',
        title: 'pages.home.title',
        icon: Home,
        element: HomePage,
    },
    {
        path: '/dashboard',
        title: 'pages.dashboard.title',
        icon: LayoutDashboard,
        element: DashboardPage,
    },
    {
        path: '/projects',
        title: 'pages.projects.title',
        icon: ChartNoAxesColumn,
        element: ProjectsPage,
    },
    {
        path: '/calendar',
        title: 'pages.calendar.title',
        icon: Calendar,
        element: CalendarPage,
    },
    {
        path: '/help',
        title: 'pages.help.title',
        icon: CircleHelp,
        element: HelpPage,
    },
    {
        path: '/settings',
        title: 'pages.settings.title',
        icon: Settings,
        element: SettingsPage,
    },
] as const;
