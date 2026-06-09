"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Cargo {
  id: number;
  manifest_id: string;
  airline_name: string;
  flight_code: string;
  route: string;
  weight: number;
  flight_status: string;
  operational_status: string;
  date: string;
  scheduled_time: string;
  actual_time: string;
  gate?: string;
  items?: number;
  sender_name?: string;
  receiver_name?: string;
  phone_number?: string;
  origin_city?: string;
  destination_city?: string;
  item_type?: string;
  shipping_price?: string;
  shipping_type?: string;
  description?: string;
}

interface TrackingLog {
  id: number;
  cargo_id: number;
  current_location: string;
  update_time: string;
  description: string;
}

export default function TrackingAwbPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<TrackingLog[]>([]);
  const [loadingCargos, setLoadingCargos] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  // Add Checkpoint Form States
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [savingHistory, setSavingHistory] = useState(false);

  // Toast System
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  // State for manifest not found error
  const [errorCargoId, setErrorCargoId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth Protection Check
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      router.push("/login");
    }
  }, [router]);

  // Fetch all cargo manifests
  const fetchCargos = async () => {
    setLoadingCargos(true);
    try {
      const res = await fetch("/api/cargo");
      const json = await res.json();
      if (json.success) {
        setCargoList(json.data || []);
      } else {
        showToast(json.error || "Gagal menyelaraskan data dengan database.", "error");
      }
    } catch (err) {
      showToast("Gagal terhubung ke database. Periksa koneksi internet Anda.", "error");
    } finally {
      setLoadingCargos(false);
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  // Fetch tracking history for the selected cargo
  const fetchHistory = async (cargoId: number) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/cargo-tracking?cargoId=${cargoId}`);
      const json = await res.json();
      if (json.success) {
        setTrackingHistory(json.data || []);
      } else {
        showToast(json.error || "Gagal mengambil data pelacakan.", "error");
      }
    } catch (err) {
      showToast("Gagal mengambil data pelacakan dari server.", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      showToast("Masukkan Manifest ID terlebih dahulu!", "error");
      return;
    }
    const searchIdClean = searchInput.trim().toUpperCase();
    const cargo = cargoList.find((c) => c.manifest_id.toUpperCase() === searchIdClean);
    
    if (cargo) {
      setSelectedCargo(cargo);
      fetchHistory(cargo.id);
      setNewLocation("");
      setNewDescription("");
    } else {
      showToast(`Manifest ID "${searchIdClean}" tidak ditemukan dalam sistem.`, "error");
      setSelectedCargo(null);
      setTrackingHistory([]);
    }
  };

  const handleAddCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCargo) return;
    if (!newLocation.trim() || !newDescription.trim()) {
      showToast("Lokasi dan Deskripsi wajib diisi!", "error");
      return;
    }

    setSavingHistory(true);
    try {
      const res = await fetch("/api/cargo-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cargoId: selectedCargo.id,
          current_location: newLocation.trim(),
          description: newDescription.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Checkpoint pelacakan berhasil ditambahkan!", "success");
        setNewLocation("");
        setNewDescription("");
        fetchHistory(selectedCargo.id);
      } else {
        showToast(json.error || "Gagal menambahkan checkpoint.", "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan koneksi saat menyimpan checkpoint.", "error");
    } finally {
      setSavingHistory(false);
    }
  };

  if (loadingCargos) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Memuat database kargo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
          toast.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-800" 
            : "bg-rose-500/10 border-rose-500/25 text-rose-800"
        }`}>
          <span className="text-xs font-bold font-sans uppercase tracking-wider">{toast.message}</span>
        </div>
      )}

      {/* Manifest Selector Card */}
      <div className="bg-white border border-gray-155 rounded-[2rem] p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-black text-[#0a2a66] uppercase italic tracking-tight mb-4">LACAK MANIFEST ID / AWB</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Masukkan Manifest ID (Contoh: MNF-2026-001)"
            className="flex-1 px-5 py-3.5 bg-slate-50 border border-gray-200 text-gray-900 placeholder-slate-400 rounded-xl font-mono focus:outline-none focus:border-blue-500 text-sm font-bold"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-[#0a2a66] hover:bg-[#124294] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            Cari Manifest
          </button>
        </div>
      </div>

      {selectedCargo ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cargo Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-gray-155 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                    {selectedCargo.shipping_type} Service
                  </span>
                  <h3 className="font-black text-2xl text-[#0a2a66] mt-2 uppercase italic font-mono">
                    {selectedCargo.manifest_id}
                  </h3>
                </div>
                
                <div className="flex flex-col gap-1.5 items-start sm:items-end mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    selectedCargo.flight_status === "Landed"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : selectedCargo.flight_status === "Delayed"
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}>
                    {selectedCargo.flight_status}
                  </span>
                  <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    selectedCargo.operational_status === "Completed"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600"
                  }`}>
                    Operational: {selectedCargo.operational_status}
                  </span>
                </div>
              </div>

              {/* General specifications */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans text-gray-600">
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Airline / Maskapai</p>
                  <p className="font-bold text-gray-800">{selectedCargo.airline_name} ({selectedCargo.flight_code})</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Flight Route</p>
                  <p className="font-bold text-gray-800">{selectedCargo.route}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Weight / Berat</p>
                  <p className="font-bold text-gray-800 font-mono">{selectedCargo.weight} kg</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Total Items</p>
                  <p className="font-bold text-gray-800">{selectedCargo.items ? `${selectedCargo.items} Pcs` : "-"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Sender / Pengirim</p>
                  <p className="font-bold text-gray-800">{selectedCargo.sender_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Receiver / Penerima</p>
                  <p className="font-bold text-gray-800">{selectedCargo.receiver_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Contact / No Telepon</p>
                  <p className="font-bold text-gray-800">{selectedCargo.phone_number || "-"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Price / Harga</p>
                  <p className="font-bold text-emerald-600 font-mono">
                    {selectedCargo.shipping_price ? `Rp ${Number(selectedCargo.shipping_price).toLocaleString("id-ID")}` : "-"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedCargo.description && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Cargo Description</p>
                  <p className="text-xs text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{selectedCargo.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Timeline & Add Checkpoint Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Timeline */}
            <div className="bg-white border border-gray-155 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <h3 className="text-sm font-black text-[#0a2a66] uppercase italic tracking-wider mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <svg className="w-4 h-4 text-blue-600 shrink-0 inline-block align-middle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>RIWAYAT PELACAKAN CHECKPOINT</span>
              </h3>

              <div className="space-y-4">
                {loadingHistory ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 py-4 font-mono">
                    <span className="w-4 h-4 border-2 border-[#0a2a66] border-t-transparent rounded-full animate-spin"></span>
                    Memuat riwayat pelacakan...
                  </div>
                ) : trackingHistory.length > 0 ? (
                  <div className="relative border-l border-gray-200 ml-2.5 pl-6 space-y-5">
                    {trackingHistory.map((h, i) => (
                      <div key={h.id || i} className="relative">
                        {/* Timeline dot */}
                        <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-50"></span>
                        
                        <p className="text-[10px] text-gray-400 font-mono font-bold leading-none">
                          {new Date(h.update_time).toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs font-black text-gray-800 mt-1">{h.description}</p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider mt-0.5">{h.current_location}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-400 py-3 font-bold uppercase text-center">Belum ada riwayat pelacakan untuk kargo ini.</p>
                )}
              </div>
            </div>

            {/* Add Checkpoint Form */}
            <div className="bg-white border border-gray-155 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <h3 className="text-sm font-black text-[#0a2a66] uppercase italic tracking-wider mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <svg className="w-4 h-4 text-blue-600 shrink-0 inline-block align-middle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>TAMBAH CHECKPOINT BARU</span>
              </h3>

              <form onSubmit={handleAddCheckpoint} className="space-y-4">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-wider text-gray-400 block mb-1">Lokasi Checkpoint</label>
                  <input
                    type="text"
                    placeholder="Contoh: CGK Sorting Area"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase tracking-wider text-gray-400 block mb-1">Keterangan / Aktivitas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Dokumen manifestasi kargo diproses"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-gray-800"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingHistory}
                    className="w-full px-6 py-3.5 bg-[#0a2a66] hover:bg-[#124294] disabled:opacity-50 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    {savingHistory ? "Menyimpan..." : "Simpan Checkpoint"}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      ) : (
        errorCargoId ? (
          <div className="bg-white border border-gray-155 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-[#0a2a66] uppercase italic mb-2">Manifest ID: {errorCargoId}</h3>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
              NOT FOUND
            </span>
            <p className="text-xs text-gray-600 mt-2">Search failed – manifest not found. Please verify the ID or contact support.</p>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-250 rounded-[2rem] bg-white shadow-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Silakan masukkan Manifest ID di atas untuk melacak atau menambahkan log checkpoint baru.</p>
          </div>
        )
      )}

    </div>
  );
}
