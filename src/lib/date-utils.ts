export const addBusinessDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    let addedDays = 0;
    while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0 && result.getDay() !== 6) {
            // Hafta sonu değilse (0 = Pazar, 6 = Cumartesi)
            addedDays++;
        }
    }
    return result;
}; 