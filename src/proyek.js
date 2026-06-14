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

const handleMapsClick = (e) => {
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    if (isApple) {
      e.preventDefault();
      const appleLink = e.currentTarget.getAttribute('data-apple');
      if (appleLink) window.open(appleLink, '_blank');
    } else {
      e.preventDefault();
      const googleLink = e.currentTarget.getAttribute('data-google');
      if (googleLink) window.open(googleLink, '_blank');
    }
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

      <div className="hero-about" style={{ marginTop: '120px', padding: '20px 0' }}>
        <section className="public-profile">
          <div className="profile-container" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '30px', padding: '20px', alignItems: 'flex-start' }}>
            
            {/* SIDEBAR PROFILE */}
            <div className="side-bar rpg-profile-sidebar" style={{ flex: 1, minWidth: '280px', maxWidth: '360px', background: 'rgba(10, 15, 26, 0.75)', border: '1px solid rgba(0, 136, 204, 0.2)', padding: '40px 25px', borderRadius: '20px', textAlign: 'center', boxSizing: 'border-box', backdropFilter: 'blur(10px)', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 136, 204, 0.05)', margin: '0 auto' }}>
              
              <div className="photo-frame" style={{ width: '170px', height: '170px', margin: '0 auto 25px auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid #00d8ff', position: 'relative', animation: 'neonPulse 3s infinite ease-in-out' }}>
                <img src="images/eltri.jpg" alt="Eltri Putra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
              </div>
              
              <div className="side-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                <h3 style={{ color: '#00d8ff', fontSize: '13px', fontWeight: '800', letterSpacing: '2px', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', filter: 'drop-shadow(0 0 8px rgba(0, 216, 255, 0.5))' }}>
                  <i className="fas fa-user-circle" style={{ fontSize: '16px' }}></i> JKT48 PROFIL AKTIF ONLINE
                </h3>
                
                <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '10px 22px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.6)', maxWidth: '95%' }}>
                  <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', margin: 0, letterSpacing: '0.8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Eltri Putra Rombebua
                  </p>
                  <span className="status-dot-fixed" style={{ width: '10px', height: '10px', backgroundColor: '#00ff66', borderRadius: '50%', display: 'inline-block', animation: 'onlineBlink 1.8s infinite ease-in-out' }}></span>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content" style={{ flex: 2, minWidth: '300px', maxWidth: '100%', background: 'rgba(10, 15, 26, 0.75)', border: '1px solid rgba(0, 136, 204, 0.15)', padding: '35px', borderRadius: '20px', boxSizing: 'border-box', backdropFilter: 'blur(10px)', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)' }}>
              
              <h1 className="profile-name" style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '1.5px', marginBottom: '5px', color: '#fff', wordBreak: 'break-word' }}>
                ELTRI PUTRA ROMBEBUA
              </h1>
              <hr className="line-gold" style={{ border: 0, height: '3px', background: 'linear-gradient(90deg, #00d8ff, transparent)', marginBottom: '40px', width: '120px' }} />
              
              <div className="info-section">
                <h2 style={{ fontSize: '19px', fontWeight: '800', color: '#00d8ff', marginBottom: '25px', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-graduation-cap" style={{ filter: 'drop-shadow(0 0 5px #00d8ff)' }}></i> RIWAYAT PENDIDIKAN
                </h2>
                
                {/* ITEM 1: SMK */}
                <div className="item" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderLeft: '4px solid #0088cc', marginBottom: '20px', borderRadius: '0 10px 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                    <strong style={{ fontSize: '16px', color: '#fff', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontFamily: "'Inter', sans-serif" }}>
                      SMK XXXXX XXXXX
                    </strong>
                  </div>
                  <span style={{ fontSize: '13px', color: '#ff2a4b', background: 'rgba(255, 42, 75, 0.1)', border: '1px solid rgba(255, 42, 75, 0.35)', padding: '5px 14px', borderRadius: '20px', fontWeight: '700', textShadow: '0 0 8px rgba(255, 42, 75, 0.6)', position: 'relative', zIndex: 2, letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
                    2023 - 2026 Offline
                  </span>
                </div>

{/* ITEM 2: SMP */}
                <div className="item education-item" style={{ background: "rgba(6, 11, 25, 0.75) url('images/Eltripro.jpg') no-repeat center center / cover", backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '22px 20px', border: '1px solid rgba(0, 136, 204, 0.2)', borderLeft: '5px solid #00d8ff', marginBottom: '20px', borderRadius: '0 12px 12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 2 }}>
                    <strong style={{ fontSize: '16px', color: '#fff', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>SMPLB/SMP Katolik Rajawali</strong>
                    
                    <a 
                      href="https://maps.app.goo.gl/J7tRUt9f3QzeR5pi8" 
                      className="maps-link" 
                      onClick={(e) => {
                        if (typeof handleMapsClick === 'function') handleMapsClick(e);
                      }}
                      data-google="https://maps.app.goo.gl/J7tRUt9f3QzeR5pi8"  
                      data-apple="https://maps.apple.com/place?address=Jalan+Arief+Rate+No.+2%2C+Makassar%2C+South+Sulawesi+90112%2C+Indonesia&coordinate=-5.145646%2C119.411699&name=SMP+Katolik+Rajawali" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#00d8ff', textDecoration: 'none', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px', transition: '0.2s' }} 
                      onMouseEnter={(e) => {
                        e.target.style.color = '#ffffff';
                        e.target.style.textShadow = '0 0 8px #00d8ff';
                      }} 
                      onMouseLeave={(e) => {
                        e.target.style.color = '#00d8ff';
                        e.target.style.textShadow = 'none';
                      }}
                    >
                      <i className="fas fa-map-marker-alt"></i> LIHAT LOKASI SEKOLAH
                    </a>
                  </div>
                  <span style={{ fontSize: '13px', color: '#00ff88', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', padding: '5px 14px', borderRadius: '20px', fontWeight: '700', textShadow: '0 0 5px rgba(0,255,136,0.5)', position: 'relative', zIndex: 2, letterSpacing: '0.5px' }}>2020 - 2023 Online</span>
                </div>

                {/* ITEM 3: SD */}
                <div className="item education-item" style={{ background: "rgba(6, 11, 25, 0.75) url('images/Eltripro.jpg') no-repeat center center / cover", backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '22px 20px', border: '1px solid rgba(0, 136, 204, 0.2)', borderLeft: '5px solid #00d8ff', marginBottom: 0, borderRadius: '0 12px 12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 2 }}>
                    <strong style={{ fontSize: '16px', color: '#fff', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontFamily: "'Inter', sans-serif" }}>
                      SDLB/SD Katolik Rajawali
                    </strong>
                    <a 
                      href="https://maps.app.goo.gl/o1JExkS8SGsWWa1R8" 
                      className="maps-link" 
                      onClick={(e) => {
                        if (typeof handleMapsClick === 'function') handleMapsClick(e);
                      }}
                      data-google="https://maps.app.goo.gl/o1JExkS8SGsWWa1R8" 
                      data-apple="maps://maps.apple.com/?q=SD+Katolik+Rajawali+Makassar" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#00d8ff', textDecoration: 'none', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px', transition: '0.2s', fontFamily: "'Share Tech Mono', monospace" }} 
                      onMouseEnter={(e) => {
                        e.target.style.color = '#ffffff';
                        e.target.style.textShadow = '0 0 8px #00d8ff';
                      }} 
                      onMouseLeave={(e) => {
                        e.target.style.color = '#00d8ff';
                        e.target.style.textShadow = 'none';
                      }}
                    >
                      <i className="fas fa-map-marker-alt"></i> LIHAT LOKASI SEKOLAH
                    </a>
                  </div>
                  <span style={{ fontSize: '13px', color: '#00ff88', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', padding: '5px 14px', borderRadius: '20px', fontWeight: '700', textShadow: '0 0 5px rgba(0,255,136,0.5)', position: 'relative', zIndex: 2, letterSpacing: '0.5px' }}>2014 - 2020 Online</span>
                </div>

              </div>
            </div>
            
          </div> 
        </section>
      </div>

      <footer className="main-footer" style={{ textAlign: 'center', padding: '30px', color: '#666', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', borderTop: '1px solid rgba(255,255,255,0.02)', marginTop: '50px' }}>
        © 2026 ELTRI PROJECT. All Rights Reserved.
      </footer>
    </div>
  );
}

export default PublicProfile;
