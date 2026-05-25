"use client";

import { useState, useEffect } from "react";

interface Cargo {
  id: number;
  manifest_id: string;
  airline_name: string;
  flight_code: string;
  route: string;
  weight: number;
  flight_status: string;
  operational_status: string;
  date: string;
  scheduled_time: string;
  actual_time: string;
  gate?: string;
  items?: number;
}

export default function DashboardOperationalPage() {
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [filteredList, setFilteredList] = useState<Cargo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    manifest_id: "",
    airline_name: "",
    flight_code: "",
    route: "",
    weight: "",
    flight_status: "Scheduled",
    operational_status: "Pending",
    date: "",
    scheduled_time: "17:15",
    actual_time: "17:15",
    gate: "",
    items: ""
  });

  // READ DATA
  const fetchCargoData = async () => {
    try {
      const res = await fetch('/api/seed');
      const json = await res.json();
      if (json.success) {
        setCargoList(json.data || []);
        setFilteredList(json.data || []);
      }
    } catch (err) {
      console.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCargoData();
  }, []);

  // AUTO GENERATE MANIFEST ID
  const generateManifestId = () => {
    const year = new Date().getFullYear();
    const maxId = cargoList.length > 0 
      ? Math.max(...cargoList.map(c => {
          const num = parseInt(c.manifest_id.split('-')[2] || '0');
          return isNaN(num) ? 0 : num;
        }))
      : 0;
    
    const nextNum = (maxId + 1).toString().padStart(3, '0');
    return `MNF-${year}-${nextNum}`;
  };

  // SEARCH
  useEffect(() => {
    const filtered = cargoList.filter(cargo =>
      cargo.manifest_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.airline_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.route.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
  }, [searchTerm, cargoList]);

  // OPEN FORM (dengan auto generate jika tambah baru)
  const openForm = () => {
    if (!editingCargo) {
      setFormData(prev => ({
        ...prev,
        manifest_id: generateManifestId()
      }));
    }
    setShowForm(true);
  };

  // CREATE & UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const method = editingCargo ? "PUT" : "POST";
    let url = "/api/cargo";
    if (editingCargo) url = `/api/cargo?id=${editingCargo.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        alert(editingCargo ? "✅ Data berhasil diupdate!" : "✅ Cargo baru berhasil ditambahkan!");
        setShowForm(false);
        setEditingCargo(null);
        resetForm();
        fetchCargoData();
      } else {
        alert("❌ " + (result.error || "Gagal menyimpan"));
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      manifest_id: "", airline_name: "", flight_code: "", route: "", weight: "",
      flight_status: "Scheduled", operational_status: "Pending", date: "",
      scheduled_time: "17:15", actual_time: "17:15", gate: "", items: ""
    });
  };

  const handleEdit = (cargo: Cargo) => {
    setEditingCargo(cargo);
    setFormData({
      manifest_id: cargo.manifest_id,
      airline_name: cargo.airline_name,
      flight_code: cargo.flight_code,
      route: cargo.route,
      weight: String(cargo.weight),
      flight_status: cargo.flight_status,
      operational_status: cargo.operational_status,
      date: cargo.date,
      scheduled_time: cargo.scheduled_time,
      actual_time: cargo.actual_time || "",
      gate: cargo.gate || "",
      items: cargo.items ? String(cargo.items) : ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus cargo ini?")) return;
    try {
      await fetch(`/api/cargo?id=${id}`, { method: "DELETE" });
      fetchCargoData();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Operational Cargo Management</h2>
        
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Cari Manifest ID / Airline / Route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 border rounded-xl w-full md:w-80"
          />
          <button 
            onClick={openForm}
            className="bg-[#0a2a66] text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap"
          >
            + Tambah Cargo
          </button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold mb-6">
            {editingCargo ? "Edit Cargo" : "Tambah Cargo Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Manifest ID (Auto)</label>
              <input 
                type="text" 
                value={formData.manifest_id} 
                readOnly 
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl font-mono"
              />
            </div>

            <input type="text" placeholder="Airline Name" value={formData.airline_name} onChange={(e) => setFormData({...formData, airline_name: e.target.value})} className="border p-3 rounded-xl" required />
            <input type="text" placeholder="Flight Code" value={formData.flight_code} onChange={(e) => setFormData({...formData, flight_code: e.target.value})} className="border p-3 rounded-xl" required />
            <input type="text" placeholder="Route (CGK-DPS)" value={formData.route} onChange={(e) => setFormData({...formData, route: e.target.value})} className="border p-3 rounded-xl" required />
            <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="border p-3 rounded-xl" required />
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="border p-3 rounded-xl" required />

            <select value={formData.flight_status} onChange={(e) => setFormData({...formData, flight_status: e.target.value})} className="border p-3 rounded-xl">
              <option value="Scheduled">Scheduled</option>
              <option value="Airborne">Airborne</option>
              <option value="Landed">Landed</option>
              <option value="Delayed">Delayed</option>
            </select>

            <button type="submit" disabled={saving} className="bg-green-600 text-white py-3 rounded-xl font-bold col-span-2">
              {saving ? "Menyimpan..." : (editingCargo ? "Update Cargo" : "Simpan Cargo Baru")}
            </button>
            <button type="button" onClick={() => {setShowForm(false); setEditingCargo(null); resetForm();}} className="col-span-2 border py-3 rounded-xl">
              Batal
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Manifest ID</th>
              <th className="p-4 text-left">Airline</th>
              <th className="p-4 text-left">Route</th>
              <th className="p-4 text-center">Weight</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((cargo) => (
              <tr key={cargo.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-bold font-mono">{cargo.manifest_id}</td>
                <td className="p-4">{cargo.airline_name}</td>
                <td className="p-4">{cargo.route}</td>
                <td className="p-4 text-center">{cargo.weight} kg</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${cargo.flight_status === 'Landed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {cargo.flight_status}
                  </span>
                </td>
                <td className="p-4 text-center space-x-4">
                  <button onClick={() => handleEdit(cargo)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(cargo.id)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}