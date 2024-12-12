import { useTranslation } from 'react-i18next';
import { useSaveActivitiesStore } from '@/store/save-activities-store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { addBusinessDays } from '@/lib/date-utils';
import { CalendarDays } from 'lucide-react';
import { SavedActivity } from '@/types/Activity';

export default function ProjectsPage() {
    const { t } = useTranslation();
    const { savedActivities, loadSavedActivities, deleteSavedActivities } = useSaveActivitiesStore();
    const { toast } = useToast();
    const navigate = useNavigate();

    const getEstimatedEndDate = (saved: SavedActivity) => {
        const totalDuration = saved.activities.reduce((sum, activity) => {
            const expectedDuration = Math.round(
                (activity.optimistic + 4 * activity.mostLikely + activity.pessimistic) / 6,
            );
            return sum + expectedDuration;
        }, 0);

        return addBusinessDays(new Date(saved.startDate), totalDuration);
    };

    const handleLoadProject = (id: string) => {
        loadSavedActivities(id);
        toast({
            title: t('projectNotifications.loadSuccess'),
            description: t('projectNotifications.loadDescription'),
        });
        navigate('/dashboard');
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t('pages.projects.title')}</h1>
            </div>

            {savedActivities.length === 0 ? (
                <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-500">{t('pages.projects.noProjects')}</h3>
                    <p className="text-sm text-gray-400 mt-2">{t('pages.projects.noProjectsDescription')}</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {savedActivities.map((saved) => (
                        <div key={saved.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-2 text-center">{saved.name}</h3>
                                    <div className="text-sm text-gray-500 space-y-2">
                                        <p className="text-center">
                                            {saved.activities.length} {t('activity.activitie')}
                                        </p>
                                        <div className="mt-2 space-y-1.5 flex flex-col items-center">
                                            <p className="flex items-center gap-2 text-muted-foreground">
                                                <CalendarDays className="w-4 h-4" />
                                                <span>{t('common.startDate')}:</span>
                                                <span className="font-medium text-foreground">
                                                    {new Date(saved.startDate).toLocaleDateString()}
                                                </span>
                                            </p>
                                            <p className="flex items-center gap-2 text-muted-foreground">
                                                <CalendarDays className="w-4 h-4" />
                                                <span>{t('common.estimatedEndDate')}:</span>
                                                <span className="font-medium text-foreground">
                                                    {getEstimatedEndDate(saved).toLocaleDateString()}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 pt-4 border-t justify-center">
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                        onClick={() => handleLoadProject(saved.id)}
                                    >
                                        {t('common.load')}
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="destructive"
                                        onClick={() => {
                                            deleteSavedActivities(saved.id);
                                            toast({
                                                title: t('projectNotifications.deleteSuccess'),
                                                description: t('projectNotifications.deleteDescription'),
                                            });
                                        }}
                                    >
                                        {t('common.delete')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
