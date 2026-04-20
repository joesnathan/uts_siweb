"use client"; // Wajib agar bisa pakai useState dan fungsi klik

import { useState } from "react";

export default function TrackingPage() {
  // 1. State untuk input, hasil, dan pesan error
  const [cargoId, setCargoId] = useState("");
  const [searchResult, setSearchResult] = useState<null | "found" | "not_found">(null);
  const [errorNotify, setErrorNotify] = useState("");

  // Data Dummy untuk simulasi pengecekan
  const validId = "CGK-123456789";

  const handleTrack = () => {
    setErrorNotify(""); // Reset error setiap klik
    setSearchResult(null);

    // Validasi: Jika input kosong
    if (!cargoId.trim()) {
      setErrorNotify("Harap isi Cargo ID terlebih dahulu!");
      return;
    }

    // Simulasi: Cek apakah ID sesuai dengan data kita
    if (cargoId === validId) {
      setSearchResult("found");
    } else {
      setSearchResult("not_found");
    }
  };

  return (
    <div className="relative flex-grow flex items-center justify-center min-h-[90vh] p-4 md:p-8 overflow-hidden">
      {/* 1. Latar Belakang Gambar */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: 'url("/bg.jpeg")' }}
      ></div>

      <div className="absolute inset-0 bg-[#0f284f]/80 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">Track Your Cargo</h1>
          <p className="text-blue-200 text-sm md:text-base">Enter your Air Waybill (AWB) or Cargo ID to see real-time status</p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex w-full max-w-2xl bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 focus-within:ring-4 focus-within:ring-blue-400/50">
            <input 
              type="text" 
              value={cargoId}
              onChange={(e) => setCargoId(e.target.value)}
              placeholder="e.g. CGK-123456789"
              className="flex-grow px-6 py-3 rounded-l-full bg-transparent outline-none text-gray-800 font-semibold placeholder-gray-400"
            />
            <button 
              onClick={handleTrack}
              className="bg-[#1E3A8A] hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center transition-colors duration-300"
            >
              <span className="mr-2">🔍</span> TRACK
            </button>
          </div>

          {/* Notifikasi Jika Input Kosong */}
          {errorNotify && (
            <div className="mt-4 px-4 py-2 bg-yellow-500/90 text-white text-sm font-bold rounded-lg animate-bounce">
              ⚠️ {errorNotify}
            </div>
          )}

          {/* Notifikasi Jika Cargo Tidak Ditemukan */}
          {searchResult === "not_found" && (
            <div className="mt-4 px-4 py-2 bg-red-600/90 text-white text-sm font-bold rounded-lg">
              ❌ Cargo tidak ditemukan. Periksa kembali ID Anda.
            </div>
          )}
        </div>

        {/* Status Card: Hanya muncul jika ID ditemukan */}
        {searchResult === "found" ? (
          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-6">
              <div>
                <h3 className="font-bold text-gray-500 text-sm">CARGO ID</h3>
                <p className="text-2xl font-black text-[#1E3A8A] uppercase">{cargoId}</p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <h3 className="font-bold text-gray-500 text-sm">CURRENT STATUS</h3>
                <p className="text-xl font-bold text-green-600 bg-green-100 px-4 py-1 rounded-full inline-block mt-1">IN TRANSIT</p>
              </div>
            </div>
            
            <div className="w-full overflow-x-auto pb-4">
              <div className="relative flex justify-between items-center min-w-[700px] mt-4 mb-4 px-4">
                <div className="absolute top-4 left-8 right-8 h-1 bg-gray-200 -z-10 rounded-full"></div>
                <div className="absolute top-4 left-8 w-[50%] h-1 bg-green-500 -z-10 rounded-full"></div>
                
                {[
                  { status: 'SHIPMENT CREATED', time: '12:00 WIB', date: '20 Apr', active: true },
                  { status: 'LOADING', time: '14:00 WIB', date: '20 Apr', active: true },
                  { status: 'DEPARTED', time: '18:00 WIB', date: '20 Apr', active: true },
                  { status: 'TRANSIT', time: '24:00 WIB', date: '20 Apr', active: true },
                  { status: 'ARRIVED', time: 'Pending', date: '-', active: false },
                  { status: 'DESTINATION', time: 'Pending', date: '-', active: false },
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className={`w-8 h-8 rounded-full mb-3 flex items-center justify-center border-4 border-white shadow-md transition-all duration-300 ${step.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {step.active && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="text-center">
                      <div className={`text-[11px] font-extrabold mb-1 ${step.active ? 'text-[#1E3A8A]' : 'text-gray-400'}`}>{step.status}</div>
                      <div className={`text-[10px] font-semibold ${step.active ? 'text-gray-600' : 'text-gray-400'}`}>{step.date}</div>
                      <div className={`text-[9px] ${step.active ? 'text-gray-500' : 'text-gray-300'}`}>{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Tampilan Default saat belum ngetrack apapun atau data salah */
          <div className="text-center py-20 border-2 border-dashed border-white/20 rounded-2xl">
            <p className="text-white/50 italic font-medium">Silakan masukkan Cargo ID untuk melihat detail status pengiriman.</p>
          </div>
        )}

      </div>
    </div>
  );
}