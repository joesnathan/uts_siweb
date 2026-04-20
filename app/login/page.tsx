"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Untuk pindah halaman via code

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Fungsi untuk menangani login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    setErrorMsg("");

    // Validasi Sederhana
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username dan Password wajib diisi!");
      return;
    }

    // Simulasi Login (Bisa diganti dengan logic backend nanti)
    if (username === "admin" && password === "admin123") {
      router.push("/dashboard"); // Jika benar, pindah ke dashboard
    } else {
      setErrorMsg("Username atau Password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f284f] flex items-center justify-center p-4 font-sans">
      <style jsx global>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>
      
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 md:p-8 relative">
        
        {/* Tombol Back */}
        <Link 
          href="/" 
          className="absolute top-5 left-5 text-gray-400 hover:text-[#1E3A8A] transition-colors flex items-center gap-1 text-xs border border-gray-100 px-2 py-1 rounded-md"
        >
          <span>←</span> Back
        </Link>

        {/* Header Logo */}
        <div className="flex flex-col items-center mt-8 mb-6">
          <div className="w-full flex justify-center">
            <img 
              src="/logo pas login.png" 
              alt="Logo Ekspedisi Terbangin Aja" 
              className="w-[240px] md:w-[260px] h-auto object-contain drop-shadow-sm" 
            />
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight mt-4 uppercase">Login</h2>
        </div>

        {/* Form Login */}
        <form className="space-y-4" onSubmit={handleLogin}>
          
          {/* Pesan Error */}
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-[10px] p-2 rounded-lg border border-red-100 font-bold animate-shake text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 ml-1">Username / Email</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all pr-12"
              />
              
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-900 focus:ring-0" />
              <span className="text-[11px] font-medium text-gray-500">Remember me</span>
            </label>
            <Link href="/lupa_pw" className="text-[11px] font-bold text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Tombol Berubah Jadi Button Submit */}
          <button 
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center transform hover:scale-[1.01] active:scale-95"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-[11px] text-center border-t border-gray-50 pt-4">
          <span className="text-gray-400 font-medium">Forgot Account? </span>
          <Link href="/lupa_pw" className="text-blue-600 font-bold hover:underline">
            Contact IT
          </Link>
        </div>

      </div>
    </div>
  );
}