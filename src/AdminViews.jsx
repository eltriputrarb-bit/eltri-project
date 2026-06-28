import React, { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'eltri2026';

const galleryItems = [
  { id: 19, type: 'video', desc: 'gereja katedral Makassar' },
  { id: 18, type: 'video', desc: 'jalan ke gereja' },
  { id: 17, type: 'video', desc: 'servis honda' },
  { id: 16, type: 'video', desc: '⛅️' },
  { id: 15, type: 'img', desc: 'DI SMC MAKASSAR (2)' },
  { id: 14, type: 'img', desc: 'DI SMC MAKASSAR (1)' },
  { id: 13, type: 'video', desc: 'saya jalan jadi' },
  { id: 12, type: 'video', desc: 'kid miss u' },
  { id: 11, type: 'img', desc: 'warkop gunung nona indah' },
  { id: 10, type: 'img', desc: 'toraja' },
  { id: 9, type: 'img', desc: 'di makale, tana toraja' },
  { id: 8, type: 'img', desc: 'Hokky Rumah Makan China' },
  { id: 6, type: 'img', desc: 'MAU MAKAN' },
  { id: 4, type: 'img', desc: 'Parkiran Roda mobil' },
  { id: 3, type: 'img', desc: 'CAMERA SMAKARA' },
  { id: 2, type: 'img', desc: 'RAJAWALI ANAK KECIL' },
  { id: 1, type: 'img', desc: 'jalanan kota Makassar' },
];

function getBadge(views) {
  if (views >= 50) return { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: '#ef4444', icon: '🔥', label: 'HOT' };
  if (views >= 10) return { color: '#eab308', bg: 'rgba(234,179,8,0.15)', border: '#eab308', icon: '⚡', label: 'WARM' };
  if (views >= 1)  return { color: '#00d8ff', bg: 'rgba(0,216,255,0.15)', border: '#00d8ff', icon: '👁', label: 'COOL' };
  return { color: '#71717a', bg: 'rgba(113,113,122,0.15)', border: '#71717a', icon: '👁', label: 'NEW' };
}

function AdminViews() {
  const [auth, setAuth] = useState(false);
  const [inputPass, setInputPass] = useState('');
  const [viewsData, setViewsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('views');

  useEffect(() => {
    const navbar = document.querySelector('.container-navbar');
    if (navbar) navbar.style.visibility = 'hidden';
    document.body.style.background = '#0a0a0a';
    return () => {
      if (navbar) navbar.style.visibility = '';
      document.body.style.background = '';
    };
  }, []);

  const login = () => {
    if (inputPass === ADMIN_PASSWORD) {
      setAuth(true);
      fetchViews();
    } else {
      alert('Password salah!');
    }
  };

  const fetchViews = async () => {
    setLoading(true);
    const res = await fetch('/api/views');
    const data = await res.json();
    setViewsData(data);
    setLoading(false);
  };

  const merged = galleryItems.map(item => ({
    ...item,
    views: viewsData[item.id] || 0,
  }));

  const sorted = [...merged].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'id') return b.id - a.id;
    return 0;
  });

  const totalViews = merged.reduce((sum, item) => sum + item.views, 0);

  if (!auth) {
    return (
      <div style={s.loginWrap}>
        <div style={s.loginBox}>
          <h2 style={s.loginTitle}>📊 Admin Views</h2>
          <input
            style={s.input}
            type="password"
            placeholder="Masukkan password"
            value={inputPass}
            onChange={e => setInputPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          <button style={s.btn} onClick={login}>Masuk</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>📊 Dashboard Views</h2>
          <p style={s.subtitle}>Total: <span style={{ color: '#00d8ff', fontWeight: 700 }}>{totalViews} views</span> dari {galleryItems.length} item</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select style={s.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="views">Sort: Views</option>
            <option value="id">Sort: Terbaru</option>
          </select>
          <button style={s.refreshBtn} onClick={fetchViews}>🔄</button>
        </div>
      </div>

      {loading && <p style={{ color: '#71717a', textAlign: 'center' }}>Loading...</p>}

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <span style={{ color: '#ef4444', fontSize: '20px' }}>🔥</span>
          <span style={s.statNum}>{merged.filter(i => i.views >= 50).length}</span>
          <span style={s.statLabel}>Hot (50+)</span>
        </div>
        <div style={s.statCard}>
          <span style={{ color: '#eab308', fontSize: '20px' }}>⚡</span>
          <span style={s.statNum}>{merged.filter(i => i.views >= 10 && i.views < 50).length}</span>
          <span style={s.statLabel}>Warm (10-49)</span>
        </div>
        <div style={s.statCard}>
          <span style={{ color: '#00d8ff', fontSize: '20px' }}>👁</span>
          <span style={s.statNum}>{merged.filter(i => i.views >= 1 && i.views < 10).length}</span>
          <span style={s.statLabel}>Cool (1-9)</span>
        </div>
        <div style={s.statCard}>
          <span style={{ color: '#71717a', fontSize: '20px' }}>⭕</span>
          <span style={s.statNum}>{merged.filter(i => i.views === 0).length}</span>
          <span style={s.statLabel}>New (0)</span>
        </div>
      </div>

      {/* List */}
      {sorted.map(item => {
        const badge = getBadge(item.views);
        return (
          <div key={item.id} style={s.card}>
            <div style={s.cardLeft}>
              <span style={{ fontSize: '20px' }}>{item.type === 'video' ? '🎬' : '🖼️'}</span>
              <div>
                <p style={s.desc}>{item.desc}</p>
                <p style={s.idText}>ID: {item.id} • {item.type === 'video' ? 'Video' : 'Foto'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                ...s.badge,
                color: badge.color,
                background: badge.bg,
                border: `1px solid ${badge.border}`,
              }}>
                {badge.icon} {item.views} views
              </span>
              <span style={{ ...s.labelBadge, color: badge.color }}>{badge.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const s = {
  loginWrap: {
    minHeight: '100vh', background: '#0a0a0a',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
  },
  loginBox: {
    background: '#1a1a2e', borderRadius: '16px', padding: '40px',
    display: 'flex', flexDirection: 'column', gap: '14px', width: '300px',
    border: '1px solid rgba(0,216,255,0.2)', boxSizing: 'border-box',
  },
  loginTitle: { color: '#00d8ff', margin: 0, textAlign: 'center' },
  input: {
    padding: '12px 14px', borderRadius: '8px',
    border: '1px solid rgba(0,216,255,0.3)', background: 'rgba(255,255,255,0.05)',
    color: '#fff', fontSize: '15px', outline: 'none',
  },
  btn: {
    padding: '12px', borderRadius: '8px', border: 'none',
    background: 'linear-gradient(135deg, #00d8ff, #0099cc)',
    color: '#000', fontWeight: '700', cursor: 'pointer', fontSize: '15px',
  },
  wrap: {
    minHeight: '100vh', background: '#0a0a0a',
    maxWidth: '750px', margin: '0 auto', padding: '30px 16px', boxSizing: 'border-box',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { color: '#00d8ff', margin: '0 0 4px 0', fontSize: '20px' },
  subtitle: { color: '#71717a', margin: 0, fontSize: '13px' },
  select: {
    padding: '7px 12px', borderRadius: '8px',
    border: '1px solid rgba(0,216,255,0.3)', background: '#1a1a2e',
    color: '#fff', fontSize: '13px', outline: 'none', cursor: 'pointer',
  },
  refreshBtn: {
    padding: '7px 12px', borderRadius: '8px',
    border: '1px solid #00d8ff', background: 'transparent',
    color: '#00d8ff', cursor: 'pointer', fontSize: '15px',
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px', marginBottom: '20px',
  },
  statCard: {
    background: '#1a1a2e', borderRadius: '10px', padding: '12px 8px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    border: '1px solid rgba(0,216,255,0.1)',
  },
  statNum: { color: '#fff', fontWeight: '700', fontSize: '20px' },
  statLabel: { color: '#71717a', fontSize: '11px', textAlign: 'center' },
  card: {
    background: '#1a1a2e', border: '1px solid rgba(0,216,255,0.1)',
    borderRadius: '10px', padding: '14px 16px', marginBottom: '10px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    gap: '10px',
  },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 },
  desc: { color: '#fff', fontSize: '13px', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  idText: { color: '#71717a', fontSize: '11px', margin: 0 },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  labelBadge: { fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
};

export default AdminViews;
