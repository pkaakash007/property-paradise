import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getAgents } from "../../lib/api";
import type { Agent } from "../../types/property";
import { PlusCircle } from "lucide-react";

export default function AgentsList() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    getAgents().then((data) => setAgents(data));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#17212B] tracking-tight">Luxury Estate Agents</h1>
            <p className="text-xs font-semibold text-[#53606C] mt-1">Manage assigned property advisors</p>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-[#C7A76C] hover:bg-[#b09054] text-[#17212B] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md">
            <PlusCircle className="w-4 h-4" />
            <span>Add Agent</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {agents.map((a) => (
            <div key={a.id} className="bg-white border border-[#E7E5DF] p-6 rounded-2xl flex items-center gap-6 shadow-sm">
              <img
                src={a.profileImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"}
                alt={a.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#C7A76C] shadow-md"
              />
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#C7A76C] uppercase tracking-wider block">{a.designation}</span>
                <h3 className="text-lg font-bold font-serif text-[#17212B]">{a.name}</h3>
                <p className="text-xs text-[#53606C] font-semibold line-clamp-2">{a.bio}</p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#123B5D] font-mono font-bold">
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
