import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from './Dashboard.module.css'

export default function Profile() {
  const { isLoggedIn } = useAuth()
  const [userStats, setUserStats] = useState({
    totalRentals: 0,
    activeRentals: 0,
    totalSpent: 0,
    itemsListed: 0
  })

  // Generate a mock user ID based on email (in real app, this would come from backend)
  const generateUserId = (email) => {
    if (!email) return 'USR000000'
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `USR${String(hash).padStart(6, '0').slice(-6)}`
  }

  const userEmail = localStorage.getItem('userEmail') || 'user@example.com'
  const userPhone = localStorage.getItem('userPhone') || '+91 98765 43210'
  const userId = generateUserId(userEmail)

  useEffect(() => {
    // Mock user stats - in real app, fetch from API
    setUserStats({
      totalRentals: Math.floor(Math.random() * 20) + 5,
      activeRentals: Math.floor(Math.random() * 3) + 1,
      totalSpent: Math.floor(Math.random() * 50000) + 10000,
      itemsListed: Math.floor(Math.random() * 10) + 2
    })
  }, [])

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Please log in to view your profile</h1>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Profile</h1>
        <p>Manage your account and view your rental history</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Card */}
        <div className={styles.card} style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {userEmail?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>User Profile</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{userEmail}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>User ID</p>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{userId}</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Phone</p>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{userPhone}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{userStats.totalRentals}</span>
            <span className={styles.statLabel}>Total Rentals</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{userStats.activeRentals}</span>
            <span className={styles.statLabel}>Active Rentals</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>${userStats.totalSpent.toLocaleString()}</span>
            <span className={styles.statLabel}>Total Spent</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{userStats.itemsListed}</span>
            <span className={styles.statLabel}>Items Listed</span>
          </div>
        </div>

        {/* Account Actions */}
        <div className={styles.card} style={{ padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Account Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className={styles.btn} style={{ justifyContent: 'flex-start' }}>
              <span>Edit Profile</span>
            </button>
            <button className={styles.btn} style={{ justifyContent: 'flex-start' }}>
              <span>Change Password</span>
            </button>
            <button className={styles.btn} style={{ justifyContent: 'flex-start' }}>
              <span>Payment Methods</span>
            </button>
            <button className={styles.btn} style={{ justifyContent: 'flex-start', background: 'var(--danger)', color: 'white' }}>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
