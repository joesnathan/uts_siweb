"use client";

import { useState } from "react";

export default function TrackingPage() {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("Masukkan Manifest ID terlebih dahulu!");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/seed?searchId=${searchId.trim().toUpperCase()}`);
      const data = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Manifest tidak ditemukan");
      }
    } catch (err) {
      setError("Gagal terhubung ke database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-grow min-h-[90vh] flex items-center justify-center p-4 md:p-8 bg-slate-50 font-sans">
      
      {/* Light Clean Container matching White Navbar */}
      <div className="relative z-10 w-full max-w-3xl bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.05)] text-gray-800">
        
        <div className="text-center mb-10">
          <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-3 shadow-sm">
            Cargo Airspace Radar
          </span>
          <h1 className="text-4xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-2">
            Track <span className="text-blue-600">Your Cargo</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Masukkan Manifest ID untuk melacak pengiriman</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Contoh: MNF-2026-001"
            className="flex-1 px-6 py-4 bg-slate-50 border border-gray-200 text-gray-900 placeholder-slate-400 rounded-2xl text-lg font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 whitespace-nowrap uppercase tracking-wider shadow-md shadow-blue-800/10"
          >
            {loading ? "Mencari..." : "TRACK NOW"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6 text-xs font-black text-center uppercase tracking-wider flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4 text-red-650 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {result && result.success && (
          <div className="space-y-8 bg-slate-50 border border-gray-150 text-gray-800 rounded-2xl p-6 md:p-8 shadow-inner">
            {/* Info Utama */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-black text-xl md:text-2xl mb-4 uppercase italic tracking-tight text-[#0a2a66]">
                Manifest ID: <span className="text-blue-600 font-mono font-black">{result.cargo?.manifest_id}</span>
              </h3>
              
              <div className="flex flex-col gap-2 mt-4 text-sm md:text-base font-bold text-gray-600">
                <p>
                  Status: <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ml-1">{result.cargo?.flight_status}</span>
                </p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-2 font-bold">
                  Operational: <span className="text-gray-800 ml-1 font-bold">{result.cargo?.operational_status}</span>
                </p>
              </div>
            </div>

            {/* Tracking History */}
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-[#0a2a66]">
                <svg className="w-4 h-4 text-blue-600 shrink-0 inline-block align-middle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                </svg>
                <span>Tracking History</span>
              </h4>
              <div className="space-y-6">
                {result.history && result.history.length > 0 ? (
                  result.history.map((h: any, i: number) => (
                    <div key={i} className="border border-gray-200 border-l-4 border-l-blue-600 pl-6 py-4 bg-white rounded-r-2xl hover:shadow-md hover:shadow-slate-100/50 transition-all">
                      <p className="text-xs text-slate-400 font-mono font-bold">
                        {new Date(h.update_time).toLocaleString('id-ID')}
                      </p>
                      <p className="font-black text-sm text-gray-800 mt-1.5">{h.description}</p>
                      <p className="text-blue-600 font-black text-xs uppercase tracking-wider mt-1">{h.current_location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs italic tracking-wider text-center py-6 font-bold uppercase">Belum ada riwayat tracking.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-slate-50/50">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Silakan masukkan Manifest ID untuk melihat status pengiriman.</p>
          </div>
        )}
      </div>
    </div>
  );
}