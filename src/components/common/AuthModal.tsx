import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { X, Shield, AlertCircle } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  reason?: string | null;
}

export default function AuthModal({ onClose, reason }: AuthModalProps) {
  const { user, loginWithGoogle, mockLogin } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const isPlaceholder = !import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                        import.meta.env.VITE_GOOGLE_CLIENT_ID.includes("placeholder") || 
                        import.meta.env.VITE_GOOGLE_CLIENT_ID.trim() === "";



  // Handle click outside modal content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMockClick = (role: "admin" | "user") => {
    mockLogin(role);
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn"
    >
      {/* iOS Card Modal */}
      <div className="w-full max-w-[380px] bg-white border border-[#E8E8ED] rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] flex flex-col p-8 sm:p-9 relative scale-up-animation">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#E8E8ED] flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo/Icon */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-11 h-11 rounded-2xl bg-white border border-[#E8E8ED] p-2 flex items-center justify-center mx-auto shadow-sm">
            <img src="/icon.png" alt="Property Paradise Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#1D1D1F]">
              Property Paradise
            </h1>
            <p className="text-[8px] font-bold text-[#8E8E93] tracking-widest uppercase">
              Luxury Real Estate
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-1 pt-4">
          <h2 className="text-sm font-bold text-[#1D1D1F]">
            {reason === "save" || reason === "saved"
              ? "Want to save this property?" 
              : reason === "chat" 
              ? "Want to chat with an advisor?" 
              : "Sign in to your account"}
          </h2>
          <p className="text-xs text-[#8E8E93] leading-relaxed px-2">
            {reason === "save" || reason === "saved"
              ? "Please sign in to save properties and sync them across all your devices."
              : reason === "chat"
              ? "Please sign in to start a support conversation with our luxury real estate advisors."
              : "Create an account or sign in to sync your luxury saved list across all your devices."}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-[#FF3B30]/5 border border-[#FF3B30]/20 rounded-xl p-3 mt-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
            <span className="text-[11px] text-[#FF3B30] font-medium">{errorMsg}</span>
          </div>
        )}

        {/* OAuth Buttons Container */}
        <div className="pt-5 flex justify-center w-full">
          {isPlaceholder ? (
            <div className="flex flex-col gap-2.5 w-full">
              <button
                type="button"
                onClick={() => handleMockClick("user")}
                className="w-full py-3 rounded-xl border border-[#D2D2D7] bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-bold text-xs tracking-tight transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Developer Mock Sign In</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex justify-center border border-[#E8E8ED] bg-white hover:bg-[#FAFAFA] rounded-xl p-3 transition-all shadow-sm">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    loginWithGoogle(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  setErrorMsg("Google Sign-In failed. Please try again.");
                }}
                useOneTap
              />
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
