"use client";

import { useState } from "react";

interface TrackingStep {
  current_location: string;
  update_time: string;
  description: string;
}

interface CargoInfo {
  manifest_id: string;
  flight_status: string;
  operational_status: string;
}

export default function TrackingPage() {
  const [cargoId, setCargoId] = useState("");
  const [cargoInfo, setCargoInfo] = useState<CargoInfo | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [searchResult, setSearchResult] = useState<null | "found" | "not_found">(null);
  const [errorNotify, setErrorNotify] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    setErrorNotify("");
    setSearchResult(null);
    setCargoInfo(null);
    setTrackingSteps([]);

    if (!cargoId.trim()) {
      setErrorNotify("Harap isi Cargo ID terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/tracking/${cargoId.toUpperCase()}`);
      
      if (response.status === 200) {
        const data = await response.json();
        setCargoInfo(data.cargo);
        setTrackingSteps(data.history);
        setSearchResult("found");
      } else {
        setSearchResult("not_found");
      }
    } catch (error) {
      console.error("Fetch tracking error:", error);
      setSearchResult("not_found");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex-grow flex items-center justify-center min-h-[90vh] p-4 md:p-8 overflow-hidden">
      {/* Latar Belakang Gambar */}
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

        {/* ========================================================================= */}
        {/* INPUT SECTION YANG SUDAH BULAT SEMPURNA SECARA MENYELURUH                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex w-full max-w-2xl bg-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-shadow duration-300 focus-within:ring-4 focus-within:ring-blue-400/50 items-center">
            <input 
              type="text" 
              value={cargoId}
              onChange={(e) => setCargoId(e.target.value)}
              placeholder="e.g. MNF-2026-001"
              // rounded-l-full dipastikan melengkung penuh di kiri, bg-transparent mencegah tabrakan warna
              className="flex-grow px-6 py-3 rounded-l-full bg-transparent outline-none text-gray-800 font-semibold placeholder-gray-400 w-full border-none"
            />
            <button 
              onClick={handleTrack}
              disabled={isLoading}
              // rounded-full dipastikan membungkus tombol di sisi kanan bar secara simetris
              className="bg-[#1E3A8A] hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition-colors duration-300 disabled:bg-gray-400 shrink-0 shadow-md mr-1"
            >
              <img 
                src="https://img.icons8.com/ios-filled/50/ffffff/search--v1.png" 
                alt="Search Icon" 
                className="w-4 h-4 object-contain"
              />
              {isLoading ? "LOADING..." : "TRACK"}
            </button>
          </div>

          {/* Notifikasi Jika Input Kosong */}
          {errorNotify && (
            <div className="mt-4 px-4 py-2 bg-yellow-500/90 text-white text-sm font-bold rounded-lg animate-bounce flex items-center gap-2">
              <img 
                src="https://img.icons8.com/ios-filled/50/ffffff/warning-shield.png" 
                alt="Warning Icon" 
                className="w-4 h-4 object-contain"
              />
              {errorNotify}
            </div>
          )}

          {/* Notifikasi Jika Cargo Tidak Ditemukan */}
          {searchResult === "not_found" && (
            <div className="mt-4 px-4 py-2 bg-red-600/90 text-white text-sm font-bold rounded-lg flex items-center gap-2">
              <img 
                src="https://img.icons8.com/ios-filled/50/ffffff/cancel.png" 
                alt="Error Icon" 
                className="w-4 h-4 object-contain"
              />
              Cargo tidak ditemukan. Periksa kembali ID Anda.
            </div>
          )}
        </div>
        {/* ========================================================================= */}

        {/* Status Card: Muncul jika ID ditemukan */}
        {searchResult === "found" && cargoInfo ? (
          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-6">
              <div>
                <h3 className="font-bold text-gray-500 text-sm">CARGO ID</h3>
                <p className="text-2xl font-black text-[#1E3A8A] uppercase">{cargoInfo.manifest_id}</p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <h3 className="font-bold text-gray-500 text-sm">CURRENT STATUS</h3>
                <p className="text-xl font-bold text-green-600 bg-green-100 px-4 py-1 rounded-full inline-block mt-1 uppercase">
                  {cargoInfo.flight_status}
                </p>
              </div>
            </div>
            
            {/* Timeline Perjalanan Dinamis */}
            <div className="w-full">
              <div className="relative flex flex-col gap-6 pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center group">
                    <div className="absolute -left-[21px] mt-1 bg-white rounded-full p-0.5 z-10">
                      <img 
                        src="https://img.icons8.com/ios-filled/50/22c55e/checked-checkbox.png" 
                        alt="Step Completed" 
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <div className="flex-1 md:pr-4 ml-2">
                      <div className="text-sm font-extrabold text-[#1E3A8A] uppercase">{step.current_location}</div>
                      <div className="text-xs font-medium text-gray-600 mt-0.5">{step.description}</div>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-400 mt-1 md:mt-0 whitespace-nowrap ml-2">
                      {new Date(step.update_time).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })} WIB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Tampilan Default saat belum melakukan pelacakan */
          <div className="text-center py-20 border-2 border-dashed border-white/20 rounded-2xl">
            <p className="text-white/50 italic font-medium">Silakan masukkan Cargo ID untuk melihat detail status pengiriman.</p>
          </div>
        )}

      </div>
    </div>
  );
}