const fileTriageService = require('../services/fileTriageService');
const deIdentificationService = require('../services/deIdentificationService');
const followUpService = require('../services/followUpService');
const validationService = require('../services/validationService');
const fs = require('fs');

exports.processFollowUpFiles = async (req, res) => {
  const allFiles = [];
  
  try {
    const previousFiles = req.files['previousFiles'] || [];
    const newFiles = req.files['newFiles'] || [];
    allFiles.push(...previousFiles, ...newFiles);

    if (newFiles.length === 0) {
      cleanupFiles(allFiles);
      return res.status(400).json({ error: 'New follow-up notes are required.' });
    }

    // STAGE 1 & 2: Extract text/images from both sets
    let previousData = { fullText: '', images: [], hasContent: false };
    let newData = { fullText: '', images: [], hasContent: false };

    if (previousFiles.length > 0) {
      previousData = await fileTriageService.processUploadedFiles(previousFiles);
    }
    
    newData = await fileTriageService.processUploadedFiles(newFiles);

    if (!newData.hasContent) {
      cleanupFiles(allFiles);
      return res.status(400).json({ error: 'No verifiable content could be extracted from the new follow-up notes.' });
    }

    // STAGE 2.5: De-Identification Scan on both sets
    let phiWarning = false;

    if (previousData.fullText) {
      const { cleanText, hasPhi } = deIdentificationService.scanAndMask(previousData.fullText);
      previousData.fullText = cleanText;
      if (hasPhi) phiWarning = true;
    }

    if (newData.fullText) {
      const { cleanText, hasPhi } = deIdentificationService.scanAndMask(newData.fullText);
      newData.fullText = cleanText;
      if (hasPhi) phiWarning = true;
    }

    // STAGE 3: Follow-Up AI Extraction
    const preferences = req.body.preferences ? JSON.parse(req.body.preferences) : null;
    const rawAiOutput = await followUpService.generateFollowUpDraftADIME(previousData, newData, preferences);
    
    if (!rawAiOutput) {
      cleanupFiles(allFiles);
      return res.status(500).json({ error: 'Failed to generate follow-up ADIME output from AI service.' });
    }

    // STAGE 4: Validation
    const validatedOutput = validationService.validateOutput(rawAiOutput);
    
    // Attach PHI warning flag and follow-up specific fields
    validatedOutput.phi_warning = phiWarning;
    // Ensure follow-up flags exist
    validatedOutput.is_follow_up = true;

    // Clean up temporary files
    cleanupFiles(allFiles);

    res.json(validatedOutput);

  } catch (error) {
    console.error('Error processing follow-up files:', error);
    if (allFiles.length > 0) cleanupFiles(allFiles);
    res.status(500).json({ error: error.message || 'Internal server error during follow-up processing.' });
  }
};

function cleanupFiles(files) {
  files.forEach(file => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      console.error(`Failed to cleanup file ${file.path}`, err);
    }
  });
}
