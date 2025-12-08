export interface Transaction {
  transactionId: string;
  date: string; // ISO Date string
  customerId: string;
  customerName: string;
  phoneNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  customerRegion: string;
  customerType: 'Regular' | 'Premium' | 'New';
  productId: string;
  productName: string;
  brand: string;
  productCategory: string;
  tags: string[];
  quantity: number;
  pricePerUnit: number;
  discountPercentage: number;
  totalAmount: number;
  finalAmount: number;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'Cash' | 'Net Banking';
  orderStatus: 'Completed' | 'Pending' | 'Cancelled' | 'Returned';
  deliveryType: 'Standard' | 'Express' | 'Store Pickup';
  storeId: string;
  storeLocation: string;
  salespersonId: string;
  employeeName: string;
}

export interface FilterState {
  searchQuery: string;
  regions: string[];
  genders: string[];
  ageRange: { min: number; max: number };
  categories: string[];
  tags: string[];
  paymentMethods: string[];
  dateRange: { start: string; end: string };
}

export interface SortState {
  field: 'date' | 'quantity' | 'customerName' | 'totalAmount';
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}