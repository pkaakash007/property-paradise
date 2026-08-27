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
} from "lucide-react";

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(true);

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/listings", label: "Listings", icon: Building2 },
    { path: "/admin/leads", label: "Leads CRM", icon: Users },
    { path: "/admin/bookings", label: "Site Visits", icon: Calendar },
    { path: "/admin/agents", label: "Agents", icon: UserCheck },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-ink text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 border-r border-slate/20 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          {/* Admin Header Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-champagne flex items-center justify-center text-ink font-bold shadow">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight font-serif block">
                PARADISE CONSOLE
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase block -mt-1">
                Operations Portal
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-deep-ocean text-white shadow-lg border border-deep-ocean/50"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 text-champagne" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Create New Quick Action */}
        <div className="space-y-4 pt-6 border-t border-slate/20">
          <Link
            to="/admin/listings/new"
            className="w-full py-3 rounded-2xl bg-champagne text-ink font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow hover:bg-champagne-soft transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Listing</span>
          </Link>

          <button
            onClick={() => navigate("/admin/login")}
            className="w-full flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-coral transition-colors px-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-porcelain/5 overflow-y-auto">
        {/* Top Operations Header */}
        <header className="h-16 border-b border-slate/20 bg-black/20 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Operations Console</span>
            <span>/</span>
            <span className="text-white capitalize">{location.pathname.split("/")[2] || "Dashboard"}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-2.5 h-2.5 rounded-full bg-sage animate-ping" title="System Live" />
            <span className="text-xs text-slate-300 font-mono">D1 EDGE DB CONNECTED</span>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="p-6 sm:p-10 max-w-7xl w-full mx-auto flex-1">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}
