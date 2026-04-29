import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { createUser } from '../api/axios'
import api from '../api/axios'
import styles from './Signup.module.css'

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
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
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        setLoading(false)
        return
      }

      // Validate password strength
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      if (formData.name && formData.email && formData.password) {
        await createUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        })

        // Auto-login after signup
        const loginRes = await api.post('/auth/login', {
          email: formData.email.trim(),
          password: formData.password,
        })
        const { token, user } = loginRes.data.data
        login(token, user)
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('userName', user.name)
        localStorage.setItem('userId', String(user.id))
        toast.success('Welcome to ThreadRent!')
        navigate('/dashboard')
      } else {
        toast.error('Please fill in all fields')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupVisual}>
        <div className={styles.signupVisualText}>
          <h2 className={styles.signupVisualTitle}>Join the<br />community.</h2>
          <p className={styles.signupVisualSub}>Rent premium fashion. Wear more, own less.</p>
        </div>
      </div>
      <div className={styles.signupFormSide}>
        <div className={styles.signupCard}>
          <div className={styles.signupHeader}>
            <span className={styles.signupEye}>ThreadRent</span>
            <h1 className={styles.signupTitle}>Create Account</h1>
          </div>
          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={styles.formInput} placeholder="Your name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={styles.formInput} placeholder="your@email.com" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={styles.formInput} placeholder="Min. 6 characters" required />
              <span className={styles.passwordRequirements}>At least 6 characters</span>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={styles.formInput} placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className={styles.signupButton}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <div className={styles.signupFooter}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <button className={styles.linkButton} onClick={() => navigate('/login')}>Sign In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
