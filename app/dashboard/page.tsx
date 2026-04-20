"use client";

import { useState } from "react";

export default function DashboardPage() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState<"list" | "create" | "edit" | "read">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedCargo, setSelectedCargo] = useState<any>(null);

  // --- DATA MASTER ---
  const allCargo = [
    { id: "MNF-2026-001", airline: "Garuda (GA-888)", origin: "Surabaya (SUB)", destination: "Denpasar (DPS)", weight: "3,250 kg", items: "45 items", status: "Completed", date: "2026-04-05", time: "17:30 WIB", crew: { pilot: "ICENG BENDOT", copilot: "DIAZZ BAH", engineer: "CIPENGDIPANG", loadmaster: "BUDIMAN" } },
    { id: "MNF-2026-002", airline: "Sriwijaya Air (SJ-555)", origin: "Surabaya (SUB)", destination: "Makassar (UPG)", weight: "2,150 kg", items: "32 items", status: "In progress", date: "2026-04-05", time: "17:30 WIB" },
    { id: "MNF-2026-003", airline: "Lion Air (JT-100)", origin: "Denpasar (DPS)", destination: "Kualanamu (KNO)", weight: "1,890 kg", items: "28 items", status: "Pending", date: "2026-04-06", time: "17:30 WIB" },
  ];

  // --- LOGIKA FILTER ---
  const filteredCargo = allCargo.filter((item) => {
    const matchSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.airline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    const matchDate = !filterDate || item.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  // --- HANDLER FUNCTIONS ---
  const handleDelete = (id: string) => {
    alert(`Data ${id} berhasil dihapus!`);
    setShowDeleteConfirm(null);
  };

  const openEdit = (item: any) => {
    setSelectedCargo(item);
    setView("edit");
  };

  const openRead = (item: any) => {
    setSelectedCargo(item);
    setView("read");
  };

  // --- RENDER COMPONENT: CREATE / EDIT (Gbr 2 & 3) ---
  if (view === "create" || view === "edit") {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-in zoom-in duration-300">
        <div className={`bg-white p-10 rounded-3xl shadow-2xl border-4 ${view === 'create' ? 'border-blue-400' : 'border-gray-100'} w-full max-w-2xl relative`}>
          <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-tighter">
            {view === "create" ? "Create Your Shipment" : "Edit Your Shipment"}
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2"><strong>Manifest ID</strong> <span className="text-blue-600 font-bold">{selectedCargo?.id || "MNF-2026-NEW"}</span></div>
            <div className="flex justify-between border-b pb-2"><strong>Flight Number</strong> <input type="text" defaultValue={selectedCargo?.airline} className="text-right outline-none bg-gray-50 px-2 rounded" /></div>
            <div className="flex justify-between border-b pb-2"><strong>Route</strong> <span>CGK ➔ DPS</span></div>
            <div className="flex justify-between border-b pb-2"><strong>Total Weight</strong> <input type="text" defaultValue={selectedCargo?.weight} className="text-right outline-none" /></div>
            <div className="flex justify-between border-b pb-2"><strong>Status</strong> <span className="text-green-600 font-bold">Completed</span></div>
          </div>
          <div className="flex gap-4 mt-10">
            <button onClick={() => setView("list")} className="flex-1 py-3 bg-gray-200 font-bold rounded-xl uppercase">Cancel</button>
            <button onClick={() => { alert("Saved!"); setView("list"); }} className="flex-1 py-3 bg-[#0a2a66] text-white font-bold rounded-xl uppercase shadow-lg">Save</button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER COMPONENT: READ (Gbr 4) ---
  if (view === "read") {
    return (
      <div className="animate-in fade-in duration-500">
        <button onClick={() => setView("list")} className="mb-6 bg-[#0a2a66] text-white px-6 py-2 rounded-lg font-bold text-sm uppercase">← Back</button>
        <h2 className="text-3xl font-black text-center mb-8">Information Shipment</h2>
        
        {/* Progress Bar Gbr 4 */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 mb-8 shadow-sm">
          <h3 className="text-center font-bold mb-8 uppercase tracking-widest text-gray-400">Status Cargo</h3>
          <div className="relative flex justify-between items-center px-10">
            <div className="absolute h-1 bg-gray-200 left-20 right-20 top-4 -z-10"></div>
            <div className="absolute h-1 bg-green-500 left-20 w-[60%] top-4 -z-10"></div>
            {['SHIPMENT CREATE', 'LOADING', 'DEPARTED', 'TRANSIT', 'ARRIVED'].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md ${i < 4 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="text-[10px] font-bold mt-2 text-center w-20">{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h4 className="font-black text-blue-900 border-b mb-4 pb-2 uppercase">Flight Summary</h4>
            <div className="text-xs space-y-2">
              <p><strong>ID:</strong> {selectedCargo.id}</p>
              <p><strong>Route:</strong> {selectedCargo.origin} ➔ {selectedCargo.destination}</p>
              <p><strong>Total Weight:</strong> {selectedCargo.weight}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h4 className="font-black text-blue-900 border-b mb-4 pb-2 uppercase">Crew Assignment</h4>
            <div className="text-xs space-y-2">
              <p><strong>Pilot:</strong> {selectedCargo.crew?.pilot}</p>
              <p><strong>Copilot:</strong> {selectedCargo.crew?.copilot}</p>
              <p><strong>Load Master:</strong> {selectedCargo.crew?.loadmaster}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h4 className="font-black text-blue-900 border-b mb-4 pb-2 uppercase">Shipper & Dest</h4>
            <div className="text-xs space-y-2">
              <p><strong>Shipper:</strong> PT FURABATMAJAYA</p>
              <p><strong>Dest:</strong> PT Suka Maju Tani MBG</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER COMPONENT: MAIN LIST (Gbr 1) ---
  return (
    <div className="space-y-6 relative">
      {/* DELETE NOTIF */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-black mb-2">Delete Cargo?</h3>
            <p className="text-gray-500 text-sm mb-6">Apakah yakin akan mendelete track cargo {showDeleteConfirm}?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Operational</h1>
          <p className="text-gray-400 font-medium">Role: Operator</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <input type="date" onChange={(e) => setFilterDate(e.target.value)} className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm outline-none cursor-pointer" />
          </div>
          <select onChange={(e) => setFilterStatus(e.target.value)} className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm outline-none">
            <option value="All">Filter Status</option>
            <option value="Completed">Completed</option>
            <option value="In progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
          <button onClick={() => setView("create")} className="bg-[#0a2a66] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform">+ New Manifest</button>
        </div>
      </div>

      {/* SEARCH BAR (OTOMATIS FILTER BY ID) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
        <div className="relative w-full md:w-1/2">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search manifest, flight, or destination..." 
            className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl px-12 py-3 text-sm focus:outline-none focus:border-blue-400 transition-all font-medium"
          />
          <span className="absolute left-4 top-3.5 text-blue-400">🔍</span>
        </div>
      </div>

      {/* MANIFEST LIST TABLE */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
           <h3 className="font-black text-xl uppercase tracking-tighter">Manifest List</h3>
           <button className="bg-[#0a2a66] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">⬇ Export Data</button>
        </div>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="py-6 px-4">Manifest ID</th>
                <th className="py-6 px-4">Flight Number</th>
                <th className="py-6 px-4">Route</th>
                <th className="py-6 px-4 text-center">Total Cargo</th>
                <th className="py-6 px-4 text-center">Status</th>
                <th className="py-6 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold">
              {filteredCargo.map((item) => (
                <tr key={item.id} className="group hover:bg-blue-50/50 transition-colors cursor-pointer border-b border-gray-50 last:border-0" onClick={() => openRead(item)}>
                  <td className="py-6 px-4 text-blue-600 font-black">{item.id}</td>
                  <td className="py-6 px-4 text-gray-800">{item.airline}</td>
                  <td className="py-6 px-4 text-gray-500">{item.origin} ➔ {item.destination}</td>
                  <td className="py-6 px-4 text-center text-gray-400">{item.items}</td>
                  <td className="py-6 px-4 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(item)} className="p-2 text-orange-400 hover:bg-orange-50 rounded-lg transition-colors">✏️</button>
                      <button onClick={() => setShowDeleteConfirm(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}