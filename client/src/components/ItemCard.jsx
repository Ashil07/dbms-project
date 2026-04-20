import styles from './ItemCard.module.css'

export default function ItemCard({ item, onRent, onView }) {
  const avgRating = item.avgRating ?? (
    item.reviews?.length
      ? (item.reviews.reduce((s, r) => s + r.rating, 0) / item.reviews.length).toFixed(1)
      : null
  )

  return (
    <div className={styles.card} onClick={() => onView?.(item)}>
      <div className={styles.imgWrap}>
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} className={styles.img} />
          : <div className={styles.placeholder} />}
        {!item.isAvailable && <span className={styles.rentedOverlay}>Rented</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <p className={styles.name}>{item.name}</p>
          {avgRating && <span className={styles.rating}>{avgRating} ★</span>}
        </div>
        <p className={styles.meta}>
          {[item.brand, item.size, item.color].filter(Boolean).join(' · ') || '\u00A0'}
        </p>
        <div className={styles.footer}>
          <span className={styles.price}>₹{item.rentalPrice}<span className={styles.perDay}>/day</span></span>
          <button
            className={`${styles.rentBtn} ${!item.isAvailable ? styles.rentBtnDisabled : ''}`}
            disabled={!item.isAvailable}
            onClick={e => { e.stopPropagation(); onRent?.(item) }}
          >
            {item.isAvailable ? 'Rent' : 'Taken'}
          </button>
        </div>
      </div>
    </div>
  )
}
