import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard.jsx';
import GradientButton from '../../components/ui/GradientButton.jsx';
import IntakeLayout from '../../components/intake/IntakeLayout.jsx';
import CvDropzone from '../../components/intake/CvDropzone.jsx';
import UploadedFileChip from '../../components/intake/UploadedFileChip.jsx';
import { parseCv, validateCvFile } from '../../api/cv.js';
import { useIntakeStore } from '../../store/intakeStore.js';

const REQUIRED_MESSAGE = 'CV is required before you can continue.';

export default function Background() {
  const navigate = useNavigate();
  const cv = useIntakeStore((state) => state.cv);
  const cvParsed = useIntakeStore((state) => state.cvParsed);
  const setCv = useIntakeStore((state) => state.setCv);
  const clearCv = useIntakeStore((state) => state.clearCv);

  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleSelect(file) {
    const invalid = validateCvFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const parsed = await parseCv(file);
      setCv({ ...parsed, fileName: file.name, fileSize: file.size });
    } catch (cause) {
      setError(cause.message);
    } finally {
      setUploading(false);
    }
  }

  function handleContinue() {
    if (!cvParsed) {
      setError(REQUIRED_MESSAGE);
      return;
    }

    navigate('/diagnostic/break');
  }

  return (
    <IntakeLayout
      stageIndex={0}
      title="Upload your CV"
      intro="We analyze your previous experience to extract your core professional skills automatically."
    >
      <GlassCard className="p-6">
        <h2 className="text-sm text-ink-soft">
          Select your CV file <span className="text-pink-600">*</span>
        </h2>

        <div className="mt-3">
          {cvParsed && cv ? (
            // Keeps the dropzone frame around the accepted file.
            <div className="rounded-2xl border border-dashed border-ink-faint/35 bg-white/40 p-4">
              <UploadedFileChip
                fileName={cv.fileName}
                fileSize={cv.fileSize}
                onRemove={() => {
                  clearCv();
                  setError(null);
                }}
              />
            </div>
          ) : (
            <CvDropzone onSelect={handleSelect} disabled={uploading} />
          )}
        </div>

        {uploading && <p className="mt-3 text-sm text-ink-soft">Reading your CV…</p>}

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-pink-600">
            {error}
          </p>
        )}
      </GlassCard>

      <div className="mt-8 flex justify-end">
        <GradientButton onClick={handleContinue} disabled={uploading}>
          Continue to Career Break
          <span aria-hidden="true">→</span>
        </GradientButton>
      </div>
    </IntakeLayout>
  );
}
