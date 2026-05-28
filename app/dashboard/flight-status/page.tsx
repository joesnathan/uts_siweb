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

  const fetchFlights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/flight-status');
      if (res.ok) {
        const data = await res.json();
        setFlights(data || []);
      } else {
        setError(`Kesalahan server: HTTP ${res.status}`);
      }
    } catch (e) {
      setError("Gagal menyelaraskan jadwal cargo udara dengan database Neon. Periksa koneksi internet.");
      console.error("Gagal sinkronisasi data cloud:", e);
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

      {/* LIVE CARGO FLEET RADAR MAP */}
      <RadarMap flights={flights} />

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
      </>
      }
    </div>
  );
}

// ================= STYLED HIGH-FIDELITY VECTOR RADAR MAP =================
function RadarMap({ flights }: { flights: FlightCargoType[] }) {
  const [selectedFlightCode, setSelectedFlightCode] = useState<string | null>(null);
  const [radarTick, setRadarTick] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'AIRBORNE' | 'LANDED' | 'DELAYED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time scrolling cargo transit logs
  const [scanLogs, setScanLogs] = useState<string[]>([
    "SYS: Cargo Airspace Tracking Active.",
    "SCAN: Sweeping cargo air corridors...",
    "NET: Neon Cloud Database synced with 20 cargo manifests.",
    "LOG: Transit Hub CGK Terminal 3 operational."
  ]);

  // Telemetry updates simulation ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarTick((prev) => (prev + 1) % 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate dynamic live Cargo logistics logs
  useEffect(() => {
    if (radarTick % 6 === 0 && flights.length > 0) {
      const airborne = flights.filter(f => f.status === 'Airborne');
      if (airborne.length > 0) {
        const randomF = airborne[Math.floor(Math.random() * airborne.length)];
        const mId = 10 + (randomF.flight_code.charCodeAt(2) % 30);
        
        const possibleLogs = [
          `MANIFEST: MNF-2026-0${mId} transit clearance approved by Customs.`,
          `GPS: Uplink nominal for cargo flight ${randomF.flight_code} over Java Sea.`,
          `HUB: KNO Air Cargo Logistics center preparing manifest unloading.`,
          `MONITOR: Temperature check nominal (+4.2°C) for flight ${randomF.flight_code} cold-chain parcels.`,
          `NET: Telemetry tracking stable. ground spd ${780 + (randomF.flight_code.charCodeAt(2) % 110)}kt.`,
          `SYS: Cargo weight verified (${randomF.items} units) for flight ${randomF.flight_code}.`
        ];
        
        const newLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
        setScanLogs(prev => [newLog, ...prev.slice(0, 15)]);
      }
    }
  }, [radarTick, flights]);

  // Geografis Coordinate Maps (Centered at CGK: 380, 412)
  const routeMap: Record<string, { x: number; y: number; name: string; heading: number }> = {
    'DPS': { x: 715, y: 452, name: 'Denpasar (DPS)', heading: 105 },
    'KNO': { x: 140, y: 135, name: 'Medan (KNO)', heading: 315 },
    'SUB': { x: 590, y: 432, name: 'Surabaya (SUB)', heading: 100 },
    'BPN': { x: 550, y: 260, name: 'Balikpapan (BPN)', heading: 35 },
    'JOG': { x: 485, y: 418, name: 'Yogyakarta (JOG)', heading: 100 },
    'SIN': { x: 230, y: 120, name: 'Singapore (SIN)', heading: 325 },
    'PNK': { x: 425, y: 250, name: 'Pontianak (PNK)', heading: 10 },
  };

  const cargoCategories = [
    "Electronics & Tech Spares",
    "Priority Medical Supplies",
    "E-Commerce Retail Cargo",
    "Automotive Spare Parts",
    "High-Value Luxury Goods",
    "Perishable Fresh Logistics",
    "Standard Express Packages"
  ];

  // Hitung posisi koordinat pesawat
  const getFlightPosition = (f: FlightCargoType, idx: number) => {
    if (!f.route) return { x: 380, y: 412, heading: 0, lat: "06.12° S", lon: "106.66° E", alt: 0, spd: 0 };
    const parts = f.route.split('-');
    const destCode = parts[parts.length - 1]?.trim().toUpperCase();
    const dest = routeMap[destCode];

    // Speed & Altitude deterministik agar stabil berdasarkan Flight Code
    const seedAlt = 31 + (f.flight_code.charCodeAt(3) % 9);
    const seedSpd = 785 + (f.flight_code.charCodeAt(2) % 110);

    if (!dest) {
      return { 
        x: 380, 
        y: 412, 
        heading: 0, 
        lat: "06.12° S", 
        lon: "106.66° E", 
        alt: 0, 
        spd: 0 
      };
    }

    if (f.status === 'Landed') {
      const latVal = -2 - (dest.y - 120) * 0.015;
      const lonVal = 95 + dest.x * 0.035;
      return { 
        x: dest.x, 
        y: dest.y, 
        heading: dest.heading,
        lat: `${Math.abs(latVal).toFixed(2)}° S`,
        lon: `${lonVal.toFixed(2)}° E`,
        alt: 0,
        spd: 0
      };
    }

    if (f.status === 'Airborne') {
      // Progress meluncur mulus berdasarkan radarTick
      const progress = ((radarTick * 0.005) + (idx * 0.17)) % 0.8 + 0.1;
      const x = 380 + (dest.x - 380) * progress;
      const y = 412 + (dest.y - 412) * progress;
      
      const latVal = -2 - (y - 120) * 0.015;
      const lonVal = 95 + x * 0.035;

      return { 
        x, 
        y, 
        heading: dest.heading,
        lat: `${Math.abs(latVal).toFixed(2)}° S`,
        lon: `${lonVal.toFixed(2)}° E`,
        alt: seedAlt,
        spd: seedSpd
      };
    }

    // Default parked at CGK (Jakarta)
    return { 
      x: 380, 
      y: 412, 
      heading: 0,
      lat: "06.12° S",
      lon: "106.66° E",
      alt: 0,
      spd: 0
    };
  };

  const selectedFlight = flights.find(f => f.flight_code === selectedFlightCode) || null;
  const selectedFlightPos = selectedFlight ? getFlightPosition(selectedFlight, flights.indexOf(selectedFlight)) : null;

  // Filter pesawat untuk map & panel samping
  const filteredFlights = flights.filter(f => {
    // Cocokkan status filter
    if (filterStatus === 'AIRBORNE' && f.status !== 'Airborne') return false;
    if (filterStatus === 'LANDED' && f.status !== 'Landed') return false;
    if (filterStatus === 'DELAYED' && f.status !== 'Delayed' && f.status !== 'Scheduled') return false;
    
    // Cocokkan text query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return f.flight_code.toLowerCase().includes(q) || 
             f.airline_name.toLowerCase().includes(q) ||
             f.route.toLowerCase().includes(q);
    }
    return true;
  });

  // Hitung statistik airspace
  const totalTracked = flights.length;
  const countAirborne = flights.filter(f => f.status === 'Airborne').length;
  const countLanded = flights.filter(f => f.status === 'Landed').length;

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[680px] text-white font-[Arial,sans-serif] relative animate-in zoom-in duration-500">
      
      {/* LEFT COLUMN: ACTIVE VISUAL GIS RADAR SCOPE */}
      <div className="relative flex-1 h-[450px] lg:h-full bg-[#030712] overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
        
        {/* RADAR HEADER CONTROL & MAP FILTERS */}
        <div className="bg-[#091022]/90 border-b border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-30 relative backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Cargo Airspace GPS Tracker</span>
              <p className="text-[8px] font-mono text-blue-400 mt-0.5 uppercase tracking-wider">Fleet Tracking active | Realtime GPS Uplink</p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === 'ALL' 
                  ? 'bg-blue-600 border-blue-500 text-white font-black' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Cargo ({totalTracked})
            </button>
            <button 
              onClick={() => setFilterStatus('AIRBORNE')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === 'AIRBORNE' 
                  ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              En Route ({countAirborne})
            </button>
            <button 
              onClick={() => setFilterStatus('LANDED')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === 'LANDED' 
                  ? 'bg-emerald-600 border-emerald-500 text-white font-black' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Arrived ({countLanded})
            </button>
          </div>
        </div>

        {/* GEOGRAPHIC MAP AREA */}
        <div className="relative flex-1 w-full bg-[#030712] overflow-hidden">
          
          {/* SEARCH BAR INPUT OVERLAY - Clickable & relative to the map canvas */}
          <div className="absolute top-4 left-6 z-40 w-64 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 backdrop-blur-md shadow-lg pointer-events-auto">
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search Target Code / Route..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[10px] text-white font-black w-full border-none focus:outline-none placeholder-slate-500 uppercase"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white text-xs">×</button>
            )}
          </div>
          
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            
            {/* DEF GRADIENT GLOWS FOR FADING RADAR CRTs */}
            <defs>
              <radialGradient id="radarScanGlow" cx="380" cy="412" r="500" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.10)" />
                <stop offset="40%" stopColor="#0b152d" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#030712" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="sonarBeamSweep" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="15%" stopColor="rgba(59, 130, 246, 0.18)" />
                <stop offset="60%" stopColor="rgba(59, 130, 246, 0.02)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </linearGradient>
            </defs>

            {/* Glowing background gradient centered at CGK */}
            <rect width="1000" height="600" fill="url(#radarScanGlow)" />

            {/* LATITUDE & LONGITUDE NAVIGATION GRID LINES */}
            <g stroke="rgba(51, 65, 85, 0.15)" strokeWidth="0.5">
              {/* Longitude Grid lines */}
              <line x1="100" y1="0" x2="100" y2="600" />
              <line x1="200" y1="0" x2="200" y2="600" />
              <line x1="300" y1="0" x2="300" y2="600" />
              <line x1="400" y1="0" x2="400" y2="600" strokeDasharray="3 3" />
              <line x1="500" y1="0" x2="500" y2="600" />
              <line x1="600" y1="0" x2="600" y2="600" />
              <line x1="700" y1="0" x2="700" y2="600" />
              <line x1="800" y1="0" x2="800" y2="600" strokeDasharray="3 3" />
              <line x1="900" y1="0" x2="900" y2="600" />

              {/* Latitude Grid lines */}
              <line x1="0" y1="100" x2="1000" y2="100" />
              <line x1="0" y1="200" x2="1000" y2="200" strokeDasharray="3 3" />
              <line x1="0" y1="300" x2="1000" y2="300" />
              <line x1="0" y1="400" x2="1000" y2="400" />
              <line x1="0" y1="500" x2="1000" y2="500" />
            </g>

            {/* RADAR GRIDS: RANGE RING MARKERS Centered at CGK (380, 412) */}
            <g fill="none" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="0.75">
              <circle cx="380" cy="412" r="80" />
              <circle cx="380" cy="412" r="160" />
              <circle cx="380" cy="412" r="260" strokeDasharray="2 3" strokeWidth="0.5" />
              <circle cx="380" cy="412" r="380" />
              <circle cx="380" cy="412" r="500" strokeDasharray="4 4" />
              
              {/* Radar Crosshairs */}
              <line x1="380" y1="0" x2="380" y2="600" stroke="rgba(59, 130, 246, 0.06)" strokeWidth="0.5" strokeDasharray="1 1" />
              <line x1="0" y1="412" x2="1000" y2="412" stroke="rgba(59, 130, 246, 0.06)" strokeWidth="0.5" strokeDasharray="1 1" />
            </g>

            {/* HIGH-FIDELITY VECTOR LAND MASSES OF INDONESIA */}
            <g fill="rgba(30, 41, 59, 0.35)" stroke="rgba(71, 85, 105, 0.35)" strokeWidth="0.75" filter="drop-shadow(0 0 6px rgba(15,23,42,0.9))">
              {/* Sumatera */}
              <path d="M 50,60 L 65,55 L 75,70 L 95,95 L 120,110 L 150,150 L 175,185 L 210,230 L 250,290 L 290,340 L 320,380 L 340,405 L 355,415 L 362,410 L 360,398 L 348,390 L 335,385 L 315,360 L 290,320 L 270,300 L 255,275 L 235,250 L 210,210 L 180,170 L 150,135 L 120,100 L 95,75 L 70,60 Z" />
              {/* Jawa */}
              <path d="M 330,400 C 370,390 410,392 460,398 C 510,402 560,408 610,415 C 660,422 690,427 710,430 C 715,432 720,435 720,440 C 715,445 690,445 670,442 C 620,435 570,428 520,422 C 470,416 420,410 370,405 C 340,402 335,402 330,400 Z" />
              {/* Kalimantan */}
              <path d="M 420,200 L 440,185 L 470,175 L 505,178 L 540,172 L 570,185 L 590,200 L 610,225 L 625,255 L 620,290 L 605,320 L 585,345 L 560,355 L 530,358 L 500,352 L 470,348 L 445,340 L 425,325 L 410,300 L 400,270 L 405,235 L 412,215 Z" />
              {/* Sulawesi */}
              <path d="M 650,230 L 665,225 L 685,228 L 705,238 L 710,250 L 700,260 L 685,268 L 700,280 L 720,295 L 745,315 L 760,335 L 762,348 L 752,352 L 740,345 L 725,335 L 710,332 L 690,342 L 675,355 L 665,372 L 658,382 L 650,378 L 652,362 L 662,345 L 670,330 L 672,318 L 660,312 L 645,302 L 632,290 L 638,278 L 648,272 L 642,258 L 640,242 Z" />
              {/* Singapore & Malay Peninsula */}
              <path d="M 210,30 L 225,45 L 235,65 L 238,85 L 238,105 L 232,120 L 226,122 L 222,118 L 226,105 L 224,90 L 216,75 L 208,55 L 202,40 Z" />
              {/* Bali */}
              <path d="M 725,440 L 733,438 L 739,442 L 737,448 L 729,450 L 723,446 Z" />
              {/* Lombok */}
              <path d="M 747,442 L 755,440 L 759,446 L 753,452 L 745,448 Z" />
            </g>

            {/* GPS SWEEPING BEAM (Smooth GPU animation) */}
            <g>
              <line x1="380" y1="412" x2="380" y2="0" stroke="rgba(59, 130, 246, 0.35)" strokeWidth="1.2" />
              <polygon points="380,412 380,0 240,25 380,412" fill="url(#sonarBeamSweep)" />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 380 412"
                to="360 380 412"
                dur="16s"
                repeatCount="indefinite"
              />
            </g>

            {/* AIRPORT TRANSIT CENTERS */}
            {/* CGK Hub Airport */}
            <g transform="translate(380, 412)">
              <circle cx="0" cy="0" r="10" fill="none" stroke="#3b82f6" strokeWidth="0.75">
                <animate attributeName="r" values="3;9;3" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="2.5" fill="#3b82f6" />
              <text x="0" y="-8" fill="#60a5fa" fontSize="8" fontWeight="black" textAnchor="middle" letterSpacing="0.05em" fontFamily="monospace">
                CGK
              </text>
            </g>

            {/* Destination Airports */}
            {Object.entries(routeMap).map(([code, dest]) => (
              <g key={`airport-${code}`} transform={`translate(${dest.x}, ${dest.y})`}>
                <circle cx="0" cy="0" r="8" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="1 1" />
                <circle cx="0" cy="0" r="2" fill="#60a5fa" />
                <text x="0" y="10" fill="#93c5fd" fontSize="7" fontWeight="black" textAnchor="middle" fontFamily="monospace">
                  {code}
                </text>
              </g>
            ))}

            {/* DYNAMIC SHIELD ROUTES CORRIDORS */}
            {filteredFlights.map((f, idx) => {
              const pos = getFlightPosition(f, idx);
              const parts = f.route.split('-');
              const destCode = parts[parts.length - 1]?.trim().toUpperCase();
              const dest = routeMap[destCode];
              if (!dest) return null;

              const isSelected = selectedFlightCode === f.flight_code;

              return (
                <g key={`path-${f.flight_code}`} className="pointer-events-none">
                  {/* Past path trail (CGK to current location) */}
                  <line
                    x1="380"
                    y1="412"
                    x2={pos.x}
                    y2={pos.y}
                    stroke={isSelected ? "rgba(59, 130, 246, 0.7)" : "rgba(96, 165, 250, 0.12)"}
                    strokeWidth={isSelected ? "1.5" : "0.75"}
                    strokeDasharray={isSelected ? "none" : "3 3"}
                  />
                  {/* Forward path (current location to destination) */}
                  {f.status === 'Airborne' && (
                    <line
                      x1={pos.x}
                      y1={pos.y}
                      x2={dest.x}
                      y2={dest.y}
                      stroke={isSelected ? "rgba(59, 130, 246, 0.4)" : "rgba(96, 165, 250, 0.06)"}
                      strokeWidth={isSelected ? "1.25" : "0.5"}
                      strokeDasharray="2 2"
                    />
                  )}
                </g>
              );
            })}

            {/* DYNAMIC CARGO CARRIER PLANES */}
            {filteredFlights.map((f, idx) => {
              const pos = getFlightPosition(f, idx);
              const isSelected = selectedFlightCode === f.flight_code;
              
              // Warna representasi kargo
              let planeColor = "#38bdf8"; // Airborne/En Route = Sky Blue
              let labelColor = "#38bdf8";
              if (f.status === 'Landed') {
                planeColor = "#10b981"; // Arrived = Emerald Green
                labelColor = "#34d399";
              } else if (f.status === 'Delayed' || f.status === 'Scheduled') {
                planeColor = "#64748b"; // Delayed/Scheduled = Slate Grey
                labelColor = "#94a3b8";
              }

              return (
                <g 
                  key={f.flight_code} 
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedFlightCode(f.flight_code)}
                >
                  
                  {/* Selected airplane highlight ring */}
                  {isSelected && (
                    <circle cx="0" cy="0" r="16" fill="none" stroke="#60a5fa" strokeWidth="1.25" strokeDasharray="3 3">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0"
                        to="360"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Pulsing signal halo */}
                  {f.status === 'Airborne' && (
                    <circle cx="0" cy="0" r="9" fill="none" stroke="#38bdf8" strokeWidth="0.5" opacity="0.6">
                      <animate attributeName="r" values="3;12;3" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Cargo Jet Plane Vector */}
                  <g transform={`rotate(${pos.heading})`} className="transition-transform duration-1000">
                    <path 
                      d="M0,-11 L8,4 L3,3 L2,9 L5,11 L0,9 L-5,11 L-2,9 L-3,3 L-8,4 Z" 
                      fill={planeColor} 
                      stroke="#030712" 
                      strokeWidth="0.5"
                    />
                  </g>

                  {/* Flight Label Text overlays next to plane */}
                  <g transform="translate(12, -6)" className="select-none pointer-events-none">
                    <rect x="-3" y="-9" width="48" height="19" rx="2" fill="rgba(3, 7, 18, 0.88)" stroke={isSelected ? "#60a5fa" : "rgba(255,255,255,0.1)"} strokeWidth="0.5" />
                    {/* Flight/Cargo Code */}
                    <text x="0" y="0" fill={labelColor} fontSize="7.5" fontWeight="900" fontFamily="monospace">
                      {f.flight_code}
                    </text>
                    {/* Telemetry data (Speed/Altitude) */}
                    <text x="0" y="7" fill="#94a3b8" fontSize="6" fontWeight="bold" fontFamily="monospace">
                      {f.status === 'Airborne' 
                        ? `FL${pos.alt} | ${pos.spd}kt` 
                        : f.status
                      }
                    </text>
                  </g>
                </g>
              );
            })}

            {/* COORDINATE GRID TEXT LABELS ON BORDERS */}
            <g fill="rgba(100, 116, 139, 0.4)" fontSize="6.5" fontFamily="monospace">
              {/* Longitudes */}
              <text x="105" y="15" textAnchor="start">100°E</text>
              <text x="205" y="15" textAnchor="start">102°E</text>
              <text x="305" y="15" textAnchor="start">104°E</text>
              <text x="405" y="15" textAnchor="start">106°E</text>
              <text x="505" y="15" textAnchor="start">108°E</text>
              <text x="605" y="15" textAnchor="start">110°E</text>
              <text x="705" y="15" textAnchor="start">112°E</text>
              <text x="805" y="15" textAnchor="start">114°E</text>
              <text x="905" y="15" textAnchor="start">116°E</text>

              {/* Latitudes */}
              <text x="960" y="105" textAnchor="end">02°S</text>
              <text x="960" y="205" textAnchor="end">04°S</text>
              <text x="960" y="305" textAnchor="end">06°S</text>
              <text x="960" y="405" textAnchor="end">08°S</text>
              <text x="960" y="505" textAnchor="end">10°S</text>
            </g>
          </svg>

          {/* Coordinate status indicators overlays */}
          <div className="absolute bottom-4 left-6 text-[8.5px] font-black tracking-widest text-slate-500 uppercase font-mono bg-[#030712]/80 px-2 py-1 rounded border border-slate-800">
            RADAR GPS STAT: ACTIVE | MANIFEST TRACKED: {filteredFlights.length} / {flights.length}
          </div>
          <div className="absolute bottom-4 right-6 text-[8.5px] font-black tracking-widest text-blue-400 uppercase font-mono bg-[#030712]/80 px-2 py-1 rounded border border-blue-500/20">
            CGK FREIGHT GATEWAY 3
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: CARGO TELEMETRY DETECTOR SIDEBAR */}
      <div className="w-full lg:w-[360px] bg-[#091022] p-8 flex flex-col justify-between border-t lg:border-t-0 border-slate-800 z-10 overflow-y-auto lg:max-h-full scrollbar-thin scrollbar-thumb-slate-800/80 scrollbar-track-transparent">
        
        <div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_6px_#3b82f6]"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">CARGO FLEET MONITOR</span>
            </div>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/25 font-black text-[7.5px] px-2 py-0.5 rounded uppercase">
              GPS Nominal
            </span>
          </div>

          {/* DOCK COUNTERS */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/50">
              <p className="text-[8px] font-black text-slate-500 uppercase">TRACKED</p>
              <p className="text-sm font-black mt-0.5 text-blue-400">{totalTracked}</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/50">
              <p className="text-[8px] font-black text-slate-500 uppercase">EN ROUTE</p>
              <p className="text-sm font-black mt-0.5 text-amber-500">{countAirborne}</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/50">
              <p className="text-[8px] font-black text-slate-500 uppercase">ARRIVED</p>
              <p className="text-sm font-black mt-0.5 text-emerald-500">{countLanded}</p>
            </div>
          </div>

          {/* FLIGHT SELECTION TELEMETRY DATA */}
          {selectedFlight && selectedFlightPos ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Target manifest head card */}
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none">PARCEL SHIPMENT VEHICLE</p>
                <h4 className="text-2xl font-black tracking-tighter flex items-center justify-between mt-1">
                  <span>{selectedFlight.flight_code}</span>
                  <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                    selectedFlight.status === 'Landed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    selectedFlight.status === 'Delayed' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-blue-500/10 text-blue-400 border-blue-500/25'
                  }`}>
                    {selectedFlight.status === 'Airborne' ? 'EN ROUTE' : selectedFlight.status === 'Landed' ? 'ARRIVED' : selectedFlight.status}
                  </span>
                </h4>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">{selectedFlight.airline_name}</p>
              </div>

              {/* Transit route progress */}
              <div>
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase mb-1.5 font-mono">
                  <span>CGK (ORIGIN)</span>
                  <span>➔</span>
                  <span>{selectedFlight.route?.split('-')[1] || "DEST"}</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      selectedFlight.status === 'Landed' ? 'w-full bg-emerald-500' :
                      selectedFlight.status === 'Scheduled' || selectedFlight.status === 'Delayed' ? 'w-[5%] bg-slate-700' : 'w-[55%] bg-blue-500 animate-pulse'
                    }`}
                  ></div>
                </div>
              </div>

              {/* Live coordinates telemetry grid */}
              <div className="grid grid-cols-2 gap-3.5 border-t border-b border-slate-800/80 py-4">
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">SPEED (SPD)</p>
                  <p className="text-xs font-bold mt-0.5 text-slate-200">
                    {selectedFlight.status === 'Airborne' ? `${selectedFlightPos.spd} knots` : '0 kts (Arrived)'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">ALTITUDE (ALT)</p>
                  <p className="text-xs font-bold mt-0.5 text-slate-200">
                    {selectedFlight.status === 'Airborne' ? `FL${selectedFlightPos.alt} (${selectedFlightPos.alt * 100} ft)` : 'Ground Terminal'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">GPS COORDINATES</p>
                  <p className="text-[9.5px] font-mono mt-0.5 text-blue-300 leading-snug">
                    {selectedFlightPos.lat}<br/>
                    {selectedFlightPos.lon}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">CARGO LOAD</p>
                  <p className="text-xs font-bold mt-0.5 text-slate-200">{selectedFlight.items || 25} parcel units</p>
                </div>
              </div>

              {/* THEMATIC CARGO MANIFEST DETAILS */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3.5">
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none">CARGO MANIFEST PROFILE</p>
                
                <div className="space-y-3 text-[11px] pt-1">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500 font-bold uppercase text-[8px]">MANIFEST ID</span>
                    <span className="font-mono font-black text-slate-200">
                      MNF-2026-0{10 + (selectedFlight.flight_code.charCodeAt(2) % 30)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500 font-bold uppercase text-[8px]">CARGO CATEGORY</span>
                    <span className="font-black text-slate-200">
                      {cargoCategories[selectedFlight.flight_code.charCodeAt(3) % cargoCategories.length]}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500 font-bold uppercase text-[8px]">HANDLING SPEC</span>
                    <span className={`font-black text-[8px] px-2 py-0.5 rounded ${
                      Number(selectedFlight.items || 0) % 2 === 0 
                        ? 'bg-blue-950 text-blue-400 border border-blue-900/40' 
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-900/40'
                    }`}>
                      {Number(selectedFlight.items || 0) % 2 === 0 ? 'PRIORITY AIR EXPRESS' : 'STANDARD LOGISTICS'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase text-[8px]">LOGISTICS HUB</span>
                    <span className="font-bold text-slate-300">CGK CARGO TERMINAL 3</span>
                  </div>
                </div>
              </div>

              {/* Transit gate schedule details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/60">
                  <p className="text-[8px] font-black text-slate-500 uppercase">SCH / ACT LANDING</p>
                  <p className="font-bold text-slate-300 mt-0.5">{selectedFlight.scheduled} / {selectedFlight.actual}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/60">
                  <p className="text-[8px] font-black text-slate-500 uppercase">DISPATCH GATE</p>
                  <p className="font-black text-blue-400 mt-0.5">{selectedFlight.gate || 'TBA'}</p>
                </div>
              </div>

            </div>
          ) : (
            // STANDBY DATA LOGISTICS
            <div className="h-[220px] flex flex-col justify-center items-center text-center px-4 space-y-4">
              <div className="w-14 h-14 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-center justify-center relative overflow-hidden group shadow-lg">
                <div className="absolute inset-0 bg-blue-500/5 animate-ping rounded-3xl"></div>
                <svg className="w-6 h-6 text-blue-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-200">STANDBY - SCANNING CARGO FLEETS</p>
                <p className="text-[9px] text-slate-400 font-bold leading-relaxed mt-2 uppercase">
                  Click on any interactive cargo flight silhouette on the map grid to intercept delivery manifest tracking logs and parcel load details.
                </p>
              </div>
            </div>
          )}

          {/* REALTIME SCROLLING CARGO LOGISTICS SYSTEM LOGS */}
          <div className="mt-6 border-t border-slate-800/80 pt-4">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2.5">LIVE LOGISTICS HUB LOGS</p>
            <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800/60 h-28 overflow-y-auto font-mono text-[8px] text-slate-400 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
              {scanLogs.map((log, index) => (
                <div key={index} className="flex gap-1.5 leading-normal">
                  <span className="text-slate-600">[{radarTick + index}]</span>
                  <span className={
                    log.includes('MANIFEST')
                      ? 'text-blue-400 font-black' 
                      : log.includes('MONITOR')
                        ? 'text-emerald-400 font-black'
                        : 'text-slate-300'
                  }>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOGISTICS FOOTER */}
        <div className="text-[7.5px] font-black text-slate-500 text-center border-t border-slate-800/50 pt-4 uppercase tracking-[0.18em] leading-none mt-4">
          TERBANGINAJA LOGISTICS GATEWAY V3.2
        </div>
      </div>
    </div>
  );
}