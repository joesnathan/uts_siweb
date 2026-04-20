"use client"; 

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Mengambil URL yang sedang aktif

  // Mengecek apakah kita sedang berada di halaman dashboard, login, atau lupa password
  const isHiddenPage = pathname.startsWith('/dashboard') || pathname.startsWith('/login') || pathname.startsWith('/lupa_pw');

  return (
    <html lang="en">
      <body className="bg-gray-50 flex flex-col min-h-screen font-sans">
        
        {/* NAVBAR - Hanya ditampilkan jika BUKAN di halaman hidden (dashboard/login) */}
        {!isHiddenPage && (
          // Tambahan bg-white/90 dan backdrop-blur-md untuk efek kaca transparan yang elegan
          <header className="bg-white/90 backdrop-blur-md shadow-sm z-50 sticky top-0 border-b-2 border-[#1E3A8A] transition-all duration-300">
            <div className="w-full px-8 md:px-16 h-20 flex items-center justify-between">
              
              <nav className="flex space-x-10 text-xl font-extrabold">
                
                {/* About Us */}
                <Link 
                  href="/" 
                  className={`relative group py-1 transition-colors duration-300 ${pathname === '/' ? 'text-black' : 'text-[#1E3A8A] hover:text-black'}`}
                >
                  About Us
                  {/* Efek Garis Bawah Animasi */}
                  <span className={`absolute left-0 -bottom-1 h-[3px] bg-black transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>

                {/* Track Your Cargo */}
                <Link 
                  href="/company_profile/tracking" 
                  className={`relative group py-1 transition-colors duration-300 ${pathname === '/company_profile/tracking' ? 'text-black' : 'text-[#1E3A8A] hover:text-black'}`}
                >
                  Track Your Cargo
                  {/* Efek Garis Bawah Animasi */}
                  <span className={`absolute left-0 -bottom-1 h-[3px] bg-black transition-all duration-300 ${pathname === '/company_profile/tracking' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>

                {/* Privacy Policy */}
                <Link 
                  href="/company_profile/privacy-policy" 
                  className={`relative group py-1 transition-colors duration-300 ${pathname === '/company_profile/privacy-policy' ? 'text-black' : 'text-[#1E3A8A] hover:text-black'}`}
                >
                  Privacy Policy
                  {/* Efek Garis Bawah Animasi */}
                  <span className={`absolute left-0 -bottom-1 h-[3px] bg-black transition-all duration-300 ${pathname === '/company_profile/privacy-policy' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>

                {/* Contact Us! */}
                <Link 
                  href="/company_profile/contact_us" 
                  className={`relative group py-1 transition-colors duration-300 ${pathname === '/company_profile/contact_us' ? 'text-black' : 'text-[#1E3A8A] hover:text-black'}`}
                >
                  Contact Us!
                  {/* Efek Garis Bawah Animasi */}
                  <span className={`absolute left-0 -bottom-1 h-[3px] bg-black transition-all duration-300 ${pathname === '/company_profile/contact_us' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>

              </nav>

              {/* Login Button dengan efek hover terangkat (hover:-translate-y-1) dan glow shadow */}
              <Link 
                href="/login" 
                className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-8 py-2.5 rounded-md font-bold text-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Login
              </Link>
              
            </div>
          </header>
        )}

        {/* KONTEN HALAMAN UTAMA  */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* FOOTER - Hanya ditampilkan jika BUKAN di halaman hidden (dashboard/login) */}
        {!isHiddenPage && (
          <footer className="bg-[#f2f2f2] text-blue-800/80 py-4 px-8 md:px-16 text-left text-sm font-semibold border-t border-gray-300">
            © 2026 TERBANGIN AJA CARGO JAKARTA
          </footer>
        )}

      </body>
    </html>
  );
}