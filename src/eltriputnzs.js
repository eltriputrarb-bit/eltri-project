import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.module.css';
import Gallery from './gallery'; 
import PublicProfile from './proyek'; 
import ErrorPage from './ErrorPage';
import MessageForm from './MessageForm';
import './MessageForm.css';
import AdminMessages from './AdminMessages';


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
<section className="hero hero-section">
  <ul className="cubes-fixed">
    <li></li><li></li><li></li><li></li><li></li>
    <li></li><li></li><li></li><li></li>
  </ul>
  <div className="hero-content">
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

<footer 
  className="footer" 
  style={{ backgroundImage: "linear-gradient(rgba(20, 20, 20, 0.85), rgba(20, 20, 20, 0.85)), url('/images/jp.gif')" }}
>
  <div className="container">
    
    {/* BAGIAN KIRI: Teks Informasi */}
    <div className="footer-content">
      <span className="ayat-text">LUKAS 1:37 🕊️</span>
      <h3 className="title">ELTRI PUTRA ROMBEBUA</h3>
      <p className="slogan-text">"Tuhan Yang Maha Esa"</p>
      <p className="email-text">
        <a href="mailto:eltriputrarb@gmail.com" className="email-link">
          <i className="fas fa-envelope icon-spacing"></i> eltriputrarb@gmail.com
        </a>
      </p>
      <MessageForm />
    </div>

    {/* BAGIAN KANAN: Foto Profil Bulat Elegan */}
    <div className="footer-profile">
      <img src="/images/lmz.jpg" alt="Eltri Profile" className="profile-img" />
    </div>

  </div>
  
  <div className="copyright">
    Copyright © 2026 ELTRI ATLAS - All Rights Reserved
  </div>
</footer>

          </>
        } />

        <Route path="/proyek" element={<PublicProfile />} />

        <Route path="/gallery" element={<Gallery />} />

        <Route path="/ErrorPage" element={<ErrorPage />} />

        <Route path="/admin" element={<AdminMessages />} />

      </Routes>
    </div>
  );
}

export default EltriPutnzs;