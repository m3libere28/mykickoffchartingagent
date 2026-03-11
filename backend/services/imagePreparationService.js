const fs = require('fs');
const util = require('util');
const heicConvert = require('heic-convert');
const sharp = require('sharp');

const readFileAsync = util.promisify(fs.readFile);

exports.prepareStandardImage = async (filePath, mimeType) => {
  try {
    // Stream directly from disk to Sharp (avoids V8 OOM on Render free tier for 3+ images)
    const resizedBuffer = await sharp(filePath)
        .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75 })
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
      quality: 0.75
    });
    
    // Downscale standard dimensions
    const resizedBuffer = await sharp(outputBuffer)
        .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75 })
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
