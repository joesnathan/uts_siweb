"use client";

import { useState } from "react";

export default function OperationalPage() {
  // --- DATA MASTER ---
  const [cargoList, setCargoList] = useState([
    { id: "MNF-2026-04-20", airline: "GARUDA (GA-888)", date: "2026-04-20", route: "CGK ✈ DPS", weight: "3,250 kg", status: "Completed" },
    { id: "MNF-2026-04-21", airline: "SRIWIJAYA AIR (SJ-555)", date: "2026-04-21", route: "CGK ✈ SUB", weight: "2,150 kg", status: "In progress" },
    { id: "MNF-2026-04-22", airline: "LION AIR (JT-100)", date: "2026-04-22", route: "CGK ✈ KNO", weight: "1,890 kg", status: "Pending" },
  ]);

  // --- STATE MANAGEMENT ---
  const [view, setView] = useState<"list" | "create" | "edit" | "read">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [selectedCargo, setSelectedCargo] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showExportNotif, setShowExportNotif] = useState(false);

  // --- LOGIKA FILTER ---
  const filteredData = cargoList.filter((item) => {
    const matchSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    const matchDate = !filterDate || item.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

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
    setTimeout(() => setShowExportNotif(false), 3000);
  };

  // --- VIEW: CREATE / EDIT ---
  if (view === "create" || view === "edit") {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4 font-[Arial,sans-serif]">
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-[2px] border-blue-500 w-full max-w-lg animate-in zoom-in duration-300">
          <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-tight">
            {view === "create" ? "Create Your Shipment" : "Edit Your Shipment"}
          </h2>
          
          <div className="space-y-5 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-gray-700">Manifest ID</span>
              <span className="text-blue-600 font-black">{selectedCargo?.id || "MNF-2026-NEW"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <label className="font-bold text-gray-700 text-xs uppercase">Flight Number</label>
              <input type="text" placeholder="Input Flight Num..." defaultValue={selectedCargo?.airline} className="text-right outline-none bg-gray-50 border border-gray-100 rounded-md px-3 py-1.5 w-1/2 font-bold uppercase" />
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <label className="font-bold text-gray-700 text-xs uppercase">Date</label>
              <input type="date" defaultValue={selectedCargo?.date || "2026-04-21"} className="text-right outline-none bg-gray-50 border border-gray-100 rounded-md px-3 py-1.5 w-1/2 font-bold uppercase" />
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <label className="font-bold text-gray-700 text-xs uppercase">Route</label>
              <div className="flex items-center gap-2 justify-end w-1/2">
                <input type="text" className="w-14 bg-gray-50 border text-center rounded py-1 font-bold uppercase" defaultValue="CGK" />
                <span className="text-xs">➔</span>
                <input type="text" className="w-14 bg-gray-50 border text-center rounded py-1 font-bold uppercase" defaultValue="DPS" />
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <label className="font-bold text-gray-700 text-xs uppercase">Total Weight</label>
              <div className="flex items-center gap-1 justify-end w-1/2">
                 <input type="text" defaultValue={selectedCargo?.weight.split(' ')[0] || "0.00"} className="text-right outline-none bg-gray-50 border border-gray-100 rounded-md px-3 py-1.5 w-full font-bold" />
                 <span className="text-gray-400 font-bold text-xs uppercase">kg</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <label className="font-bold text-gray-700 text-xs uppercase">Status</label>
              <select defaultValue={selectedCargo?.status || "In progress"} className="bg-transparent border-none font-black text-green-600 outline-none text-right cursor-pointer uppercase">
                <option value="In progress">IN PROGRESS</option>
                <option value="Completed">COMPLETED</option>
                <option value="Pending">PENDING</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button onClick={() => setView("list")} className="flex-1 py-3 bg-gray-200 text-gray-700 font-black rounded-xl uppercase text-xs">Cancel</button>
            <button onClick={() => setView("list")} className="flex-1 py-3 bg-[#0a2a66] text-white font-black rounded-xl uppercase text-xs shadow-lg">Save</button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: READ INFO (DENGAN STEPPER) ---
  if (view === "read") {
    return (
      <div className="animate-in fade-in duration-500 font-[Arial,sans-serif]">
        <button onClick={() => setView("list")} className="mb-6 bg-[#0a2a66] text-white px-6 py-2 rounded-lg font-black text-xs uppercase shadow-md active:scale-95">← BACK</button>
        <h2 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter italic text-gray-800">Information Shipment</h2>
        
        {/* STEPPER STATUS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 mb-8 shadow-sm text-center">
            <h3 className="font-black text-gray-400 mb-8 tracking-widest text-xs uppercase">Status Cargo</h3>
            <div className="relative flex justify-between items-center px-10">
               <div className="absolute h-1 bg-gray-100 left-20 right-20 top-4 -z-10"></div>
               <div className={`absolute h-1 bg-green-500 left-20 top-4 -z-10 transition-all duration-1000 ${selectedCargo.status === 'Completed' ? 'w-[75%]' : 'w-[40%]'}`}></div>
               {['CREATE', 'LOADING', 'DEPARTED', 'TRANSIT', 'ARRIVED'].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md ${i < (selectedCargo.status === 'Completed' ? 5 : 2) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <p className="text-[8px] font-black mt-2 text-center w-14 leading-tight text-gray-500 uppercase">{s}</p>
                </div>
              ))}
            </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold text-xs">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-black text-blue-900 border-b border-blue-50 mb-4 pb-2 uppercase italic">Flight Summary</h4>
              <p className="flex justify-between mb-2 uppercase">ID: <span className="text-gray-900">{selectedCargo.id}</span></p>
              <p className="flex justify-between mb-2 uppercase">Flight: <span className="text-gray-900">{selectedCargo.airline}</span></p>
              <p className="flex justify-between uppercase">Route: <span className="text-gray-900">{selectedCargo.route}</span></p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-black text-blue-900 border-b border-blue-50 mb-4 pb-2 uppercase italic">Crew Assignment</h4>
              <p className="flex justify-between mb-2">Pilot: <span className="text-gray-900 uppercase tracking-tighter">ICENG BENDOT</span></p>
              <p className="flex justify-between">Copilot: <span className="text-gray-900 uppercase tracking-tighter">DIAZZ BAH</span></p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-black text-blue-900 border-b border-blue-50 mb-4 pb-2 uppercase italic">Shipper</h4>
              <p className="flex justify-between mb-2 uppercase">Name: <span className="text-gray-900">PT FURABATMAJAYA</span></p>
            </div>
        </div>
      </div>
    );
  }

  // --- VIEW: LIST ---
  return (
    <div className="w-full relative font-[Arial,sans-serif]">
      {/* NOTIFIKASI EXPORT BERHASIL */}
      {showExportNotif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-black text-xs uppercase tracking-widest">Export Success!</p>
              <p className="text-[10px] font-bold opacity-90">Manifest data has been downloaded.</p>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full animate-in zoom-in duration-200">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-black mb-2 tracking-tighter uppercase">Delete Cargo?</h3>
            <p className="text-gray-500 text-sm mb-8 italic uppercase">Data {showDeleteConfirm} akan dihapus permanen.</p>
            <div className="flex gap-4 font-black">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 rounded-2xl text-xs uppercase">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-xs shadow-lg uppercase">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS & BUTTONS */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* SEARCH TANGGAL */}
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black shadow-sm outline-none cursor-pointer uppercase" 
            />
            {/* FILTER STATUS */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black shadow-sm outline-none cursor-pointer uppercase"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In progress">In progress</option>
              <option value="Pending">Pending</option>
            </select>
            {/* ADD & EXPORT */}
            <button onClick={() => setView("create")} className="bg-[#0a2a66] text-white rounded-xl px-5 py-2 text-[10px] font-black shadow-lg uppercase">+ New Manifest</button>
            <button onClick={handleExport} className="bg-[#0a2a66] text-white rounded-xl px-5 py-2 text-[10px] font-black shadow-lg flex items-center gap-1 uppercase active:scale-95 transition-transform">⬇ Export</button>
          </div>
      </div>

      {/* SEARCH BAR ID */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-6">
        <div className="relative w-full md:w-1/2">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Manifest ID (MNF-2026...)" 
            className="w-full bg-blue-50/40 border-2 border-blue-100 rounded-2xl px-14 py-4 text-sm focus:outline-none focus:border-blue-500 font-bold placeholder:text-blue-300" 
          />
          <span className="absolute left-6 top-4 text-blue-400 font-bold">🔍</span>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/40">
           <h3 className="font-black text-xl uppercase tracking-tighter italic text-gray-800">Manifest List</h3>
        </div>
        <div className="overflow-x-auto px-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-6">Manifest ID</th>
                <th className="px-4 py-6">Flight / Airline</th>
                <th className="px-4 py-6 text-center">Date</th>
                <th className="px-4 py-6 text-center">Route</th>
                <th className="px-4 py-6 text-center">Weight</th>
                <th className="px-4 py-6 text-center">Status</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-black">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-blue-50/50 transition-all cursor-pointer border-b border-gray-50 last:border-0"
                    onClick={() => { setSelectedCargo(item); setView("read"); }}
                  >
                    <td className="px-6 py-6 text-blue-600 uppercase tracking-tighter">{item.id}</td>
                    <td className="px-4 py-6 uppercase">{item.airline}</td>
                    <td className="px-4 py-6 text-center text-gray-400 italic">{item.date}</td>
                    <td className="px-4 py-6 text-center text-gray-500">{item.route}</td>
                    <td className="px-4 py-6 text-center text-gray-400">{item.weight}</td>
                    <td className="px-4 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-3 text-lg">
                        <button onClick={() => openEdit(item)} className="hover:scale-125 transition-transform">✏️</button>
                        <button onClick={() => setShowDeleteConfirm(item.id)} className="hover:scale-125 transition-transform">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-gray-300 font-black uppercase italic tracking-widest">
                    Data Not Found ✈️
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}