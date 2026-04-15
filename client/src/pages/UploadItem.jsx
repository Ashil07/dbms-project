import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { createItem, getClothTypes } from '../api/axios'
import styles from './FormPage.module.css'

export default function UploadItem() {
    const [clothTypes, setClothTypes] = useState([])
    const [form, setForm] = useState({
        name: '', description: '', rentalPrice: '', clothTypeId: '',
        size: '', color: '', brand: '', condition: 'Good',
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)
    const fileInputRef = useRef()

    useEffect(() => {
        getClothTypes().then((r) => setClothTypes(r.data.data || [])).catch(() => { })
    }, [])

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

    const handleFile = (file) => {
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.rentalPrice || !form.clothTypeId)
            return toast.error('Name, price, and cloth type are required')
        setSubmitting(true)
        try {
            const fd = new FormData()
            Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
            if (imageFile) fd.append('image', imageFile)

            const r = await createItem(fd)
            setResult(r.data.data)
            toast.success('Item listed successfully!')
            setForm({ name: '', description: '', rentalPrice: '', clothTypeId: '', size: '', color: '', brand: '', condition: 'Good' })
            setImageFile(null)
            setImagePreview(null)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload item')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.formWrap}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>List a New Item</h1>
                    <p className={styles.desc}>Upload your clothing item to the rental marketplace.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className={styles.grid}>
                        <div className={`${styles.group} ${styles.fullWidth}`}>
                            <label className={styles.label}>Item Name *</label>
                            <input type="text" className={styles.input} placeholder="e.g. Blue Banarasi Saree" value={form.name} onChange={set('name')} required />
                        </div>
                        <div className={`${styles.group} ${styles.fullWidth}`}>
                            <label className={styles.label}>Description</label>
                            <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Describe the item..." rows={3} value={form.description} onChange={set('description')} />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Rental Price / Day (₹) *</label>
                            <input type="number" className={styles.input} placeholder="e.g. 500" min="1" value={form.rentalPrice} onChange={set('rentalPrice')} required />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Cloth Type *</label>
                            <select className={styles.input} value={form.clothTypeId} onChange={set('clothTypeId')} required>
                                <option value="">-- Select Type --</option>
                                {clothTypes.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.category?.name})</option>)}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Size</label>
                            <select className={styles.input} value={form.size} onChange={set('size')}>
                                <option value="">-- Size --</option>
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Color</label>
                            <input type="text" className={styles.input} placeholder="e.g. Red, Gold" value={form.color} onChange={set('color')} />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Brand</label>
                            <input type="text" className={styles.input} placeholder="e.g. Fabindia" value={form.brand} onChange={set('brand')} />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Condition</label>
                            <select className={styles.input} value={form.condition} onChange={set('condition')}>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                            </select>
                        </div>
                        <div className={`${styles.group} ${styles.fullWidth}`}>
                            <label className={styles.label}>Item Image</label>
                            <div
                                className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
                                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
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
                                        <span className={styles.dropHint}>JPG, PNG, WEBP – Max 10MB</span>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.fullWidth}`} disabled={submitting}>
                        {submitting ? '⏳ Uploading...' : '📤 Upload Item'}
                    </button>
                </form>

                {result && (
                    <div className={styles.resultCard}>
                        <div className={styles.rcIcon}>✅</div>
                        <div>
                            <p className={styles.rcTitle}>Item Listed!</p>
                            <p className={styles.rcSub}><strong>{result.name}</strong> is now live on the marketplace.</p>
                            {result.imageUrl && <img src={result.imageUrl} alt={result.name} className={styles.resultImg} />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
