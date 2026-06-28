import React, { useState } from 'react';

function MessageForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      setStatus('error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setName('');
        setMessage('');
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (err) {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div className="message-form">
      <h4 className="message-title">💬 Tinggalkan Pesan</h4>
      <input
        className="message-input"
        type="text"
        placeholder="Nama kamu"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <textarea
        className="message-textarea"
        placeholder="Tulis pesanmu..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={3}
      />
      <button
        className="message-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Mengirim...' : 'Kirim Pesan 🚀'}
      </button>
      {status === 'success' && <p className="message-success">✅ Pesan terkirim!</p>}
      {status === 'error' && <p className="message-error">❌ Gagal! Isi nama dan pesan dulu.</p>}
    </div>
  );
}

export default MessageForm;
