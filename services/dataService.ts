import { Transaction, FilterState, SortState, PaginationState } from '../types';
import { MOCK_DATA } from '../constants';

// This service mimics a backend controller
class DataService {
  private data: Transaction[];

  constructor() {
    this.data = MOCK_DATA;
  }

  // Allow replacing the dataset (e.g. from file upload)
  public loadData(newData: Transaction[]) {
    this.data = newData;
  }

  public getTransactions(
    filters: FilterState,
    sort: SortState,
    page: number = 1,
    limit: number = 10
  ): { data: Transaction[]; pagination: PaginationState } {
    let result = [...this.data];

    // 1. Search (Name OR Phone)
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.customerName?.toLowerCase().includes(q) ||
          t.phoneNumber?.includes(q)
      );
    }

    // 2. Filters
    // Region
    if (filters.regions.length > 0) {
      result = result.filter((t) => filters.regions.includes(t.customerRegion));
    }
    // Gender
    if (filters.genders.length > 0) {
      result = result.filter((t) => filters.genders.includes(t.gender));
    }
    // Categories
    if (filters.categories.length > 0) {
      result = result.filter((t) => filters.categories.includes(t.productCategory));
    }
    // Tags
    if (filters.tags.length > 0) {
      result = result.filter((t) => t.tags && t.tags.some(tag => filters.tags.includes(tag)));
    }
    // Payment Methods
    if (filters.paymentMethods.length > 0) {
      result = result.filter((t) => filters.paymentMethods.includes(t.paymentMethod));
    }
    // Age Range
    if (filters.ageRange.min > 0 || filters.ageRange.max < 100) {
      result = result.filter(
        (t) => t.age >= filters.ageRange.min && t.age <= filters.ageRange.max
      );
    }
    // Date Range
    if (filters.dateRange.start) {
      result = result.filter((t) => new Date(t.date) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange.end) {
      // Set end date to end of day
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter((t) => new Date(t.date) <= endDate);
    }

    // 3. Sorting
    result.sort((a, b) => {
      let valA: any = a[sort.field];
      let valB: any = b[sort.field];

      if (sort.field === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // 4. Pagination
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
      },
    };
  }
}

export const dataService = new DataService();