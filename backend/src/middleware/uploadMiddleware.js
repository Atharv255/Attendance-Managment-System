const multer = require('multer');
const { selfieStorage } = require('../config/cloudinary');
const { errorResponse } = require('../utils/apiResponse');
const logger = require('../config/logger');

// File filter - only allow images
const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn(`File upload rejected: Invalid mime type ${file.mimetype}`);
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed'), false);
  }
};

// Multer upload with Cloudinary storage
const uploadSelfie = multer({
  storage: selfieStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1,
  },
});

// Middleware for single selfie upload
const selfieUpload = (req, res, next) => {
  const upload = uploadSelfie.single('selfie');

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      logger.error(`Multer error: ${err.message}`);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return errorResponse(res, 400, 'File size cannot exceed 5MB');
      }
      return errorResponse(res, 400, `File upload error: ${err.message}`);
    }

    if (err) {
      logger.error(`Upload error: ${err.message}`);
      return errorResponse(res, 400, err.message);
    }

    next();
  });
};

module.exports = { selfieUpload };