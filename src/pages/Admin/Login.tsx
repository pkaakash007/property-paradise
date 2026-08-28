import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, Mail, Building2 } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@propertyparadise.com");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#17212B] text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#123B5D] border-2 border-[#C7A76C]/40 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8 backdrop-blur-xl">
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white p-2.5 border border-[#C7A76C]/40 flex items-center justify-center mx-auto shadow-xl overflow-hidden">
            <img src="/icon.png" alt="Property Paradise Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
              Property Paradise Console
            </h1>
            <p className="text-xs font-semibold text-[#F2E9D8] tracking-wider uppercase mt-1">
              Restricted Administrator Portal
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#F2E9D8] uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="flex items-center gap-3 bg-[#17212B] border border-[#C7A76C]/40 rounded-xl p-3.5 focus-within:ring-2 focus-within:ring-[#C7A76C] transition-all">
              <Mail className="w-4 h-4 text-[#C7A76C] shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder-slate-400"
                placeholder="admin@propertyparadise.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F2E9D8] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-3 bg-[#17212B] border border-[#C7A76C]/40 rounded-xl p-3.5 focus-within:ring-2 focus-within:ring-[#C7A76C] transition-all">
              <Lock className="w-4 h-4 text-[#C7A76C] shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#C7A76C] hover:bg-[#b09054] text-[#17212B] font-extrabold text-xs uppercase tracking-widest shadow-2xl transition-all transform active:scale-95"
          >
            Authenticate & Open Console
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-[11px] text-slate-300 font-medium flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#C7A76C]" />
            <span>Authorized Operations Personnel Only</span>
          </p>
        </div>
      </div>
    </div>
  );
}
