"use client";

import { useEffect, useState } from "react";

// Struktur data super ketat agar pnpm run build langsung lolos tanpa complaint!
interface FlightCargoType {
  flight_code: string;
  airline_name: string;
  route: string;
  scheduled: string;
  actual: string;
  gate: string;
  items: string;
  status: string;
}

export default function FlightStatusPage() {
  const [flights, setFlights] = useState<FlightCargoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(flights.length / itemsPerPage);
  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  const fetchFlights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/flight-status');
      if (res.ok) {
        const data = await res.json();
        setFlights(data || []);
      } else {
        setError(`Server error: HTTP ${res.status}`);
      }
    } catch (e) {
      setError("Failed to synchronize flight cargo schedule with Neon database. Check internet connection.");
      console.error("Cloud data synchronization failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] w-full bg-white border border-gray-100 rounded-[2.5rem] p-12 relative overflow-hidden shadow-xl shadow-gray-100/50 animate-in fade-in duration-500">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#0a2a66_1px,transparent_1px),linear-gradient(to_bottom,#0a2a66_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        {/* Concentric radar loading pulses */}
        <div className="relative z-10 w-24 h-24 mb-8 flex items-center justify-center">
          {/* Sonar active waves */}
          <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-3 border-2 border-blue-500/15 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-6 border border-blue-400/20 rounded-full animate-pulse"></div>
          
          {/* Glowing Glassmorphic Cargo Scope */}
          <div className="w-16 h-16 bg-gradient-to-tr from-[#0a2a66] to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/30 relative overflow-hidden">
            {/* Radar swept line light */}
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
    <div className="w-full animate-in fade-in duration-700 pb-12" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      
      {/* 404-STYLE ERROR CONTENT AREA FOR DATABASE CONNECTION FAILURE */}
      {error ?
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
            onClick={fetchFlights}
            className="bg-[#0a2a66] hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl text-xs transition-all shadow-md active:scale-95 uppercase tracking-wider"
          >
            Retry Connection
          </button>
        </div>
       : 
        <>

      {/* DOCK SCHEDULE TABLE */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 mt-8">
        <div className="mb-8 border-b border-gray-50 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-black text-xl text-[#0a2a66] uppercase italic tracking-tighter">Live Cargo Flight Schedule - CGK Hub</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Realtime Connection: Cloud Neon Database</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-[9px] font-black text-[#0a2a66] uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-xl">
              Logistics Feed Active
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-black border-b border-gray-100">
                <th className="px-4 py-4">Flight Number</th>
                <th className="px-4 py-4">Airline</th>
                <th className="px-4 py-4">Route</th>
                <th className="px-4 py-4">Scheduled</th>
                <th className="px-4 py-4">Actual</th>
                <th className="px-4 py-4 text-blue-600 font-black">Gate</th>
                <th className="px-4 py-4 text-gray-500">Cargo Items</th>
                <th className="px-4 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[13px] font-bold">
              {currentFlights.length > 0 ? (
                currentFlights.map((f, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-5 font-black text-[#0a2a66]">{f.flight_code}</td>
                    <td className="px-4 py-5 text-gray-700 uppercase">{f.airline_name}</td>
                    <td className="px-4 py-5 font-black text-xs text-gray-500">{f.route}</td>
                    <td className="px-4 py-5">{f.scheduled}</td>
                    <td className="px-4 py-5">{f.actual}</td>
                    <td className="px-4 py-5 text-blue-600 font-black">{f.gate}</td>
                    <td className="px-4 py-5 text-gray-500">{f.items}</td>
                    <td className="px-4 py-5 text-center">
                      <div className="flex justify-center items-center">
                        <span className={`font-black px-4 py-1.5 rounded-full text-[10px] uppercase flex items-center gap-1.5 ${
                          f.status === 'Landed' ? 'bg-green-100 text-green-700' :
                          f.status === 'Delayed' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {f.status === 'Landed' && (
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {f.status === 'Delayed' && (
                            <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {f.status !== 'Landed' && f.status !== 'Delayed' && (
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          )}
                          {f.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 italic">
                    No active flight schedules found in Neon cloud database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {flights.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-50">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Showing <span className="text-[#0a2a66] font-black">{indexOfFirstFlight + 1}</span> to{" "}
              <span className="text-[#0a2a66] font-black">
                {Math.min(indexOfLastFlight, flights.length)}
              </span>{" "}
              of <span className="text-[#0a2a66] font-black">{flights.length}</span> flights
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
                title="Previous Page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 ${
                    currentPage === page
                      ? "bg-[#0a2a66] text-white"
                      : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
                title="Next Page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      </>
      }
    </div>
  );
}