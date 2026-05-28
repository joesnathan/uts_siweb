"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. IMPORT USEROUTER DARI NEXT.JS

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

  // TAMBAHAN DOSEN
  sender_name?: string;
  receiver_name?: string;
  phone_number?: string;
  origin_city?: string;
  destination_city?: string;
  item_type?: string;
  shipping_price?: string;
  shipping_type?: string;
  description?: string;
}

export default function DashboardOperationalPage() {
  const router = useRouter(); // 2. INISIALISASI ROUTER
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [filteredList, setFilteredList] = useState<Cargo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
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
    items: "",

    // TAMBAHAN DOSEN
    sender_name: "",
    receiver_name: "",
    phone_number: "",
    origin_city: "",
    destination_city: "",
    item_type: "",
    shipping_price: "",
    shipping_type: "Regular",
    description: "",
  });

  // ================= READ DATA =================
  const fetchCargoData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cargo");
      const json = await res.json();
      if (json.success) {
        setCargoList(json.data || []);
        setFilteredList(json.data || []);
      } else {
        setError(json.error || "Gagal menyelaraskan data dengan database Neon.");
      }
    } catch (err) {
      setError("Gagal terhubung ke database. Periksa koneksi internet Anda.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCargoData();
  }, []);

  // ================= AUTO GENERATE MANIFEST =================
  const generateManifestId = () => {
    const year = new Date().getFullYear();

    const maxId =
      cargoList.length > 0
        ? Math.max(
            ...cargoList.map((c) => {
              const num = parseInt(c.manifest_id.split("-")[2] || "0");
              return isNaN(num) ? 0 : num;
            })
          )
        : 0;

    const nextNum = (maxId + 1).toString().padStart(3, "0");

    return `MNF-${year}-${nextNum}`;
  };

  // ================= AUTO PRICE =================
  const calculateShippingPrice = (weight: string, shippingType: string) => {
    const weightNumber = Number(weight);

    if (!weightNumber) return "";

    let pricePerKg = 0;

    switch (shippingType) {
      case "Regular":
        pricePerKg = 10000;
        break;
      case "Express":
        pricePerKg = 15000;
        break;
      case "VVIP":
        pricePerKg = 25000;
        break;
      default:
        pricePerKg = 10000;
    }

    return String(weightNumber * pricePerKg);
  };

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = cargoList.filter(
      (cargo) =>
        cargo.manifest_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cargo.airline_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cargo.route.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchTerm, cargoList]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= OPEN FORM =================
  const openForm = () => {
    setEditingCargo(null);

    setFormData({
      manifest_id: generateManifestId(),
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
      items: "",
      sender_name: "",
      receiver_name: "",
      phone_number: "",
      origin_city: "",
      destination_city: "",
      item_type: "",
      shipping_price: "",
      shipping_type: "Regular",
      description: "",
    });

    setShowForm(true);
  };

  // ================= CREATE & UPDATE =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const method = editingCargo ? "PUT" : "POST";
    const url = editingCargo ? `/api/cargo?id=${editingCargo.id}` : "/api/cargo";

    // ✅ FIX: Sanitize field integer — konversi "" jadi null agar tidak error di database
    const payload = {
      ...formData,
      weight: formData.weight !== "" ? Number(formData.weight) : null,
      items: formData.items !== "" ? Number(formData.items) : null,
      shipping_price: formData.shipping_price !== "" ? Number(formData.shipping_price) : null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // ✅ kirim payload bukan formData
      });

      const result = await res.json();

      if (result.success) {
        alert(
          editingCargo
            ? "✅ Data berhasil diupdate!"
            : "✅ Cargo baru berhasil ditambahkan!"
        );

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

  // ================= RESET FORM =================
  const resetForm = () => {
    setFormData({
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
      items: "",
      sender_name: "",
      receiver_name: "",
      phone_number: "",
      origin_city: "",
      destination_city: "",
      item_type: "",
      shipping_price: "",
      shipping_type: "Regular",
      description: "",
    });
  };

  // ================= EDIT =================
  const handleEdit = (cargo: Cargo) => {
    setEditingCargo(cargo);

    const shippingType = cargo.shipping_type || "Regular";
    const weightValue = cargo.weight ? String(cargo.weight) : "";
    const autoPrice = calculateShippingPrice(weightValue, shippingType);

    setFormData({
      manifest_id: cargo.manifest_id || "",
      airline_name: cargo.airline_name || "",
      flight_code: cargo.flight_code || "",
      route: cargo.route || "",
      weight: weightValue,
      flight_status: cargo.flight_status || "Scheduled",
      operational_status: cargo.operational_status || "Pending",
      date: cargo.date || "",
      scheduled_time: cargo.scheduled_time || "17:15",
      actual_time: cargo.actual_time || "17:15",
      gate: cargo.gate || "",
      items: cargo.items ? String(cargo.items) : "",
      sender_name: cargo.sender_name || "",
      receiver_name: cargo.receiver_name || "",
      phone_number: cargo.phone_number || "",
      origin_city: cargo.origin_city || "",
      destination_city: cargo.destination_city || "",
      item_type: cargo.item_type || "",
      shipping_type: shippingType,
      shipping_price: cargo.shipping_price
        ? String(cargo.shipping_price)
        : autoPrice,
      description: cargo.description || "",
    });

    setShowForm(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus cargo ini?")) return;

    try {
      await fetch(`/api/cargo?id=${id}`, {
        method: "DELETE",
      });

      fetchCargoData();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

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
            {/* Box outline SVG */}
            <svg className="w-6.5 h-6.5 text-white relative z-10 drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        {/* Dynamic status text */}
        <div className="relative z-10 text-center max-w-sm">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Loading Manifest
          </span>
          <h2 className="text-[#0a2a66] font-black text-xl tracking-tighter mt-4 uppercase italic">Terbanginaja Logistics</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2.5 flex items-center justify-center gap-1.5 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Loading operational manifest database & shipping slots...
          </p>
        </div>

        {/* Glowing Dynamic Slide Progress bar */}
        <div className="relative z-10 w-60 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-8 border border-gray-200/50 p-[1px]">
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-[loadingSlide_2.5s_ease-in-out_infinite]"></div>
        </div>

        {/* Dynamic Keyframes loading animation */}
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
    <div className="space-y-6">
      {/* 404-STYLE ERROR CONTENT AREA FOR DATABASE CONNECTION FAILURE */}
      {error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl text-center space-y-6 max-w-2xl mx-auto mt-8 animate-in zoom-in duration-500">
          <div className="flex justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-none uppercase italic">
            Database Sync Failed
          </h2>
          <p className="text-sm font-bold text-gray-500">
            {error || "Could not complete handshake with Neon cloud Postgres Singapore cluster."}
          </p>
          <button
            onClick={fetchCargoData}
            className="bg-[#0a2a66] hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl text-xs transition-all shadow-md active:scale-95 uppercase tracking-wider"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-2xl font-bold">Operational Cargo Management</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Cari Manifest ID / Airline / Route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 h-[56px] px-4 border border-gray-300 rounded-xl outline-none"
          />

          <button
            onClick={openForm}
            className="bg-[#0a2a66] text-white px-6 h-[56px] rounded-xl font-bold whitespace-nowrap hover:opacity-90 transition"
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

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              value={formData.manifest_id}
              readOnly
              className="w-full h-[56px] px-4 bg-gray-100 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="Airline Name"
              value={formData.airline_name}
              onChange={(e) =>
                setFormData({ ...formData, airline_name: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="Flight Code"
              value={formData.flight_code}
              onChange={(e) =>
                setFormData({ ...formData, flight_code: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="Route"
              value={formData.route}
              onChange={(e) =>
                setFormData({ ...formData, route: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="number"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={(e) => {
                const newWeight = e.target.value;
                setFormData({
                  ...formData,
                  weight: newWeight,
                  shipping_price: calculateShippingPrice(
                    newWeight,
                    formData.shipping_type
                  ),
                });
              }}
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="Nama Pengirim"
              value={formData.sender_name}
              onChange={(e) =>
                setFormData({ ...formData, sender_name: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="Nama Penerima"
              value={formData.receiver_name}
              onChange={(e) =>
                setFormData({ ...formData, receiver_name: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="No Telepon"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="Kota Asal"
              value={formData.origin_city}
              onChange={(e) =>
                setFormData({ ...formData, origin_city: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="Kota Tujuan"
              value={formData.destination_city}
              onChange={(e) =>
                setFormData({ ...formData, destination_city: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            <input
              type="text"
              placeholder="Jenis Barang"
              value={formData.item_type}
              onChange={(e) =>
                setFormData({ ...formData, item_type: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            />

            {/* HARGA OTOMATIS */}
            <input
              type="text"
              placeholder="Harga Pengiriman"
              value={
                formData.shipping_price
                  ? `Rp ${Number(formData.shipping_price).toLocaleString("id-ID")}`
                  : ""
              }
              readOnly
              className="w-full h-[56px] px-4 bg-gray-100 border border-gray-300 rounded-xl font-semibold"
            />

            <select
              value={formData.shipping_type}
              onChange={(e) => {
                const newType = e.target.value;
                setFormData({
                  ...formData,
                  shipping_type: newType,
                  shipping_price: calculateShippingPrice(
                    formData.weight,
                    newType
                  ),
                });
              }}
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            >
              <option value="Regular">Regular</option>
              <option value="Express">Express</option>
              <option value="VVIP">VVIP</option>
            </select>

            <select
              value={formData.flight_status}
              onChange={(e) =>
                setFormData({ ...formData, flight_status: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-xl"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Airborne">Airborne</option>
              <option value="Landed">Landed</option>
              <option value="Delayed">Delayed</option>
            </select>

            <textarea
              placeholder="Deskripsi Barang"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="col-span-2 p-4 border border-gray-300 rounded-xl min-h-[120px]"
            />

            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white h-[56px] rounded-xl font-bold col-span-2"
            >
              {saving
                ? "Menyimpan..."
                : editingCargo
                ? "Update Cargo"
                : "Simpan Cargo Baru"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingCargo(null);
                resetForm();
              }}
              className="col-span-2 h-[56px] border border-gray-300 rounded-xl"
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
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
            {paginatedList.map((cargo) => (
              <tr 
                key={cargo.id} 
                className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                // 3. DIARAHKAN LANGSUNG KE HALAMAN /cargo-logs SAJA SAAT DIKLIK
                onClick={() => router.push("cargo-logs")}
              >
                <td className="p-4 font-bold font-mono text-[#0a2a66] hover:underline">
                  {cargo.manifest_id}
                </td>
                <td className="p-4">{cargo.airline_name}</td>
                <td className="p-4">{cargo.route}</td>
                <td className="p-4 text-center">{cargo.weight} kg</td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      cargo.flight_status === "Landed"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {cargo.flight_status}
                  </span>
                </td>
                <td className="p-4 text-center space-x-4">
                  {/* 4. e.stopPropagation() mencegah trigger navigasi onClick <tr> */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(cargo);
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(cargo.id);
                    }}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/20 bg-white rounded-b-2xl border-x border-b border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredList.length)} of {filteredList.length} cargo items
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 rounded-lg bg-[#0a2a66] text-white text-[10px] font-black uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              ◀ Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition ${
                  currentPage === page
                    ? "bg-[#0a2a66] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg bg-[#0a2a66] text-white text-[10px] font-black uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}