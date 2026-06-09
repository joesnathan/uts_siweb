"use client"; 

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); 
  const [timeString, setTimeString] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<string>("light");

  // OPERASIONAL: Menyelaraskan tema visual antarmuka (light/dark mode) yang dipilih pengguna saat halaman dimuat.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error("Logout error:", err);
    }
    router.push('/login');
  };

  // OPERASIONAL: Sistem proteksi rute di sisi klien. Memeriksa keberadaan data sesi pengguna di localStorage. Jika kosong, akses ditolak dan dialihkan ke login.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Gagal parse data user:", err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
      // OPERASIONAL: Mengalihkan pengguna tidak dikenal ke halaman masuk (login) secara otomatis dalam waktu 2.5 detik.
      const redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 2500);
      return () => clearTimeout(redirectTimer);
    }
  }, [router]);

  // OPERASIONAL: Menampilkan dan memperbarui jam sistem operasional bandara secara real-time setiap detik.
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const dayName = days[date.getDay()];
      const day = date.getDate();
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      
      let tzString = "";
      try {
        const parts = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(date);
        const tzPart = parts.find((p) => p.type === "timeZoneName");
        tzString = tzPart ? tzPart.value : "";
      } catch (err) {
        console.error(err);
      }

      setTimeString(`${dayName}, ${day} ${monthName} ${year} | ${hours}:${minutes} ${tzString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // OPERASIONAL: Mengubah judul halaman di header bagian atas secara dinamis berdasarkan rute URL aktif.
  const getPageTitle = () => {
    if (pathname === "/dashboard") {
      return `Welcome, ${user ? user.full_name : "Jonathan"}`;
    }
    if (pathname === "/dashboard/operational") return "Operational";
    if (pathname === "/dashboard/flight-status") return "Flight Status";
    if (pathname === "/dashboard/tracking-awb") return "Tracking AWB";
    return "Dashboard";
  };

  const getActiveClass = (path: string) => 
    pathname === path 
      ? "bg-[#0b3b82] border-white font-bold" 
      : "hover:bg-[#0b3b82]/50";

  if (isAuthenticated === null) {
    // OPERASIONAL: Mencegah efek berkedip (flashing) pada tata letak halaman ketika sistem sedang memverifikasi token sesi pengguna.
    return null;
  }

  if (isAuthenticated === false) {
    return (
      <div className="fixed inset-0 z-[99999] bg-slate-50 flex items-center justify-center p-6 font-sans">
        
        {/* Clean Corporate Card */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-10 max-w-md w-full text-center space-y-6 animate-in zoom-in duration-500">
          
          {/* Simple Professional Lock Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0a2a66]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full">
              Autentikasi Diperlukan
            </span>
            <h1 className="text-xl font-black text-[#0a2a66] uppercase italic tracking-tight mt-4">
              Silakan Login Terlebih Dahulu
            </h1>
            <p className="text-xs text-gray-400 font-bold leading-relaxed px-2 uppercase">
              Untuk mengakses halaman operasional kargo, radar penerbangan, dan logistik, silakan masuk ke akun Anda terlebih dahulu.
            </p>
          </div>

          {/* CTA & redirection message */}
          <div className="space-y-4 pt-2">
            <Link
              href="/login"
              className="block w-full bg-[#0a2a66] hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md active:scale-95 uppercase tracking-wider"
            >
              Masuk ke Halaman Login
            </Link>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest animate-pulse font-mono">
              Mengarahkan otomatis dalam 2.5 detik...
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-[#090d16] font-sans overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      
      {/* OPERASIONAL: Komponen navigasi utama (sidebar) untuk berpindah rute di panel dasbor admin kargo. */}
      <aside className={`relative bg-[#0a2a66] text-white flex flex-col justify-between h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-24 bg-[#0a2a66] border-2 border-white text-white w-7 h-7 rounded-full flex items-center justify-center z-50 hover:bg-blue-600 transition-colors shadow-md"
        >
          <span className="text-xs">☰</span>
        </button>

        <div>
          {/* OPERASIONAL: Bagian logo maskapai penerbangan kargo. */}
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
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">Dashboard</span>}
            </Link>

            <Link href="/dashboard/operational" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/operational')}`}>
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">Operational</span>}
            </Link>

            <Link href="/dashboard/flight-status" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/flight-status')}`}>
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5M21 12l-5-2-4-5H9l2 5-5 1-2-2H2l1 3 3 1 12 3 5-3z" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">Flight Status</span>}
            </Link>

            <Link href="/dashboard/tracking-awb" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/tracking-awb')}`}>
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">Tracking AWB</span>}
            </Link>


          </nav>
        </div>

        <div className={`p-4 border-t border-white/10 mt-auto flex flex-col ${isOpen ? '' : 'items-center'}`}>
          <div className={`flex items-center mb-4 ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {isOpen && (
              <div className="overflow-hidden font-[Arial]">
                <p className="font-bold whitespace-nowrap text-sm text-white">
                  {user ? user.full_name : "Jonathan"}
                </p>
                <p className="text-[10px] text-gray-300 whitespace-nowrap">
                  {user ? user.department : "Supervisor Operasional"}
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center hover:text-gray-300 transition-colors font-bold ${isOpen ? 'gap-3 px-2' : 'justify-center'} font-[Arial] text-white bg-transparent border-none outline-none cursor-pointer`}
          >
            <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
            </svg>
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* OPERASIONAL: Area konten utama di sisi kanan dasbor. */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white font-[Arial,sans-serif]">
        
        {/* OPERASIONAL: Header atas dasbor untuk menampilkan nama rute aktif, jam kerja, dan kontrol profil. */}
        <header className="h-24 border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 bg-white z-10">
            
            {/* OPERASIONAL: Teks judul halaman dinamis yang berubah sesuai dengan navigasi yang dipilih. */}
            <div className="flex flex-col animate-in slide-in-from-left duration-500">
              <h1 className="text-2xl font-black tracking-tighter text-[#0a2a66] leading-none uppercase italic">
                {getPageTitle()}
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">
                Role: {user ? user.department : "Operator"}
              </p>
            </div>

            {/* SISI KANAN: INFO TANGGAL & LOGOUT */}
            <div className="flex items-center">
              {/* THEME TOGGLE BUTTON */}
              <button
                onClick={toggleTheme}
                className="mr-6 text-xl hover:scale-110 active:scale-95 transition-all duration-200 bg-transparent border-none p-0 focus:outline-none select-none cursor-pointer flex items-center justify-center"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>

              <div className="text-right mr-6">
                <p className="font-black text-sm text-gray-800 dark:text-slate-200 leading-none">
                  {timeString || "Sunday, 5 April 2026 | 17:30 WIB"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">SOEDIRMAN AIRPORT (CGK)</p>
              </div>
              <button 
                onClick={handleLogout}
                className="border-2 border-gray-100 rounded-xl px-4 py-2 text-xs font-black flex items-center gap-2 hover:bg-gray-50 bg-white transition-all uppercase text-gray-700 cursor-pointer"
              >
                Log Out 
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
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