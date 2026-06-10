"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../LanguageContext";

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
  const { language, t } = useLanguage();
  
  // Add Checkpoint Form States
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [savingHistory, setSavingHistory] = useState(false);

  // Field validation error states
  const [checkpointErrors, setCheckpointErrors] = useState<{ location?: string; description?: string }>({});

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
        showToast(json.error || "Failed to synchronize data with database.", "error");
      }
    } catch (err) {
      showToast("Failed to connect to database. Check your internet connection.", "error");
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
        showToast(json.error || "Failed to retrieve tracking data.", "error");
      }
    } catch (err) {
      showToast("Failed to retrieve tracking data from server.", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      showToast(t("track_err_empty"), "error");
      return;
    }
    const searchIdClean = searchInput.trim().toUpperCase();
    const cargo = cargoList.find((c) => c.manifest_id.toUpperCase() === searchIdClean);
    
    if (cargo) {
      setSelectedCargo(cargo);
      fetchHistory(cargo.id);
      setNewLocation("");
      setNewDescription("");
      setCheckpointErrors({});
      setErrorCargoId(null);
    } else {
      showToast(t("track_err_not_found"), "error");
      setSelectedCargo(null);
      setTrackingHistory([]);
      setErrorCargoId(searchIdClean);
    }
  };

  const handleAddCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCargo) return;

    // Clear previous errors
    setCheckpointErrors({});

    let hasError = false;
    const newErrors: { location?: string; description?: string } = {};

    if (!newLocation.trim()) {
      newErrors.location = t("cp_err_required");
      hasError = true;
    } else if (newLocation.trim().length < 3) {
      newErrors.location = t("cp_err_loc_min");
      hasError = true;
    }

    if (!newDescription.trim()) {
      newErrors.description = t("cp_err_required");
      hasError = true;
    } else if (newDescription.trim().length < 5) {
      newErrors.description = t("cp_err_desc_min");
      hasError = true;
    }

    if (hasError) {
      setCheckpointErrors(newErrors);
      showToast(t("cp_err_required"), "error");
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
        showToast(t("cp_success"), "success");
        setNewLocation("");
        setNewDescription("");
        fetchHistory(selectedCargo.id);
      } else {
        showToast(json.error || t("cp_err_db"), "error");
      }
    } catch (err) {
      showToast(t("cp_err_conn"), "error");
    } finally {
      setSavingHistory(false);
    }
  };

  if (loadingCargos) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] w-full bg-white border border-gray-100 rounded-[2.5rem] p-12 relative overflow-hidden shadow-xl shadow-gray-100/50 animate-in fade-in duration-500">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#0a2a66_1px,transparent_1px),linear-gradient(to_bottom,#0a2a66_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        {/* Concentric radar loading pulses */}
        <div className="relative z-10 w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-3 border-2 border-blue-500/15 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-6 border border-blue-400/20 rounded-full animate-pulse"></div>
          
          {/* Glowing Glassmorphic Cargo Scope */}
          <div className="w-16 h-16 bg-gradient-to-tr from-[#0a2a66] to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_45%,rgba(255,255,255,0.35)_100%)] animate-spin" style={{ animationDuration: '2.5s' }}></div>
            {/* Clean Cargo Plane SVG */}
            <svg className="w-8 h-8 text-white relative z-10 drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5M21 12l-5-2-4-5H9l2 5-5 1-2-2H2l1 3 3 1 12 3 5-3z" />
            </svg>
          </div>
        </div>

        {/* Dynamic status text */}
        <div className="relative z-10 text-center max-w-sm">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Securing Connection
          </span>
          <h2 className="text-[#0a2a66] font-black text-xl tracking-tighter mt-4 uppercase italic">Terbanginaja Logistics</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2.5 flex items-center justify-center gap-1.5 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Syncing cargo flight GPS from Neon database...
          </p>
        </div>

        {/* Glowing Dynamic Slide Progress bar */}
        <div className="relative z-10 w-60 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-8 border border-gray-200/50 p-[1px]">
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-[loadingSlide_2.5s_ease-in-out_infinite]"></div>
        </div>

        <style>{`
          @keyframes loadingSlide {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 60%; margin-left: 20%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
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

      {/* Mockup Title Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 pt-4">
        <div className="inline-flex items-center px-4 py-1.5 bg-[#EFF6FF] border border-[#DBEAFE] rounded-full">
          <span className="text-[10px] font-black text-[#2563EB] tracking-[0.2em] uppercase font-mono">
            {t("track_badge")}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0A2A66] dark:text-white uppercase font-sans">
          {t("track_title_pre")} <span className="text-[#2563EB]">{t("track_title_post")}</span>
        </h1>
        <p className="text-[10px] font-black text-gray-400 tracking-[0.15em] uppercase">
          {t("track_subtitle")}
        </p>
      </div>

      {/* Manifest Selector Card / Search Box */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("track_placeholder")}
            className="flex-1 px-6 py-4 bg-white dark:bg-slate-900 border-2 border-[#2563EB] text-gray-900 dark:text-white placeholder-slate-400 rounded-2xl font-mono focus:outline-none text-base font-bold shadow-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-[#1C3D7D] hover:bg-[#122852] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            {t("track_btn_now")}
          </button>
        </div>
      </div>

      {selectedCargo ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cargo Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#111c35] border border-gray-155 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                    {selectedCargo.shipping_type} Service
                  </span>
                  <h3 className="font-black text-2xl text-[#0a2a66] dark:text-white mt-2 uppercase italic font-mono">
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
                    {selectedCargo.flight_status === "Landed"
                      ? (language === 'id' ? "Mendarat" : "Landed")
                      : selectedCargo.flight_status === "Delayed"
                        ? (language === 'id' ? "Terlambat" : "Delayed")
                        : selectedCargo.flight_status === "Airborne"
                          ? (language === 'id' ? "Mengudara" : "Airborne")
                          : (language === 'id' ? "Terjadwal" : "Scheduled")
                    }
                  </span>
                  <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    selectedCargo.operational_status === "Completed"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600"
                  }`}>
                    {t("track_result_operational")} {
                      selectedCargo.operational_status === "Completed"
                        ? (language === 'id' ? "Selesai" : "Completed")
                        : selectedCargo.operational_status === "In progress" || selectedCargo.operational_status === "Processing"
                          ? (language === 'id' ? "Sedang Diproses" : "In progress")
                          : (language === 'id' ? "Tertunda" : "Pending")
                    }
                  </span>
                </div>
              </div>

              {/* General specifications */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans text-gray-600 dark:text-gray-300">
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">{language === 'id' ? "Maskapai" : "Airline"}</p>
                  <p className="font-bold text-gray-800 dark:text-white">{selectedCargo.airline_name} ({selectedCargo.flight_code})</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">{language === 'id' ? "Rute Penerbangan" : "Flight Route"}</p>
                  <p className="font-bold text-gray-800 dark:text-white">{selectedCargo.route}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">{language === 'id' ? "Berat" : "Weight"}</p>
                  <p className="font-bold text-gray-800 dark:text-white font-mono">{selectedCargo.weight} kg</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">{language === 'id' ? "Total Barang" : "Total Items"}</p>
                  <p className="font-bold text-gray-800 dark:text-white">{selectedCargo.items ? `${selectedCargo.items} Pcs` : "-"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">{language === 'id' ? "Pengirim" : "Sender"}</p>
                  <p className="font-bold text-gray-800 dark:text-white">{selectedCargo.sender_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">{language === 'id' ? "Penerima" : "Receiver"}</p>
                  <p className="font-bold text-gray-800 dark:text-white">{selectedCargo.receiver_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">{language === 'id' ? "Nomor Kontak" : "Contact Number"}</p>
                  <p className="font-bold text-gray-800 dark:text-white">{selectedCargo.phone_number || "-"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">{language === 'id' ? "Biaya Pengiriman" : "Shipping Price"}</p>
                  <p className="font-bold text-emerald-600 font-mono">
                    {selectedCargo.shipping_price ? `Rp ${Number(selectedCargo.shipping_price).toLocaleString("id-ID")}` : "-"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedCargo.description && (
                <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{language === 'id' ? "Deskripsi Kargo" : "Cargo Description"}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-900/30 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{selectedCargo.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Timeline & Add Checkpoint Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Timeline */}
            <div className="bg-white dark:bg-[#111c35] border border-gray-155 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <h3 className="text-sm font-black text-[#0a2a66] dark:text-white uppercase italic tracking-wider mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
                <svg className="w-4 h-4 text-blue-600 shrink-0 inline-block align-middle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t("cp_history_title")}</span>
              </h3>

              <div className="space-y-4">
                {loadingHistory ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 py-4 font-mono">
                    <span className="w-4 h-4 border-2 border-[#0a2a66] dark:border-white border-t-transparent rounded-full animate-spin"></span>
                    {t("cp_history_loading")}
                  </div>
                ) : trackingHistory.length > 0 ? (
                  <div className="relative border-l border-gray-200 dark:border-slate-800 ml-2.5 pl-6 space-y-5">
                    {trackingHistory.map((h, i) => (
                      <div key={h.id || i} className="relative">
                        {/* Timeline dot */}
                        <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-50 dark:ring-blue-900/30"></span>
                        
                        <p className="text-[10px] text-gray-400 font-mono font-bold leading-none">
                          {new Date(h.update_time).toLocaleString("en-US")}
                        </p>
                        <p className="text-xs font-black text-gray-800 dark:text-white mt-1">{h.description}</p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider mt-0.5">{h.current_location}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-400 py-3 font-bold uppercase text-center">{t("cp_history_empty")}</p>
                )}
              </div>
            </div>

            {/* Add Checkpoint Form */}
            <div className="bg-white dark:bg-[#111c35] border border-gray-155 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <h3 className="text-sm font-black text-[#0a2a66] dark:text-white uppercase italic tracking-wider mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
                <svg className="w-4 h-4 text-blue-600 shrink-0 inline-block align-middle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>{t("cp_title")}</span>
              </h3>

              <form onSubmit={handleAddCheckpoint} className="space-y-4">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-wider text-gray-400 block mb-1">{t("cp_loc_title")}</label>
                  <input
                    type="text"
                    placeholder={t("cp_loc_placeholder")}
                    value={newLocation}
                    onChange={(e) => {
                      setNewLocation(e.target.value);
                      if (checkpointErrors.location) {
                        setCheckpointErrors(prev => ({ ...prev, location: undefined }));
                      }
                    }}
                    className={`w-full px-4 py-3 text-xs font-bold bg-slate-50 border rounded-xl focus:outline-none focus:border-blue-500 transition-all text-gray-800 ${
                      checkpointErrors.location ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600' : 'border-gray-200'
                    }`}
                  />
                  {checkpointErrors.location && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      {checkpointErrors.location}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase tracking-wider text-gray-400 block mb-1">{t("cp_desc_title")}</label>
                  <input
                    type="text"
                    placeholder={t("cp_desc_placeholder")}
                    value={newDescription}
                    onChange={(e) => {
                      setNewDescription(e.target.value);
                      if (checkpointErrors.description) {
                        setCheckpointErrors(prev => ({ ...prev, description: undefined }));
                      }
                    }}
                    className={`w-full px-4 py-3 text-xs font-bold bg-slate-50 border rounded-xl focus:outline-none focus:border-blue-500 transition-all text-gray-800 ${
                      checkpointErrors.description ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600' : 'border-gray-200'
                    }`}
                  />
                  {checkpointErrors.description && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      {checkpointErrors.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingHistory}
                    className="w-full px-6 py-3.5 bg-[#0a2a66] hover:bg-[#124294] disabled:opacity-50 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    {savingHistory ? t("cp_btn_saving") : t("cp_btn_save")}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      ) : (
        errorCargoId ? (
          <div className="bg-[#F8FAFC] dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 space-y-6">
            
            {/* Manifest ID Info Card */}
            <div className="bg-white dark:bg-[#111c35] border border-gray-150 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-black text-[#0a2a66] dark:text-white uppercase tracking-tight">
                  {t("track_result_manifest")} <span className="text-[#2563EB]">{errorCargoId}</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500">Status:</span>
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFF1F2] text-[#991B1B] border border-[#FECDD3]">
                    {language === 'id' ? "TIDAK DITEMUKAN" : "NOT FOUND"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t("track_result_operational")}</span>
                  <span className="text-[10px] font-black text-[#EF4444] uppercase tracking-wider">
                    ERROR
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking History Label */}
            <div className="flex items-center gap-2 px-2 pt-2">
              <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-xs font-black text-[#0a2a66] dark:text-white uppercase tracking-wider font-sans">
                {t("track_result_history")}
              </span>
            </div>

            {/* Error Message Box */}
            <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-[1.5rem] p-8 text-center flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-[#991B1B]">
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h4 className="text-xs font-black uppercase tracking-wider">
                  {t("track_err_card_title")}
                </h4>
              </div>
              <p className="text-xs text-[#B91C1C] leading-relaxed max-w-2xl font-bold font-sans">
                {t("track_err_card_desc")}
              </p>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-250 rounded-[2rem] bg-white dark:bg-[#111c35] dark:border-slate-800 shadow-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">{t("cp_prompt")}</p>
          </div>
        )
      )}

    </div>
  );
}
