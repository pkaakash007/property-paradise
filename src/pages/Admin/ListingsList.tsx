import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getProperties, deleteListing } from "../../lib/api";
import type { Property } from "../../types/property";
import { PlusCircle, Search, Trash2, Edit } from "lucide-react";

export default function ListingsList() {
  const [listings, setListings] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    getProperties().then((data) => setListings(data));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteListing(id);
      setListings((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filtered = listings.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || l.location?.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || l.propertyType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#17212B] tracking-tight">Property Listings</h1>
            <p className="text-xs font-semibold text-[#53606C] mt-1">Manage luxury villas and residential plots</p>
          </div>
          <Link
            to="/admin/listings/new"
            className="px-5 py-2.5 rounded-full bg-[#C7A76C] hover:bg-[#b09054] text-[#17212B] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Listing</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E7E5DF] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 bg-[#F7F5F0] border border-[#53606C]/30 rounded-xl px-3 py-2 w-full sm:w-72">
            <Search className="w-4 h-4 text-[#C7A76C] shrink-0" />
            <input
              type="text"
              placeholder="Search title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#17212B] focus:outline-none placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-[#53606C]">Type:</span>
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "all" ? "bg-[#123B5D] text-white font-extrabold shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("villa")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "villa" ? "bg-[#123B5D] text-white font-extrabold shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"}`}
            >
              Villas
            </button>
            <button
              onClick={() => setFilterType("plot")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "plot" ? "bg-[#123B5D] text-white font-extrabold shadow" : "text-[#17212B] hover:bg-[#E7E5DF]"}`}
            >
              Plots
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#53606C] uppercase tracking-wider border-b border-[#E7E5DF] text-[10px] bg-[#F7F5F0]">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Listing Title</th>
                  <th className="p-4">Type / Purpose</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF] text-[#17212B]">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F7F5F0]/50 transition-colors">
                    <td className="p-4">
                      <img
                        src={l.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=200&q=80"}
                        alt="thumb"
                        className="w-12 h-10 rounded-lg object-cover border border-[#E7E5DF]"
                      />
                    </td>
                    <td className="p-4 font-bold text-[#17212B] max-w-xs truncate">{l.title}</td>
                    <td className="p-4 capitalize font-bold text-[#123B5D]">{l.propertyType} · {l.listingPurpose}</td>
                    <td className="p-4 font-extrabold text-[#123B5D]">₹{(l.price / 100000).toFixed(0)}L</td>
                    <td className="p-4 font-semibold text-[#53606C]">{l.location?.city || "Coimbatore"}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#4F7A69]/10 text-[#4F7A69] border border-[#4F7A69]/30 uppercase">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/admin/listings/${l.id}/edit`}
                        className="p-2 rounded-lg bg-[#123B5D] text-white hover:bg-[#17212B] transition-colors inline-block"
                        title="Edit Listing"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="p-2 rounded-lg bg-[#C65A52]/10 text-[#C65A52] border border-[#C65A52]/30 hover:bg-[#C65A52] hover:text-white transition-colors"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
