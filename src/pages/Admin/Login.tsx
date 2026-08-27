import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@propertyparadise.com");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-ink text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate/10 border border-slate/30 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-champagne text-ink flex items-center justify-center mx-auto font-bold shadow-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-serif tracking-tight">Property Paradise Console</h1>
          <p className="text-xs text-slate-400">Restricted Administrator Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <div className="flex items-center gap-2 bg-black/40 border border-slate/40 rounded-xl p-3">
              <Mail className="w-4 h-4 text-champagne shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="flex items-center gap-2 bg-black/40 border border-slate/40 rounded-xl p-3">
              <Lock className="w-4 h-4 text-champagne shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-champagne hover:bg-champagne-soft text-ink font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            Authenticate & Open Console
          </button>
        </form>
      </div>
    </div>
  );
}
