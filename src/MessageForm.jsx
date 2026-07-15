<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';

const HCAPTCHA_SITEKEY = '0bb09810-0a16-49f6-bade-a0aa1c10b394';
>>>>>>> d3f4ac4829a770f2571045cd8e6db7d052d27864

function MessageForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
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
>>>>>>> d3f4ac4829a770f2571045cd8e6db7d052d27864

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      setStatus('error-input');
      return;
    }

<<<<<<< HEAD
=======
    if (!captchaToken) {
      setStatus('error-captcha');
      return;
    }

>>>>>>> d3f4ac4829a770f2571045cd8e6db7d052d27864
    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
        body: JSON.stringify({ name, message }),
=======
        body: JSON.stringify({ name, message, captchaToken }),
>>>>>>> d3f4ac4829a770f2571045cd8e6db7d052d27864
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setName('');
        setMessage('');
<<<<<<< HEAD
=======
        setCaptchaToken('');
        // Reset captcha
        if (window.hcaptcha) window.hcaptcha.reset();
>>>>>>> d3f4ac4829a770f2571045cd8e6db7d052d27864
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
<<<<<<< HEAD
=======

      {/* hCaptcha widget */}
      <div
        ref={captchaRef}
        className="h-captcha"
        data-sitekey={HCAPTCHA_SITEKEY}
        data-callback="onHcaptchaSuccess"
        data-expired-callback="onHcaptchaExpired"
        style={{ marginTop: '8px' }}
      ></div>

>>>>>>> d3f4ac4829a770f2571045cd8e6db7d052d27864
      <button
        className="message-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Mengirim...' : 'Kirim Pesan Server'}
      </button>
<<<<<<< HEAD
      {status === 'success' && <p className="message-success">✅ Pesan terkirim!</p>}
      {status === 'error-input' && <p className="message-error">❌ Isi nama dan pesan dulu!</p>}
=======

      {status === 'success' && <p className="message-success">✅ Pesan terkirim!</p>}
      {status === 'error-input' && <p className="message-error">❌ Isi nama dan pesan dulu!</p>}
      {status === 'error-captcha' && <p className="message-error">❌ Selesaikan CAPTCHA dulu!</p>}
>>>>>>> d3f4ac4829a770f2571045cd8e6db7d052d27864
      {status === 'error' && <p className="message-error">❌ Gagal kirim pesan!</p>}
    </div>
  );
}

export default MessageForm;