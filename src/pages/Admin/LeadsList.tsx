import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Users, Phone, Mail, MessageSquare, CheckCircle, Clock } from "lucide-react";

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
          <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Leads & Enquiries CRM</h1>
          <p className="text-xs text-slate-400 mt-1">Customer enquiries received across public property pages</p>
        </div>

        <div className="bg-slate/10 border border-slate/30 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate/30 text-[10px] bg-black/30">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Target Property</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/20 text-slate-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{lead.name}</td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1 font-mono text-champagne">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                      <div className="text-[11px] text-slate-400">{lead.email}</div>
                    </td>
                    <td className="p-4 text-slate-300 font-medium max-w-xs truncate">{lead.propertyTitle}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{lead.message}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        lead.status === "new" ? "bg-coral/20 text-coral" : "bg-sage/20 text-sage"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="bg-black/40 border border-slate/40 text-xs rounded-lg p-1 text-white focus:outline-none"
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
