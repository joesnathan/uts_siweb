"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  sender: string;
  role: string;
  date: string;
  description: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function HelpDeskPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Initial mock tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TK-9021",
      title: "Sinkronisasi Database Terhambat pada Neon Postgres",
      category: "Database & System",
      priority: "High",
      status: "Open",
      sender: "Jonathan",
      role: "Supervisor Operasional",
      date: "2026-06-09 20:15",
      description: "Terdapat jeda sinkronisasi data kargo aktif sekitar 3 detik pada cluster Neon Postgres Asia. Mohon diperiksa pooler-nya.",
    },
    {
      id: "TK-8842",
      title: "Format Status Manifest ID MNF-2026-004 Tidak Sesuai",
      category: "AWB Tracking",
      priority: "Medium",
      status: "In Progress",
      sender: "Budi",
      role: "Operator Cargo",
      date: "2026-06-09 18:30",
      description: "Saat mencari manifest MNF-2026-004, status penerbangan tertulis Landed tetapi status operasional masih In Transit. Mohon dibantu koreksi.",
    },
    {
      id: "TK-7721",
      title: "Masalah Printer Label Cargo di Warehouse A",
      category: "Hardware / Devices",
      priority: "Low",
      status: "Resolved",
      sender: "Susi",
      role: "Warehouse Staff",
      date: "2026-06-08 14:10",
      description: "Printer label tidak mencetak barcode untuk manifest baru. Kabel LAN terhubung normal.",
    },
  ]);

  // Form states
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Database & System");
  const [ticketDescription, setTicketDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // FAQ Expand state
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth Protection Check & Simulated Loading Timer
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      router.push("/login");
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  // Submit New Ticket Form with Automatic Urgency Classification
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDescription.trim()) {
      showToast("Judul dan deskripsi wajib diisi!", "error");
      return;
    }

    setSubmitting(true);
    
    // Simulate API request delay
    setTimeout(() => {
      // Automatic Priority Determination based on category and description keywords
      let priority: "Low" | "Medium" | "High" = "Low";
      const searchStr = (ticketTitle + " " + ticketDescription).toLowerCase();
      const highPriorityKeywords = [
        "error", "down", "mati", "terhambat", "darurat", "urgent", "db", "database", "neon", "server", "terputus", "rusak", "critical"
      ];
      const mediumPriorityKeywords = [
        "format", "printer", "sync", "scanner", "lan", "kabel", "status", "tidak sesuai", "hambatan"
      ];
      
      if (
        ticketCategory === "Database & System" || 
        highPriorityKeywords.some(keyword => searchStr.includes(keyword))
      ) {
        priority = "High";
      } else if (
        ticketCategory === "AWB Tracking" || 
        ticketCategory === "Hardware / Devices" ||
        mediumPriorityKeywords.some(keyword => searchStr.includes(keyword))
      ) {
        priority = "Medium";
      }

      const nextIdNum = Math.floor(1000 + Math.random() * 9000);
      const newTicket: Ticket = {
        id: `TK-${nextIdNum}`,
        title: ticketTitle.trim(),
        category: ticketCategory,
        priority: priority,
        status: "Open",
        sender: user?.full_name || "Jonathan",
        role: user?.department || "Supervisor Operasional",
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        description: ticketDescription.trim(),
      };

      setTickets([newTicket, ...tickets]);
      setTicketTitle("");
      setTicketDescription("");
      setSubmitting(false);
      showToast(`Tiket ${newTicket.id} dikirim dengan prioritas ${priority}!`, "success");
    }, 800);
  };

  // FAQ dummy data
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Bagaimana cara melacak manifest kargo yang tidak ditemukan?",
      answer: "Pastikan format manifest ID benar (Contoh: MNF-2026-001). Jika format sudah benar namun masih muncul status 'NOT FOUND', periksa apakah data kargo sudah di-input oleh maskapai di database. Jika belum, Anda dapat membuat tiket kendala AWB di sini.",
    },
    {
      id: 2,
      question: "Bagaimana cara mengubah status operasional penerbangan?",
      answer: "Masuk ke halaman 'Operational', cari manifest ID kargo yang ingin Anda ubah, lalu klik baris kargo tersebut untuk membuka formulir edit. Di sana Anda dapat memperbarui flight status (Scheduled, Airborne, Landed, Delayed) dan operational status (In Transit, Completed).",
    },
    {
      id: 3,
      question: "Siapa yang harus dihubungi dalam kondisi IT darurat?",
      answer: "Anda dapat mengirimkan tiket dengan tingkat prioritas 'High' untuk respon cepat dalam waktu 15 menit dari tim IT Shift Bandara Soedirman.",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] w-full bg-white border border-gray-100 rounded-[2.5rem] p-12 relative overflow-hidden shadow-xl shadow-gray-100/50 animate-in fade-in duration-500">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#0a2a66_1px,transparent_1px),linear-gradient(to_bottom,#0a2a66_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        {/* Concentric radar loading pulses */}
        <div className="relative z-10 w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-3 border-2 border-blue-500/15 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-6 border border-blue-400/20 rounded-full animate-pulse"></div>
          
          {/* Glowing Glassmorphic Cargo Scope */}
          <div className="w-16 h-16 bg-gradient-to-tr from-[#0a2a66] to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_45%,rgba(255,255,255,0.35)_100%)] animate-spin" style={{ animationDuration: '2.5s' }}></div>
            {/* Clean Cargo Plane SVG */}
            <svg className="w-8 h-8 text-white relative z-10 drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5M21 12l-5-2-4-5H9l2 5-5 1-2-2H2l1 3 3 1 12 3 5-3z" />
            </svg>
          </div>
        </div>

        {/* Dynamic status text */}
        <div className="relative z-10 text-center max-w-sm">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Securing Connection
          </span>
          <h2 className="text-[#0a2a66] font-black text-xl tracking-tighter mt-4 uppercase italic">Terbanginaja Logistics</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2.5 flex items-center justify-center gap-1.5 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Syncing cargo flight GPS from Neon database...
          </p>
        </div>

        {/* Glowing Dynamic Slide Progress bar */}
        <div className="relative z-10 w-60 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-8 border border-gray-200/50 p-[1px]">
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-[loadingSlide_2.5s_ease-in-out_infinite]"></div>
        </div>

        <style>{`
          @keyframes loadingSlide {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 60%; margin-left: 20%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[999] flex items-center p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
          toast.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-800" 
            : "bg-rose-500/10 border-rose-500/25 text-rose-800"
        }`}>
          <span className="text-xs font-black uppercase tracking-wider">{toast.message}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Open Ticket Form (Centerpiece) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-150 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
            
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-[#0a2a66] uppercase italic tracking-tight">Buka Tiket Bantuan Baru</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                Kirim kendala teknis atau permintaan peralatan kepada Tim IT Support Bandara
              </p>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="text-[8px] font-black uppercase tracking-wider text-gray-400 block mb-1">Subjek / Judul Kendala</label>
                <input
                  type="text"
                  placeholder="Contoh: Koneksi Scanner Barcode Warehouse B Terputus"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="text-[8px] font-black uppercase tracking-wider text-gray-400 block mb-1">Kategori Masalah</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 cursor-pointer"
                >
                  <option value="Database & System">Database & System</option>
                  <option value="AWB Tracking">AWB Tracking</option>
                  <option value="Hardware / Devices">Hardware / Devices</option>
                  <option value="Cargo & Flight Policy">Cargo & Flight Policy</option>
                </select>
              </div>

              <div>
                <label className="text-[8px] font-black uppercase tracking-wider text-gray-400 block mb-1">Detail Rincian Kendala</label>
                <textarea
                  rows={6}
                  placeholder="Jelaskan secara detail kronologi masalah, manifest kargo terdampak, atau lokasi fisik alat yang bermasalah..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0a2a66] hover:bg-blue-900 disabled:opacity-55 text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {submitting ? "Mengirim Tiket..." : "Kirim Tiket Bantuan"}
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* RIGHT COLUMN: Ticket History List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-150 rounded-[2rem] p-6 shadow-sm flex flex-col h-[520px]">
            
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-sm font-black text-[#0a2a66] uppercase italic tracking-wider">Histori Tiket Bantuan Anda</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">List of support requests opened by you</p>
            </div>

            {/* Ticket List Scrollable Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {tickets.length > 0 ? (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 border border-gray-100 rounded-2xl flex flex-col space-y-2.5 relative overflow-hidden bg-white"
                  >
                    {/* Urgency side indicator */}
                    <span className={`absolute left-0 top-0 bottom-0 w-1 ${
                      t.priority === "High"
                        ? "bg-red-500"
                        : t.priority === "Medium"
                          ? "bg-amber-400"
                          : "bg-blue-400"
                    }`}></span>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          {t.id}
                        </span>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">
                          {t.category}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        t.status === "Open"
                          ? "bg-blue-100 text-blue-800"
                          : t.status === "In Progress"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-gray-800 leading-snug">
                      {t.title}
                    </h4>

                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                      {t.description}
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold border-t border-gray-50 pt-2">
                      <span className="text-gray-500 uppercase">
                        Urgensi: <b className={t.priority === "High" ? "text-red-600" : "text-gray-600"}>{t.priority}</b>
                      </span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs font-bold uppercase">Belum ada tiket bantuan yang dibuka</p>
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: FAQ Accordion */}
      <div className="bg-white border border-gray-150 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-sm font-black text-[#0a2a66] uppercase italic tracking-wider flex items-center gap-1.5">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Tanya Jawab Kendala Umum (FAQ)
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Frequently asked questions & SOP documentation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqs.map((faq) => {
            const isOpen = expandedFaqId === faq.id;
            return (
              <div key={faq.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50/20">
                <button
                  onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors flex justify-between items-center"
                >
                  <span className="text-xs font-black text-gray-800 leading-snug">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="p-4 bg-white border-t border-gray-50 text-[11px] font-bold text-gray-500 leading-relaxed font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
