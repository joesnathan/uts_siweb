"use client";

import { useState, useEffect } from "react";

export default function CargoLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState(""); 
  const [showExportNotif, setShowExportNotif] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/cargo-logs');
        if (res.ok) setLogs(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchSearch = log.flight.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        log.airline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || log.status === filterStatus;
    const matchDate = !selectedDate || log.date === selectedDate;
    return matchSearch && matchStatus && matchDate;
  });

  if (isLoading) {
    return <div className="text-center py-20 font-sans text-xs font-bold uppercase tracking-widest text-[#0a2a66] animate-pulse">Syncing Warehouse Verification Logs...</div>;
  }

  return (
    <div className="w-full relative space-y-6 font-[Arial,sans-serif]">
      {showExportNotif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/checked-checkbox.png" alt="Success" className="w-5 h-5" />
            <div>
              <p className="font-black text-xs uppercase tracking-widest">Export Success!</p>
              <p className="text-[10px] font-bold opacity-90">Manifest data has been downloaded.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/30">
            <h3 className="font-black text-xl uppercase tracking-tighter italic">Cloud Cargo Activity Logs</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search flight number..." 
                  className="pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none"
                />
                <img src="https://img.icons8.com/ios-filled/50/9ca3af/search.png" className="w-3 h-3 absolute left-3" alt="search" />
              </div>

              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Landed">Landed</option>
                <option value="Airborne">Airborne</option>
                <option value="Delayed">Delayed</option>
              </select>
              
              <button 
                onClick={() => setShowExportNotif(true)} 
                className="bg-[#0a2a66] text-white px-6 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-2"
              >
                <img src="https://img.icons8.com/ios-filled/50/ffffff/download.png" className="w-3 h-3" alt="download" />
                Export Logs
              </button>
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
                <th className="py-6 px-4 text-center">Warehouse Gate</th>
                <th className="py-6 px-4 text-center">Quantity Box</th>
                <th className="py-6 px-8 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-black">
              {filteredLogs.map((log, index) => (
                <tr key={index} className="hover:bg-blue-50/50 border-b border-gray-50 last:border-0">
                  <td className="py-6 px-8 text-gray-900 uppercase">{log.flight}</td>
                  <td className="py-6 px-4 text-gray-500 font-bold uppercase">{log.airline}</td>
                  <td className="py-6 px-4 text-center text-gray-400 italic">{log.date}</td>
                  <td className="py-6 px-4 text-gray-700">{log.route}</td>
                  <td className="py-6 px-4 text-center">
                    <span className="text-gray-400">{log.scheduled}</span> / <span className="text-gray-900">{log.actual}</span>
                  </td>
                  <td className="py-6 px-4 text-center text-blue-600">{log.gate}</td>
                  <td className="py-6 px-4 text-center text-gray-500">{log.items}</td>
                  <td className="py-6 px-8 text-center flex justify-center">
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-700 flex items-center gap-1">
                      <img src="https://img.icons8.com/ios-filled/50/1d4ed8/aircraft.png" className="w-3 h-3" alt="status" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}