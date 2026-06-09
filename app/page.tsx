"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full font-sans bg-slate-50/50 animate-in fade-in duration-700">
      
      {/* HERO / ABOUT US SECTION - STYLED FLOATING GLASS CONSOLE */}
      <section className="text-white px-8 lg:px-20 relative overflow-hidden min-h-[95vh] flex flex-col justify-center py-20" style={{ perspective: '1000px' }}>
        
        <style>{`
          .video-background iframe {
            pointer-events: none !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            touch-action: none !important;
          }
        `}</style>

        {/* Latar Belakang Video YouTube dengan tameng pengaman pointer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-black video-background" style={{ transform: 'translate3d(0, 0, 0)' }}>
          <iframe
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-85"
            src="https://www.youtube.com/embed/utWVqpZ-8XI?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=utWVqpZ-8XI&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&autohide=1&showinfo=0"
            allow="autoplay; encrypted-media"
            frameBorder="0"
            tabIndex={-1}
          ></iframe>
          <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto touch-none"></div>
        </div>

        {/* Overlay Biru Gelap gradasi radial untuk kesan kedalaman premium */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f284f]/90 via-[#07152c]/90 to-[#030814]/95 z-10 touch-none pointer-events-auto" style={{ transform: 'translate3d(0, 0, 1px)' }}></div> 

        {/* FLOATING GLASSMORPHIC BOARD */}
        <div className="relative z-20 w-full max-w-6xl mx-auto bg-slate-950/45 backdrop-blur-lg border border-white/10 rounded-[3rem] p-8 md:p-14 shadow-2xl transition-all duration-500 hover:border-blue-500/25" style={{ transform: 'translate3d(0, 0, 2px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Teks Sebelah Kiri */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 bg-blue-500/10 border border-blue-500/25 px-4 py-1.5 rounded-full backdrop-blur-md">
                {t("company_badge")}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic">
                {t("about_title_pre")} <span className="text-blue-500">{t("about_title_post")}</span>
              </h1>
              
              <p className="text-sm md:text-base leading-relaxed text-gray-300 text-justify">
                {t("about_desc")}
              </p>
            </div>

            {/* Logo/Gambar Sebelah Kanan */}
            <div className="lg:col-span-5 flex justify-center">
              <img 
                src="/logo.png" 
                alt="Logo Terbangin Aja" 
                className="w-64 md:w-80 lg:w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" 
              />
            </div>

          </div>

          <hr className="border-white/5 my-10" />

          {/* Visi Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-blue-400">{t("vision_title")}</h2>
              <p className="text-sm leading-relaxed text-gray-300 text-justify">
                {t("vision_desc")}
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-blue-400">{t("mission_title")}</h2>
              <ul className="text-sm text-gray-300 space-y-3.5">
                
                <li className="flex gap-3 text-justify">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>{t("mission_item1_title")}</strong>: {t("mission_item1_desc")}</span>
                </li>

                <li className="flex gap-3 text-justify">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>{t("mission_item2_title")}</strong>: {t("mission_item2_desc")}</span>
                </li>

                <li className="flex gap-3 text-justify">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>{t("mission_item3_title")}</strong>: {t("mission_item3_desc")}</span>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES SECTION */}
      <section className="py-28 px-8 lg:px-20 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/35 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full shadow-sm">
              {t("services_badge")}
            </span>
            <h2 className="text-4xl font-black text-[#0a2a66] uppercase tracking-tight italic bg-gradient-to-r from-[#0a2a66] to-blue-900 bg-clip-text text-transparent">
              {t("services_title")}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card Core Service 1 */}
            <div className="group bg-white rounded-3xl border border-slate-100/80 shadow-lg shadow-slate-100/50 p-5 hover:shadow-[0_20px_40px_rgba(10,42,102,0.06)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-52 rounded-2xl mb-6 shadow-inner overflow-hidden relative">
                <img src="/gambar 1.jpeg" alt="Priority Air Freight" className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
              </div>
              <div className="px-1.5 pb-2">
                <h3 className="font-black text-xl text-[#0a2a66] uppercase italic tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                  {t("service1_title")}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1.5">{t("service1_desc")}</p>
              </div>
            </div>
            
            {/* Card Core Service 2 */}
            <div className="group bg-white rounded-3xl border border-slate-100/80 shadow-lg shadow-slate-100/50 p-5 hover:shadow-[0_20px_40px_rgba(10,42,102,0.06)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-52 rounded-2xl mb-6 shadow-inner overflow-hidden relative">
                <img src="/gambar 2.jpeg" alt="Perishable Goods Handling" className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
              </div>
              <div className="px-1.5 pb-2">
                <h3 className="font-black text-xl text-[#0a2a66] uppercase italic tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                  {t("service2_title")}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1.5">{t("service2_desc")}</p>
              </div>
            </div>
            
            {/* Card Core Service 3 */}
            <div className="group bg-white rounded-3xl border border-slate-100/80 shadow-lg shadow-slate-100/50 p-5 hover:shadow-[0_20px_40px_rgba(10,42,102,0.06)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-52 rounded-2xl mb-6 shadow-inner overflow-hidden relative">
                <img src="/gambar 3.jpeg" alt="Integrated Tracking" className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
              </div>
              <div className="px-1.5 pb-2">
                <h3 className="font-black text-xl text-[#0a2a66] uppercase italic tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                  {t("service3_title")}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1.5">{t("service3_desc")}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION - UPGRADED TO MODERN GRAPHICAL CARDS */}
      <section className="py-28 px-8 lg:px-20 bg-gradient-to-b from-slate-950 via-slate-900 to-[#070e1e] text-white relative overflow-hidden">
        
        {/* Subtle decorative circles */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 border border-blue-500/25 px-4 py-1.5 rounded-full shadow-sm">
              {t("why_badge")}
            </span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight italic bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {t("why_title")}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl space-y-5 hover:border-blue-500/20 hover:scale-[1.02] transition-all duration-500 shadow-2xl">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-black uppercase italic tracking-tight text-white">{t("why_item1_title")}</h4>
              <p className="text-xs leading-relaxed text-slate-400">
                {t("why_item1_desc")}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl space-y-5 hover:border-blue-500/20 hover:scale-[1.02] transition-all duration-500 shadow-2xl">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h4 className="text-lg font-black uppercase italic tracking-tight text-white">{t("why_item2_title")}</h4>
              <p className="text-xs leading-relaxed text-slate-400">
                {t("why_item2_desc")}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl space-y-5 hover:border-blue-500/20 hover:scale-[1.02] transition-all duration-500 shadow-2xl">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h4 className="text-lg font-black uppercase italic tracking-tight text-white">{t("why_item3_title")}</h4>
              <p className="text-xs leading-relaxed text-slate-400">
                {t("why_item3_desc")}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* INFO CONTACT BOXES - METALLIC BLUE DESIGNS */}
      <section className="py-24 px-8 lg:px-20 bg-slate-50/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-center">
          
          {/* Box 1: Headquarters */}
          <Link href="/company_profile/contact_us" className="flex-1">
            <div className="h-full bg-gradient-to-br from-[#0f284f] to-[#071f4b] hover:from-[#112d59] hover:to-[#082457] text-white p-8 rounded-3xl shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer border border-transparent hover:border-blue-400/25 group">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-2xl font-black uppercase italic tracking-tighter text-blue-400 group-hover:text-white transition-colors duration-300">
                  {t("contact_hq_title")}
                </h4>
                <div className="bg-blue-500/10 p-2 rounded-xl">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 font-medium whitespace-pre-line">
                {t("contact_hq_desc")}
              </p>
            </div>
          </Link>

          {/* Box 2: Customer Ops Center */}
          <Link href="/company_profile/contact_us" className="flex-1">
            <div className="h-full bg-gradient-to-br from-[#0f284f] to-[#071f4b] hover:from-[#112d59] hover:to-[#082457] text-white p-8 rounded-3xl shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer border border-transparent hover:border-blue-400/25 group">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-2xl font-black uppercase italic tracking-tighter text-blue-400 group-hover:text-white transition-colors duration-300">
                  {t("contact_ops_title")}
                </h4>
                <div className="bg-blue-500/10 p-2 rounded-xl">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 font-medium whitespace-pre-line">
                {t("contact_ops_desc")}
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* PACKAGE SERVICES - DETAILED LOGISTICS GRID */}
      <section className="py-28 px-8 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full shadow-sm">
              {t("pkg_badge")}
            </span>
            <h2 className="text-4xl font-black text-[#0a2a66] uppercase tracking-tight italic bg-gradient-to-r from-[#0a2a66] to-blue-900 bg-clip-text text-transparent">
              {t("pkg_title")}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Package 1 */}
            <div className="group bg-slate-50/40 border border-slate-100 rounded-3xl p-6 flex flex-col items-center shadow-lg shadow-slate-100/30 hover:shadow-[0_20px_40px_rgba(10,42,102,0.05)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-48 bg-white border border-slate-100/60 rounded-2xl mb-8 flex items-center justify-center overflow-hidden relative shadow-inner">
                <img src="/domestic_delivery_pkg.png" alt="Domestic Island Delivery" className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
              </div>
              <h4 className="font-black text-lg text-center mb-6 text-[#0a2a66] uppercase italic tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                {t("pkg1_title")}
              </h4>
              <div className="w-full text-center space-y-1 mt-auto">
                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{t("pkg_start")}</p>
                <p className="text-sm font-black text-blue-600 bg-blue-50/60 border border-blue-100/35 py-2 rounded-xl">1M - 5M <span className="text-[10px] opacity-75">IDR</span></p>
              </div>
            </div>
            
            {/* Package 2 */}
            <div className="group bg-slate-50/40 border border-slate-100 rounded-3xl p-6 flex flex-col items-center shadow-lg shadow-slate-100/30 hover:shadow-[0_20px_40px_rgba(10,42,102,0.05)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-48 bg-white border border-slate-100/60 rounded-2xl mb-8 flex items-center justify-center overflow-hidden relative shadow-inner">
                <img src="/inter_island_delivery_pkg.png" alt="Delivery to other islands" className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
              </div>
              <h4 className="font-black text-lg text-center mb-6 text-[#0a2a66] uppercase italic tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                {t("pkg2_title")}
              </h4>
              <div className="w-full text-center space-y-1 mt-auto">
                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{t("pkg_start")}</p>
                <p className="text-sm font-black text-blue-600 bg-blue-50/60 border border-blue-100/35 py-2 rounded-xl">8M - 10M <span className="text-[10px] opacity-75">IDR</span></p>
              </div>
            </div>
 
            {/* Package 3 */}
            <div className="group bg-slate-50/40 border border-slate-100 rounded-3xl p-6 flex flex-col items-center shadow-lg shadow-slate-100/30 hover:shadow-[0_20px_40px_rgba(10,42,102,0.05)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-48 bg-white border border-slate-100/60 rounded-2xl mb-8 flex items-center justify-center overflow-hidden relative shadow-inner">
                <img src="/international_shipping_pkg.png" alt="International Shipping" className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
              </div>
              <h4 className="font-black text-lg text-center mb-6 text-[#0a2a66] uppercase italic tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                {t("pkg3_title")}
              </h4>
              <div className="w-full text-center space-y-1 mt-auto">
                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{t("pkg_start")}</p>
                <p className="text-sm font-black text-blue-600 bg-blue-50/60 border border-blue-100/35 py-2 rounded-xl">15M - 35M <span className="text-[10px] opacity-75">IDR</span></p>
              </div>
            </div>
 
          </div>
        </div>
      </section>
    </div>
  );
}