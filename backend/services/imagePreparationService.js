const fs = require('fs');
const util = require('util');
const heicConvert = require('heic-convert');
const sharp = require('sharp');

const readFileAsync = util.promisify(fs.readFile);

exports.prepareStandardImage = async (filePath, mimeType) => {
  try {
    const imageBuffer = await readFileAsync(filePath);
    // Resize the image to prevent 20MB payload limit errors and save memory on free tier
    const resizedBuffer = await sharp(imageBuffer)
        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

    const base64Image = resizedBuffer.toString('base64');
    return {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${base64Image}`,
        detail: 'auto'
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
      quality: 0.8
    });
    
    // Downscale standard dimensions
    const resizedBuffer = await sharp(outputBuffer)
        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

    const base64Image = resizedBuffer.toString('base64');
    return {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${base64Image}`,
        detail: 'auto'
      }
    };
  } catch (err) {
    console.error(`Error converting HEIC image ${filePath}:`, err);
    throw new Error('Failed to convert HEIC image. The file might be corrupted or unsupported.');
  }
};
