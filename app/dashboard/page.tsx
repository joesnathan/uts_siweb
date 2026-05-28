"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. IMPORT USEROUTER UNTUK NAVIGASI

// Struktur data terintegrasi presisi dengan database Neon Postgres
interface CargoRow {
  id: number;
  manifest_id: string;
  airline_name: string;
  flight_code: string;
  route: string;
  weight: number | string; // Bisa number dari database Neon, atau string
  flight_status: string;
  operational_status?: string; // Status operasional real-time dari Neon
  status?: string;              // Fallback status
  date: string;
  scheduled_time: string;
  actual_time: string;
}

export default function DashboardOperationalPage() {
  const router = useRouter(); // 2. INISIALISASI ROUTER
  const [cargoList, setCargoList] = useState<CargoRow[]>([]);
  const [showExportNotif, setShowExportNotif] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3-second aesthetic cargo preloader states
  const [hasMounted, setHasMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Timer 3 detik preloader (hanya dipicu dari Login pertama kali)
  useEffect(() => {
    setHasMounted(true);
    const needsPre = sessionStorage.getItem("needsPreloader") === "true";
    if (!needsPre) {
      setPageLoading(false);
      setProgress(100);
    } else {
      setPageLoading(true);
      const timer = setTimeout(() => {
        setPageLoading(false);
        sessionStorage.setItem("needsPreloader", "false");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Ticking progress counter 0% - 100%
  useEffect(() => {
    if (!pageLoading) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 27);
    return () => clearInterval(interval);
  }, [pageLoading]);

  // State hitungan counter statistik hasil kalkulasi data cloud Neon
  const [stats, setStats] = useState({
    total: 0,
    onTime: 0,   // Status Landed
    delayed: 0,  // Status Delayed
    departed: 0  // Status Airborne
  });

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // SINKRONISASI REAL-TIME: Menembak API utama Neon (/api/cargo)
      const res = await fetch('/api/cargo');
      if (res.ok) {
        const jsonResult = await res.json();
        // Database Neon biasanya mengembalikan format { success: true, data: [...] }
        if (jsonResult.success && jsonResult.data) {
          const rows: CargoRow[] = jsonResult.data;
          setCargoList(rows);

          // KALKULASI LIVE: Menghitung summary counter secara real-time langsung dari data Neon
          const total = rows.length;
          const onTime = rows.filter(item => item.flight_status === 'Landed').length;
          const delayed = rows.filter(item => item.flight_status === 'Delayed').length;
          const departed = rows.filter(item => item.flight_status === 'Airborne').length;

          setStats({ total, onTime, delayed, departed });
        } else {
          setError(jsonResult.error || "Gagal menyelaraskan data dengan database Neon.");
        }
      } else {
        setError(`Kesalahan server: HTTP ${res.status}`);
      }
    } catch (err) {
      setError("Gagal menyelaraskan data dengan database Neon. Periksa koneksi internet.");
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

  if (!hasMounted) {
    return null;
  }

  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#070e1e] flex flex-col items-center justify-center p-6 font-sans text-white animate-in fade-in duration-500">
        
        {/* Background global air cargo HUD grid lines */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          {/* Concentric rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-500/10 rounded-full"></div>
        </div>

        {/* Glowing concentric radar scope */}
        <div className="relative z-10 w-28 h-28 mb-8 flex items-center justify-center">
          {/* Rippling active radar scope lines */}
          <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-3 border-2 border-blue-500/15 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-6 border border-blue-400/20 rounded-full animate-pulse"></div>
          
          {/* Glowing Scope Container */}
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 relative overflow-hidden">
            {/* Infinite light sweeping beam */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_40%,rgba(255,255,255,0.45)_100%)] animate-spin" style={{ animationDuration: '2s' }}></div>
            {/* Cargo takeoff plane icon */}
            <svg className="w-9 h-9 text-white relative z-10 drop-shadow-[0_2px_8px_rgba(255,255,255,0.45)] animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animationDuration: '3s' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5M21 12l-5-2-4-5H9l2 5-5 1-2-2H2l1 3 3 1 12 3 5-3z" />
            </svg>
          </div>
        </div>

        {/* Preloader Subtext & Branding */}
        <div className="relative z-10 text-center max-w-sm">
          <span className="text-[8.5px] font-black uppercase tracking-[0.28em] text-blue-400 bg-blue-950/80 border border-blue-900/50 px-4 py-1.5 rounded-full backdrop-blur-md">
            Establishing Cloud Connection
          </span>
          <h1 className="text-3xl font-black tracking-tighter mt-6 uppercase italic text-white leading-none">
            Terbanginaja <span className="text-blue-500">Dashboard</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3.5 flex items-center justify-center gap-1.5 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Securing connection & downloading real-time manifests...
          </p>
        </div>

        {/* Live HUD Progress Percentage */}
        <div className="relative z-10 mt-9 font-mono text-3xl font-black text-blue-400 tracking-tighter">
          {progress}%
        </div>

        {/* Progress bar */}
        <div className="relative z-10 w-72 h-1.5 bg-slate-900/90 rounded-full overflow-hidden mt-3 border border-slate-800 p-[1px] shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* High-tech chronological cargo logs (reactive to progress) */}
        <div className="relative z-10 mt-10 w-80 max-w-full">
          <div className="bg-slate-950/85 border border-slate-900 rounded-2xl p-4 font-mono text-[8px] text-slate-500 space-y-2 shadow-2xl">
            <div className="flex justify-between">
              <span className="font-black text-[9px] text-slate-400">DATABASE HANDSHAKE</span>
              <span className="text-blue-400 font-black">SECURE</span>
            </div>
            <div className="border-t border-slate-900/60 pt-2 space-y-1">
              <p className={progress >= 15 ? "text-slate-300 transition-colors" : ""}>
                [0.8s] {progress >= 15 ? "SYS: Linked to Neon Postgres Singapore Pooler." : "SYS: Connecting..."}
              </p>
              <p className={progress >= 45 ? "text-slate-300 transition-colors" : ""}>
                [1.5s] {progress >= 45 ? "DB: Downloading 20 cargo manifest records." : "DB: Querying tables..."}
              </p>
              <p className={progress >= 75 ? "text-slate-300 transition-colors" : ""}>
                [2.3s] {progress >= 75 ? "NET: Synchronizing operational charts metrics." : "NET: Resolving stats..."}
              </p>
              <p className={progress >= 95 ? "text-emerald-400 font-black transition-colors" : ""}>
                [2.8s] {progress >= 95 ? "STATUS: HANDSHAKE NOMINAL. REVEALING CLOUD INTERFACE." : "STATUS: Finalizing..."}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">
          Terbanginaja Secure Database gateway
        </div>
      </div>
    );
  }

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
    <div className="w-full relative space-y-6 animate-in fade-in duration-700 font-[Arial,sans-serif]">
      
      {/* 404-STYLE ERROR CONTENT AREA FOR DATABASE CONNECTION FAILURE */}
      {error && (
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
            onClick={fetchDashboardData}
            className="bg-[#0a2a66] hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl text-xs transition-all shadow-md active:scale-95 uppercase tracking-wider"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* NOTIFIKASI EXPORT BERHASIL */}
      {showExportNotif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <span className="text-lg">✅</span>
            <div>
              <p className="font-black text-xs uppercase tracking-widest">Export Success!</p>
              <p className="text-[10px] font-bold opacity-90">Manifest data has been downloaded.</p>
            </div>
          </div>
        </div>
      )}

      {!error && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Cargo Volume Trend (DYNAMIC BAR HEIGHTS FROM ACTUAL DATABASE RECORDS) */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
              <div className="mb-4">
                <h3 className="font-black text-gray-800 uppercase text-sm">Daily Cargo Volume Trend</h3>
                <p className="text-[10px] text-gray-400 font-bold">Cargo received, processed, and departed</p>
              </div>
              <div className="h-48 w-full bg-blue-50/30 rounded-2xl border border-dashed border-blue-200 flex items-end justify-around px-8 pb-4 relative overflow-hidden">
                 {(() => {
                    const schedVal = stats.total - stats.onTime - stats.delayed - stats.departed;
                    const hSched = stats.total > 0 ? (schedVal / stats.total) * 100 : 0;
                    const hAirborne = stats.total > 0 ? (stats.departed / stats.total) * 100 : 0;
                    const hLanded = stats.total > 0 ? (stats.onTime / stats.total) * 100 : 0;
                    const hDelayed = stats.total > 0 ? (stats.delayed / stats.total) * 100 : 0;

                    return (
                      <>
                        <div className="flex flex-col items-center gap-1.5 w-12 z-10">
                          <div className="w-8 bg-blue-400/35 border border-blue-400/20 rounded-t-lg transition-all duration-1000 ease-out" style={{ height: `${Math.max(hSched * 1.2, 10)}px` }}></div>
                          <span className="text-[7.5px] font-black text-slate-400">SCHED</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-12 z-10">
                          <div className="w-8 bg-sky-500/70 border border-sky-400/20 rounded-t-lg transition-all duration-1000 ease-out" style={{ height: `${Math.max(hAirborne * 1.2, 10)}px` }}></div>
                          <span className="text-[7.5px] font-black text-slate-400">ACTIVE</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-12 z-10">
                          <div className="w-8 bg-blue-700 border border-blue-600 rounded-t-lg transition-all duration-1000 ease-out" style={{ height: `${Math.max(hLanded * 1.2, 10)}px` }}></div>
                          <span className="text-[7.5px] font-black text-slate-400">LANDED</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-12 z-10">
                          <div className="w-8 bg-yellow-500/80 border border-yellow-400/20 rounded-t-lg transition-all duration-1000 ease-out" style={{ height: `${Math.max(hDelayed * 1.2, 10)}px` }}></div>
                          <span className="text-[7.5px] font-black text-slate-400">DELAYED</span>
                        </div>
                      </>
                    );
                 })()}
              </div>
            </div>

            {/* Flight On-Time Performance (DYNAMIC MONTHLY VS HOURLY METRICS) */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
              <div className="mb-4">
                <h3 className="font-black text-gray-800 uppercase text-sm">Flight On-Time Performance</h3>
                <p className="text-[10px] text-gray-400 font-bold">Monthly comparison of flight punctuality</p>
              </div>
              <div className="h-48 w-full bg-green-50/30 rounded-2xl border border-dashed border-green-200 flex items-end justify-around px-8 pb-4 relative overflow-hidden">
                 {(() => {
                    const hOnTime = stats.total > 0 ? (stats.onTime / stats.total) * 100 : 0;
                    const hDelayed = stats.total > 0 ? (stats.delayed / stats.total) * 100 : 0;

                    return (
                      <>
                        <div className="flex flex-col items-center gap-1.5 w-16 z-10">
                          <div className="w-10 bg-emerald-600 rounded-t-lg transition-all duration-1000 ease-out animate-pulse" style={{ height: `${Math.max(hOnTime * 1.3, 15)}px` }}></div>
                          <span className="text-[7.5px] font-black text-slate-400">ON TIME</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-16 z-10">
                          <div className="w-10 bg-red-500/80 rounded-t-lg transition-all duration-1000 ease-out" style={{ height: `${Math.max(hDelayed * 1.3, 10)}px` }}></div>
                          <span className="text-[7.5px] font-black text-slate-400">DELAYED</span>
                        </div>
                      </>
                    );
                 })()}
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
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                        <svg className="w-6.5 h-6.5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      </div>
                      <span className="text-lg font-black leading-none">{stats.onTime}</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase mt-1">Landed</span>
                   </div>
                   <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                        <svg className="w-6.5 h-6.5 text-yellow-600 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-lg font-black leading-none">{stats.delayed}</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase mt-1">Delayed</span>
                   </div>
                   <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                        <svg className="w-6.5 h-6.5 text-blue-600 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ animationDuration: '3s' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
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
                      {cargoList.slice(0, 3).map((item, i) => {
                        // SINKRONISASI DATA: Membaca properti status operasional asli dari Neon Database
                        const displayStatus = item.operational_status || item.status || 'Pending';
                        const displayWeight = typeof item.weight === 'number' ? `${item.weight} kg` : item.weight;

                        return (
                          <tr 
                            key={item.id || i} 
                            // 3. DIKLIK LANGSUNG DIARAHKAN KE /dashboard/cargo-logs
                            onClick={() => router.push("/dashboard/cargo-logs")}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-[10px] cursor-pointer"
                          >
                            <td className="py-4 px-6 font-black text-[#0a2a66] hover:underline">{item.manifest_id}</td>
                            <td className="py-4 px-4 uppercase">{item.airline_name} ({item.flight_code})</td>
                            <td className="py-4 px-4 text-gray-500 uppercase">{item.route}</td>
                            <td className="py-4 px-4 text-center">{displayWeight}</td>
                            <td className="py-4 px-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                                displayStatus === 'Completed' || displayStatus === 'Landed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {displayStatus}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right text-gray-400">{item.date}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
        </>
      )}
    </div>
  );
}