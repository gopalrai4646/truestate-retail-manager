import React from 'react';
import { Transaction, SortState } from '../types';
import { ArrowUp, ArrowDown, Copy, Upload, FileSpreadsheet } from 'lucide-react';

interface TransactionTableProps {
  data: Transaction[];
  sort: SortState;
  onSortChange: (field: SortState['field']) => void;
  onUpload?: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const TransactionTable: React.FC<TransactionTableProps> = ({ data, sort, onSortChange, onUpload }) => {
  const getSortIcon = (field: SortState['field']) => {
    if (sort.field !== field) return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-30 inline-block">↕</span>;
    return sort.direction === 'asc' ? <ArrowUp className="w-4 h-4 ml-1 inline-block" /> : <ArrowDown className="w-4 h-4 ml-1 inline-block" />;
  };

  const headers: { label: string; field?: SortState['field']; className?: string }[] = [
    { label: 'Transaction ID' },
    { label: 'Date', field: 'date' },
    { label: 'Customer', field: 'customerName' },
    { label: 'Region' },
    { label: 'Product' },
    { label: 'Category' },
    { label: 'Qty', field: 'quantity', className: 'text-center' },
    { label: 'Total', field: 'totalAmount', className: 'text-right' },
    { label: 'Status' },
    { label: 'Employee' },
  ];

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-white border border-gray-200 rounded-lg m-4 shadow-sm">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
            <FileSpreadsheet className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Loaded</h3>
        <p className="text-gray-500 max-w-sm mb-8">
            The application is currently empty. Please upload your <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-gray-700">truestate_assignment_dataset.csv</span> file to visualize the sales dashboard.
        </p>
        <button 
            onClick={onUpload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md hover:shadow-lg font-medium transform hover:-translate-y-0.5"
        >
            <Upload className="w-5 h-5" />
            Upload Dataset
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm m-4 flex-1">
      <table className="w-full min-w-max text-left border-collapse">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold sticky top-0 z-10 shadow-sm">
          <tr>
            {headers.map((h, i) => (
              <th 
                key={i} 
                className={`px-4 py-3 border-b border-gray-200 bg-gray-50 select-none ${h.field ? 'cursor-pointer group hover:bg-gray-100' : ''} ${h.className || ''}`}
                onClick={() => h.field && onSortChange(h.field)}
              >
                <div className={`flex items-center ${h.className?.includes('text-right') ? 'justify-end' : h.className?.includes('text-center') ? 'justify-center' : ''}`}>
                  {h.label}
                  {h.field && getSortIcon(h.field)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          {data.map((row, index) => (
            <tr key={row.transactionId || index} className="hover:bg-blue-50/30 transition-colors group">
              <td className="px-4 py-3 font-medium text-gray-900">
                {row.transactionId}
              </td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {new Date(row.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{row.customerName}</span>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <span>{row.phoneNumber}</span>
                    <Copy className="w-3 h-3 ml-1 cursor-pointer hover:text-primary-600" />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{row.customerRegion}</td>
              <td className="px-4 py-3">
                 <div className="flex flex-col max-w-[150px]">
                  <span className="text-gray-900 truncate" title={row.productName}>{row.productName}</span>
                  <span className="text-xs text-gray-500">{row.brand}</span>
                 </div>
              </td>
              <td className="px-4 py-3">
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                   {row.productCategory}
                 </span>
              </td>
              <td className="px-4 py-3 text-center font-semibold text-gray-700">{row.quantity}</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(row.finalAmount || row.totalAmount)}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    row.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    row.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    row.orderStatus === 'Returned' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                  {row.orderStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{row.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;