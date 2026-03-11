const fs = require('fs');
const util = require('util');
const pdfParse = require('pdf-parse');

const readFileAsync = util.promisify(fs.readFile);

exports.extractFromTxt = async (filePath) => {
  try {
    const data = await readFileAsync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`Error reading TXT file ${filePath}:`, err);
    throw new Error('Failed to extract text from TXT file.');
  }
};

exports.extractFromPdf = async (filePath) => {
  try {
    const dataBuffer = await readFileAsync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (err) {
    console.error(`Error reading PDF file ${filePath}:`, err);
    throw new Error('Failed to extract text from PDF file. It might be an image-only PDF without OCR.');
  }
};
