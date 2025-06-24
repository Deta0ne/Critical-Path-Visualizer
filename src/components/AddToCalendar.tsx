import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaGoogle, FaApple, FaMicrosoft } from 'react-icons/fa';

interface AddToCalendarProps {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
}

const AddToCalendar: React.FC<AddToCalendarProps> = ({ name, description, startDate, endDate }) => {
    const { t } = useTranslation();

    const formatDate = (date: string) => {
        return new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
    };

    const getCalendarUrl = (type: string) => {
        switch (type) {
            case 'google':
                return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    name,
                )}&details=${encodeURIComponent(description)}&dates=${formatDate(startDate)}/${formatDate(endDate)}`;
            case 'outlook':
                return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
                    name,
                )}&body=${encodeURIComponent(description)}&startdt=${startDate}&enddt=${endDate}`;
            case 'apple':
                return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${name}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;
            default:
                return '';
        }
    };

    const handleCalendarSelect = (value: string) => {
        const url = getCalendarUrl(value);
        window.open(url, '_blank');
    };

    return (
        <Select onValueChange={handleCalendarSelect}>
            <SelectTrigger className="w-[200px] text-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder={t('common.addToCalendar')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="google">
                    <div className="flex items-center">
                        <FaGoogle className="mr-2 h-4 w-4 text-[#4285F4]" />
                        Google Calendar
                    </div>
                </SelectItem>
                <SelectItem value="outlook">
                    <div className="flex items-center">
                        <FaMicrosoft className="mr-2 h-4 w-4 text-[#00A4EF]" />
                        Outlook Calendar
                    </div>
                </SelectItem>
                <SelectItem value="apple">
                    <div className="flex items-center">
                        <FaApple className="mr-2 h-4 w-4" />
                        Apple Calendar
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
};

export default AddToCalendar;
