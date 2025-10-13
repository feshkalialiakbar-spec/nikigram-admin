export function normalizeDigits(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Persian digits map (۰-۹)
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  // Arabic digits map (٠-٩)
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  // English digits
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let normalized = input;

  // Replace Persian digits
  persianDigits.forEach((digit, index) => {
    normalized = normalized.replace(new RegExp(digit, 'g'), englishDigits[index]);
  });

  // Replace Arabic digits
  arabicDigits.forEach((digit, index) => {
    normalized = normalized.replace(new RegExp(digit, 'g'), englishDigits[index]);
  });

  return normalized;
}

/**
 * Checks if a string contains Persian or Arabic numerals
 * @param input - String to check
 * @returns Boolean indicating if non-English numerals are present
 */
export function hasNonEnglishDigits(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const persianArabicDigitsRegex = /[۰-۹٠-٩]/;
  return persianArabicDigitsRegex.test(input);
}

/**
 * Normalizes digits and returns only numeric characters
 * @param input - String to normalize
 * @returns String containing only English digits
 */
export function normalizeToNumericOnly(input: string): string {
  const normalized = normalizeDigits(input);
  return normalized.replace(/\D/g, '');
}

/**
 * Formats a phone number by normalizing digits
 * @param phone - Phone number string
 * @returns Normalized phone number with only English digits
 */
export function normalizePhoneNumber(phone: string): string {
  return normalizeToNumericOnly(phone);
}

