import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, User, Menu, X, Building2, MapPin } from "lucide-react";
import { getFavorites } from "../../lib/api";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const favoriteCount = getFavorites().length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-porcelain/90 backdrop-blur-md border-b border-mist transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-deep-ocean flex items-center justify-center text-champagne shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-semibold text-xl tracking-tight text-ink block font-serif">
                PROPERTY PARADISE
              </span>
              <span className="text-[10px] tracking-widest text-slate uppercase block -mt-1 font-medium">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/properties/sale"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/properties/sale")
                  ? "bg-deep-ocean text-white shadow-sm"
                  : "text-slate hover:text-ink hover:bg-mist/50"
              }`}
            >
              Buy
            </Link>
            <Link
              to="/properties/rent"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/properties/rent")
                  ? "bg-deep-ocean text-white shadow-sm"
                  : "text-slate hover:text-ink hover:bg-mist/50"
              }`}
            >
              Rent
            </Link>
            <Link
              to="/properties/villas"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/properties/villas")
                  ? "bg-deep-ocean text-white shadow-sm"
                  : "text-slate hover:text-ink hover:bg-mist/50"
              }`}
            >
              Villas
            </Link>
            <Link
              to="/properties/plots"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/properties/plots")
                  ? "bg-deep-ocean text-white shadow-sm"
                  : "text-slate hover:text-ink hover:bg-mist/50"
              }`}
            >
              Plots
            </Link>
            <Link
              to="/map"
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive("/map")
                  ? "bg-deep-ocean text-white shadow-sm"
                  : "text-slate hover:text-ink hover:bg-mist/50"
              }`}
            >
              <MapPin className="w-4 h-4 text-champagne" />
              Map Search
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-full text-slate hover:text-ink hover:bg-mist/60 transition-colors"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {favoriteCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-mist bg-white hover:border-deep-ocean/30 text-ink text-sm font-medium shadow-sm hover:shadow transition-all"
            >
              <User className="w-4 h-4 text-slate" />
              <span>Account</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/favorites"
              className="relative p-2 rounded-lg text-slate hover:bg-mist/50"
            >
              <Heart className="w-6 h-6" />
              {favoriteCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink hover:bg-mist/50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-mist bg-porcelain px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/properties/sale"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-base font-medium text-ink hover:bg-mist/50"
          >
            Buy Properties
          </Link>
          <Link
            to="/properties/rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-base font-medium text-ink hover:bg-mist/50"
          >
            Rent Properties
          </Link>
          <Link
            to="/properties/villas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-base font-medium text-ink hover:bg-mist/50"
          >
            Luxury Villas
          </Link>
          <Link
            to="/properties/plots"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-base font-medium text-ink hover:bg-mist/50"
          >
            Residential Plots
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-base font-medium text-deep-ocean font-semibold hover:bg-mist/50"
          >
            Interactive Map Search
          </Link>
          <div className="pt-2 border-t border-mist flex flex-col gap-2">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-deep-ocean text-white font-medium justify-center shadow"
            >
              <User className="w-4 h-4" />
              <span>User Profile</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
