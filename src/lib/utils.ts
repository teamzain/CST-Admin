import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert HTML datetime-local format to ISO 8601 UTC format
 * Input: "2025-11-03T09:00" (from datetime-local input)
 * Output: "2025-11-03T09:00:00Z" (ISO 8601 UTC)
 */
export function convertToISO8601(datetimeLocal: string): string {
  if (!datetimeLocal) return '';
  
  // datetime-local format is YYYY-MM-DDTHH:mm
  // We need to convert to YYYY-MM-DDTHH:mm:ssZ
  const date = new Date(datetimeLocal);
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid datetime-local format:', datetimeLocal);
    return datetimeLocal;
  }
  
  // Convert to ISO string and ensure it ends with Z
  return date.toISOString();
}

/**
 * Convert ISO 8601 UTC format back to datetime-local format
 * Input: "2025-11-03T09:00:00Z" (ISO 8601 UTC)
 * Output: "2025-11-03T09:00" (for datetime-local input)
 */
export function convertFromISO8601(isoString: string): string {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid ISO 8601 format:', isoString);
      return isoString;
    }
    
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.warn('Error converting ISO 8601:', error);
    return isoString;
  }
}
