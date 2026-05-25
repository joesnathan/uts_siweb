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
    <div className="relative flex-grow min-h-[90vh] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: 'url("/bg.jpeg")' }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0f284f]/85 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 w-full max-w-3xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Track Your Cargo</h1>
          <p className="text-blue-200">Masukkan Manifest ID untuk melacak pengiriman</p>
        </div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Contoh: MNF-2026-001"
            className="flex-1 px-6 py-4 bg-white/90 text-gray-900 rounded-2xl text-lg font-mono focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#0a2a66] hover:bg-blue-900 text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? "Mencari..." : "TRACK NOW"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {result && result.success && (
          <div className="space-y-8 bg-white/95 text-gray-900 rounded-2xl p-8">
            {/* Info Utama */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <h3 className="font-black text-2xl mb-4">Manifest ID: {result.cargo?.manifest_id}</h3>
              <p className="text-xl">
                Status: <span className="font-bold text-green-600">{result.cargo?.flight_status}</span>
              </p>
              <p className="text-gray-600 mt-2">Operational: {result.cargo?.operational_status}</p>
            </div>

            {/* Tracking History */}
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                📍 Tracking History
              </h4>
              <div className="space-y-6">
                {result.history && result.history.length > 0 ? (
                  result.history.map((h: any, i: number) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-6 py-3 bg-gray-50 rounded-r-2xl">
                      <p className="text-sm text-gray-500">
                        {new Date(h.update_time).toLocaleString('id-ID')}
                      </p>
                      <p className="font-medium mt-1">{h.description}</p>
                      <p className="text-blue-600 font-medium">{h.current_location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Belum ada riwayat tracking.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="text-center py-16 border-2 border-dashed border-white/30 rounded-2xl">
            <p className="text-white/70">Silakan masukkan Manifest ID untuk melihat status pengiriman.</p>
          </div>
        )}
      </div>
    </div>
  );
}