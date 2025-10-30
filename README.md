

# 🚨 CryptoAlarm - Never Miss a Crypto Move

A **professional full-stack PWA application** that monitors cryptocurrency prices in real-time and triggers **voice alerts** when price targets are reached. Built with **Next.js + Supabase + FastAPI** featuring a **modern CoinMarketCap-inspired design** with **mobile-first responsive UI**.

� **Live Backend**: https://cryptoalarm.onrender.com  
🔥 **Real-time Alerts**: Supabase-powered CRUD alert management  
📞 **Voice Alerts**: Phone call notifications via Twilio  
⚡ **WebSocket**: Live data streaming from Binance  
🎨 **Modern UI**: shadcn/ui + Radix UI components with dark theme  
📱 **PWA Ready**: Install as native app on iOS & Android  
🌐 **Responsive**: Mobile-optimized with hamburger navigation  
� **Authentication**: Supabase Auth with Row Level Security  
🗄️ **Database**: PostgreSQL with real-time subscriptions  

## 📋 Table of Contents
- [🌐 Live Demo](#-live-demo)
- [✨ Features](#-features)
- [📊 Professional Trading Charts](#-professional-trading-charts-latest-update)
- [🏗️ Project Structure](#️-project-structure)
- [📦 Dependencies](#-dependencies)
- [⚡ Quick Start](#-quick-start)
- [🔧 Environment Setup](#-environment-setup)
- [📱 Usage](#-usage)
- [📱 PWA Installation](#-pwa-installation)
- [🔮 Future Roadmap](#-future-roadmap)
- [🚀 Deployment](#-deployment)
- [🛠️ Development](#️-development)
- [📋 Latest Updates & Changelog](#-latest-updates--changelog)
- [📞 Support & Troubleshooting](#-support--troubleshooting)

---

## 🌐 Live Demo
- **Backend API**: [cryptoalarm.onrender.com](https://cryptoalarm.onrender.com)
- **API Documentation**: [cryptoalarm.onrender.com/docs](https://cryptoalarm.onrender.com/docs)
- **Frontend**: *Deploy and update this link with your frontend URL*

---

## ✨ Features

### 🖥️ **Frontend (Next.js 15 + PWA)**
* **Progressive Web App** - Install as native app on iOS/Android with custom logo
* **Mobile-First Responsive** - Hamburger navigation, touch-friendly interface
* **Professional Dashboard** - CoinMarketCap-inspired design with tab navigation
* **Real-time Price Updates** - Live WebSocket data every 2 seconds
* **Advanced Alert Management** - Complete CRUD system with Supabase integration
* **Professional Trading Charts** - TradingView lightweight-charts integration
  * Interactive candlestick and line charts with professional styling
  * Smart auto-scroll behavior with manual exploration capability
  * Zoom, pan, and historical data browsing without interruption
  * Industry-standard chart controls and visual indicators
* **Toast Notifications** - Success/error messages for all operations
* **Market Overview** - Market cap, volume, Fear & Greed index
* **Price Change Indicators** - Trending arrows and percentage changes
* **Connection Status** - Real-time backend connectivity monitoring
* **Cross-Device Compatibility** - Seamless experience on all screen sizes
* **Radix UI Components** - Modern, accessible UI primitives
* **shadcn/ui Design System** - Consistent, beautiful components
* **SEO Optimized** - Complete metadata, Open Graph, Twitter cards
* **Offline Support** - Service worker for offline functionality

### �️ **Database (Supabase PostgreSQL)**
* **Authentication System** - Sign up, sign in, demo accounts
* **Row Level Security** - User data protection and privacy
* **Real-time Subscriptions** - Live updates when alerts change
* **Alert Management** - Complete CRUD operations for price alerts
* **Profile Management** - User profiles and preferences
* **Alert Conditions** - Complex price and percentage-based conditions
* **Notification Settings** - Email, SMS, push notification preferences
* **Alert History** - Complete logs of triggered alerts
* **Price History Cache** - Historical price data storage

### �🔧 **Backend (FastAPI on Render)**
* **Real-time Data Streaming** - Binance WebSocket integration for 11+ cryptocurrencies
* **Smart Alert System** - Price target and percentage-based alert monitoring
* **Voice Alert System** - Twilio integration for phone notifications when alerts trigger
* **RESTful API** - Clean endpoints for price data and alert management
* **WebSocket Support** - Real-time price streaming to frontend
* **CORS Support** - Proper frontend-backend communication
* **Auto-documentation** - Swagger/OpenAPI docs at `/docs`
* **Production Deployment** - Hosted on Render with auto-scaling

---

## � **Professional Trading Charts** *(Latest Update)*

We've completely upgraded our charting system with **TradingView lightweight-charts** integration, providing professional-grade market analysis tools:

### 🎯 **Advanced Chart Features**
* **Professional Styling** - Industry-standard TradingView charts with dark/light themes
* **Multiple Chart Types** - Interactive candlestick and line charts
* **Smart Navigation** - Intelligent auto-scroll with manual exploration capability
* **Historical Analysis** - Zoom, pan, and browse historical data without interruption
* **Real-time Updates** - Live price data updates while preserving user navigation
* **Performance Optimized** - Handles thousands of data points with 60+ FPS rendering

### 🎮 **Interactive Controls**
* **📍 Auto-Scroll Mode** - Automatically follows latest price movements (default)
* **🔒 Manual Mode** - Preserves scroll position for historical analysis
* **Fit Button** - Instantly view all available data and re-enable auto-scroll
* **Reset Button** - Return to TradingView's default time scale settings
* **Visual Indicators** - Clear feedback showing current scroll behavior

### ⚡ **Technical Improvements**
* **Data Validation Pipeline** - Comprehensive filtering prevents invalid data errors
* **Series Type Safety** - Robust validation ensures proper chart rendering
* **Memory Efficient** - Optimized data transformation and caching
* **Error Resilience** - Graceful handling of malformed or missing data
* **Mobile Responsive** - Touch-friendly interactions on all devices

### 🚀 **User Experience**
* **Seamless Exploration** - Scroll through price history without being pulled back to current time
* **Smart Defaults** - Automatically detects user intent and adapts behavior
* **One-Click Toggle** - Easy switching between real-time monitoring and historical analysis
* **Professional Interface** - Trading platform-quality charts and controls

---

## �📂 Project Structure

```
CryptoAlarm/
├── backend/                    # FastAPI Backend (Deployed on Render)
│   ├── app/
│   │   ├── main.py            # FastAPI entry point + WebSocket + Alert APIs
│   │   ├── models.py          # Pydantic models for alerts and data validation
│   │   ├── alert_logic.py     # Alert management and condition checking
│   │   ├── alerts.py          # Voice alert logic (Twilio)
│   │   ├── binance_client.py  # Binance WebSocket client
│   │   ├── twilio_client.py   # Twilio voice call client
│   │   ├── config.py          # Configuration management
│   │   └── __init__.py
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/                   # Next.js 15 PWA Frontend
│   ├── app/
│   │   ├── page.js            # Homepage with responsive navigation
│   │   ├── layout.js          # App layout with PWA metadata + ToastProvider
│   │   ├── globals.css        # CoinMarketCap-inspired theme + mobile styles
│   │   ├── dashboard/
│   │   │   ├── page.js        # Main dashboard with tab navigation
│   │   │   └── alerts/
│   │   │       └── page.js    # Dedicated alerts management page
│   │   └── premium/
│   │       └── page.js        # Premium plans page
│   ├── components/
│   │   ├── AlertManagerNew.js # Advanced Supabase-powered alert management
│   │   ├── PriceChart.tsx     # Professional TradingView charts with smart scroll behavior
│   │   ├── QuickAuth.js       # Authentication component
│   │   ├── DebugInfo.js       # System debugging and testing
│   │   ├── InstallPrompt.js   # PWA install prompt component
│   │   └── ui/                # shadcn/ui + Radix UI components
│   │       ├── button.js
│   │       ├── card.js
│   │       ├── badge.js
│   │       ├── alert.js
│   │       ├── dialog.js      # Radix UI modal dialogs
│   │       ├── input.js       # Form inputs
│   │       ├── select.js      # Radix UI dropdown selects
│   │       ├── tabs.js        # Tab navigation
│   │       └── toast.js       # Toast notification system
│   ├── lib/
│   │   ├── alertService.js    # Supabase alert CRUD operations
│   │   ├── authService.js     # Supabase authentication
│   │   ├── supabase.js        # Supabase client configuration
│   │   ├── AuthContext.js     # React auth context provider
│   │   ├── api.js             # Axios backend API client
│   │   └── backendIntegration.js # Backend sync utilities
│   ├── public/
│   │   ├── cryptoAlarmLogo.png # Custom app logo
│   │   ├── manifest.json      # PWA manifest
│   │   ├── sw.js              # Service worker
│   │   ├── sitemap.xml        # SEO sitemap
│   │   ├── robots.txt         # Search engine instructions
│   │   └── browserconfig.xml  # Windows tile config
│   ├── lib/
│   │   ├── api.js             # Axios API client
│   │   └── utils.js           # Utility functions
│   ├── package.json           # Node.js dependencies
│   └── components.json        # shadcn/ui configuration
│
├── client/                     # React + TypeScript + Vite Frontend (Current)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertManager.tsx    # Migrated TypeScript alert management
│   │   │   ├── PriceChart.tsx      # TradingView professional charts
│   │   │   ├── AuthForm.tsx        # Authentication components
│   │   │   └── ui/                 # shadcn/ui component library
│   │   ├── lib/
│   │   │   ├── AlertService.ts     # TypeScript alert service
│   │   │   ├── authService.ts      # Supabase authentication
│   │   │   └── supabase.ts         # Supabase client
│   │   ├── pages/                  # Page components
│   │   └── App.tsx                 # Main application
│   ├── package.json               # Vite + React dependencies
│   └── vite.config.ts             # Vite configuration
│
├── docs/                       # Documentation
└── README.md                   # This file
```

---

## � Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Twilio Account** (for voice alerts)

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/CryptoAlarm.git
cd CryptoAlarm
```

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install Node.js dependencies
npm install

# Install shadcn/ui dependencies (if needed)
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
```

---

## ⚙️ Tech Stack

### Backend Dependencies
```python
fastapi              # Modern Python web framework
uvicorn             # ASGI server
python-dotenv       # Environment variable management
twilio              # Voice call API
websockets          # Real-time WebSocket connections
pydantic            # Data validation and settings management
uuid                # Unique identifier generation for alerts
datetime            # Timestamp management for alerts
```

### Frontend Dependencies
```json
{
  "next": "15.5.4",                      // React framework with Turbopack
  "react": "19.1.0",                     // UI library
  "tailwindcss": "^4",                   // CSS framework
  "axios": "^1.12.2",                    // HTTP client for backend API
  "@supabase/supabase-js": "^2.75.0",    // Supabase client library
  "lightweight-charts": "^5.0.9",        // TradingView professional charts (~35KB)
  "@radix-ui/react-dialog": "^1.1.15",   // Modal primitives
  "@radix-ui/react-select": "^2.2.6",    // Select primitives
  "@radix-ui/react-slot": "^1.2.3",      // shadcn/ui primitives
  "@radix-ui/react-tabs": "^1.1.13",     // Tab navigation primitives
  "class-variance-authority": "^0.7.1",   // CSS utilities
  "clsx": "^2.1.1",                      // Class name utility
  "tailwind-merge": "^3.3.1",            // Tailwind class merger
  "lucide-react": "^0.545.0"             // Icon library
}
```

---

## 🔑 Environment Configuration

### 1. Supabase Setup (Required)

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Get Credentials**: Copy your project URL and anon key from Settings > API
3. **Run Database Schema**: Execute the SQL schema from `supabase-schema-complete.sql` in Supabase SQL Editor

### 2. Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```ini
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend Configuration (Optional - for price data)
NEXT_PUBLIC_BACKEND_URL=https://cryptoalarm.onrender.com
NEXT_PUBLIC_API_URL=https://cryptoalarm.onrender.com
NEXT_PUBLIC_WS_URL=wss://cryptoalarm.onrender.com
```

### 3. Backend Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```ini
# Twilio Voice Alert Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here  
TWILIO_PHONE_NUMBER=+1234567890        # Your Twilio phone number
MY_PHONE_NUMBER=+1987654321            # Your personal phone number

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

### 🔧 Getting Supabase Credentials

1. **Sign up**: Go to [supabase.com](https://supabase.com) and create account
2. **Create Project**: Click "New project" and set up your database
3. **Get API Keys**: Go to Settings > API and copy:
   - Project URL (anon key)
   - API URL
4. **Set up Database**: Run the complete schema from `supabase-schema-complete.sql`

### 🔧 Getting Twilio Credentials (Optional)

1. Sign up at [Twilio.com](https://www.twilio.com/)
2. Get your **Account SID** and **Auth Token** from the dashboard
3. Purchase a **phone number** for outbound calls
4. Add your personal phone number to receive alerts

---

## ▶️ Running the Application

### Development Mode

#### Start Frontend Only (Recommended)
```bash
cd frontend
npm install
npm run dev
```

**Frontend will run at:** [http://localhost:3000](http://localhost:3000)

> **Note**: The frontend uses Supabase for alert management and the hosted backend at https://cryptoalarm.onrender.com for price data. No local backend setup required!

#### Full Development Setup (Backend + Frontend)

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Production URLs:**
- Backend API: [https://cryptoalarm.onrender.com](https://cryptoalarm.onrender.com)
- Backend Docs: [https://cryptoalarm.onrender.com/docs](https://cryptoalarm.onrender.com/docs)
- Live Prices: [https://cryptoalarm.onrender.com/prices](https://cryptoalarm.onrender.com/prices)

---

## 🎯 Features Overview

### 🔔 Alert Management System (Supabase)
- **Create Alerts**: Set price targets or percentage-based alerts
- **Real-time Updates**: Live sync across all devices
- **CRUD Operations**: Create, read, update, delete alerts
- **User Authentication**: Secure sign-up/sign-in with demo mode
- **Profile Management**: User preferences and settings
- **Toast Notifications**: Success/error feedback for all operations

### 📊 Price Monitoring (Backend API)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/prices` | Get current crypto prices for 11+ assets |
| `GET` | `/test-alert` | Trigger a test voice alert |
| `GET` | `/docs` | Interactive Swagger API documentation |

### 🔧 System Features
- **PWA Installation**: Install as native app on mobile/desktop
- **Offline Support**: Works without internet connection
- **Responsive Design**: Mobile-first with tablet/desktop optimization
- **Dark Theme**: Professional CoinMarketCap-inspired design
- **Real-time Status**: Connection monitoring and health checks

### Example API Responses

**Price Data (`GET /prices`)**
```json
{
  "prices": {
    "BTCUSDT": 67234.56,
    "ETHUSDT": 2543.21,
    "SOLUSDT": 138.45,
    "XRPUSDT": 0.52,
    "BNBUSDT": 245.67,
    "DOGEUSDT": 0.08,
    "ADAUSDT": 0.42,
    "SHIBUSDT": 0.000018,
    "USDCUSDT": 1.0001,
    "SUIUSDT": 1.85,
    "PEPEUSDT": 0.00001234
  }
}
```

**Create Alert (`POST /alerts`)**
```json
{
  "symbol": "BTC",
  "alert_type": "PRICE_TARGET",
  "direction": "BELOW",
  "target_price": 95000.00,
  "phone_number": "+1234567890"
}
```

**Alert Response**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "symbol": "BTC",
  "alert_type": "PRICE_TARGET",
  "direction": "BELOW",
  "target_price": 95000.00,
  "status": "ACTIVE",
  "phone_number": "+1234567890",
  "created_at": "2025-10-10T15:30:00Z"
}
```

---

## 🎨 Design Features

### Modern Design System
- **Dark Professional Theme**: Deep navy (`#0B1426`) background with blue accents (`#3861FB`)
- **Mobile-First Responsive**: Hamburger menu, touch-friendly 44px minimum targets
- **Modern Cards**: Glassmorphism effects with proper contrast and spacing
- **Color Coding**: Green for gains, red for losses, blue for actions
- **Typography**: Clean, scalable font hierarchy for all screen sizes
- **PWA Branding**: Custom logo integration across all platforms

### UI Components (shadcn/ui)
- **Responsive Navigation**: Desktop menu bar + mobile hamburger menu
- **Cards**: Professional data containers with mobile optimization
- **Buttons**: Consistent interaction elements with touch targets
- **Badges**: Status indicators and labels with proper contrast
- **Alerts**: User feedback and notifications with mobile formatting
- **Icons**: Lucide React icon library with responsive sizing
- **Install Prompt**: Native-style PWA installation banner

### Mobile Experience
- **Hamburger Navigation**: Clean mobile menu with search integration
- **Touch Optimization**: Proper spacing and target sizes for mobile
- **Responsive Typography**: Scalable text for different screen sizes
- **Mobile Tables**: Optimized cryptocurrency price display
- **Auto-Close Menu**: Smart menu behavior on resize and outside clicks

---

## 🚀 Features in Action

### 📊 **Dashboard Tab**
1. **Real-time Monitoring**: Live price updates every 2 seconds for 11 cryptocurrencies
2. **Professional Dashboard**: Market overview with key metrics and trending indicators
3. **Price Change Animations**: Visual feedback for price movements with color coding
4. **Connection Status**: Visual indicator of backend connectivity
5. **Responsive Grid**: Organized display of all monitored assets

### 🔔 **Alerts Tab**
1. **Smart Alert Creation**: Choose between price targets or percentage-based alerts
2. **Multi-Asset Support**: Set alerts for BTC, ETH, BNB, SOL, XRP, DOGE, ADA, SHIB, USDC, SUI, PEPE
3. **Voice Call Notifications**: Automatic phone calls when alert conditions are met
4. **Alert Management**: View, edit, and delete existing alerts with status tracking
5. **Form Validation**: Intuitive UI with proper input validation and error handling

### 📱 **User Experience**
- **Tab Navigation**: Seamless switching between Dashboard and Alerts
- **Professional UI**: CoinMarketCap-inspired design with dark theme
- **Real-time Updates**: Live status updates for alerts and prices
- **Mobile Responsive**: Works perfectly on all device sizes

---

## � Progressive Web App (PWA) Features

### 🚀 **Native App Experience**
- **Install on Home Screen**: Add CryptoAlarm to your phone's home screen like a native app
- **Custom App Icon**: Your `cryptoAlarmLogo.png` displays properly on iOS and Android
- **Fullscreen Mode**: Runs in standalone mode without browser UI
- **Offline Support**: Core functionality available without internet connection
- **Fast Loading**: Service worker caches important resources for instant access

### 🔧 **Cross-Platform Support**
- **iOS (Safari)**: Full PWA support with proper icon and splash screens
- **Android (Chrome)**: Native install prompts and adaptive icons
- **Desktop**: Install on Windows, macOS, and Linux through supported browsers
- **Windows Mobile**: Tile support with custom colors and icons

### 📲 **Installation Instructions**

**On Android:**
1. Open Chrome and visit your CryptoAlarm site
2. Look for "Add to Home Screen" banner or tap menu → "Install App"
3. Confirm installation - your custom logo will appear on home screen

**On iPhone:**
1. Open Safari and visit your CryptoAlarm site  
2. Tap the Share button (square with arrow)
3. Select "Add to Home Screen"
4. Confirm - your app icon will be added with "CryptoAlarm" name

**On Desktop:**
1. Visit site in Chrome, Edge, or other PWA-supporting browser
2. Look for install icon in address bar or use menu → "Install CryptoAlarm"
3. App will be added to your applications folder

### 🎯 **PWA Technical Features**
- **Web App Manifest**: Comprehensive configuration for all platforms
- **Service Worker**: Offline caching and background functionality
- **App Shortcuts**: Quick access to Dashboard and Alerts from home screen
- **Theme Integration**: Matches your app's dark blue theme (#3861FB)
- **Responsive Icons**: Multiple sizes (72x72 to 512x512) for all devices
- **Maskable Icons**: Android adaptive icon support
- **Install Prompt**: Custom installation banner with your branding

---

## �🔮 Future Roadmap

### Phase 1 (Completed ✅)
- ✅ Real-time price monitoring (11 cryptocurrencies)
- ✅ Voice alert system with Twilio integration
- ✅ Professional UI design with CoinMarketCap theme
- ✅ WebSocket integration for live data
- ✅ Complete alert management system
- ✅ Price target and percentage-based alerts
- ✅ Alert CRUD operations with REST API
- ✅ Tab-based navigation (Dashboard + Alerts)
- ✅ **Progressive Web App (PWA)** - Install as native app
- ✅ **Mobile-First Responsive Design** - Hamburger navigation
- ✅ **Custom Logo Integration** - Branded across all platforms
- ✅ **SEO Optimization** - Complete metadata and social sharing
- ✅ **Cross-Platform Compatibility** - iOS, Android, desktop PWA support
- ✅ **Offline Functionality** - Service worker implementation
- ✅ **Install Prompt** - Native-style app installation

### Phase 2 (Planned)
- 🔄 Alert history and notification logs
- 🔄 Email/SMS backup notifications
- 🔄 Advanced alert conditions (multiple cryptocurrencies)
- 🔄 User authentication and personal alert libraries

### Phase 3 (Future)
- ✅ **Price charts and technical indicators** - *COMPLETED: TradingView integration*
- 📱 Mobile app (React Native)
- 🗃️ Database integration (PostgreSQL)
- 👥 Multi-user support
- 🔔 Advanced alert conditions (RSI, moving averages)

---

## � Deployment

### Production Environment
This project is deployed using modern cloud infrastructure:

- **Backend**: FastAPI deployed on Render at `https://cryptoalarm.onrender.com`
- **Database**: Supabase PostgreSQL with Row Level Security
- **Frontend**: Next.js app with PWA capabilities (deployable on Vercel, Netlify, etc.)

### Deploying Backend to Render

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Connect Repository**: 
   - Link your GitHub repository
   - Select the backend folder as root directory

3. **Configure Build Settings**:
   ```yaml
   # render.yaml (optional)
   services:
     - type: web
       name: cryptoalarm-backend
       runtime: python3
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
       healthCheckPath: /prices
   ```

4. **Environment Variables** (Add in Render dashboard):
   ```
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

### Deploying Frontend

1. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Deploy to Vercel** (Recommended):
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Or Deploy to Netlify**:
   ```bash
   npm run build
   # Upload dist folder to Netlify
   ```

### Custom Domain Setup
- Configure custom domain in your hosting platform
- Update CORS settings in FastAPI backend if needed
- Ensure HTTPS is enabled for PWA functionality

---

## �🛠️ Development

### Project Philosophy
- **Clean Architecture**: Separation of concerns between frontend/backend
- **Modern Stack**: Latest versions of FastAPI and Next.js
- **User Experience**: Intuitive, professional interface design
- **Performance**: Optimized for real-time data streaming
- **Scalability**: Built to handle multiple users and assets

### Contributing
We welcome contributions! To get started:

1. Fork the repository from [GitHub](https://github.com/yourusername/cryptoAlarm-Version-2)
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with a detailed description

Please ensure your code follows our standards:
- Follow existing code style and formatting
- Add appropriate comments for complex logic
- Test your changes with both development and production environments
- Update documentation if needed

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Binance API** - Real-time cryptocurrency data
- **Twilio** - Voice call infrastructure  
- **shadcn/ui** - Beautiful, accessible UI components
- **CoinMarketCap** - Design inspiration
- **FastAPI** - Modern Python web framework
- **Next.js** - React framework for production

---

## � **Latest Updates & Changelog**

### 🚀 **v2.1.0 - Professional Trading Charts** *(October 2025)*

#### ✨ **Major Features Added**
- **🔥 TradingView Integration**: Replaced custom charts with professional TradingView lightweight-charts
- **📊 Smart Auto-Scroll**: Intelligent chart navigation that preserves user exploration
- **🎯 Interactive Controls**: Professional chart controls with visual feedback
- **📱 Mobile Optimization**: Touch-friendly chart interactions on all devices

#### 🛠️ **Technical Improvements**
- **Data Validation Pipeline**: Comprehensive filtering prevents chart rendering errors
- **Performance Optimization**: 60+ FPS rendering with thousands of data points
- **Memory Efficiency**: Optimized data transformation and caching
- **Error Resilience**: Graceful handling of malformed or missing price data

#### 🎨 **User Experience Enhancements**
- **Seamless History Browsing**: Scroll through historical data without interruption
- **Visual Mode Indicators**: Clear feedback showing current chart behavior
- **One-Click Toggle**: Easy switching between real-time and exploration modes
- **Professional Styling**: Industry-standard chart appearance and interactions

#### 🔧 **Developer Experience**
- **TypeScript Integration**: Full type safety for chart components
- **Component Architecture**: Reusable PriceChart.tsx with comprehensive API
- **Bundle Optimization**: Added only ~35KB for professional-grade charting
- **API Documentation**: Complete interface definitions and usage examples

---

## �📞 Support & Troubleshooting

### General Setup
If you have any questions or need help setting up the project:

1. Check the [Issues](https://github.com/yourusername/cryptoAlarm-Version-2/issues) page for common problems
2. Review the API documentation at [cryptoalarm.onrender.com/docs](https://cryptoalarm.onrender.com/docs)
3. Ensure all environment variables are properly configured (see `.env.example` files)
4. Verify Supabase and Twilio credentials are valid

### PWA & Mobile Issues

**PWA Not Installing:**
- Ensure HTTPS is enabled (required for PWA)
- Check that `manifest.json` is accessible at `/manifest.json`
- Verify service worker is registered (check browser dev tools → Application → Service Workers)

**Mobile Menu Not Working:**
- Clear browser cache and reload
- Check that JavaScript is enabled
- Ensure viewport meta tag is properly set

**Logo Not Displaying:**
- Verify `cryptoAlarmLogo.png` exists in `/public/` folder
- Check image file size (should be square, recommended 512x512px)
- Ensure proper file permissions

**Mobile Responsiveness Issues:**
- Test on actual devices, not just browser dev tools
- Check for horizontal scrolling (should be prevented)
- Verify touch targets are at least 44px minimum

### Performance Tips
- **Mobile**: Enable "Add to Home Screen" for best performance
- **Desktop**: Install PWA version instead of bookmarking
- **Offline**: Core functionality works without internet after first load
- **Updates**: Refresh app or reinstall to get latest PWA updates

**Made with ❤️ for the crypto community**