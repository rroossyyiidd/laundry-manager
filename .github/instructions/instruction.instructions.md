---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Development Guidelines

## Schema

- Always refers `schema.dbml` & `api.schema.yaml` as data structure references.

## Error Handling
- always show validation errors from server.

## After Action
- always show success / failed message after any action.

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
- **ORM**: Prisma 4.18.0
- **Database Management**: Prisma Migrate for schema migrations

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