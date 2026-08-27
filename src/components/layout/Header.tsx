import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, MapPin } from "lucide-react";
import { getFavorites } from "../../lib/api";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const favoriteCount = getFavorites().length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-3 z-50 max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300">
      {/* iOS Dynamic Island Floating Pill Container */}
      <div className="rounded-full backdrop-blur-xl bg-[#17212B]/95 text-white border border-[#C7A76C]/40 shadow-2xl px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="Property Paradise"
            className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform bg-white p-1 rounded-xl shadow-md"
          />
          <div>
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white block font-serif leading-none">
              PROPERTY PARADISE
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-widest text-[#C7A76C] uppercase block font-extrabold mt-0.5">
              Luxury Real Estate
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/properties/sale"
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              isActive("/properties/sale")
                ? "bg-[#123B5D] text-white shadow-sm border border-[#C7A76C]/50"
                : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            Buy
          </Link>
          <Link
            to="/properties/rent"
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              isActive("/properties/rent")
                ? "bg-[#123B5D] text-white shadow-sm border border-[#C7A76C]/50"
                : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            Rent
          </Link>
          <Link
            to="/properties/villas"
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              isActive("/properties/villas")
                ? "bg-[#123B5D] text-white shadow-sm border border-[#C7A76C]/50"
                : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            Villas
          </Link>
          <Link
            to="/properties/plots"
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              isActive("/properties/plots")
                ? "bg-[#123B5D] text-white shadow-sm border border-[#C7A76C]/50"
                : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            Plots
          </Link>
          <Link
            to="/map"
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isActive("/map")
                ? "bg-[#123B5D] text-white shadow-sm border border-[#C7A76C]/50"
                : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#C7A76C]" />
            Map
          </Link>
        </nav>

        {/* Shortlist Action Pill */}
        <div className="hidden md:flex items-center">
          <Link
            to="/favorites"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C7A76C] text-[#17212B] text-xs font-extrabold shadow-md hover:bg-[#b09054] transition-all"
          >
            <Heart className="w-3.5 h-3.5 text-[#C65A52] fill-current" />
            <span>Shortlist</span>
            {favoriteCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 bg-[#C65A52] text-white text-[10px] font-extrabold rounded-full">
                {favoriteCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            to="/favorites"
            className="relative p-2 text-white hover:text-[#C7A76C]"
          >
            <Heart className="w-5 h-5 text-[#C65A52] fill-current" />
            {favoriteCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C65A52] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full bg-white/10 text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dynamic Island Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-3xl bg-[#17212B]/95 backdrop-blur-xl border border-[#C7A76C]/40 text-white space-y-2 shadow-2xl animate-fadeIn">
          <Link
            to="/properties/sale"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/10"
          >
            Buy Luxury Properties
          </Link>
          <Link
            to="/properties/rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/10"
          >
            Rent Luxury Properties
          </Link>
          <Link
            to="/properties/villas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/10"
          >
            Private Luxury Villas
          </Link>
          <Link
            to="/properties/plots"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/10"
          >
            Gated Residential Plots
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-[#C7A76C] hover:bg-white/10"
          >
            Interactive Map Search
          </Link>
          <div className="pt-2 border-t border-white/10">
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#C7A76C] text-[#17212B] font-extrabold text-xs justify-center shadow"
            >
              <Heart className="w-4 h-4 text-[#C65A52] fill-current" />
              <span>Saved Shortlist ({favoriteCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
