import React, { useState, useEffect } from 'react';

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
  const [token, setToken] = useState('');
  const [viewsData, setViewsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('views');
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const navbar = document.querySelector('.container-navbar');
    if (navbar) navbar.style.visibility = 'hidden';
    document.body.style.background = '#0a0a0a';
    return () => {
      if (navbar) navbar.style.visibility = '';
      document.body.style.background = '';
    };
  }, []);

  const login = async () => {
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPass }),
      });
      const data = await res.json();
      if (data.success) {
        setAuth(true);
        setToken(data.token);
        setInputPass('');
        fetchViews(data.token);
      } else {
        setLoginError(data.error || 'Password salah!');
      }
    } catch (err) {
      setLoginError('Gagal terhubung ke server.');
    }
  };

  const logout = () => {
    setAuth(false);
    setToken('');
    setViewsData({});
  };

  const fetchViews = async (t) => {
    setLoading(true);
    try {
      // Token WAJIB dikirim — kalau backend memang melindungi endpoint ini dengan token,
      // tanpa ini request akan selalu gagal (atau, kalau berhasil tanpa token, itu tanda
      // backend /api/views belum dilindungi sama sekali dan perlu diperbaiki juga).
      const res = await fetch('/api/views', {
        headers: { 'x-admin-token': t || token }
      });

      if (res.status === 401) {
        logout();
        setLoginError('Sesi berakhir, silakan login ulang.');
        return;
      }

      const data = await res.json();
      setViewsData(data || {});
    } catch (err) {
      console.error('Fetch views error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (id, currentViews) => {
    setEditId(id);
    setEditVal(String(currentViews));
  };

  const saveEdit = async (id) => {
    const parsed = parseInt(editVal, 10);

    // Validasi sebelum kirim — cegah NaN atau angka negatif
    if (Number.isNaN(parsed) || parsed < 0) {
      alert('Masukkan angka valid (0 atau lebih)!');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/views/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ views: parsed }),
      });

      if (res.status === 401) {
        logout();
        setLoginError('Sesi berakhir, silakan login ulang.');
        return;
      }

      if (!res.ok) {
        alert('Gagal menyimpan perubahan.');
        return;
      }

      setViewsData(prev => ({ ...prev, [id]: parsed }));
      setEditId(null);
    } catch (err) {
      console.error('Save edit error:', err);
      alert('Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  const merged = galleryItems.map(item => ({ ...item, views: viewsData[item.id] || 0 }));
  const sorted = [...merged].sort((a, b) => sortBy === 'views' ? b.views - a.views : b.id - a.id);
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
          {loginError && <p style={s.errorText}>{loginError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
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
          <button style={s.refreshBtn} onClick={() => fetchViews()}>🔄</button>
          <button style={s.logoutBtn} onClick={logout}>🚪</button>
        </div>
      </div>

      {loading && <p style={{ color: '#71717a', textAlign: 'center' }}>Loading...</p>}

      <div style={s.statsRow}>
        {[
          { icon: '🔥', count: merged.filter(i => i.views >= 50).length, label: 'Hot' },
          { icon: '⚡', count: merged.filter(i => i.views >= 10 && i.views < 50).length, label: 'Warm' },
          { icon: '👁', count: merged.filter(i => i.views >= 1 && i.views < 10).length, label: 'Cool' },
          { icon: '⭕', count: merged.filter(i => i.views === 0).length, label: 'New' },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <span style={{ fontSize: '20px' }}>{stat.icon}</span>
            <span style={s.statNum}>{stat.count}</span>
            <span style={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {sorted.map(item => {
        const badge = getBadge(item.views);
        const isEditing = editId === item.id;
        return (
          <div key={item.id} style={s.card}>
            <div style={s.cardLeft}>
              <span style={{ fontSize: '18px' }}>{item.type === 'video' ? '🎬' : '🖼️'}</span>
              <div style={{ minWidth: 0 }}>
                <p style={s.desc}>{item.desc}</p>
                <p style={s.idText}>ID: {item.id} • {item.type === 'video' ? 'Video' : 'Foto'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {isEditing ? (
                <>
                  <input style={s.editInput} type="number" value={editVal} onChange={e => setEditVal(e.target.value)} min="0" autoFocus />
                  <button style={s.saveBtn} onClick={() => saveEdit(item.id)} disabled={saving}>{saving ? '...' : '✅'}</button>
                  <button style={s.cancelBtn} onClick={() => setEditId(null)}>❌</button>
                </>
              ) : (
                <>
                  <span style={{ ...s.badge, color: badge.color, background: badge.bg, border: `1px solid ${badge.border}` }}>
                    {badge.icon} {item.views}
                  </span>
                  <button style={s.editBtn} onClick={() => startEdit(item.id, item.views)}>✏️</button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const s = {
  loginWrap: { minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  loginBox: { background: '#1a1a2e', borderRadius: '16px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '14px', width: '300px', border: '1px solid rgba(0,216,255,0.2)', boxSizing: 'border-box' },
  loginTitle: { color: '#00d8ff', margin: 0, textAlign: 'center' },
  input: { padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,216,255,0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px', outline: 'none' },
  btn: { padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #00d8ff, #0099cc)', color: '#000', fontWeight: '700', cursor: 'pointer', fontSize: '15px' },
  errorText: { color: '#ef4444', fontSize: '13px', textAlign: 'center', margin: 0 },
  wrap: { minHeight: '100vh', background: '#0a0a0a', maxWidth: '750px', margin: '0 auto', padding: '30px 16px', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  title: { color: '#00d8ff', margin: '0 0 4px 0', fontSize: '20px' },
  subtitle: { color: '#71717a', margin: 0, fontSize: '13px' },
  select: { padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(0,216,255,0.3)', background: '#1a1a2e', color: '#fff', fontSize: '13px', outline: 'none', cursor: 'pointer' },
  refreshBtn: { padding: '7px 12px', borderRadius: '8px', border: '1px solid #00d8ff', background: 'transparent', color: '#00d8ff', cursor: 'pointer', fontSize: '15px' },
  logoutBtn: { padding: '7px 12px', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '15px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' },
  statCard: { background: '#1a1a2e', borderRadius: '10px', padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: '1px solid rgba(0,216,255,0.1)' },
  statNum: { color: '#fff', fontWeight: '700', fontSize: '20px' },
  statLabel: { color: '#71717a', fontSize: '11px' },
  card: { background: '#1a1a2e', border: '1px solid rgba(0,216,255,0.1)', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 },
  desc: { color: '#fff', fontSize: '13px', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  idText: { color: '#71717a', fontSize: '11px', margin: 0 },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  editBtn: { padding: '5px 10px', borderRadius: '6px', border: '1px solid #00d8ff', background: 'transparent', color: '#00d8ff', cursor: 'pointer', fontSize: '13px' },
  editInput: { width: '70px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #00d8ff', background: '#0a0a0a', color: '#fff', fontSize: '14px', outline: 'none' },
  saveBtn: { padding: '5px 8px', borderRadius: '6px', border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontSize: '13px' },
  cancelBtn: { padding: '5px 8px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '13px' },
};

export default AdminViews;