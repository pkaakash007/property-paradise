import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer bg-[#E7E5DF] rounded-xl ${className}`} />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-[#E7E5DF] overflow-hidden shadow-sm flex flex-col h-full space-y-4 p-4 animate-pulse">
      {/* Image Thumbnail Skeleton */}
      <div className="h-56 w-full bg-[#E7E5DF] rounded-2xl skeleton-shimmer" />

      {/* Content Shimmer */}
      <div className="space-y-3 px-1 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Price Tag */}
          <div className="h-7 w-1/3 bg-[#E7E5DF] rounded-lg skeleton-shimmer" />
          {/* Title */}
          <div className="h-5 w-4/5 bg-[#E7E5DF] rounded-md skeleton-shimmer" />
          {/* Address */}
          <div className="h-4 w-3/5 bg-[#E7E5DF] rounded-md skeleton-shimmer" />
        </div>

        {/* Specs Badges */}
        <div className="pt-3 border-t border-[#E7E5DF] flex items-center justify-between">
          <div className="h-4 w-16 bg-[#E7E5DF] rounded-md skeleton-shimmer" />
          <div className="h-4 w-16 bg-[#E7E5DF] rounded-md skeleton-shimmer" />
          <div className="h-4 w-16 bg-[#E7E5DF] rounded-md skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Gallery Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[420px]">
        <div className="md:col-span-2 h-full bg-[#E7E5DF] rounded-3xl skeleton-shimmer" />
        <div className="hidden md:flex flex-col gap-4 h-full">
          <div className="flex-1 bg-[#E7E5DF] rounded-2xl skeleton-shimmer" />
          <div className="flex-1 bg-[#E7E5DF] rounded-2xl skeleton-shimmer" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#E7E5DF] space-y-4">
            <div className="h-8 w-1/3 bg-[#E7E5DF] rounded-lg skeleton-shimmer" />
            <div className="h-6 w-3/4 bg-[#E7E5DF] rounded-md skeleton-shimmer" />
            <div className="h-4 w-1/2 bg-[#E7E5DF] rounded-md skeleton-shimmer" />
            <div className="grid grid-cols-4 gap-4 pt-4">
              <div className="h-16 bg-[#E7E5DF] rounded-2xl skeleton-shimmer" />
              <div className="h-16 bg-[#E7E5DF] rounded-2xl skeleton-shimmer" />
              <div className="h-16 bg-[#E7E5DF] rounded-2xl skeleton-shimmer" />
              <div className="h-16 bg-[#E7E5DF] rounded-2xl skeleton-shimmer" />
            </div>
          </div>
        </div>

        {/* Sidebar Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-[#E7E5DF] space-y-4">
            <div className="h-6 w-1/2 bg-[#E7E5DF] rounded-md skeleton-shimmer" />
            <div className="h-10 bg-[#E7E5DF] rounded-xl skeleton-shimmer" />
            <div className="h-10 bg-[#E7E5DF] rounded-xl skeleton-shimmer" />
            <div className="h-10 bg-[#E7E5DF] rounded-xl skeleton-shimmer" />
            <div className="h-12 bg-[#E7E5DF] rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-[#E7E5DF] animate-pulse">
      <td className="p-4"><div className="h-4 w-32 bg-[#E7E5DF] rounded skeleton-shimmer" /></td>
      <td className="p-4"><div className="h-4 w-24 bg-[#E7E5DF] rounded skeleton-shimmer" /></td>
      <td className="p-4"><div className="h-4 w-20 bg-[#E7E5DF] rounded skeleton-shimmer" /></td>
      <td className="p-4"><div className="h-4 w-16 bg-[#E7E5DF] rounded skeleton-shimmer" /></td>
    </tr>
  );
}
