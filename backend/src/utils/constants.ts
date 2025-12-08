import { Transaction } from '../models/types';

// Mock Data Generators - Aligned with Sales Data Requirements
export const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
export const GENDERS = ['Male', 'Female'];
export const CATEGORIES = ['Clothing', 'Electronics', 'Home & Decor', 'Footwear', 'Accessories', 'Beauty'];
export const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking'];
export const TAGS = ['Sale', 'New', 'Clearance', 'Premium', 'Seasonal', 'Limited', 'Best Seller', 'Trending'];
const FIRST_NAMES = ['Aarav', 'Neha', 'Rohan', 'Priya', 'Vikram', 'Sneha', 'Amit', 'Ananya', 'Rahul', 'Ishita', 'Arjun', 'Kavya'];
const LAST_NAMES = ['Sharma', 'Yadav', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Das', 'Reddy', 'Mehta', 'Joshi', 'Malhotra'];
const BRANDS = ['Nike', 'Samsung', 'Zara', 'Apple', 'Adidas', 'H&M', 'Sony', 'Puma', 'LG', 'Levis'];
const EMPLOYEES = ['Harsh Agrawal', 'Pooja Singh', 'Rajesh Koothrappali', 'Monica Geller', 'Chandler Bing', 'Joey Tribbiani', 'Rachel Green'];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const generateMockData = (count: number = 0): Transaction[] => {
  if (count === 0) return [];
  
  return Array.from({ length: count }).map((_, i) => {
    const price = randomInt(500, 50000);
    const qty = randomInt(1, 5);
    const discount = randomInt(0, 20);
    const total = price * qty;
    const final = total - (total * (discount / 100));

    const tagCount = randomInt(1, 2);
    const selectedTags = new Set<string>();
    while(selectedTags.size < tagCount) {
        selectedTags.add(randomPick(TAGS));
    }

    return {
      transactionId: `TRX${100000 + i}`,
      date: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      customerId: `CUST${2000 + i}`,
      customerName: `${randomPick(FIRST_NAMES)} ${randomPick(LAST_NAMES)}`,
      phoneNumber: `+91 ${randomInt(7000000000, 9999999999)}`,
      gender: randomPick(GENDERS) as any,
      age: randomInt(18, 70),
      customerRegion: randomPick(REGIONS),
      customerType: randomPick(['Regular', 'Premium', 'New']) as any,
      productId: `PROD${5000 + i}`,
      productName: `${randomPick(BRANDS)} Product ${i}`,
      brand: randomPick(BRANDS),
      productCategory: randomPick(CATEGORIES),
      tags: Array.from(selectedTags),
      quantity: qty,
      pricePerUnit: price,
      discountPercentage: discount,
      totalAmount: total,
      finalAmount: Math.floor(final),
      paymentMethod: randomPick(PAYMENT_METHODS) as any,
      orderStatus: randomPick(['Completed', 'Pending', 'Returned']) as any,
      deliveryType: randomPick(['Standard', 'Express', 'Store Pickup']) as any,
      storeId: `STORE${randomInt(1, 10)}`,
      storeLocation: randomPick(REGIONS),
      salespersonId: `EMP${randomInt(100, 200)}`,
      employeeName: randomPick(EMPLOYEES),
    };
  });
};

// Set to 0 to disable hardcoded data by default
export const MOCK_DATA = generateMockData(0);