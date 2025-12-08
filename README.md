# Retail Sales Management System

## Overview
A comprehensive full-stack style application for managing retail sales data. It includes advanced filtering, searching, and sorting capabilities, processing large datasets of sales transactions.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js (Simulated in this demo), Logic separated into Controllers/Services
- **Data**: Mock data generator + XLSX File Import support

## Search Implementation
- **Full-Text Search**: Case-insensitive search implemented in the backend service layer.
- **Fields**: Searches across `Customer Name` and `Phone Number`.

## Filter Implementation
- **Multi-Select**: Region, Gender, Product Category, Tags, Payment Method.
- **Range**: Age Range (Min/Max).
- **Date**: Start and End Date filtering.
- **Logic**: Filters are applied conjunctively (AND logic between categories, OR logic within multi-selects).

## Sorting Implementation
- **Fields**: Date, Quantity, Customer Name, Total Amount.
- **Mechanism**: Backend-side sorting preserving active filters.

## Pagination Implementation
- **Size**: 10 items per page.
- **Navigation**: Next/Previous and numeric page access.
- **State**: Resets to page 1 on filter changes.

## Setup Instructions
1. Clone the repository.
2. Open `index.html` in a modern browser (or use a live server).
3. Click "Import Data" to load custom datasets.
