import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Calendar } from "lucide-react";

export default function BookingsList() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Anand Ramakrishnan",
      phone: "+91 98422 12345",
      propertyTitle: "Contemporary 4 BHK Luxury Villa",
      scheduledAt: "2026-08-28",
      preferredTime: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      name: "Kavitha Nair",
      phone: "+91 98944 55555",
      propertyTitle: "Colonial Style Hilltop Mansion",
      scheduledAt: "2026-08-29",
      preferredTime: "03:00 PM",
      status: "pending",
    },
  ]);

  const toggleStatus = (id: number, newStatus: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#17212B] tracking-tight">Site Visit Bookings</h1>
          <p className="text-xs font-semibold text-[#53606C] mt-1">Calendar & scheduled customer viewings</p>
        </div>

        <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#53606C] uppercase tracking-wider border-b border-[#E7E5DF] text-[10px] bg-[#F7F5F0]">
                <tr>
                  <th className="p-4">Visitor</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Listing</th>
                  <th className="p-4">Scheduled Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF] text-[#17212B]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F7F5F0]/50 transition-colors">
                    <td className="p-4 font-bold text-[#17212B]">{b.name}</td>
                    <td className="p-4 font-mono font-bold text-[#123B5D]">{b.phone}</td>
                    <td className="p-4 font-bold text-[#17212B] max-w-xs truncate">{b.propertyTitle}</td>
                    <td className="p-4 font-semibold text-[#17212B]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C7A76C]" />
                        <span>{b.scheduledAt} ({b.preferredTime})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        b.status === "confirmed" ? "bg-[#4F7A69]/10 text-[#4F7A69] border-[#4F7A69]/30" : "bg-[#C7A76C]/10 text-[#C7A76C] border-[#C7A76C]/30"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(b.id, "confirmed")}
                        className="px-3 py-1 rounded-lg bg-[#4F7A69] text-white hover:bg-[#3d6052] font-bold transition-colors text-[11px] shadow-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => toggleStatus(b.id, "cancelled")}
                        className="px-3 py-1 rounded-lg bg-[#C65A52]/10 text-[#C65A52] border border-[#C65A52]/30 hover:bg-[#C65A52] hover:text-white font-bold transition-colors text-[11px]"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
