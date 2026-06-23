import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.module.css';
import Gallery from './gallery'; 
import PublicProfile from './proyek'; 
import ErrorPage from './ErrorPage'; 


function EltriPutnzs() {

  useEffect(() => {
    // 1. Logika Jam Digital Dunia (World Clock)
    const updateWorldClocks = () => {
      const formatOptions = (timeZone) => {
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      };

      const dateFormatOptions = (timeZone) => {
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timeZone,
          day: '2-digit',
          month: 'short'
        });
      };

      const now = new Date();

      if (document.getElementById('time-singapore')) {
        document.getElementById('time-singapore').textContent = formatOptions('Asia/Singapore').format(now);
        document.getElementById('date-singapore').textContent = dateFormatOptions('Asia/Singapore').format(now);
      }
      if (document.getElementById('time-makassar')) {
        document.getElementById('time-makassar').textContent = formatOptions('Asia/Makassar').format(now);
        document.getElementById('date-makassar').textContent = dateFormatOptions('Asia/Makassar').format(now);
      }
      if (document.getElementById('time-tokyo')) {
        document.getElementById('time-tokyo').textContent = formatOptions('Asia/Tokyo').format(now);
        document.getElementById('date-tokyo').textContent = dateFormatOptions('Asia/Tokyo').format(now);
      }
      if (document.getElementById('time-Jakarta')) {
        document.getElementById('time-Jakarta').textContent = formatOptions('Asia/Jakarta').format(now);
        document.getElementById('date-Jakarta').textContent = dateFormatOptions('Asia/Jakarta').format(now);
      }
    };

    const clockInterval = setInterval(updateWorldClocks, 1000);
    updateWorldClocks();

    // 2. Sticky Navbar saat di-scroll
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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(clockInterval);
    };
  }, []);

  const toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    if (menu && navLinks) {
      menu.classList.toggle('is-active');
      navLinks.classList.toggle('active');
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const styleUtama = `
        background: #111111; 
        color: #ff0055; 
        font-size: 18px; 
        font-weight: bold; 
        padding: 10px 20px; 
        border-radius: 5px; 
        border: 2px solid #00ffcc;
        font-family: sans-serif;
        text-shadow: 0 0 10px #ff0055, 0 0 20px #00ffcc;
      `;

      const styleSub = `
        color: #00ffcc; 
        font-size: 14px; 
        font-weight: 500;
        font-family: sans-serif;
      `;

      console.log("%c🚀 ELTRI ATLAS v2.0 — ACCESS GRANTED", styleUtama);
      console.log("%cCreated with ❤️ by ELTRI ATLAS Developer", styleSub);
    }
  }, []);

  return (
    <div className="EltriPutnzs">
{/* NAVBAR */}
{/* NAVBAR */}
<nav className="container-navbar">
  <div className="nav-left">
    <Link to="/" className="logo-link">
      <img src={`${process.env.PUBLIC_URL}/images/Atlas.png`} className="logo" alt="Logo" />
      <span className="brand-text">ELTRI ATLAS</span>
    </Link>
  </div>

  <div className="nav-right">
    <ul className="ul-navbar" id="nav-links">
      <li>
        <Link to="/" className="menu-item-btn btn-gahar" onClick={toggleMenu}>
          <i className="fas fa-home"></i> HOME
        </Link>
      </li>
      <li>
        <Link to="/gallery" className="menu-item-btn btn-gahar" onClick={toggleMenu}>
          <i className="fas fa-images"></i> GALLERY
        </Link>
      </li>
      <li>
        <Link to="/proyek" className="menu-item-btn btn-gahar" onClick={toggleMenu}>
          <i className="fas fa-user"></i> PublicProfile
        </Link>
      </li>
      
      {/* 🔒 SUBMENU SETTINGS DI SINI */}
      <li className="nav-dropdown">
        <button className="menu-item-btn btn-gahar dropdown-toggle">
          <i className="fas fa-cog"></i> SETTINGS <i className="fas fa-caret-down"></i>
        </button>
        <ul className="dropdown-menu">
          <li>
            <Link to="/ErrorPage" className="dropdown-item" onClick={toggleMenu}>
              <i className="fas fa-exclamation-triangle"></i> ErrorPage
            </Link>
          </li>
          {/* Kamu bisa tambah menu setting lain di sini nanti, bro */}
        </ul>
      </li>
      
      <li></li>
    </ul>
  </div>

  <div className="menu-toggle" id="mobile-menu" onClick={toggleMenu}>
    <span></span>
    <span></span>
    <span></span>
  </div>
</nav>

      {/* SISTEM ROUTING UTAMA */}
      <Routes>
        
        {/* HALAMAN HOME */}
        <Route path="/" element={
          <>
{/* HERO SECTION WITH BUILT-IN ANIMATION FIX */}
<section className="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  
  {/* Suntikan Style CSS Langsung ke Dokumen */}
  <style>{`
.cubes-fixed {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      overflow: hidden; z-index: 1; list-style: none; padding: 0; margin: 0;
    }
    .cubes-fixed li {
      position: absolute; display: block; list-style: none; width: 25px; height: 25px;
      background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(0, 212, 255, 0.4);
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.2); bottom: -150px;
      animation: flyUpwards 20s linear infinite; border-radius: 4px;
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
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; border-radius: 50%; }
    }
  `}</style>

<ul className="cubes-fixed">
    <li></li><li></li><li></li><li></li><li></li>
    <li></li><li></li><li></li><li></li>
  </ul>
  
  <div className="hero-content" style={{ zIndex: 5, position: 'relative', width: '100%' }}>
    <h1 className="hero-title">ELTRI PUTRA ROMBEBUA</h1>
  </div>
</section>

<section className="social-footer">
  <h3>Project Sosial</h3>
  <div className="social-icons">
    <a 
      href="https://www.instagram.com/eltriputra?igsh=cDE5ZXllNXB4dHNo" 
      className="icon instagram" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <i className="fab fa-instagram"></i>
    </a>
    
    <a 
      href="https://x.com/eltri_putra" 
      className="icon x-logo" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <svg 
        viewBox="0 0 24 24" 
        aria-hidden="true" 
        className="svg-x" 
        style={{ width: '22px', height: '22px', fill: 'white', verticalAlign: 'middle' }}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    </a>

    <a 
      href="https://www.tiktok.com/@programtins" 
      className="icon tiktok" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <i className="fab fa-tiktok"></i>
    </a>
  </div>
</section>

            {/* WORLD CLOCK SECTION */}
            <div className="world-clock-container">
              <ul className="cubes">
                <li></li><li></li><li></li><li></li>
              </ul>
              
              <div className="clock-card">
                <span className="city-name">SINGAPORE</span>
                <span className="time-display" id="time-singapore">00:00:00</span>
                <span className="date-display" id="date-singapore">00 MMM</span>
              </div>
              
              <div className="clock-card">
                <span className="city-name">MAKASSAR</span>
                <span className="time-display" id="time-makassar">00:00:00</span>
                <span className="date-display" id="date-makassar">00 MMM</span>
              </div>

              <div className="clock-card">
                <span className="city-name">TOKYO</span>
                <span className="time-display" id="time-tokyo">00:00:00</span>
                <span className="date-display" id="date-tokyo">00 MMM</span>
              </div>

              <div className="clock-card">
                <span className="city-name">JAKARTA</span>
                <span className="time-display" id="time-Jakarta">00:00:00</span>
                <span className="date-display" id="date-Jakarta">00 MMM</span>
              </div>
            </div>

{/* SKILLS SECTION INTEGRASI TOTAL */}
<div className="skills-section-wrapper">
<ul className="cubes-fixed">
    <li></li><li></li><li></li><li></li><li></li>
    <li></li><li></li><li></li><li></li>
  </ul>
  
  <div className="skills-grid-container">
    
    {/* 1. PYTHON */}
    <div className="rpg-skill-card">
      <div className="skill-card-logo-zone">
        <i className="fa-brands fa-python skill-icon-logo python-color"></i>
      </div>
      <div className="skill-card-header">
        <span className="skill-title">PYTHON</span>
        <span className="card-level">Lv.6</span>
      </div>
      <div className="card-progress-bar">
        <div className="progress-fill" style={{ width: '6%' }}></div>
      </div>
    </div>

    {/* 2. HTML5 */}
    <div className="rpg-skill-card">
      <div className="skill-card-logo-zone">
        <i className="fa-brands fa-html5 skill-icon-logo html-color"></i>
      </div>
      <div className="skill-card-header">
        <span className="skill-title">HTML</span>
        <span className="card-level">Lv.95</span>
      </div>
      <div className="card-progress-bar">
        <div className="progress-fill" style={{ width: '95%' }}></div>
      </div>
    </div>

    {/* 3. JAVASCRIPT */}
    <div className="rpg-skill-card">
      <div className="skill-card-logo-zone">
        <i className="fa-brands fa-js skill-icon-logo js-color"></i>
      </div>
      <div className="skill-card-header">
        <span className="skill-title">JAVASCRIPT</span>
        <span className="card-level">Lv.95</span>
      </div>
      <div className="card-progress-bar">
        <div className="progress-fill" style={{ width: '95%' }}></div>
      </div>
    </div>

    {/* 4. CSS3 */}
    <div className="rpg-skill-card">
      <div className="skill-card-logo-zone">
        <i className="fa-brands fa-css3-alt skill-icon-logo css-color"></i>
      </div>
      <div className="skill-card-header">
        <span className="skill-title">CSS</span>
        <span className="card-level">Lv.95</span>
      </div>
      <div className="card-progress-bar">
        <div className="progress-fill" style={{ width: '95%' }}></div>
      </div>
    </div>

    {/* 5. REACT JS */}
    <div className="rpg-skill-card react-card-glow">
      <div className="skill-card-logo-zone">
        <i className="fa-brands fa-react skill-icon-logo react-color"></i>
      </div>
      <div className="skill-card-header">
        <span className="skill-title">REACT JS</span>
        <span className="card-level react-level-color">Lv.51</span>
      </div>
      <div className="card-progress-bar">
        <div className="progress-fill react-progress-fill" style={{ width: '51%' }}></div>
      </div>
    </div>

    {/* 6. PHP (SEKARANG SUDAH SEJAJAR) */}
    <div className="rpg-skill-card">
      <div className="skill-card-logo-zone">
        <i className="fa-brands fa-php skill-icon-logo php-color"></i>
      </div>
      <div className="skill-card-header">
        <span className="skill-title">PHP</span>
        <span className="card-level php-level-color">Lv.2</span>
      </div>
      <div className="card-progress-bar">
        <div className="progress-fill php-progress-fill" style={{ width: '2%' }}></div>
      </div>
    </div>

    {/* 7. NODE JS */}
    <div className="rpg-skill-card node-card-glow">
      <div className="skill-card-logo-zone">
        <i className="fa-brands fa-node-js skill-icon-logo node-color"></i>
      </div>
      <div className="skill-card-header">
    <span className="skill-title">NODE JS</span>
    <span className="card-level node-level-color">Lv.42</span>
  </div>
  <div className="card-progress-bar">
    <div className="progress-fill node-progress-fill" style={{ width: '42%' }}></div>
  </div>
</div>

    {/* 8. GIT */}
    <div className="rpg-skill-card git-card-glow">
      <div className="skill-card-logo-zone">
        <i className="fa-brands fa-git-alt skill-icon-logo git-color"></i>
      </div>
       <div className="skill-card-header">
      <span className="skill-title">GIT</span>
      <span className="card-level git-level-color">Lv.21</span>
   </div>
   <div className="card-progress-bar">
    <div className="progress-fill git-progress-fill" style={{ width: '21%' }}></div>
  </div>
</div>

  </div>
</div>

            {/* PROFILE SECTION */}
<section className="profile-section">
  <div className="container-flex">
    <div className="image-wrapper">
      <img src="  /jesuschristkatolik.jpg" className="img-main" alt="Gereja" />
      <div className="floating-logo">
<img src="./images/Atlas.png" alt="Floating Logo" />
      </div>
    </div>
    <div className="text-wrapper">
      <span className="label-eltri">Lukas 1:37</span>
      <h2 className="name-title">ELTRI PUTRA ROMBEBUA</h2>
      <div className="visi-content">
        <p className="visi-text">"Tuhan Yang Maha Esa"</p>
      </div>
    </div>
  </div>
</section>

<div style={{ width: '100%', padding: '40px 15px', boxSizing: 'border-box', position: 'relative', zIndex: 10 }}>
      
  {/* 🟦 CARD UTAMA - Super Responsif Desktop & Mobile */}
  <div style={{
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: 'rgba(10, 18, 44, 0.6)', /* Hitam kebiruan transparan */
    border: '1px solid rgba(6, 182, 212, 0.3)', /* Border cyan tipis */
    borderRadius: '16px',
    padding: '30px 20px', /* Padding dinamis agar ramah di layar HP */
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    flexWrap: 'wrap-reverse' /* Menggunakan wrap-reverse agar di mobile, gambar logo naik ke atas teks profil */
  }}>
    
    {/* SISI KIRI: TEKS DATA DIRI */}
    {/* Menggunakan minWidth 100% untuk mobile, dan flex-grow untuk desktop */}
    <div style={{ flex: '1 1 280px', textAlign: 'left' }}>
      <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', color: '#06b6d4', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
        ELTRI ATLAS
      </span>
      <h2 style={{ fontSize: '24px', mdFontSize: '28px', fontWeight: '900', letterSpacing: '1px', color: '#ffffff', margin: '0 0 10px 0', textTransform: 'uppercase', lineHeight: '1.2' }}>
        ELTRI PUTRA ROMBEBUA    
      </h2>
      <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 16px 0', fontWeight: '300' }}>
        Full-Stack Developer specializing in secure web applications, automated builds, and highly customized interface deployment.
      </p>

      {/* TOMBOL EMAIL */}
      <div style={{ marginTop: '15px' }}>
        <a 
          href="mailto:eltriputrarb@gmail.com" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            color: '#22d3ee',
            fontSize: '12px',
            fontWeight: '600',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            letterSpacing: '0.5px',
            wordBreak: 'break-word' /* Mencegah teks email meluber keluar tombol di HP layar kecil */
          }}
        >
          <span>✉️</span> eltriputrarb@gmail.com
        </a>
      </div>
    </div>

    {/* SISI KANAN: EMBLEM LOGO BULAT */}
    {/* Menambahkan margin auto pada container flex agar logo otomatis berada di tengah pas layar HP */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#070d24',
        border: '2px solid rgba(6, 182, 212, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)',
        overflow: 'hidden'
      }}>
        <img 
          src="images/lmz.jpg" 
          alt="EP ATLAS LOGO" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
    </div>

  </div>

  {/* 🔒 FOOTER */}
  <footer style={{ width: '100%', textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingLeft: '10px', paddingRight: '10px' }}>
    <p style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.2em', margin: 0, textTransform: 'uppercase', lineHeight: '1.5' }}>
      Copyright © 2026 <span style={{ color: '#94a3b8', fontWeight: '700' }}>ELTRI ATLAS</span> - All Rights Reserved
    </p>
  </footer>

</div>

          </>
        } />

        <Route path="/proyek" element={<PublicProfile />} />

        <Route path="/gallery" element={<Gallery />} />

        <Route path="/ErrorPage" element={<ErrorPage />} />

      </Routes>
    </div>
  );
}

export default EltriPutnzs;