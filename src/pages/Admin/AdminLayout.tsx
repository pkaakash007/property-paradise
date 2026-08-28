import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  UserCheck,
  BarChart3,
  LogOut,
  PlusCircle,
  ShieldAlert,
  Home,
  Globe,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/listings", label: "Listings", icon: Building2 },
    { path: "/admin/leads", label: "Leads CRM", icon: Users },
    { path: "/admin/bookings", label: "Site Visits", icon: Calendar },
    { path: "/admin/agents", label: "Agents", icon: UserCheck },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#17212B] flex flex-col md:flex-row font-sans pb-16 md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#17212B] text-white border-r border-[#C7A76C]/20 p-6 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-8">
          {/* Admin Header Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 border border-[#C7A76C]/30 shadow-md overflow-hidden">
              <img src="/icon.png" alt="Property Paradise Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight font-serif block text-white">
                PARADISE CONSOLE
              </span>
              <span className="text-[10px] tracking-widest text-[#F2E9D8] uppercase block -mt-1 font-bold">
                Operations Portal
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-[#123B5D] text-white shadow-md border-l-4 border-[#C7A76C]"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-[#C7A76C]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions & Navigation */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <Link
            to="/"
            className="w-full py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Globe className="w-4 h-4 text-[#C7A76C]" />
            <span>View Public Website</span>
          </Link>

          <Link
            to="/admin/listings/new"
            className="w-full py-3 rounded-xl bg-[#C7A76C] hover:bg-[#b09054] text-[#17212B] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Listing</span>
          </Link>

          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-[#C65A52] transition-colors px-2 py-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F7F5F0] overflow-y-auto">
        {/* Top Operations Header */}
        <header className="h-16 border-b border-[#E7E5DF] bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#F7F5F0] text-[#17212B] border border-[#E7E5DF]"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#53606C]">
              <span className="hidden sm:inline">Operations Console /</span>
              <span className="text-[#123B5D] capitalize font-extrabold text-sm sm:text-xs">
                {location.pathname.split("/")[2] || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#123B5D] text-white text-xs font-bold shadow hover:bg-[#17212B] transition-all"
            >
              <Home className="w-4 h-4 text-[#C7A76C]" />
              <span className="hidden sm:inline">Go to Homepage</span>
              <span className="sm:hidden">Home</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F7A69]/10 text-[#4F7A69] border border-[#4F7A69]/30 text-xs font-extrabold font-mono">
              <span className="w-2 h-2 rounded-full bg-[#4F7A69] animate-pulse" />
              <span>D1 DB</span>
            </div>
          </div>
        </header>

        {/* Mobile Slide-out Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#17212B]/95 backdrop-blur-md flex flex-col justify-between p-6 animate-fadeIn">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 border border-[#C7A76C]/30 shadow-md overflow-hidden">
                    <img src="/icon.png" alt="Property Paradise Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-bold text-lg font-serif text-white block">PARADISE CONSOLE</span>
                    <span className="text-[10px] tracking-widest text-[#C7A76C] uppercase font-bold">Admin Portal</span>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                        active
                          ? "bg-[#123B5D] text-white border-l-4 border-[#C7A76C]"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? "text-[#C7A76C]" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <Link
                to="/admin/listings/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#C7A76C] text-[#17212B] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add New Listing</span>
              </Link>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          {children || <Outlet />}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (App Experience) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#17212B] border-t border-[#C7A76C]/30 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <Link
          to="/admin/dashboard"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold ${
            location.pathname === "/admin/dashboard" ? "text-[#C7A76C]" : "text-slate-300"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/admin/listings"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold ${
            location.pathname.startsWith("/admin/listings") ? "text-[#C7A76C]" : "text-slate-300"
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Listings</span>
        </Link>
        <Link
          to="/admin/listings/new"
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold text-[#17212B]"
        >
          <div className="w-8 h-8 rounded-full bg-[#C7A76C] flex items-center justify-center shadow-lg -mt-3">
            <PlusCircle className="w-5 h-5 text-[#17212B]" />
          </div>
          <span className="text-[#C7A76C] mt-0.5">New</span>
        </Link>
        <Link
          to="/admin/leads"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold ${
            location.pathname.startsWith("/admin/leads") ? "text-[#C7A76C]" : "text-slate-300"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Leads</span>
        </Link>
        <Link
          to="/admin/bookings"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold ${
            location.pathname.startsWith("/admin/bookings") ? "text-[#C7A76C]" : "text-slate-300"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Visits</span>
        </Link>
      </div>
    </div>
  );
}
