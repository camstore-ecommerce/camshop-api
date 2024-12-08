/**
 * Convert '' value from Object properties to null value
 * @param obj 
 * @returns 
 */
export function convertEmptyStringsToNull(obj: any): any {
    for (const key in obj) {
        if (obj[key] === '') {
            obj[key] = null;
        }
    }
    return obj;
}

/**
 * Convert 'NaN' value from Object properties to null value
 * @param obj 
 * @returns 
 */
export function convertNaNToNull(obj: any): any {
    for (const key in obj) {
        if (obj[key] === 'NaN' || isNaN(obj[key])) {
            obj[key] = null;
        }
    }
    return obj;
}