import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import './gallery.css';

// HUBUNGKAN REACT LANGSUNG KE SUPABASE
// HUBUNGKAN REACT LANGSUNG KE SUPABASE
const SUPABASE_URL = 'https://oxnyqfoysthtlustjvl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-Tncd7R6MfQO85_nY5t7-g_XRimKZhh';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (!SUPABASE_URL.includes("SALIN_URL") && !SUPABASE_ANON_KEY.includes("SALIN_ANON")) {
   supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function Gallery() {
  const [currentPercent, setCurrentPercent] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // State khusus untuk menampung angka views asli dari server
  const [realViews, setRealViews] = useState(0);
  
  // State untuk Lightbox Modal Popup
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState({ type: '', src: '' });

  const videoRef = useRef(null);
  const itemsPerPage = 12;

  // Data Media Grid Galeri Kamu
  const galleryItems = [
    { id: 11, type: 'img', src: '/images/foto11.jpg', date: '10/06,juni,2026', desc: 'warkop gunung nona indah' },
    { id: 12, type: 'video', src: '/video/Nostalgia.mp4', date: '09/06,juni,2026', desc: 'kid miss u' },
    { id: 10, type: 'img', src: '/images/foto10.jpg', date: '08/06,juni,2026', desc: 'toraja' },
    { id: 9, type: 'img', src: '/images/foto9.jpg', date: '07/06,juni,2026', desc: 'Lokasi: di makale, tana toraja' },
    { id: 13, type: 'video', src: '/video/perumtel.mp4', date: '04/06,juni,2026', desc: 'saya jalan jadi' },
    { id: 8, type: 'img', src: '/images/foto8.jpg', date: '30/05,mei,2026', desc: 'Lokasi: Hokky Rumah Makan China' },
    { id: 1, type: 'img', src: '/images/foto1.jpg', date: '15/05,mei,2026', desc: 'Lokasi: Makassar Sudut pandang sinematik jalanan kota' },
    { id: 6, type: 'img', src: '/images/foto6.jpg', date: '18/4,APRIL,2026', desc: 'SAYA SENDIRI INI MAU MAKAN' },
    { id: 4, type: 'img', src: '/images/foto4.jpg', date: '14/03,MARET,2026', desc: 'Parkiran Roda mobil' },
    { id: 3, type: 'img', src: '/images/foto3.jpg', date: '07/12,DESEMBER,2018', desc: 'SAYA FOTO PAKAI CAMERA SMAKARA' },
    { id: 14, type: 'video', src: '/video/jepang.mp4', date: '✨', desc: '' },
    { id: 15, type: 'video', src: '/video/batman.mp4', date: 'WALLA Y\'A BATMAN 🔥', desc: '' }
  ];

  // LOGIKA AMBIL DAN UPDATE DATA VIEWS SUPABASE
  useEffect(() => {
    const handleServerViews = async () => {
      try {
        // 1. Ambil data count baris pertama dari tabel views_counter
        const { data, error } = await supabase
          .from('views_counter')
          .select('count')
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const currentViews = data.count;
          const updatedViews = currentViews + 1;

          // 2. Kirim update +1 kembali ke database
          await supabase
            .from('views_counter')
            .update({ count: updatedViews })
            .match({ count: currentViews });

          // 3. Setel angka terbaru ke layar website
          setRealViews(updatedViews);
        } else {
          // Jika tabel kosong di Supabase, daftarkan data awal angka 1
          const { error: insertError } = await supabase
            .from('views_counter')
            .insert([{ count: 1 }]);
            
          if (!insertError) setRealViews(1);
        }
      } catch (err) {
        console.error("Gagal koneksi ke server database:", err);
      }
    };

    handleServerViews();
  }, []);

  // Loader 10 Detik Murni
  useEffect(() => {
    document.body.classList.add('no-scroll');
    const intervalWaktu = 100; 
    const timer = setInterval(() => {
      setCurrentPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeLoader(true);
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
              setShowLoader(false);
            }, 600);
          }, 200);
          return 100;
        }
        return prev + 1;
      });
    }, intervalWaktu);

    return () => {
      clearInterval(timer);
      document.body.classList.remove('no-scroll');
    };
  }, []);

  // Sticky Navbar Controller
  useEffect(() => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hitung Sistem Pagination
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = galleryItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const headerGaleri = document.querySelector('.gallery-header');
    if (headerGaleri) headerGaleri.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = (type, src) => {
    setModalMedia({ type, src });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setModalOpen(false);
    setModalMedia({ type: '', src: '' });
  };

  return (
    <div className="gallery-view">
      {/* UPDATE SERVER LOADER */}
      {showLoader && (
        <div className={`eltri-loader-wrapper ${fadeLoader ? 'fade-out' : ''}`} style={{ display: 'flex' }}>
          <div className="loader-content">
            <div className="loader-visual-zone">
              <div className="neon-spinner"></div>
              <img src={`${process.env.PUBLIC_URL}/images/logo.png`} className="loader-center-logo" alt="Logo ELTRI" />
            </div>
            <div className="loader-text">ELTRI PROJECT<span>.</span></div>
            <div className="loader-subtext">LOADING UPDATE SERVER [<span id="gdPercent">{currentPercent < 10 ? '0' : ''}{currentPercent}%</span>]</div>
          </div>
        </div>
      )}

      {/* BACKGROUND ANIMASI CUBES */}
      <ul className="cubes">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li>
      </ul>

      {/* STRUKTUR UTAMA CONTAINER */}
      <main className="gallery-container">
        <header className="gallery-header">
          <h1>MY <span>GALLERY</span></h1>
          <p>Tapi saya sendiri yang mengambil foto developernya dari ELTRI PROJECT</p>
          
          {/* TAMPILAN PERMANEN DATA VIEWS DI BAWAH JUDUL GALERI */}
          <div style={{ color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px', marginTop: '12px', fontSize: '1rem', textShadow: '0 0 8px rgba(0,229,255,0.3)' }}>
            TOTAL SERVER VIEWS: <span style={{ color: '#ffffff' }}>{realViews}</span>
          </div>
        </header>

        <section className="gallery-grid">
          {currentItems.map((item) => (
            <div className="gallery-card" key={item.id}>
              <div className="card-img-wrapper">
                {item.type === 'img' ? (
                  <img 
                    src={`${process.env.PUBLIC_URL}${item.src}`} 
                    alt={item.desc || 'Gallery Visual'} 
                    className="clickable-media"
                    onClick={() => openModal('img', `${process.env.PUBLIC_URL}${item.src}`)}
                  />
                ) : (
                  <video 
                    src={`${process.env.PUBLIC_URL}${item.src}`} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    controlsList="nodownload" 
                    className="clickable-media"
                    onClick={() => openModal('video', `${process.env.PUBLIC_URL}${item.src}`)}
                  ></video>
                )}
              </div>
              <div className="card-info">
                <h3>{item.date}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* PAGINATION BUTTONS CONTROL */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button className="page-btn" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
            <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <i className="fas fa-chevron-right"></i>
            </button>
            <button className="page-btn" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
          </div>
        )}
      </main>

      {/* LIGHTBOX POPUP POP */}
      {modalOpen && (
        <div className="modal-lightbox" style={{ display: 'flex' }} onClick={closeModal}>
          <span className="close-btn" onClick={(e) => { e.stopPropagation(); closeModal(); }}>&times;</span>
          {modalMedia.type === 'img' ? (
            <img className="modal-content" src={modalMedia.src} alt="Lightbox Zoom" onClick={(e) => e.stopPropagation()} />
          ) : (
            <video 
              ref={videoRef}
              className="modal-content" 
              src={modalMedia.src} 
              controls 
              controlsList="nodownload" 
              loop 
              autoPlay
              onClick={(e) => e.stopPropagation()}
            ></video>
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;