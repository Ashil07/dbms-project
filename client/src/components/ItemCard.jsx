import styles from './ItemCard.module.css'

export default function ItemCard({ item, onRent, onView }) {
    const avgRating = item.avgRating || item.reviews?.length
        ? (item.avgRating ?? (item.reviews.reduce((s, r) => s + r.rating, 0) / item.reviews.length).toFixed(1))
        : null

    return (
        <div className={styles.card} onClick={() => onView?.(item)}>
            <div className={styles.imgWrap}>
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className={styles.img} />
                ) : (
                    <div className={styles.placeholder}>👗</div>
                )}
                <span className={`${styles.badge} ${item.isAvailable ? styles.available : styles.rented}`}>
                    {item.isAvailable ? 'Available' : 'Rented'}
                </span>
            </div>
            <div className={styles.body}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.meta}>
                    {[item.size, item.color, item.brand].filter(Boolean).join(' · ') || 'No details'}
                </p>
                <div className={styles.footer}>
                    <div>
                        <p className={styles.price}>
                            ₹{item.rentalPrice} <span>/ day</span>
                        </p>
                        {avgRating && (
                            <p className={styles.rating}>⭐ {avgRating}</p>
                        )}
                    </div>
                    <button
                        className={styles.rentBtn}
                        disabled={!item.isAvailable}
                        onClick={(e) => { e.stopPropagation(); onRent?.(item) }}
                    >
                        {item.isAvailable ? 'Rent' : 'Taken'}
                    </button>
                </div>
            </div>
        </div>
    )
}
