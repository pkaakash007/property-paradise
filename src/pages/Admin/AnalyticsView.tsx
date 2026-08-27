import React from "react";
import AdminLayout from "./AdminLayout";
import { Eye, Search } from "lucide-react";

export default function AnalyticsView() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#17212B] tracking-tight">Real-Time Telemetry & Analytics</h1>
          <p className="text-xs font-semibold text-[#53606C] mt-1">Property views, search patterns, and conversion performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E7E5DF] p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-lg font-bold font-serif text-[#17212B] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#C7A76C]" />
              <span>Most Viewed Properties</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-[#F7F5F0] border border-[#E7E5DF]">
                <span className="font-bold text-[#17212B]">Contemporary 4 BHK Luxury Villa</span>
                <span className="font-mono text-[#123B5D] font-extrabold">542 views</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F7F5F0] border border-[#E7E5DF]">
                <span className="font-bold text-[#17212B]">Colonial Style Hilltop Mansion</span>
                <span className="font-mono text-[#123B5D] font-extrabold">389 views</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F7F5F0] border border-[#E7E5DF]">
                <span className="font-bold text-[#17212B]">Exclusive Sadashivanagar Gated Plot</span>
                <span className="font-mono text-[#123B5D] font-extrabold">290 views</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E7E5DF] p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-lg font-bold font-serif text-[#17212B] flex items-center gap-2">
              <Search className="w-5 h-5 text-[#C7A76C]" />
              <span>Top Search Locations</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-[#F7F5F0] border border-[#E7E5DF]">
                <span className="font-bold text-[#17212B]">Coimbatore (Saravanampatti & Pollachi Rd)</span>
                <span className="font-mono text-[#4F7A69] font-extrabold">42% search share</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F7F5F0] border border-[#E7E5DF]">
                <span className="font-bold text-[#17212B]">Ooty & Nilgiris Hill Estates</span>
                <span className="font-mono text-[#4F7A69] font-extrabold">28% search share</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#F7F5F0] border border-[#E7E5DF]">
                <span className="font-bold text-[#17212B]">Chennai ECR Oceanfront</span>
                <span className="font-mono text-[#4F7A69] font-extrabold">18% search share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
