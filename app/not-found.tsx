"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#0f284f] items-center justify-center p-6 text-gray-800 font-sans relative overflow-hidden">
      
      {/* Background decoration matching login and dashboard theme */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 404 CONTENT CARD */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-8 max-w-sm w-full text-center space-y-6 relative z-10 animate-in zoom-in duration-500">
        
        {/* Unhappy Face Icon */}
        <div className="flex justify-center text-gray-300">
          <svg className="w-16 h-16 text-blue-900/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </div>

        {/* Heading and details */}
        <div className="space-y-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full">
            Error Code 404
          </span>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none uppercase italic pt-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs text-gray-400 font-bold leading-relaxed px-2 mt-2 uppercase">
            Halaman yang Anda tuju tidak tersedia atau Anda belum melakukan login ke dalam sistem.
          </p>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={() => router.push("/login")}
            className="block w-full bg-[#0a2a66] hover:bg-[#071f4b] text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md active:scale-95 uppercase tracking-wider cursor-pointer"
          >
            Masuk / Kembali ke Dashboard
          </button>
        </div>
      </div>

    </div>
  );
}
