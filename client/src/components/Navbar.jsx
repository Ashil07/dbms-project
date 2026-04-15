import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const links = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
    { to: '/rent', label: 'Rent' },
    { to: '/upload', label: 'List Item' },
    { to: '/rentals', label: 'Rentals' },
    { to: '/payment', label: 'Payment' },
]

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <NavLink to="/" className={styles.logo}>
                    <span className={styles.logoIcon}>👗</span>
                    <span className={styles.logoText}>ThreadRent</span>
                </NavLink>
                <div className={styles.links}>
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.to === '/'}
                            className={({ isActive }) =>
                                `${styles.link} ${isActive ? styles.active : ''}`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </div>
                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.to === '/'}
                            className={({ isActive }) =>
                                `${styles.mobileLink} ${isActive ? styles.active : ''}`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
    )
}
