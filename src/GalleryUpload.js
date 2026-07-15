import React, { useEffect, useState, useRef } from 'react';
import './gallery.css';
import UploadForm from './UploadForm';

const BACKEND_URL = 'https://eltri-project-production.up.railway.app';

function GalleryUpload() {
  const [uploadedItems, setUploadedItems] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState({ type: '', src: '' });
  const [mediaViews, setMediaViews] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const videoRef = useRef(null);
  const itemsPerPage = 12;

  // Fetch foto upload dari backend
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/gallery`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          ...item,
          src: `${BACKEND_URL}${item.src}`,
          isUploaded: true
        }));
        setUploadedItems(formatted);
      })
      .catch(err => console.error('Gagal fetch gallery upload:', err));
  }, []);

  // Fetch views
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/views`)
      .then(res => res.json())
      .then(data => setMediaViews(data))
      .catch(err => console.error('Gagal fetch views:', err));
  }, []);

  const handleUploadSuccess = (newItem) => {
    const formatted = {
      ...newItem,
      src: `${BACKEND_URL}${newItem.src}`,
      isUploaded: true
    };
    setUploadedItems(prev => [formatted, ...prev]);
    setCurrentPage(1);
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

  const totalPages = Math.ceil(uploadedItems.length / itemsPerPage);
  const currentItems = uploadedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="gallery-view">
      <ul className="cubes">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li>
      </ul>

      <main className="gallery-container">
        <header className="gallery-header">
          <h1>UPLOAD <span>GALLERY</span></h1>
          <p>Foto & video yang diupload langsung dari ELTRI PROJECT</p>

          <button
            className="page-btn"
            style={{ marginTop: '16px' }}
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            {showUploadForm ? 'Tutup Form Upload' : '+ Upload Foto Baru'}
          </button>

          {showUploadForm && (
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          )}
        </header>

        {uploadedItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>
            Belum ada foto yang diupload.
          </p>
        ) : (
          <section className="gallery-grid">
            {currentItems.map((item) => (
              <div className="gallery-card" key={item.id}>
                <div className="card-img-wrapper">
                  {item.type === 'img' ? (
                    <img
                      src={item.src}
                      alt={item.desc || 'Gallery Visual'}
                      className="clickable-media"
                      onClick={() => openModal('img', item.src, item.id)}
                    />
                  ) : (
                    <video
                      src={item.src}
                      autoPlay muted loop playsInline
                      controlsList="nodownload"
                      className="clickable-media"
                      onClick={() => openModal('video', item.src, item.id)}
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
        )}

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

export default GalleryUpload;