const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const logger = require('./logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

logger.info('Cloudinary configured successfully');

// Cloudinary storage for selfies
const selfieStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'attendance-selfies',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' },
      { quality: 'auto' },
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const userId = req.user ? req.user._id : 'unknown';
      return `selfie_${userId}_${timestamp}`;
    },
  },
});

module.exports = { cloudinary, selfieStorage };