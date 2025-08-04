# Authentication Setup

This document describes the authentication flow implemented in the University Management System.

## Overview

The application now implements an automatic authentication flow that:

1. **Auto-login on app load**: When the application starts, it automatically calls the `/api/auth/admin/login` endpoint with hardcoded credentials
2. **Token storage**: The access token is stored in session storage
3. **Automatic API authentication**: All API calls now use the stored access token automatically

## Authentication Flow

### 1. Initial Login
- **Endpoint**: `http://localhost:4000/api/auth/admin/login`
- **Method**: POST
- **Payload**:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 2. Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "688d1f6c82401eba8fa61e82",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "ddfc0c9b176890638b06b986eb1bf3c25441d4170b5bc02d43b892a41c2dbeca2ba2f6398a3d7bed"
  }
}
```

### 3. Token Storage
- Access token is stored in `sessionStorage` as `accessToken`
- User data is stored in `sessionStorage` as `user`

## API Structure

### Authentication Service (`lib/api/auth.ts`)
- `login()`: Manual login with credentials
- `autoLogin()`: Automatic login with hardcoded credentials
- `getAccessToken()`: Retrieve stored access token
- `getUser()`: Retrieve stored user data
- `isAuthenticated()`: Check if user is authenticated
- `logout()`: Clear stored tokens and user data

### Base API Service (`lib/api/base.ts`)
- Provides common HTTP methods (GET, POST, PUT, DELETE, UPLOAD)
- Automatically includes authentication headers
- Handles error responses

### University API Service (`lib/api/universities.ts`)
- Extends BaseAPI for university-specific operations
- All methods automatically include authentication
- Updated to use string IDs instead of number IDs

## Components Updated

### 1. Authentication Provider (`components/providers/auth-provider.tsx`)
- Manages authentication state
- Provides authentication context to the app
- Handles auto-login on app load

### 2. Dashboard Layout (`app/dashboard/layout.tsx`)
- Shows loading state during authentication
- Prevents access if authentication fails
- Only renders content when authenticated

### 3. University Components
- **university-list.tsx**: Updated to use `universityAPI` service
- **add-university-form.tsx**: Updated to use `universityAPI` service
- **bulk-upload-form.tsx**: Updated to use `universityAPI` service

## Usage

### In Components
```typescript
import { useAuth } from "@/components/providers/auth-provider"
import { universityAPI } from "@/lib/api/universities"

// Use authentication state
const { isAuthenticated, isLoading, user } = useAuth()

// Make API calls (authentication is automatic)
const universities = await universityAPI.getUniversities()
```

### API Calls
All API calls now automatically include the access token:
```typescript
// Before (hardcoded token)
const response = await fetch(url, {
  headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
})

// After (automatic token)
const result = await universityAPI.getUniversities()
```

## Environment Variables

Make sure to set the API base URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Security Notes

- Access tokens are stored in session storage (cleared when browser closes)
- Hardcoded credentials are used for auto-login (should be replaced with proper login form in production)
- All API calls automatically include authentication headers
- Failed authentication shows appropriate error messages 