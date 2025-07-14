# Package CRUD Implementation

This document describes the complete CRUD (Create, Read, Update, Delete) implementation for the Package module in the Laundry Manager application.

## API Endpoints

### Base URL: `/api/packages`

#### 1. GET `/api/packages` - Get All Packages
- **Method**: GET
- **Description**: Retrieve all packages with their recent orders
- **Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Basic Wash",
        "description": "Standard washing and drying service",
        "price": 15000,
        "active": true,
        "createdAt": "2025-07-14T04:04:14.572Z",
        "updatedAt": "2025-07-14T04:04:14.572Z",
        "orders": [...]
      }
    ],
    "count": 3
  }
  ```

#### 2. GET `/api/packages/[id]` - Get Single Package
- **Method**: GET
- **Description**: Retrieve a specific package by ID with all its orders
- **Parameters**: `id` (number) - Package ID
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Basic Wash",
      "description": "Standard washing and drying service",
      "price": 15000,
      "active": true,
      "createdAt": "2025-07-14T04:04:14.572Z",
      "updatedAt": "2025-07-14T04:04:14.572Z",
      "orders": [...]
    }
  }
  ```

#### 3. POST `/api/packages` - Create New Package
- **Method**: POST
- **Description**: Create a new package
- **Request Body**:
  ```json
  {
    "name": "Express Service",
    "description": "Same-day express laundry service",
    "price": 25000,
    "active": true
  }
  ```
- **Validation**: 
  - `name`: minimum 3 characters
  - `description`: minimum 10 characters
  - `price`: positive number (optional, nullable)
  - `active`: boolean (defaults to true)
- **Response**: 
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Package created successfully"
  }
  ```

#### 4. PUT `/api/packages/[id]` - Update Package
- **Method**: PUT
- **Description**: Update an existing package
- **Parameters**: `id` (number) - Package ID
- **Request Body**: Same as POST
- **Response**: 
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Package updated successfully"
  }
  ```

#### 5. DELETE `/api/packages/[id]` - Delete Package
- **Method**: DELETE
- **Description**: Delete a package (only if no orders exist)
- **Parameters**: `id` (number) - Package ID
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Package deleted successfully"
  }
  ```

## Frontend Implementation

### Components Structure

#### 1. Package Page (`/dashboard/packages`)
- **Location**: `src/app/dashboard/packages/page.tsx`
- **Features**:
  - Loading state with spinner
  - Error handling with toast notifications
  - Add new package button
  - Package table with edit/delete actions
  - Modal dialog for create/edit operations

#### 2. Package Dialog (`PackageDialog`)
- **Location**: `src/components/packages/package-dialog.tsx`
- **Features**:
  - Form validation using Zod schema
  - Loading state during submission
  - Support for both create and edit modes
  - Price field with validation
  - Active/inactive toggle switch
  - Proper error handling

#### 3. Package Table (`PackagesTable`)
- **Location**: `src/components/packages/packages-table.tsx`
- **Features**:
  - Responsive table layout
  - Price display with IDR formatting
  - Active/inactive status badges
  - Action dropdown menu
  - Delete confirmation dialog
  - Empty state message

### Service Layer

#### Package Service (`PackageService`)
- **Location**: `src/lib/services/packageService.ts`
- **Features**:
  - Type-safe API calls
  - Client-side validation
  - Comprehensive error handling
  - Consistent response format
  - Methods: `getAll()`, `getById()`, `create()`, `update()`, `delete()`

### Validation Schema

#### Package Schema
- **Location**: `src/lib/schemas.ts`
- **Definition**:
  ```typescript
  export const packageSchema = z.object({
    name: z.string().min(3, { message: 'Package name must be at least 3 characters.' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
    price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }).optional().nullable(),
    active: z.boolean().default(true),
  });
  ```

## Error Handling

### API Error Responses
- **Validation Errors**: 400 Bad Request with detailed field errors
- **Duplicate Name**: 409 Conflict
- **Not Found**: 404 Not Found
- **Server Errors**: 500 Internal Server Error
- **Delete Constraint**: 400 Bad Request (package has orders)

### Frontend Error Handling
- Toast notifications for all operations
- Form validation with real-time feedback
- Loading states during API calls
- Graceful fallbacks for network errors

## Database Constraints

### Package Table
- `name` field should be unique (enforced at API level)
- Cannot delete package with existing orders
- Soft relationship with orders (cascade on delete prevented)
- `price` field is nullable for flexible pricing

## Security Features

- Server-side validation on all endpoints
- Input sanitization through Zod schemas
- Proper HTTP status codes
- Next.js 15 compliance with async params
- CORS protection (Next.js default)

## Testing

### API Testing
All endpoints can be tested using curl commands:

```bash
# Get all packages
curl -X GET http://localhost:3001/api/packages

# Create package
curl -X POST http://localhost:3001/api/packages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Package","description":"Test description","price":20000,"active":true}'

# Update package
curl -X PUT http://localhost:3001/api/packages/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Package","description":"Updated description","price":25000,"active":true}'

# Delete package
curl -X DELETE http://localhost:3001/api/packages/1
```

### Frontend Testing
- Access the package management at: `http://localhost:3001/dashboard/packages`
- Test all CRUD operations through the UI
- Verify form validation
- Test error scenarios (duplicate name, etc.)

## UI Features

### Package Table Columns
- **Name**: Package service name
- **Description**: Truncated description with tooltip
- **Price**: Formatted IDR currency or "Variable" for null prices
- **Status**: Active/Inactive badge
- **Actions**: Edit and Delete dropdown menu

### Package Form Fields
- **Package Name**: Text input with validation
- **Description**: Textarea with minimum length validation
- **Price (IDR)**: Number input (optional)
- **Active Status**: Toggle switch with description

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── packages/
│   │       ├── route.ts              # GET, POST /api/packages
│   │       └── [id]/
│   │           └── route.ts          # GET, PUT, DELETE /api/packages/[id]
│   └── dashboard/
│       └── packages/
│           └── page.tsx              # Package management page
├── components/
│   └── packages/
│       ├── package-dialog.tsx        # Create/Edit modal
│       └── packages-table.tsx        # Package data table
├── lib/
│   ├── schemas.ts                    # Zod validation schemas
│   ├── types.ts                      # TypeScript type definitions
│   └── services/
│       └── packageService.ts         # API service layer
```

## Key Features Implemented

✅ **Complete CRUD Operations**
- Create new packages with price
- Read package list and individual details
- Update package information
- Delete packages (with constraint checks)

✅ **Data Validation**
- Client-side validation with Zod
- Server-side validation
- Real-time form validation

✅ **Error Handling**
- Comprehensive error messages
- Toast notifications
- Graceful degradation

✅ **User Experience**
- Loading states
- Confirmation dialogs
- Responsive design
- Empty state handling
- Price formatting

✅ **Type Safety**
- Full TypeScript implementation
- Prisma-generated types
- Consistent API response types

✅ **Database Integration**
- Prisma ORM
- SQLite database
- Foreign key constraints
- Data relationships

✅ **Next.js 15 Compliance**
- Async params handling
- Modern API route patterns
- Turbopack support

This implementation follows the same patterns as the customer CRUD system, ensuring consistency across the application while providing specialized features for package management including pricing and service status controls.
