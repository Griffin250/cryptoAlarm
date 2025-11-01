import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home.tsx';
import Auth from './pages/Auth.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Alerts from './pages/Alerts.tsx';
import Portfolio from './pages/Portfolio.tsx';
import Profile from './pages/Profile.tsx';
import Settings from './pages/settings.tsx';
import ComingSoon from './pages/ComingSoon.tsx';
import Premium from './pages/Premium.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';
import Disclaimer from './pages/Disclaimer.tsx';
import Contact from './pages/Contact.tsx';
import Help from './pages/Help.tsx';
import NotFound from './pages/NotFound.tsx';
import CryptoDetail from './pages/CryptoDetail.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/crypto/:symbol" element={
              <ProtectedRoute>
                <CryptoDetail />
              </ProtectedRoute>
            } />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            } />
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
