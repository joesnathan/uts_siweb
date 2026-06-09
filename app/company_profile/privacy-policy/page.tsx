"use client";

import { useLanguage } from "../../LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* 1. Page Header inside container matching White Navbar */}
      <div className="relative z-10 w-full max-w-7xl text-center px-4 pt-16 mb-12 mx-auto">
        <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-3 shadow-sm">
          {t("privacy_badge")}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-2">{t("privacy_title")}</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">PT Ekspedisi Terbanginaja</p>
      </div>

      {/* 2. MAIN CONTENT (Kertas Putih Mengambang - Premium Light Theme) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row">

          {/* 3. SIDEBAR NAVIGATION (Daftar Isi Sticky) */}
          <div className="md:w-1/3 lg:w-1/4 bg-slate-50 border-r border-gray-150 p-8 hidden md:block">
            <div className="sticky top-32">
              <h3 className="text-xs font-black text-[#0a2a66] uppercase tracking-widest mb-6">{t("privacy_toc")}</h3>
              <ul className="space-y-5 text-sm font-bold text-slate-500">
                <li><a href="#info-we-collect" className="hover:text-blue-600 hover:underline transition-colors">{t("toc_item1")}</a></li>
                <li><a href="#how-we-use" className="hover:text-blue-600 hover:underline transition-colors">{t("toc_item2")}</a></li>
                <li><a href="#sharing-info" className="hover:text-blue-600 hover:underline transition-colors">{t("toc_item3")}</a></li>
                <li><a href="#data-security" className="hover:text-blue-600 hover:underline transition-colors">{t("toc_item4")}</a></li>
                <li><a href="#data-retention" className="hover:text-blue-600 hover:underline transition-colors">{t("toc_item5")}</a></li>
                <li><a href="#user-rights" className="hover:text-blue-600 hover:underline transition-colors">{t("toc_item6")}</a></li>
                <li><a href="#changes" className="hover:text-blue-600 hover:underline transition-colors">{t("toc_item7")}</a></li>
              </ul>
            </div>
          </div>

          {/* 4. TEXT CONTENT AREA */}
          <div className="md:w-2/3 lg:w-3/4 p-8 md:p-12 lg:p-16 text-slate-650">
            
            {/* Intro */}
            <div className="mb-14">
              <div className="inline-block bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-full text-xs font-black tracking-wider mb-6">
                {t("privacy_updated")}
              </div>
              <p className="text-lg text-slate-600 leading-relaxed text-justify">
                {t("privacy_intro")}
              </p>
            </div>

            <div className="space-y-16">
              
              {/* Section 1 */}
              <section id="info-we-collect" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-6 flex items-center border-b border-gray-200 pb-4">
                  <span className="text-blue-600 mr-4 text-4xl font-black font-mono tracking-tighter">01.</span>
                  {t("sec1_title")}
                </h2>
                <p className="text-slate-600 mb-6 text-justify">{t("sec1_desc")}</p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { title: t("sec1_card1_title"), desc: t("sec1_card1_desc") },
                    { title: t("sec1_card2_title"), desc: t("sec1_card2_desc") },
                    { title: t("sec1_card3_title"), desc: t("sec1_card3_desc") },
                    { title: t("sec1_card4_title"), desc: t("sec1_card4_desc") },
                    { title: t("sec1_card5_title"), desc: t("sec1_card5_desc") }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start bg-slate-50 border border-gray-155 p-4 rounded-xl hover:bg-slate-100/50 transition-colors shadow-sm">
                      <div className="text-blue-600 mr-4 mt-1 font-bold">✦</div>
                      <div>
                        <strong className="text-slate-800 block mb-1 font-bold">{item.title}</strong>
                        <span className="text-slate-505 text-sm font-semibold">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2 */}
              <section id="how-we-use" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-6 flex items-center border-b border-gray-200 pb-4">
                  <span className="text-blue-600 mr-4 text-4xl font-black font-mono tracking-tighter">02.</span>
                  {t("sec2_title")}
                </h2>
                <p className="text-slate-600 mb-6 text-justify">{t("sec2_desc")}</p>
                <ul className="space-y-4 text-slate-600 font-semibold text-sm">
                  <li className="flex items-start"><span className="text-blue-600 mr-3">✔</span> <span>{t("sec2_bullet1")}</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-3">✔</span> <span>{t("sec2_bullet2")}</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-3">✔</span> <span>{t("sec2_bullet3")}</span></li>
                  <li className="flex items-start"><span className="text-blue-600 mr-3">✔</span> <span>{t("sec2_bullet4")}</span></li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="sharing-info" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-6 flex items-center border-b border-gray-200 pb-4">
                  <span className="text-blue-600 mr-4 text-4xl font-black font-mono tracking-tighter">03.</span>
                  {t("sec3_title")}
                </h2>
                <p className="text-slate-600 mb-6 text-justify">{t("sec3_desc")}</p>
                <ul className="list-disc pl-6 space-y-3 text-slate-600 marker:text-blue-500 text-justify font-semibold text-sm">
                  <li>{t("sec3_bullet1")}</li>
                  <li>{t("sec3_bullet2")}</li>
                  <li>{t("sec3_bullet3")}</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="data-security" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-6 flex items-center border-b border-gray-200 pb-4">
                  <span className="text-blue-600 mr-4 text-4xl font-black font-mono tracking-tighter">04.</span>
                  {t("sec4_title")}
                </h2>
                <p className="text-slate-600 leading-relaxed text-justify font-semibold text-sm">
                  {t("sec4_desc")}
                </p>
              </section>

              {/* Section 5 */}
              <section id="data-retention" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-6 flex items-center border-b border-gray-200 pb-4">
                  <span className="text-blue-600 mr-4 text-4xl font-black font-mono tracking-tighter">05.</span>
                  {t("sec5_title")}
                </h2>
                <p className="text-slate-600 leading-relaxed text-justify font-semibold text-sm">
                  {t("sec5_desc")}
                </p>
              </section>

              {/* Section 6 */}
              <section id="user-rights" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-6 flex items-center border-b border-gray-200 pb-4">
                  <span className="text-blue-600 mr-4 text-4xl font-black font-mono tracking-tighter">06.</span>
                  {t("sec6_title")}
                </h2>
                <p className="text-slate-600 mb-4 font-bold">{t("sec6_desc")}</p>
                <div className="flex flex-col gap-3 font-semibold text-sm">
                  <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-600 text-slate-700 border border-blue-100/30">{t("sec6_bullet1")}</div>
                  <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-600 text-slate-700 border border-blue-100/30">{t("sec6_bullet2")}</div>
                  <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-600 text-slate-700 border border-blue-100/30">{t("sec6_bullet3")}</div>
                </div>
              </section>

              {/* Section 7 */}
              <section id="changes" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-black text-[#0a2a66] uppercase italic tracking-tight mb-6 flex items-center border-b border-gray-200 pb-4">
                  <span className="text-blue-600 mr-4 text-4xl font-black font-mono tracking-tighter">07.</span>
                  {t("sec7_title")}
                </h2>
                <p className="text-slate-600 leading-relaxed text-justify font-semibold text-sm">
                  {t("sec7_desc")}
                </p>
              </section>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}