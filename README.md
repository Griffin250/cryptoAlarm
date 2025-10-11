

# 🚨 CryptoAlarm - Never Miss a Crypto Move

A **professional full-stack PWA application** that monitors cryptocurrency prices in real-time and triggers **voice alerts** when price targets are reached. Built with **FastAPI + Next.js** featuring a **CoinMarketCap-inspired design** with **mobile-first responsive UI**.

🔥 **Live Demo**: Real-time price tracking with professional UI  
📞 **Voice Alerts**: Phone call notifications via Twilio  
⚡ **WebSocket**: Live data streaming from Binance  
🎨 **Modern UI**: shadcn/ui components with dark theme  
📱 **PWA Ready**: Install as native app on iOS & Android  
🌐 **Responsive**: Mobile-optimized with hamburger navigation  
🚀 **SEO Optimized**: Complete metadata and social sharing  

---

## ✨ Features

### 🖥️ **Frontend (Next.js + PWA)**
* **Progressive Web App** - Install as native app on iOS/Android with custom logo
* **Mobile-First Responsive** - Hamburger navigation, touch-friendly interface
* **Professional Dashboard** - CoinMarketCap-inspired design with tab navigation
* **Real-time Price Updates** - Live WebSocket data every 2 seconds
* **Alert Management System** - Complete UI for creating and managing price alerts
* **Market Overview** - Market cap, volume, Fear & Greed index
* **Price Change Indicators** - Trending arrows and percentage changes
* **Connection Status** - Real-time backend connectivity monitoring
* **Cross-Device Compatibility** - Seamless experience on all screen sizes
* **shadcn/ui Components** - Modern, accessible UI components
* **SEO Optimized** - Complete metadata, Open Graph, Twitter cards
* **Offline Support** - Service worker for offline functionality

### 🔧 **Backend (FastAPI)**
* **Real-time Data Streaming** - Binance WebSocket integration for 11 cryptocurrencies
* **Smart Alert System** - Price target and percentage-based alert monitoring
* **Voice Alert System** - Twilio integration for phone notifications when alerts trigger
* **RESTful API** - Clean endpoints for price data and alert management
* **Alert CRUD Operations** - Complete create, read, update, delete for alerts
* **CORS Support** - Proper frontend-backend communication
* **Auto-documentation** - Swagger/OpenAPI docs included

---

## 📂 Project Structure

```
CryptoAlarm/
├── backend/                    # FastAPI Backend
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
├── frontend/                   # Next.js PWA Frontend
│   ├── app/
│   │   ├── page.js            # Homepage with responsive navigation
│   │   ├── layout.js          # App layout with PWA metadata
│   │   ├── globals.css        # CoinMarketCap-inspired theme + mobile styles
│   │   ├── dashboard/
│   │   │   └── page.js        # Main dashboard with mobile menu
│   │   └── premium/
│   │       └── page.js        # Premium plans page
│   ├── components/
│   │   ├── AlertManager.js    # Complete alert management interface
│   │   ├── InstallPrompt.js   # PWA install prompt component
│   │   └── ui/                # shadcn/ui components
│   │       ├── button.js
│   │       ├── card.js
│   │       ├── badge.js
│   │       ├── alert.js
│   │       ├── dialog.js      # Modal dialogs
│   │       ├── input.js       # Form inputs
│   │       └── select.js      # Dropdown selects
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
  "next": "15.5.4",                    // React framework
  "react": "19.1.0",                   // UI library
  "tailwindcss": "^4",                 // CSS framework
  "axios": "^1.12.2",                  // HTTP client
  "@radix-ui/react-slot": "^1.0.0",    // shadcn/ui primitives
  "class-variance-authority": "^0.7.0", // CSS utilities
  "clsx": "^2.0.0",                    // Class name utility
  "tailwind-merge": "^2.0.0",          // Tailwind class merger
  "lucide-react": "^0.300.0"          // Icon library
}
```

---

## 🔑 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```ini
# Twilio Voice Alert Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here  
TWILIO_PHONE_NUMBER=+1234567890        # Your Twilio phone number
MY_PHONE_NUMBER=+1987654321            # Your personal phone number

# API Configuration (optional)
API_HOST=127.0.0.1
API_PORT=8000
```

### Frontend Configuration

Create a `.env.local` file in the `frontend/` directory:

```ini
# Backend API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 🔧 Getting Twilio Credentials

1. Sign up at [Twilio.com](https://www.twilio.com/)
2. Get your **Account SID** and **Auth Token** from the dashboard
3. Purchase a **phone number** for outbound calls
4. Add your personal phone number to receive alerts

---

## ▶️ Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
uvicorn app.main:app --reload
-twilio_bypass: python -m uvicorn app.main:app --reload

```

**Backend will run at:**
- API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Live Prices: [http://127.0.0.1:8000/prices](http://127.0.0.1:8000/prices)

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

**Frontend will run at:**
- Dashboard: [http://localhost:3000](http://localhost:3000)

---

## 🎯 API Endpoints

### Price Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/prices` | Get current crypto prices for all monitored assets |
| `GET` | `/test-alert` | Trigger a test voice alert |
| `GET` | `/docs` | Interactive API documentation |

### Alert Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/alerts` | Create a new price or percentage alert |
| `GET` | `/alerts` | Get all user alerts with status |
| `GET` | `/alerts/{alert_id}` | Get specific alert details |
| `PUT` | `/alerts/{alert_id}/status` | Update alert status (active/cancelled) |
| `DELETE` | `/alerts/{alert_id}` | Delete a specific alert |

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
- 📊 Price charts and technical indicators
- 📱 Mobile app (React Native)
- 🗃️ Database integration (PostgreSQL)
- 👥 Multi-user support
- 🔔 Advanced alert conditions (RSI, moving averages)

---

## 🛠️ Development

### Project Philosophy
- **Clean Architecture**: Separation of concerns between frontend/backend
- **Modern Stack**: Latest versions of FastAPI and Next.js
- **User Experience**: Intuitive, professional interface design
- **Performance**: Optimized for real-time data streaming
- **Scalability**: Built to handle multiple users and assets

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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

## 📞 Support & Troubleshooting

### General Setup
If you have any questions or need help setting up the project:

1. Check the [Issues](https://github.com/yourusername/CryptoAlarm/issues) page
2. Review the API documentation at `/docs` 
3. Ensure all environment variables are properly configured
4. Verify Twilio credentials and phone number setup

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