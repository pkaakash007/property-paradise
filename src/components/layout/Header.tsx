import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, X, MapPin, Sparkles, Sun, Moon, Search } from "lucide-react";
import { getFavorites, getProperties } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import type { Property } from "../../types/property";
import { formatPrice } from "../property/PropertyCard";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const favoriteCount = getFavorites().length;
  const { user, logout, isAdmin, openAuthModal, setIsChatOpen, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const [headerSearch, setHeaderSearch] = useState("");
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [searchResults, setSearchResults] = useState<Property[]>([]);

  // Fetch all properties once on mount to avoid hitting D1 on every keystroke
  useEffect(() => {
    getProperties({}).then((data) => {
      setAllProperties(data);
    });
  }, []);

  // Filter properties client-side as the user types
  useEffect(() => {
    if (!headerSearch.trim()) {
      setSearchResults([]);
      return;
    }
    const query = headerSearch.toLowerCase().trim();
    const filtered = allProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.location && p.location.locality.toLowerCase().includes(query)) ||
        (p.location && p.location.city.toLowerCase().includes(query))
    );
    setSearchResults(filtered.slice(0, 5)); // Show top 5 matches
  }, [headerSearch, allProperties]);

  const searchVal = new URLSearchParams(location.search).get("search") || "";
  useEffect(() => {
    setHeaderSearch(searchVal);
  }, [location.search]);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchResults([]);
  }, [location.pathname, location.search]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/properties?search=${encodeURIComponent(headerSearch.trim())}`);
    } else {
      navigate("/properties");
    }
    setSearchResults([]);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSavedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("saved");
    } else {
      navigate("/favorites");
    }
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      if (!prev) setTimeout(() => searchInputRef.current?.focus(), 50);
      return !prev;
    });
  };

  const navLinks = [
    { to: "/properties", label: "Properties" },
    { to: "/map", label: "Map", icon: <MapPin className="w-3.5 h-3.5 text-[#C7A76C]" /> },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F5F0]/96 backdrop-blur-md border-b border-[#E7E5DF] shadow-sm transition-all duration-200">
      {/* ── Main Header Row ──────────────────────────────── */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-5 lg:px-8">
        <div className="flex items-center h-16 gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 border border-[#123B5D]/20 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/icon.png" alt="Property Paradise Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="font-bold text-[15px] tracking-tight text-[#17212B] block font-serif leading-tight whitespace-nowrap">
                Property Paradise
              </span>
              <span className="text-[9px] tracking-widest text-[#53606C] uppercase block font-bold whitespace-nowrap">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — hidden below lg */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap ${isActive(link.to)
                  ? "bg-[#123B5D] text-white shadow-sm"
                  : "text-[#17212B] hover:text-[#123B5D] hover:bg-[#E7E5DF]"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Search Bar — visible lg+ */}
          <div ref={dropdownRef} className="hidden lg:block relative w-52 xl:w-64 shrink-0">
            <form onSubmit={handleHeaderSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="w-full bg-white border border-[#123B5D]/20 rounded-full pl-9 pr-7 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#C7A76C] focus:ring-1 focus:ring-[#C7A76C] text-[#17212B] placeholder-[#53606C]/50 transition-all duration-200 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#53606C]/60 pointer-events-none" />
              {headerSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setHeaderSearch("");
                    navigate("/properties");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#53606C] hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>

            {/* Dropdown Live Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E2730] border border-[#E7E5DF] dark:border-[#2D3A4A] rounded-2xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-[#E7E5DF] dark:divide-[#2D3A4A] animate-fadeIn">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    to={`/property/${p.slug}`}
                    onClick={() => {
                      setHeaderSearch("");
                      setSearchResults([]);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-[#F7F5F0] dark:hover:bg-[#2D3A4A] transition-colors text-left"
                  >
                    <img
                      src={p.primaryImageUrl}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover bg-[#F7F5F0] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#17212B] dark:text-[#F7F5F0] truncate leading-tight">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-[#53606C] dark:text-[#8E8E93] truncate mt-0.5">
                        {p.location?.locality}, {p.location?.city}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-[#123B5D] dark:text-[#C7A76C] shrink-0">
                      {formatPrice(p.price, p.listingPurpose)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Right Actions — hidden below lg */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {/* Ask AI */}
            <button
              onClick={() => (isAdmin ? navigate("/admin/chat") : setIsChatOpen(true))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#123B5D]/25 bg-white text-[#17212B] text-xs font-semibold shadow-sm hover:bg-[#123B5D] hover:text-white hover:border-[#123B5D] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              className="p-2 rounded-full border border-[#123B5D]/25 bg-white hover:bg-[#123B5D] hover:text-white hover:border-[#123B5D] transition-all shadow-sm"
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-[#C7A76C]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#123B5D]" />
              )}
            </button>

            {/* Saved */}
            <button
              onClick={handleSavedClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#123B5D]/25 bg-white text-[#17212B] text-xs font-semibold shadow-sm hover:bg-[#123B5D] hover:text-white hover:border-[#123B5D] transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-[#C65A52]" />
              <span>Saved</span>
              {favoriteCount > 0 && (
                <span className="px-1.5 py-0.5 bg-[#C65A52] text-white text-[10px] font-extrabold rounded-full leading-none">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 py-1 focus:outline-none">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-[#123B5D]/20 object-cover hover:border-[#C7A76C] transition-all"
                  />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E7E5DF] rounded-2xl shadow-2xl py-2 hidden group-hover:block hover:block z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-[#E7E5DF]">
                    <p className="text-xs font-bold text-[#17212B] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#53606C] truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-xs font-bold text-[#17212B] hover:bg-[#F7F5F0]">
                      Admin Console
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-[#F7F5F0]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-full border border-[#123B5D]/25 bg-[#123B5D] text-white text-xs font-semibold shadow-sm hover:bg-[#17212B] transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* ── Medium screens (md–lg): show compact nav + icons ── */}
          <div className="hidden md:flex lg:hidden items-center gap-1 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${isActive(link.to) ? "bg-[#123B5D] text-white" : "text-[#17212B] hover:bg-[#E7E5DF]"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Tablet action icons */}
          <div className="hidden md:flex lg:hidden items-center gap-1 shrink-0">
            <button onClick={toggleSearch} className="p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF] transition-colors">
              <Search className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => (isAdmin ? navigate("/admin/chat") : setIsChatOpen(true))}
              className="p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF] transition-colors"
            >
              <Sparkles className="w-4.5 h-4.5 text-[#53606C]" />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF] transition-colors">
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-[#C7A76C]" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-[#123B5D]" />
              )}
            </button>
            <button onClick={handleSavedClick} className="relative p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF] transition-colors">
              <Heart className="w-4.5 h-4.5 text-[#C65A52]" />
              {favoriteCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#C65A52] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1 py-1 focus:outline-none">
                  <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full border border-[#123B5D]/20 object-cover" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#E7E5DF] rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
                  <div className="px-3 py-2 border-b border-[#E7E5DF]">
                    <p className="text-xs font-bold text-[#17212B] truncate">{user.name}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="block px-3 py-2 text-xs font-bold hover:bg-[#F7F5F0]">
                      Admin Console
                    </Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-[#F7F5F0]">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-3 py-1.5 rounded-lg bg-[#123B5D] text-white text-xs font-semibold hover:bg-[#17212B] transition-all">
                Sign In
              </Link>
            )}
          </div>

          {/* ── Mobile right icons — visible below md ── */}
          <div className="flex md:hidden items-center gap-1 shrink-0">
            <button onClick={toggleSearch} className="p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF]">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[#E7E5DF]">
              {theme === "dark" ? <Sun className="w-5 h-5 text-[#C7A76C]" /> : <Moon className="w-5 h-5 text-[#123B5D]" />}
            </button>
            <button onClick={handleSavedClick} className="relative p-2 rounded-lg hover:bg-[#E7E5DF]">
              <Heart className="w-5 h-5 text-[#C65A52]" />
              {favoriteCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#C65A52] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#17212B] hover:bg-[#E7E5DF]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Collapsible Search Bar (tablet + mobile) ─────────── */}
      {searchOpen && (
        <div ref={mobileDropdownRef} className="lg:hidden border-t border-[#E7E5DF] bg-[#F7F5F0] px-4 py-2.5 animate-fadeInUp relative">
          <form onSubmit={handleHeaderSearchSubmit} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-full bg-white border border-[#123B5D]/20 rounded-full pl-10 pr-8 py-2 text-sm font-semibold focus:outline-none focus:border-[#C7A76C] focus:ring-1 focus:ring-[#C7A76C] text-[#17212B] placeholder-[#53606C]/50 shadow-sm"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#53606C]/60 pointer-events-none" />
            {headerSearch ? (
              <button
                type="button"
                onClick={() => {
                  setHeaderSearch("");
                  navigate("/properties");
                  setSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#53606C] hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#53606C] hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Dropdown Live Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-[#1E2730] border border-[#E7E5DF] dark:border-[#2D3A4A] rounded-2xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto divide-y divide-[#E7E5DF] dark:divide-[#2D3A4A] animate-fadeIn">
              {searchResults.map((p) => (
                <Link
                  key={p.id}
                  to={`/property/${p.slug}`}
                  onClick={() => {
                    setHeaderSearch("");
                    setSearchResults([]);
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-[#F7F5F0] dark:hover:bg-[#2D3A4A] transition-colors text-left"
                >
                  <img
                    src={p.primaryImageUrl}
                    alt={p.title}
                    className="w-9 h-9 rounded-lg object-cover bg-[#F7F5F0] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#17212B] dark:text-[#F7F5F0] truncate leading-tight">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-[#53606C] dark:text-[#8E8E93] truncate mt-0.5">
                      {p.location?.locality}, {p.location?.city}
                    </p>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#123B5D] dark:text-[#C7A76C] shrink-0">
                    {formatPrice(p.price, p.listingPurpose)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Drawer ─────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E5DF] bg-[#F7F5F0] divide-y divide-[#E7E5DF] animate-fadeInUp">
          {/* Nav Links */}
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive(link.to) ? "bg-[#123B5D] text-white" : "text-[#17212B] hover:bg-[#E7E5DF]"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                isAdmin ? navigate("/admin/chat") : setIsChatOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#17212B] hover:bg-[#E7E5DF] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#53606C]" />
              Ask AI
            </button>
          </nav>

          {/* Auth section */}
          <div className="px-4 py-3">
            {user ? (
              <div className="bg-white rounded-xl border border-[#E7E5DF] p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full border border-[#123B5D]/20 object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#17212B] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#53606C] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
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
                className="w-full py-2.5 rounded-xl bg-[#123B5D] text-white text-sm font-bold text-center block hover:bg-[#17212B] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
