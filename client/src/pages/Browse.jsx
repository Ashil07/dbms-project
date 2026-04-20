import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItems, getCategories } from '../api/axios'
import ItemCard from '../components/ItemCard'
import Modal from '../components/Modal'
import styles from './Browse.module.css'

export default function Browse() {
    const nav = useNavigate()
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [available, setAvailable] = useState('')
    const [category, setCategory] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        getCategories().then(r => setCategories(r.data.data || [])).catch(() => {})
    }, [])

    const fetchItems = useCallback(() => {
        setLoading(true)
        const params = { page, limit: 12 }
        if (search) params.search = search
        if (available) params.available = available
        if (category) params.category = category
        getItems(params)
            .then((res) => {
                setItems(res.data.data || [])
                setTotalPages(res.data.pagination?.totalPages || 1)
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [page, search, available, category])

    useEffect(() => { fetchItems() }, [fetchItems])
    useEffect(() => { setPage(1) }, [search, available, category])

    // Group categories for optgroups
    const groups = [
      { label: 'Wedding', cats: categories.filter(c => c.name.toLowerCase().includes('wedding')) },
      { label: 'Ethnic', cats: categories.filter(c => c.name.toLowerCase().includes('ethnic')) },
      { label: 'Western', cats: categories.filter(c => c.name.toLowerCase().includes('western')) },
      { label: 'Party & Festive', cats: categories.filter(c => c.name.toLowerCase().includes('party')) },
      { label: 'Other', cats: categories.filter(c =>
          !c.name.toLowerCase().includes('wedding') &&
          !c.name.toLowerCase().includes('ethnic') &&
          !c.name.toLowerCase().includes('western') &&
          !c.name.toLowerCase().includes('party')
      )},
    ]

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Browse Collection</h1>
                <div className={styles.filters}>
                    <div className={styles.searchWrap}>
                        <span className={styles.searchIcon}>⌕</span>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {groups.map(g => g.cats.length > 0 && (
                            <optgroup key={g.label} label={g.label}>
                                {g.cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </optgroup>
                        ))}
                    </select>
                    <select className={styles.select} value={available} onChange={(e) => setAvailable(e.target.value)}>
                        <option value="">All Items</option>
                        <option value="true">Available</option>
                        <option value="false">Rented Out</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.grid}>
                    {Array(12).fill(0).map((_, i) => <div key={i} className={styles.skeleton} />)}
                </div>
            ) : items.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🔎</div>
                    <p>No items found.{' '}
                        <button className={styles.linkBtn} onClick={() => nav('/upload')}>Add one?</button>
                    </p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {items.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            onView={setSelectedItem}
                            onRent={() => nav('/rent', { state: { item } })}
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
                            onClick={() => setPage(p)}
                        >{p}</button>
                    ))}
                    <button
                        className={styles.pageBtn}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >Next →</button>
                </div>
            )}

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
                                {[
                                    ['Price/Day', `₹${selectedItem.rentalPrice}`],
                                    ['Size', selectedItem.size || '—'],
                                    ['Color', selectedItem.color || '—'],
                                    ['Brand', selectedItem.brand || '—'],
                                    ['Condition', selectedItem.condition],
                                    ['Status', selectedItem.isAvailable ? 'Available' : 'Rented'],
                                ].map(([l, v]) => (
                                    <div key={l} className={styles.metaItem}>
                                        <span className={styles.metaLabel}>{l}</span>
                                        <span className={styles.metaVal}>{v}</span>
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
                    </div>
                </Modal>
            )}
        </div>
    )
}
