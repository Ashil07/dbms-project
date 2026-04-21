import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getItems, createRental, validateCoupon, getRentals, getUsers } from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import styles from './FormPage.module.css'

export default function RentPage() {
    const location = useLocation()
    const nav = useNavigate()
    const { isLoggedIn } = useAuth()
    const prefill = location.state?.item
    const [resolvedUserId, setResolvedUserId] = useState(null)
    const [resolvingUser, setResolvingUser] = useState(true)

    useEffect(() => {
        if (!isLoggedIn) {
            toast.error('Please log in to rent items')
            nav('/login')
            return
        }

        const resolveUser = async () => {
            setResolvingUser(true)
            try {
                const savedUserId = localStorage.getItem('userId')
                const parsedSavedId = Number.parseInt(savedUserId || '', 10)
                if (Number.isInteger(parsedSavedId) && parsedSavedId > 0) {
                    setResolvedUserId(parsedSavedId)
                    return
                }

                const userEmail = localStorage.getItem('userEmail')
                if (!userEmail) {
                    setResolvedUserId(null)
                    return
                }

                const usersResponse = await getUsers()
                const users = usersResponse.data?.data || []
                const matchedUser = users.find((u) => u.email?.toLowerCase() === userEmail.toLowerCase())

                if (matchedUser?.id) {
                    setResolvedUserId(matchedUser.id)
                    localStorage.setItem('userId', String(matchedUser.id))
                } else {
                    setResolvedUserId(null)
                }
            } catch {
                setResolvedUserId(null)
            } finally {
                setResolvingUser(false)
            }
        }

        resolveUser()
    }, [isLoggedIn, nav])

    const [items, setItems] = useState([])
    const [allRentals, setAllRentals] = useState([])
    const [form, setForm] = useState({
        itemId: prefill?.id || '',
        startDate: '',
        endDate: '',
        couponCode: '',
    })
    const [couponData, setCouponData] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)

    useEffect(() => {
        // Fetch both items and rentals
        Promise.all([
            getItems({ limit: 100 }), // Remove available filter to get all items
            getRentals()
        ])
            .then(([itemsRes, rentalsRes]) => {
                const items = itemsRes.data.data || []
                setItems(items)
                setAllRentals(rentalsRes.data.data || [])
            })
            .catch((error) => {
                toast.error('Failed to load data')
            })
    }, [])

    const selectedItem = items.find((i) => i.id === parseInt(form.itemId)) || prefill

    // Calculate rentals for selected item
    const selectedItemRentals = selectedItem 
        ? allRentals.filter(rental => rental.itemId === selectedItem.id && rental.status === 'active')
        : []

    const days =
        form.startDate && form.endDate
            ? Math.max(0, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000))
            : 0

    const baseTotal = selectedItem ? selectedItem.rentalPrice * days : 0
    const discount = couponData
        ? couponData.type === 'percentage'
            ? (baseTotal * couponData.discount) / 100
            : couponData.discount
        : 0
    const total = Math.max(0, baseTotal - discount)

    // Calculate availability
    const itemQuantity = selectedItem?.quantity || 1 // Default to 1 if quantity not set
    const availableQuantity = selectedItem ? itemQuantity - selectedItemRentals.length : 0
    const isAvailable = availableQuantity > 0
    
    // Calculate next available date (when all items are returned + 2 days buffer)
    const nextAvailableDate = selectedItem && selectedItemRentals.length > 0
        ? selectedItemRentals.reduce((latestDate, rental) => {
            const returnDate = new Date(rental.endDate)
            const availableDate = new Date(returnDate.getTime() + (2 * 24 * 60 * 60 * 1000)) // +2 days
            return availableDate > latestDate ? availableDate : latestDate
        }, new Date())
        : null

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

    const handleCoupon = async () => {
        if (!form.couponCode.trim()) return
        try {
            const r = await validateCoupon({ code: form.couponCode, amount: baseTotal })
            setCouponData(r.data.data)
            toast.success(`Coupon applied! Save ₹${r.data.data.discountAmount.toFixed(2)}`)
        } catch (e) {
            setCouponData(null)
            toast.error(e.response?.data?.message || 'Invalid coupon')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!resolvedUserId) return toast.error('Unable to identify your account. Please sign in again.')
        if (!form.itemId || !form.startDate || !form.endDate)
            return toast.error('Please fill all required fields')
        if (days <= 0) return toast.error('End date must be after start date')
        if (selectedItem && !isAvailable) {
            if (nextAvailableDate) {
                return toast.error(`This item is currently all rented. Next available on ${nextAvailableDate.toLocaleDateString()}`)
            } else {
                return toast.error('This item is currently not available for rent')
            }
        }
        setSubmitting(true)
        try {
            const r = await createRental({
                userId: resolvedUserId,
                itemId: parseInt(form.itemId),
                startDate: form.startDate,
                endDate: form.endDate,
                couponCode: form.couponCode || undefined,
            })
            setResult(r.data.data)
            toast.success('Rental created successfully!')
            setForm({ itemId: '', startDate: '', endDate: '', couponCode: '' })
            setCouponData(null)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create rental')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.formWrap}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>Rent an Item</h1>
                    <p className={styles.desc}>Fill in the details below to rent your chosen outfit.</p>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <div className={styles.group}>
                            <label className={styles.label}>User ID</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Your user ID"
                                value={resolvingUser ? 'Loading...' : (resolvedUserId || 'Not linked')}
                                readOnly
                                style={{ background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                            />
                            <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {resolvingUser ? 'Fetching your profile...' : resolvedUserId ? 'Auto-filled from your profile' : 'User not found. Please sign in again.'}
                            </small>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Select Item *</label>
                            <select className={styles.input} value={form.itemId} onChange={set('itemId')} required>
                                <option value="">-- Choose an item --</option>
                                {items.map((i) => {
                                    const itemRentalsCount = allRentals.filter(r => r.itemId === i.id && r.status === 'active').length
                                    const itemQty = i.quantity || 1 // Default to 1 if quantity not set
                                    const availableQty = itemQty - itemRentalsCount
                                    const isItemAvailable = availableQty > 0
                                    
                                    return (
                                        <option key={i.id} value={i.id} disabled={!isItemAvailable}>
                                            {i.name} — ₹{i.rentalPrice}/day 
                                            {isItemAvailable ? ` (${availableQty} available)` : ' (All rented)'}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Start Date *</label>
                            <input type="date" className={styles.input} value={form.startDate} onChange={set('startDate')} min={new Date().toISOString().split('T')[0]} required />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>End Date *</label>
                            <input type="date" className={styles.input} value={form.endDate} onChange={set('endDate')} min={form.startDate || new Date().toISOString().split('T')[0]} required />
                        </div>
                        <div className={`${styles.group} ${styles.fullWidth}`}>
                            <label className={styles.label}>Coupon Code (Optional)</label>
                            <div className={styles.inputRow}>
                                <input type="text" className={styles.input} placeholder="e.g. SAVE20" value={form.couponCode} onChange={set('couponCode')} />
                                <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={handleCoupon}>Apply</button>
                            </div>
                            {couponData && <p className={styles.couponSuccess}>✅ {couponData.discount}{couponData.type === 'percentage' ? '%' : '₹'} off applied!</p>}
                        </div>
                    </div>

                    {selectedItem && (
                        <div className={styles.summary}>
                            <div className={styles.sumRow}><span>Price / Day</span><span>₹{selectedItem.rentalPrice}</span></div>
                            <div className={styles.sumRow}><span>Available Quantity</span><span>{availableQuantity}</span></div>
                            {nextAvailableDate && (
                                <div className={styles.sumRow}><span>Next Available</span><span>{nextAvailableDate.toLocaleDateString()}</span></div>
                            )}
                            {days > 0 && (
                                <div className={styles.sumRow}><span>Duration</span><span>{days} day{days > 1 ? 's' : ''}</span></div>
                            )}
                            {days > 0 && (
                                <div className={styles.sumRow}><span>Subtotal</span><span>₹{baseTotal.toFixed(2)}</span></div>
                            )}
                            {discount > 0 && (
                                <div className={styles.sumRow}><span>Discount</span><span className={styles.discount}>-₹{discount.toFixed(2)}</span></div>
                            )}
                            {days > 0 && (
                                <div className={`${styles.sumRow} ${styles.sumTotal}`}><span>Total</span><span className={styles.totalVal}>₹{total.toFixed(2)}</span></div>
                            )}
                        </div>
                    )}

                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.fullWidth}`} disabled={submitting || !isAvailable || resolvingUser || !resolvedUserId}>
                        {submitting ? '⏳ Creating Rental...' : isAvailable ? 'Confirm Rental' : 'Item Not Available'}
                    </button>
                </form>

                {result && (
                    <div className={styles.resultCard}>
                        <div className={styles.rcIcon}>🎉</div>
                        <div>
                            <p className={styles.rcTitle}>Rental Created!</p>
                            <p className={styles.rcSub}>ID: <strong>#{result.id}</strong> · Total: <strong>₹{result.totalAmount}</strong></p>
                            <button className={styles.linkBtn} onClick={() => nav('/payment', { state: { rentalId: result.id, amount: result.totalAmount } })}>
                                → Go to Payment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
