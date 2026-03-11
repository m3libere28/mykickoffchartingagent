const fileTriageService = require('../services/fileTriageService');
const textExtractionService = require('../services/textExtractionService');
const deIdentificationService = require('../services/deIdentificationService');
const aiService = require('../services/aiService');
const validationService = require('../services/validationService');
const fs = require('fs');

exports.processFiles = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    // STAGE 1 & 2: Triage and extract text/images
    const extractedData = await fileTriageService.processUploadedFiles(files);
    
    if (!extractedData.hasContent) {
      // Clean up files before returning error
      cleanupFiles(files);
      return res.status(400).json({ error: 'No verifiable content could be extracted from the uploaded files.' });
    }

    // STAGE 2.5: De-Identification Scan on any text content
    let phiWarning = false;
    if (extractedData.fullText) {
      const { cleanText, hasPhi } = deIdentificationService.scanAndMask(extractedData.fullText);
      extractedData.fullText = cleanText;
      phiWarning = hasPhi;
    }

    // STAGE 3: AI Extraction
    const rawAiOutput = await aiService.generateDraftADIME(extractedData);
    
    if (!rawAiOutput) {
       cleanupFiles(files);
       return res.status(500).json({ error: 'Failed to generate ADIME output from AI service.' });
    }

    // STAGE 4: Validation
    const validatedOutput = validationService.validateOutput(rawAiOutput);
    
    // Attach PHI warning flag
    validatedOutput.phi_warning = phiWarning;

    // Clean up temporary files
    cleanupFiles(files);

    res.json(validatedOutput);

  } catch (error) {
    console.error('Error processing files:', error);
    // Try to cleanup even on error
    if (req.files) cleanupFiles(req.files);
    res.status(500).json({ error: error.message || 'Internal server error during processing.' });
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
