/**
 * Very basic De-Identification Service
 * WARNING: This string-matching based regex is NOT a complete HIPAA-compliant
 * de-identification tool. It is only meant to catch obvious mistakes and 
 * warn the user before the payload is sent to OpenAI.
 */

// Simple regex patterns to identify common PHI
const phiRegexes = [
  // Social Security Numbers (SSN) e.g. 000-00-0000 or 000 00 0000
  /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
  
  // Phone numbers (US formats) e.g., 555-555-5555, (555) 555-5555
  /\b(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?[2-9]\d{2}[-.\s]?\d{4}\b/g,
  
  // Email addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Dates of Birth (DOB) e.g. DOB: 01/01/1990, DOB 1/1/90
  /\bDOB\s*[:\-]?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
  
  // MRN Patterns (varies wildly, common format MRN: 123456)
  /\bMRN\s*[:\-]?\s*[A-Z0-9]{5,10}\b/gi,

  // Zip codes (US) - often found in addresses
  /\b\d{5}(?:-\d{4})?\b/g
];

exports.scanAndMask = (text) => {
  if (!text) return { cleanText: text, hasPhi: false };

  let cleanText = text;
  let hasPhi = false;

  phiRegexes.forEach(regex => {
    if (regex.test(cleanText)) {
      hasPhi = true;
      // Masking the matched pattern to prevent sending to AI
      cleanText = cleanText.replace(regex, '[POSSIBLE_PHI_REDACTED]');
    }
  });

  // Note: Finding names and street addresses reliably with basic regex is very prone 
  // to false positives/negatives without an NLP library. For MVP, we rely on the 
  // patterns above and the explicit user warnings in the UI.

  return { cleanText, hasPhi };
};
