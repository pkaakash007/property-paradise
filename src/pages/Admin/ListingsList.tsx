import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getProperties, deleteListing } from "../../lib/api";
import type { Property } from "../../types/property";
import { PlusCircle, Search, Trash2, Edit, Eye, CheckCircle } from "lucide-react";

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
            <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Property Listings</h1>
            <p className="text-xs text-slate-400 mt-1">Manage luxury villas and residential plots</p>
          </div>
          <Link
            to="/admin/listings/new"
            className="px-5 py-2.5 rounded-full bg-champagne hover:bg-champagne-soft text-ink font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Listing</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate/10 border border-slate/30 p-4 rounded-2xl">
          <div className="flex items-center gap-2 bg-black/40 border border-slate/40 rounded-xl px-3 py-2 w-full sm:w-72">
            <Search className="w-4 h-4 text-champagne shrink-0" />
            <input
              type="text"
              placeholder="Search title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Type:</span>
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold ${filterType === "all" ? "bg-deep-ocean text-white" : "text-slate-400"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("villa")}
              className={`px-3 py-1.5 rounded-lg font-semibold ${filterType === "villa" ? "bg-deep-ocean text-white" : "text-slate-400"}`}
            >
              Villas
            </button>
            <button
              onClick={() => setFilterType("plot")}
              className={`px-3 py-1.5 rounded-lg font-semibold ${filterType === "plot" ? "bg-deep-ocean text-white" : "text-slate-400"}`}
            >
              Plots
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate/10 border border-slate/30 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate/30 text-[10px] bg-black/30">
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
              <tbody className="divide-y divide-slate/20 text-slate-200">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <img
                        src={l.primaryImageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=200&q=80"}
                        alt="thumb"
                        className="w-12 h-10 rounded-lg object-cover border border-slate/40"
                      />
                    </td>
                    <td className="p-4 font-semibold text-white max-w-xs truncate">{l.title}</td>
                    <td className="p-4 capitalize font-mono text-champagne">{l.propertyType} · {l.listingPurpose}</td>
                    <td className="p-4 font-bold text-white">₹{(l.price / 100000).toFixed(0)}L</td>
                    <td className="p-4">{l.location?.city || "Coimbatore"}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sage/20 text-sage uppercase">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/admin/listings/${l.id}/edit`}
                        className="p-1.5 rounded-lg bg-deep-ocean text-white hover:bg-champagne hover:text-ink transition-colors inline-block"
                        title="Edit Listing"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="p-1.5 rounded-lg bg-coral/20 text-coral hover:bg-coral hover:text-white transition-colors"
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
