import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 15000,
})

// Items
export const getItems = (params) => api.get('/items', { params })
export const getItemById = (id) => api.get(`/items/${id}`)
export const createItem = (formData) =>
    api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateItem = (id, formData) =>
    api.put(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteItem = (id) => api.delete(`/items/${id}`)

// Rentals
export const getRentals = (params) => api.get('/rentals', { params })
export const getRentalById = (id) => api.get(`/rentals/${id}`)
export const createRental = (data) => api.post('/rentals', data)
export const returnRental = (id, data) => api.patch(`/rentals/${id}/return`, data)

// Payments
export const getPayments = (params) => api.get('/payments', { params })
export const createPayment = (data) => api.post('/payments', data)
export const refundPayment = (id) => api.patch(`/payments/${id}/refund`)

// Categories
export const getCategories = () => api.get('/categories')
export const createCategory = (data) => api.post('/categories', data)
export const getClothTypes = (params) => api.get('/categories/cloth-types', { params })
export const createClothType = (data) => api.post('/categories/cloth-types', data)

// Users
export const getUsers = () => api.get('/users')
export const createUser = (data) => api.post('/users', data)
export const getUserById = (id) => api.get(`/users/${id}`)

// Coupons
export const getCoupons = () => api.get('/coupons')
export const createCoupon = (data) => api.post('/coupons', data)
export const validateCoupon = (data) => api.post('/coupons/validate', data)

// Reviews
export const getItemReviews = (itemId) => api.get(`/reviews/item/${itemId}`)
export const createReview = (data) => api.post('/reviews', data)

export default api
