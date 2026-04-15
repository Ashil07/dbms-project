import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
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
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#f0eeff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.88rem',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-h)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/upload" element={<UploadItem />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
