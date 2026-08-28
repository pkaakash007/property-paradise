import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, X, Building2, MapPin, Sparkles } from "lucide-react";
import { getFavorites } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const favoriteCount = getFavorites().length;
  const { user, logout, isAdmin, openAuthModal, setIsChatOpen } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleSavedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("saved");
    } else {
      navigate("/favorites");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#E7E5DF] transition-all duration-200 shadow-sm">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 border border-[#123B5D]/20 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/icon.png" alt="Property Paradise Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xl tracking-tight text-[#17212B] block font-serif whitespace-nowrap">
                  PROPERTY PARADISE
                </span>
                <span className="text-[10px] tracking-widest text-[#53606C] uppercase block -mt-1 font-bold whitespace-nowrap">
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
          </div>

          {/* Right Action Icons (Shortlist & Google Login) */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#123B5D]/30 bg-white text-[#17212B] text-xs font-bold shadow-sm hover:bg-[#123B5D] hover:text-white transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#53606C] group-hover:animate-pulse" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={handleSavedClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#123B5D]/30 bg-white text-[#17212B] text-xs font-bold shadow-sm hover:bg-[#123B5D] hover:text-white transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#C65A52]" />
              <span>Saved</span>
              {favoriteCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#C65A52] text-white text-[10px] font-extrabold rounded-full">
                  {favoriteCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-1.5 rounded-lg bg-[#C7A76C] text-[#17212B] text-xs font-extrabold hover:bg-[#b09054] transition-all shadow-sm"
                  >
                    Console
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 focus:outline-none py-1">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-[#123B5D]/30 object-cover"
                    />
                    <span className="text-xs font-bold text-[#17212B] hidden lg:inline-block">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-[#E7E5DF] rounded-xl shadow-xl py-2 hidden group-hover:block hover:block z-50">
                    <div className="px-4 py-2 border-b border-[#E7E5DF]">
                      <p className="text-xs font-bold text-[#17212B] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#53606C] truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block w-full text-left px-4 py-2 text-xs font-bold text-[#17212B] hover:bg-[#E7E5DF]"
                      >
                        Admin Console
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-[#E7E5DF]"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-[#123B5D]/30 bg-white text-[#17212B] hover:bg-[#123B5D] hover:text-white text-xs font-bold shadow-sm transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={handleSavedClick}
              className="relative p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF] cursor-pointer"
            >
              <Heart className="w-6 h-6" />
              {favoriteCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C65A52] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>
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
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsChatOpen(true);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-[#17212B] hover:bg-[#E7E5DF] flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4.5 h-4.5 text-[#53606C]" />
            <span>Ask AI</span>
          </button>
          <div className="pt-2 border-t border-[#E7E5DF] flex flex-col gap-3">
            {user ? (
              <div className="px-4 py-2.5 bg-white rounded-lg border border-[#E7E5DF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border border-[#123B5D]/30 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#17212B]">{user.name}</p>
                    <p className="text-[10px] text-[#53606C]">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-1.5 bg-[#C7A76C] text-[#17212B] text-[10px] font-extrabold rounded-lg"
                    >
                      Console
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg border border-red-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg border border-[#123B5D]/30 bg-white text-[#17212B] text-sm font-bold text-center block"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#123B5D] text-white font-bold justify-center shadow"
            >
              <Heart className="w-4 h-4 text-[#C65A52]" />
              <span>Saved Properties ({favoriteCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
