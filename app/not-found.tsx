"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden text-gray-800">
      
      {/* SIDEBAR (Identical to Terbanginaja Dashboard sidebar but static/simplified for 404 context) */}
      <aside className="relative bg-[#0a2a66] text-white flex flex-col justify-between h-full w-64 flex-shrink-0">
        <div>
          {/* Logo Section */}
          <div className="flex items-center border-b border-white/10 h-40 justify-center">
            <div className="flex items-center justify-center w-full p-4">
              <img src="/logo2.png" alt="Logo Ekspedisi" className="w-[90%] h-auto max-h-36 object-contain" />
            </div>
          </div>

          <nav className="mt-6 flex flex-col space-y-3 px-4">
            <Link href="/dashboard" className="py-3 rounded-full border border-white/30 flex items-center px-4 gap-3 hover:bg-[#0b3b82]/50 transition-colors">
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="font-bold">Dashboard</span>
            </Link>

            <Link href="/dashboard/operational" className="py-3 rounded-full border border-white/30 flex items-center px-4 gap-3 hover:bg-[#0b3b82]/50 transition-colors">
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-bold">Operational</span>
            </Link>

            <Link href="/dashboard/flight-status" className="py-3 rounded-full border border-white/30 flex items-center px-4 gap-3 hover:bg-[#0b3b82]/50 transition-colors">
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5M21 12l-5-2-4-5H9l2 5-5 1-2-2H2l1 3 3 1 12 3 5-3z" />
              </svg>
              <span className="font-bold">Flight Status</span>
            </Link>

          </nav>
        </div>

        <div className="p-4 border-t border-white/10 mt-auto flex flex-col">
          <Link href="/login" className="flex items-center gap-3 px-2 font-bold text-white hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* 404 CONTENT AREA (Identical layout to Acme 404 screenshot provided by the user) */}
      <main className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-500">
          {/* Unhappy Face Icon */}
          <div className="flex justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>

          {/* Heading and details */}
          <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-none uppercase italic">
            404 Not Found
          </h2>
          <p className="text-sm font-bold text-gray-500">
            Could not find the requested route or resource.
          </p>

          {/* Action button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95"
          >
            Go Back
          </button>
        </div>
      </main>

    </div>
  );
}
