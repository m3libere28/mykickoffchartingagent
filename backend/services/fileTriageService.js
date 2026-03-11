const textExtractionService = require('./textExtractionService');
const imagePreparationService = require('./imagePreparationService');
const path = require('path');

exports.processUploadedFiles = async (files) => {
  const extractedData = {
    fullText: '',
    images: [], // Array of base64 encoded images with mime type ready for OpenAI Vision
    hasContent: false
  };

  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (ext === '.txt' || mime === 'text/plain') {
      const text = await textExtractionService.extractFromTxt(file.path);
      extractedData.fullText += `\\n--- Text Note ---\\n${text}\\n`;
      extractedData.hasContent = true;
    } 
    else if (ext === '.pdf' || mime === 'application/pdf') {
      const text = await textExtractionService.extractFromPdf(file.path);
      extractedData.fullText += `\\n--- PDF Note ---\\n${text}\\n`;
      extractedData.hasContent = true;
    }
    else if (
        ext === '.jpg' || ext === '.jpeg' || ext === '.png' || 
        mime === 'image/jpeg' || mime === 'image/png'
    ) {
      const imageObj = await imagePreparationService.prepareStandardImage(file.path, mime);
      extractedData.images.push(imageObj);
      extractedData.hasContent = true;
    }
    else if (ext === '.heic' || mime === 'image/heic' || mime === 'image/heif') {
      const imageObj = await imagePreparationService.convertAndPrepareHeic(file.path);
      extractedData.images.push(imageObj);
      extractedData.hasContent = true;
    }
  }

  return extractedData;
};
