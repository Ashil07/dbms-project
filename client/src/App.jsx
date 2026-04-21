import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Browse from './pages/Browse'
import RentPage from './pages/RentPage'
import UploadItem from './pages/UploadItem'
import PaymentPage from './pages/PaymentPage'
import RentalsPage from './pages/RentalsPage'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#f0f0f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.82rem',
              letterSpacing: '0.02em',
            },
            success: { iconTheme: { primary: '#2d7a4f', secondary: '#fff' } },
            error: { iconTheme: { primary: '#c0392b', secondary: '#fff' } },
          }}
        />
        <Navbar />
        <main style={{ paddingTop: 'var(--nav-h)' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/browse" element={
              <PrivateRoute>
                <Browse />
              </PrivateRoute>
            } />
            <Route path="/rent" element={
              <PrivateRoute>
                <RentPage />
              </PrivateRoute>
            } />
            <Route path="/upload" element={
              <PrivateRoute>
                <UploadItem />
              </PrivateRoute>
            } />
            <Route path="/payment" element={
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            } />
            <Route path="/rentals" element={
              <PrivateRoute>
                <RentalsPage />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
