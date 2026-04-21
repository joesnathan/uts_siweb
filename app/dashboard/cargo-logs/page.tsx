"use client";

import { useState } from "react";

export default function CargoLogsPage() {
  // 1. STATE MANAGEMENT
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState(""); // State untuk filter tanggal
  const [showExportNotif, setShowExportNotif] = useState(false);

  // DATA MASTER ACTIVITY LOGS (Ditambah kolom 'date' supaya filter jalan)
  const [logs] = useState([
    { flight: "GA-888", airline: "Garuda Indonesia", date: "2026-04-21", route: "CGK ✈ DPS", scheduled: "17:15", actual: "17:20", gate: "A12", items: "45 items", status: "Departed" },
    { flight: "SJ-555", airline: "Sriwijaya Air", date: "2026-04-21", route: "CGK ✈ SUB", scheduled: "18:30", actual: "18:30", gate: "B08", items: "32 items", status: "On-Time" },
    { flight: "JT-100", airline: "Lion Air", date: "2026-04-22", route: "CGK ✈ KNO", scheduled: "19:00", actual: "19:15", gate: "C05", items: "28 items", status: "Delayed" },
    { flight: "GA-450", airline: "Garuda Indonesia", date: "2026-04-22", route: "CGK ✈ UPG", scheduled: "19:45", actual: "19:45", gate: "A15", items: "38 items", status: "On-Time" },
    { flight: "ID-7890", airline: "Batik Air", date: "2026-04-23", route: "CGK ✈ JOG", scheduled: "20:00", actual: "20:00", gate: "B12", items: "22 items", status: "On-Time" },
  ]);

  // 2. LOGIKA FILTER & SEARCH (ID + STATUS + TANGGAL)
  const filteredLogs = logs.filter((log) => {
    const matchSearch = log.flight.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        log.airline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || log.status === filterStatus;
    const matchDate = !selectedDate || log.date === selectedDate; // Logika filter tanggal
    
    return matchSearch && matchStatus && matchDate;
  });

  // 3. FUNGSI EXPORT
  const handleExport = () => {
    setShowExportNotif(true);
    setTimeout(() => setShowExportNotif(false), 3000);
  };

  return (
    <div className="w-full relative space-y-6 font-[Arial,sans-serif]">
      
      {/* NOTIFIKASI EXPORT BERHASIL (MELAYANG TENGAH ATAS) */}
      {showExportNotif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-black text-xs uppercase tracking-widest">Export Success!</p>
              <p className="text-[10px] font-bold opacity-90">Manifest data has been downloaded.</p>
            </div>
          </div>
        </div>
      )}

      {/* ROW 1: STATISTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Logs Today", value: "247", sub: "Last updated: 17:30", color: "text-gray-800" },
          { label: "Active Operations", value: "18", sub: "Currently in progress", color: "text-blue-600" },
          { label: "Completed", value: "215", sub: "87% completion rate", color: "text-green-600" },
          { label: "Active Users", value: "12", sub: "Operators online", color: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color} mb-1`}>{stat.value}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ROW 2: ACTIVITY LOGS TABLE CARD */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        
        {/* TOOLBAR */}
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/30">
            <h3 className="font-black text-xl uppercase tracking-tighter italic">Activity Logs</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* SEARCH BAR */}
              <div className="relative group">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search flight or airline..." 
                  className="pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <span className="absolute left-4 top-2.5 text-blue-400 font-bold">🔍</span>
              </div>

              {/* FILTER STATUS */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black shadow-sm outline-none cursor-pointer hover:border-blue-500 transition-all uppercase"
              >
                <option value="All">▽ Filter Status</option>
                <option value="Departed">Departed</option>
                <option value="On-Time">On-Time</option>
                <option value="Delayed">Delayed</option>
              </select>

              {/* DATE RANGE FILTER */}
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black shadow-sm outline-none cursor-pointer uppercase"
              />

              {/* EXPORT BUTTON */}
              <button 
                onClick={handleExport}
                className="bg-[#0a2a66] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg hover:bg-blue-800 transition-all active:scale-95 flex items-center gap-2 uppercase"
              >
                ⬇ Export Logs
              </button>

              {/* RESET BUTTON (Optional - muncul kalo ada filter) */}
              {(searchTerm || selectedDate || filterStatus !== "All") && (
                <button 
                  onClick={() => {setSearchTerm(""); setSelectedDate(""); setFilterStatus("All")}}
                  className="text-[9px] font-black text-red-500 uppercase hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/20">
                <th className="py-6 px-8">Flight Number</th>
                <th className="py-6 px-4">Airline</th>
                <th className="py-6 px-4 text-center">Date</th>
                <th className="py-6 px-4">Route</th>
                <th className="py-6 px-4 text-center">Sched / Act</th>
                <th className="py-6 px-4 text-center">Gate</th>
                <th className="py-6 px-4 text-center">Items</th>
                <th className="py-6 px-8 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-black">
              {filteredLogs.length > 0 ? filteredLogs.map((log, index) => (
                <tr key={index} className="hover:bg-blue-50/50 transition-all border-b border-gray-50 last:border-0 group">
                  <td className="py-6 px-8 text-gray-900 uppercase tracking-tighter">{log.flight}</td>
                  <td className="py-6 px-4 text-gray-500 font-bold uppercase">{log.airline}</td>
                  <td className="py-6 px-4 text-center text-gray-400 italic">{log.date}</td>
                  <td className="py-6 px-4 text-gray-700">{log.route}</td>
                  <td className="py-6 px-4 text-center">
                    <span className="text-gray-400">{log.scheduled}</span>
                    <span className="mx-1">/</span>
                    <span className={`${log.actual > log.scheduled ? 'text-red-500' : 'text-gray-900'}`}>{log.actual}</span>
                  </td>
                  <td className="py-6 px-4 text-center text-gray-900">{log.gate}</td>
                  <td className="py-6 px-4 text-center text-gray-500">{log.items}</td>
                  <td className="py-6 px-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow-sm ${
                      log.status === 'Departed' ? 'bg-blue-100 text-blue-700' : 
                      log.status === 'Delayed' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {log.status === 'On-Time' && '✔️'}
                      {log.status === 'Delayed' && '⚠️'}
                      {log.status === 'Departed' && '✈️'}
                      {log.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-gray-300 italic font-black uppercase tracking-widest">
                    Data tidak ditemukan ✈️
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}