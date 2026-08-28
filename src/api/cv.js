import { postFile } from './client.js';

export const MAX_CV_BYTES = 10 * 1024 * 1024;

/**
 * Rejects a file before upload. Returns null when the file is acceptable.
 * @returns {string | null} message to display, or null
 */
export function validateCvFile(file) {
  if (!file) return 'Choose a PDF file to upload.';

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) return 'That file is not a PDF. Upload your CV as a PDF.';

  if (file.size > MAX_CV_BYTES) return 'That file exceeds 10 MB. Upload a smaller PDF.';

  return null;
}

/** @returns {Promise<import('../types/api.js').StructuredCv>} */
export async function parseCv(file) {
  const { cv } = await postFile('/api/cv/parse', file);
  return cv;
}
