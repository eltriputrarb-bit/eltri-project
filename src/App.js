import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Gallery from './gallery'; 
import PublicProfile from './proyek'; 
import ErrorPage from './ErrorPage';   


function App() {

  useEffect(() => {
    // 1. Protokol Sistem Keamanan Master Eltri
    const handleContextMenu = (e) => {
      e.preventDefault();
      alert("❌ PROTOKOL KEAMANAN: Hak Akses Hanya Untuk Master Eltri!");
    };

    const handleKeyDown = (e) => {
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // 2. Logika Jam Digital Dunia (World Clock)
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

    // 3. Sticky Navbar saat di-scroll
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
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
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

  return (
    <div className="App">
{/* NAVBAR */}
      <nav className="container-navbar">
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <img src={`${process.env.PUBLIC_URL}/logo.png`} className="logo" alt="Logo" />
            <span className="brand-text">ELTRI PROJECT</span>
          </Link>
        </div>

        <div className="nav-right">
          <ul className="ul-navbar" id="nav-links">
            <li>
              <Link to="/" className="menu-item-btn btn-gahar">
                <i className="fas fa-home"></i> HOME
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="menu-item-btn btn-gahar">
                <i className="fas fa-images"></i> GALLERY
              </Link>
            </li>
            <li>
              <a href="/proyek" className="menu-item-btn btn-gahar">
                <i className="fas fa-user"></i> PublicProfile
              </a>
            </li>
            <li>
              <a href="/ErrorPage" className="menu-item-btn btn-gahar">
                <i className="fas fa-exclamation-triangle"></i> ErrorPage
              </a>
            </li>
          </ul>

          <div className="menu-toggle" id="mobile-menu" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
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

            {/* SOCIAL FOOTER */}
<section className="social-footer">
  <h3>Project Sosial</h3>
  <div className="social-icons">
    <a href="https://www.instagram.com/eltriputra?igsh=cDE5ZXllNXB4dHNo" className="icon instagram" target="_blank" rel="noreferrer">
      <i className="fab fa-instagram"></i>
    </a>
    <a href="https://x.com/eltri_putra" className="icon x-logo" target="_blank" rel="noreferrer">
      <svg className="svg-x" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
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

            {/* SKILLS SECTION */}
            <div className="skills-section-wrapper">
              <ul className="cubes">
                <li></li><li></li><li></li><li></li>
              </ul>
              <div className="skills-grid-container">
                
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

              </div>
            </div>

            {/* PROFILE SECTION */}
            <section className="profile-section">
              <div className="container-flex">
                <div className="image-wrapper">
                  <img src={`${process.env.PUBLIC_URL}/gereja.jpg`} className="img-main" alt="Gereja" />
                  <div className="floating-logo">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Floating Logo" />
                  </div>
                </div>

                <div className="text-wrapper">
                  <span className="label-eltri">ELTRI</span>
                  <h2 className="name-title">ELTRI PUTRA ROMBEBUA</h2>
                  <div className="visi-content">
                    <p className="visi-text">"Tuhan Yang Maha Esa"</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        } />

        <Route path="/proyek" element={<PublicProfile />} />
        {/* HALAMAN GALLERY */}
        <Route path="/gallery" element={<Gallery />} />

        <Route path="/ErrorPage" element={<ErrorPage />} />

      </Routes>
    </div>
  );
}

export default App;