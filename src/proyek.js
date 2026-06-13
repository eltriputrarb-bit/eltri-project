import React, { useEffect } from 'react';

const PublicProfile = () => {
  useEffect(() => {
    // --- STICKY NAVBAR ON SCROLL EFFECT ---
    const handleScroll = () => {
      const navbar = document.querySelector('.container-navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
      }
    };

    // --- PROTOKOL KEAMANAN ANTI-INSPECT ---
    const handleContextMenu = (e) => {
      if (e.target.tagName !== 'IMG') {
        e.preventDefault();
        alert('Sistem keamanan Anti-Error! Dilarang mencuri kodingan ELTRI PROJECT!');
      }
    };
    
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && e.key === "I") || 
        (e.ctrlKey && e.shiftKey && e.key === "C") || 
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        alert('Fitur Inspect Element Dikunci, Bang! 🦾🛡️');
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMapsClick = (e, googleUrl) => {
    e.preventDefault();
    window.open(googleUrl, '_blank');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#030a16', paddingTop: '100px', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* --- PANGGIL FONT LOKAL & PENGATURAN TEKS --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        /* Membaca langsung font SF Pro Display Black asli dari folder public */
        @font-face {
          font-family: 'SF Pro Display Black';
          src: url('/fonts/SF-Pro-Text-Medium') format('woff2');
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }

        .cubes-fixed {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          overflow: hidden; z-index: 1; list-style: none; padding: 0; margin: 0;
          pointer-events: none;
        }
        .cubes-fixed li {
          position: absolute; display: block; list-style: none; width: 25px; height: 25px;
          background: linear-gradient(135deg, rgba(0, 136, 204, 0.2), rgba(0, 212, 255, 0.1)); 
          border: 1px solid rgba(0, 136, 204, 0.6);
          box-shadow: 0 0 15px rgba(0, 136, 204, 0.4); 
          bottom: -150px;
          animation: flyUpwards 20s linear infinite; border-radius: 6px;
        }
        .cubes-fixed li:nth-child(1) { left: 10%; width: 80px; height: 80px; animation-delay: 0s; animation-duration: 18s; }
        .cubes-fixed li:nth-child(2) { left: 25%; width: 35px; height: 35px; animation-delay: 2s; animation-duration: 12s; }
        .cubes-fixed li:nth-child(3) { left: 40%; width: 65px; height: 65px; animation-delay: 4s; animation-duration: 22s; }
        .cubes-fixed li:nth-child(4) { left: 55%; width: 20px; height: 20px; animation-delay: 1s; animation-duration: 15s; }
        .cubes-fixed li:nth-child(5) { left: 70%; width: 90px; height: 90px; animation-delay: 5s; animation-duration: 25s; }
        .cubes-fixed li:nth-child(6) { left: 85%; width: 40px; height: 40px; animation-delay: 3s; animation-duration: 14s; }
        .cubes-fixed li:nth-child(7) { left: 18%; width: 50px; height: 50px; animation-delay: 7s; animation-duration: 16s; }
        .cubes-fixed li:nth-child(8) { left: 48%; width: 30px; height: 30px; animation-delay: 9s; animation-duration: 11s; }
        .cubes-fixed li:nth-child(9) { left: 78%; width: 75px; height: 75px; animation-delay: 2s; animation-duration: 19s; }

        @keyframes flyUpwards {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; border-radius: 50%; }
        }

        /* Styling Judul - Menghasilkan Tampilan Padat Tegak Super Tebal */
        .gahar-black-title {
          font-family: 'SF Pro Display Black', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-weight: 900 !important;
          letter-spacing: -1.2px !important;
          line-height: 1.1;
        }

        .premium-sub-title {
          font-family: 'Poppins', sans-serif !important;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
      `}</style>

      {/* PARTIKEL ANIMASI KUBUS GAHAR */}
      <ul className="cubes-fixed">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li>
      </ul>

      {/* PROFILE CONTENT CONTROLLER */}
      <section className="public-profile" style={{ padding: '20px 10px', position: 'relative', zIndex: '2' }}>
        <div className="profile-container" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '30px', padding: '10px', alignItems: 'flex-start' }}>
          
          {/* KARTU SIDEBAR PROFILE */}
          <div className="side-bar" style={{ flex: '1', minWidth: '280px', background: 'rgba(11, 18, 33, 0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', padding: '35px 25px', borderRadius: '20px', textAlign: 'center', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div className="photo-frame" style={{ width: '170px', height: '170px', margin: '0 auto 25px auto', borderRadius: '50%', overflow: 'hidden', border: '4px solid #0088cc', boxShadow: '0 0 25px rgba(0, 136, 204, 0.6)' }}>
              <img src="/images/profileE.jpg" alt="Eltri Putra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div className="side-content" style={{ textAlign: 'center', marginTop: '20px' }}>
              <h3 className="premium-sub-title" style={{ color: '#0088cc', fontSize: '13px', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>
                <i className="fas fa-user-circle" style={{ marginRight: '5px' }}></i> JKT48 PROFIL AKTIF ONLINE
              </h3>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="premium-sub-title" style={{ color: '#e2e8f0', fontSize: '14px', margin: '0' }}>Eltri Putra Rombebua</p>
                <span className="status-dot-fixed" style={{ width: '8px', height: '8px', backgroundColor: '#00ff88', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #00ff88' }}></span>
              </div>
            </div>
          </div>

          {/* KONTEN UTAMA - RIWAYAT PENDIDIKAN */}
          <div className="main-content" style={{ flex: '2', minWidth: '300px', maxWidth: '100%', background: 'rgba(11, 18, 33, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', padding: '35px', borderRadius: '20px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h1 className="profile-name gahar-black-title" style={{ fontSize: '2.6rem', marginBottom: '10px', color: '#fff', wordBreak: 'break-word' }}>ELTRI PUTRA ROMBEBUA</h1>
            <hr className="line-gold" style={{ border: '0', height: '4px', background: 'linear-gradient(90deg, #0088cc, transparent)', marginBottom: '35px', width: '80px', borderRadius: '2px' }} />
            
            <div className="info-section">
              <h2 className="gahar-black-title" style={{ fontSize: '18px', color: '#0088cc', marginBottom: '25px', letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-graduation-cap"></i> RIWAYAT PENDIDIKAN
              </h2>
              
              {/* ITEM SMK */}
              <div className="item" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderLeft: '4px solid #0088cc', marginBottom: '20px', borderRadius: '0 14px 14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <strong className="premium-sub-title" style={{ fontSize: '16px', color: '#ffffff' }}>SMK XXXXX XXXXX</strong>
                <span className="premium-sub-title" style={{ fontSize: '12px', color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', padding: '5px 14px', borderRadius: '20px' }}>2023 - 2026 Offline</span>
              </div>

              {/* ITEM SMP */}
              <div className="item" style={{ background: "linear-gradient(rgba(6, 11, 25, 0.82), rgba(6, 11, 25, 0.82)), url('/images/eltripro.png') no-repeat center center / cover", padding: '20px', border: '1px solid rgba(0, 136, 204, 0.2)', borderLeft: '4px solid #0088cc', marginBottom: '20px', borderRadius: '0 14px 14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <strong className="premium-sub-title" style={{ fontSize: '16px', color: '#ffffff' }}>SMPLB/SMP Katolik Rajawali</strong>
                  <button 
                    onClick={(e) => handleMapsClick(e, "https://maps.app.goo.gl/bWFjn5CvVD8UB59Z9")}
                    className="premium-sub-title"
                    style={{ background: 'none', border: 'none', padding: 0, color: '#0088cc', cursor: 'pointer', textAlign: 'left', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fas fa-map-marker-alt"></i> LIHAT LOKASI SEKOLAH
                  </button>
                </div>
                <span className="premium-sub-title" style={{ fontSize: '12px', color: '#00ff88', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.25)', padding: '5px 14px', borderRadius: '20px' }}>2020 - 2023 Online</span>
              </div>

              {/* ITEM SD */}
              <div className="item" style={{ background: "linear-gradient(rgba(6, 11, 25, 0.82), rgba(6, 11, 25, 0.82)), url('/images/eltripro.png') no-repeat center center / cover", padding: '20px', border: '1px solid rgba(0, 136, 204, 0.2)', borderLeft: '4px solid #0088cc', marginBottom: '0', borderRadius: '0 14px 14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <strong className="premium-sub-title" style={{ fontSize: '16px', color: '#ffffff' }}>SDLB/SD Katolik Rajawali</strong>
                  <button 
                    onClick={(e) => handleMapsClick(e, "https://maps.app.goo.gl/4yzQYwkZcfacuTXm7")}
                    className="premium-sub-title"
                    style={{ background: 'none', border: 'none', padding: 0, color: '#0088cc', cursor: 'pointer', textAlign: 'left', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fas fa-map-marker-alt"></i> LIHAT LOKASI SEKOLAH
                  </button>
                </div>
                <span className="premium-sub-title" style={{ fontSize: '12px', color: '#00ff88', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.25)', padding: '5px 14px', borderRadius: '20px' }}>2014 - 2020 Online</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="premium-sub-title" style={{ textAlign: 'center', padding: '30px', color: '#414b5a', fontSize: '12px', letterSpacing: '1px', borderTop: '1px solid rgba(255,255,255,0.02)', marginTop: '50px', position: 'relative', zIndex: '2' }}>
        © 2026 ELTRI PROJECT. All Rights Reserved.
      </footer>
    </div>
  );
};

export default PublicProfile;