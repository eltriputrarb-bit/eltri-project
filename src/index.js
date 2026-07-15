import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Ini yang tadinya anggur ga kepakai
import './index.css';
import EltriPutnzs from './eltriputnzs'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* WAJIB BUNGKUS KOMPONEN KAMU DI SINI AGAR LINK & ROUTE BISA JALAN */}
    <BrowserRouter>
      <EltriPutnzs />
    </BrowserRouter>
  </React.StrictMode>
);