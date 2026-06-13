import React, { useEffect } from 'react';

const ErrorPage = () => {
  useEffect(() => {
    // --- 1. JALANKAN JAM DIGITAL AKTIF WIB ---
    const updateTime = () => {
      const clockEl = document.getElementById('local-time');
      if (clockEl) {
        const now = new Date();
        const options = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const timeString = now.toLocaleTimeString('id-ID', options).replace(/\./g, ':');
        clockEl.textContent = timeString;
      }
    };
    const clockInterval = setInterval(updateTime, 1000);
    updateTime(); // Panggil sekali di awal

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#030a16', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* --- SUNTIKAN CSS: HANYA ANIMASI KUBUS & PANDA (TANPA NAVBAR) --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Partikel Kubus Melayang */
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

        /* Animasi Struktur Ayunan Panda */
        .animation-container {
          width: 100%;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        .swing-structure {
          position: relative;
          width: 180px;
          height: 100%;
          transform-origin: top center;
          animation: swingMovement 3s ease-in-out infinite alternate;
        }
        .swing-ropes {
          position: absolute;
          width: 100%;
          height: 140px;
          border-left: 3px solid #fff;
          border-right: 3px solid #fff;
          box-sizing: border-box;
        }
        .swing-ropes::after {
          content: '';
          position: absolute;
          bottom: 0; left: -10px;
          width: 200px; height: 8px;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }

        /* Komponen Tubuh Panda */
        .panda-body {
          position: absolute;
          bottom: -35px; left: 50%;
          transform: translateX(-50%);
          width: 90px; height: 80px;
          background: #fff;
          border-radius: 50% 50% 45% 45%;
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
        }
        .panda-ear {
          position: absolute; top: -5px; width: 28px; height: 28px; background: #111; border-radius: 50%;
        }
        .panda-ear.left { left: -5px; }
        .panda-ear.right { right: -5px; }
        
        .panda-face { position: relative; width: 100%; height: 100%; }
        
        .panda-eye-patch {
          position: absolute; top: 22px; width: 24px; height: 30px; background: #111; border-radius: 50%;
          display: flex; justify-content: center; align-items: center;
        }
        .panda-eye-patch.left { left: 14px; transform: rotate(15deg); }
        .panda-eye-patch.right { right: 14px; transform: rotate(-15deg); }
        
        .panda-pupil {
          width: 8px; height: 8px; background: #fff; border-radius: 50%;
          animation: lookAround 4s infinite;
        }
        .panda-nose {
          position: absolute; top: 48px; left: 50%; transform: translateX(-50%); width: 14px; height: 8px; background: #222; border-radius: 50%;
        }
        .panda-paw {
          position: absolute; bottom: 22px; width: 20px; height: 20px; background: #111; border-radius: 50%;
        }
        .panda-paw.left { left: -6px; }
        .panda-paw.right { right: -6px; }

        /* Teks Ukuran Eror */
        .error-text {
          font-size: 7.5rem; font-weight: 900; background: linear-gradient(135deg, #0088cc, #00ff88);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          filter: drop-shadow(0px 5px 20px rgba(0,136,204,0.4)); line-height: 1;
        }

        @keyframes swingMovement { 0% { transform: rotate(-18deg); } 100% { transform: rotate(18deg); } }
        @keyframes lookAround { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-2px, -1px); } 75% { transform: translate(2px, 1px); } }
      `}} />

      {/* PARTIKEL ANIMASI KUBUS */}
      <ul className="cubes-fixed">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li>
      </ul>

      {/* KONTEN EROR UTAMA */}
      <main className="error-wrapper" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* STRUKTUR AYUNAN ANIMASI PANDA */}
        <div className="animation-container">
          <div className="swing-structure">
            <div className="swing-ropes">
              <div className="panda-body">
                <div className="panda-ear left"></div>
                <div className="panda-ear right"></div>
                <div className="panda-face">
                  <div className="panda-eye-patch left"><div className="panda-pupil"></div></div>
                  <div className="panda-eye-patch right"><div className="panda-pupil"></div></div>
                  <div className="panda-nose"></div>
                </div>
                <div className="panda-paw left"></div>
                <div className="panda-paw right"></div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="error-text" style={{ margin: '20px 0 0 0' }}>404</h1>
        <h2 className="message" style={{ color: '#fff', margin: '15px 0 10px 0', fontSize: '1.8rem', fontWeight: '700' }}>Halaman Tidak Ditemukan!</h2>
        <p className="submessage" style={{ color: '#8fa0b5', maxWidth: '500px', margin: '0 auto 30px auto', fontSize: '14.5px', lineHeight: '1.6' }}>
          Mungkin halaman alamat rumah / Eltri Project sedang dipindahkan atau link yang Anda tuju salah.
        </p>

        {/* CONTROLLER TOMBOL & JAM DIGITAL */}
        <div className="error-actions" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="/" className="home-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg, #0088cc, #0055aa)', padding: '12px 26px', borderRadius: '25px', fontWeight: '600', fontSize: '13.5px', boxShadow: '0 4px 20px rgba(0, 136, 204, 0.4)' }}>
             Kembali Ke Home
          </a>
          <div className="mini-clock" style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '13.5px', background: 'rgba(0,255,136,0.06)', padding: '11px 22px', borderRadius: '25px', border: '1px solid rgba(0,255,136,0.25)', letterSpacing: '0.5px', boxShadow: '0 0 15px rgba(0,255,136,0.1)' }}>
            WIB: <span id="local-time">00:00:00</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ErrorPage;