# 🚀 React Admin Dashboard Template

A production-ready React + TypeScript admin dashboard template with authentication, routing, and state management. Built with modern best practices and scalable architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)

## ✨ Features

- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS & shadcn/ui
- 🔐 **Authentication System** - Complete auth flow with login, register, and protected routes
- 🛣️ **Smart Routing** - React Router v6 with route guards and layouts
- 📦 **State Management** - Zustand for global state, TanStack Query for server state
- 🔄 **API Integration** - Axios instance with interceptors and error handling
- ✅ **Form Validation** - Zod schemas with React Hook Form
- 🎯 **TypeScript** - Full type safety across the application
- 📁 **Feature-Based Architecture** - Scalable folder structure
- 🔒 **Route Protection** - Auth guards for public/private routes
- 🎭 **Multiple Layouts** - Separate layouts for auth, dashboard, and public pages

## 🛠️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### Routing & Navigation
- **React Router v6** - Client-side routing
- **Route Guards** - Protected routes with auth checks

### State Management
- **Zustand** - Lightweight global state
- **TanStack Query** - Server state management & caching
- **Zustand Persist** - Local storage persistence

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **@hookform/resolvers** - RHF + Zod integration

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Re-usable components
- **Lucide React** - Icon library

### API & Data Fetching
- **Axios** - HTTP client
- **Interceptors** - Request/response handling

## 📁 Project Structure

```
src/
├── api/
│   └── api.ts                      # Axios instance with interceptors
│
├── components/
│   ├── guards/
│   │   ├── AuthGuard.tsx          # Protects authenticated routes
│   │   └── GuestGuard.tsx         # Redirects authenticated users
│   ├── layout/
│   │   ├── AuthLayout.tsx         # Layout for login/register pages
│   │   └── DashboardLayout.tsx    # Layout for admin dashboard
│   └── ui/                        # shadcn/ui components
│
├── hooks/
│   └── # Custom hooks
│
├── lib/
│   ├── queryClient.ts             # TanStack Query configuration
│   └── utils.ts                   # Utility functions
│
├── pages/
│   ├── (auth)/                    # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   └── (dashboard)/               # Protected dashboard pages
│       ├── dashboard/
│       │   └── page.tsx
│       ├── users/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── settings/
│       │   └── page.tsx
│       └── profile/
│           └── page.tsx
│
├── repositories/
│   └── # API repository pattern
│
├── routes/
│   ├── auth.routes.tsx            # Auth routes configuration
│   ├── dashboard.routes.tsx       # Dashboard routes configuration
│   ├── public-routes.tsx          # Public routes configuration
│   └── index.tsx                  # Main routes combiner
│
├── stores/
│   ├── auth-store.ts              # Authentication store (Zustand)
│   └── index.ts                   # Store exports
│
├── App.tsx                        # Main app component
└── main.tsx                       # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd your-project-name
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
VITE_API_URL=https://api.yourdomain.com
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🔐 Authentication Flow

### How It Works

1. **Login**: User submits credentials → API validates → Token stored in Zustand & localStorage
2. **Protected Routes**: `AuthGuard` checks authentication → Redirects to login if not authenticated
3. **API Requests**: Axios interceptor adds token to all requests automatically
4. **Token Refresh**: Interceptor handles 401 errors and clears auth state
5. **Logout**: Clears token, resets state, redirects to login

### Token Storage

Tokens are stored in:
- **localStorage** - For persistence across sessions
- **Zustand store** - For in-memory access

> **Note**: For production apps, consider using httpOnly cookies for better security.

## 🛣️ Adding New Routes

### 1. Create a Protected Dashboard Page

```typescript
// src/pages/(dashboard)/products/page.tsx
export default function ProductsPage() {
  return <div>Products Page</div>;
}
```

Add to `dashboard.routes.tsx`:
```typescript
{
  path: '/products',
  element: <ProductsPage />,
}
```

### 2. Create a Public Page

```typescript
// src/pages/public/pricing/page.tsx
export default function PricingPage() {
  return <div>Pricing Page</div>;
}
```

Add to `public-routes.tsx`:
```typescript
{
  path: '/pricing',
  element: <PricingPage />,
}
```

## 🎯 Feature Module Pattern

Each feature follows this structure:

```
features/
└── users/
    ├── index.ts              # Barrel exports
    ├── types.ts              # TypeScript types
    ├── schema.ts             # Zod validation schemas
    ├── repository.ts         # API calls
    ├── hooks/
    │   └── useUsers.ts       # TanStack Query hooks
    └── components/
        └── UserCard.tsx      # Feature-specific components
```

### Example Feature Setup

```typescript
// features/users/repository.ts
import api from '@/api/api';

export class UsersRepository {
  async getUsers() {
    const { data } = await api.get('/users');
    return data;
  }
}

export const usersRepository = new UsersRepository();

// features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { usersRepository } from '../repository';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersRepository.getUsers(),
  });
};
```

## 🔧 Configuration

### Axios Configuration

Customize API base URL and interceptors in `src/api/api.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### TanStack Query Configuration

Adjust cache settings in `src/lib/queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});
```

## 🎨 Styling Guide

### Tailwind CSS

This project uses Tailwind CSS utility classes:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
</div>
```

### shadcn/ui Components

Import pre-built components:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

<Button variant="default" size="lg">Click me</Button>
```

## 🔒 Security Best Practices

- ✅ Tokens stored securely with automatic cleanup
- ✅ Protected routes with authentication guards
- ✅ API interceptors handle authentication errors
- ✅ Form validation with Zod schemas
- ✅ TypeScript for type safety
- ✅ Environment variables for sensitive data

### Production Recommendations

1. Use **httpOnly cookies** instead of localStorage
2. Implement **CSRF protection**
3. Add **rate limiting** on API endpoints
4. Enable **HTTPS only**
5. Implement **refresh token rotation**
6. Add **Content Security Policy** headers

## 📚 Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "zustand": "^4.x",
  "@tanstack/react-query": "^5.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "tailwindcss": "^3.x",
  "lucide-react": "^0.x"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 📧 Support

For support, email support@yourdomain.com or open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**