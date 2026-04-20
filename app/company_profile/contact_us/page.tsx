export default function ContactPage() {
  return (
    <div className="relative flex-grow min-h-[90vh] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      
      {/* 1. Latar Belakang Gambar Pesawat */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: 'url("/bg.jpeg")' }}
      ></div>

      {/* 2. Overlay Biru Gelap + Efek Blur */}
      <div className="absolute inset-0 bg-[#0f284f]/85 backdrop-blur-sm z-0"></div>

      {/* 3. Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-14 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white">
        
        {/* Header Title */}
        <div className="text-center mb-12 border-b border-white/20 pb-6">
          <p className="text-blue-300 text-sm font-bold tracking-widest uppercase mb-2">Get in Touch</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest mb-2">OUR CONTACT</h1>
        </div>

        {/* 4. Grid Layout (2 Kolom di Desktop, 1 Kolom di HP) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* KOLOM KIRI: Customer & Ops Support */}
          <div>
            <h3 className="font-bold text-xl text-blue-300 mb-6 flex items-center">
              Customer & Operational Support
            </h3>
            
            <ul className="space-y-6 text-base text-gray-100">
              {/* Instagram */}
              <li className="flex items-center group cursor-pointer">
                <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300">@terbanginaja</span>
              </li>

              {/* Email */}
              <li className="flex items-center group cursor-pointer">
                <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300">operasional@terbanginaja.co.id</span>
              </li>

              {/* Phone */}
              <li className="flex items-center group cursor-pointer">
                <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300">+62 811-0000-888</span>
              </li>

              {/* Web */}
              <li className="flex items-center group cursor-pointer">
                <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-blue-500 transition-colors duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <span className="group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300">ops.terbanginaja.co.id</span>
              </li>
            </ul>
          </div>

          {/* KOLOM KANAN: Head Office */}
          <div>
            <h3 className="font-bold text-xl text-blue-300 mb-6 flex items-center">
              Head Office
            </h3>
            
            <div className="flex items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
              <div className="bg-blue-500/20 p-3 rounded-xl mr-5 mt-1">
                {/* Location Icon */}
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-base leading-relaxed text-gray-200">
                <strong className="text-white block mb-2 text-lg">Cargo Village (CGK)</strong>
                Soekarno-Hatta International Airport<br />
                Air Logistics Building Block A2<br/>
                Banten, Indonesia
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}