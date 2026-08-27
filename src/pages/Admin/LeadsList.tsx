import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Phone } from "lucide-react";

export default function LeadsList() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Siddharth Menon",
      phone: "+91 98401 54321",
      email: "siddharth@example.com",
      message: "Interested in the 4 BHK Villa in Saravanampatti. Need pricing flexibility details.",
      propertyTitle: "Contemporary 4 BHK Luxury Villa",
      status: "new",
      createdAt: "2026-08-27T10:30:00Z"
    },
    {
      id: 2,
      name: "Pooja Hegde",
      phone: "+91 98940 12345",
      email: "pooja@example.com",
      message: "Looking for gated plot in Bangalore Sadashivanagar for immediate purchase.",
      propertyTitle: "Exclusive Sadashivanagar Gated Plot",
      status: "contacted",
      createdAt: "2026-08-26T14:15:00Z"
    }
  ]);

  const handleStatusChange = (id: number, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#17212B] tracking-tight">Leads & Enquiries CRM</h1>
          <p className="text-xs font-semibold text-[#53606C] mt-1">Customer enquiries received across public property pages</p>
        </div>

        <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#53606C] uppercase tracking-wider border-b border-[#E7E5DF] text-[10px] bg-[#F7F5F0]">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Target Property</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF] text-[#17212B]">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F7F5F0]/50 transition-colors">
                    <td className="p-4 font-bold text-[#17212B]">{lead.name}</td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1 font-mono font-bold text-[#123B5D]">
                        <Phone className="w-3 h-3 text-[#C7A76C]" />
                        {lead.phone}
                      </div>
                      <div className="text-[11px] text-[#53606C] font-semibold">{lead.email}</div>
                    </td>
                    <td className="p-4 text-[#17212B] font-bold max-w-xs truncate">{lead.propertyTitle}</td>
                    <td className="p-4 text-[#53606C] font-semibold max-w-xs truncate">{lead.message}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        lead.status === "new" ? "bg-[#C65A52]/10 text-[#C65A52] border-[#C65A52]/30" : "bg-[#4F7A69]/10 text-[#4F7A69] border-[#4F7A69]/30"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="bg-[#F7F5F0] border border-[#53606C]/30 text-xs font-bold rounded-lg p-1.5 text-[#17212B] focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="site_visit">Site Visit Scheduled</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
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
