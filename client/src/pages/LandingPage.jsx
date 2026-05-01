import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'
import accessoriesImg from '../assets/accessories.jpg'
import basicsImg from '../assets/basics.jpg'
import cordImg from '../assets/cord.jpg'
import fallImg from '../assets/fall.jpg'
import itGirlImg from '../assets/IT girl.jpg'
import jacketsImg from '../assets/jackets.jpg'
import premiumOutfitImg from '../assets/premium outfit.jpg'
import heroright from '../assets/landright.jpg'
import suiteWomenImg from '../assets/suite women.jpg'
import traditionalWearImg from '../assets/traditional wear.jpg'
import img1 from '../assets/299rps.jpg'
import img2 from '../assets/299 2.jpg'
import img3 from '../assets/299 3.jpg'
import img4 from '../assets/299 4.jpg'

const categories = [
  { label: 'premiumOutfitImg', sub: 'The pieces everyone is reaching for', img: premiumOutfitImg, span: 'wide' },
  { label: 'Accessories', sub: 'From fine jewellery to statement bags', img: accessoriesImg, span: 'normal' },
  { label: 'Get Cozy', sub: 'Knitwear, loungewear & soft layers', img: cordImg, span: 'normal' },
  { label: 'New In', sub: 'Just landed this week', img: suiteWomenImg, span: 'normal' },
  { label: 'Basics', sub: 'The foundation of every great outfit', img: basicsImg, span: 'normal' },
  { label: 'It Girl', sub: 'Curated for the effortlessly cool', img: itGirlImg, span: 'normal' },
  { label: 'Men', sub: 'Sharp, relaxed, and everything between', img: fallImg, span: 'normal' },
  { label: 'Jackets', sub: 'Layer up in style', img: jacketsImg, span: 'normal' },
]

const heroImages = {
  left: traditionalWearImg,
  right: heroright,
}

const editorial = [
  { label: 'Fall Must-Haves', tag: 'New Arrivals', img: img1 },
  { label: 'Street Style Edit', tag: 'Trending', img: img2 },
  { label: 'Date Night', tag: 'Curated', img: img3 },
  { label: 'Weekend Casual', tag: 'Essentials', img: img4 },
]

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Hero — full bleed split */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div
            className={styles.heroImgPlaceholder}
            style={{
              backgroundImage: `url(${heroImages.left})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
        <div className={styles.heroCenter}>
          <p className={styles.heroEyebrow}>ThreadRent</p>
          <h1 className={styles.heroTitle}>Wear luxury<br />without owning it</h1>
          <p className={styles.heroSub}>Access thousands of premium pieces for a fraction of the price. Sustainable, effortless fashion rental — delivered to your door.</p>
          <Link to="/browse" className={styles.heroBtn}>Start Renting</Link>
          <div className={styles.trustSignals}>
            <span className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              10,000+ rentals completed
            </span>
            <span className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              Free returns
            </span>
            <span className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Delivered in 2–3 days
            </span>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div
            className={styles.heroImgPlaceholder}
            style={{
              backgroundImage: `url(${heroImages.right})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionDesc}>Rent premium fashion in four simple steps</p>
        </div>
        <div className={styles.stepsRow}>
          {[
            { num: '01', title: 'Browse', desc: 'Explore curated collections' },
            { num: '02', title: 'Rent', desc: 'Pick your dates & order' },
            { num: '03', title: 'Wear', desc: 'Enjoy your look with confidence' },
            { num: '04', title: 'Return', desc: 'Ship back — we handle cleaning' },
          ].map(step => (
            <div key={step.num} className={styles.stepCard}>
              <span className={styles.stepNum}>{step.num}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category grid row 1 */}
      <section className={styles.catGrid1}>
        {categories.slice(0, 4).map(category => (
          <div key={category.label} className={`${styles.catCell} ${category.span === 'wide' ? styles.catWide : ''}`}>
            <div
              className={styles.catBg}
              style={{
                backgroundImage: `url(${category.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className={styles.catLabel}>
              <span className={styles.catName}>{category.label}</span>
              {category.sub && <span className={styles.catSub}>{category.sub}</span>}
            </div>
          </div>
        ))}
      </section>

      {/* Category grid row 2 */}
      <section className={styles.catGrid2}>
        {categories.slice(4).map(category => (
          <div key={category.label} className={styles.catCell}>
            <div
              className={styles.catBg}
              style={{
                backgroundImage: `url(${category.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className={styles.catLabel}>
              <span className={styles.catName}>{category.label}</span>
              {category.sub && <span className={styles.catSub}>{category.sub}</span>}
            </div>
          </div>
        ))}
      </section>

      {/* Recommended for you */}
      <section className={styles.productSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recommended for you</h2>
          <Link to="/browse" className={styles.sectionLink}>View All →</Link>
        </div>
        <div className={styles.productScroll}>
          {[
            { title: 'Red Lehenga', price: '₹1800/day', img: img4 },
            { title: 'Anarkali Gown', price: '₹1200/day', img: img3 },
            { title: 'Gold Necklace Stack', price: '₹100/day', img: accessoriesImg },
            { title: 'Traditional Saree', price: '₹2500/day', img: traditionalWearImg },
            { title: 'Bodycon Dress', price: '₹1000/day', img: img2 },
          ].map((item, i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.productImg} style={{ backgroundImage: `url(${item.img})` }} />
              <div className={styles.productInfo}>
                <span className={styles.productTitle}>{item.title}</span>
                <span className={styles.productPrice}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending near you */}
      <section className={styles.productSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending near you</h2>
          <Link to="/browse" className={styles.sectionLink}>View All →</Link>
        </div>
        <div className={styles.productScroll}>
          {[
            { title: 'Premium Outfit', price: '₹2000/day', img: premiumOutfitImg },
            { title: 'It Girl Edit', price: '₹1500/day', img: itGirlImg },
            { title: 'Men\'s Fall Collection', price: '₹800/day', img: fallImg },
            { title: 'Date Night Dress', price: '₹900/day', img: img1 },
            { title: 'Sherwani Set', price: '₹2000/day', img: heroright },
          ].map((item, i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.productImg} style={{ backgroundImage: `url(${item.img})` }} />
              <div className={styles.productInfo}>
                <span className={styles.productTitle}>{item.title}</span>
                <span className={styles.productPrice}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently rented */}
      <section className={styles.productSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recently rented</h2>
          <Link to="/browse" className={styles.sectionLink}>View All →</Link>
        </div>
        <div className={styles.productScroll}>
          {[
            { title: 'Weekend Casual', price: '₹299/day', img: img1 },
            { title: 'Suite Women', price: '₹1100/day', img: suiteWomenImg },
            { title: 'Cozy Knitwear', price: '₹600/day', img: cordImg },
            { title: 'Bomber Jacket', price: '₹700/day', img: jacketsImg },
            { title: 'Fall Must-Have', price: '₹299/day', img: img2 },
          ].map((item, i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.productImg} style={{ backgroundImage: `url(${item.img})` }} />
              <div className={styles.productInfo}>
                <span className={styles.productTitle}>{item.title}</span>
                <span className={styles.productPrice}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial section */}
      <section className={styles.editorial}>
        <div className={styles.editorialHeader}>
          <h2 className={styles.editorialTitle}>Fall Must-Haves</h2>
          <Link to="/browse" className={styles.editorialLink}>View All →</Link>
        </div>
        <div className={styles.editorialGrid}>
          {editorial.map((item, i) => (
            <div key={i} className={styles.editorialCard}>
              <div
                className={styles.editorialImg}
                style={{
                  backgroundImage: `url(${item.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <div className={styles.editorialCardLabel}>
                <span className={styles.editorialTag}>{item.tag}</span>
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
