import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (formData.email && formData.password && formData.phone) {
        // Generate a simple numeric user ID based on email hash
        const generateUserId = (email) => {
          const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
          return (hash % 100000) + 1 // Keep it within reasonable range
        }
        
        const userId = generateUserId(formData.email)
        
        login()
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userPhone', formData.phone)
        localStorage.setItem('userId', userId.toString())
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        toast.error('Please fill in all fields')
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginVisual}>
        <div className={styles.loginVisualText}>
          <h2 className={styles.loginVisualTitle}>Welcome<br />back.</h2>
          <p className={styles.loginVisualSub}>Premium fashion rental, made simple.</p>
        </div>
      </div>
      <div className={styles.loginFormSide}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <span className={styles.loginEye}>ThreadRent</span>
            <h1 className={styles.loginTitle}>Sign In</h1>
          </div>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={styles.formInput} placeholder="your@email.com" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={styles.formInput} placeholder="Your password" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={styles.formInput} placeholder="+91 98765 43210" required />
            </div>
            <button type="submit" disabled={loading} className={styles.loginButton}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className={styles.loginFooter}>
            <p className={styles.footerText}>
              No account?{' '}
              <button className={styles.linkButton} onClick={() => navigate('/signup')}>Create one</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
