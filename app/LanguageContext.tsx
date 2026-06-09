"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navbar
    nav_about_us: "Tentang Kami",
    nav_track_cargo: "Lacak Kargo",
    nav_privacy_policy: "Kebijakan Privasi",
    nav_contact_us: "Hubungi Kami!",
    nav_login: "Masuk",

    // Footer
    footer_text: "© 2026 TERBANGIN AJA CARGO JAKARTA",

    // Home / Landing Page (About Us)
    company_badge: "PT Ekspedisi Terbanginaja",
    about_title_pre: "Tentang",
    about_title_post: "Kami",
    about_desc: "PT Ekspedisi Terbanginaja adalah penyedia layanan kargo udara terkemuka yang berfokus pada pengiriman logistik antar pulau dengan tingkat kecepatan, ketepatan, dan keamanan yang tinggi. Lahir dari kebutuhan akan sistem distribusi yang cepat di era modern, kami menggabungkan armada udara yang andal dengan teknologi manajemen muatan digital dan pelacakan real-time. Dari hasil pertanian segar hingga kargo industri skala besar, kami memastikan setiap barang tiba di tujuannya tepat waktu, setiap saat.",
    vision_title: "Visi Kami",
    vision_desc: "Menjadi pelopor solusi logistik kargo udara paling inovatif dan tepercaya di nusantara, menghubungkan setiap potensi ekonomi daerah tanpa batasan jarak.",
    mission_title: "Misi Kami",
    mission_item1_title: "Ketepatan Waktu",
    mission_item1_desc: "Menjamin SLA pengiriman dengan jadwal penerbangan kargo yang disiplin dan kuat.",
    mission_item2_title: "Didorong Teknologi",
    mission_item2_desc: "Menyediakan sistem pelacakan informasi real-time dan manifes digital yang transparan.",
    mission_item3_title: "Integritas Kargo",
    mission_item3_desc: "Menerapkan standar penerbangan tertinggi untuk memastikan barang tiba dalam kondisi sempurna.",
    
    services_badge: "Apa yang Kami Lakukan Terbaik",
    services_title: "Layanan Utama",
    service1_title: "Kargo Udara Prioritas",
    service1_desc: "SLA Terjamin & Ekspres",
    service2_title: "Penanganan Barang Mudah Rusak",
    service2_desc: "Logistik Terkontrol Suhu",
    service3_title: "Pelacakan Terintegrasi",
    service3_desc: "Koordinat GPS Real-Time",

    why_badge: "Mengapa Bermitra dengan Kami",
    why_title: "Mengapa Memilih Kami?",
    why_item1_title: "Manifes Digital Terpusat",
    why_item1_desc: "Tidak ada lagi dokumen yang hilang atau berserakan. Semua data pengirim, kru yang ditugaskan, dan berat detail per item dicatat secara real-time di sistem Terbanginaja.",
    why_item2_title: "Kapasitas Muatan Fleksibel",
    why_item2_desc: "Mampu menampung volume kargo skala ton dengan perhitungan berat & keseimbangan presisi yang dikendalikan oleh Teknisi Kargo Udara berpengalaman dan berlisensi.",
    why_item3_title: "Transparansi Operasional",
    why_item3_desc: "Menampilkan status kargo secara real-time, memberikan ketenangan pikiran dan audit operasional yang aman bagi mitra bisnis ritel maupun korporat.",

    contact_hq_title: "Kantor Pusat",
    contact_hq_desc: "Bandara Internasional Soekarno-Hatta\nCargo Village (CGK) Air Logistics\nGedung Blok A2, Banten, Indonesia",
    contact_ops_title: "Pusat Operasi",
    contact_ops_desc: "Email: operasional@terbanginaja.co.id\nTelepon/WhatsApp: +62 811-0000-888\nPortal Website: ops.terbanginaja.co.id",

    pkg_badge: "Tarif Pengiriman Fleksibel",
    pkg_title: "Layanan Paket",
    pkg1_title: "Pengiriman Domestik",
    pkg2_title: "Pengiriman Antar Pulau",
    pkg3_title: "Pengiriman Internasional",
    pkg_start: "Mulai Dari",

    // Tracking Page
    track_badge: "Radar Wilayah Udara Kargo",
    track_title_pre: "Lacak",
    track_title_post: "Kargo Anda",
    track_subtitle: "Masukkan Manifest ID untuk melacak pengiriman",
    track_placeholder: "Contoh: MNF-2026-001",
    track_btn_now: "TRACK NOW",
    track_btn_loading: "Mencari...",
    track_err_empty: "Masukkan Manifest ID terlebih dahulu!",
    track_err_db: "Gagal terhubung ke database",
    track_err_not_found: "Manifest tidak ditemukan dalam sistem kami.",
    track_placeholder_prompt: "Silakan masukkan Manifest ID untuk melihat status pengiriman.",
    track_result_manifest: "Manifest ID:",
    track_result_status: "Status:",
    track_result_operational: "Operasional:",
    track_result_history: "Riwayat Pelacakan",
    track_result_no_history: "Belum ada riwayat tracking.",
    track_err_card_title: "Pencarian Gagal / Error Handling",
    track_err_card_desc: "Manifest ID yang Anda masukkan tidak terdaftar dalam database kami. Silakan pastikan format yang diinput benar (Contoh: MNF-2026-001) atau hubungi support administrator maskapai.",

    // Contact Us Page
    contact_us_badge: "Hubungi Kami",
    contact_us_title: "KONTAK KAMI",
    contact_us_left_title: "Dukungan Pelanggan & Operasional",
    contact_us_right_title: "Kantor Pusat",

    // Privacy Policy Page
    privacy_badge: "Dokumentasi Hukum",
    privacy_title: "Kebijakan Privasi",
    privacy_toc: "Daftar Isi",
    privacy_updated: "TERAKHIR DIPERBARUI: 12 APRIL 2026",
    privacy_intro: "PT Ekspedisi Terbanginaja (\"Kami\", \"Milik Kami\", atau \"Perusahaan\") berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan membagikan informasi pribadi Anda saat Anda menggunakan situs web, portal operasional, dan layanan kargo udara kami.",
    
    toc_item1: "1. Informasi yang Kami Kumpulkan",
    toc_item2: "2. Bagaimana Kami Menggunakan Informasi",
    toc_item3: "3. Berbagi dengan Pihak Ketiga",
    toc_item4: "4. Keamanan Data",
    toc_item5: "5. Retensi Data",
    toc_item6: "6. Hak Pengguna",
    toc_item7: "7. Perubahan Kebijakan",

    sec1_title: "Informasi yang Kami Kumpulkan",
    sec1_desc: "Untuk menyediakan layanan logistik yang aman dan efisien, kami mengumpulkan beberapa jenis informasi:",
    sec1_card1_title: "Informasi Akun & Kontak",
    sec1_card1_desc: "Nama lengkap, alamat email, nomor telepon, dan kata sandi saat Anda mendaftar atau masuk ke portal kami.",
    sec1_card2_title: "Informasi Pengiriman (Manifes)",
    sec1_card2_desc: "Detail Pengirim dan Penerima, termasuk nama, alamat lengkap, nomor kontak, dan identitas perusahaan.",
    sec1_card3_title: "Detail Kargo",
    sec1_card3_desc: "Deskripsi barang, berat, dimensi, dan kategori kargo (termasuk Kargo Umum, Barang Mudah Rusak, atau Barang Berbahaya).",
    sec1_card4_title: "Data Pembayaran",
    sec1_card4_desc: "Informasi transaksi untuk tujuan penagihan dan administrasi layanan pengiriman.",
    sec1_card5_title: "Data Teknis & Pelacakan",
    sec1_card5_desc: "Alamat IP, tipe perangkat, waktu akses, dan log aktivitas saat Anda menggunakan fitur 'Lacak Kargo'.",

    sec2_title: "Bagaimana Kami Menggunakan Informasi Anda",
    sec2_desc: "Kami menggunakan informasi yang dikumpulkan untuk tujuan operasional dan hukum, termasuk:",
    sec2_bullet1: "Eksekusi Layanan: Memproses pesanan pengiriman kargo untuk rute domestik (antar-pulau dan dalam-pulau) serta rute internasional.",
    sec2_bullet2: "Manajemen Operasional: Menyiapkan manifes penerbangan, menghitung Berat & Keseimbangan pesawat, dan memberikan instruksi penanganan khusus untuk kru penerbangan dan operator darat.",
    sec2_bullet3: "Pelacakan & Komunikasi: Menyediakan pembaruan status kargo real-time kepada pelanggan dan merespons pertanyaan layanan pelanggan.",
    sec2_bullet4: "Keamanan & Kepatuhan Hukum: Menjamin keselamatan penerbangan, mencegah penipuan, dan mematuhi peraturan penerbangan sipil serta persyaratan bea cukai.",

    sec3_title: "Berbagi dengan Pihak Ketiga",
    sec3_desc: "Kami tidak menjual atau menyewakan data pribadi Anda. Kami hanya membagikan informasi dengan pihak ketiga resmi yang relevan dengan operasi kargo:",
    sec3_bullet1: "Otoritas Bandara & Maskapai: Data manifes dibagikan dengan otoritas bandara dan Insinyur Penerbangan untuk izin penerbangan dan tujuan keselamatan.",
    sec3_bullet2: "Otoritas Hukum & Bea Cukai: Untuk pengiriman internasional, informasi kargo dan identitas pengirim/penerima wajib dilaporkan ke Bea Cukai di negara asal dan tujuan sesuai hukum internasional.",
    sec3_bullet3: "Mitra Logistik Darat: Pihak ketiga yang membantu proses pemuatan/pembongkaran atau pengiriman jarak terakhir (last-mile).",

    sec4_title: "Keamanan Data",
    sec4_desc: "Kami menerapkan standar keamanan teknis dan organisasi yang ketat untuk melindungi data manifes digital dan informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Sistem kami menggunakan enkripsi data dan kontrol akses berbasis peran (misalnya, hanya Operator dan Supervisor resmi yang dapat mengubah status kargo).",

    sec5_title: "Retensi Data",
    sec5_desc: "Kami akan menyimpan data pribadi dan riwayat pengiriman Anda selama diperlukan untuk memenuhi tujuan layanan operasional kami, atau sebagaimana diharuskan oleh undang-undang perpajakan yang berlaku dan peraturan penerbangan sipil.",

    sec6_title: "Hak Pengguna",
    sec6_desc: "Anda memiliki hak untuk:",
    sec6_bullet1: "Mengakses dan meninjau informasi profil yang kami simpan tentang Anda.",
    sec6_bullet2: "Meminta koreksi atau pembaruan pada data kontak yang tidak akurat.",
    sec6_bullet3: "Menghubungi layanan pelanggan kami terkait pengelolaan data kargo Anda.",

    sec7_title: "Perubahan pada Kebijakan Privasi",
    sec7_desc: "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mematuhi peraturan hukum atau peningkatan sistem operasional kami. Perubahan akan diumumkan melalui portal web Ekspedisi Terbanginaja."
  },
  en: {
    // Navbar
    nav_about_us: "About Us",
    nav_track_cargo: "Track Your Cargo",
    nav_privacy_policy: "Privacy Policy",
    nav_contact_us: "Contact Us!",
    nav_login: "Login",

    // Footer
    footer_text: "© 2026 TERBANGIN AJA CARGO JAKARTA",

    // Home / Landing Page (About Us)
    company_badge: "PT Ekspedisi Terbanginaja",
    about_title_pre: "About",
    about_title_post: "Us",
    about_desc: "PT Ekspedisi Terbanginaja is a leading air freight service provider focused on inter-island logistics delivery with high-level speed, precision, and security. Born from the need for rapid distribution systems in the modern era, we combine a reliable air fleet with digital payload management and tracking technology. From fresh agricultural produce to large-scale industrial cargo, we ensure every item arrives at its destination on time, every time.",
    vision_title: "Our Vision",
    vision_desc: "To be the pioneer of the most innovative and trusted air cargo logistics solutions in the archipelago, connecting every regional economic potential without distance barriers.",
    mission_title: "Our Mission",
    mission_item1_title: "Punctuality",
    mission_item1_desc: "Guaranteeing delivery SLAs with disciplined and robust cargo flight schedules.",
    mission_item2_title: "Technology Driven",
    mission_item2_desc: "Providing real-time information tracking systems and transparent digital manifests.",
    mission_item3_title: "Cargo Integrity",
    mission_item3_desc: "Applying the highest aviation standards to ensure goods arrive in perfect condition.",
    
    services_badge: "What We Do Best",
    services_title: "Core Services",
    service1_title: "Priority Air Freight",
    service1_desc: "SLA-Guaranteed Express",
    service2_title: "Perishable Goods Handling",
    service2_desc: "Temperature-Controlled Logistics",
    service3_title: "Integrated Tracking",
    service3_desc: "Real-time GPS coordinates",

    why_badge: "Why Partner With Us",
    why_title: "Why Choose Us?",
    why_item1_title: "Centralized Digital Manifest",
    why_item1_desc: "No more lost or scattered paperwork. All shipper data, assigned crew, and detailed weight per item are recorded in real-time within the Ekspedisi Terbanginaja system.",
    why_item2_title: "Flexible Payload Capacity",
    why_item2_desc: "Capable of accommodating ton-scale cargo volumes with precise weight & balance calculations controlled by experienced and licensed Air Cargo Engineers.",
    why_item3_title: "Operational Transparency",
    why_item3_desc: "Displaying the real-time status of cargo, providing complete peace of mind and secure operational auditing for retail and corporate business partners.",

    contact_hq_title: "Headquarters",
    contact_hq_desc: "Soekarno-Hatta International Airport\nCargo Village (CGK) Air Logistics\nBuilding Block A2, Banten, Indonesia",
    contact_ops_title: "Ops Center",
    contact_ops_desc: "Email: operasional@terbanginaja.co.id\nPhone/WhatsApp: +62 811-0000-888\nWebsite Portal: ops.terbanginaja.co.id",

    pkg_badge: "Flexible Shipping Rates",
    pkg_title: "Package Services",
    pkg1_title: "Domestic Island Delivery",
    pkg2_title: "Delivery to other islands",
    pkg3_title: "International Shipping",
    pkg_start: "Start From",

    // Tracking Page
    track_badge: "Cargo Airspace Radar",
    track_title_pre: "Track",
    track_title_post: "Your Cargo",
    track_subtitle: "Enter Manifest ID to track shipment",
    track_placeholder: "Example: MNF-2026-001",
    track_btn_now: "TRACK NOW",
    track_btn_loading: "Searching...",
    track_err_empty: "Please enter Manifest ID first!",
    track_err_db: "Failed to connect to database",
    track_err_not_found: "Manifest not found in our system.",
    track_placeholder_prompt: "Please enter Manifest ID to see shipping status.",
    track_result_manifest: "Manifest ID:",
    track_result_status: "Status:",
    track_result_operational: "Operational:",
    track_result_history: "Tracking History",
    track_result_no_history: "No tracking history yet.",
    track_err_card_title: "Search Failed / Error Handling",
    track_err_card_desc: "The Manifest ID you entered is not registered in our database. Please make sure the format entered is correct (Example: MNF-2026-001) or contact the airline support administrator.",

    // Contact Us Page
    contact_us_badge: "Get in Touch",
    contact_us_title: "OUR CONTACT",
    contact_us_left_title: "Customer & Operational Support",
    contact_us_right_title: "Head Office",

    // Privacy Policy Page
    privacy_badge: "Legal Documentation",
    privacy_title: "Privacy Policy",
    privacy_toc: "Table of Contents",
    privacy_updated: "LAST UPDATED: APRIL 12, 2026",
    privacy_intro: "PT Ekspedisi Terbanginaja (\"We\", \"Our\", or \"The Company\") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our website, operational portal, and air cargo services.",
    
    toc_item1: "1. Information We Collect",
    toc_item2: "2. How We Use Information",
    toc_item3: "3. Sharing with Third Parties",
    toc_item4: "4. Data Security",
    toc_item5: "5. Data Retention",
    toc_item6: "6. User Rights",
    toc_item7: "7. Policy Changes",

    sec1_title: "Information We Collect",
    sec1_desc: "To provide safe and efficient logistics services, we collect several types of information:",
    sec1_card1_title: "Account & Contact Information",
    sec1_card1_desc: "Full name, email address, phone number, and password when you register or log in to our portal.",
    sec1_card2_title: "Shipment Information (Manifest)",
    sec1_card2_desc: "Details of the Shipper and Consignee, including names, full addresses, contact numbers, and corporate identities.",
    sec1_card3_title: "Cargo Details",
    sec1_card3_desc: "Item descriptions, weight, dimensions, and cargo categories (including General Cargo, Perishable Goods, or Dangerous Goods).",
    sec1_card4_title: "Payment Data",
    sec1_card4_desc: "Transaction information for billing purposes and administration of shipping services.",
    sec1_card5_title: "Technical & Tracking Data",
    sec1_card5_desc: "IP addresses, device types, access times, and activity logs when you use the 'Track Your Cargo' feature.",

    sec2_title: "How We Use Your Information",
    sec2_desc: "We use the collected information for operational and legal purposes, including:",
    sec2_bullet1: "Service Execution: Processing cargo shipment orders for domestic (inter-island and intra-island) and international routes.",
    sec2_bullet2: "Operational Management: Preparing flight manifests, calculating aircraft Weight & Balance, and providing special handling instructions for flight crews and ground operators.",
    sec2_bullet3: "Tracking & Communication: Providing real-time cargo status updates to customers and responding to customer service inquiries.",
    sec2_bullet4: "Security & Legal Compliance: Ensuring aviation safety, preventing fraud, and complying with civil aviation regulations and customs requirements.",

    sec3_title: "Sharing with Third Parties",
    sec3_desc: "We do not sell or rent your personal data. We only share information with authorized third parties relevant to cargo operations:",
    sec3_bullet1: "Airport Authorities & Airlines: Manifest data is shared with airport authorities and Air Engineers for flight permits and safety purposes.",
    sec3_bullet2: "Legal & Customs Authorities: For international shipments, cargo information and shipper/consignee identities must be reported to Customs in the origin and destination countries in accordance with international law.",
    sec3_bullet3: "Ground Logistics Partners: Third parties that assist in the loading/unloading process or last-mile delivery.",

    sec4_title: "Data Security",
    sec4_desc: "We implement strict technical and organizational security standards to protect your digital manifest data and personal information from unauthorized access, use, or disclosure. Our system utilizes data encryption and role-based access control (e.g., only authorized Operators and Supervisors can modify cargo status).",

    sec5_title: "Data Retention",
    sec5_desc: "We will store your personal data and shipment history for as long as necessary to fulfill our operational service goals, or as required by applicable tax laws and civil aviation regulations.",

    sec6_title: "User Rights",
    sec6_desc: "You have the right to:",
    sec6_bullet1: "Access and review the profile information we store about you.",
    sec6_bullet2: "Request corrections or updates to inaccurate contact data.",
    sec6_bullet3: "Contact our customer service regarding the management of your cargo data.",

    sec7_title: "Changes to the Privacy Policy",
    sec7_desc: "We may update this Privacy Policy from time to time to comply with legal regulations or improvements to our operational systems. Changes will be announced through the Ekspedisi Terbanginaja web portal."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang === "id" || savedLang === "en") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["id"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
