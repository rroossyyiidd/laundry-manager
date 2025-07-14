# Customer CRUD Implementation

This document describes the complete CRUD (Create, Read, Update, Delete) implementation for the Customer module in the Laundry Manager application.

## API Endpoints

### Base URL: `/api/customers`

#### 1. GET `/api/customers` - Get All Customers
- **Method**: GET
- **Description**: Retrieve all customers with their recent orders
- **Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+628123456789",
        "address": "Jl. Sudirman No. 123, Jakarta",
        "createdAt": "2025-07-14T04:04:14.574Z",
        "updatedAt": "2025-07-14T04:04:14.574Z",
        "orders": [...]
      }
    ],
    "count": 3
  }
  ```

#### 2. GET `/api/customers/[id]` - Get Single Customer
- **Method**: GET
- **Description**: Retrieve a specific customer by ID with all their orders
- **Parameters**: `id` (number) - Customer ID
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+628123456789",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "createdAt": "2025-07-14T04:04:14.574Z",
      "updatedAt": "2025-07-14T04:04:14.574Z",
      "orders": [...]
    }
  }
  ```

#### 3. POST `/api/customers` - Create New Customer
- **Method**: POST
- **Description**: Create a new customer
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+628123456789"
  }
  ```
- **Validation**: 
  - `name`: minimum 2 characters
  - `email`: valid email format
  - `phone`: minimum 10 characters
- **Response**: 
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Customer created successfully"
  }
  ```

#### 4. PUT `/api/customers/[id]` - Update Customer
- **Method**: PUT
- **Description**: Update an existing customer
- **Parameters**: `id` (number) - Customer ID
- **Request Body**: Same as POST
- **Response**: 
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Customer updated successfully"
  }
  ```

#### 5. DELETE `/api/customers/[id]` - Delete Customer
- **Method**: DELETE
- **Description**: Delete a customer (only if no orders exist)
- **Parameters**: `id` (number) - Customer ID
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Customer deleted successfully"
  }
  ```

## Frontend Implementation

### Components Structure

#### 1. Customer Page (`/dashboard/customers`)
- **Location**: `src/app/dashboard/customers/page.tsx`
- **Features**:
  - Loading state with spinner
  - Error handling with toast notifications
  - Add new customer button
  - Customer table with edit/delete actions
  - Modal dialog for create/edit operations

#### 2. Customer Dialog (`CustomerDialog`)
- **Location**: `src/components/customers/customer-dialog.tsx`
- **Features**:
  - Form validation using Zod schema
  - Loading state during submission
  - Support for both create and edit modes
  - Proper error handling

#### 3. Customer Table (`CustomersTable`)
- **Location**: `src/components/customers/customers-table.tsx`
- **Features**:
  - Responsive table layout
  - Avatar display with fallback
  - Action dropdown menu
  - Delete confirmation dialog
  - Empty state message

### Service Layer

#### Customer Service (`CustomerService`)
- **Location**: `src/lib/services/customerService.ts`
- **Features**:
  - Type-safe API calls
  - Client-side validation
  - Comprehensive error handling
  - Consistent response format
  - Methods: `getAll()`, `getById()`, `create()`, `update()`, `delete()`

### Validation Schema

#### Customer Schema
- **Location**: `src/lib/schemas.ts`
- **Definition**:
  ```typescript
  export const customerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  });
  ```

## Error Handling

### API Error Responses
- **Validation Errors**: 400 Bad Request with detailed field errors
- **Duplicate Email**: 409 Conflict
- **Not Found**: 404 Not Found
- **Server Errors**: 500 Internal Server Error
- **Delete Constraint**: 400 Bad Request (customer has orders)

### Frontend Error Handling
- Toast notifications for all operations
- Form validation with real-time feedback
- Loading states during API calls
- Graceful fallbacks for network errors

## Database Constraints

### Customer Table
- `email` field has unique constraint
- Cannot delete customer with existing orders
- Soft relationship with orders (cascade on delete prevented)

## Security Features

- Server-side validation on all endpoints
- Input sanitization through Zod schemas
- Proper HTTP status codes
- CORS protection (Next.js default)

## Testing

### API Testing
All endpoints can be tested using curl commands:

```bash
# Get all customers
curl -X GET http://localhost:3000/api/customers

# Create customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Customer","email":"test@example.com","phone":"+628111222333"}'

# Update customer
curl -X PUT http://localhost:3000/api/customers/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Customer","email":"test@example.com","phone":"+628111222333"}'

# Delete customer
curl -X DELETE http://localhost:3000/api/customers/1
```

### Frontend Testing
- Access the customer management at: `http://localhost:3000/dashboard/customers`
- Test all CRUD operations through the UI
- Verify form validation
- Test error scenarios (duplicate email, etc.)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── customers/
│   │       ├── route.ts              # GET, POST /api/customers
│   │       └── [id]/
│   │           └── route.ts          # GET, PUT, DELETE /api/customers/[id]
│   └── dashboard/
│       └── customers/
│           └── page.tsx              # Customer management page
├── components/
│   └── customers/
│       ├── customer-dialog.tsx       # Create/Edit modal
│       └── customers-table.tsx       # Customer data table
├── lib/
│   ├── schemas.ts                    # Zod validation schemas
│   ├── types.ts                      # TypeScript type definitions
│   └── services/
│       └── customerService.ts        # API service layer
```

## Key Features Implemented

✅ **Complete CRUD Operations**
- Create new customers
- Read customer list and individual details
- Update customer information
- Delete customers (with constraint checks)

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

✅ **Type Safety**
- Full TypeScript implementation
- Prisma-generated types
- Consistent API response types

✅ **Database Integration**
- Prisma ORM
- SQLite database
- Foreign key constraints
- Data relationships

This implementation follows best practices for a production-ready application with proper separation of concerns, error handling, and user experience considerations.
