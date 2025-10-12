# 🚀 CryptoAlarm v2.0 - Complete Setup Guide

## 📋 Overview

CryptoAlarm v2.0 is now a full-stack cryptocurrency monitoring platform with:
- **Frontend**: Next.js 15 with React 19, Tailwind CSS, PWA support
- **Database**: Supabase with PostgreSQL, Row Level Security, Real-time subscriptions
- **Backend**: Python FastAPI for alert monitoring and WebSocket connections
- **Authentication**: Supabase Auth with email/password and social providers
- **Real-time**: WebSocket connections for live price updates and alerts

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │◄──►│   Supabase DB    │    │  Python Backend │
│  (Frontend UI)  │    │   (PostgreSQL)   │◄──►│ (Alert Monitor) │
│                 │    │                  │    │                 │
│ • Alert Manager │    │ • User Profiles  │    │ • Price Monitor │
│ • Auth Forms    │    │ • Alerts Storage │    │ • WebSocket     │
│ • Dashboard     │    │ • Real-time Sub  │    │ • Notifications │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. **Create Supabase Project**:
   ```bash
   # Go to https://supabase.com and create new project
   # Note your Project URL and anon key
   ```

2. **Run Database Schema**:
   - Open Supabase SQL Editor
   - Copy contents from `docs/database-schema.sql`
   - Execute to create all tables and policies

3. **Configure Environment**:
   ```bash
   cd frontend
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

### 2. Frontend Setup

```bash
# Install dependencies
cd frontend
npm install @supabase/supabase-js @radix-ui/react-tabs

# Start development server
npm run dev
```

### 3. Backend Setup (Optional - for real monitoring)

```bash
# Install Python dependencies  
cd backend
pip install -r requirements.txt

# Configure backend settings
cp config.py.example config.py
# Edit config.py with your settings

# Start backend services
python main.py
```

## 🛠️ Complete Setup Instructions

### Frontend Configuration

1. **Environment Variables** (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8001
   ```

2. **Enable PWA Features**:
   - Use `layout-new.js` for PWA-enabled layout
   - Manifest and service worker already configured
   - Icons and offline support included

3. **Update Main Page**:
   - Replace `app/page.js` with `app/dashboard-new.js` for database integration
   - Or integrate `AlertManagerNew` component into existing pages

### Database Features

#### Tables Created:
- **profiles**: User information and preferences  
- **alerts**: Main alerts with conditions and settings
- **alert_conditions**: Flexible condition system (price, %, volume, indicators)
- **alert_notifications**: Multi-channel notifications (email, SMS, push, webhook)
- **alert_logs**: Complete history of all alert triggers
- **price_history**: Cached price data for analysis

#### Security Features:
- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Email/password with email confirmation
- **Real-time**: Secure WebSocket subscriptions
- **API Security**: Proper public/private key usage

### Backend Integration

#### Alert Monitoring System:
```python
# Example: How backend monitors Supabase alerts
from lib.backendIntegration import BackendIntegrationService

# Sync alerts from Supabase
await BackendIntegrationService.syncAlertsWithBackend()

# Start monitoring
await BackendIntegrationService.startMonitoring()
```

#### WebSocket Integration:
```javascript
// Frontend: Listen for real-time updates
import { BackendIntegrationService } from '../lib/backendIntegration'

// Connect to price feed
const ws = BackendIntegrationService.connectWebSocket()

// Listen for price updates
window.addEventListener('priceUpdate', (event) => {
  console.log('Price update:', event.detail)
})
```

## 🎯 Key Features Implemented

### ✅ Completed Features

1. **Full CRUD Alert System**:
   - Create, read, update, delete alerts
   - Multiple condition types (price, percentage, volume)
   - Real-time updates via Supabase subscriptions

2. **User Authentication**:
   - Email/password registration and login
   - User profiles with preferences
   - Secure session management

3. **Modern UI/UX**:
   - Responsive design (mobile-first)
   - PWA support with offline capabilities
   - Dark/light theme support
   - Modern component library (shadcn/ui)

4. **Database Integration**:
   - PostgreSQL with Supabase
   - Row Level Security for data isolation
   - Real-time subscriptions for live updates
   - Comprehensive logging and analytics

5. **Alert Management**:
   - Visual alert creation and editing forms
   - Alert statistics and performance tracking
   - Pause/resume alert functionality
   - Trigger history and analytics

### 🔄 Integration Points

1. **Frontend ↔ Database**:
   - `AlertService`: Complete CRUD operations
   - `AuthService`: User authentication
   - `UserService`: Profile management
   - Real-time subscriptions for live updates

2. **Frontend ↔ Backend**:
   - `BackendIntegrationService`: Sync alerts with monitoring system
   - WebSocket connections for real-time price feeds
   - Alert trigger logging and notification handling

3. **Database ↔ Backend**:
   - Backend reads active alerts from Supabase
   - Trigger events logged back to database
   - Price history cached for analysis

## 📱 Usage Guide

### Creating Your First Alert

1. **Sign Up/Login**:
   - Visit the app and create an account
   - Confirm your email address
   - Login to access the dashboard

2. **Create Alert**:
   ```
   Alert Name: "Bitcoin Price Alert"
   Symbol: BTCUSDT  
   Exchange: Binance
   Condition: Price Above $70,000
   Max Triggers: 1
   ```

3. **Monitor & Manage**:
   - View all alerts in the dashboard
   - Edit conditions as needed
   - Pause/resume alerts
   - View trigger history

### Alert Types Available

1. **Price Alerts**:
   - Price above/below threshold
   - Price between ranges

2. **Percentage Change**:
   - Percentage increase/decrease over timeframe
   - Configurable timeframes (1m to 1d)

3. **Volume Alerts**:
   - Trading volume thresholds
   - Unusual volume detection

4. **Technical Indicators** (coming soon):
   - RSI levels
   - MACD crossovers
   - Moving average touches

### Notification Options

- **Real-time Dashboard**: Instant browser notifications
- **Email Alerts**: Detailed email notifications
- **SMS Notifications**: Quick text message alerts  
- **Push Notifications**: Mobile app-style notifications
- **Webhook Integration**: Custom API endpoints

## 🔧 Advanced Configuration

### Custom Alert Conditions

```javascript
// Example: Complex multi-condition alert
const complexAlert = {
  name: "Bitcoin Breakout Alert",
  symbol: "BTCUSDT", 
  conditions: [
    {
      condition_type: "price_above",
      target_value: 70000,
      timeframe: "1h",
      operator: "AND"
    },
    {
      condition_type: "volume_above", 
      target_value: 1000,
      timeframe: "1h",
      operator: "AND"
    }
  ],
  max_triggers: 3,
  cooldown_minutes: 60
}
```

### Real-time Integration

```javascript
// Listen for alert triggers
AlertService.subscribeToAlerts((payload) => {
  if (payload.eventType === 'INSERT' && payload.table === 'alert_logs') {
    // Alert was triggered!
    showNotification('Alert Triggered!', payload.new)
  }
})
```

### Backend Monitoring

```python
# Python backend integration example
from supabase import create_client, Client
from datetime import datetime

class AlertMonitor:
    def __init__(self):
        self.supabase = create_client(url, key)
    
    async def check_alerts(self):
        # Get active alerts
        alerts = self.supabase.table('alerts').select('*').eq('is_active', True).execute()
        
        for alert in alerts.data:
            current_price = await self.get_current_price(alert['symbol'])
            
            if self.check_conditions(alert, current_price):
                await self.trigger_alert(alert, current_price)
    
    async def trigger_alert(self, alert, price):
        # Log trigger
        log_data = {
            'alert_id': alert['id'],
            'trigger_price': price,
            'trigger_conditions': alert['alert_conditions'],
            'triggered_at': datetime.now().isoformat()
        }
        
        self.supabase.table('alert_logs').insert(log_data).execute()
        
        # Send notifications
        await self.send_notifications(alert, price)
```

## 📊 Performance & Scaling

### Database Optimization

1. **Indexes**: Pre-configured for common queries
2. **RLS Policies**: Optimized for user isolation  
3. **Real-time**: Efficient WebSocket subscriptions
4. **Caching**: Price data cached for analysis

### Frontend Performance

1. **Code Splitting**: Automatic with Next.js
2. **Image Optimization**: Next.js Image component
3. **PWA Caching**: Service worker for offline access
4. **Lazy Loading**: Components loaded on demand

### Backend Scaling

1. **WebSocket Management**: Efficient connection handling
2. **Rate Limiting**: Prevent API abuse
3. **Monitoring**: Health checks and metrics
4. **Error Handling**: Graceful failure recovery

## 🚀 Deployment Guide

### Frontend (Vercel/Netlify)

1. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_production_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
   ```

2. **Build Configuration**:
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start"
     }
   }
   ```

### Database (Supabase)

1. **Production Setup**:
   - Upgrade to Supabase Pro for production usage
   - Configure custom domain
   - Set up database backups
   - Monitor usage and performance

2. **Security Checklist**:
   - Enable 2FA on Supabase account
   - Review RLS policies
   - Configure rate limiting
   - Set up monitoring alerts

### Backend (VPS/Cloud)

1. **Environment Setup**:
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Configure environment
   export SUPABASE_URL=your_url
   export SUPABASE_KEY=your_service_role_key
   
   # Start services
   python main.py
   ```

2. **Process Management**:
   ```bash
   # Use PM2 or systemd for process management
   pm2 start main.py --name cryptoalarm-backend
   ```

## 📈 Next Steps

### Immediate Tasks

1. **Configure Supabase Database**:
   - Follow `docs/Database-Setup-Guide.md`
   - Test authentication and alert creation

2. **Update Frontend**:
   - Replace main page with database-integrated version
   - Test all CRUD operations

3. **Connect Backend**:
   - Set up Python backend for monitoring
   - Configure WebSocket connections

### Future Enhancements

1. **Advanced Features** (see `docs/Advanced-Features-Roadmap.md`):
   - AI-powered trading agents
   - Technical analysis engine  
   - Social trading features
   - DeFi integration

2. **Performance Improvements**:
   - Redis caching layer
   - CDN for static assets
   - Database query optimization

3. **Mobile App**:
   - React Native app with push notifications
   - Native iOS/Android features
   - Offline-first architecture

## 🆘 Support & Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check environment variables
   - Verify Supabase project settings
   - Ensure RLS policies are correct

2. **Authentication Issues**:
   - Check email confirmation settings
   - Verify Site URL in Supabase
   - Test with different browsers

3. **Real-time Not Working**:
   - Check WebSocket connections
   - Verify subscription setup
   - Monitor browser console for errors

### Getting Help

1. **Documentation**: Check all files in `/docs`
2. **Supabase Docs**: https://supabase.com/docs  
3. **Next.js Docs**: https://nextjs.org/docs
4. **GitHub Issues**: Create issues for bugs/features

---

## 🎉 You're Ready!

Your CryptoAlarm v2.0 is now set up with:
- ✅ Modern database with Supabase
- ✅ Full CRUD alert system  
- ✅ User authentication
- ✅ Real-time updates
- ✅ PWA capabilities
- ✅ Backend integration ready

Start creating alerts and never miss a crypto opportunity again! 🚀