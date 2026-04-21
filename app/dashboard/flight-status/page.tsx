// app/dashboard/flight_status/page.tsx
export default function FlightStatusPage() {
  return (
    <div className="w-full animate-in fade-in duration-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>

      {/* Cards Status - Dibuat justify-center agar posisi di tengah & gap konsisten */}
      <div className="flex justify-center gap-6 mb-10">
        
        {/* Card: On-Time */}
        <div className="bg-green-300 border-2 border-green-500 rounded-2xl p-5 w-48 flex flex-col items-center shadow-md transition-transform hover:scale-105">
          <p className="font-black text-green-900 text-xs uppercase tracking-widest">On-Time</p>
          <div className="flex items-center gap-3 mt-2">
             <span className="text-5xl font-black text-green-900">4</span>
             <span className="text-2xl">✔️</span>
          </div>
        </div>
        
        {/* Card: Delayed */}
        <div className="bg-red-300 border-2 border-red-500 rounded-2xl p-5 w-48 flex flex-col items-center shadow-md transition-transform hover:scale-105">
          <p className="font-black text-red-900 text-xs uppercase tracking-widest">Delayed</p>
          <div className="flex items-center gap-3 mt-2">
             <span className="text-5xl font-black text-red-900">4</span>
             <span className="text-2xl">❗</span>
          </div>
        </div>

        {/* Card: Departed */}
        <div className="bg-blue-300 border-2 border-blue-500 rounded-2xl p-5 w-48 flex flex-col items-center shadow-md transition-transform hover:scale-105">
          <p className="font-black text-blue-900 text-xs uppercase tracking-widest">Departed</p>
          <div className="flex items-center gap-3 mt-2">
             <span className="text-5xl font-black text-blue-900">2</span>
             <span className="text-3xl text-blue-600">✈️</span>
          </div>
        </div>

        {/* Card: Total Flights - Dibuat sejajar (Hapus ml-auto) */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl p-5 w-48 flex flex-col items-center shadow-md transition-transform hover:scale-105">
          <p className="font-black text-gray-700 text-xs uppercase tracking-widest">Total Flights</p>
          <div className="mt-2">
             <span className="text-5xl font-black text-gray-800">8</span>
          </div>
        </div>
      </div>

      {/* Konten Tabel */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50">
        <div className="mb-8 border-b border-gray-50 pb-4">
          <h4 className="font-black text-xl text-[#0a2a66] uppercase italic tracking-tighter">Flight Schedule - CGK Airport</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Updated: 5 April 2026, 17:30 WIB</p>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-black border-b border-gray-100">
                <th className="px-4 py-4">Flight Number</th>
                <th className="px-4 py-4">Airline</th>
                <th className="px-4 py-4">Route</th>
                <th className="px-4 py-4">Scheduled</th>
                <th className="px-4 py-4">Actual</th>
                <th className="px-4 py-4">Gate</th>
                <th className="px-4 py-4">Cargo Items</th>
                <th className="px-4 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[13px]">
              <tr className="hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-5 font-black text-[#0a2a66]">GA-888</td>
                <td className="px-4 py-5 font-bold text-gray-700 uppercase">Garuda Indonesia</td>
                <td className="px-4 py-5 font-black text-xs text-gray-500">CGK ✈ DPS</td>
                <td className="px-4 py-5 font-bold">17:15</td>
                <td className="px-4 py-5 font-bold">17:20</td>
                <td className="px-4 py-5 font-black text-blue-600">A12</td>
                <td className="px-4 py-5 text-gray-500 font-bold">45 items</td>
                <td className="px-4 py-5 text-center">
                  <span className="text-blue-600 font-black bg-blue-100 px-4 py-1.5 rounded-full text-[10px] uppercase">✈ Departed</span>
                </td>
              </tr>
              <tr className="hover:bg-green-50/50 transition-colors">
                <td className="px-4 py-5 font-black text-[#0a2a66]">SJ-555</td>
                <td className="px-4 py-5 font-bold text-gray-700 uppercase">Sriwijaya Air</td>
                <td className="px-4 py-5 font-black text-xs text-gray-500">CGK ✈ SUB</td>
                <td className="px-4 py-5 font-bold">18:30</td>
                <td className="px-4 py-5 font-bold">18:30</td>
                <td className="px-4 py-5 font-black text-blue-600">B08</td>
                <td className="px-4 py-5 text-gray-500 font-bold">32 items</td>
                <td className="px-4 py-5 text-center">
                  <span className="text-green-600 font-black bg-green-100 px-4 py-1.5 rounded-full text-[10px] uppercase">✔️ On-Time</span>
                </td>
              </tr>
              <tr className="hover:bg-red-50/50 transition-colors">
                <td className="px-4 py-5 font-black text-[#0a2a66]">JT-100</td>
                <td className="px-4 py-5 font-bold text-gray-700 uppercase">Lion Air</td>
                <td className="px-4 py-5 font-black text-xs text-gray-500">CGK ✈ KNO</td>
                <td className="px-4 py-5 font-bold">19:00</td>
                <td className="px-4 py-5 font-black text-red-600">19:15</td>
                <td className="px-4 py-5 font-black text-blue-600">C05</td>
                <td className="px-4 py-5 text-gray-500 font-bold">28 items</td>
                <td className="px-4 py-5 text-center">
                  <span className="text-yellow-600 font-black bg-yellow-100 px-4 py-1.5 rounded-full text-[10px] uppercase">❗ Delayed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}