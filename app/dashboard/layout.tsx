"use client"; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true); 

  // --- FUNGSI UNTUK MENGATUR JUDUL DINAMIS ---
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Welcome, Jonathan";
    if (pathname === "/dashboard/operational") return "Operational";
    if (pathname === "/dashboard/flight-status") return "Flight Status";
    if (pathname === "/dashboard/cargo-logs") return "Cargo Logs";
    return "Dashboard";
  };

  const getActiveClass = (path: string) => 
    pathname === path 
      ? "bg-[#0b3b82] border-white font-bold" 
      : "hover:bg-[#0b3b82]/50";

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`relative bg-[#0a2a66] text-white flex flex-col justify-between h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-24 bg-[#0a2a66] border-2 border-white text-white w-7 h-7 rounded-full flex items-center justify-center z-50 hover:bg-blue-600 transition-colors shadow-md"
        >
          <span className="text-xs">☰</span>
        </button>

        <div>
          {/* Logo Section */}
          <div className={`flex items-center border-b border-white/10 h-40 justify-center font-[Arial,sans-serif]`}>
            {isOpen ? (
              <div className="flex items-center justify-center w-full p-0 animate-in fade-in zoom-in duration-300">
                <img src="/logo2.png" alt="Logo Ekspedisi" className="w-[90%] h-auto max-h-36 object-contain" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full p-2 animate-in zoom-in duration-300">
                <img src="/logo2.png" alt="Logo Icon" className="w-full h-auto object-contain" />
              </div>
            )}
          </div>

          <nav className="mt-6 flex flex-col space-y-3 px-4">
            <Link href="/dashboard" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard')}`}>
              <span className="text-xl flex-shrink-0">⊞</span> 
              {isOpen && <span className="whitespace-nowrap font-[Arial]">Dashboard</span>}
            </Link>

            <Link href="/dashboard/operational" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/operational')}`}>
              <span className="text-xl flex-shrink-0">🔍</span> 
              {isOpen && <span className="whitespace-nowrap font-[Arial]">Operational</span>}
            </Link>

            <Link href="/dashboard/flight-status" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/flight-status')}`}>
              <span className="text-xl flex-shrink-0">🛫</span> 
              {isOpen && <span className="whitespace-nowrap font-[Arial]">Flight Status</span>}
            </Link>

            <Link href="/dashboard/cargo-logs" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/cargo-logs')}`}>
              <span className="text-xl flex-shrink-0">📋</span> 
              {isOpen && <span className="whitespace-nowrap font-[Arial]">Cargo Logs</span>}
            </Link>
          </nav>
        </div>

        <div className={`p-4 border-t border-white/10 mt-auto flex flex-col ${isOpen ? '' : 'items-center'}`}>
          <div className={`flex items-center mb-4 ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0a2a66] flex-shrink-0 text-lg">👤</div>
            {isOpen && (
              <div className="overflow-hidden font-[Arial]">
                <p className="font-bold whitespace-nowrap text-sm">Jonathan</p>
                <p className="text-[10px] text-gray-300 whitespace-nowrap">Supervisor Operasional</p>
              </div>
            )}
          </div>
          <Link href="/login" className={`flex items-center hover:text-gray-300 transition-colors font-bold ${isOpen ? 'gap-3 px-2' : 'justify-center'} font-[Arial]`}>
            <span className="text-xl flex-shrink-0">🚪</span> 
            {isOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* AREA KONTEN KANAN */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white font-[Arial,sans-serif]">
        
        {/* Header Umum - JUDUL DINAMIS DI SINI */}
        <header className="h-24 border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 bg-white z-10">
            
            {/* JUDUL YANG BERGANTI OTOMATIS SESUAI HALAMAN */}
            <div className="flex flex-col animate-in slide-in-from-left duration-500">
              <h1 className="text-2xl font-black tracking-tighter text-[#0a2a66] leading-none uppercase italic">
                {getPageTitle()}
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">
                Role: Operator
              </p>
            </div>

            {/* SISI KANAN: INFO TANGGAL & LOGOUT */}
            <div className="flex items-center">
              <div className="text-right mr-6">
                <p className="font-black text-sm text-gray-800 leading-none">Sunday, 5 April 2026 | 17:30 WIB</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">SOEDIRMAN AIRPORT (CGK)</p>
              </div>
              <Link href="/login" className="border-2 border-gray-100 rounded-xl px-4 py-2 text-xs font-black flex items-center gap-2 hover:bg-gray-50 transition-all uppercase text-gray-700">
                Log Out <span className="text-red-500">🚪</span>
              </Link>
            </div>
        </header>

        {/* Konten Spesifik Halaman */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50/30">
          {children}
        </div>
        
      </main>
    </div>
  );
}