import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { MOCK_AGENTS } from "../../lib/api";
import { UserCheck, Phone, Mail, Award, PlusCircle } from "lucide-react";

export default function AgentsList() {
  const [agents, setAgents] = useState(MOCK_AGENTS);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Luxury Estate Agents</h1>
            <p className="text-xs text-slate-400 mt-1">Manage assigned property advisors</p>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-champagne text-ink font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Add Agent</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {agents.map((a) => (
            <div key={a.id} className="bg-slate/10 border border-slate/30 p-6 rounded-3xl flex items-center gap-6">
              <img
                src={a.profileImage}
                alt={a.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-champagne"
              />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-champagne uppercase">{a.designation}</span>
                <h3 className="text-lg font-bold font-serif text-white">{a.name}</h3>
                <p className="text-xs text-slate-400">{a.bio}</p>
                <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 font-mono">
                  <span>{a.phone}</span>
                  <span>{a.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
