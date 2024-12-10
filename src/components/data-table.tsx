import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useActivityStore } from '@/store/use-activity-store';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '@/types/Activity';
import { DatePicker } from '@/components/ui/date-picker';

export function DataTable() {
    const { activities, updateActivity, addActivity, deleteActivity, startDate, setStartDate, handleFileUpload } =
        useActivityStore();
    const { t } = useTranslation();
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && startDate) {
            handleFileUpload(file);
        }
    };

    const handleInputChange = (id: number, field: keyof Activity, value: string | number | string[]) => {
        updateActivity(id, { [field]: value });
    };

    const totalPages = Math.ceil(activities.length / itemsPerPage);
    const paginatedActivities = activities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    console.log(paginatedActivities);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2 gap-2">
                <div className="flex items-center gap-4 justify-between w-full">
                    <h2 className="text-lg font-semibold">{t('activity.title')}</h2>
                    <div className="flex items-center gap-2">
                        <DatePicker
                            value={startDate}
                            onChange={(date: Date | undefined) => {
                                if (date) {
                                    setStartDate(date);
                                }
                            }}
                            placeholder={t('common.selectStartDate')}
                        />
                        <input
                            type="file"
                            id="excel-upload"
                            className="hidden"
                            accept=".xlsx,.xls"
                            onChange={onFileChange}
                            disabled={!startDate}
                        />
                        <Button
                            onClick={() => document.getElementById('excel-upload')?.click()}
                            size="sm"
                            variant="outline"
                            disabled={!startDate}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {t('common.importExcel')}
                        </Button>
                    </div>
                </div>
                <Button onClick={startDate ? addActivity : undefined} size="sm" disabled={!startDate}>
                    <Plus className="mr-2 h-4 w-4" /> {t('common.addActivity')}
                </Button>
            </div>
            <div className="border rounded-lg flex-1 flex flex-col">
                <div className="overflow-y-auto flex-1">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                                <TableHead>{t('activity.name')}</TableHead>
                                <TableHead>{t('activity.optimistic')}</TableHead>
                                <TableHead>{t('activity.mostLikely')}</TableHead>
                                <TableHead>{t('activity.pessimistic')}</TableHead>
                                <TableHead>{t('activity.dependencies')}</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&_tr]:h-[52px]">
                            {paginatedActivities.map((activity) => (
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
                                            type="text"
                                            value={activity.dependencies.join(', ')}
                                            onChange={(e) => {
                                                const rawValue = e.target.value;
                                                handleInputChange(activity.id, 'dependencies', [rawValue]);
                                            }}
                                            onBlur={(e) => {
                                                const deps = e.target.value
                                                    .split(',')
                                                    .map((dep) => dep.trim())
                                                    .filter((dep) => dep !== '');
                                                handleInputChange(activity.id, 'dependencies', deps);
                                            }}
                                            placeholder="e.g. 1-2, 2-3"
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
                <div className="p-2 border-t mt-auto">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            {t('common.showing')} {(currentPage - 1) * itemsPerPage + 1} -{' '}
                            {Math.min(currentPage * itemsPerPage, activities.length)} {t('common.of')}{' '}
                            {activities.length}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                {t('table.previous')}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                {t('table.next')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
