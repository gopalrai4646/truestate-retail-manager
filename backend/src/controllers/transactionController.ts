import { dataService } from '../services/dataService';
import { FilterState, SortState, Transaction } from '../models/types';

// Controller mimics an API endpoint handler
export const getTransactions = (
  filters: FilterState,
  sort: SortState,
  page: number,
  limit: number
) => {
  // In a real backend, this would take Request/Response objects
  return dataService.getTransactions(filters, sort, page, limit);
};

export const importData = (data: Transaction[]) => {
  dataService.loadData(data);
  return { success: true, message: `Imported ${data.length} records` };
};