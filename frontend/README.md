# GrowFolio Frontend

A modern React frontend application built with Vite, Tailwind CSS, and React Router v6. Designed for a scalable SaaS architecture.

## 🎨 Features

- **Vite** - Lightning-fast build tool
- **React 18** - Modern UI library with hooks
- **React Router v6** - Advanced routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management for authentication
- **Axios** - HTTP client with interceptors
- **Responsive Design** - Mobile-first approach

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables**
   Edit `.env.local`:
   ```
   VITE_API_URL=http://localhost:8000
   VITE_APP_NAME=GrowFolio
   VITE_APP_ENV=development
   ```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── pages/                 # Page components
│   ├── auth/             # Authentication pages
│   ├── user/             # User dashboard pages
│   ├── admin/            # Admin pages
│   └── public/           # Public pages
├── components/           # Reusable components
│   ├── ui/              # UI components (Button, Card, Input)
│   └── layout/          # Layout components (Header, Sidebar)
├── layouts/             # Page layouts
│   ├── AuthLayout
│   ├── DashboardLayout
│   └── AdminLayout
├── routes/              # Routing configuration
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── services/            # API services
│   ├── api.js           # Axios instance
│   └── authService.js   # Auth API calls
├── contexts/            # Context providers
│   └── AuthContext.jsx  # Auth state management
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useCustom.js
│   └── ...
├── utils/              # Utility functions
│   └── helpers.js
└── styles/             # Global styles
    └── index.css       # Tailwind imports
```

## 🎯 Key Components

### UI Components
- **Button** - Customizable button with variants (primary, secondary, danger, ghost)
- **Card** - Container component with header, body, and footer sections
- **Input** - Form input with error handling and labels
- **Loading** - Loading spinner and overlay
- **States** - Error, empty, and alert states

### Layouts
- **AuthLayout** - Centered layout for login/register pages
- **DashboardLayout** - Sidebar + header layout for user dashboard
- **AdminLayout** - Admin-specific layout with admin navigation

## 🔐 Authentication

### Context API Integration
The authentication state is managed using React Context:

```jsx
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth()
  
  // Use auth state
}
```

### Protected Routes
Routes are protected using custom route components:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Secure Token Management
- Tokens are stored in `sessionStorage` (cleared on browser close)
- Automatic token injection in API requests
- Automatic logout on 401 responses

## 🎨 Theme Configuration

Tailwind CSS is configured with a custom theme:

### Color Palette
- **Primary** - #3B1E54 (Plum)
- **Accent** - #FFB26F (Amber)
- **Background** - #F9F9FB (Off-white)

Edit `tailwind.config.js` to customize colors and other theme options.

## 📡 API Integration

### Axios Configuration
API client is configured with:
- Base URL from environment variables
- Automatic Bearer token injection
- Error handling and 401 response interception

### Usage
```jsx
import apiClient from './services/api'

// In a component
const response = await apiClient.get('/endpoint')
```

### Auth Service
```jsx
import { authService } from './services/authService'

// Login
const response = await authService.login(email, password)

// Register
const response = await authService.register(email, password, firstName, lastName)

// Update profile
const response = await authService.updateProfile(data)
```

## 🛠️ Custom Hooks

### useAuth
Access authentication state and methods:
```jsx
const { user, token, isAuthenticated, login, logout } = useAuth()
```

### useForm
Handle form state and submission:
```jsx
const { values, errors, handleChange, handleSubmit } = useForm(
  initialValues,
  onSubmit
)
```

### useAsync
Handle async operations with loading/error states:
```jsx
const { data, error, status, execute } = useAsync(asyncFunction)
```

## 📦 Build

Create a production build:
```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 🧪 Best Practices

1. **Components** - Use functional components with hooks
2. **State** - Use Context API for global state, useState for local state
3. **Naming** - Components use PascalCase, files use camelCase
4. **Styling** - Use Tailwind CSS classes, avoid inline styles
5. **API Calls** - Use centralized services with axios
6. **Error Handling** - Always handle errors in async operations
7. **Loading States** - Show loading indicators for better UX
8. **Environment Variables** - Use `.env` for configuration

## 🔒 Security

- JWT tokens stored in sessionStorage (not localStorage)
- Automatic token refresh on 401
- Protected routes prevent unauthorized access
- CORS proxy configured for API requests

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## 🚨 Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### API requests failing
- Check that backend is running at `VITE_API_URL`
- Verify CORS configuration on backend
- Check browser console for error details

### Token not persisting
- Ensure sessionStorage is not cleared
- Check that token is properly stored after login
- Verify API response includes token fields

## 📝 License

This project is part of the GrowFolio platform.
