import React, { useEffect, useRef } from 'react';
import './proyek.css';

const PublicProfile = () => {
  // dipakai untuk melacak status navbar tanpa memicu re-render React
  const isScrolledRef = useRef(false);
  const tickingRef = useRef(false);

useEffect(() => {
    // --- STICKY NAVBAR ON SCROLL EFFECT (DIOPTIMASI) ---
    const applyNavbarState = () => {
      const navbar = document.querySelector('.container-navbar');
      if (navbar) {
        const shouldBeScrolled = window.scrollY > 50;
        if (shouldBeScrolled !== isScrolledRef.current) {
          navbar.classList.toggle('navbar-scrolled', shouldBeScrolled);
          isScrolledRef.current = shouldBeScrolled;
        }
      }
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(applyNavbarState);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
<div className="profile-page">
      {/* PARTIKEL ANIMASI KUBUS GAHAR */}
      <ul className="cubes-fixed">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li>
      </ul>

      <div className="hero-about">
        <section className="public-profile">
          <div className="profile-container">

            {/* SIDEBAR PROFILE */}
            <div className="side-bar rpg-profile-sidebar">
              <div className="photo-frame">
                <img 
                  src="images/katolik.jpg" 
                  alt="Eltri Putra" 
                  // --- FIX ANTI CURI GAMBAR PROFIL ---
                  onContextMenu={(e) => e.preventDefault()} 
                  draggable={false} 
                />
              </div>

              <div className="side-content">
                <h3>
                  <i className="fas fa-user-circle"></i>PROFIL AKTIF ONLINE
                </h3>

                <div className="status-pill">
                  <p>Eltri Putra Rombebua</p>
                  <span className="status-dot-fixed"></span>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content">
              <h1 className="profile-name">ELTRI PUTRA ROMBEBUA</h1>
              <hr className="line-gold" />

              <div className="info-section">
                <h2>
                  <i className="fas fa-graduation-cap"></i> RIWAYAT PENDIDIKAN
                </h2>

                {/* ITEM 1: SMK */}
                <div className="item item-plain">
                  <div className="item-title">
                    <strong>SMK XXXXX XXXXX</strong>
                  </div>
                  <span className="badge-red">2023 - 2026 Offline</span>
                </div>

                {/* ITEM 2: SMP */}
                <div 
                  className="item education-item" 
                  style={{ '--edu-bg': "url('/images/Eltripro.jpg')" }}
                  // --- ANTI CURI UNTUK DIV BACKGROUND (Mencegah Klik Kanan Pada Background Gambar) ---
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="item-title">
                    <strong>SMPLB/SMP Katolik Rajawali</strong>

                    <a
                      href="https://maps.app.goo.gl/J7tRUt9f3QzeR5pi8"
                      className="maps-link"
                      onClick={handleMapsClick}
                      data-google="https://maps.app.goo.gl/J7tRUt9f3QzeR5pi8"
                      data-apple="https://maps.apple.com/place?address=Jalan+Arief+Rate+No.+2%2C+Makassar%2C+South+Sulawesi+90112%2C+Indonesia&coordinate=-5.145646%2C119.411699&name=SMP+Katolik+Rajawali"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-map-marker-alt"></i> LIHAT LOKASI SEKOLAH
                    </a>
                  </div>
                  <span className="badge-green">2020 - 2023 Online</span>
                </div>

                {/* ITEM 3: SD */}
                <div 
                  className="item education-item" 
                  style={{ '--edu-bg': "url('/images/Eltripro.jpg')" }}
                  // --- ANTI CURI UNTUK DIV BACKGROUND ---
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="item-title">
                    <strong>SDLB/SD ST. Joseph Katolik Rajawali</strong>
                    <a
                      href="https://maps.app.goo.gl/o1JExkS8SGsWWa1R8"
                      className="maps-link mono"
                      onClick={handleMapsClick}
                      data-google="https://maps.app.goo.gl/o1JExkS8SGsWWa1R8"
                      data-apple="maps://maps.apple.com/?q=SD+Katolik+Rajawali+Makassar"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-map-marker-alt"></i> LIHAT LOKASI SEKOLAH
                    </a>
                  </div>
                  <span className="badge-green">2014 - 2020 Online</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      <footer className="main-footer">
        Copyright © 2026 ELTRI ATLAS - All Rights Reserved
      </footer>
    </div>
  );
};

export default PublicProfile;