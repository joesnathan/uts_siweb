"use client";

import { useState, useEffect } from "react";

// Struktur data manifest dari Jalur C database Neon secara presisi
interface CargoRow {
  id: number;
  manifest_id: string;
  airline_name: string;
  flight_code: string;
  route: string;
  weight: string;
  flight_status: string;
  status: string; 
  date: string;
  scheduled_time: string;
  actual_time: string;
}

export default function DashboardOperationalPage() {
  const [cargoList, setCargoList] = useState<CargoRow[]>([]);
  const [showExportNotif, setShowExportNotif] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State hitungan counter statistik hasil kalkulasi data cloud Neon
  const [stats, setStats] = useState({
    total: 0,
    onTime: 0,   // Status Landed
    delayed: 0,  // Status Delayed
    departed: 0  // Status Airborne
  });

  const fetchDashboardData = async () => {
    try {
      // SINKRONISASI: Menembak rute terpadu Jalur C tanpa query parameter
      const res = await fetch('/api/seed');
      if (res.ok) {
        const jsonResult = await res.json();
        if (jsonResult.success && jsonResult.data) {
          const rows: CargoRow[] = jsonResult.data;
          setCargoList(rows);

          // KALKULASI LIVE: Menghitung summary counter secara real-time langsung dari database cloud
          const total = rows.length;
          const onTime = rows.filter(item => item.flight_status === 'Landed').length;
          const delayed = rows.filter(item => item.flight_status === 'Delayed').length;
          const departed = rows.filter(item => item.flight_status === 'Airborne').length;

          setStats({ total, onTime, delayed, departed });
        }
      }
    } catch (err) {
      console.error("Dashboard database cloud sync failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExport = () => {
    setShowExportNotif(true);
    setTimeout(() => setShowExportNotif(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#0a2a66] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-black text-[#0a2a66] tracking-widest uppercase animate-pulse">Calculating Cloud Real-time Records...</p>
      </div>
    );
  }

  return (
    <div className="w-full relative space-y-6 animate-in fade-in duration-700 font-[Arial,sans-serif]">
      
      {/* NOTIFIKASI EXPORT BERHASIL */}
      {showExportNotif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <img 
              src="https://img.icons8.com/ios-filled/50/ffffff/checked-checkbox.png" 
              alt="Success Icon" 
              className="w-5 h-5 object-contain"
            />
            <div>
              <p className="font-black text-xs uppercase tracking-widest">Export Success!</p>
              <p className="text-[10px] font-bold opacity-90">Manifest data has been downloaded.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Cargo Volume Trend */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
          <div className="mb-4">
            <h3 className="font-black text-gray-800 uppercase text-sm">Daily Cargo Volume Trend</h3>
            <p className="text-[10px] text-gray-400 font-bold">Cargo received, processed, and departed</p>
          </div>
          <div className="h-48 w-full bg-blue-50/30 rounded-2xl border border-dashed border-blue-200 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 flex items-end px-4 pb-4 gap-4">
                <div className="w-full bg-blue-500/20 rounded-t-lg transition-all duration-500" style={{ height: `${stats.total > 0 ? (stats.departed / stats.total) * 100 : 0}%` }}></div>
                <div className="w-full bg-blue-600 rounded-t-lg transition-all duration-500" style={{ height: `${stats.total > 0 ? (stats.onTime / stats.total) * 100 : 0}%` }}></div>
                <div className="w-full bg-blue-700 rounded-t-lg transition-all duration-500" style={{ height: '90%' }}></div>
             </div>
          </div>
        </div>

        {/* Flight On-Time Performance */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
          <div className="mb-4">
            <h3 className="font-black text-gray-800 uppercase text-sm">Flight On-Time Performance</h3>
            <p className="text-[10px] text-gray-400 font-bold">Monthly comparison of flight punctuality</p>
          </div>
          <div className="h-48 w-full bg-green-50/30 rounded-2xl border border-dashed border-green-200 flex items-center justify-center px-8 gap-10">
             <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-32 bg-green-500 rounded-t-lg"></div>
                <span className="text-[8px] font-black">MAR</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-36 bg-green-600 rounded-t-lg"></div>
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
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Active Records</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black">{stats.total}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">manifest</span>
                 </div>
              </div>
              <div className="pl-4">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Processed</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black">{stats.onTime}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">rows</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-800 uppercase text-xs mb-6 tracking-tighter">Flight Status Counter</h3>
            <div className="flex justify-between items-center px-4">
               <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                    <img src="https://img.icons8.com/ios-filled/50/22c55e/checked-checkbox.png" alt="Landed" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-lg font-black leading-none">{stats.onTime}</span>
                  <span className="text-[8px] font-black text-gray-400 uppercase mt-1">Landed</span>
               </div>
               <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                    <img src="https://img.icons8.com/ios-filled/50/eab308/time.png" alt="Delayed" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-lg font-black leading-none">{stats.delayed}</span>
                  <span className="text-[8px] font-black text-gray-400 uppercase mt-1">Delayed</span>
               </div>
               <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                    <img src="https://img.icons8.com/ios-filled/50/3b82f6/aircraft.png" alt="Airborne" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-lg font-black leading-none">{stats.departed}</span>
                  <span className="text-[8px] font-black text-gray-400 uppercase mt-1">Airborne</span>
               </div>
            </div>
        </div>
      </div>

      {/* NEON REAL-TIME TABLE */}
      <div className="mt-6">
         <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h3 className="font-black text-gray-800 uppercase text-xs">Today's Incoming Cloud Cargo</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Real-time Neon Postgres records integration</p>
              </div>
              <button 
                onClick={handleExport} 
                className="bg-[#0a2a66] hover:bg-[#153a8a] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg flex items-center gap-2"
              >
                <img src="https://img.icons8.com/ios-filled/50/ffffff/download.png" alt="Download" className="w-3 h-3" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                        <th className="py-4 px-6">AWB / Manifest</th>
                        <th className="py-4 px-4">Airline</th>
                        <th className="py-4 px-4">Route</th>
                        <th className="py-4 px-4 text-center">Weight</th>
                        <th className="py-4 px-4 text-center">Current Status</th>
                        <th className="py-4 px-6 text-right">Departure Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold">
                      {cargoList.slice(0, 3).map((item, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-[10px]">
                          <td className="py-4 px-6 font-black text-[#0a2a66]">{item.manifest_id}</td>
                          <td className="py-4 px-4 uppercase">{item.airline_name} ({item.flight_code})</td>
                          <td className="py-4 px-4 text-gray-500 uppercase">{item.route}</td>
                          <td className="py-4 px-4 text-center">{item.weight}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right text-gray-400">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
}