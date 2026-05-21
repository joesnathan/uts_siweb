"use client";
import { useState, useEffect } from "react";

export default function OperationalPage() {
  // --- STATE DATA MASTER DARI DATABASE NEON ---
  const [cargoList, setCargoList] = useState<any[]>([]);

  // --- STATE MANAGEMENT BAWAAN ---
  const [view, setView] = useState<"list" | "create" | "edit" | "read">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [selectedCargo, setSelectedCargo] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showExportNotif, setShowExportNotif] = useState(false);

  // --- STATE INPUT FORM ---
  const [formAirline, setFormAirline] = useState("");
  const [formDate, setFormDate] = useState("2026-04-05");
  const [formOrigin, setFormOrigin] = useState("");
  const [formDestination, setFormDestination] = useState("");
  const [formWeight, setFormWeight] = useState("0.00");
  const [formStatus, setFormStatus] = useState("In progress");

  // --- PAGINATION & LOADING EFFECT ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const [isLoading, setIsLoading] = useState(false);

  // --- AMBIL DATA DARI DATABASE NEON via API ROUTE ---
  const fetchCargoData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/operational');
      if (response.ok) {
        const data = await response.json();
        setCargoList(data);
      } else {
        console.error("Gagal memuat data dari database Neon.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCargoData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350); 
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, filterDate, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterDate]);

  useEffect(() => {
    if (view === "create") {
      setFormAirline("");
      setFormDate("2026-05-21");
      setFormOrigin("");
      setFormDestination("");
      setFormWeight("0.00");
      setFormStatus("In progress");
    } else if (view === "edit" && selectedCargo) {
      setFormAirline(selectedCargo.airline || selectedCargo.airline_name || "");
      setFormDate(selectedCargo.date || selectedCargo.shipping_date?.split('T')[0] || "");
      setFormOrigin(selectedCargo.route ? selectedCargo.route.split(' ✈ ')[0] : (selectedCargo.origin_code || ""));
      setFormDestination(selectedCargo.route ? selectedCargo.route.split(' ✈ ')[1] : (selectedCargo.destination_code || ""));
      setFormWeight(selectedCargo.weight ? selectedCargo.weight.replace(/[^0-9.]/g, '') : String(selectedCargo.total_weight || "0"));
      setFormStatus(selectedCargo.status || selectedCargo.operational_status || "In progress");
    }
  }, [view, selectedCargo]);

  // --- LOGIKA FILTER & SEARCH ---
  const filteredData = cargoList.filter((item) => {
    const manifestId = item.id || item.manifest_id || "";
    const airlineName = item.airline || item.airline_name || "";
    const statusField = item.status || item.operational_status || "";
    const dateField = item.date || item.shipping_date || "";

    const matchSearch = manifestId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        airlineName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || statusField === filterStatus;
    const matchDate = !filterDate || dateField.includes(filterDate);
    
    return matchSearch && matchStatus && matchDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (id: string) => {
    setCargoList(cargoList.filter(item => (item.id || item.manifest_id) !== id));
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

  const handleSave = () => {
    if (!formAirline || !formOrigin || !formDestination) {
      alert("Harap isi semua field data kargo!");
      return;
    }

    if (view === "create") {
      const newCargo = {
        manifest_id: `MNF-2026-0${cargoList.length + 1}`,
        airline_name: formAirline.toUpperCase(),
        flight_code: "GA-NEW",
        shipping_date: formDate,
        origin_code: formOrigin.toUpperCase(),
        destination_code: formDestination.toUpperCase(),
        total_weight: parseFloat(formWeight),
        operational_status: formStatus,
        operator_name: "Admin Logistik"
      };
      setCargoList([newCargo, ...cargoList]);
    } else if (view === "edit" && selectedCargo) {
      const targetId = selectedCargo.id || selectedCargo.manifest_id;
      setCargoList(cargoList.map(item => 
        (item.id || item.manifest_id) === targetId
          ? {
              ...item,
              airline_name: formAirline.toUpperCase(),
              shipping_date: formDate,
              origin_code: formOrigin.toUpperCase(),
              destination_code: formDestination.toUpperCase(),
              total_weight: parseFloat(formWeight),
              operational_status: formStatus
            }
          : item
      ));
    }
    setView("list");
  };

  // --- VIEW: CREATE / EDIT ---
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
              <input type="text" disabled value={view === "edit" ? (selectedCargo?.id || selectedCargo?.manifest_id) : "MNF-2026-NEW"} className="w-full p-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Flight / Airline Name</label>
              <input type="text" value={formAirline} onChange={(e) => setFormAirline(e.target.value)} placeholder="e.g. GARUDA INDONESIA" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Date</label>
              <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="outline-none bg-gray-50 border border-gray-100 rounded-md px-3 py-1.5 w-1/2 font-bold text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Route (Origin &rarr; Destination)</label>
              <div className="flex items-center gap-2">
                <input type="text" value={formOrigin} onChange={(e) => setFormOrigin(e.target.value)} placeholder="CGK" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 text-center uppercase" />
                <span className="text-gray-400 font-bold">&rarr;</span>
                <input type="text" value={formDestination} onChange={(e) => setFormDestination(e.target.value)} placeholder="DPS" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 text-center uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Total Weight</label>
              <div className="flex items-center gap-2">
                <input type="number" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} className="text-right outline-none bg-gray-50 border border-gray-100 rounded-md px-3 py-1.5 w-full font-bold text-gray-800" />
                <span className="text-sm font-bold text-gray-400">kg</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Operational Status</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setFormStatus("In progress")} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${formStatus === "In progress" ? "bg-blue-100 text-blue-700 border-blue-300 shadow-sm" : "bg-gray-50 text-gray-400 border-gray-200 opacity-60"}`}>IN PROGRESS</button>
                <button type="button" onClick={() => setFormStatus("Completed")} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${formStatus === "Completed" ? "bg-green-100 text-green-700 border-green-300 shadow-sm" : "bg-gray-50 text-gray-400 border-gray-200 opacity-60"}`}>COMPLETED</button>
                <button type="button" onClick={() => setFormStatus("Pending")} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${formStatus === "Pending" ? "bg-amber-100 text-amber-700 border-amber-300 shadow-sm" : "bg-gray-50 text-gray-400 border-gray-200 opacity-60"}`}>PENDING</button>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => setView("list")} className="flex-1 py-3 bg-gray-100 rounded-xl text-xs font-black text-gray-600 uppercase tracking-wider hover:bg-gray-200 transition-colors">Cancel</button>
              <button type="button" onClick={handleSave} className="flex-1 py-3 bg-white text-white rounded-xl text-xs font-black uppercase tracking-wider bg-[#0a2a66] hover:bg-blue-950 transition-colors shadow-lg">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: MAIN LIST ---
  return (
    <div className="p-8 bg-gray-50 font-[Arial,sans-serif] min-h-screen relative">
      
      {/* TOAST EXPORT SUCCESS (SVG Checked Replacing Emoji) */}
      {showExportNotif && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <svg className="w-6 h-6 flex-shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-black text-sm">Export Success!</p>
            <p className="text-[11px] opacity-90">Manifest database data has been downloaded.</p>
          </div>
        </div>
      )}

      {/* MODAL DIALOG DELETE (SVG Trash Replacing Emoji) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl border border-gray-50 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3 text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-black text-gray-800 mb-1">Delete Cargo?</h3>
            <p className="text-xs text-gray-400 mb-6">Data {showDeleteConfirm} akan dihapus secara permanen dari server.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 rounded-2xl text-xs font-black text-gray-500">CANCEL</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-200">YES</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0a2a66] tracking-tight">Operational</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Role: Operator Terminal</p>
        </div>
        
        {/* INTERFACE FILTER & DOWNLOAD ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" onChange={(e) => setFilterDate(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black shadow-sm outline-none cursor-pointer text-gray-700" />
          <select onChange={(e) => setFilterStatus(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black shadow-sm outline-none cursor-pointer text-gray-700">
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In progress">In progress</option>
            <option value="Pending">Pending</option>
          </select>
          <button onClick={() => setView("create")} className="bg-[#0a2a66] text-white rounded-xl px-5 py-2 text-[10px] font-black shadow-lg hover:bg-blue-900 transition-colors">+ NEW MANIFEST</button>
          
          <button onClick={handleExport} className="bg-[#0a2a66] text-white rounded-xl px-5 py-2 text-[10px] font-black shadow-lg flex items-center gap-1.5 uppercase active:scale-95 transition-transform">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* FORM PENCARIAN (SVG Search Replacing Emoji) */}
      <div className="relative mb-6">
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search Manifest ID or Flight / Airline Name..." 
          className="w-full bg-blue-50/40 border-2 border-blue-100 rounded-2xl px-14 py-4 text-sm focus:outline-none focus:border-blue-500 font-bold placeholder:text-blue-300 text-gray-800"
        />
        <span className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 text-blue-900">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>

      {/* CONTAINER TABEL UTAMA */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-base font-black text-[#0a2a66]">Manifest List</h2>
          <span className="text-xs font-bold text-gray-400 bg-gray-200/60 px-3 py-1 rounded-full">Total: {filteredData.length} items</span>
        </div>

        <div className="overflow-x-auto min-h-[220px] relative">
          
          {/* LOADING SPINNER LAYOUT */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 transition-all">
              <div className="w-9 h-9 border-4 border-[#0a2a66] border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-[11px] font-black text-[#0a2a66] uppercase tracking-wider animate-pulse">Syncing Neon Database...</p>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-wider bg-gray-50/30">
                <th className="px-6 py-4">Manifest ID</th>
                <th className="px-6 py-4">Flight / Airline</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4">Operator / User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => {
                  const manifestId = item.id || item.manifest_id || `MNF-2026-0${idx}`;
                  const airlineName = item.airline || item.airline_name || "Unknown Airline";
                  const flightCode = item.flight_code ? `(${item.flight_code})` : "";
                  const routePath = item.route || `${item.origin_code || "CGK"} - ${item.destination_code || "DPS"}`;
                  const cargoWeight = item.weight || `${Number(item.total_weight).toLocaleString('en-US')} kg`;
                  const statusLabel = item.status || item.operational_status || "Pending";
                  const operatorName = item.operator_name || "System Admin";

                  return (
                    <tr 
                      key={manifestId} 
                      className="hover:bg-blue-50/50 transition-all cursor-pointer border-b border-gray-50 last:border-0"
                      onClick={() => { setSelectedCargo(item); setView("read"); }}
                    >
                      <td className="px-6 py-5 font-black text-[#0a2a66]">{manifestId}</td>
                      <td className="px-6 py-5 whitespace-nowrap">{airlineName} {flightCode}</td>
                      <td className="px-6 py-5 text-gray-600 tracking-wider font-mono">{routePath}</td>
                      <td className="px-6 py-5 text-gray-500 whitespace-nowrap">{cargoWeight}</td>
                      
                      {/* BADGE OPERATOR */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-black border border-slate-200">
                            {operatorName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-800 font-semibold tracking-tight whitespace-nowrap max-w-[120px] truncate block">
                            {operatorName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider block text-center w-[100px] ${
                          statusLabel === 'Completed' ? 'bg-green-100 text-green-700' :
                          statusLabel === 'In progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-3.5 text-gray-400">
                          {/* SVG Edit Replacing Emoji */}
                          <button onClick={() => openEdit(item)} className="hover:text-blue-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          {/* SVG Trash Replacing Emoji */}
                          <button onClick={() => setShowDeleteConfirm(manifestId)} className="hover:text-red-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-gray-400 font-bold">No operational manifest data found in database Neon.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-gray-400 font-bold">
              Showing <span className="text-gray-700 font-black">{indexOfFirstItem + 1}</span> to <span className="text-gray-700 font-black">{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="text-gray-700 font-black">{filteredData.length}</span> manifests
            </span>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                  currentPage === 1 
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                    : "bg-white text-[#0a2a66] border border-gray-200 hover:bg-gray-50 active:scale-95"
                }`}
              >
                PREV
              </button>

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

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                  currentPage === totalPages 
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                    : "bg-white text-[#0a2a66] border border-gray-200 hover:bg-gray-50 active:scale-95"
                }`}
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}