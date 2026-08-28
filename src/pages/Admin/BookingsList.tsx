import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getBookings, updateBookingStatus } from "../../lib/api";
import type { Booking } from "../../types/property";
import { Calendar, RefreshCw } from "lucide-react";

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatus = async (id: number, newStatus: string) => {
    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus as Booking["status"] } : b))
    );
    await updateBookingStatus(id, newStatus);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#17212B] tracking-tight">Site Visit Bookings</h1>
            <p className="text-xs font-semibold text-[#53606C] mt-1">Calendar & scheduled customer viewings</p>
          </div>
          <button
            onClick={fetchBookings}
            title="Refresh"
            className="p-2 rounded-xl border border-[#E7E5DF] bg-white hover:bg-[#F7F5F0] text-[#53606C] transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs font-semibold text-[#53606C]">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-sm font-bold text-[#17212B]">No site visit bookings yet</p>
              <p className="text-xs text-[#8E8E93] mt-1">Bookings submitted by customers will appear here.</p>
            </div>
          ) : (
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
                      <td className="p-4 font-bold text-[#17212B] max-w-xs truncate">
                        {(b as any).listing_title || (b as any).property_title || b.propertyId || "—"}
                      </td>
                      <td className="p-4 font-semibold text-[#17212B]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C7A76C]" />
                          <span>
                            {b.scheduledAt
                              ? new Date(b.scheduledAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                            {b.preferredTime ? ` (${b.preferredTime})` : ""}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          b.status === "confirmed" || b.status === "completed"
                            ? "bg-[#4F7A69]/10 text-[#4F7A69] border-[#4F7A69]/30"
                            : b.status === "cancelled"
                            ? "bg-[#C65A52]/10 text-[#C65A52] border-[#C65A52]/30"
                            : "bg-[#C7A76C]/10 text-[#C7A76C] border-[#C7A76C]/30"
                        }`}>
                          {b.status || "pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleStatus(b.id!, "confirmed")}
                          className="px-3 py-1 rounded-lg bg-[#4F7A69] text-white hover:bg-[#3d6052] font-bold transition-colors text-[11px] shadow-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatus(b.id!, "cancelled")}
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
