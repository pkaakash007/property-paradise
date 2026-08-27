import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

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
          <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Site Visit Bookings</h1>
          <p className="text-xs text-slate-400 mt-1">Calendar & scheduled customer viewings</p>
        </div>

        <div className="bg-slate/10 border border-slate/30 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate/30 text-[10px] bg-black/30">
                <tr>
                  <th className="p-4">Visitor</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Listing</th>
                  <th className="p-4">Scheduled Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/20 text-slate-200">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{b.name}</td>
                    <td className="p-4 font-mono text-champagne">{b.phone}</td>
                    <td className="p-4 font-medium text-slate-300 max-w-xs truncate">{b.propertyTitle}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-champagne" />
                        <span>{b.scheduledAt} ({b.preferredTime})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === "confirmed" ? "bg-sage/20 text-sage" : "bg-champagne/20 text-champagne"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(b.id, "confirmed")}
                        className="px-2.5 py-1 rounded-lg bg-sage/20 text-sage hover:bg-sage hover:text-white font-semibold transition-colors text-[11px]"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => toggleStatus(b.id, "cancelled")}
                        className="px-2.5 py-1 rounded-lg bg-coral/20 text-coral hover:bg-coral hover:text-white font-semibold transition-colors text-[11px]"
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
