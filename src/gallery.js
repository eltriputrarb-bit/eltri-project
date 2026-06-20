import React, { useEffect, useState, useRef } from 'react';
import './gallery.css';

// Ganti URL ini dengan URL Railway kamu setelah deploy backend
const BACKEND_URL = 'https://eltri-project-production.up.railway.app';

function Gallery() {
  const [currentPercent, setCurrentPercent] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState({ type: '', src: '' });
  const [mediaViews, setMediaViews] = useState({});

  const videoRef = useRef(null);
  const itemsPerPage = 12;

  const galleryItems = [
    { id: 17, type: 'video', src: '/video/elin.mp4', date: '20/06,juni,2026', desc: 'servis honda' },
    { id: 16, type: 'video', src: '/video/kotae.mp4', date: '19/06,juni,2026', desc: '⛅️' },    
    { id: 14, type: 'img', src: '/images/foto13.jpg', date: '14/06,juni,2026', desc: 'DI SMC MAKASSAR' },
    { id: 15, type: 'img', src: '/images/foto12.jpg', date: '14/06,juni,2026', desc: 'DI SMC MAKASSAR' },
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
  ];

  // Loader
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
            setTimeout(() => setShowLoader(false), 600);
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

  // Sticky Navbar
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.container-navbar');
      if (navbar) {
        if (window.scrollY > 50) navbar.classList.add('navbar-scrolled');
        else navbar.classList.remove('navbar-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch semua views saat halaman load
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/views`)
      .then(res => res.json())
      .then(data => setMediaViews(data))
      .catch(err => console.error('Gagal fetch views:', err));
  }, []);

  // Pagination
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = galleryItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const headerGaleri = document.querySelector('.gallery-header');
    if (headerGaleri) headerGaleri.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = (type, src, id) => {
    setModalMedia({ type, src });
    setModalOpen(true);
    fetch(`${BACKEND_URL}/api/views/${id}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => setMediaViews(prev => ({ ...prev, [id]: data.views })))
      .catch(err => console.error('Gagal update views:', err));
  };

  const closeModal = () => {
    if (videoRef.current) videoRef.current.pause();
    setModalOpen(false);
    setModalMedia({ type: '', src: '' });
  };

  return (
    <div className="gallery-view">
      {showLoader && (
        <div className={`eltri-loader-wrapper ${fadeLoader ? 'fade-out' : ''}`} style={{ display: 'flex' }}>
          <div className="loader-content">
            <div className="loader-visual-zone">
              <div className="neon-spinner"></div>
              <img src={`${process.env.PUBLIC_URL}/images/Atlas.png`} className="loader-center-logo" alt="Logo ELTRI" />
            </div>
            <div className="loader-text">ELTRI ATLAS<span>.</span></div>
            <div className="loader-subtext">LOADING UPDATE SERVER [<span id="gdPercent">{currentPercent < 10 ? '0' : ''}{currentPercent}%</span>]</div>
          </div>
        </div>
      )}

      <ul className="cubes-fixed">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li>
      </ul>

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
                    onClick={() => openModal('img', `${process.env.PUBLIC_URL}${item.src}`, item.id)}
                  />
                ) : (
                  <video
                    src={`${process.env.PUBLIC_URL}${item.src}`}
                    autoPlay muted loop playsInline
                    controlsList="nodownload"
                    className="clickable-media"
                    onClick={() => openModal('video', `${process.env.PUBLIC_URL}${item.src}`, item.id)}
                  ></video>
                )}
              </div>
              <div className="card-info">
                <h3>{item.date}</h3>
                <p>{item.desc}</p>
                <span className="views-badge">
                  👁 {mediaViews[item.id] || 0} views
                </span>
              </div>
            </div>
          ))}
        </section>

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
              controls controlsList="nodownload" loop autoPlay
              onClick={(e) => e.stopPropagation()}
            ></video>
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;
