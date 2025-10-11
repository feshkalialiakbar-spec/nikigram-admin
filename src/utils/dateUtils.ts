// Simple Persian date conversion utility
export const convertToPersianDate = (gregorianDate: string): string => {
  if (!gregorianDate) return '';
  
  try {
    const date = new Date(gregorianDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simple conversion to Persian calendar (approximate)
    // This is a basic implementation - for production use a proper Persian calendar library
    const persianYear = year - 621;
    const persianMonth = month > 3 ? month - 3 : month + 9;
    const persianDay = day;
    
    return `${persianYear}/${persianMonth.toString().padStart(2, '0')}/${persianDay.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting date:', error);
    return gregorianDate;
  }
};

// Convert Persian date back to Gregorian for filtering
export const convertToGregorianDate = (persianDate: string): string => {
  if (!persianDate) return '';
  
  try {
    const parts = persianDate.split('/');
    if (parts.length !== 3) return persianDate;
    
    const persianYear = parseInt(parts[0]);
    const persianMonth = parseInt(parts[1]);
    const persianDay = parseInt(parts[2]);
    
    // Simple conversion back to Gregorian (approximate)
    const gregorianYear = persianYear + 621;
    const gregorianMonth = persianMonth > 9 ? persianMonth - 9 : persianMonth + 3;
    const gregorianDay = persianDay;
    
    return `${gregorianYear}-${gregorianMonth.toString().padStart(2, '0')}-${gregorianDay.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting Persian date:', error);
    return persianDate;
  }
};
