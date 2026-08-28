import { describe, expect, it } from 'vitest';
import { MAX_CV_BYTES, validateCvFile } from '../../src/api/cv.js';

function fileOf({ name = 'cv.pdf', type = 'application/pdf', size = 1024 } = {}) {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('validateCvFile', () => {
  it('accepts a PDF within the size limit', () => {
    expect(validateCvFile(fileOf())).toBeNull();
  });

  it('accepts a PDF whose type is missing but extension is correct', () => {
    expect(validateCvFile(fileOf({ type: '' }))).toBeNull();
  });

  it('rejects a non-PDF', () => {
    expect(validateCvFile(fileOf({ name: 'cv.png', type: 'image/png' }))).toMatch(/not a PDF/i);
  });

  it('rejects a PDF over 10 MB', () => {
    expect(validateCvFile(fileOf({ size: MAX_CV_BYTES + 1 }))).toMatch(/exceeds 10 MB/i);
  });

  it('rejects a missing file', () => {
    expect(validateCvFile(null)).toMatch(/choose a PDF/i);
  });
});
