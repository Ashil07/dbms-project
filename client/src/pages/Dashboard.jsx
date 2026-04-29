import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItems, getRentals, getUsers } from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import styles from './Dashboard.module.css'
import premiumHomeImg from '../assets/premium home.jpg'
import premiumOutfitImg from '../assets/premium outfit.jpg'
import traditionalWearImg from '../assets/traditional wear.jpg'
import landRightImg from '../assets/landright.jpg'

export default function Dashboard() {
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()
  const [stats, setStats] = useState({ items: 0, rentals: 0, users: 0, activeRentals: 0 })
  const [recentRentals, setRecentRentals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const requests = [getItems({ limit: 100 }), getRentals()]
    if (isAdmin) requests.push(getUsers())

    Promise.all(requests)
      .then((responses) => {
        const itemsRes = responses[0]
        const rentalsRes = responses[1]
        const usersRes = isAdmin ? responses[2] : null

        const rentals = rentalsRes.data.data || []
        setStats({
          items: itemsRes.data.pagination?.total || 0,
          rentals: rentals.length,
          users: isAdmin ? (usersRes?.data.data?.length || 0) : 0,
          activeRentals: rentals.filter(r => r.status === 'active').length,
        })
        setRecentRentals(rentals.slice(0, 5))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAdmin])

  const statusColor = s => s === 'active' ? styles.statusActive : s === 'returned' ? styles.statusReturned : styles.statusCancelled

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.pageEye}>Overview</p>
          <h1 className={styles.pageTitle}>Dashboard</h1>
        </div>
        <button className={styles.browseBtn} onClick={() => navigate('/browse')}>Browse Collection →</button>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Items', value: stats.items, sub: 'in catalogue' },
          { label: isAdmin ? 'Total Rentals' : 'My Rentals', value: stats.rentals, sub: 'all time' },
          { label: isAdmin ? 'Active Rentals' : 'My Active Rentals', value: stats.activeRentals, sub: 'currently out' },
          ...(isAdmin ? [{ label: 'Members', value: stats.users, sub: 'registered' }] : []),
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statValue}>{loading ? '—' : s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statSub}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Action grid */}
      <div className={styles.actionGrid}>
        <div className={styles.actionCard} onClick={() => navigate('/browse')}>
          <div
            className={styles.actionCardBg}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.25)), url(${premiumHomeImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className={styles.actionCardContent}>
            <span className={styles.actionEye}>Explore</span>
            <h3 className={styles.actionTitle}>Browse Items</h3>
            <p className={styles.actionDesc}>Discover our full collection of premium rental pieces</p>
            <span className={styles.actionArrow}>→</span>
          </div>
        </div>
        {isAdmin && (
          <div className={styles.actionCard} onClick={() => navigate('/upload')}>
            <div
              className={styles.actionCardBg}
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.25)), url(${premiumOutfitImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className={styles.actionCardContent}>
              <span className={styles.actionEye}>Contribute</span>
              <h3 className={styles.actionTitle}>List New Item</h3>
              <p className={styles.actionDesc}>Add your clothing to the marketplace</p>
              <span className={styles.actionArrow}>→</span>
            </div>
          </div>
        )}
        <div className={styles.actionCard} onClick={() => navigate('/rentals')}>
          <div
            className={styles.actionCardBg}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.25)), url(${traditionalWearImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className={styles.actionCardContent}>
            <span className={styles.actionEye}>Manage</span>
            <h3 className={styles.actionTitle}>{isAdmin ? 'All Rentals' : 'My Rentals'}</h3>
            <p className={styles.actionDesc}>View orders, track returns, manage history</p>
            <span className={styles.actionArrow}>→</span>
          </div>
        </div>
        <div className={styles.actionCard} onClick={() => navigate('/payment')}>
          <div
            className={styles.actionCardBg}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.25)), url(${landRightImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className={styles.actionCardContent}>
            <span className={styles.actionEye}>Finance</span>
            <h3 className={styles.actionTitle}>{isAdmin ? 'Payments' : 'My Payments'}</h3>
            <p className={styles.actionDesc}>Record and track payment transactions</p>
            <span className={styles.actionArrow}>→</span>
          </div>
        </div>
      </div>

      {/* Recent rentals table */}
      <div className={styles.tableSection}>
        <div className={styles.tableSectionHeader}>
          <h2 className={styles.tableSectionTitle}>Recent Rentals</h2>
          <button className={styles.tableViewAll} onClick={() => navigate('/rentals')}>View All</button>
        </div>
        {loading ? (
          <div className={styles.tableLoading}>Loading...</div>
        ) : recentRentals.length === 0 ? (
          <div className={styles.tableEmpty}>No rentals yet. <button className={styles.inlineLink} onClick={() => navigate('/browse')}>Browse items to rent.</button></div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRentals.map(r => (
                <tr key={r.id}>
                  <td>{r.item?.name || '—'}</td>
                  <td className={styles.dateTd}>
                    {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
                  </td>
                  <td>₹{r.totalAmount?.toFixed(0)}</td>
                  <td><span className={`${styles.statusPill} ${statusColor(r.status)}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
