import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getAnalyticsSummary, getProperties } from "../../lib/api";
import type { AnalyticsSummary, Property } from "../../types/property";
import { Building2, Users, Calendar, Eye, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentListings, setRecentListings] = useState<Property[]>([]);

  useEffect(() => {
    setSummary(getAnalyticsSummary());
    getProperties().then((data) => setRecentListings(data.slice(0, 4)));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Top Header Title */}
        <div>
          <h1 className="text-3xl font-bold font-serif text-white tracking-tight">
            Operations Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and management portal for Property Paradise
          </p>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate/10 border border-slate/30 p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Listings</span>
              <Building2 className="w-5 h-5 text-champagne" />
            </div>
            <span className="text-3xl font-bold font-serif text-white block">
              {summary?.activeListings || 5}
            </span>
            <span className="text-[11px] text-sage flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3" />
              100% Published & Active
            </span>
          </div>

          <div className="bg-slate/10 border border-slate/30 p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">New Leads CRM</span>
              <Users className="w-5 h-5 text-champagne" />
            </div>
            <span className="text-3xl font-bold font-serif text-white block">
              {summary?.totalLeads || 24}
            </span>
            <span className="text-[11px] text-sage flex items-center gap-1 font-semibold">
              +14% this week
            </span>
          </div>

          <div className="bg-slate/10 border border-slate/30 p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Site Visits</span>
              <Calendar className="w-5 h-5 text-champagne" />
            </div>
            <span className="text-3xl font-bold font-serif text-white block">
              {summary?.pendingBookings || 8}
            </span>
            <span className="text-[11px] text-champagne flex items-center gap-1 font-semibold">
              8 Pending Confirmation
            </span>
          </div>

          <div className="bg-slate/10 border border-slate/30 p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Property Views</span>
              <Eye className="w-5 h-5 text-champagne" />
            </div>
            <span className="text-3xl font-bold font-serif text-white block">
              {summary?.totalViews || 1420}
            </span>
            <span className="text-[11px] text-sage font-semibold">
              Conv. Rate: {summary?.conversionRate}
            </span>
          </div>
        </div>

        {/* Recent Listings Table Preview */}
        <div className="bg-slate/10 border border-slate/30 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-serif text-white">Recent Listings</h3>
            <Link to="/admin/listings" className="text-xs text-champagne hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate/30 text-[10px]">
                <tr>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/20 text-slate-200">
                {recentListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-semibold text-white max-w-xs truncate">{listing.title}</td>
                    <td className="py-4 capitalize font-mono text-champagne">{listing.propertyType}</td>
                    <td className="py-4 font-bold text-white">₹{(listing.price / 100000).toFixed(0)}L</td>
                    <td className="py-4">{listing.location?.city}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sage/20 text-sage">
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <Link to={`/admin/listings/${listing.id}/edit`} className="text-champagne hover:underline font-medium">
                        Edit
                      </Link>
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
