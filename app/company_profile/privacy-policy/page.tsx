export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f4f8fb] font-sans pb-24">
      
      {/* 1. HERO HEADER (Background Pesawat Biru) */}
      <div className="relative w-full h-[40vh] min-h-[350px] flex flex-col justify-center items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url("/bg.jpeg")' }}
        ></div>
        <div className="absolute inset-0 bg-[#0f284f]/85"></div>
        
        {/* Title (Posisinya sudah dinaikkan dengan menghapus mt-8 dan menambahkan mb-8) */}
        <div className="relative z-10 text-center px-4 mb-8">
          <p className="text-blue-300 text-sm font-bold tracking-widest uppercase mb-3">Legal Documentation</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4">Privacy Policy</h1>
          <p className="text-gray-200 text-lg">PT Ekspedisi Terbanginaja</p>
        </div>
      </div>

      {/* 2. MAIN CONTENT (Kertas Putih Mengambang) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 -mt-24">
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row">

          {/* 3. SIDEBAR NAVIGATION (Daftar Isi Sticky) */}
          <div className="md:w-1/3 lg:w-1/4 bg-gray-50 border-r border-gray-100 p-8 hidden md:block">
            <div className="sticky top-32">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Table of Contents</h3>
              <ul className="space-y-5 text-sm font-bold text-gray-500">
                <li><a href="#info-we-collect" className="hover:text-blue-700 transition-colors">1. Information We Collect</a></li>
                <li><a href="#how-we-use" className="hover:text-blue-700 transition-colors">2. How We Use Information</a></li>
                <li><a href="#sharing-info" className="hover:text-blue-700 transition-colors">3. Sharing with Third Parties</a></li>
                <li><a href="#data-security" className="hover:text-blue-700 transition-colors">4. Data Security</a></li>
                <li><a href="#data-retention" className="hover:text-blue-700 transition-colors">5. Data Retention</a></li>
                <li><a href="#user-rights" className="hover:text-blue-700 transition-colors">6. User Rights</a></li>
                <li><a href="#changes" className="hover:text-blue-700 transition-colors">7. Policy Changes</a></li>
              </ul>
            </div>
          </div>

          {/* 4. TEXT CONTENT AREA */}
          <div className="md:w-2/3 lg:w-3/4 p-8 md:p-12 lg:p-16">
            
            {/* Intro */}
            <div className="mb-14">
              <div className="inline-block bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-full text-xs tracking-wider mb-6">
                LAST UPDATED: APRIL 12, 2026
              </div>
              <p className="text-lg text-gray-600 leading-relaxed text-justify">
                <strong className="text-gray-900">PT Ekspedisi Terbanginaja</strong> ("We," "Our," or "The Company") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our website, operational portal, and air cargo services.
              </p>
            </div>

            <div className="space-y-16">
              
              {/* Section 1 */}
              <section id="info-we-collect" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-6 flex items-center border-b border-gray-100 pb-4">
                  <span className="text-blue-200 mr-4 text-4xl hidden sm:inline font-light">01.</span>
                  Information We Collect
                </h2>
                <p className="text-gray-600 mb-6 text-justify">To provide safe and efficient logistics services, we collect several types of information:</p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { title: "Account & Contact Information", desc: "Full name, email address, phone number, and password when you register or log in to our portal." },
                    { title: "Shipment Information (Manifest)", desc: "Details of the Shipper and Consignee, including names, full addresses, contact numbers, and corporate identities." },
                    { title: "Cargo Details", desc: "Item descriptions, weight, dimensions, and cargo categories (including General Cargo, Perishable Goods, or Dangerous Goods)." },
                    { title: "Payment Data", desc: "Transaction information for billing purposes and administration of shipping services." },
                    { title: "Technical & Tracking Data", desc: "IP addresses, device types, access times, and activity logs when you use the 'Track Your Cargo' feature." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="text-blue-500 mr-4 mt-1">✦</div>
                      <div>
                        <strong className="text-gray-800 block mb-1">{item.title}</strong>
                        <span className="text-gray-600 text-sm">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2 */}
              <section id="how-we-use" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-6 flex items-center border-b border-gray-100 pb-4">
                  <span className="text-blue-200 mr-4 text-4xl hidden sm:inline font-light">02.</span>
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 mb-6 text-justify">We use the collected information for operational and legal purposes, including:</p>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start"><span className="text-blue-500 mr-3">✔</span> <span><strong className="text-gray-800">Service Execution:</strong> Processing cargo shipment orders for domestic (inter-island and intra-island) and international routes.</span></li>
                  <li className="flex items-start"><span className="text-blue-500 mr-3">✔</span> <span><strong className="text-gray-800">Operational Management:</strong> Preparing flight manifests, calculating aircraft Weight & Balance, and providing special handling instructions for flight crews and ground operators.</span></li>
                  <li className="flex items-start"><span className="text-blue-500 mr-3">✔</span> <span><strong className="text-gray-800">Tracking & Communication:</strong> Providing real-time cargo status updates to customers and responding to customer service inquiries.</span></li>
                  <li className="flex items-start"><span className="text-blue-500 mr-3">✔</span> <span><strong className="text-gray-800">Security & Legal Compliance:</strong> Ensuring aviation safety, preventing fraud, and complying with civil aviation regulations and customs requirements.</span></li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="sharing-info" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-6 flex items-center border-b border-gray-100 pb-4">
                  <span className="text-blue-200 mr-4 text-4xl hidden sm:inline font-light">03.</span>
                  Sharing with Third Parties
                </h2>
                <p className="text-gray-600 mb-6 text-justify">We do not sell or rent your personal data. We only share information with authorized third parties relevant to cargo operations:</p>
                <ul className="list-disc pl-6 space-y-3 text-gray-600 marker:text-blue-400 text-justify">
                  <li><strong className="text-gray-800">Airport Authorities & Airlines:</strong> Manifest data is shared with airport authorities and Air Engineers for flight permits and safety purposes.</li>
                  <li><strong className="text-gray-800">Legal & Customs Authorities:</strong> For international shipments, cargo information and shipper/consignee identities must be reported to Customs in the origin and destination countries in accordance with international law.</li>
                  <li><strong className="text-gray-800">Ground Logistics Partners:</strong> Third parties that assist in the loading/unloading process or last-mile delivery.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="data-security" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-6 flex items-center border-b border-gray-100 pb-4">
                  <span className="text-blue-200 mr-4 text-4xl hidden sm:inline font-light">04.</span>
                  Data Security
                </h2>
                <p className="text-gray-600 leading-relaxed text-justify">
                  We implement strict technical and organizational security standards to protect your digital manifest data and personal information from unauthorized access, use, or disclosure. Our system utilizes data encryption and role-based access control (e.g., only authorized Operators and Supervisors can modify cargo status).
                </p>
              </section>

              {/* Section 5 */}
              <section id="data-retention" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-6 flex items-center border-b border-gray-100 pb-4">
                  <span className="text-blue-200 mr-4 text-4xl hidden sm:inline font-light">05.</span>
                  Data Retention
                </h2>
                <p className="text-gray-600 leading-relaxed text-justify">
                  We will store your personal data and shipment history for as long as necessary to fulfill our operational service goals, or as required by applicable tax laws and civil aviation regulations.
                </p>
              </section>

              {/* Section 6 */}
              <section id="user-rights" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-6 flex items-center border-b border-gray-100 pb-4">
                  <span className="text-blue-200 mr-4 text-4xl hidden sm:inline font-light">06.</span>
                  User Rights
                </h2>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <div className="flex flex-col gap-3">
                  <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-500 text-gray-700">Access and review the profile information we store about you.</div>
                  <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-500 text-gray-700">Request corrections or updates to inaccurate contact data.</div>
                  <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-500 text-gray-700">Contact our customer service regarding the management of your cargo data.</div>
                </div>
              </section>

              {/* Section 7 */}
              <section id="changes" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-6 flex items-center border-b border-gray-100 pb-4">
                  <span className="text-blue-200 mr-4 text-4xl hidden sm:inline font-light">07.</span>
                  Changes to the Privacy Policy
                </h2>
                <p className="text-gray-600 leading-relaxed text-justify">
                  We may update this Privacy Policy from time to time to comply with legal regulations or improvements to our operational systems. Changes will be announced through the Ekspedisi Terbanginaja web portal.
                </p>
              </section>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}