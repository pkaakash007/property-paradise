import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getAnalyticsSummary, getProperties, deleteListing } from "../../lib/api";
import type { AnalyticsSummary, Property } from "../../types/property";
import { Building2, Users, Calendar, Eye, TrendingUp, ArrowUpRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentListings, setRecentListings] = useState<Property[]>([]);

  useEffect(() => {
    getAnalyticsSummary().then((data) => setSummary(data));
    getProperties().then((data) => setRecentListings(data.slice(0, 4)));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteListing(id);
      setRecentListings((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Top Header Title */}
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#17212B] tracking-tight">
            Operations Console
          </h1>
          <p className="text-xs font-semibold text-[#53606C] mt-1">
            Real-time telemetry and management portal for Property Paradise
          </p>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E7E5DF] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between text-[#53606C]">
              <span className="text-xs font-extrabold uppercase tracking-wider">Active Listings</span>
              <Building2 className="w-5 h-5 text-[#C7A76C]" />
            </div>
            <span className="text-4xl font-extrabold font-serif text-[#123B5D] block">
              {summary?.activeListings || 5}
            </span>
            <span className="text-xs text-[#4F7A69] flex items-center gap-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              100% Published & Active
            </span>
          </div>

          <div className="bg-white border border-[#E7E5DF] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between text-[#53606C]">
              <span className="text-xs font-extrabold uppercase tracking-wider">New Leads CRM</span>
              <Users className="w-5 h-5 text-[#C7A76C]" />
            </div>
            <span className="text-4xl font-extrabold font-serif text-[#123B5D] block">
              {summary?.totalLeads || 24}
            </span>
            <span className="text-xs text-[#4F7A69] flex items-center gap-1 font-bold">
              +14% this week
            </span>
          </div>

          <div className="bg-white border border-[#E7E5DF] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between text-[#53606C]">
              <span className="text-xs font-extrabold uppercase tracking-wider">Site Visits</span>
              <Calendar className="w-5 h-5 text-[#C7A76C]" />
            </div>
            <span className="text-4xl font-extrabold font-serif text-[#123B5D] block">
              {summary?.pendingBookings || 8}
            </span>
            <span className="text-xs text-[#C7A76C] font-bold">
              8 Pending Confirmation
            </span>
          </div>

          <div className="bg-white border border-[#E7E5DF] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between text-[#53606C]">
              <span className="text-xs font-extrabold uppercase tracking-wider">Property Views</span>
              <Eye className="w-5 h-5 text-[#C7A76C]" />
            </div>
            <span className="text-4xl font-extrabold font-serif text-[#123B5D] block">
              {summary?.totalViews || 1420}
            </span>
            <span className="text-xs text-[#4F7A69] font-bold">
              Conv. Rate: {summary?.conversionRate}
            </span>
          </div>
        </div>

        {/* Recent Listings Table Preview */}
        <div className="bg-white border border-[#E7E5DF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-serif text-[#17212B]">Recent Listings</h3>
            <Link to="/admin/listings" className="text-xs text-[#123B5D] hover:underline font-bold flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#53606C] uppercase tracking-wider border-b border-[#E7E5DF] text-[10px] bg-[#F7F5F0]">
                <tr>
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF] text-[#17212B]">
                {recentListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-[#F7F5F0]/50 transition-colors">
                    <td className="py-4 px-3 font-bold text-[#17212B] max-w-xs truncate">{listing.title}</td>
                    <td className="py-4 px-3 capitalize font-bold text-[#123B5D]">{listing.propertyType}</td>
                    <td className="py-4 px-3 font-extrabold text-[#123B5D]">
                      {listing.listingPurpose === "rent" ? `₹${(listing.price / 100000).toFixed(1)}L/mo` : `₹${(listing.price / 100000).toFixed(0)}L`}
                    </td>
                    <td className="py-4 px-3 font-semibold text-[#53606C]">{listing.location?.city}</td>
                    <td className="py-4 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#4F7A69]/10 text-[#4F7A69] border border-[#4F7A69]/30">
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 flex items-center gap-2">
                      <Link to={`/admin/listings/${listing.id}/edit`} className="text-[#123B5D] hover:underline font-extrabold">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="text-[#C65A52] hover:underline font-extrabold ml-2"
                        title="Delete Listing"
                      >
                        Delete
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
