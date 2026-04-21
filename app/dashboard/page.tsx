"use client";

import { useState } from "react";

export default function DashboardPage() {
  // State untuk notifikasi sesuai permintaanmu
  const [showExportNotif, setShowExportNotif] = useState(false);

  const handleExport = () => {
    setShowExportNotif(true);
    // Notifikasi hilang otomatis setelah 3 detik
    setTimeout(() => setShowExportNotif(false), 3000);
  };

  return (
    <div className="w-full relative space-y-6 animate-in fade-in duration-700 font-[Arial,sans-serif]">
      
      {/* NOTIFIKASI EXPORT BERHASIL (Sesuai Request) */}
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

      <div>
          {/* GRID STATS & CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="mb-4">
                <h3 className="font-black text-gray-800 uppercase text-sm">Daily Cargo Volume Trend</h3>
                <p className="text-[10px] text-gray-400 font-bold">Cargo received, processed, and departed</p>
              </div>
              <div className="h-48 w-full bg-blue-50/30 rounded-2xl border border-dashed border-blue-200 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 flex items-end px-4 pb-4 gap-4">
                    <div className="w-full h-[40%] bg-blue-500/20 rounded-t-lg"></div>
                    <div className="w-full h-[60%] bg-blue-500/40 rounded-t-lg"></div>
                    <div className="w-full h-[80%] bg-blue-600 rounded-t-lg"></div>
                    <div className="w-full h-[70%] bg-blue-500/60 rounded-t-lg"></div>
                    <div className="w-full h-[90%] bg-blue-700 rounded-t-lg"></div>
                 </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="mb-4">
                <h3 className="font-black text-gray-800 uppercase text-sm">Flight On-Time Performance</h3>
                <p className="text-[10px] text-gray-400 font-bold">Monthly comparison of flight punctuality</p>
              </div>
              <div className="h-48 w-full bg-green-50/30 rounded-2xl border border-dashed border-green-200 flex items-center justify-center relative px-8 gap-10">
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-32 bg-green-500 rounded-t-lg"></div>
                    <span className="text-[8px] font-black">JAN</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-24 bg-green-500 rounded-t-lg"></div>
                    <span className="text-[8px] font-black">FEB</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-36 bg-green-500 rounded-t-lg"></div>
                    <span className="text-[8px] font-black">MAR</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-28 bg-green-500 rounded-t-lg"></div>
                    <span className="text-[8px] font-black">APR</span>
                 </div>
              </div>
            </div>
          </div>

          {/* TODAY'S SUMMARY GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
               <h3 className="font-black text-gray-800 uppercase text-xs mb-6 tracking-tighter">Today's Cargo Summary</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="border-r border-gray-100 pr-4">
                     <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Cargo Received</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black">1,250</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">koli</span>
                     </div>
                     <p className="text-[10px] text-green-500 font-black mt-1">▲ +5% vs yesterday</p>
                  </div>
                  <div className="pl-4">
                     <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Cargo Processed</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black">1,180</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">koli</span>
                     </div>
                     <p className="text-[10px] text-gray-500 font-black mt-1">94.4% processing rate</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-800 uppercase text-xs mb-6 tracking-tighter">Flight Status (CGK)</h3>
                <div className="flex justify-between items-center px-4">
                   <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl shadow-sm mb-2">✅</div>
                      <span className="text-lg font-black leading-none">15</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase mt-1">On-Time</span>
                   </div>
                   <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-sm mb-2">🕒</div>
                      <span className="text-lg font-black leading-none">2</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase mt-1">Delayed</span>
                   </div>
                   <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm mb-2">✈️</div>
                      <span className="text-lg font-black leading-none">8</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase mt-1">Departed</span>
                   </div>
                   <div className="h-10 w-px bg-gray-100 mx-2"></div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase italic leading-none">CGK Warehouse Active</p>
                      <p className="text-xl font-black">13</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase italic mt-1 leading-none">Total Flight Today</p>
                      <p className="text-xl font-black">25</p>
                   </div>
                </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="mt-6">
             <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <div>
                    <h3 className="font-black text-gray-800 uppercase text-xs">Today's Incoming Cargo</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Real-time cargo tracking and management</p>
                  </div>
                  {/* BUTTON EXPORT */}
                  <button 
                    onClick={handleExport}
                    className="bg-[#0a2a66] hover:bg-[#153a8a] active:scale-95 transition-all text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-lg"
                  >
                    ⬇ Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                          <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                            <th className="py-4 px-6">AWB</th>
                            <th className="py-4 px-4">Airline</th>
                            <th className="py-4 px-4">Origin</th>
                            <th className="py-4 px-4 text-center">Weight</th>
                            <th className="py-4 px-4 text-center">Current Status</th>
                            <th className="py-4 px-6 text-right">Arrival Time</th>
                          </tr>
                        </thead>
                        <tbody className="text-[11px] font-bold">
                          {[
                            { awb: "PETIR00124", air: "Sriwijaya Air (SJ-55)", origin: "Surabaya (SUB)", w: "125 kg", s: "In Transit", t: "5 April 2026, 17:30 WIB", color: "blue" },
                            { awb: "PETIR00125", air: "Lion Air (JT-100)", origin: "Denpasar (DPS)", w: "85 kg", s: "Processed", t: "5 April 2026, 17:30 WIB", color: "green" },
                            { awb: "PETIR00126", air: "Garuda (GA-450)", origin: "Makassar (UPG)", w: "155 kg", s: "In Transit", t: "5 April 2026, 17:29 WIB", color: "blue" }
                          ].map((item, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-[10px]">
                              <td className="py-4 px-6 font-black text-[#0a2a66]">{item.awb}</td>
                              <td className="py-4 px-4 uppercase">{item.air}</td>
                              <td className="py-4 px-4 text-gray-500 uppercase">{item.origin}</td>
                              <td className="py-4 px-4 text-center">{item.w}</td>
                              <td className="py-4 px-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${item.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {item.s}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right text-gray-400">{item.t}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}