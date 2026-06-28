import React, { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'eltri2026';
const ADMIN_TOKEN = 'eltri2026';

function AdminMessages() {
  const [auth, setAuth] = useState(false);
  const [inputPass, setInputPass] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sembunyikan navbar saat di halaman admin
  useEffect(() => {
    const navbar = document.querySelector('container-navbar') || document.querySelector('nav') || document.querySelector('header');
    if (navbar) navbar.style.display = 'none';
    document.body.style.background = '#0a0a0a';
    return () => {
      if (navbar) navbar.style.display = '';
      document.body.style.background = '';
    };
  }, []);

  const login = () => {
    if (inputPass === ADMIN_PASSWORD) {
      setAuth(true);
      fetchMessages();
    } else {
      alert('Password salah!');
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    const res = await fetch('/api/messages', {
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Hapus pesan ini?')) return;
    await fetch(`/api/messages?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    setMessages(prev => prev.filter(m => m._id !== id));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID');
  };

  if (!auth) {
    return (
      <div style={styles.loginWrap}>
        <div style={{
          ...styles.loginBox,
          width: isMobile ? '88%' : '320px',
          padding: isMobile ? '28px 20px' : '40px',
        }}>
          <h2 style={styles.loginTitle}>🔐 Admin Messages</h2>
          <input
            style={styles.input}
            type="password"
            placeholder="Masukkan password"
            value={inputPass}
            onChange={e => setInputPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          <button style={styles.btn} onClick={login}>Masuk</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      ...styles.wrap,
      padding: isMobile ? '24px 12px' : '40px 24px',
    }}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, fontSize: isMobile ? '17px' : '22px' }}>
          💬 Pesan Masuk <span style={{ color: '#71717a', fontSize: '13px' }}>({messages.length})</span>
        </h2>
        <button style={styles.refreshBtn} onClick={fetchMessages}>🔄 Refresh</button>
      </div>

      {loading && <p style={styles.loading}>Loading...</p>}

      {messages.length === 0 && !loading && (
        <p style={styles.empty}>Belum ada pesan masuk.</p>
      )}

      {messages.map((msg) => (
        <div key={msg._id} style={styles.card}>
          <div style={{
            ...styles.cardHeader,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '2px' : '0',
          }}>
            <span style={styles.name}>👤 {msg.name}</span>
            <span style={styles.date}>{formatDate(msg.createdAt)}</span>
          </div>
          <p style={styles.message}>{msg.message}</p>
          <button style={styles.deleteBtn} onClick={() => deleteMessage(msg._id)}>
            🗑️ Hapus
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  loginWrap: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  loginBox: {
    background: '#1a1a2e',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    border: '1px solid rgba(0,216,255,0.2)',
    boxSizing: 'border-box',
  },
  loginTitle: {
    color: '#00d8ff',
    margin: 0,
    textAlign: 'center',
    fontSize: '20px',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(0,216,255,0.3)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  btn: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #00d8ff, #0099cc)',
    color: '#000',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '15px',
    width: '100%',
  },
  wrap: {
    minHeight: '100vh',
    background: '#0a0a0a',
    maxWidth: '700px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    color: '#00d8ff',
    margin: 0,
  },
  refreshBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #00d8ff',
    background: 'transparent',
    color: '#00d8ff',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  loading: { color: '#71717a', textAlign: 'center' },
  empty: { color: '#71717a', textAlign: 'center' },
  card: {
    background: '#1a1a2e',
    border: '1px solid rgba(0,216,255,0.15)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '14px',
    boxSizing: 'border-box',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  name: { color: '#00d8ff', fontWeight: '700', fontSize: '14px' },
  date: { color: '#71717a', fontSize: '11px' },
  message: { color: '#ffffff', fontSize: '14px', margin: '0 0 12px 0', wordBreak: 'break-word', lineHeight: '1.5' },
  deleteBtn: {
    padding: '7px 14px',
    borderRadius: '6px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
};

export default AdminMessages;