import * as TransactionController from '../../../backend/src/controllers/transactionController';
import { FilterState, SortState, Transaction, PaginationState } from '../types';

// This service mimics an HTTP client (like axios)
// calling the backend controller
export const fetchTransactions = async (
  filters: FilterState,
  sort: SortState,
  page: number,
  limit: number
): Promise<{ data: Transaction[]; pagination: PaginationState }> => {
  
  // Simulate Network Latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return TransactionController.getTransactions(filters, sort, page, limit);
};

export const uploadDataset = async (data: Transaction[]): Promise<{ success: boolean; message: string }> => {
  return TransactionController.importData(data);
};