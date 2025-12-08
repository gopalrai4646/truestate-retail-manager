import { Transaction } from '../types';

export const parseExcelData = (data: ArrayBuffer): Transaction[] => {
  const XLSX = (window as any).XLSX;
  if (!XLSX) {
    throw new Error("XLSX library not loaded");
  }

  const wb = XLSX.read(data, { type: 'array', cellDates: true });
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const jsonData = XLSX.utils.sheet_to_json(ws);

  if (jsonData.length === 0) {
    throw new Error("File is empty");
  }

  // Helper to find a value case-insensitively/fuzzy match
  const getValue = (row: any, ...keys: string[]) => {
    const rowKeys = Object.keys(row);
    for (const key of keys) {
      const exactMatch = row[key];
      if (exactMatch !== undefined) return exactMatch;
      const normalizedKey = key.toLowerCase().replace(/[\s_]/g, '');
      const foundKey = rowKeys.find(k => k.toLowerCase().replace(/[\s_]/g, '') === normalizedKey);
      if (foundKey) return row[foundKey];
    }
    return undefined;
  };

  const mappedData: Transaction[] = jsonData.map((row: any, index: number) => {
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

  return mappedData;
};