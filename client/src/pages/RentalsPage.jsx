import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getRentals, returnRental } from '../api/axios'
import styles from './FormPage.module.css'

const statusClass = {
    active: styles.pillActive,
    returned: styles.pillReturned,
    cancelled: styles.pillCancelled,
}

export default function RentalsPage() {
    const [rentals, setRentals] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [returning, setReturning] = useState(null)

    const fetchRentals = () => {
        setLoading(true)
        const params = filter ? { status: filter } : {}
        getRentals(params)
            .then((r) => setRentals(r.data.data || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchRentals() }, [filter])

    const handleReturn = async (rentalId) => {
        if (!window.confirm('Mark this rental as returned?')) return
        setReturning(rentalId)
        try {
            await returnRental(rentalId, { condition: 'Good' })
            toast.success('Item returned successfully!')
            fetchRentals()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to process return')
        } finally {
            setReturning(null)
        }
    }

    return (
        <div className={styles.page}>
            <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className={styles.title} style={{ textAlign: 'left', marginBottom: '0.25rem' }}>All Rentals</h1>
                        <p className={styles.desc} style={{ textAlign: 'left' }}>Track and manage all rental records.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                            className={styles.input}
                            style={{ width: 'auto' }}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="returned">Returned</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: '0.52rem 1rem', fontSize: '0.85rem' }} onClick={fetchRentals}>
                            🔄 Refresh
                        </button>
                    </div>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>User</th>
                                <th>Period</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className={styles.emptyRow}>Loading...</td></tr>
                            ) : rentals.length === 0 ? (
                                <tr><td colSpan={7} className={styles.emptyRow}>No rentals found.</td></tr>
                            ) : rentals.map((r) => (
                                <tr key={r.id}>
                                    <td>#{r.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            {r.item?.imageUrl
                                                ? <img src={r.item.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                                                : <span style={{ fontSize: '1.5rem' }}>👗</span>}
                                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.item?.name || '—'}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{r.user?.name || '—'}</td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(r.startDate).toLocaleDateString('en-IN')} → {new Date(r.endDate).toLocaleDateString('en-IN')}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>₹{r.totalAmount}</td>
                                    <td>
                                        <span className={`${styles.pill} ${statusClass[r.status] || ''}`}>{r.status}</span>
                                    </td>
                                    <td>
                                        {r.status === 'active' ? (
                                            <button
                                                className={`${styles.btn} ${styles.btnOutline}`}
                                                style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                                                onClick={() => handleReturn(r.id)}
                                                disabled={returning === r.id}
                                            >
                                                {returning === r.id ? '...' : '↩ Return'}
                                            </button>
                                        ) : <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
