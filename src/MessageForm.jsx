import React, { useState, useEffect, useRef } from 'react';

const HCAPTCHA_SITEKEY = '0bb09810-0a16-49f6-bade-a0aa1c10b394';

function MessageForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef(null);

  // Load hCaptcha script
  useEffect(() => {
    if (!document.getElementById('hcaptcha-script')) {
      const script = document.createElement('script');
      script.id = 'hcaptcha-script';
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Setup callback
    window.onHcaptchaSuccess = (token) => {
      setCaptchaToken(token);
    };
    window.onHcaptchaExpired = () => {
      setCaptchaToken('');
    };
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      setStatus('error-input');
      return;
    }

    if (!captchaToken) {
      setStatus('error-captcha');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, captchaToken }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setName('');
        setMessage('');
        setCaptchaToken('');
        // Reset captcha
        if (window.hcaptcha) window.hcaptcha.reset();
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('error');
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

      {/* hCaptcha widget */}
      <div
        ref={captchaRef}
        className="h-captcha"
        data-sitekey={HCAPTCHA_SITEKEY}
        data-callback="onHcaptchaSuccess"
        data-expired-callback="onHcaptchaExpired"
        style={{ marginTop: '8px' }}
      ></div>

      <button
        className="message-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Mengirim...' : 'Kirim Pesan Server'}
      </button>

      {status === 'success' && <p className="message-success">✅ Pesan terkirim!</p>}
      {status === 'error-input' && <p className="message-error">❌ Isi nama dan pesan dulu!</p>}
      {status === 'error-captcha' && <p className="message-error">❌ Selesaikan CAPTCHA dulu!</p>}
      {status === 'error' && <p className="message-error">❌ Gagal kirim pesan!</p>}
    </div>
  );
}

export default MessageForm;