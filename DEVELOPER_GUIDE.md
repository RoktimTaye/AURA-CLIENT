# Aura Client - Technical Developer Guide

Welcome to the **Aura Client** repository. This project is a modern, full-stack React 19 application built using the **TanStack Start** framework. It leverages Server-Side Rendering (SSR) and Server Functions for a seamless, type-safe development experience.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.x or higher (v20+ recommended)
- **npm**: v9.x or higher

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The application will be available at [http://localhost:8080](http://localhost:8080).

### Build for Production
```bash
npm run build
```
This generates a production-ready build in the `dist/` directory, optimized for Cloudflare Pages/Workers.

---

## 🛠 Tech Stack

### Core Framework
- **React 19**: Utilizing the latest features like Server Components and optimized rendering.
- **TanStack Start v1**: A full-stack React framework with SSR, SSG, and built-in server functions.
- **TanStack Router**: Type-safe, file-based routing.
- **Vite 7**: Ultra-fast build tool and development server.
- **TypeScript**: Strict mode enabled for maximum type safety.

### UI & Styling
- **Tailwind CSS v4**: High-performance CSS framework (configured via `src/styles.css`).
- **shadcn/ui**: Accessible, high-quality UI components located in `src/components/ui/`.
- **Framer Motion & GSAP**: Used for high-fidelity animations and interactive elements.
- **Lucide React**: Icon library.

### State & Data Handling
- **Zustand**: Lightweight, robust state management.
- **TanStack Table**: Headless UI for building powerful tables and data grids.
- **Recharts**: Composable charting library for analytics.
- **React Hook Form + Zod**: Strict schema validation for all user inputs and API payloads.

---

## 📁 Project Structure

```text
aura-client/
├── src/
│   ├── components/
│   │   ├── aura/       # Custom business logic components
│   │   └── ui/         # shadcn/ui primitive components
│   ├── hooks/          # Shared React hooks
│   ├── lib/            # Utility functions and core logic
│   ├── routes/         # File-based routing (TanStack Router)
│   │   ├── __root.tsx  # Root layout
│   │   ├── index.tsx   # Homepage
│   │   └── admin.tsx   # Admin dashboard and sub-routes
│   ├── server.ts       # SSR/Server entry point
│   ├── styles.css      # Tailwind v4 entry and global styles
│   └── start.ts        # Client entry point
├── public/             # Static assets
├── wrangler.jsonc      # Cloudflare deployment config
└── vite.config.ts      # Build and plugin configuration
```

---

## ⚙️ Backend & Integration Guide

For backend developers, integration happens primarily through **Server Functions** and **Route Loaders**.

### 1. Server Functions
TanStack Start uses `createServerFn` to define server-side logic that can be called from the client like a normal function.

```typescript
// Example: src/lib/api.ts
import { createServerFn } from '@tanstack/react-start'

export const updateGroceryStatus = createServerFn('POST', async (id: string) => {
  // Your backend logic (DB calls, API requests) goes here
  // This code runs ONLY on the server.
  return { success: true }
})
```

### 2. Data Loading (Loaders)
Routes use loaders to fetch data before rendering. This ensures no waterfalls and better SEO.

```typescript
// Example: src/routes/admin.index.tsx
export const Route = createFileRoute('/admin/')({
  loader: async () => {
    // Fetch data for the admin dashboard
    return fetchAdminData()
  },
  component: AdminDashboard,
})
```

### 3. API Communication
While Server Functions are preferred for SSR, you can still use standard `fetch` within loaders or hooks to communicate with external REST or GraphQL APIs.

### 4. Validation with Zod
Always define schemas for data coming from the backend or user forms.
```typescript
import { z } from 'zod'

const GrocerySchema = z.object({
  id: z.number(),
  item: z.string(),
  status: z.enum(['Verified', 'Pending']),
})
```

---

## ☁️ Deployment

The project is configured to deploy to **Cloudflare** using `wrangler`.
- Configuration: `wrangler.jsonc`
- Build Output: `dist/client` and `dist/server`

To preview the production build locally:
```bash
npm run preview
```

---

## 📝 Conventions
- **Routing**: Always use file-based routing in `src/routes/`.
- **Components**: Prefer functional components with TypeScript interfaces.
- **Styling**: Use Tailwind utility classes; avoid writing raw CSS unless necessary in `styles.css`.
- **Types**: Maintain strictly typed interfaces for all shared data models.
