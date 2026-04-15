const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpeg, png, webp, gif) are allowed!'), false);
        }
    },
});

/**
 * Stream upload buffer to Cloudinary
 * @param {Buffer} buffer 
 * @param {string} folder 
 * @returns {Promise}
 */
const uploadToCloudinary = (buffer, folder = 'cloth-rental') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto:good' },
                    { format: 'webp' },
                ],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

/**
 * Delete image from Cloudinary by public_id
 * @param {string} publicId 
 * @returns {Promise}
 */
const deleteFromCloudinary = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, upload, uploadToCloudinary, deleteFromCloudinary };
