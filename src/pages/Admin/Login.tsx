import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, Mail, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const { user, loginWithGoogle, mockLogin, logout, isAdmin } = useAuth();

  const isPlaceholder = !import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                        import.meta.env.VITE_GOOGLE_CLIENT_ID.includes("placeholder") || 
                        import.meta.env.VITE_GOOGLE_CLIENT_ID.trim() === "";

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        setErrorMsg(`Account ${user.email} is not authorized for the Admin Console.`);
      }
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mockLogin("admin");
  };

  return (
    <div className="w-full min-h-screen bg-[#17212B] text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#123B5D] border-2 border-[#C7A76C]/40 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl">
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

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-xs text-red-200 font-medium w-full">
              <p>{errorMsg}</p>
              <button 
                type="button"
                onClick={() => { logout(); setErrorMsg(""); }} 
                className="underline text-white font-bold mt-1 block"
              >
                Clear Session
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#F2E9D8] uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="flex items-center gap-3 bg-[#17212B] border border-[#C7A76C]/40 rounded-xl p-3.5">
              <Mail className="w-4 h-4 text-[#C7A76C] shrink-0" />
              <span className="text-sm font-bold text-white">admin@propertyparadise.com</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F2E9D8] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-3 bg-[#17212B] border border-[#C7A76C]/40 rounded-xl p-3.5">
              <Lock className="w-4 h-4 text-[#C7A76C] shrink-0" />
              <span className="text-sm font-bold text-white tracking-widest">••••••••</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#C7A76C] hover:bg-[#b09054] text-[#17212B] font-extrabold text-xs uppercase tracking-widest shadow-2xl transition-all transform active:scale-95 animate-fadeIn"
          >
            Authenticate & Open Console
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-[#123B5D] px-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
            Or
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          {isPlaceholder ? (
            <button
              type="button"
              onClick={() => mockLogin("admin")}
              className="w-full py-4 rounded-xl border border-[#C7A76C]/40 bg-[#17212B] hover:bg-[#1f2d3b] text-[#C7A76C] font-extrabold text-xs uppercase tracking-widest transition-all shadow-md transform active:scale-95"
              title="Mock admin login for testing"
            >
              Mock Admin Login (Dev Mode)
            </button>
          ) : (
            <div className="w-full flex justify-center bg-white rounded-xl p-2">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    loginWithGoogle(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  setErrorMsg("Google Sign-In failed. Please try again.");
                }}
              />
            </div>
          )}
        </div>

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
