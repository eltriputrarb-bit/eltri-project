import React, { useEffect, useState, useRef } from 'react';
import './gallery.css';

// Ganti URL ini dengan nama kamu setelah deploy backend
const BACKEND_URL = '';

// Data statis dipindah keluar komponen supaya tidak jadi dependency useEffect
// dan tidak dibuat ulang tiap kali komponen re-render
const galleryItems = [
  { id: 17, type: 'video', src: '/video/katolik.mp4', date: '23/06,juni,2026', desc: 'gereja katedral Makassar hati yesus yang mahakudus' },
  { id: 16, type: 'video', src: '/video/jalan.mp4', date: '23/06,juni,2026', desc: 'jalan ke gereja' },
  { id: 15, type: 'video', src: '/video/elin.mp4', date: '20/06,juni,2026', desc: 'servis honda' },
  { id: 14, type: 'video', src: '/video/kotae.mp4', date: '19/06,juni,2026', desc: '⛅️' },
  { id: 11, type: 'img', src: '/images/foto11.jpg', date: '10/06,juni,2026', desc: 'warkop gunung nona indah' },
  { id: 12, type: 'video', src: '/video/Nostalgia.mp4', date: '09/06,juni,2026', desc: 'kid miss u' },
  { id: 10, type: 'img', src: '/images/foto10.jpg', date: '08/06,juni,2026', desc: 'toraja' },
  { id: 9, type: 'img', src: '/images/foto9.jpg', date: '07/06,juni,2026', desc: 'Lokasi: di makale, tana toraja' },
  { id: 1, type: 'img', src: '/images/foto1.jpg', date: '15/05,mei,2026', desc: 'Lokasi: Makassar Sudut pandang sinematik jalanan kota' },
  { id: 6, type: 'img', src: '/images/foto6.jpg', date: '18/4,APRIL,2026', desc: 'SAYA SENDIRI INI MAU MAKAN' },
  { id: 4, type: 'img', src: '/images/foto4.jpg', date: '14/03,MARET,2026', desc: 'Parkiran Roda mobil' },
  { id: 3, type: 'img', src: '/images/foto3.jpg', date: '07/12,DESEMBER,2018', desc: 'SAYA FOTO PAKAI CAMERA SMAKARA' },
  { id: 2, type: 'img', src: '/images/RAJAWALI.jpg', date: '06/08,AGUSTUS,2015', desc: 'RAJAWALI ANAK KECIL' },
];

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

  // Loader - REAL progress dari network (fetch views + preload gambar/video)
  useEffect(() => {
    document.body.classList.add('no-scroll');
    let isMounted = true;

    const finishLoading = () => {
      if (!isMounted) return;
      setCurrentPercent(100);
      setTimeout(() => {
        setFadeLoader(true);
        document.body.classList.remove('no-scroll');
        setTimeout(() => setShowLoader(false), 600);
      }, 200);
    };

    async function loadEverything() {
      const tasks = [];

      // 1. Fetch data views
      const viewsTask = fetch(`${BACKEND_URL}/api/views`)
        .then(res => res.json())
        .then(data => { if (isMounted) setMediaViews(data); })
        .catch(err => console.error('Gagal fetch views:', err));
      tasks.push(viewsTask);

      // 2. Preload semua gambar
      const imageTasks = galleryItems
        .filter(item => item.type === 'img')
        .map(item => new Promise((resolve) => {
          const img = new Image();
          img.src = `${process.env.PUBLIC_URL}${item.src}`;
          img.onload = resolve;
          img.onerror = resolve;
        }));
      tasks.push(...imageTasks);

      // 3. Preload metadata video
      const videoTasks = galleryItems
        .filter(item => item.type === 'video')
        .map(item => new Promise((resolve) => {
          const video = document.createElement('video');
          video.src = `${process.env.PUBLIC_URL}${item.src}`;
          video.preload = 'metadata';
          video.onloadedmetadata = resolve;
          video.onerror = resolve;
        }));
      tasks.push(...videoTasks);

      const total = tasks.length || 1;
      let completed = 0;

      tasks.forEach(task => {
        Promise.resolve(task).then(() => {
          completed++;
          if (isMounted) {
            setCurrentPercent(Math.round((completed / total) * 100));
          }
        });
      });

      await Promise.all(tasks);
      finishLoading();
    }

    loadEverything();

    // Safety net: kalau network lambat/hang, loader tetap ketutup max 10 detik
    const safetyTimeout = setTimeout(() => {
      if (isMounted) finishLoading();
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
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
                    // --- FIX GRID GAMBAR ---
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    onClick={() => openModal('img', `${process.env.PUBLIC_URL}${item.src}`, item.id)}
                  />
                ) : (
                  <video
                    src={`${process.env.PUBLIC_URL}${item.src}`}
                    autoPlay muted loop playsInline
                    controlsList="nodownload"
                    className="clickable-media"
                    // --- FIX GRID VIDEO ---
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => openModal('video', `${process.env.PUBLIC_URL}${item.src}`, item.id)}
                  ></video>
                )}
              </div>
              <div className="card-info">
                <h3>{item.date}</h3>
                <p>{item.desc}</p>
                <span className={`views-badge ${
                  (mediaViews[item.id] || 0) >= 50 ? 'views-hot' :
                  (mediaViews[item.id] || 0) >= 10 ? 'views-warm' :
                  (mediaViews[item.id] || 0) >= 1 ? 'views-cool' : 'views-zero'
                }`}>
                  {(mediaViews[item.id] || 0) >= 50 ? '🔥' :
                   (mediaViews[item.id] || 0) >= 10 ? '⚡' :
                   (mediaViews[item.id] || 0) >= 1 ? '👁' : '👁'} {mediaViews[item.id] || 0} views
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
            <img
              className="modal-content"
              src={modalMedia.src}
              alt="Lightbox Zoom"
              // --- FIX MODAL GAMBAR ---
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              ref={videoRef}
              className="modal-content"
              src={modalMedia.src}
              controls controlsList="nodownload" loop autoPlay
              // --- FIX MODAL VIDEO ---
              onContextMenu={(e) => e.preventDefault()}
              onClick={(e) => e.stopPropagation()}
            ></video>
          )}
        </div>  
      )}
    </div>
  );
}

export default Gallery;