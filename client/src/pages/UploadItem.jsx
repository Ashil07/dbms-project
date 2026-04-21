import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { createItem, getCategories, getClothTypes } from '../api/axios'
import styles from './FormPage.module.css'

export default function UploadItem() {
  const [categories, setCategories] = useState([])
  const [clothTypes, setClothTypes] = useState([])
  const [filteredTypes, setFilteredTypes] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  const [form, setForm] = useState({
    name: '', description: '', rentalPrice: '', clothTypeId: '',
    size: '', color: '', brand: '', condition: 'Good', quantity: 1,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef()

  // Load all categories and cloth types on mount
  useEffect(() => {
    Promise.all([getCategories(), getClothTypes()])
      .then(([catRes, typeRes]) => {
        setCategories(catRes.data.data || [])
        setClothTypes(typeRes.data.data || [])
      })
      .catch(() => {})
  }, [])

  // Filter cloth types when category changes
  useEffect(() => {
    if (!selectedCategoryId) {
      setFilteredTypes([])
      setForm(f => ({ ...f, clothTypeId: '' }))
      return
    }
    const filtered = clothTypes.filter(t => t.categoryId === parseInt(selectedCategoryId))
    setFilteredTypes(filtered)
    setForm(f => ({ ...f, clothTypeId: '' }))
  }, [selectedCategoryId, clothTypes])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleFile = file => {
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.rentalPrice || !form.clothTypeId || !form.quantity)
      return toast.error('Name, price, quantity, and cloth type are required')
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (imageFile) fd.append('image', imageFile)

      const r = await createItem(fd)
      setResult(r.data.data)
      toast.success('Item listed successfully!')
      setForm({ name: '', description: '', rentalPrice: '', clothTypeId: '', size: '', color: '', brand: '', condition: 'Good', quantity: 1 })
      setSelectedCategoryId('')
      setImageFile(null)
      setImagePreview(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload item')
    } finally {
      setSubmitting(false)
    }
  }

  // Group categories for the select optgroups
  const weddingCats = categories.filter(c => c.name.toLowerCase().includes('wedding'))
  const ethnicCats = categories.filter(c => c.name.toLowerCase().includes('ethnic'))
  const westernCats = categories.filter(c => c.name.toLowerCase().includes('western'))
  const partyCats = categories.filter(c => c.name.toLowerCase().includes('party'))
  const otherCats = categories.filter(c =>
    !c.name.toLowerCase().includes('wedding') &&
    !c.name.toLowerCase().includes('ethnic') &&
    !c.name.toLowerCase().includes('western') &&
    !c.name.toLowerCase().includes('party')
  )

  const renderOptGroup = (label, cats) =>
    cats.length > 0 ? (
      <optgroup key={label} label={label}>
        {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </optgroup>
    ) : null

  return (
    <div className={styles.page}>
      <div className={styles.formWrap}>
        <div className={styles.formHeader}>
          <h1 className={styles.title}>List a New Item</h1>
          <p className={styles.desc}>Upload your clothing item to the rental marketplace.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.grid}>

            {/* Item name */}
            <div className={`${styles.group} ${styles.fullWidth}`}>
              <label className={styles.label}>Item Name *</label>
              <input type="text" className={styles.input} placeholder="e.g. Red Bridal Lehenga" value={form.name} onChange={set('name')} required />
            </div>

            {/* Description */}
            <div className={`${styles.group} ${styles.fullWidth}`}>
              <label className={styles.label}>Description</label>
              <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Describe the item, fabric, embroidery, occasion..." rows={3} value={form.description} onChange={set('description')} />
            </div>

            {/* Category (step 1) */}
            <div className={styles.group}>
              <label className={styles.label}>Category *</label>
              <select
                className={styles.input}
                value={selectedCategoryId}
                onChange={e => setSelectedCategoryId(e.target.value)}
                required
              >
                <option value="">— Select Category —</option>
                {renderOptGroup('Wedding', weddingCats)}
                {renderOptGroup('Ethnic', ethnicCats)}
                {renderOptGroup('Western', westernCats)}
                {renderOptGroup('Party & Festive', partyCats)}
                {renderOptGroup('Other', otherCats)}
              </select>
            </div>

            {/* Cloth Type (step 2 — filtered by category) */}
            <div className={styles.group}>
              <label className={styles.label}>Cloth Type *</label>
              <select
                className={styles.input}
                value={form.clothTypeId}
                onChange={set('clothTypeId')}
                required
                disabled={!selectedCategoryId}
              >
                <option value="">
                  {selectedCategoryId ? '— Select Type —' : '— Pick a category first —'}
                </option>
                {filteredTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {selectedCategoryId && filteredTypes.length === 0 && (
                <span className={styles.fieldHint}>No types found for this category.</span>
              )}
            </div>

            {/* Price */}
            <div className={styles.group}>
              <label className={styles.label}>Rental Price / Day (₹) *</label>
              <input type="number" className={styles.input} placeholder="e.g. 1500" min="1" value={form.rentalPrice} onChange={set('rentalPrice')} required />
            </div>

            {/* Quantity */}
            <div className={styles.group}>
              <label className={styles.label}>Quantity Available *</label>
              <input type="number" className={styles.input} placeholder="e.g. 5" min="1" value={form.quantity} onChange={set('quantity')} required />
            </div>

            {/* Size */}
            <div className={styles.group}>
              <label className={styles.label}>Size</label>
              <select className={styles.input} value={form.size} onChange={set('size')}>
                <option value="">— Size —</option>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Color */}
            <div className={styles.group}>
              <label className={styles.label}>Color</label>
              <input type="text" className={styles.input} placeholder="e.g. Maroon, Gold" value={form.color} onChange={set('color')} />
            </div>

            {/* Brand */}
            <div className={styles.group}>
              <label className={styles.label}>Brand / Designer</label>
              <input type="text" className={styles.input} placeholder="e.g. Sabyasachi, Manyavar" value={form.brand} onChange={set('brand')} />
            </div>

            {/* Condition */}
            <div className={styles.group}>
              <label className={styles.label}>Condition</label>
              <select className={styles.input} value={form.condition} onChange={set('condition')}>
                <option value="Excellent">Excellent — Like new</option>
                <option value="Good">Good — Minor wear</option>
                <option value="Fair">Fair — Visible wear</option>
              </select>
            </div>

            {/* Image upload */}
            <div className={`${styles.group} ${styles.fullWidth}`}>
              <label className={styles.label}>Item Image</label>
              <div
                className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className={styles.preview} />
                ) : (
                  <div className={styles.dropContent}>
                    <span className={styles.dropIcon}>📸</span>
                    <p>Drag & drop or <span className={styles.dropLink}>browse</span></p>
                    <span className={styles.dropHint}>JPG, PNG, WEBP — Max 10MB</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              </div>
            </div>
          </div>

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.fullWidth}`} disabled={submitting}>
            {submitting ? 'Uploading...' : 'List Item'}
          </button>
        </form>

        {result && (
          <div className={styles.resultCard}>
            <div className={styles.rcIcon}>✓</div>
            <div>
              <p className={styles.rcTitle}>Item Listed</p>
              <p className={styles.rcSub}><strong>{result.name}</strong> is now live on the marketplace.</p>
              {result.imageUrl && <img src={result.imageUrl} alt={result.name} className={styles.resultImg} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
