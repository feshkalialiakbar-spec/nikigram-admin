

// Additional validation function for date strings
export function isValidDateString(dateString: string): boolean {
    if (!dateString || dateString.trim() === "") {
        return false;
    }

    const cleanDate = dateString.split('T')[0].trim();
    const dateParts = cleanDate.split("-").map(Number);

    // Check if we have exactly 3 parts and all are numbers
    if (dateParts.length !== 3 || dateParts.some(isNaN)) {
        return false;
    }

    const [year, month, day] = dateParts;

    // Basic range validation
    if (year < 1000 || year > 3000) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
}

// Smart date detection and conversion functions
export function isGregorianDate(dateString: string): boolean {
    try {
        // Handle empty or null values
        if (!dateString || dateString.trim() === "") {
            return false;
        }

        // Handle timestamp format (YYYY-MM-DDTHH:mm:ss)
        const cleanDate = dateString.split('T')[0].trim();
        const dateParts = cleanDate.split("-").map(Number);
        if (dateParts.length !== 3 || dateParts.some(isNaN)) {
            return false;
        }

        const year = dateParts[0];
        // If year is greater than 1700, it's likely Gregorian
        return year > 1700;
    } catch (error) {
        console.error("Error in isGregorianDate:", error);
        return false;
    }
}

export function isPersianDate(dateString: string): boolean {
    try {
        // Handle empty or null values
        if (!dateString || dateString.trim() === "") {
            return false;
        }

        // Handle timestamp format (YYYY-MM-DDTHH:mm:ss)
        const cleanDate = dateString.split('T')[0].trim();
        const dateParts = cleanDate.split("-").map(Number);
        if (dateParts.length !== 3 || dateParts.some(isNaN)) {
            return false;
        }

        const year = dateParts[0];
        // If year is less than 1500, it's likely Persian
        return year < 1500;
    } catch (error) {
        console.error("Error in isPersianDate:", error);
        return false;
    }
}





export function getImageUrl(fileUid: string | null): string {
    if (!fileUid) {
        return "/images/notFound/not-found.png";
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/sys/files/download/${fileUid}`;
}

export function getImageUrlWithFallback(fileUid: string | null, fallbackUrl: string = "/images/notFound/not-found.png"): string {
    if (!fileUid) {
        return fallbackUrl;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/sys/files/download/${fileUid}`;
}

// Utility functions for gender conversion
export function genderToNumber(gender: string | null | undefined): number {
    if (!gender) return 0; // 0 for unspecified
    return gender === "مرد" ? 1 : gender === "زن" ? 2 : 0;
}

export function numberToGender(genderNumber: number | null | undefined): string | null {
    return genderNumber === 1 ? "مرد" : genderNumber === 2 ? "زن" : null;
}

// Types for the getChangedFields function
interface CurrentValues {
    name: string;
    lastName: string;
    nickname: string;
    nationalCode: string;
    gender: string;
    date: string;
    education: string;
    bio: string;
}

interface OriginalData {
    firstName: string;
    lastName: string;
    alias: string | null;
    nationalCode: string;
    gender: string | null;
    birthDate: string;
    education: string;
    bio: string;
}

interface ChangedFields {
    FirstName?: string;
    LastName?: string;
    Alias?: string | undefined;
    NationalID?: string;
    Gender?: number;
    BirthDate?: string | undefined;
    EducationDegree?: number;
    Biography?: string | undefined;
}

// Utility function for comparing changes
export function getChangedFields(
    currentValues: CurrentValues,
    originalData: OriginalData
): ChangedFields {
    const changes: ChangedFields = {};

    // Compare FirstName
    if (currentValues.name !== originalData.firstName) {
        // Only include FirstName if it's not empty
        if (currentValues.name && currentValues.name.trim() !== "") {
            changes.FirstName = currentValues.name.trim();
        }
    }

    // Compare LastName
    if (currentValues.lastName !== originalData.lastName) {
        // Only include LastName if it's not empty
        if (currentValues.lastName && currentValues.lastName.trim() !== "") {
            changes.LastName = currentValues.lastName.trim();
        }
    }

    // Compare Alias
    if (currentValues.nickname !== (originalData.alias || "")) {
        // Only include Alias if it's not empty
        if (currentValues.nickname && currentValues.nickname.trim() !== "") {
            changes.Alias = currentValues.nickname.trim();
        }
    }

    // Compare NationalID
    if (currentValues.nationalCode !== originalData.nationalCode) {
        // Only include NationalID if it's not empty
        if (currentValues.nationalCode && currentValues.nationalCode.trim() !== "") {
            changes.NationalID = currentValues.nationalCode.trim();
        }
    }

    // Compare Gender
    const currentGenderNumber = genderToNumber(currentValues.gender);
    const originalGenderNumber = genderToNumber(originalData.gender);
    if (currentGenderNumber !== originalGenderNumber) {
        changes.Gender = currentGenderNumber;
    }

    // Compare BirthDate
    if (currentValues.date !== originalData.birthDate) {
        // Smart conversion: convert Persian to Gregorian for API if needed
        if (currentValues.date) {
         } else {
            changes.BirthDate = undefined;
        }
    }

    // Compare EducationDegree
    const currentEducationNumber = parseInt(currentValues.education, 10);
    const originalEducationNumber = parseInt(originalData.education || "", 10);
    console.log('Education comparison:', {
        current: currentValues.education,
        currentNumber: currentEducationNumber,
        original: originalData.education,
        originalNumber: originalEducationNumber,
        isDifferent: currentEducationNumber !== originalEducationNumber
    });
    if (currentEducationNumber !== originalEducationNumber) {
        changes.EducationDegree = currentEducationNumber;
    }

    // Compare Biography
    if (currentValues.bio !== originalData.bio) {
        // Only include Biography if it's not empty
        if (currentValues.bio && currentValues.bio.trim() !== "") {
            changes.Biography = currentValues.bio.trim();
        }
    }

    // Filter out empty/undefined values to avoid sending unnecessary data
    const filteredChanges: ChangedFields = {};
    Object.entries(changes).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            filteredChanges[key as keyof ChangedFields] = value;
        }
    });

    console.log('🔍 getChangedFields result:', {
        originalChanges: changes,
        filteredChanges: filteredChanges,
        changesCount: Object.keys(filteredChanges).length
    });

    return filteredChanges;
} 