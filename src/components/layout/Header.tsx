import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, Building2, MapPin } from "lucide-react";
import { getFavorites } from "../../lib/api";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const favoriteCount = getFavorites().length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#E7E5DF] transition-all duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#123B5D] flex items-center justify-center text-[#C7A76C] shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-[#17212B] block font-serif">
                PROPERTY PARADISE
              </span>
              <span className="text-[10px] tracking-widest text-[#53606C] uppercase block -mt-1 font-bold">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
            <Link
              to="/properties/sale"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/properties/sale")
                  ? "bg-[#123B5D] text-white shadow"
                  : "text-[#17212B] hover:text-[#123B5D] hover:bg-[#E7E5DF]"
              }`}
            >
              Buy
            </Link>
            <Link
              to="/properties/rent"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/properties/rent")
                  ? "bg-[#123B5D] text-white shadow"
                  : "text-[#17212B] hover:text-[#123B5D] hover:bg-[#E7E5DF]"
              }`}
            >
              Rent
            </Link>
            <Link
              to="/properties/villas"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/properties/villas")
                  ? "bg-[#123B5D] text-white shadow"
                  : "text-[#17212B] hover:text-[#123B5D] hover:bg-[#E7E5DF]"
              }`}
            >
              Villas
            </Link>
            <Link
              to="/properties/plots"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/properties/plots")
                  ? "bg-[#123B5D] text-white shadow"
                  : "text-[#17212B] hover:text-[#123B5D] hover:bg-[#E7E5DF]"
              }`}
            >
              Plots
            </Link>
            <Link
              to="/map"
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isActive("/map")
                  ? "bg-[#123B5D] text-white shadow"
                  : "text-[#17212B] hover:text-[#123B5D] hover:bg-[#E7E5DF]"
              }`}
            >
              <MapPin className="w-4 h-4 text-[#C7A76C]" />
              Map Search
            </Link>
          </nav>

          {/* Right Action Icons (Shortlist only - No public login) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/favorites"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#123B5D]/30 bg-white text-[#17212B] text-xs font-bold shadow-sm hover:bg-[#123B5D] hover:text-white transition-all"
            >
              <Heart className="w-4 h-4 text-[#C65A52]" />
              <span>Shortlist</span>
              {favoriteCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#C65A52] text-white text-[10px] font-extrabold rounded-full">
                  {favoriteCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/favorites"
              className="relative p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF]"
            >
              <Heart className="w-6 h-6" />
              {favoriteCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C65A52] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E5DF] bg-[#F7F5F0] px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/properties/sale"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-bold text-[#17212B] hover:bg-[#E7E5DF]"
          >
            Buy Properties
          </Link>
          <Link
            to="/properties/rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-bold text-[#17212B] hover:bg-[#E7E5DF]"
          >
            Rent Properties
          </Link>
          <Link
            to="/properties/villas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-bold text-[#17212B] hover:bg-[#E7E5DF]"
          >
            Luxury Villas
          </Link>
          <Link
            to="/properties/plots"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-bold text-[#17212B] hover:bg-[#E7E5DF]"
          >
            Residential Plots
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-bold text-[#123B5D] hover:bg-[#E7E5DF]"
          >
            Interactive Map Search
          </Link>
          <div className="pt-2 border-t border-[#E7E5DF]">
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#123B5D] text-white font-bold justify-center shadow"
            >
              <Heart className="w-4 h-4 text-[#C65A52]" />
              <span>Saved Shortlist ({favoriteCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
