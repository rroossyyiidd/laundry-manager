# Laundry Manager

A comprehensive laundry management system built with modern web technologies to streamline laundry business operations.

## Tech Stack

### Framework & Runtime
- **Framework**: Next.js 15.3.3 (React 18.3.1)
- **Language**: TypeScript 5
- **Package Manager**: npm

### UI & Styling
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 3.4.1 with custom design system
- **Icons**: Lucide React
- **Animations**: tailwindcss-animate

### Form Management & Validation
- **Form Library**: React Hook Form 7.54.2
- **Validation**: Zod 3.24.2 with @hookform/resolvers

### Database & ORM
- **Database**: SQLite (compatible schema design)
- **ORM**: Not implemented yet (designed for future integration)

### Date Handling
- **Date Library**: date-fns 3.6.0

### Additional Libraries
- **Charts**: Recharts 2.15.1
- **Calendar**: React Day Picker 8.10.1
- **Carousel**: Embla Carousel React 8.6.0
- **Utility**: clsx, tailwind-merge, class-variance-authority

## Features & Application Flow

### Core Entities
1. **Customers** - Customer management with contact information
2. **Packages** - Laundry service packages with descriptions and status
3. **Payment Methods** - Available payment options for customers
4. **Laundry Orders** - Order tracking with status management

### Main Features

#### 1. Authentication System
- **Login Page**: Email/password authentication with form validation
- **Route Protection**: Dashboard requires authentication
- **Session Management**: Basic redirect-based flow

#### 2. Dashboard Overview
- **Statistics Cards**: Active packages, total customers, revenue metrics
- **Navigation**: Sidebar with main sections (Orders, Packages, Customers, Payment Methods)

#### 3. Customer Management
- **CRUD Operations**: Create, Read, Update, Delete customers
- **Customer Data**:
  - Full name (minimum 2 characters)
  - Email address (validated format)
  - Phone number (minimum 10 characters)
- **Table View**: Sortable customer list with actions
- **Modal Forms**: Popup dialogs for adding/editing customers

#### 4. Package Management
- **Service Packages**: Define laundry service types
- **Package Data**:
  - Package name (minimum 3 characters)
  - Description (minimum 10 characters)
  - Active/Inactive status toggle
- **Status Management**: Enable/disable packages for availability

#### 5. Payment Methods Management
- **Payment Options**: Configure accepted payment methods
- **Method Data**:
  - Method name (minimum 3 characters)
  - Description (minimum 5 characters)
  - Active/Inactive status
- **Availability Control**: Toggle payment method availability

#### 6. Laundry Orders Management
- **Order Processing**: Complete order lifecycle management
- **Order Data**:
  - Customer selection (from existing customers)
  - Package selection (from active packages)
  - Weight in kilograms (minimum 0.1kg)
  - Order status (Pending, Processing, Completed, Cancelled)
  - Automatic order date timestamp
- **Status Tracking**: Order progress monitoring
- **Relational Data**: Links customers and packages

### Application Flow

1. **User Authentication**
   ```
   Login Page → Validate Credentials → Dashboard
   ```

2. **Customer Onboarding**
   ```
   Dashboard → Customers → Add Customer → Form Validation → Save
   ```

3. **Service Setup**
   ```
   Dashboard → Packages → Define Services → Set Status → Save
   Dashboard → Payment Methods → Configure Options → Set Availability
   ```

4. **Order Processing**
   ```
   Dashboard → Orders → New Order → Select Customer → Choose Package → 
   Enter Weight → Set Status → Create Order → Track Progress
   ```

5. **Data Management**
   ```
   Each Entity → Table View → Edit/Delete Actions → Confirmation Dialogs
   ```

### User Interface Patterns
- **Consistent Layout**: Sidebar navigation with main content area
- **Modal Dialogs**: Popup forms for CRUD operations
- **Data Tables**: Sortable, actionable data grids
- **Status Badges**: Visual status indicators
- **Form Validation**: Real-time validation with error messages
- **Confirmation Dialogs**: Safety prompts for destructive actions
- **Responsive Design**: Mobile-friendly interface

### Data Validation
- **Client-side**: Zod schemas with React Hook Form integration
- **Real-time**: Immediate feedback on form inputs
- **Type Safety**: Full TypeScript type checking
- **Error Handling**: Contextual error messages

### Future Extensibility
- Database integration ready (SQLite schema compatible)
- API endpoints prepared for backend integration
- Authentication system expandable
- AI integration framework in place
- Component-based architecture for easy feature additions

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
