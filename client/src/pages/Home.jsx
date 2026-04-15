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
        Promise.all([
            getItems({ limit: 8 }),
            getRentals(),
            getUsers(),
        ]).then(([itemsRes, rentalsRes, usersRes]) => {
            setFeaturedItems(itemsRes.data.data || [])
            setStats({
                items: itemsRes.data.pagination?.total || 0,
                rentals: rentalsRes.data.data?.length || 0,
                users: usersRes.data.data?.length || 0,
            })
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>✨ Premium Cloth Rental</div>
                    <h1 className={styles.heroTitle}>
                        Wear It Once,<br />
                        <span className={styles.gradient}>Return It Twice.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Browse thousands of premium outfits, rent for any occasion, and return when done.
                        Sustainable fashion, affordable style.
                    </p>
                    <div className={styles.heroActions}>
                        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => nav('/browse')}>
                            Browse Items
                        </button>
                        <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => nav('/upload')}>
                            List Your Item
                        </button>
                    </div>
                    <div className={styles.statsRow}>
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
                            <span className={styles.statLabel}>Users</span>
                        </div>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <div className={styles.orb}>👗</div>
                    <div className={`${styles.floatCard} ${styles.fc1}`}><span>👘</span> Sarees</div>
                    <div className={`${styles.floatCard} ${styles.fc2}`}><span>🥻</span> Lehengas</div>
                    <div className={`${styles.floatCard} ${styles.fc3}`}><span>🤵</span> Suits</div>
                </div>
            </section>

            {/* Featured */}
            <section>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured Items</h2>
                    <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`} onClick={() => nav('/browse')}>
                        See All →
                    </button>
                </div>
                {loading ? (
                    <div className={styles.grid}>
                        {Array(8).fill(0).map((_, i) => <div key={i} className={styles.skeleton} />)}
                    </div>
                ) : featuredItems.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>🛍️</div>
                        <p>No items yet. <button className={styles.linkBtn} onClick={() => nav('/upload')}>Add the first one!</button></p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {featuredItems.map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onView={setSelectedItem}
                                onRent={() => nav('/rent', { state: { item } })}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Item Detail Modal */}
            {selectedItem && (
                <Modal onClose={() => setSelectedItem(null)}>
                    <div className={styles.modalBody}>
                        {selectedItem.imageUrl
                            ? <img src={selectedItem.imageUrl} alt={selectedItem.name} className={styles.modalImg} />
                            : <div className={styles.modalPlaceholder}>👗</div>}
                        <h2 className={styles.modalName}>{selectedItem.name}</h2>
                        {selectedItem.description && <p className={styles.modalDesc}>{selectedItem.description}</p>}
                        <div className={styles.metaGrid}>
                            {[
                                ['Price/Day', `₹${selectedItem.rentalPrice}`],
                                ['Size', selectedItem.size || '—'],
                                ['Color', selectedItem.color || '—'],
                                ['Brand', selectedItem.brand || '—'],
                                ['Condition', selectedItem.condition],
                                ['Status', selectedItem.isAvailable ? '✅ Available' : '🔴 Rented'],
                            ].map(([label, val]) => (
                                <div key={label} className={styles.metaItem}>
                                    <span className={styles.metaLabel}>{label}</span>
                                    <span className={styles.metaVal}>{val}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                disabled={!selectedItem.isAvailable}
                                onClick={() => { nav('/rent', { state: { item: selectedItem } }); setSelectedItem(null) }}
                            >
                                {selectedItem.isAvailable ? 'Rent This Item' : 'Currently Rented'}
                            </button>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setSelectedItem(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
