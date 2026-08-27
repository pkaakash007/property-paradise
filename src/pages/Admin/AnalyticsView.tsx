import React from "react";
import AdminLayout from "./AdminLayout";
import { BarChart3, TrendingUp, Eye, Users, Search } from "lucide-react";

export default function AnalyticsView() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Real-Time Telemetry & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Property views, search patterns, and conversion performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate/10 border border-slate/30 p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-champagne" />
              <span>Most Viewed Properties</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-black/40">
                <span className="font-semibold text-white">Contemporary 4 BHK Luxury Villa</span>
                <span className="font-mono text-champagne">542 views</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-black/40">
                <span className="font-semibold text-white">Colonial Style Hilltop Mansion</span>
                <span className="font-mono text-champagne">389 views</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-black/40">
                <span className="font-semibold text-white">Exclusive Sadashivanagar Gated Plot</span>
                <span className="font-mono text-champagne">290 views</span>
              </div>
            </div>
          </div>

          <div className="bg-slate/10 border border-slate/30 p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-champagne" />
              <span>Top Search Locations</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-black/40">
                <span className="font-semibold text-white">Coimbatore (Saravanampatti & Pollachi Rd)</span>
                <span className="font-mono text-sage font-bold">42% search share</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-black/40">
                <span className="font-semibold text-white">Ooty & Nilgiris Hill Estates</span>
                <span className="font-mono text-sage font-bold">28% search share</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-black/40">
                <span className="font-semibold text-white">Chennai ECR Oceanfront</span>
                <span className="font-mono text-sage font-bold">18% search share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
