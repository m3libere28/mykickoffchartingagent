const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAuth } = require('./auth');
const extractController = require('../controllers/extractController');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max overall
  },
  fileFilter: (req, file, cb) => {
    // Only accept specific files
    const allowedMimeTypes = [
      'text/plain',
      'application/pdf',
      'image/jpeg',
      'image/png',
      // Allow HEIC
      'image/heic',
      'image/heif'
    ];
    
    // Also check extensions lightly just in case MIME is generic
    const ext = file.originalname.toLowerCase();
    const isAllowedExt = ext.endsWith('.txt') || 
                         ext.endsWith('.pdf') || 
                         ext.endsWith('.jpg') || 
                         ext.endsWith('.jpeg') || 
                         ext.endsWith('.png') || 
                         ext.endsWith('.heic');

    if (allowedMimeTypes.includes(file.mimetype) || isAllowedExt) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.originalname}`), false);
    }
  }
});

// The main extraction route
router.post('/', requireAuth, upload.array('files', 10), extractController.processFiles);

module.exports = router;
