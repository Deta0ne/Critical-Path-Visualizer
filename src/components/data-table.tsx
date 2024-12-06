import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useActivityStore } from '@/store/use-activity-store';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '@/types/Activity';

export function DataTable() {
    const { activities, updateActivity, addActivity, deleteActivity } = useActivityStore();
    const { t } = useTranslation();
    const { toast } = useToast();

    const handleInputChange = (id: number, field: keyof Activity, value: string | number | string[]) => {
        updateActivity(id, { [field]: value });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{t('activity.title')}</h2>
                <Button onClick={addActivity} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> {t('common.addActivity')}
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('activity.name')}</TableHead>
                            <TableHead>{t('activity.optimistic')}</TableHead>
                            <TableHead>{t('activity.mostLikely')}</TableHead>
                            <TableHead>{t('activity.pessimistic')}</TableHead>
                            <TableHead>{t('activity.dependencies')}</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.map((activity) => (
                            <TableRow key={activity.id}>
                                <TableCell>
                                    <Input
                                        value={activity.name}
                                        onChange={(e) => handleInputChange(activity.id, 'name', e.target.value)}
                                        placeholder="e.g. Activity 1"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={activity.optimistic}
                                        onChange={(e) =>
                                            handleInputChange(activity.id, 'optimistic', parseInt(e.target.value))
                                        }
                                        placeholder="e.g. 1"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={activity.mostLikely}
                                        onChange={(e) =>
                                            handleInputChange(activity.id, 'mostLikely', parseInt(e.target.value))
                                        }
                                        placeholder="e.g. 2"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={activity.pessimistic}
                                        onChange={(e) =>
                                            handleInputChange(activity.id, 'pessimistic', parseInt(e.target.value))
                                        }
                                        placeholder="e.g. 3"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={activity.dependencies.join(', ')}
                                        onChange={(e) =>
                                            handleInputChange(
                                                activity.id,
                                                'dependencies',
                                                e.target.value.split(',').map((dep) => dep.trim()),
                                            )
                                        }
                                        placeholder="e.g. Activity 1, Activity 2"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            toast({
                                                title: t('common.deletedActivity'),
                                            });
                                            deleteActivity(activity.id);
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
