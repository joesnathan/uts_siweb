// app/dashboard/flight_status/page.tsx
export default function FlightStatusPage() {
  return (
    <div className="w-full">
      
      {/* Header Halaman Spesifik */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1">Welcome, Amba</h2>
        <p className="text-sm text-gray-600">Role: Operator</p>
        
        <div className="mt-6 flex items-center gap-2">
          <span className="text-blue-900 text-xl">📄</span>
          <div>
            <h3 className="text-xl font-bold">Flight Status</h3>
            <p className="text-xs text-gray-500">Real-time flight tracking and status monitoring</p>
          </div>
        </div>
      </div>

      {/* Cards Status */}
      <div className="flex gap-4 mb-8">
        <div className="bg-green-300 border-2 border-green-500 rounded-xl p-4 w-40 flex flex-col items-center shadow-sm">
          <p className="font-bold text-green-900 text-sm">On-Time</p>
          <div className="flex items-center gap-2 mt-2">
             <span className="text-4xl font-bold text-green-900">4</span>
             <span className="text-2xl">✔️</span>
          </div>
        </div>
        
        <div className="bg-red-300 border-2 border-red-500 rounded-xl p-4 w-40 flex flex-col items-center shadow-sm">
          <p className="font-bold text-red-900 text-sm">Delayed</p>
          <div className="flex items-center gap-2 mt-2">
             <span className="text-4xl font-bold text-red-900">4</span>
             <span className="text-2xl">❗</span>
          </div>
        </div>

        <div className="bg-blue-300 border-2 border-blue-500 rounded-xl p-4 w-40 flex flex-col items-center shadow-sm">
          <p className="font-bold text-blue-900 text-sm">Departed</p>
          <div className="flex items-center gap-2 mt-2">
             <span className="text-4xl font-bold text-blue-900">2</span>
             <span className="text-2xl text-blue-600">✈️</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-4 w-40 flex flex-col items-center shadow-sm ml-auto">
          <p className="font-bold text-gray-700 text-sm">Total Flights</p>
          <div className="mt-2">
             <span className="text-4xl font-bold text-gray-700">8</span>
          </div>
        </div>
      </div>

      {/* Konten Tabel */}
      <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h4 className="font-bold text-lg">Flight Schedule - CGK Airport</h4>
          <p className="text-xs text-gray-500 font-bold">Updated: 5 April 2026, 17:30 WIB</p>
        </div>

        {/* Tabel */}
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3">Flight Number</th>
              <th className="px-4 py-3">Airline</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3">Actual</th>
              <th className="px-4 py-3">Gate</th>
              <th className="px-4 py-3">Cargo Items</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-4 font-bold">GA-888</td>
              <td className="px-4 py-4">Garuda Indonesia</td>
              <td className="px-4 py-4 font-bold text-xs">CGK ✈ DPS</td>
              <td className="px-4 py-4 font-bold">17:15</td>
              <td className="px-4 py-4 font-bold">17:20</td>
              <td className="px-4 py-4 font-bold">A12</td>
              <td className="px-4 py-4">45 items</td>
              <td className="px-4 py-4 text-center"><span className="text-blue-600 font-bold bg-blue-100 px-3 py-1 rounded-full text-xs">✈ Departed</span></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-4 font-bold">SJ-555</td>
              <td className="px-4 py-4">Sriwijaya Air</td>
              <td className="px-4 py-4 font-bold text-xs">CGK ✈ SUB</td>
              <td className="px-4 py-4 font-bold">18:30</td>
              <td className="px-4 py-4 font-bold">18:30</td>
              <td className="px-4 py-4 font-bold">B08</td>
              <td className="px-4 py-4">32 items</td>
              <td className="px-4 py-4 text-center"><span className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full text-xs">✔️ On-Time</span></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-4 font-bold">JT-100</td>
              <td className="px-4 py-4">Lion Air</td>
              <td className="px-4 py-4 font-bold text-xs">CGK ✈ KNO</td>
              <td className="px-4 py-4 font-bold">19:00</td>
              <td className="px-4 py-4 font-bold text-red-600">19:15</td>
              <td className="px-4 py-4 font-bold">C05</td>
              <td className="px-4 py-4">28 items</td>
              <td className="px-4 py-4 text-center"><span className="text-yellow-600 font-bold bg-yellow-100 px-3 py-1 rounded-full text-xs">❗ Delayed</span></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}