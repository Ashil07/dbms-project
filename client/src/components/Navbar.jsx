import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import styles from './Navbar.module.css'

const authLinks = [
  { to: '/home', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/rent', label: 'Rent' },
  { to: '/upload', label: 'List Item' },
  { to: '/rentals', label: 'Rentals' },
  { to: '/payment', label: 'Payment' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isLoggedIn, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Left: nav links */}
        <div className={styles.leftLinks}>
          {isLoggedIn && authLinks.slice(0, 3).map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Center: logo */}
        <NavLink to={isLoggedIn ? '/home' : '/'} className={styles.logo}>
          ThreadRent
        </NavLink>

        {/* Right: nav links + actions */}
        <div className={styles.rightLinks}>
          {isLoggedIn && authLinks.slice(3).map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              {l.label}
            </NavLink>
          ))}
          <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme" title={isDark ? 'Light mode' : 'Dark mode'}>
            {isDark ? '○' : '●'}
          </button>
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Dashboard</NavLink>
              <NavLink to="/profile" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Profile</NavLink>
              <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={styles.link}>Sign In</NavLink>
              <NavLink to="/signup" className={styles.signupBtn}>Join</NavLink>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {isLoggedIn ? (
            <>
              {authLinks.map(l => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}>
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/dashboard" className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}>Dashboard</NavLink>
              <NavLink to="/profile" className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}>Profile</NavLink>
              <button className={styles.mobileLink} onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={styles.mobileLink}>Sign In</NavLink>
              <NavLink to="/signup" className={styles.mobileLink}>Join</NavLink>
            </>
          )}
          <button className={styles.mobileLink} onClick={toggleTheme}>{isDark ? 'Light Mode' : 'Dark Mode'}</button>
        </div>
      )}
    </nav>
  )
}
