import * as XLSX from 'xlsx';
import { Activity } from '@/types/Activity';

interface ActivityWithCalculations extends Activity {
    duration: number;
    earliestStart: number;
    earliestFinish: number;
    latestStart: number;
    latestFinish: number;
    slack: number;
}

interface ExportData {
    activities: ActivityWithCalculations[];
    criticalPath: string[];
    projectDuration: number;
}

export function exportToExcel(data: ExportData, fileName: string = 'project-data.xlsx') {
    const activityData = data.activities.map(activity => ({
        'Activity Name': activity.name,
        'Optimistic Duration': activity.optimistic,
        'Most Likely Duration': activity.mostLikely,
        'Pessimistic Duration': activity.pessimistic,
        'Expected Duration': activity.duration,
        'Earliest Start': activity.earliestStart,
        'Earliest Finish': activity.earliestFinish,
        'Latest Start': activity.latestStart,
        'Latest Finish': activity.latestFinish,
        'Slack': activity.slack,
        'Dependencies': activity.dependencies.join(', '),
        'On Critical Path?': data.criticalPath.includes(activity.name) ? 'Yes' : 'No'
    }));

    const summaryData = [{
        'Project Duration': data.projectDuration,
        'Critical Path': data.criticalPath.join(' -> '),
        'Number of Activities': data.activities.length,
        'Number of Critical Activities': data.criticalPath.length
    }];

    const wb = XLSX.utils.book_new();
    
    const wsActivities = XLSX.utils.json_to_sheet(activityData);
    XLSX.utils.book_append_sheet(wb, wsActivities, 'Activities');

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Project Summary');

    XLSX.writeFile(wb, fileName);
} 