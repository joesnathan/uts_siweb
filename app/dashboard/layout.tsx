// app/dashboard/layout.tsx
"use client"; // Wajib ada karena kita pakai useState untuk interaksi klik

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react'; // Import useState untuk mengatur buka/tutup sidebar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // State untuk menyimpan status sidebar (true = kebuka, false = ketutup)
  const [isOpen, setIsOpen] = useState(true); 

  // Fungsi untuk mengecek menu mana yang sedang aktif
  const isActive = (path: string) => pathname.includes(path) ? "bg-[#0b3b82] border-l-4 border-white font-bold" : "hover:bg-[#0b3b82]/50";

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      {/* transition-all duration-300 bikin efek buka tutupnya mulus/smooth */}
      <aside className={`relative bg-[#0a2a66] text-white flex flex-col justify-between h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
        
        {/* TOMBOL GARIS TIGA (TOGGLE) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-24 bg-[#0a2a66] border-2 border-white text-white w-7 h-7 rounded-full flex items-center justify-center z-50 hover:bg-blue-600 transition-colors shadow-md"
        >
          <span className="text-xs">☰</span>
        </button>

        <div>
          {/* Logo */}
          <div className={`p-6 flex items-center border-b border-white/10 h-24 ${isOpen ? 'justify-between' : 'justify-center'}`}>
            {isOpen ? (
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold tracking-wider leading-tight whitespace-nowrap">EKSPEDISI<br/>TERBANGINAJA</h1>
                <p className="text-[10px] text-gray-300 whitespace-nowrap">(Tracking System)</p>
              </div>
            ) : null}
            <span className={`text-3xl transform -rotate-45 flex-shrink-0 ${isOpen ? '' : 'text-2xl'}`}>✈️</span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col space-y-3 px-4">
            {/* Menu Dashboard */}
            <Link href="/dashboard" title="Dashboard" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${isActive('/dashboard') && !pathname.includes('operational') && !pathname.includes('flight_status') && !pathname.includes('cargo_logs') ? 'bg-[#0b3b82] border-white font-bold' : 'hover:bg-[#0b3b82]/50'}`}>
              <span className="text-xl flex-shrink-0">⊞</span> 
              {isOpen && <span className="whitespace-nowrap">Dashboard</span>}
            </Link>

            {/* Menu Operational */}
            <Link href="/dashboard/operational" title="Operational" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${isActive('operational')}`}>
              <span className="text-xl flex-shrink-0">🔍</span> 
              {isOpen && <span className="whitespace-nowrap">Operational</span>}
            </Link>

            {/* Menu Flight Status */}
            <Link href="/dashboard/flight-status" title="Flight Status" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${isActive('flight_status')}`}>
              <span className="text-xl flex-shrink-0">🛫</span> 
              {isOpen && <span className="whitespace-nowrap">Flight Status</span>}
            </Link>

            {/* Menu Cargo Logs */}
            <Link href="/dashboard/cargo-logs" title="Cargo Logs" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${isActive('cargo_logs')}`}>
              <span className="text-xl flex-shrink-0">📋</span> 
              {isOpen && <span className="whitespace-nowrap">Cargo Logs</span>}
            </Link>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className={`p-4 border-t border-white/10 mt-auto flex flex-col ${isOpen ? '' : 'items-center'}`}>
          <div className={`flex items-center mb-4 ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0a2a66] flex-shrink-0 text-lg">👤</div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="font-bold whitespace-nowrap text-sm">Jonathan</p>
                <p className="text-[10px] text-gray-300 whitespace-nowrap">Supervisor Operasional</p>
              </div>
            )}
          </div>
          <Link href="/login" title="Logout" className={`flex items-center hover:text-gray-300 transition-colors font-bold ${isOpen ? 'gap-3 px-2' : 'justify-center'}`}>
            <span className="text-xl flex-shrink-0">🚪</span> 
            {isOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* AREA KONTEN KANAN */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        
        {/* Header Umum */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-end px-8 flex-shrink-0 bg-white z-10">
           <div className="text-right mr-6">
              <p className="font-bold text-sm">Sunday, 5 April 2026 | 17:30 WIB</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">SOEDIRMAN AIRPORT (CGK)</p>
           </div>
           <Link href="/login" className="border border-gray-300 rounded px-3 py-1.5 text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
             Log Out <span>🚪</span>
           </Link>
        </header>

        {/* Konten Spesifik Halaman */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
        
      </main>

    </div>
  );
}