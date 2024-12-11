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

    const handleDeleteActivity = (id: number) => {
        deleteActivity(id);
        const newTotalPages = Math.ceil((activities.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages) {
            setCurrentPage(Math.max(1, currentPage - 1));
        }
    };

    const renderPageButtons = () => {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={currentPage === i ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>,
            );
        }
        return buttons;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                    <h2 className="text-lg font-semibold">{t('activity.title')}</h2>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                            onClick={() => {
                                if (!startDate) {
                                    toast({
                                        title: t('common.error'),
                                        description: t('common.selectDateFirst'),
                                        variant: 'destructive',
                                    });
                                    return;
                                }
                                document.getElementById('excel-upload')?.click();
                            }}
                            size="sm"
                            variant="outline"
                            disabled={!startDate}
                            className="w-full sm:w-auto"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {t('common.importExcel')}
                        </Button>
                    </div>
                </div>
                <Button onClick={addActivity} size="sm" disabled={!startDate} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> {t('common.addActivity')}
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
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
                                            handleDeleteActivity(activity.id);
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
            {activities.length > 0 && (
                <div className="p-2 border-t mt-auto pb-0">
                    <div className="flex justify-center">
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                {t('table.previous')}
                            </Button>

                            {renderPageButtons()}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                {t('table.next')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
