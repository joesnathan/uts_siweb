"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");   // Bisa pakai email atau username
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // State untuk 3 token dan lockout
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Cek localStorage setelah mount untuk memulihkan state percobaan dan penguncian
  useEffect(() => {
    const storedAttempts = localStorage.getItem("login_attempts_remaining");
    const storedLockout = localStorage.getItem("login_lockout_until");

    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout, 10);
      if (lockoutTime > Date.now()) {
        const timeLeft = Math.ceil((lockoutTime - Date.now()) / 1000);
        setIsLocked(true);
        setSecondsLeft(timeLeft);
        setAttemptsRemaining(0);
      } else {
        localStorage.removeItem("login_lockout_until");
        localStorage.setItem("login_attempts_remaining", "3");
        setAttemptsRemaining(3);
      }
    } else if (storedAttempts !== null) {
      setAttemptsRemaining(parseInt(storedAttempts, 10));
    }
  }, []);

  // Timer hitung mundur untuk lockout
  useEffect(() => {
    if (!isLocked || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          setAttemptsRemaining(3);
          localStorage.removeItem("login_lockout_until");
          localStorage.setItem("login_attempts_remaining", "3");
          setErrorMsg("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, secondsLeft]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      return;
    }

    setErrorMsg("");
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username / Email dan Password wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: username,        // Kirim sebagai email (bisa pakai username juga)
          password 
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Reset attempts on successful login
        localStorage.removeItem("login_attempts_remaining");
        localStorage.removeItem("login_lockout_until");
        // Simpan data user ke localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("needsPreloader", "true");
        router.push("/dashboard");
      } else {
        const nextAttempts = attemptsRemaining - 1;
        setAttemptsRemaining(nextAttempts);
        localStorage.setItem("login_attempts_remaining", nextAttempts.toString());

        // Reset usn dan pw otomatis langsung jika salah memasukkan
        setUsername("");
        setPassword("");

        if (nextAttempts <= 0) {
          const lockoutTime = Date.now() + 30000; // 30 detik
          localStorage.setItem("login_lockout_until", lockoutTime.toString());
          setIsLocked(true);
          setSecondsLeft(30);
          setErrorMsg(""); // Error ditangani oleh UI lockout
        } else {
          setErrorMsg(data.error || "Username atau Password salah!");
        }
      }
    } catch (err) {
      setErrorMsg("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ORIGINAL SYSTEM LOGIN INTERFACE (Preloader removed for instant load) =================
  return (
    <div className="min-h-screen bg-[#0f284f] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background decoration matching the dashboard theme */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <style jsx global>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>
      
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 md:p-8 relative z-10 transition-all duration-700 animate-in zoom-in duration-500">
        
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
          
          {/* Pesan Error / Lockout */}
          {isLocked ? (
            <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded-2xl border border-red-100 font-bold text-center animate-pulse flex flex-col items-center justify-center gap-1 shadow-inner shadow-red-50/50">
              <svg className="w-5 h-5 text-red-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="uppercase text-[9px] tracking-wider font-extrabold text-red-500">Percobaan Terlampaui</span>
              <span>Silakan tunggu <span className="text-red-700 font-black text-sm px-1.5 py-0.5 bg-red-100 rounded-md inline-block min-w-[24px]">{secondsLeft}</span> detik.</span>
            </div>
          ) : errorMsg ? (
            <div className="bg-red-50 text-red-600 text-[10px] p-2.5 rounded-xl border border-red-100 font-bold animate-shake text-center flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 ml-1">Username / Email</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              disabled={isLocked || loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isLocked || loading}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all pr-12 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
              <input type="checkbox" disabled={isLocked} className="w-3.5 h-3.5 rounded border-gray-300 text-blue-900 focus:ring-0 disabled:opacity-50" />
              <span className="text-[11px] font-bold text-gray-500">Remember me</span>
            </label>
            <Link href="/lupa_pw" className="text-[11px] font-black text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Teks Percobaan Tersisa */}
          <div className="text-center py-2 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[11px] font-bold text-gray-500">
              Sisa Percobaan Login:{" "}
              <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                isLocked 
                  ? 'bg-red-100 text-red-600' 
                  : attemptsRemaining === 1 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'bg-blue-50 text-blue-600'
              }`}>
                {isLocked ? 0 : attemptsRemaining} / 3
              </span>
            </p>
          </div>

          <button 
            type="submit"
            disabled={loading || isLocked}
            className="w-full bg-[#0a2a66] hover:bg-[#071f4b] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center transform hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {loading ? "SIGNING IN..." : isLocked ? "LOCKED OUT" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-[11px] text-center border-t border-gray-50 pt-4">
          <span className="text-gray-400 font-bold">Forgot Account? </span>
          <Link href="/lupa_pw" className="text-blue-600 font-black hover:underline">
            Contact IT
          </Link>
        </div>

      </div>
    </div>
  );
}