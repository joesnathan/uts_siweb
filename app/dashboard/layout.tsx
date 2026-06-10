"use client"; 

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; 
import { useLanguage } from '../LanguageContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); 
  const [timeString, setTimeString] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<string>("light");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Theme synchronization
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

  // Client-side authentication gate
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
      const redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 2500);
      return () => clearTimeout(redirectTimer);
    }
  }, [router]);

  // Operational clock display
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      
      const locale = language === "id" ? "id-ID" : "en-US";
      
      const dayName = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
      const day = date.getDate();
      const monthName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
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
  }, [language]);

  const getPageTitle = () => {
    if (pathname === "/dashboard") {
      return `${t("db_welcome")} ${user ? user.full_name : "Jonathan"}`;
    }
    if (pathname === "/dashboard/operational") return t("db_operational");
    if (pathname === "/dashboard/flight-status") return t("db_flight_status");
    if (pathname === "/dashboard/tracking-awb") return t("db_tracking_awb");
    if (pathname === "/dashboard/help-desk") return t("db_help_desk");
    return "Dashboard";
  };

  const getActiveClass = (path: string) => 
    pathname === path 
      ? "bg-[#0b3b82] border-white font-bold" 
      : "hover:bg-[#0b3b82]/50";

  if (isAuthenticated === null) {
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
              {t("db_auth_required")}
            </span>
            <h1 className="text-xl font-black text-[#0a2a66] uppercase italic tracking-tight mt-4">
              {t("db_login_first")}
            </h1>
            <p className="text-xs text-gray-400 font-bold leading-relaxed px-2 uppercase">
              {t("db_login_first_desc")}
            </p>
          </div>

          {/* CTA & redirection message */}
          <div className="space-y-4 pt-2">
            <Link
              href="/login"
              className="block w-full bg-[#0a2a66] hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md active:scale-95 uppercase tracking-wider"
            >
              {t("db_login_btn")}
            </Link>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest animate-pulse font-mono">
              {t("db_redirecting")}
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-[#090d16] font-sans overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      
      {/* Sidebar Nav */}
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
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">{t("db_dashboard")}</span>}
            </Link>

            <Link href="/dashboard/operational" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/operational')}`}>
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">{t("db_operational")}</span>}
            </Link>

            <Link href="/dashboard/flight-status" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/flight-status')}`}>
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5M21 12l-5-2-4-5H9l2 5-5 1-2-2H2l1 3 3 1 12 3 5-3z" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">{t("db_flight_status")}</span>}
            </Link>

            <Link href="/dashboard/tracking-awb" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/tracking-awb')}`}>
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">{t("db_tracking_awb")}</span>}
            </Link>

            <Link href="/dashboard/help-desk" className={`py-3 rounded-full border border-white/30 flex items-center transition-colors ${isOpen ? 'px-4 gap-3' : 'justify-center'} ${getActiveClass('/dashboard/help-desk')}`}>
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {isOpen && <span className="whitespace-nowrap font-[Arial] font-bold">{t("db_help_desk")}</span>}
            </Link>
          </nav>
        </div>

        <div className={`p-4 border-t border-white/10 mt-auto flex flex-col ${isOpen ? '' : 'items-center'}`}>
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className={`flex items-center mb-4 cursor-pointer hover:bg-white/10 p-2.5 rounded-2xl transition-all ${isOpen ? 'gap-3 w-full' : 'justify-center w-12 h-12'}`}
            title="View Profile & Settings"
          >
            <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {isOpen && (
              <div className="overflow-hidden font-[Arial] flex-1">
                <p className="font-bold whitespace-nowrap text-sm text-white text-left">
                  {user ? user.full_name : "Jonathan"}
                </p>
                <p className="text-[10px] text-gray-300 whitespace-nowrap text-left">
                  {user ? user.department : t("db_operational")}
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
            {isOpen && <span>{t("db_logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#090d16] font-[Arial,sans-serif]">
        
        {/* Top Header */}
        <header className="h-24 border-b border-gray-200 dark:border-slate-800/80 flex items-center justify-between px-8 flex-shrink-0 bg-white dark:bg-[#111c35]/40 z-10">
            
            <div className="flex flex-col animate-in slide-in-from-left duration-500">
              <h1 className="text-2xl font-black tracking-tighter text-[#0a2a66] dark:text-white leading-none uppercase italic">
                {getPageTitle()}
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] mt-1.5">
                Role: {user ? user.department : "Operator"}
              </p>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-6">
                <p className="font-black text-sm text-gray-800 dark:text-slate-200 leading-none">
                  {timeString || "Sunday, 5 April 2026 | 17:30 WIB"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mt-1">{t("db_airport")}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="border-2 border-gray-100 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-black flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 transition-all uppercase text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                {t("db_logout")}
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-gray-50/30 dark:bg-slate-950/20">
          {children}
        </div>
        
      </main>

      {/* PROFILE SETTINGS MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-[#111c35] border border-gray-150 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-8 max-w-lg w-full relative overflow-hidden animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-black text-[#0a2a66] dark:text-white uppercase italic tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {t("profile_modal_title")}
              </h3>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Personal Data Card */}
            <div className="space-y-6">
              {/* User Avatar Circle and Core Info */}
              <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-3xl border border-gray-100 dark:border-slate-800/80">
                <div className="w-16 h-16 bg-gradient-to-tr from-[#0a2a66] to-blue-600 border border-blue-400/20 rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {user ? user.full_name?.substring(0, 2).toUpperCase() : "JO"}
                </div>
                <div>
                  <h4 className="font-black text-base text-gray-800 dark:text-white leading-snug">
                    {user ? user.full_name : "Jonathan"}
                  </h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {user ? user.department : t("db_operational")}
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold mt-1">
                    {t("profile_operator_id")}: {user ? user.operator_id || "OP-2026-9021" : "OP-2026-9021"}
                  </p>
                </div>
              </div>

              {/* Personal details grid */}
              <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900/20 p-4 rounded-3xl border border-gray-100 dark:border-slate-800/80">
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider text-left">{t("profile_name")}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white mt-0.5 text-left">{user ? user.full_name : "Jonathan"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider text-left">{t("profile_username")}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white mt-0.5 text-left">{user ? user.username : "jonathan"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider text-left">{t("profile_email")}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white mt-0.5 text-left">{user ? user.email : "jonathan@airport.gov"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider text-left">{t("profile_department")}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white mt-0.5 text-left">{user ? user.department : "CEO"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider text-left">{t("profile_operator_id")}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white mt-0.5 font-mono text-left">{user ? user.operator_id || "OP-2026-9021" : "OP-2026-9021"}</p>
                </div>
              </div>

              {/* Settings Section: Language & Theme switchers */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 grid grid-cols-2 gap-4">
                {/* Language Selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block text-left">{t("profile_language")}</label>
                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 shadow-inner">
                    <button 
                      onClick={() => setLanguage('id')}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all select-none cursor-pointer text-center ${language === 'id' ? 'bg-[#0a2a66] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-[#0a2a66] dark:hover:text-white'}`}
                    >
                      ID
                    </button>
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all select-none cursor-pointer text-center ${language === 'en' ? 'bg-[#0a2a66] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-[#0a2a66] dark:hover:text-white'}`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Theme Switcher */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block text-left">{t("profile_theme")}</label>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors rounded-xl text-[10px] font-black text-gray-700 dark:text-gray-300"
                  >
                    <span>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
                    {theme === "light" ? (
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 mt-6 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-6 py-3 bg-[#0a2a66] hover:bg-blue-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                {t("profile_close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}