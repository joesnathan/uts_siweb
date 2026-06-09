"use client"; 

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useEffect } from 'react';

import { LanguageProvider, useLanguage } from './LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Mengambil URL yang sedang aktif

  // Centralized Page Title Manager based on active pathname
  useEffect(() => {
    const titleMap: Record<string, string> = {
      "/": "About Us | Terbanginaja Cargo",
      "/login": "Operator Sign In | Terbanginaja Logistics",
      "/company_profile/tracking": "Track Your Cargo | Terbanginaja Cargo",
      "/company_profile/privacy-policy": "Privacy Policy | Terbanginaja Cargo",
      "/company_profile/contact_us": "Contact Us | Terbanginaja Cargo",
      "/dashboard": "Executive Dashboard | Terbanginaja Logistics",
      "/dashboard/operational": "Operational Cargo Management | Terbanginaja Logistics",
      "/dashboard/flight-status": "Live Airspace Cargo Radar | Terbanginaja Logistics",
    };
    
    document.title = titleMap[pathname] || "Terbanginaja Logistics";
  }, [pathname]);

  // Menentukan apakah halaman saat ini adalah halaman profil publik yang valid
  const isValidPublicPage = 
    pathname === '/' || 
    pathname === '/company_profile/tracking' || 
    pathname === '/company_profile/privacy-policy' || 
    pathname === '/company_profile/contact_us';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Sistem Informasi Manajemen Kargo Udara Terintegrasi Cloud Neon & Terbanginaja Logistics" />
        <meta name="author" content="Terbanginaja Team" />
        <meta name="theme-color" content="#0a2a66" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-50 flex flex-col min-h-screen font-sans">
        <LanguageProvider>
          {/* NAVBAR - Hanya ditampilkan jika berada di halaman public profile yang valid */}
          {isValidPublicPage && (
            <PublicHeader pathname={pathname} />
          )}

          {/* KONTEN HALAMAN UTAMA  */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>

          {/* FOOTER - Hanya ditampilkan jika berada di halaman public profile yang valid */}
          {isValidPublicPage && (
            <PublicFooter />
          )}
        </LanguageProvider>
      </body>
    </html>
  );
}

function PublicHeader({ pathname }: { pathname: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm z-50 sticky top-0 border-b-2 border-[#1E3A8A] transition-all duration-300">
      <div className="w-full px-8 md:px-16 h-20 flex items-center justify-between">
        
        <nav className="flex space-x-10 text-xl font-extrabold">
          
          {/* About Us */}
          <Link 
            href="/" 
            className={`relative group py-1 transition-colors duration-300 ${pathname === '/' ? 'text-black' : 'text-[#1E3A8A] hover:text-black'}`}
          >
            {t("nav_about_us")}
            {/* Efek Garis Bawah Animasi */}
            <span className={`absolute left-0 -bottom-1 h-[3px] bg-black transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

          {/* Track Your Cargo */}
          <Link 
            href="/company_profile/tracking" 
            className={`relative group py-1 transition-colors duration-300 ${pathname === '/company_profile/tracking' ? 'text-black' : 'text-[#1E3A8A] hover:text-black'}`}
          >
            {t("nav_track_cargo")}
            {/* Efek Garis Bawah Animasi */}
            <span className={`absolute left-0 -bottom-1 h-[3px] bg-black transition-all duration-300 ${pathname === '/company_profile/tracking' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

          {/* Privacy Policy */}
          <Link 
            href="/company_profile/privacy-policy" 
            className={`relative group py-1 transition-colors duration-300 ${pathname === '/company_profile/privacy-policy' ? 'text-black' : 'text-[#1E3A8A] hover:text-black'}`}
          >
            {t("nav_privacy_policy")}
            {/* Efek Garis Bawah Animasi */}
            <span className={`absolute left-0 -bottom-1 h-[3px] bg-black transition-all duration-300 ${pathname === '/company_profile/privacy-policy' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

          {/* Contact Us! */}
          <Link 
            href="/company_profile/contact_us" 
            className={`relative group py-1 transition-colors duration-300 ${pathname === '/company_profile/contact_us' ? 'text-black' : 'text-[#1E3A8A] hover:text-black'}`}
          >
            {t("nav_contact_us")}
            {/* Efek Garis Bawah Animasi */}
            <span className={`absolute left-0 -bottom-1 h-[3px] bg-black transition-all duration-300 ${pathname === '/company_profile/contact_us' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

        </nav>

        {/* Right buttons: Language Switcher and Login */}
        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-gray-200 shadow-inner">
            <button 
              onClick={() => setLanguage('id')}
              className={`px-3 py-1 text-xs font-black rounded-md transition-all select-none cursor-pointer ${language === 'id' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-slate-500 hover:text-[#1E3A8A]'}`}
            >
              ID
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-black rounded-md transition-all select-none cursor-pointer ${language === 'en' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-slate-500 hover:text-[#1E3A8A]'}`}
            >
              EN
            </button>
          </div>

          {/* Login Button dengan efek hover terangkat (hover:-translate-y-1) dan glow shadow */}
          <Link 
            href="/login" 
            className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-8 py-2.5 rounded-md font-bold text-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {t("nav_login")}
          </Link>
        </div>
        
      </div>
    </header>
  );
}

function PublicFooter() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#f2f2f2] text-blue-800/80 py-4 px-8 md:px-16 text-left text-sm font-semibold border-t border-gray-300">
      {t("footer_text")}
    </footer>
  );
}