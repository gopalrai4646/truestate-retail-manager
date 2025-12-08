import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Transaction, FilterState, SortState, PaginationState } from './types';
import { dataService } from './services/dataService';
import FilterPanel from './components/FilterPanel';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';
import { Search, Bell, User, Info, FileSpreadsheet } from 'lucide-react';

const App: React.FC = () => {
  // --- State Management ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    regions: [],
    genders: [],
    ageRange: { min: 0, max: 100 },
    categories: [],
    tags: [],
    paymentMethods: [],
    dateRange: { start: '', end: '' },
  });
  const [sort, setSort] = useState<SortState>({ field: 'date', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, pagination.currentPage]);

  // --- Handlers ---
  const fetchData = () => {
    setIsLoading(true);
    // Simulate network delay for realistic feel
    setTimeout(() => {
      const result = dataService.getTransactions(
        filters,
        sort,
        pagination.currentPage,
        pagination.itemsPerPage
      );
      setTransactions(result.data);
      setPagination(result.pagination);
      setIsLoading(false);
    }, 300);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 on filter change
  };

  const handleSortChange = (field: SortState['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!(window as any).XLSX) {
      alert("Excel parser not loaded yet. Please wait a moment or refresh.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;

      try {
        const wb = (window as any).XLSX.read(data, { type: 'array', cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = (window as any).XLSX.utils.sheet_to_json(ws);

        if (jsonData.length === 0) {
          alert("The uploaded file appears to be empty.");
          return;
        }

        // Helper to find a value case-insensitively/fuzzy match
        // This ensures 'Customer Name' matches 'CustomerName', 'customer name', etc.
        const getValue = (row: any, ...keys: string[]) => {
          const rowKeys = Object.keys(row);
          for (const key of keys) {
             const exactMatch = row[key];
             if (exactMatch !== undefined) return exactMatch;

             // Try case-insensitive normalization
             const normalizedKey = key.toLowerCase().replace(/[\s_]/g, '');
             const foundKey = rowKeys.find(k => k.toLowerCase().replace(/[\s_]/g, '') === normalizedKey);
             if (foundKey) return row[foundKey];
          }
          return undefined;
        };

        const mappedData: Transaction[] = jsonData.map((row: any, index: number) => {
          // Parse Tags which might be comma separated string "Sale, New"
          const rawTags = getValue(row, 'Tags', 'tags');
          let tagsArray: string[] = [];
          if (typeof rawTags === 'string') {
            tagsArray = rawTags.split(',').map((s: string) => s.trim());
          }

          return {
            transactionId: String(getValue(row, 'Transaction ID', 'TransactionID', 'id') || `TRX-${index}`),
            date: getValue(row, 'Date', 'date') ? new Date(getValue(row, 'Date', 'date')).toISOString() : new Date().toISOString(),
            customerId: String(getValue(row, 'Customer ID', 'CustomerID') || ''),
            customerName: getValue(row, 'Customer Name', 'CustomerName') || 'Unknown',
            phoneNumber: String(getValue(row, 'Phone Number', 'PhoneNumber') || ''),
            gender: getValue(row, 'Gender') || 'Other',
            age: Number(getValue(row, 'Age')) || 0,
            customerRegion: getValue(row, 'Customer Region', 'CustomerRegion', 'Region') || 'Unknown',
            customerType: getValue(row, 'Customer Type', 'CustomerType') || 'New',
            productId: String(getValue(row, 'Product ID', 'ProductID') || ''),
            productName: getValue(row, 'Product Name', 'ProductName') || '',
            brand: getValue(row, 'Brand') || '',
            productCategory: getValue(row, 'Product Category', 'ProductCategory', 'Category') || 'Uncategorized',
            tags: tagsArray,
            quantity: Number(getValue(row, 'Quantity')) || 0,
            pricePerUnit: Number(getValue(row, 'Price per Unit', 'Price')) || 0,
            discountPercentage: Number(getValue(row, 'Discount Percentage', 'Discount')) || 0,
            totalAmount: Number(getValue(row, 'Total Amount', 'TotalAmount')) || 0,
            finalAmount: Number(getValue(row, 'Final Amount', 'FinalAmount')) || 0,
            paymentMethod: getValue(row, 'Payment Method', 'PaymentMethod') || 'Cash',
            orderStatus: getValue(row, 'Order Status', 'OrderStatus') || 'Completed',
            deliveryType: getValue(row, 'Delivery Type', 'DeliveryType') || 'Standard',
            storeId: String(getValue(row, 'Store ID', 'StoreID') || ''),
            storeLocation: getValue(row, 'Store Location', 'StoreLocation') || '',
            salespersonId: String(getValue(row, 'Salesperson ID', 'SalespersonID') || ''),
            employeeName: getValue(row, 'Employee Name', 'EmployeeName') || ''
          };
        });

        dataService.loadData(mappedData);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchData();
        alert(`Successfully imported ${mappedData.length} records! Your dataset is now live.`);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Failed to parse the file. Please ensure it is a valid Excel or CSV file.");
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    // Calculate based on current result set (transactions)
    const totalQty = transactions.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    const totalAmt = transactions.reduce((acc, curr) => acc + (curr.finalAmount || 0), 0);
    const totalDisc = transactions.reduce((acc, curr) => acc + ((curr.totalAmount || 0) - (curr.finalAmount || 0)), 0);

    return {
      units: totalQty,
      amount: totalAmt,
      discount: totalDisc
    };
  }, [transactions]);


  return (
    <div className="flex h-screen bg-gray-50 flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex-none z-30 shadow-sm relative">
        <div className="flex items-center justify-between px-6 h-full">
           <div className="flex items-center gap-3">
             {/* Logo / Brand */}
             <div className="flex items-center gap-2">
               <h1 className="text-xl font-bold text-gray-800 tracking-tight">Sales Management System</h1>
             </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Name, Phone no."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-100/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-400 sm:text-sm transition duration-150 ease-in-out"
                value={filters.searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <input 
               type="file" 
               accept=".xlsx, .csv" 
               ref={fileInputRef} 
               className="hidden" 
               onChange={handleFileUpload} 
             />
             <button 
               onClick={triggerFileUpload}
               className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
               title="Upload your Excel dataset"
             >
               <FileSpreadsheet className="w-4 h-4" />
               Import Data
             </button>

             <button className="p-2 text-gray-400 hover:text-gray-600 relative rounded-full hover:bg-gray-100 transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 border border-primary-200 flex items-center justify-center text-primary-700 font-medium cursor-pointer shadow-sm">
               <User className="w-4 h-4" />
             </div>
          </div>
        </div>
      </header>

      {/* Filter Bar (Top) */}
      <div className="flex-none bg-white z-20 relative">
        <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Stats & Sort Row */}
        <div className="px-6 py-6 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gray-50">
          
          {/* Stats Cards */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-w-[180px]">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Total units sold</span>
                <Info className="w-3 h-3 text-gray-300" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.units}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-w-[220px]">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Amount</span>
                <Info className="w-3 h-3 text-gray-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.amount)}
                </span>
                <span className="text-xs text-gray-400 font-medium">({pagination.totalItems} SRs)</span>
              </div>
            </div>

             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-w-[200px]">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Discount</span>
                <Info className="w-3 h-3 text-gray-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.discount)}
                </span>
                 <span className="text-xs text-gray-400 font-medium">saved</span>
              </div>
            </div>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-500 font-medium">Sort by:</span>
            <div className="relative z-10">
              <select 
                className="appearance-none bg-white text-gray-900 text-sm border border-gray-300 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                value={sort.field}
                onChange={(e) => handleSortChange(e.target.value as any)}
              >
                <option value="customerName">Customer Name (A-Z)</option>
                <option value="date">Date (Newest)</option>
                <option value="quantity">Quantity (High-Low)</option>
                <option value="totalAmount">Amount (High-Low)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-hidden px-6 pb-6 flex flex-col">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
             <div className="flex-1 overflow-y-auto">
               {isLoading ? (
                  <div className="h-full flex items-center justify-center flex-col gap-3">
                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                     <span className="text-sm text-gray-500">Loading transactions...</span>
                  </div>
               ) : (
                  <TransactionTable 
                    data={transactions} 
                    sort={sort} 
                    onSortChange={handleSortChange} 
                  />
               )}
             </div>
             
             {!isLoading && (
               <div className="flex-none">
                 <Pagination 
                   pagination={pagination} 
                   onPageChange={handlePageChange} 
                 />
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;