import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Profile.module.css'

export default function Profile() {
  const { isLoggedIn, logout } = useAuth()
  const nav = useNavigate()
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
  const savedUserId = localStorage.getItem('userId')
  const userId = savedUserId || generateUserId(userEmail)
  const userName = localStorage.getItem('userName') || 'User Profile'

  const onSignOut = () => {
    logout()
    nav('/')
  }

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
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h1 className={styles.emptyTitle}>Please log in to view your profile</h1>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Account</p>
          <h1 className={styles.heroTitle}>My Profile</h1>
          <p className={styles.heroSub}>Manage your account and view your rental history</p>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.profileCard}>
          <div className={styles.userHead}>
            <div className={styles.avatar}>
              {userEmail?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className={styles.userMeta}>
              <h2 className={styles.userName}>{userName}</h2>
              <p className={styles.userEmail}>{userEmail}</p>
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>User ID</p>
              <p className={styles.infoValueMono}>{userId}</p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Phone</p>
              <p className={styles.infoValue}>{userPhone}</p>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.statTile}>
            <span className={styles.statNumber}>{userStats.totalRentals}</span>
            <span className={styles.statLabel}>Total Rentals</span>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statNumber}>{userStats.activeRentals}</span>
            <span className={styles.statLabel}>Active Rentals</span>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statNumber}>${userStats.totalSpent.toLocaleString()}</span>
            <span className={styles.statLabel}>Total Spent</span>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statNumber}>{userStats.itemsListed}</span>
            <span className={styles.statLabel}>Items Listed</span>
          </div>
        </section>

        <section className={styles.actionsCard}>
          <h3 className={styles.actionsTitle}>Account Settings</h3>
          <div className={styles.actionsGrid}>
            <button className={styles.actionBtn} onClick={() => nav('/rentals')}>
              View Rentals
            </button>
            <button className={styles.actionBtn} onClick={() => nav('/payment')}>
              Payment Methods
            </button>
            <button className={styles.actionBtn} onClick={() => nav('/browse')}>
              Browse Collection
            </button>
            <button className={`${styles.actionBtn} ${styles.signOutBtn}`} onClick={onSignOut}>
              Sign Out
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
