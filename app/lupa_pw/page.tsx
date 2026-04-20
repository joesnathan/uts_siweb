"use client"; // WAJIB ADA agar tidak error "Event handlers" lagi

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSent(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f8fb] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden border border-gray-100 min-h-[600px]">
        
        {/* SISI KIRI: Quick Reset via Email */}
        <div className="p-8 md:p-14 border-r border-gray-100 flex flex-col justify-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#0f284f] mb-12 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>

          {!isEmailSent ? (
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <h1 className="text-3xl font-black text-[#0f284f] mb-3 tracking-tight">Forgot Password?</h1>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Enter your registered operator email and we'll send a link to reset your password automatically.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 ml-1">
                    Registered Work Email
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="operator@terbanginaja.co.id"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0f284f] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-black transition-all"
                >
                  Send Reset Link
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-10 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-[#0f284f] mb-3">Email Sent!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Please check your inbox for password reset instructions.
              </p>
              <button onClick={() => setIsEmailSent(false)} className="text-sm font-bold text-blue-600 hover:underline">
                Didn't receive it? Try again
              </button>
            </div>
          )}
        </div>

        {/* SISI KANAN: Account Recovery Input Table Form */}
        <div className="bg-[#0f284f] p-8 md:p-14 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            {!isFormSubmitted ? (
              <>
                <h2 className="text-2xl font-black mb-4 tracking-tight">Manual Account Recovery</h2>
                <p className="text-blue-100/60 text-sm mb-8 leading-relaxed">
                  No access to your email? Fill out this verification table. Our IT Administrator will review your identity manually.
                </p>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <table className="w-full border-collapse border border-white/10 rounded-xl overflow-hidden">
                    <tbody>
                      <tr className="border-b border-white/10 bg-white/5">
                        <td className="p-4 text-[10px] uppercase font-black text-blue-300 w-1/3">Full Name</td>
                        <td className="p-2">
                          <input type="text" required placeholder="Input name..." className="w-full bg-transparent border-none outline-none text-sm px-2 placeholder:text-white/20" />
                        </td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="p-4 text-[10px] uppercase font-black text-blue-300">Operator ID</td>
                        <td className="p-2">
                          <input type="text" required placeholder="Input ID..." className="w-full bg-transparent border-none outline-none text-sm px-2 placeholder:text-white/20" />
                        </td>
                      </tr>
                      <tr className="border-b border-white/10 bg-white/5">
                        <td className="p-4 text-[10px] uppercase font-black text-blue-300">Department</td>
                        <td className="p-2">
                          <select className="w-full bg-[#1a3a6a] border-none outline-none text-sm px-2 py-1 rounded cursor-pointer">
                            <option>Air Freight Support</option>
                            <option>Cargo Manifest Admin</option>
                            <option>Ground Ops Team</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="border-white/10">
                        <td className="p-4 text-[10px] uppercase font-black text-blue-300 align-top">Issue Detail</td>
                        <td className="p-2">
                          <textarea rows={2} required placeholder="Why do you need recovery?" className="w-full bg-transparent border-none outline-none text-sm px-2 placeholder:text-white/20 resize-none"></textarea>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <button 
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-2xl shadow-xl transition-all mt-4 flex items-center justify-center gap-2 group"
                  >
                    Submit Verification
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-400/30">
                  <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black mb-3">In Review</h2>
                <p className="text-blue-100/60 text-sm leading-relaxed mb-8">
                  Your verification data has been submitted. IT Administrator will contact you within 24 hours.
                </p>
                <button onClick={() => setIsFormSubmitted(false)} className="text-sm font-bold text-blue-300 hover:text-white transition-colors">
                  Edit Submission?
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}