import React, { useState } from 'react';

// Ganti dengan URL Railway kamu (sama seperti di gallery.js)
const BACKEND_URL = 'https://eltri-project-production.up.railway.app';

function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Pilih file dulu ya!');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('date', date);
    formData.append('desc', desc);

    try {
      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Upload berhasil!');
        setFile(null);
        setDate('');
        setDesc('');
        if (onUploadSuccess) onUploadSuccess(data.item);
      } else {
        setMessage(`Gagal: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <h3>Upload Foto / Video</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pilih File (foto/video):</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tanggal:</label>
          <input
            type="text"
            placeholder="contoh: 17/06,juni,2026"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Keterangan:</label>
          <input
            type="text"
            placeholder="contoh: Lokasi di Makassar"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Mengupload...' : 'Upload'}
        </button>

        {message && <p className="upload-message">{message}</p>}
      </form>
    </div>
  );
}

export default UploadForm;
