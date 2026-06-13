import React, { useEffect, useState, useRef } from 'react';
import './gallery.css';

function Gallery() {
  const [currentPercent, setCurrentPercent] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
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
    // FIX: Matikan paksa audio video jika lightbox ditutup agar suaranya tidak bocor
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setModalOpen(false);
    setModalMedia({ type: '', src: '' });
  };

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

return (
    <div className="gallery-view">
      {/* UPDATE SERVER LOADER */}
      {showLoader && (
        <div className={`eltri-loader-wrapper ${fadeLoader ? 'fade-out' : ''}`} style={{ display: 'flex' }}>
          <div className="loader-content">
            <div className="loader-visual-zone">
              <div className="neon-spinner"></div>
              <img src={`${process.env.PUBLIC_URL}/logo.png`} className="loader-center-logo" alt="Logo ELTRI" />
            </div>
            <div className="loader-text">ELTRI PROJECT<span>.</span></div>
            <div className="loader-subtext">LOADING UPDATE SERVER [<span id="gdPercent">{currentPercent < 10 ? '0' : ''}{currentPercent}%</span>]</div>
          </div>
        </div>
      )}

      {/* KODE NAVBAR DOUBLE SEBELUMNYA SUDAH DIHAPUS TOTAL DI SINI */}

      {/* BACKGROUND ANIMASI CUBES */}
<ul className="cubes-fixed">
    <li></li><li></li><li></li><li></li><li></li>
    <li></li><li></li><li></li><li></li>
  </ul>

      {/* STRUKTUR UTAMA CONTAINER */}
      <main className="gallery-container">
        <header className="gallery-header">
          <h1>MY <span>GALLERY</span></h1>
          <p>Tapi saya sendiri yang mengambil foto developernya dari ELTRI PROJECT</p>
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