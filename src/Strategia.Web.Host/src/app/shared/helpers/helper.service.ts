import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor() { }

    // Method to generate a GUID
    generateGUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Method to format date to a specific format
    formatDate(date: Date, format: string): string {
        // Simple date formatting, you might want to use a library like date-fns or moment for more complex formatting
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    // Add more helper methods as needed


    trackByFn(index: number, item: any): any {
        return index;
    }

    // Helper method to apply titleCaseTransform to each item in the array
    transformArrayItems(array: any): any {
        if (Array.isArray(array)) {
            return array.map(item => this.transformItem(item));
        } else if (typeof array === 'string') {
            return this.titleCaseTransform(array); // Transform a single string
        } else {
            return array; // Return the original value if it's not an array or a string
        }
    }
    // Helper method to transform an individual item
    transformItem(item: any): any {
        if (typeof item === 'string') {
            return this.titleCaseTransform(item);
        } else if (typeof item.name === 'string') {
            item.name = this.titleCaseTransform(item.name);
        }
        return item;
    }

    titleCaseTransform(value: string): string {
        if (!value) return value;
        if (typeof value !== 'string') {
            return value; // Return the original value if it's not a string
        }
        return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    }
}
