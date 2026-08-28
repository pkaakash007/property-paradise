import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loginWithGoogle, mockLogin, isAdmin } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const isPlaceholder = !import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                        import.meta.env.VITE_GOOGLE_CLIENT_ID.includes("placeholder") || 
                        import.meta.env.VITE_GOOGLE_CLIENT_ID.trim() === "";

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, isAdmin, navigate]);

  const handleMockClick = (role: "admin" | "user") => {
    mockLogin(role);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 sm:p-6 font-sans antialiased text-[#1D1D1F]">
      
      {/* iOS Style Login Container */}
      <div className="w-full max-w-[400px] bg-white border border-[#E8E8ED] p-8 sm:p-10 rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-6 flex flex-col transition-all">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="self-start flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93] hover:text-[#007AFF] tracking-tight transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E8ED] p-2 flex items-center justify-center mx-auto shadow-sm">
            <img src="/icon.png" alt="Property Paradise Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#1D1D1F]">
              Property Paradise
            </h1>
            <p className="text-[9px] font-bold text-[#8E8E93] tracking-widest uppercase">
              Luxury Real Estate
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5 pt-2">
          <h2 className="text-base font-bold text-[#1D1D1F]">
            Sign in to your account
          </h2>
          <p className="text-xs text-[#8E8E93] leading-relaxed px-4">
            Verify your identity securely with Google OAuth to sync your luxury saved list and view listings.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-[#FF3B30]/5 border border-[#FF3B30]/20 rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
            <span className="text-xs text-[#FF3B30] font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Google Authentication Container */}
        <div className="pt-2 flex justify-center w-full">
          {isPlaceholder ? (
            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() => handleMockClick("user")}
                className="w-full py-3 rounded-xl border border-[#D2D2D7] bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-bold text-xs tracking-tight transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <span>Developer Mock Sign In</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex justify-center border border-[#E8E8ED] bg-white hover:bg-[#FAFAFA] rounded-xl p-3.5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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
