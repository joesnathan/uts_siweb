import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full font-sans">
      
      {/* HERO SECTION */}
      <section className="text-white px-8 lg:px-24 relative overflow-hidden min-h-[90vh] flex flex-col justify-center py-20">
        
        {/* Latar Belakang Video YouTube */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-black">
          <iframe
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/utWVqpZ-8XI?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=utWVqpZ-8XI&playsinline=1"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          ></iframe>
        </div>

        {/* Overlay Biru Gelap */}
        <div className="absolute inset-0 bg-[#0f284f]/85 z-0"></div> 

        <div className="relative z-10 w-full">
          {/* Logo dengan animasi pulse pelan agar terkesan hidup */}
          <img 
            src="/logo.png" 
            alt="Logo Terbangin Aja" 
            className="block mx-auto mb-8 md:float-right md:ml-10 md:mb-6 w-64 md:w-80 lg:w-[400px] xl:w-[450px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
          />
          
          <h1 className="text-5xl font-bold mb-4 tracking-wide">About Us</h1>
          <p className="text-base leading-relaxed text-gray-100 text-justify mb-10">
            PT Ekspedisi Terbanginaja is a leading air freight service provider focused on inter-island logistics delivery with high-level speed, precision, and security. Born from the need for rapid distribution systems in the modern era, we combine a reliable air fleet with digital payload management and tracking technology. From fresh agricultural produce to large-scale industrial cargo, we ensure every item arrives at its destination on time, every time.
          </p>

          <h2 className="text-4xl font-bold mb-4 tracking-wide">Vision & Mission</h2>
          <p className="text-base leading-relaxed text-gray-100 mb-3 text-justify">
            To be the pioneer of the most innovative and trusted air cargo logistics solutions in the archipelago, connecting every regional economic potential without distance barriers.
          </p>
          <p className="text-base font-semibold mb-2">Mission:</p>
          <ul className="list-disc list-inside text-base text-gray-100 space-y-2 pl-1 text-justify">
            <li className="hover:text-white transition-colors duration-300">Punctuality: Guaranteeing delivery SLAs (Service Level Agreements) with measurable and disciplined cargo flight schedules.</li>
            <li className="hover:text-white transition-colors duration-300">Technology Driven: Providing real-time information tracking systems and transparent digital manifest management for every client.</li>
            <li className="hover:text-white transition-colors duration-300">Cargo Integrity: Applying the highest aviation operational standards in handling every type of cargo, ensuring goods arrive in perfect condition.</li>
          </ul>
          
          <div className="clear-both"></div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-20 px-8 lg:px-24 bg-white">
        <h2 className="text-4xl font-bold text-center text-[#1a365d] mb-12">Core Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card Core Service 1 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="w-full h-48 rounded-xl mb-4 shadow-md overflow-hidden">
              <img src="/gambar 1.jpeg" alt="Priority Air Freight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
            </div>
            <h3 className="font-bold text-xl text-black text-center group-hover:text-[#1a365d] transition-colors duration-300">Priority Air Freight</h3>
          </div>
          
          {/* Card Core Service 2 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="w-full h-48 rounded-xl mb-4 shadow-md overflow-hidden">
              <img src="/gambar 2.jpeg" alt="Perishable Goods Handling" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
            </div>
            <h3 className="font-bold text-xl text-black text-center group-hover:text-[#1a365d] transition-colors duration-300">Perishable Goods Handling</h3>
          </div>
          
          {/* Card Core Service 3 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="w-full h-48 rounded-xl mb-4 shadow-md overflow-hidden">
              <img src="/gambar 3.jpeg" alt="Integrated Tracking" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
            </div>
            <h3 className="font-bold text-xl text-black text-center group-hover:text-[#1a365d] transition-colors duration-300">Integrated Tracking</h3>
          </div>

        </div>

        {/* WHY CHOOSE US */}
        <div className="mb-16">
          <h3 className="font-bold text-[#1a365d] text-xl mb-4">Why Choose Us?</h3>
          <ul className="list-disc pl-5 text-base text-[#1a365d] space-y-3 font-semibold">
            <li className="hover:translate-x-2 transition-transform duration-300">Centralized Digital Manifest System: No more lost or scattered paperwork. All shipper data, assigned crew, and detailed weight per item are recorded in real-time within the Ekspedisi Terbanginaja system.</li>
            <li className="hover:translate-x-2 transition-transform duration-300">Flexible Payload Capacity: Capable of accommodating ton-scale cargo volumes with precise weight & balance calculations controlled by experienced Air Engineers.</li>
            <li className="hover:translate-x-2 transition-transform duration-300">Operational Transparency: Displaying the real-time status of cargo, providing complete peace of mind for retail and corporate business partners.</li>
          </ul>
        </div>

        {/* INFO BOXES */}
        <div className="flex flex-col md:flex-row gap-8 mb-20 justify-center">
          {/* Box 1: Headquarters (Diperbaiki route-nya) */}
          <Link href="/company_profile/contact_us" className="flex-1">
            <div className="h-full bg-[#0f284f] text-white p-8 rounded-2xl text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-blue-400/30">
              <h4 className="text-2xl font-bold mb-4">Headquarters</h4>
              <p className="text-base leading-relaxed">
                Soekarno-Hatta International Airport<br/>
                Cargo Village (CGK) Air Logistics<br/>
                Building Block A2, Banten, Indonesia
              </p>
            </div>
          </Link>

          {/* Box 2: Customer & Ops Center (Diperbaiki route-nya) */}
          <Link href="/company_profile/contact_us" className="flex-1">
            <div className="h-full bg-[#0f284f] text-white p-8 rounded-2xl text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-blue-400/30">
              <h4 className="text-2xl font-bold mb-4">Customer & Ops Center</h4>
              <p className="text-base leading-relaxed">
                Email: operasional@terbanginaja.co.id<br/>
                Phone/WhatsApp: +62 811-0000-888<br/>
                Website Portal: ops.terbanginaja.co.id
              </p>
            </div>
          </Link>
        </div>

        {/* PACKAGE SERVICES */}
        <div>
          <h2 className="text-4xl font-bold text-[#1a365d] mb-10 leading-tight">PACKAGE<br/>SERVICES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Package 1 */}
            <div className="group bg-[#f4f8fb] border border-gray-200 rounded-xl p-5 flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-40 bg-white border border-gray-200 rounded-lg mb-8 flex items-center justify-center overflow-hidden">
                <img src="/DALAM PULAU.png" alt="Domestic Island Delivery" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              </div>
              <h4 className="font-bold text-lg text-center mb-6 text-[#1a365d] group-hover:text-blue-600 transition-colors duration-300">Domestic Island Delivery</h4>
              <p className="text-xs font-bold mb-1 text-gray-500 tracking-wide">START FROM</p>
              <p className="text-base font-bold text-black">1 MILLION - 5 MILION (IDR)</p>
            </div>
            
            {/* Package 2 */}
            <div className="group bg-[#f4f8fb] border border-gray-200 rounded-xl p-5 flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-40 bg-white border border-gray-200 rounded-lg mb-8 flex items-center justify-center overflow-hidden">
                <img src="/peta pulau lain.jpeg" alt="Delivery to other islands" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              </div>
              <h4 className="font-bold text-lg text-center mb-6 text-[#1a365d] group-hover:text-blue-600 transition-colors duration-300">Delivery to other islands</h4>
              <p className="text-xs font-bold mb-1 text-gray-500 tracking-wide">START FROM</p>
              <p className="text-base font-bold text-black">8 MILLION - 10 MILION (IDR)</p>
            </div>

            {/* Package 3 */}
            <div className="group bg-[#f4f8fb] border border-gray-200 rounded-xl p-5 flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="w-full h-40 bg-white border border-gray-200 rounded-lg mb-8 flex items-center justify-center overflow-hidden">
                <img src="/peta global.jpeg" alt="International Shipping" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              </div>
              <h4 className="font-bold text-lg text-center mb-6 text-[#1a365d] group-hover:text-blue-600 transition-colors duration-300">International Shipping</h4>
              <p className="text-xs font-bold mb-1 text-gray-500 tracking-wide">START FROM</p>
              <p className="text-base font-bold text-black">15 MILLION - 35 MILION (IDR)</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}