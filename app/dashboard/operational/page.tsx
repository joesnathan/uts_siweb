"use client";
import { useState, useEffect } from "react";

export default function OperationalPage() {
  // --- DATA MASTER (State Utama agar CRUD & Pagination Sinkron) ---
  const [cargoList, setCargoList] = useState([
    { id: "MNF-2026-001", airline: "GARUDA (GA-888)", date: "2026-04-05", route: "CGK ✈ DPS", weight: "3,250 kg", status: "Completed" },
    { id: "MNF-2026-002", airline: "SRIWIJAYA AIR (SJ-555)", date: "2026-04-05", route: "CGK ✈ SUB", weight: "2,150 kg", status: "In progress" },
    { id: "MNF-2026-003", airline: "LION AIR (JT-100)", date: "2026-04-06", route: "CGK ✈ KNO", weight: "1,890 kg", status: "Pending" },
    { id: "MNF-2026-004", airline: "BATIK AIR (ID-600)", date: "2026-04-06", route: "CGK ✈ SIN", weight: "4,120 kg", status: "Completed" },
    { id: "MNF-2026-005", airline: "CITILINK (QG-210)", date: "2026-04-07", route: "CGK ✈ JOG", weight: "950 kg", status: "In progress" },
    { id: "MNF-2026-006", airline: "AIRASIA (QZ-777)", date: "2026-04-07", route: "CGK ✈ BPN", weight: "1,500 kg", status: "Pending" },
    { id: "MNF-2026-007", airline: "GARUDA (GA-999)", date: "2026-04-08", route: "CGK ✈ KUL", weight: "2,800 kg", status: "Completed" },
    { id: "MNF-2026-008", airline: "SRIWIJAYA AIR (SJ-333)", date: "2026-04-08", route: "CGK ✈ MNL", weight: "3,600 kg", status: "In progress" },
    { id: "MNF-2026-009", airline: "LION AIR (JT-200)", date: "2026-04-09", route: "CGK ✈ DPS", weight: "2,450 kg", status: "Pending" },
    { id: "MNF-2026-010", airline: "BATIK AIR (ID-700)", date: "2026-04-09", route: "CGK ✈ SUB", weight: "1,750 kg", status: "Completed" },
    { id: "MNF-2026-011", airline: "CITILINK (QG-310)", date: "2026-04-10", route: "CGK ✈ KNO", weight: "2,300 kg", status: "In progress" },
    { id: "MNF-2026-012", airline: "AIRASIA (QZ-888)", date: "2026-04-10", route: "CGK ✈ SIN", weight: "3,900 kg", status: "Pending" },
  ]);

  // --- STATE MANAGEMENT BAWAAN ---
  const [view, setView] = useState<"list" | "create" | "edit" | "read">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [selectedCargo, setSelectedCargo] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showExportNotif, setShowExportNotif] = useState(false);

  // --- STATE BARU: MEMBAWAKAN DATA INPUT FORM ---
  const [formAirline, setFormAirline] = useState("");
  const [formDate, setFormDate] = useState("2026-04-05");
  const [formOrigin, setFormOrigin] = useState("");
  const [formDestination, setFormDestination] = useState("");
  const [formWeight, setFormWeight] = useState("0.00");
  const [formStatus, setFormStatus] = useState("In progress");

  // --- UNGUIDED STATE: PAGINATION & LOADING EFFECT ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 
  const [isLoading, setIsLoading] = useState(false);

  // Efek Loading Otomatis saat user mengetik search, mengubah filter, atau klik halaman baru
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); 
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, filterDate, currentPage]);

  // Kembalikan ke halaman 1 jika user melakukan filter atau pencarian baru
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterDate]);

  // Reset form ke default setiap kali pindah ke view "create" atau "edit"
  useEffect(() => {
    if (view === "create") {
      setFormAirline("");
      setFormDate("2026-04-05");
      setFormOrigin("");
      setFormDestination("");
      setFormWeight("0.00");
      setFormStatus("In progress");
    } else if (view === "edit" && selectedCargo) {
      setFormAirline(selectedCargo.airline);
      setFormDate(selectedCargo.date);
      setFormOrigin(selectedCargo.route ? selectedCargo.route.split(' ✈ ')[0] : "");
      setFormDestination(selectedCargo.route ? selectedCargo.route.split(' ✈ ')[1] : "");
      setFormWeight(selectedCargo.weight ? selectedCargo.weight.split(' ')[0] : "0.00");
      setFormStatus(selectedCargo.status);
    }
  }, [view, selectedCargo]);

  // --- LOGIKA FILTER & SEARCH ---
  const filteredData = cargoList.filter((item) => {
    const matchSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.airline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    const matchDate = !filterDate || item.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  // --- LOGIKA UTAMA PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // --- HANDLER FUNCTIONS ---
  const handleDelete = (id: string) => {
    setCargoList(cargoList.filter(item => item.id !== id));
    setShowDeleteConfirm(null);
  };

  const openEdit = (item: any) => {
    setSelectedCargo(item);
    setView("edit");
  };

  const handleExport = () => {
    setShowExportNotif(true);
    setTimeout(() => {
      setShowExportNotif(false);
    }, 3000);
  };

  // --- HANDLER BARU: MENYIMPAN DATA (CREATE & EDIT) ---
  const handleSave = () => {
    if (!formAirline || !formOrigin || !formDestination) {
      alert("Harap isi semua field data kargo!");
      return;
    }

    if (view === "create") {
      // Logika Membuat Manifest ID Baru Secara Otomatis
      const newId = `MNF-2026-00${cargoList.length + 1}`;
      const newCargo = {
        id: newId,
        airline: formAirline.toUpperCase(),
        date: formDate,
        route: `${formOrigin.toUpperCase()} ✈ ${formDestination.toUpperCase()}`,
        weight: `${parseFloat(formWeight).toLocaleString('en-US')} kg`,
        status: formStatus
      };
      setCargoList([newCargo, ...cargoList]); // Taruh data baru di paling atas tabel
    } else if (view === "edit" && selectedCargo) {
      // Logika Meng-update Data Lama Berdasarkan ID
      setCargoList(cargoList.map(item => 
        item.id === selectedCargo.id 
          ? {
              ...item,
              airline: formAirline.toUpperCase(),
              date: formDate,
              route: `${formOrigin.toUpperCase()} ✈ ${formDestination.toUpperCase()}`,
              weight: `${parseFloat(formWeight).toLocaleString('en-US')} kg`,
              status: formStatus
            }
          : item
      ));
    }

    setView("list"); // Kembali ke tabel utama
  };

  // ==========================================
  // --- VIEW: CREATE / EDIT (DIPERBAIKI STRUKTUR INPUTNYA) ---
  // ==========================================
  if (view === "create" || view === "edit") {
    return (
      <div className="p-8 bg-gray-50 font-[Arial,sans-serif] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 w-full max-w-lg">
          <h2 className="text-xl font-black text-[#0a2a66] mb-6">
            {view === "create" ? "Create Your Shipment" : "Edit Your Shipment"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Manifest ID</label>
              <input type="text" disabled value={view === "edit" ? selectedCargo?.id : "MNF-2026-NEW"} className="w-full p-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Flight Number</label>
              <input type="text" value={formAirline} onChange={(e) => setFormAirline(e.target.value)} placeholder="e.g. GARUDA (GA-888)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Date</label>
              <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="text-right outline-none bg-gray-50 border border-gray-100 rounded-md px-3 py-1.5 w-1/2 font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Route</label>
              <div className="flex items-center gap-2">
                <input type="text" value={formOrigin} onChange={(e) => setFormOrigin(e.target.value)} placeholder="CGK" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 text-center uppercase" />
                <span>➔</span>
                <input type="text" value={formDestination} onChange={(e) => setFormDestination(e.target.value)} placeholder="DPS" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 text-center uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Total Weight</label>
              <div className="flex items-center gap-2">
                <input type="number" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} className="text-right outline-none bg-gray-50 border border-gray-100 rounded-md px-3 py-1.5 w-full font-bold" />
                <span className="text-sm font-bold text-gray-400">kg</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Status</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setFormStatus("In progress")} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${formStatus === "In progress" ? "bg-blue-100 text-blue-700 border-blue-300 shadow-sm" : "bg-gray-50 text-gray-400 border-gray-200 opacity-60"}`}>IN PROGRESS</button>
                <button type="button" onClick={() => setFormStatus("Completed")} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${formStatus === "Completed" ? "bg-green-100 text-green-700 border-green-300 shadow-sm" : "bg-gray-50 text-gray-400 border-gray-200 opacity-60"}`}>COMPLETED</button>
                <button type="button" onClick={() => setFormStatus("Pending")} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${formStatus === "Pending" ? "bg-amber-100 text-amber-700 border-amber-300 shadow-sm" : "bg-gray-50 text-gray-400 border-gray-200 opacity-60"}`}>PENDING</button>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => setView("list")} className="flex-1 py-3 bg-gray-100 rounded-xl text-xs font-black text-gray-600 uppercase tracking-wider hover:bg-gray-200 transition-colors">Cancel</button>
              <button type="button" onClick={handleSave} className="flex-1 py-3 bg-[#0a2a66] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-950 transition-colors shadow-lg">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // --- VIEW: LIST (DENGAN SEARCH, PAGINATION & LOADING) ---
  // ==========================================
  return (
    <div className="p-8 bg-gray-50 font-[Arial,sans-serif] min-h-screen relative">
      
      {/* TOAST NOTIFIKASI EXPORT */}
      {showExportNotif && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-black text-sm">Export Success!</p>
            <p className="text-[11px] opacity-90">Manifest data has been downloaded.</p>
          </div>
        </div>
      )}

      {/* CONFIRMATION DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl border border-gray-50">
            <span className="text-4xl block mb-2">🗑️</span>
            <h3 className="text-base font-black text-gray-800 mb-1">Delete Cargo?</h3>
            <p className="text-xs text-gray-400 mb-6">Data {showDeleteConfirm} akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 rounded-2xl text-xs font-black text-gray-500">CANCEL</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-200">YES</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0a2a66] tracking-tight">Operational</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Role: Operator</p>
        </div>
        
        {/* FILTERS & ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" onChange={(e) => setFilterDate(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black shadow-sm outline-none cursor-pointer" />
          <select onChange={(e) => setFilterStatus(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black shadow-sm outline-none cursor-pointer">
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In progress">In progress</option>
            <option value="Pending">Pending</option>
          </select>
          <button onClick={() => setView("create")} className="bg-[#0a2a66] text-white rounded-xl px-5 py-2 text-[10px] font-black shadow-lg">+ NEW MANIFEST</button>
          <button onClick={handleExport} className="bg-[#0a2a66] text-white rounded-xl px-5 py-2 text-[10px] font-black shadow-lg flex items-center gap-1 uppercase active:scale-95 transition-transform">⬇ Export</button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6">
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search Manifest ID or Flight Number..." 
          className="w-full bg-blue-50/40 border-2 border-blue-100 rounded-2xl px-14 py-4 text-sm focus:outline-none focus:border-blue-500 font-bold placeholder:text-blue-300 text-gray-800"
        />
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-40">🔍</span>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-base font-black text-[#0a2a66]">Manifest List</h2>
          <span className="text-xs font-bold text-gray-400 bg-gray-200/60 px-3 py-1 rounded-full">Total: {filteredData.length} items</span>
        </div>

        {/* AREA TABEL DENGAN OVERLAY LOADING EFECT */}
        <div className="overflow-x-auto min-h-[220px] relative">
          
          {/*Loading Spinner Component */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 transition-all">
              <div className="w-9 h-9 border-4 border-[#0a2a66] border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-[11px] font-black text-[#0a2a66] uppercase tracking-wider animate-pulse">Loading Manifest...</p>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-wider bg-gray-50/30">
                <th className="px-6 py-4">Manifest ID</th>
                <th className="px-6 py-4">Flight Number</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-blue-50/50 transition-all cursor-pointer border-b border-gray-50 last:border-0"
                    onClick={() => { setSelectedCargo(item); setView("read"); }}
                  >
                    <td className="px-6 py-5 font-black text-[#0a2a66]">{item.id}</td>
                    <td className="px-6 py-5">{item.airline}</td>
                    <td className="px-6 py-5 text-gray-600">{item.route}</td>
                    <td className="px-6 py-5 text-gray-500">{item.weight}</td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'In progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-3">
                        <button onClick={() => openEdit(item)} className="hover:scale-125 transition-transform">✏️</button>
                        <button onClick={() => setShowDeleteConfirm(item.id)} className="hover:scale-125 transition-transform">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-gray-400 font-bold">No manifest data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/*INTERFACE NAVIGASI PAGINATION */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-gray-400 font-bold">
              Showing <span className="text-gray-700 font-black">{indexOfFirstItem + 1}</span> to <span className="text-gray-700 font-black">{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="text-gray-700 font-black">{filteredData.length}</span> manifests
            </span>
            
            <div className="flex items-center gap-1">
              {/* Button Previous */}
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                  currentPage === 1 
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                    : "bg-white text-[#0a2a66] border border-gray-200 hover:bg-gray-50 active:scale-95"
                }`}
              >
                ◀ PREV
              </button>

              {/* Halaman Berupa Angka Dinamis */}
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                    currentPage === idx + 1
                      ? "bg-[#0a2a66] text-white shadow-md shadow-blue-900/10"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              {/* Button Next */}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                  currentPage === totalPages 
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                    : "bg-white text-[#0a2a66] border border-gray-200 hover:bg-gray-50 active:scale-95"
                }`}
              >
                NEXT ▶
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}