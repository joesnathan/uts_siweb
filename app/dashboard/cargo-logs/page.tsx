"use client";

import { useState, useEffect } from "react";

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

export default function CargoLogsPage() {
  const [logs, setLogs] = useState<Cargo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [showExportNotif, setShowExportNotif] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cargo");
      const json = await res.json();
      if (json.success) {
        setLogs(json.data || []);
      } else {
        setError(json.error || "Gagal menyelaraskan data dengan database Neon.");
      }
    } catch (e) {
      setError("Gagal terhubung ke database. Periksa koneksi internet Anda.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, selectedDate]);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.flight_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.airline_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.manifest_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "All" || log.flight_status === filterStatus;
    const matchDate = !selectedDate || log.date === selectedDate;
    return matchSearch && matchStatus && matchDate;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    setShowExportNotif(true);
    setTimeout(() => setShowExportNotif(false), 3000);
  };

  if (isLoading) {
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
            {/* Checklist document SVG */}
            <svg className="w-7 h-7 text-white relative z-10 drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Dynamic status text */}
        <div className="relative z-10 text-center max-w-sm">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Syncing Logs
          </span>
          <h2 className="text-[#0a2a66] font-black text-xl tracking-tighter mt-4 uppercase italic">Terbanginaja Logistics</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2.5 flex items-center justify-center gap-1.5 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Syncing warehouse verification logs & parcel dispatch archives...
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
    <div className="w-full relative space-y-6 font-[Arial,sans-serif]">
      {/* 404-STYLE ERROR CONTENT AREA FOR DATABASE CONNECTION FAILURE */}
      {error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl text-center space-y-6 max-w-2xl mx-auto mt-8 animate-in zoom-in duration-500">
          <div className="flex justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-none uppercase italic">
            Database Sync Failed
          </h2>
          <p className="text-sm font-bold text-gray-500">
            {error || "Could not complete handshake with Neon cloud Postgres Singapore cluster."}
          </p>
          <button
            onClick={fetchLogs}
            className="bg-[#0a2a66] hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl text-xs transition-all shadow-md active:scale-95 uppercase tracking-wider"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>

      {/* NOTIF EXPORT */}
      {showExportNotif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200]">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <span className="text-lg">✅</span>
            <div>
              <p className="font-black text-xs uppercase tracking-widest">Export Success!</p>
              <p className="text-[10px] font-bold opacity-90">Manifest data has been downloaded.</p>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedCargo && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedCargo(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0a2a66] rounded-t-3xl">
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Cargo Detail</p>
                <h3 className="text-white font-black text-xl">{selectedCargo.manifest_id}</h3>
              </div>
              <button
                onClick={() => setSelectedCargo(null)}
                className="text-white/60 hover:text-white text-2xl font-black"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Flight Info */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Flight Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Airline" value={selectedCargo.airline_name} />
                  <DetailItem label="Flight Code" value={selectedCargo.flight_code} />
                  <DetailItem label="Route" value={selectedCargo.route} />
                  <DetailItem label="Date" value={selectedCargo.date} />
                  <DetailItem label="Scheduled Time" value={selectedCargo.scheduled_time} />
                  <DetailItem label="Actual Time" value={selectedCargo.actual_time} />
                  <DetailItem label="Gate" value={selectedCargo.gate || "-"} />
                  <DetailItem
                    label="Flight Status"
                    value={selectedCargo.flight_status}
                    badge
                    badgeColor={
                      selectedCargo.flight_status === "Landed"
                        ? "bg-green-100 text-green-700"
                        : selectedCargo.flight_status === "Delayed"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  />
                </div>
              </div>

              {/* Sender & Receiver */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Sender & Receiver</p>
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Nama Pengirim" value={selectedCargo.sender_name || "-"} />
                  <DetailItem label="Nama Penerima" value={selectedCargo.receiver_name || "-"} />
                  <DetailItem label="No Telepon" value={selectedCargo.phone_number || "-"} />
                  <DetailItem label="Kota Asal" value={selectedCargo.origin_city || "-"} />
                  <DetailItem label="Kota Tujuan" value={selectedCargo.destination_city || "-"} />
                </div>
              </div>

              {/* Cargo Info */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Cargo Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem label="Jenis Barang" value={selectedCargo.item_type || "-"} />
                  <DetailItem label="Berat" value={selectedCargo.weight ? `${selectedCargo.weight} kg` : "-"} />
                  <DetailItem label="Jumlah Item" value={selectedCargo.items ? String(selectedCargo.items) : "-"} />
                  <DetailItem label="Tipe Pengiriman" value={selectedCargo.shipping_type || "-"} />
                  <DetailItem
                    label="Harga Pengiriman"
                    value={
                      selectedCargo.shipping_price
                        ? `Rp ${Number(selectedCargo.shipping_price).toLocaleString("id-ID")}`
                        : "-"
                    }
                  />
                  <DetailItem label="Operational Status" value={selectedCargo.operational_status || "-"} />
                </div>
              </div>

              {/* Description */}
              {selectedCargo.description && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Deskripsi</p>
                  <p className="text-xs text-gray-700 bg-gray-50 rounded-xl p-4">{selectedCargo.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/30">
          <h3 className="font-black text-xl uppercase tracking-tighter italic">
            Cloud Cargo Activity Logs
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search manifest / flight / airline..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none w-64"
              />
              <svg className="absolute left-3 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black outline-none cursor-pointer"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Airborne">Airborne</option>
              <option value="Landed">Landed</option>
              <option value="Delayed">Delayed</option>
            </select>

            <button
              onClick={handleExport}
              className="bg-[#0a2a66] text-white px-6 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-2"
            >
              ⬇ Export Logs
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/20">
                <th className="py-6 px-8">Manifest ID</th>
                <th className="py-6 px-4">Airline</th>
                <th className="py-6 px-4 text-center">Date</th>
                <th className="py-6 px-4">Route</th>
                <th className="py-6 px-4 text-center">Sched / Act</th>
                <th className="py-6 px-4 text-center">Gate</th>
                <th className="py-6 px-4 text-center">Weight</th>
                <th className="py-6 px-4 text-center">Status</th>
                <th className="py-6 px-8 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-black">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400 text-xs">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-50/50 border-b border-gray-50 last:border-0"
                  >
                    <td className="py-6 px-8 text-gray-900 uppercase font-mono">{log.manifest_id}</td>
                    <td className="py-6 px-4 text-gray-500 font-bold uppercase">{log.airline_name}</td>
                    <td className="py-6 px-4 text-center text-gray-400 italic">{log.date}</td>
                    <td className="py-6 px-4 text-gray-700">{log.route}</td>
                    <td className="py-6 px-4 text-center">
                      <span className="text-gray-400">{log.scheduled_time}</span>
                      {" / "}
                      <span className="text-gray-900">{log.actual_time}</span>
                    </td>
                    <td className="py-6 px-4 text-center text-blue-600">{log.gate || "-"}</td>
                    <td className="py-6 px-4 text-center text-gray-500">{log.weight} kg</td>
                    <td className="py-6 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                          log.flight_status === "Landed"
                            ? "bg-green-100 text-green-700"
                            : log.flight_status === "Delayed"
                            ? "bg-red-100 text-red-700"
                            : log.flight_status === "Airborne"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {log.flight_status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <button
                        onClick={() => setSelectedCargo(log)}
                        className="bg-[#0a2a66] text-white px-4 py-1.5 rounded-lg text-[10px] font-black hover:opacity-80 transition"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/20">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg bg-[#0a2a66] text-white text-[10px] font-black uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                ◀ Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition ${
                    currentPage === page
                      ? "bg-[#0a2a66] text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg bg-[#0a2a66] text-white text-[10px] font-black uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

// ================= HELPER COMPONENT =================
function DetailItem({
  label,
  value,
  badge = false,
  badgeColor = "",
}: {
  label: string;
  value: string;
  badge?: boolean;
  badgeColor?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      {badge ? (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <p className="text-xs font-bold text-gray-800">{value}</p>
      )}
    </div>
  );
}