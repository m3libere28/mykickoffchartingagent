const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAuth } = require('./auth');
const followUpController = require('../controllers/followUpController');

// Configure multer for dual file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'text/plain',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/heic',
      'image/heif'
    ];
    
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

// Accept two named file groups
const uploadFields = upload.fields([
  { name: 'previousFiles', maxCount: 10 },
  { name: 'newFiles', maxCount: 10 }
]);

// The follow-up extraction route
router.post('/', requireAuth, uploadFields, followUpController.processFollowUpFiles);

module.exports = router;
