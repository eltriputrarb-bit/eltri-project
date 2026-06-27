import { useEffect, useRef } from "react";

export default function FloatingLines({
  linesGradient = ["#E945F5", "#2F4BC0", "#00F0FF"],
  animationSpeed = 0.4, // Dibikin pelan biar sinematik dan elegan
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Membuat kumpulan serat garis (banyak baris kecil membentuk anyaman pita)
    const linesCount = 18; 
    let step = 0;

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      // Background super gelap semi transparan sedikit biar ada efek motion blur ekor garis
      ctx.fillStyle = "rgba(10, 10, 22, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Interpolasi gerakan mouse (Damping effect lembut)
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // PENGATURAN EFEK GLOW / BERSINAR SEPERTI DI GAMBAR
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(233, 69, 245, 0.6)";

      // Gambar rajutan serat satu per satu
      for (let i = 0; i < linesCount; i++) {
        ctx.beginPath();
        
        // Gabungan gradasi warna Ungu, Biru, dan Cyan Neon
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, linesGradient[0]);
        gradient.addColorStop(0.5, linesGradient[1]);
        gradient.addColorStop(1, linesGradient[2]);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2; // Garis tipis biar jadi serat halus

        // Geseran gelombang vertikal unik untuk setiap serat
        const offset = i * 4;

        for (let x = 0; x < width; x += 10) {
          // Rumus sinus dinamis digabung pengaruh posisi mouse vertical (mouse.y)
// Cari baris kode ini di dalam loop for file FloatingLines.js lo:
          const baseWave = Math.sin(x * 0.002 + step + i * 0.06) * 140; // Ganti angka paling belakang dari 70 ke 140
          const secondaryWave = Math.cos(x * 0.001 - step + i * 0.05) * 45;
          
          // Reaksi interaktif tipis mendekati kursor mouse
          const mouseInfluence = Math.sin(x * 0.005 + mouse.x * 0.001) * ((height / 2 - mouse.y) * 0.3);

          const y = height / 2 + baseWave + secondaryWave + mouseInfluence + offset;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Matikan shadow blur biar komponen teks di depannya gak ikutan ngeblur kaku
      ctx.shadowBlur = 0;

      step += 0.02 * animationSpeed;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [linesGradient, animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 1, // Di belakang teks utama
      }}
    />
  );
}