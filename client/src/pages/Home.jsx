import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItems, getRentals, getUsers } from '../api/axios'
import ItemCard from '../components/ItemCard'
import Modal from '../components/Modal'
import styles from './Home.module.css'

export default function Home() {
  const nav = useNavigate()
  const [featuredItems, setFeaturedItems] = useState([])
  const [stats, setStats] = useState({ items: 0, rentals: 0, users: 0 })
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getItems({ limit: 8 }), getRentals(), getUsers()])
      .then(([itemsRes, rentalsRes, usersRes]) => {
        setFeaturedItems(itemsRes.data.data || [])
        setStats({
          items: itemsRes.data.pagination?.total || 0,
          rentals: rentalsRes.data.data?.length || 0,
          users: usersRes.data.data?.length || 0,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      {/* Hero banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBannerBg} />
        <div className={styles.heroBannerContent}>
          <p className={styles.heroBannerEye}>New Season</p>
          <h1 className={styles.heroBannerTitle}>Rent Premium<br />Fashion</h1>
          <p className={styles.heroBannerSub}>Curated pieces for every occasion</p>
          <button className={styles.heroBannerBtn} onClick={() => nav('/browse')}>
            Browse Collection
          </button>
        </div>
        <div className={styles.heroBannerStats}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.items}</span>
            <span className={styles.statLabel}>Items</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.rentals}</span>
            <span className={styles.statLabel}>Rentals</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.users}</span>
            <span className={styles.statLabel}>Members</span>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className={styles.catStrip}>
        {[
          { label: 'Most Wanted', bg: '#8b7355' },
          { label: 'Accessories', bg: '#6b5a3e' },
          { label: 'Basics', bg: '#d4c5b0' },
          { label: 'It Girl', bg: '#7a6a5a' },
          { label: 'Jackets', bg: '#1a1a1a' },
        ].map(c => (
          <div key={c.label} className={styles.catItem} onClick={() => nav('/browse')}>
            <div className={styles.catImg} style={{ background: c.bg }} />
            <span className={styles.catLabel}>{c.label}</span>
          </div>
        ))}
      </section>

      {/* Featured items */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>New Arrivals</h2>
          <button className={styles.seeAll} onClick={() => nav('/browse')}>View All →</button>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array(8).fill(0).map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : featuredItems.length === 0 ? (
          <div className={styles.empty}>
            <p>No items yet.</p>
            <button className={styles.emptyBtn} onClick={() => nav('/upload')}>Add the first one</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {featuredItems.map(item => (
              <ItemCard key={item.id} item={item} onView={setSelectedItem} onRent={() => nav('/rent', { state: { item } })} />
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className={styles.quickActions}>
        <div className={styles.qaCard} onClick={() => nav('/upload')}>
          <div className={styles.qaCardBg} style={{ background: '#2c2c2c' }} />
          <div className={styles.qaCardContent}>
            <span className={styles.qaLabel}>Have something to rent out?</span>
            <h3 className={styles.qaTitle}>List Your Item</h3>
            <span className={styles.qaArrow}>→</span>
          </div>
        </div>
        <div className={styles.qaCard} onClick={() => nav('/rentals')}>
          <div className={styles.qaCardBg} style={{ background: '#8b7355' }} />
          <div className={styles.qaCardContent}>
            <span className={styles.qaLabel}>Track your orders</span>
            <h3 className={styles.qaTitle}>My Rentals</h3>
            <span className={styles.qaArrow}>→</span>
          </div>
        </div>
      </section>

      {selectedItem && (
        <Modal onClose={() => setSelectedItem(null)}>
          <div className={styles.modalBody}>
            {selectedItem.imageUrl
              ? <img src={selectedItem.imageUrl} alt={selectedItem.name} className={styles.modalImg} />
              : <div className={styles.modalPlaceholder} />}
            <div className={styles.modalInfo}>
              <h2 className={styles.modalName}>{selectedItem.name}</h2>
              {selectedItem.description && <p className={styles.modalDesc}>{selectedItem.description}</p>}
              <div className={styles.metaGrid}>
                {[['Price/Day', `₹${selectedItem.rentalPrice}`], ['Size', selectedItem.size || '—'], ['Color', selectedItem.color || '—'], ['Brand', selectedItem.brand || '—'], ['Condition', selectedItem.condition], ['Status', selectedItem.isAvailable ? 'Available' : 'Rented']].map(([l, v]) => (
                  <div key={l} className={styles.metaItem}>
                    <span className={styles.metaLabel}>{l}</span>
                    <span className={styles.metaVal}>{v}</span>
                  </div>
                ))}
              </div>
              <div className={styles.modalActions}>
                <button className={styles.btnPrimary} disabled={!selectedItem.isAvailable} onClick={() => { nav('/rent', { state: { item: selectedItem } }); setSelectedItem(null) }}>
                  {selectedItem.isAvailable ? 'Rent This Item' : 'Currently Rented'}
                </button>
                <button className={styles.btnOutline} onClick={() => setSelectedItem(null)}>Close</button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
