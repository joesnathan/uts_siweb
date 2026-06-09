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

  // --- STATE ERROR HANDLING BARU ---
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  interface Toast {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    cargoId: number | null;
    manifestId: string;
  }>({ show: false, cargoId: null, manifestId: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [detailCargo, setDetailCargo] = useState<Cargo | null>(null);

  // States untuk riwayat pelacakan kargo (AWB Tracking)
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [savingHistory, setSavingHistory] = useState(false);

  const [formData, setFormData] = useState({
    manifest_id: "",
    airline_name: "",
    flight_code: "",
    route: "",
    route_from: "",
    route_to: "",
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

  // ================= TOAST SYSTEM HELPERS =================
  const addToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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
        setError(json.error || "Failed to synchronize data with Neon database.");
      }
    } catch (err) {
      setError("Failed to connect to the database. Check your internet connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCargoData();
  }, []);

  // --- AUTO OPEN DETAIL MODAL FROM QUERY PARAM & ESCAPE KEY CLOSE ---
  useEffect(() => {
    if (cargoList.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const manifestId = params.get("manifest_id");
      if (manifestId) {
        const found = cargoList.find((c) => c.manifest_id === manifestId);
        if (found) {
          setDetailCargo(found);
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }
    }
  }, [cargoList]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetailCargo(null);
      }
    };
    if (detailCargo) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [detailCargo]);

  // Fetch tracking history when detailCargo changes
  const fetchTrackingHistory = async (cargoId: number) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/cargo-tracking?cargoId=${cargoId}`);
      const json = await res.json();
      if (json.success) {
        setTrackingHistory(json.data || []);
      } else {
        addToast(json.error || "Failed to retrieve tracking data.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to retrieve tracking data from server.", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (detailCargo && detailCargo.id) {
      fetchTrackingHistory(detailCargo.id);
      setNewLocation("");
      setNewDescription("");
    } else {
      setTrackingHistory([]);
    }
  }, [detailCargo]);

  const handleAddCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailCargo || !detailCargo.id) return;
    if (!newLocation.trim() || !newDescription.trim()) {
      addToast("Location and Description are required!", "warning");
      return;
    }

    setSavingHistory(true);
    try {
      const res = await fetch('/api/cargo-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cargoId: detailCargo.id,
          current_location: newLocation.trim(),
          description: newDescription.trim()
        })
      });
      const json = await res.json();
      if (json.success) {
        addToast("✅ Tracking checkpoint successfully added!", "success");
        setNewLocation("");
        setNewDescription("");
        fetchTrackingHistory(detailCargo.id);
      } else {
        addToast(json.error || "Failed to add checkpoint.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("A connection error occurred while saving the checkpoint.", "error");
    } finally {
      setSavingHistory(false);
    }
  };

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

  // ================= VALIDATION LOGIC =================
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.airline_name.trim()) {
      newErrors.airline_name = "Airline name is required";
    }

    if (!formData.flight_code.trim()) {
      newErrors.flight_code = "Flight code is required";
    }

    if (!formData.route_from) {
      newErrors.route_from = "Origin airport is required";
    }
    if (!formData.route_to) {
      newErrors.route_to = "Destination airport is required";
    }
    if (formData.route_from && formData.route_to && formData.route_from === formData.route_to) {
      newErrors.route_to = "Destination airport cannot be the same as origin airport";
    }

    if (!formData.weight) {
      newErrors.weight = "Weight is required";
    } else {
      const w = Number(formData.weight);
      if (isNaN(w) || w <= 0) {
        newErrors.weight = "Weight must be a positive number";
      }
    }

    if (!formData.date) {
      newErrors.date = "Shipping date is required";
    }

    if (!formData.items) {
      newErrors.items = "Quantity is required";
    } else {
      const itemNum = Number(formData.items);
      if (isNaN(itemNum) || itemNum <= 0 || !Number.isInteger(itemNum)) {
        newErrors.items = "Quantity must be a positive integer";
      }
    }

    if (!formData.sender_name.trim()) {
      newErrors.sender_name = "Sender name is required";
    }

    if (!formData.receiver_name.trim()) {
      newErrors.receiver_name = "Receiver name is required";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone_number.trim())) {
      newErrors.phone_number = "Invalid phone number (only numbers, +, -, space, 8-15 digits)";
    }

    if (!formData.origin_city.trim()) {
      newErrors.origin_city = "Origin city is required";
    }

    if (!formData.destination_city.trim()) {
      newErrors.destination_city = "Destination city is required";
    }

    if (!formData.item_type.trim()) {
      newErrors.item_type = "Item type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= DYNAMIC FORM FIELD HANDLERS =================
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Reset kode penerbangan jika maskapai berubah agar tidak menyimpan kode yang tidak sesuai
      if (field === "airline_name") {
        updated.flight_code = "";
      }

      // Kombinasikan bandara asal dan tujuan menjadi kolom route
      if (field === "route_from" || field === "route_to") {
        const from = field === "route_from" ? value : prev.route_from;
        const to = field === "route_to" ? value : prev.route_to;
        updated.route = from && to ? `${from}-${to}` : "";
      }

      // Hitung otomatis harga jika berat atau tipe pengiriman berubah
      if (field === "weight" || field === "shipping_type") {
        updated.shipping_price = calculateShippingPrice(
          field === "weight" ? value : prev.weight,
          field === "shipping_type" ? value : prev.shipping_type
        );
      }

      return updated;
    });

    if (touched[field]) {
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };

        if (field === "airline_name") {
          if (!value.trim()) nextErrors.airline_name = "Airline name is required";
          else delete nextErrors.airline_name;
        }

        if (field === "flight_code") {
          if (!value.trim()) nextErrors.flight_code = "Flight code is required";
          else delete nextErrors.flight_code;
        }

        if (field === "route_from") {
          if (!value) nextErrors.route_from = "Origin airport is required";
          else delete nextErrors.route_from;
        }

        if (field === "route_to") {
          if (!value) nextErrors.route_to = "Destination airport is required";
          else delete nextErrors.route_to;
        }

        if (field === "weight") {
          const w = Number(value);
          if (!value) nextErrors.weight = "Weight is required";
          else if (isNaN(w) || w <= 0) nextErrors.weight = "Weight must be a positive number";
          else delete nextErrors.weight;
        }

        if (field === "date") {
          if (!value) nextErrors.date = "Shipping date is required";
          else delete nextErrors.date;
        }

        if (field === "items") {
          const itemNum = Number(value);
          if (!value) nextErrors.items = "Quantity is required";
          else if (isNaN(itemNum) || itemNum <= 0 || !Number.isInteger(itemNum)) {
            nextErrors.items = "Quantity must be a positive integer";
          } else delete nextErrors.items;
        }

        if (field === "sender_name") {
          if (!value.trim()) nextErrors.sender_name = "Sender name is required";
          else delete nextErrors.sender_name;
        }

        if (field === "receiver_name") {
          if (!value.trim()) nextErrors.receiver_name = "Receiver name is required";
          else delete nextErrors.receiver_name;
        }

        if (field === "phone_number") {
          if (!value.trim()) nextErrors.phone_number = "Phone number is required";
          else if (!/^[0-9+\s-]{8,15}$/.test(value.trim())) {
            nextErrors.phone_number = "Invalid phone number (8-15 digits)";
          } else delete nextErrors.phone_number;
        }

        if (field === "origin_city") {
          if (!value.trim()) nextErrors.origin_city = "Origin city is required";
          else delete nextErrors.origin_city;
        }

        if (field === "destination_city") {
          if (!value.trim()) nextErrors.destination_city = "Destination city is required";
          else delete nextErrors.destination_city;
        }

        if (field === "item_type") {
          if (!value.trim()) nextErrors.item_type = "Item type is required";
          else delete nextErrors.item_type;
        }

        return nextErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = (formData as any)[field] || "";
    handleFieldChange(field, value);
  };

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = cargoList.filter(
      (cargo) =>
        cargo.manifest_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cargo.airline_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cargo.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cargo.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cargo.receiver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cargo.item_type?.toLowerCase().includes(searchTerm.toLowerCase())
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
    setErrors({});
    setFormError(null);
    setTouched({});

    setFormData({
      manifest_id: generateManifestId(),
      airline_name: "",
      flight_code: "",
      route: "",
      route_from: "",
      route_to: "",
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
    setFormError(null);

    // Tandai semua field sebagai touched agar validasi terpicu
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      addToast("Please correct the input errors on the form.", "warning");
      const formElement = document.getElementById("cargoFormTitle");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setSaving(true);

    const method = editingCargo ? "PUT" : "POST";
    const url = editingCargo ? `/api/cargo?id=${editingCargo.id}` : "/api/cargo";

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
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        addToast(
          editingCargo
            ? "✅ Cargo data successfully updated!"
            : "✅ New cargo successfully added!",
          "success"
        );

        setShowForm(false);
        setEditingCargo(null);
        resetForm();
        setErrors({});
        setTouched({});
        fetchCargoData();
      } else {
        setFormError(result.error || "Failed to save cargo data.");
        addToast("❌ Failed to save cargo: " + (result.error || "An error occurred"), "error");
      }
    } catch (err) {
      setFormError("A network connection error occurred while contacting the server.");
      addToast("❌ Network error occurred while saving.", "error");
      console.error(err);
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
      route_from: "",
      route_to: "",
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
    setErrors({});
    setFormError(null);
    setTouched({});
    setEditingCargo(cargo);

    const shippingType = cargo.shipping_type || "Regular";
    const weightValue = cargo.weight ? String(cargo.weight) : "";
    const autoPrice = calculateShippingPrice(weightValue, shippingType);

    const routeFrom = cargo.route ? cargo.route.split("-")[0] || "" : "";
    const routeTo = cargo.route ? cargo.route.split("-")[1] || "" : "";

    setFormData({
      manifest_id: cargo.manifest_id || "",
      airline_name: cargo.airline_name || "",
      flight_code: cargo.flight_code || "",
      route: cargo.route || "",
      route_from: routeFrom,
      route_to: routeTo,
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
  const handleDeleteClick = (id: number, manifestId: string) => {
    setDeleteModal({
      show: true,
      cargoId: id,
      manifestId,
    });
  };

  const confirmDelete = async () => {
    if (deleteModal.cargoId === null) return;

    try {
      const res = await fetch(`/api/cargo?id=${deleteModal.cargoId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        addToast(`🗑️ Cargo ${deleteModal.manifestId} successfully deleted.`, "success");
        fetchCargoData();
      } else {
        addToast(`❌ Failed to delete cargo: ${result.error || "An error occurred"}`, "error");
      }
    } catch (err) {
      addToast("❌ Network error occurred while deleting cargo.", "error");
    } finally {
      setDeleteModal({ show: false, cargoId: null, manifestId: "" });
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
          <h2 className="text-[#0a2a66] font-black text-xl tracking-tighter mt-4 uppercase">Terbanginaja Logistics</h2>
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

  // Pemetaan deskripsi bandara lengkap (IATA)
  const airportNames: Record<string, string> = {
    CGK: "CGK (Soekarno-Hatta - Jakarta)",
    DPS: "DPS (Ngurah Rai - Bali/Denpasar)",
    SUB: "SUB (Juanda - Surabaya)",
    KNO: "KNO (Kualanamu - Medan)",
    SIN: "SIN (Changi - Singapore)",
    JOG: "JOG (Yogyakarta Int'l)",
    PNK: "PNK (Supadio - Pontianak)",
    BPN: "BPN (Sepinggan - Balikpapan)",
  };

  const getAirportLabel = (code: string) => {
    return airportNames[code.toUpperCase()] || `${code.toUpperCase()} (Other Airport)`;
  };

  // Ambil opsi unik maskapai, kode penerbangan, dan rute dari database kargo yang ada
  const airlineOptions = Array.from(
    new Set([
      "GARUDA INDONESIA",
      "SRIWIJAYA AIR",
      "LION AIR",
      "BATIK AIR",
      "CITILINK",
      ...cargoList.map((c) => c.airline_name.toUpperCase().trim())
    ])
  ).filter(Boolean).sort();

  // Helper untuk mendapatkan IATA Prefix dari nama maskapai
  const getAirlinePrefix = (airlineName: string): string => {
    const name = airlineName.toUpperCase();
    if (name.includes("GARUDA")) return "GA";
    if (name.includes("SRIWIJAYA")) return "SJ";
    if (name.includes("LION")) return "JT";
    if (name.includes("BATIK")) return "ID";
    if (name.includes("CITILINK")) return "QG";
    return "";
  };

  const selectedPrefix = getAirlinePrefix(formData.airline_name);

  const allFlightCodes = [
    "GA-888", "GA-412", "GA-889", "GA-413",
    "SJ-555", "SJ-182", "SJ-221", "SJ-183",
    "JT-100", "JT-204", "JT-101", "JT-205",
    "ID-600", "ID-682", "ID-601", "ID-683",
    "QG-310", "QG-102", "QG-311", "QG-103",
    ...cargoList.map((c) => c.flight_code.toUpperCase().trim())
  ];

  const flightCodeOptions = Array.from(new Set(allFlightCodes))
    .filter(Boolean)
    .filter((code) => {
      if (!selectedPrefix) return true; // Tampilkan semua jika belum pilih maskapai
      return code.startsWith(selectedPrefix);
    })
    .sort();

  // Ambil rute unik asal (From) dan tujuan (To) dari database Neon
  const fromRoutes = Array.from(
    new Set([
      "CGK",
      ...cargoList.map((c) => {
        const parts = c.route.split("-");
        return parts[0] ? parts[0].toUpperCase().trim() : "";
      })
    ])
  ).filter(Boolean).sort();

  const toRoutes = Array.from(
    new Set([
      "DPS",
      "SUB",
      "KNO",
      "SIN",
      "JOG",
      "PNK",
      "BPN",
      ...cargoList.map((c) => {
        const parts = c.route.split("-");
        return parts[1] ? parts[1].toUpperCase().trim() : "";
      })
    ])
  ).filter(Boolean).sort();

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
          <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-none uppercase">
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
                placeholder="Search Manifest ID / Airline / Route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 h-[56px] px-4 border border-gray-300 rounded-xl outline-none"
              />

              <button
                onClick={openForm}
                className="bg-[#0a2a66] text-white px-6 h-[56px] rounded-xl font-bold whitespace-nowrap hover:opacity-90 transition"
              >
                + Add Cargo
              </button>
            </div>
          </div>

          {/* FORM */}
          {showForm && (
            <div className="bg-white p-8 rounded-2xl shadow-xl animate-in slide-in-from-top-6 duration-300" id="cargoFormTitle">
              <h3 className="text-xl font-black text-[#0a2a66] uppercase tracking-tight mb-6">
                {editingCargo ? "⚡ Edit Cargo Manifest" : "📦 Add New Cargo"}
              </h3>

              {/* Form-level Error Banner */}
              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-in fade-in duration-300">
                  <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-wider">Server / Database Error</p>
                    <p className="text-xs text-rose-700/90 font-medium leading-relaxed uppercase">{formError}</p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Manifest ID */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Manifest ID (Auto)</label>
                  <input
                    type="text"
                    value={formData.manifest_id}
                    readOnly
                    className="w-full h-[56px] px-4 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl font-mono font-bold"
                  />
                </div>

                {/* Airline Name */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Airline Name *</label>
                  <select
                    value={formData.airline_name}
                    onChange={(e) => handleFieldChange("airline_name", e.target.value)}
                    onBlur={() => handleBlur("airline_name")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all font-medium text-gray-700 bg-white ${touched.airline_name && errors.airline_name
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  >
                    <option value="">-- Select Airline --</option>
                    {airlineOptions.map((airline) => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                  {touched.airline_name && errors.airline_name && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.airline_name}
                    </p>
                  )}
                </div>

                {/* Flight Code */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Flight Code *</label>
                  <select
                    value={formData.flight_code}
                    onChange={(e) => handleFieldChange("flight_code", e.target.value)}
                    onBlur={() => handleBlur("flight_code")}
                    disabled={!formData.airline_name}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all font-medium text-gray-700 bg-white disabled:bg-gray-50 disabled:text-gray-400 ${touched.flight_code && errors.flight_code
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  >
                    {!formData.airline_name ? (
                      <option value="">-- Select Airline First --</option>
                    ) : (
                      <>
                        <option value="">-- Select Flight Code --</option>
                        {flightCodeOptions.map((code) => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </>
                    )}
                  </select>
                  {touched.flight_code && errors.flight_code && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.flight_code}
                    </p>
                  )}
                </div>

                {/* Rute Penerbangan Split (Dari - Ke) dalam 1 Kolom Panjang dibagi 2 */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Flight Route (Origin ➔ Destination) *</label>
                  <div className="flex items-center gap-2">
                    {/* Bandara Asal */}
                    <div className="flex-1">
                      <select
                        value={formData.route_from}
                        onChange={(e) => handleFieldChange("route_from", e.target.value)}
                        onBlur={() => handleBlur("route_from")}
                        className={`w-full h-[56px] px-3 border rounded-xl outline-none transition-all font-medium text-xs text-gray-700 bg-white ${touched.route_from && errors.route_from
                            ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                          }`}
                      >
                        <option value="">-- Select Origin --</option>
                        {fromRoutes.map((airport) => (
                          <option key={airport} value={airport}>{getAirportLabel(airport)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Arrow Icon */}
                    <span className="text-gray-400 font-bold select-none shrink-0">➔</span>

                    {/* Bandara Tujuan */}
                    <div className="flex-1">
                      <select
                        value={formData.route_to}
                        onChange={(e) => handleFieldChange("route_to", e.target.value)}
                        onBlur={() => handleBlur("route_to")}
                        className={`w-full h-[56px] px-3 border rounded-xl outline-none transition-all font-medium text-xs text-gray-700 bg-white ${touched.route_to && errors.route_to
                            ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                          }`}
                      >
                        <option value="">-- Select Destination --</option>
                        {toRoutes.map((airport) => (
                          <option key={airport} value={airport}>{getAirportLabel(airport)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Errors container */}
                  {((touched.route_from && errors.route_from) || (touched.route_to && errors.route_to)) && (
                    <div className="flex flex-col gap-1 mt-1.5 ml-1 select-none">
                      {touched.route_from && errors.route_from && (
                        <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                          Origin: {errors.route_from}
                        </p>
                      )}
                      {touched.route_to && errors.route_to && (
                        <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                          Destination: {errors.route_to}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Weight */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Weight (kg) *</label>
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={formData.weight}
                    onChange={(e) => handleFieldChange("weight", e.target.value)}
                    onBlur={() => handleBlur("weight")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.weight && errors.weight
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.weight && errors.weight && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.weight}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Shipping Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                    onBlur={() => handleBlur("date")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.date && errors.date
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.date && errors.date && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Gate */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Gate (Optional)</label>
                  <input
                    type="text"
                    placeholder="Gate (e.g. A12)"
                    value={formData.gate}
                    onChange={(e) => handleFieldChange("gate", e.target.value)}
                    className="w-full h-[56px] px-4 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 transition-all"
                  />
                </div>

                {/* Items */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Quantity / Capacity (units) *</label>
                  <input
                    type="number"
                    placeholder="Quantity / Capacity (units)"
                    value={formData.items}
                    onChange={(e) => handleFieldChange("items", e.target.value)}
                    onBlur={() => handleBlur("items")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.items && errors.items
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.items && errors.items && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.items}
                    </p>
                  )}
                </div>

                {/* Sender Name */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Sender Name *</label>
                  <input
                    type="text"
                    placeholder="Sender Name"
                    value={formData.sender_name}
                    onChange={(e) => handleFieldChange("sender_name", e.target.value)}
                    onBlur={() => handleBlur("sender_name")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.sender_name && errors.sender_name
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.sender_name && errors.sender_name && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.sender_name}
                    </p>
                  )}
                </div>

                {/* Receiver Name */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Receiver Name *</label>
                  <input
                    type="text"
                    placeholder="Receiver Name"
                    value={formData.receiver_name}
                    onChange={(e) => handleFieldChange("receiver_name", e.target.value)}
                    onBlur={() => handleBlur("receiver_name")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.receiver_name && errors.receiver_name
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.receiver_name && errors.receiver_name && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.receiver_name}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Phone Number *</label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={(e) => handleFieldChange("phone_number", e.target.value)}
                    onBlur={() => handleBlur("phone_number")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.phone_number && errors.phone_number
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.phone_number && errors.phone_number && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.phone_number}
                    </p>
                  )}
                </div>

                {/* Origin City */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Origin City *</label>
                  <input
                    type="text"
                    placeholder="Origin City"
                    value={formData.origin_city}
                    onChange={(e) => handleFieldChange("origin_city", e.target.value)}
                    onBlur={() => handleBlur("origin_city")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.origin_city && errors.origin_city
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.origin_city && errors.origin_city && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.origin_city}
                    </p>
                  )}
                </div>

                {/* Destination City */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Destination City *</label>
                  <input
                    type="text"
                    placeholder="Destination City"
                    value={formData.destination_city}
                    onChange={(e) => handleFieldChange("destination_city", e.target.value)}
                    onBlur={() => handleBlur("destination_city")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.destination_city && errors.destination_city
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.destination_city && errors.destination_city && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.destination_city}
                    </p>
                  )}
                </div>

                {/* Item Type */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Item Type *</label>
                  <input
                    type="text"
                    placeholder="Item Type"
                    value={formData.item_type}
                    onChange={(e) => handleFieldChange("item_type", e.target.value)}
                    onBlur={() => handleBlur("item_type")}
                    className={`w-full h-[56px] px-4 border rounded-xl outline-none transition-all ${touched.item_type && errors.item_type
                        ? "border-rose-500 bg-rose-50/10 focus:ring-2 focus:ring-rose-200/50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50"
                      }`}
                  />
                  {touched.item_type && errors.item_type && (
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-1.5 ml-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      {errors.item_type}
                    </p>
                  )}
                </div>

                {/* Shipping Price */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Shipping Price (Auto)</label>
                  <input
                    type="text"
                    placeholder="Shipping Price"
                    value={
                      formData.shipping_price
                        ? `Rp ${Number(formData.shipping_price).toLocaleString("id-ID")}`
                        : ""
                    }
                    readOnly
                    className="w-full h-[56px] px-4 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 outline-none"
                  />
                </div>

                {/* Shipping Type */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Shipping Type *</label>
                  <select
                    value={formData.shipping_type}
                    onChange={(e) => handleFieldChange("shipping_type", e.target.value)}
                    className="w-full h-[56px] px-4 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 transition-all font-medium text-gray-700"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Express">Express</option>
                    <option value="VVIP">VVIP</option>
                  </select>
                </div>

                {/* Flight Status */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Flight Status *</label>
                  <select
                    value={formData.flight_status}
                    onChange={(e) => handleFieldChange("flight_status", e.target.value)}
                    className="w-full h-[56px] px-4 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 transition-all font-medium text-gray-700"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Airborne">Airborne</option>
                    <option value="Landed">Landed</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>

                {/* Status Operasional */}
                <div className="w-full">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Operational Status *</label>
                  <select
                    value={formData.operational_status}
                    onChange={(e) => handleFieldChange("operational_status", e.target.value)}
                    className="w-full h-[56px] px-4 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 transition-all font-medium text-gray-700"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 ml-1 block">Item Description (Optional)</label>
                  <textarea
                    placeholder="Item Description"
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl min-h-[120px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 transition-all"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#0a2a66] hover:opacity-90 active:scale-95 text-white h-[56px] rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : editingCargo ? (
                      "Update Cargo"
                    ) : (
                      "Save New Cargo"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCargo(null);
                      resetForm();
                      setErrors({});
                      setTouched({});
                    }}
                    className="flex-1 h-[56px] border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
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
                    className="border-t hover:bg-slate-50/75 cursor-pointer transition-colors group"
                    onClick={() => setDetailCargo(cargo)}
                  >
                    <td className="p-4 font-bold font-mono text-[#0a2a66] group-hover:text-blue-600 transition-colors">
                      <span className="border-b border-dashed border-[#0a2a66]/30 group-hover:border-blue-600/50">
                        {cargo.manifest_id}
                      </span>
                    </td>
                    <td className="p-4">{cargo.airline_name}</td>
                    <td className="p-4">{cargo.route}</td>
                    <td className="p-4 text-center">{cargo.weight} kg</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${cargo.flight_status === "Landed"
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
                          handleDeleteClick(cargo.id, cargo.manifest_id);
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
                    className={`w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition ${currentPage === page
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

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full">
                Confirm Delete
              </span>
              <h3 className="text-xl font-black text-[#0a2a66] uppercase tracking-tight mt-4">
                Delete This Manifest?
              </h3>
              <p className="text-xs text-gray-400 font-bold leading-relaxed px-4 uppercase">
                Are you sure you want to delete the cargo with manifest ID <span className="text-rose-600 font-mono font-black select-all bg-rose-50 px-1.5 py-0.5 rounded">{deleteModal.manifestId}</span>? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ show: false, cargoId: null, manifestId: "" })}
                className="flex-1 h-[48px] border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 h-[48px] bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                Delete Cargo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GORGEOUS GLASSMORPHIC DETAIL MODAL OVERLAY */}
      {detailCargo && (
        <div
          className="fixed inset-0 z-[99998] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setDetailCargo(null)}
        >
          <div
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 flex flex-col border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 flex justify-between items-center bg-[#0a2a66] rounded-t-[2.5rem] text-white relative shrink-0">
              <div>
                <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.25em] mb-1">Cargo Detail</p>
                <h3 className="text-white font-black text-2xl tracking-tight select-all font-mono">{detailCargo.manifest_id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailCargo(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 overflow-y-auto">
              {/* Flight Info */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Flight Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailItem label="Airline" value={detailCargo.airline_name} />
                  <DetailItem label="Flight Code" value={detailCargo.flight_code} />
                  <DetailItem label="Route" value={detailCargo.route} />
                  <DetailItem label="Date" value={detailCargo.date} />
                  <DetailItem label="Scheduled Time" value={detailCargo.scheduled_time} />
                  <DetailItem label="Actual Time" value={detailCargo.actual_time} />
                  <DetailItem label="Gate" value={detailCargo.gate || "-"} />
                  <DetailItem
                    label="Flight Status"
                    value={detailCargo.flight_status}
                    badge
                    badgeColor={
                      detailCargo.flight_status === "Landed"
                        ? "bg-green-100 text-green-700"
                        : detailCargo.flight_status === "Delayed"
                          ? "bg-red-100 text-red-700"
                          : detailCargo.flight_status === "Airborne"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-blue-100 text-blue-700"
                    }
                  />
                </div>
              </div>

              {/* Sender & Receiver */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Sender & Receiver</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailItem label="Sender Name" value={detailCargo.sender_name || "-"} />
                  <DetailItem label="Receiver Name" value={detailCargo.receiver_name || "-"} />
                  <DetailItem label="Phone Number" value={detailCargo.phone_number || "-"} />
                  <DetailItem label="Origin City" value={detailCargo.origin_city || "-"} />
                  <DetailItem label="Destination City" value={detailCargo.destination_city || "-"} />
                </div>
              </div>

              {/* Cargo Info */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Cargo Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailItem label="Item Type" value={detailCargo.item_type || "-"} />
                  <DetailItem label="Weight" value={detailCargo.weight ? `${detailCargo.weight} kg` : "-"} />
                  <DetailItem label="Quantity" value={detailCargo.items ? `${detailCargo.items} Pcs` : "-"} />
                  <DetailItem label="Shipping Type" value={detailCargo.shipping_type || "-"} />
                  <DetailItem
                    label="Shipping Price"
                    value={
                      detailCargo.shipping_price
                        ? `Rp ${Number(detailCargo.shipping_price).toLocaleString("id-ID")}`
                        : "-"
                    }
                  />
                  <DetailItem
                    label="Operational Status"
                    value={detailCargo.operational_status || "-"}
                    badge
                    badgeColor={
                      detailCargo.operational_status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : detailCargo.operational_status === "Processing"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                    }
                  />
                </div>
              </div>

              {/* Description */}
              {detailCargo.description && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</p>
                  <p className="text-xs text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{detailCargo.description}</p>
                </div>
              )}


            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/20 rounded-b-[2.5rem] shrink-0">
              <button
                type="button"
                onClick={() => setDetailCargo(null)}
                className="px-8 py-3 bg-[#0a2a66] hover:bg-[#124294] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST CONTAINER PORTAL */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 duration-300 ${toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-800"
                : toast.type === "error"
                  ? "bg-rose-500/10 border-rose-500/25 text-rose-800"
                  : toast.type === "warning"
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-800"
                    : "bg-blue-500/10 border-blue-500/25 text-blue-800"
              }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && (
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {toast.type === "error" && (
                <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {toast.type === "warning" && (
                <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {toast.type === "info" && (
                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="text-[10px] font-black uppercase tracking-wider leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-0.5 rounded-lg hover:bg-gray-100/50 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" strokeWidth="3" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= DETAIL ITEM COMPONENT =================
function DetailItem({
  label,
  value,
  badge = false,
  badgeColor = "",
}: {
  label: string;
  value: string;
  badge?: boolean;
  badgeColor?: string;
}) {
  return (
    <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      {badge ? (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <p className="text-xs font-bold text-gray-800 leading-normal">{value}</p>
      )}
    </div>
  );
}