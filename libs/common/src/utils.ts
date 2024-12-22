import { Pagination } from "./interfaces";

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

/**
 * Set default values for Pagination
 * @param pagination 
 * @returns 
 */
export function handlePagination(pagination: Pagination, defaultSort: string = 'id') {
    // Set default values for pagination
    pagination.limit = pagination.limit || 40; // Default limit
    pagination.sort = pagination.sort || defaultSort; // Default sort field
    pagination.order = pagination.order || 'asc'; // Default order is ascending
    pagination.page = pagination.page || 1; // Default page

    // Calculate offset
    const limit = pagination.limit; // Default limit
    const offset = (pagination.page - 1) * limit;
    const sort = pagination.sort; // Default sort field
    const order = pagination.order === 'desc' ? -1 : 1; // Default order is ascending

    return { offset, limit, sort, order };
}