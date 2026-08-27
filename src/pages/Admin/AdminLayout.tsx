import React from "react";
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

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/listings", label: "Listings", icon: Building2 },
    { path: "/admin/leads", label: "Leads CRM", icon: Users },
    { path: "/admin/bookings", label: "Site Visits", icon: Calendar },
    { path: "/admin/agents", label: "Agents", icon: UserCheck },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#17212B] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#17212B] text-white border-r border-[#C7A76C]/20 p-6 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-8">
          {/* Admin Header Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C7A76C] text-[#17212B] flex items-center justify-center font-bold shadow-md">
              <ShieldAlert className="w-6 h-6" />
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

        {/* Create New Quick Action */}
        <div className="space-y-4 pt-6 border-t border-white/10">
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
        <header className="h-16 border-b border-[#E7E5DF] bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#53606C]">
            <span>Operations Console</span>
            <span>/</span>
            <span className="text-[#123B5D] capitalize font-extrabold">
              {location.pathname.split("/")[2] || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F7A69]/10 text-[#4F7A69] border border-[#4F7A69]/30 text-xs font-extrabold font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4F7A69] animate-pulse" />
            <span>D1 EDGE DB CONNECTED</span>
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
