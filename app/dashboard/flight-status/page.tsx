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

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch('/api/flight-status');
        if (res.ok) {
          const data = await res.json();
          setFlights(data || []);
        }
      } catch (e) {
        console.error("Gagal sinkronisasi data cloud:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlights();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-20 font-sans text-xs font-bold uppercase tracking-widest text-[#0a2a66] animate-pulse">
        Syncing Cloud Terminal Schedules...
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      
      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50">
        <div className="mb-8 border-b border-gray-50 pb-4">
          <h4 className="font-black text-xl text-[#0a2a66] uppercase italic tracking-tighter">Live Flight Schedule - CGK Airport</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Realtime Connection: Cloud Neon Database</p>
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
                <th className="px-4 py-4">Gate</th>
                <th className="px-4 py-4">Cargo Items</th>
                <th className="px-4 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[13px] font-bold">
              {flights.length > 0 ? (
                flights.map((f, idx) => (
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
                    Tidak ada jadwal penerbangan aktif di database cloud Neon.
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