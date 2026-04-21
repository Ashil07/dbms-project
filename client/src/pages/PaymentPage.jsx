import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createPayment, getPayments, getRentals } from '../api/axios'
import styles from './FormPage.module.css'

const statusClass = {
    completed: styles.pillSuccess,
    pending: styles.pillPending,
    failed: styles.pillFailed,
    refunded: styles.pillRefunded,
}

export default function PaymentPage() {
    const location = useLocation()
    const prefill = location.state || {}
    const loggedInEmail = localStorage.getItem('userEmail')

    const [form, setForm] = useState({
        rentalId: prefill.rentalId || '',
        amount: prefill.amount || '',
        method: '',
        transactionId: '',
    })
    const [payments, setPayments] = useState([])
    const [pendingRentals, setPendingRentals] = useState([])
    const [loadingPayments, setLoadingPayments] = useState(true)
    const [loadingPending, setLoadingPending] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)

    const fetchPayments = () => {
        setLoadingPayments(true)
        getPayments()
            .then((r) => setPayments(r.data.data || []))
            .catch(() => { })
            .finally(() => setLoadingPayments(false))
    }

    const fetchPendingRentals = () => {
        setLoadingPending(true)
        getRentals()
            .then((r) => {
                const rentals = r.data.data || []
                const mine = loggedInEmail
                    ? rentals.filter((rental) => rental.user?.email?.toLowerCase() === loggedInEmail.toLowerCase())
                    : rentals
                const pending = mine.filter((rental) => !rental.payment)
                setPendingRentals(pending)

                if (prefill.rentalId) {
                    const selected = pending.find((rental) => rental.id === parseInt(prefill.rentalId))
                    if (selected) {
                        setForm((f) => ({
                            ...f,
                            rentalId: String(selected.id),
                            amount: selected.totalAmount,
                        }))
                    }
                }
            })
            .catch(() => { })
            .finally(() => setLoadingPending(false))
    }

    useEffect(() => { fetchPayments() }, [])
    useEffect(() => { fetchPendingRentals() }, [])

    const set = (k) => (e) => {
        const value = e.target.value
        if (k === 'rentalId') {
            const rental = pendingRentals.find((r) => r.id === parseInt(value))
            setForm((f) => ({
                ...f,
                rentalId: value,
                amount: rental ? rental.totalAmount : '',
            }))
            return
        }
        setForm((f) => ({ ...f, [k]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.rentalId || !form.amount || !form.method)
            return toast.error('Rental ID, amount, and method are required')
        setSubmitting(true)
        try {
            const r = await createPayment({
                rentalId: parseInt(form.rentalId),
                amount: parseFloat(form.amount),
                method: form.method,
                transactionId: form.transactionId || undefined,
            })
            setResult(r.data.data)
            toast.success('Payment recorded!')
            setForm({ rentalId: '', amount: '', method: '', transactionId: '' })
            fetchPayments()
            fetchPendingRentals()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment failed')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.formWrap}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>Process Payment</h1>
                    <p className={styles.desc}>Choose from your pending rentals and complete payment.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <div className={styles.group}>
                            <label className={styles.label}>Pending Rental *</label>
                            <select className={styles.input} value={form.rentalId} onChange={set('rentalId')} required disabled={loadingPending || pendingRentals.length === 0}>
                                <option value="">
                                    {loadingPending ? 'Loading pending rentals...' : pendingRentals.length === 0 ? 'No pending rentals' : '-- Select Rental --'}
                                </option>
                                {pendingRentals.map((rental) => (
                                    <option key={rental.id} value={rental.id}>
                                        #{rental.id} - {rental.item?.name || 'Item'} - ₹{rental.totalAmount}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Amount (₹) *</label>
                            <input type="number" className={styles.input} placeholder="Auto-filled from selected rental" min="1" value={form.amount} onChange={set('amount')} required />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Payment Method *</label>
                            <select className={styles.input} value={form.method} onChange={set('method')} required>
                                <option value="">-- Select Method --</option>
                                <option value="cash">💵 Cash</option>
                                <option value="card">💳 Card</option>
                                <option value="upi">📱 UPI</option>
                                <option value="online">🌐 Online Banking</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Transaction ID (Optional)</label>
                            <input type="text" className={styles.input} placeholder="e.g. TXN123456" value={form.transactionId} onChange={set('transactionId')} />
                        </div>
                    </div>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.fullWidth}`} disabled={submitting}>
                        {submitting ? '⏳ Processing...' : '💳 Record Payment'}
                    </button>
                </form>

                {result && (
                    <div className={styles.resultCard}>
                        <div className={styles.rcIcon}>✅</div>
                        <div>
                            <p className={styles.rcTitle}>Payment Recorded!</p>
                            <p className={styles.rcSub}>
                                Rental <strong>#{result.rentalId}</strong> · ₹<strong>{result.amount}</strong> · {result.method.toUpperCase()}
                            </p>
                        </div>
                    </div>
                )}

                {/* Recent Payments Table */}
                <div className={styles.sectionSubHeader}>
                    <h2 className={styles.subTitle}>Recent Payments</h2>
                    <button className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={fetchPayments}>
                        🔄 Refresh
                    </button>
                </div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Rental ID</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingPayments ? (
                                <tr><td colSpan={6} className={styles.emptyRow}>Loading...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan={6} className={styles.emptyRow}>No payments yet.</td></tr>
                            ) : payments.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>#{p.rentalId}</td>
                                    <td>₹{p.amount}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{p.method}</td>
                                    <td><span className={`${styles.pill} ${statusClass[p.status] || ''}`}>{p.status}</span></td>
                                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
