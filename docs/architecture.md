# Architecture Document

## Folder Structure
```
📁 root/
├── backend/
│   ├── src/
│   │   ├── controllers/ (API Endpoints/Interface)
│   │   ├── services/    (Business Logic)
│   │   ├── utils/       (Helpers & Constants)
│   │   └── models/      (Type Definitions)
│
├── frontend/
│   ├── src/
│   │   ├── components/  (React UI Components)
│   │   ├── services/    (API Client)
│   │   ├── main.tsx     (Entry Point)
│   │   └── App.tsx      (Main Container)
```

## Data Flow
1. **User Interaction**: User clicks a filter or types in search in the **Frontend**.
2. **API Call**: `frontend/src/services/api.ts` is called.
3. **Controller**: Request reaches `backend/src/controllers/transactionController.ts`.
4. **Service Layer**: Controller calls `dataService.ts` to apply business logic (Filtering -> Sorting -> Pagination).
5. **Response**: Processed data is returned to the Frontend and State is updated.

## Module Responsibilities
- **Frontend/Components**: Pure UI rendering. No business logic.
- **Frontend/Services**: Bridge to the backend. Handles network simulation.
- **Backend/Services**: The "Brain". Handles all data manipulation.
- **Backend/Controllers**: Input/Output handling.
