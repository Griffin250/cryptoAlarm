# CryptoAlarm Client Dependencies Installation Guide
## Complete Setup for Frontend Migration to React + TypeScript + Vite

---

## 📋 Current Client Status

**✅ Already Installed:**
- React 19.1.1 + React DOM
- TypeScript ~5.9.3 with React types
- Vite 7.1.7 with React plugin
- Tailwind CSS 3.4.18 with PostCSS & Autoprefixer
- ESLint with React hooks support

---

## 📦 Required Dependencies Installation

### 1. Core Runtime Dependencies

```bash
# Navigate to client folder first
cd client

# Install all core runtime dependencies in one command
npm install react-router-dom@^6.26.1 @supabase/supabase-js@^2.75.0 axios@^1.12.2 lucide-react@^0.545.0 sonner@^2.0.7 clsx@^2.1.1 tailwind-merge@^3.3.1 class-variance-authority@^0.7.1
```

**Individual packages breakdown:**
```bash
# Routing for SPA
npm install react-router-dom@^6.26.1

# Database & Authentication
npm install @supabase/supabase-js@^2.75.0

# HTTP Client for API calls
npm install axios@^1.12.2

# Icons library (1000+ icons)
npm install lucide-react@^0.545.0

# Toast notifications
npm install sonner@^2.0.7

# Utility libraries for styling
npm install clsx@^2.1.1 tailwind-merge@^3.3.1 class-variance-authority@^0.7.1
```

### 2. Radix UI Components (Shadcn/ui Foundation)

```bash
# Install all Radix UI primitives used in the frontend
npm install @radix-ui/react-dialog@^1.1.15 @radix-ui/react-select@^2.2.6 @radix-ui/react-slot@^1.2.3 @radix-ui/react-tabs@^1.1.13
```

**Individual Radix packages:**
```bash
# Modal/Dialog components
npm install @radix-ui/react-dialog@^1.1.15

# Select dropdown components  
npm install @radix-ui/react-select@^2.2.6

# Slot utility for component composition
npm install @radix-ui/react-slot@^1.2.3

# Tab components
npm install @radix-ui/react-tabs@^1.1.13
```

### 3. Development Dependencies (Type Definitions)

```bash
# Type definitions for React Router
npm install --save-dev @types/react-router-dom@^5.3.3
```

---

## 🛠️ Configuration Files Setup

### 1. Update Vite Configuration

**File: `client/vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // Allow external connections
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // For compatibility with some packages that expect process.env
    global: 'globalThis',
  },
})
```

### 2. Update TypeScript Configuration

**File: `client/tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "**/*.ts", "**/*.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Enhanced Tailwind Configuration

**File: `client/tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3861FB",
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3861FB',
          600: '#2851FB',
          700: '#1d4ed8',
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // CryptoAlarm specific colors
        success: '#16C784',
        danger: '#EA3943',
        warning: '#F59E0B',
        crypto: {
          bg: {
            primary: '#0B1426',
            secondary: '#0F1837',
            tertiary: '#1A1B3A',
          }
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
```

### 4. Environment Variables Setup

**File: `client/.env.local` (create this file)**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API Configuration
VITE_BACKEND_URL=https://cryptoalarm.onrender.com
VITE_API_URL=https://cryptoalarm.onrender.com

# Development flags
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG=true
```

### 5. Update Package.json Scripts

**Add to `client/package.json` scripts section:**
```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🎨 CSS Variables Setup

**File: `client/src/index.css` - Add CSS variables for Shadcn/ui**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* CryptoAlarm Custom Styles */
.gradient-bg {
  background: linear-gradient(135deg, #0B1426 0%, #0F1837 50%, #1A1B3A 100%);
}

.crypto-card {
  @apply bg-gray-900/50 border-gray-700 backdrop-blur-lg;
}

.price-up {
  @apply text-[#16C784];
}

.price-down {
  @apply text-[#EA3943];
}

/* Animation classes */
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}
```

---

## 📂 Folder Structure Setup

**Create the following folder structure in `client/src/`:**

```bash
mkdir -p src/components/ui
mkdir -p src/pages
mkdir -p src/lib
mkdir -p src/services
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/assets
```

**Complete folder structure:**
```
client/src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── AlertManager.tsx
│   ├── ResponsiveNavbar.tsx
│   ├── AuthForm.tsx
│   └── ...
├── pages/
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   └── ...
├── lib/
│   ├── utils.ts
│   ├── api.ts
│   └── supabase.ts
├── services/
│   ├── authService.ts
│   ├── alertService.ts
│   └── ...
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── types/
│   └── index.ts
├── assets/
│   └── images/
├── App.tsx
├── main.tsx
└── index.css
```

---

## ⚙️ Additional Setup Commands

### 1. Initialize Git (if not already done)
```bash
cd client
git init
```

### 2. Create Essential Files
```bash
# Create environment file template
touch .env.local

# Create essential TypeScript files
touch src/types/index.ts
```

### 3. Install Optional Development Tools
```bash
# Prettier for code formatting
npm install --save-dev prettier

# Additional ESLint rules for TypeScript
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 🔧 Compatibility Notes

### ✅ Fully Compatible
- **React 19.1.1**: Latest stable version, fully compatible
- **Vite 7.1.7**: Latest version with excellent React support
- **TypeScript 5.9.3**: Stable version with React 19 support
- **Tailwind CSS 3.4.18**: Latest stable version
- **All Radix UI components**: Designed for React 18+ (compatible with React 19)
- **Supabase JS**: Latest version with React 19 support

### ⚠️ Version Compatibility Checks
- **React Router DOM**: Version 6.26.1 is fully compatible with React 19
- **Axios**: Version 1.12.2 is framework-agnostic and compatible
- **Lucide React**: Version 0.545.0 supports React 19
- **Sonner**: Version 2.0.7 is React 19 compatible

### 🔄 Migration Considerations
- **No Next.js dependencies**: All Next.js-specific packages removed
- **Vite environment variables**: Use `VITE_` prefix instead of `NEXT_PUBLIC_`
- **Import paths**: Use relative imports or `@/` alias
- **CSS imports**: Standard CSS imports instead of Next.js CSS modules

---

## 📋 Pre-Migration Checklist

### Before Starting Migration:
- [ ] Run all installation commands above
- [ ] Verify all dependencies installed successfully
- [ ] Set up environment variables in `.env.local`
- [ ] Test basic Vite dev server: `npm run dev`
- [ ] Verify Tailwind CSS is working
- [ ] Check TypeScript compilation: `npm run type-check`

### Installation Verification Commands:
```bash
# Check if all packages are installed
npm list --depth=0

# Verify no dependency conflicts
npm audit

# Test development server
npm run dev

# Test TypeScript compilation
npm run type-check

# Test build process
npm run build
```

---

## 🚀 Installation Summary

**Total packages to install: 12**
- 8 runtime dependencies
- 4 Radix UI components  
- 1 development type definition

**Configuration files to update: 4**
- vite.config.ts
- tsconfig.json  
- tailwind.config.js
- src/index.css

**Environment setup: 1 file**
- .env.local with Vite variables

**Estimated installation time: 2-3 minutes**
**Estimated configuration time: 5-10 minutes**

---

## ⭐ Ready for Migration!

Once you complete this installation guide:

1. **All dependencies will be compatible** with your React 19 + TypeScript + Vite setup
2. **Configuration will match** the frontend functionality requirements  
3. **Environment will be prepared** for seamless component migration
4. **Development experience** will be enhanced with modern tooling

**Run the installation commands above, and then give me the go-ahead to start the migration!** 🚀