import { render, screen } from '@testing-library/react';
// 1. Ubah import dari ./App menjadi ./eltriputnzs
import EltriPutnzs from './eltriputnzs'; 

test('renders eltri project profile', () => {
  // 2. Render komponen baru kamu
  render(<EltriPutnzs />);
  
  // 3. Cari kata yang PASTI ADA di halaman eltriputnzs.js kamu 
  // (Contohnya kata "ELTRI" atau "PROJECT" yang ada di judul dashboard-mu)
  const elementGahar = screen.getByText(/ELTRI/i);
  
  // 4. Pastikan teks tersebut berhasil muncul di browser saat ditest
  expect(elementGahar).toBeInTheDocument();
});