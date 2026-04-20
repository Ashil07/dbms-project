import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'

const categories = [
  { label: 'Most Wanted', sub: 'The pieces everyone is reaching for', img: null, span: 'wide' },
  { label: 'Accessories', sub: 'From fine jewellery to statement bags', img: null, span: 'normal' },
  { label: 'Get Cozy', sub: 'Knitwear, loungewear & soft layers', img: null, span: 'normal' },
  { label: 'Basics', sub: 'The foundation of every great outfit', img: null, span: 'normal' },
  { label: 'It Girl', sub: 'Curated for the effortlessly cool', img: null, span: 'normal' },
  { label: 'Men', sub: 'Sharp, relaxed, and everything between', img: null, span: 'normal' },
  { label: 'Jackets', sub: 'Layer up in style', img: null, span: 'normal' },
]

const editorial = [
  { label: 'Fall Must-Haves', tag: 'New Arrivals' },
  { label: 'Street Style Edit', tag: 'Trending' },
  { label: 'Date Night', tag: 'Curated' },
  { label: 'Weekend Casual', tag: 'Essentials' },
]

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Hero — full bleed split */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroImgPlaceholder} style={{ background: '#c9b8a8' }} />
        </div>
        <div className={styles.heroCenter}>
          <p className={styles.heroEyebrow}>ThreadRent</p>
          <h1 className={styles.heroTitle}>Rent. Wear.<br />Return.</h1>
          <p className={styles.heroSub}>Premium fashion for every occasion — sustainable, affordable, effortless.</p>
          <Link to="/signup" className={styles.heroBtn}>Shop Now</Link>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroImgPlaceholder} style={{ background: '#b8a898' }} />
        </div>
      </section>

      {/* Category grid row 1 */}
      <section className={styles.catGrid1}>
        <div className={`${styles.catCell} ${styles.catWide}`}>
          <div className={styles.catBg} style={{ background: '#8b7355' }} />
          <div className={styles.catLabel}>
            <span className={styles.catName}>Most Wanted</span>
            <span className={styles.catSub}>The pieces everyone is reaching for</span>
          </div>
        </div>
        <div className={styles.catCell}>
          <div className={styles.catBg} style={{ background: '#6b5a3e' }} />
          <div className={styles.catLabel}>
            <span className={styles.catName}>Accessories</span>
            <span className={styles.catSub}>From fine jewellery to statement bags</span>
          </div>
        </div>
        <div className={styles.catCell}>
          <div className={styles.catBg} style={{ background: '#9e9e9e' }} />
          <div className={styles.catLabel}>
            <span className={styles.catName}>Get Cozy</span>
            <span className={styles.catSub}>Knitwear, loungewear & soft layers</span>
          </div>
        </div>
        <div className={styles.catCell}>
          <div className={styles.catBg} style={{ background: '#2c2c2c' }} />
          <div className={styles.catLabel}>
            <span className={styles.catName}>New In</span>
            <span className={styles.catSub}>Just landed this week</span>
          </div>
        </div>
      </section>

      {/* Category grid row 2 */}
      <section className={styles.catGrid2}>
        <div className={styles.catCell}>
          <div className={styles.catBg} style={{ background: '#d4c5b0' }} />
          <div className={styles.catLabel}>
            <span className={styles.catName}>Basics</span>
          </div>
        </div>
        <div className={styles.catCell}>
          <div className={styles.catBg} style={{ background: '#7a6a5a' }} />
          <div className={styles.catLabel}>
            <span className={styles.catName}>It Girl</span>
          </div>
        </div>
        <div className={styles.catCell}>
          <div className={styles.catBg} style={{ background: '#4a4a4a' }} />
          <div className={styles.catLabel}>
            <span className={styles.catName}>Men</span>
          </div>
        </div>
        <div className={styles.catCell}>
          <div className={styles.catBg} style={{ background: '#1a1a1a' }} />
          <div className={styles.catLabel}>
            <span className={styles.catName}>Jackets</span>
          </div>
        </div>
      </section>

      {/* Editorial section */}
      <section className={styles.editorial}>
        <div className={styles.editorialHeader}>
          <h2 className={styles.editorialTitle}>Fall Must-Haves</h2>
          <Link to="/signup" className={styles.editorialLink}>View All →</Link>
        </div>
        <div className={styles.editorialGrid}>
          {[
            { bg: '#8b6f5e', aspect: 'tall' },
            { bg: '#c4a882', aspect: 'tall' },
            { bg: '#6b5a4e', aspect: 'tall' },
            { bg: '#a08060', aspect: 'tall' },
          ].map((item, i) => (
            <div key={i} className={`${styles.editorialCard} ${item.aspect === 'tall' ? styles.tall : ''}`}>
              <div className={styles.editorialImg} style={{ background: item.bg }} />
              <div className={styles.editorialCardLabel}>
                <span className={styles.editorialTag}>Rent from ₹299/day</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section className={styles.features}>
        {[
          { num: '01', title: 'Curated Collection', desc: 'Handpicked premium pieces for every occasion' },
          { num: '02', title: 'Rent & Return', desc: 'Simple 3-step process — browse, rent, return' },
          { num: '03', title: 'Sustainable Fashion', desc: 'Reduce waste, wear more, own less' },
        ].map(f => (
          <div key={f.num} className={styles.featureItem}>
            <span className={styles.featureNum}>{f.num}</span>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerBg} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Your wardrobe,<br />reimagined.</h2>
          <p className={styles.ctaSub}>Join thousands renting smarter. No commitment, all style.</p>
          <div className={styles.ctaActions}>
            <Link to="/signup" className={styles.ctaBtnPrimary}>Create Account</Link>
            <Link to="/login" className={styles.ctaBtnOutline}>Sign In</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
