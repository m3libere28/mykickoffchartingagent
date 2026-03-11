const fs = require('fs');
const util = require('util');
const heicConvert = require('heic-convert');

const readFileAsync = util.promisify(fs.readFile);

exports.prepareStandardImage = async (filePath, mimeType) => {
  try {
    const imageBuffer = await readFileAsync(filePath);
    const base64Image = imageBuffer.toString('base64');
    return {
      type: 'image_url',
      image_url: {
        url: `data:${mimeType || 'image/jpeg'};base64,${base64Image}`
      }
    };
  } catch (err) {
    console.error(`Error preparing image ${filePath}:`, err);
    throw new Error('Failed to prepare image for AI processing.');
  }
};

exports.convertAndPrepareHeic = async (filePath) => {
  try {
    const inputBuffer = await readFileAsync(filePath);
    
    // Convert HEIC to JPEG buffer
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.8 // 80% quality
    });
    
    const base64Image = outputBuffer.toString('base64');
    return {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${base64Image}`
      }
    };
  } catch (err) {
    console.error(`Error converting HEIC image ${filePath}:`, err);
    throw new Error('Failed to convert HEIC image. The file might be corrupted or unsupported.');
  }
};
