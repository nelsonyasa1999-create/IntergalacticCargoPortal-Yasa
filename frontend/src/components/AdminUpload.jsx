import { useRef, useState } from 'react';
import { uploadManifest } from '../api/api';

const MAX_FILE_BYTES = 2 * 1024 * 1024;

export default function AdminUpload({ token, onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateFile = (selected) => {
    if (!selected) {
      return 'Select a manifest.txt file.';
    }
    if (!selected.name.toLowerCase().endsWith('.txt')) {
      return 'Only .txt manifest files are allowed.';
    }
    if (selected.size > MAX_FILE_BYTES) {
      return 'File exceeds 2 MB limit.';
    }
    return null;
  };

  const handleFileChange = (selected) => {
    const validationError = validateFile(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setError('');
    setMessage('');
    setFile(selected);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await uploadManifest(token, file);
      setMessage(
        `Transmission complete — ${result.savedCount} saved, ${result.skippedCount} skipped.`
      );
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      onUploaded();
    } catch (err) {
      if (err.status === 403) {
        setError(err.message || 'Clearance level inadequate.');
      } else {
        setError(err.message || 'Upload failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-panel glass-panel">
      <div className="section-head">
        <h2>Manifest uplink</h2>
      </div>
      <form onSubmit={handleUpload} className="upload-form">
        <input
          ref={inputRef}
          className="manifest-file-input"
          type="file"
          accept=".txt,text/plain"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          className="btn-primary upload-picker"
          onClick={openFilePicker}
          disabled={loading}
        >
          Choose File
        </button>
        <span className="selected-file" aria-live="polite">
          {file ? file.name : 'No manifest selected'}
        </span>
        <button type="submit" className="btn-ghost upload-submit" disabled={loading || !file}>
          {loading ? 'Uploading…' : 'File Upload'}
        </button>
      </form>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </section>
  );
}
