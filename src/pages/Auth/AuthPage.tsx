import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { 
  Shield, 
  ArrowLeft, 
  KeyRound, 
  UserPlus, 
  AlertCircle, 
  Mail, 
  User, 
  Lock, 
  Fingerprint, 
  CheckCircle2 
} from "lucide-react";

interface AuthPageProps {
  initialTab?: "login" | "signup";
}

export default function AuthPage({ initialTab = "login" }: AuthPageProps) {
  const navigate = useNavigate();
  const { 
    user, 
    loginWithGoogle, 
    mockLogin, 
    logout, 
    isAdmin,
    loginWithCredentials,
    registerWithCredentials,
    verifyCredentialOtp
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP Verification States
  const [isOtpPending, setIsOtpPending] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const isPlaceholder = !import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                        import.meta.env.VITE_GOOGLE_CLIENT_ID.includes("placeholder") || 
                        import.meta.env.VITE_GOOGLE_CLIENT_ID.trim() === "";

  useEffect(() => {
    setActiveTab(initialTab);
    // Reset forms when tab changes
    setErrorMsg("");
    setSuccessMsg("");
    setIsOtpPending(false);
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, isAdmin, navigate]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (activeTab === "signup") {
        // Register Flow
        const res = await registerWithCredentials(username, email, password);
        setOtpEmail(email);
        setIsOtpPending(true);
        if (res.otp) {
          setDevOtp(res.otp);
        }
        setSuccessMsg("Verification code sent to your email!");
      } else {
        // Login Flow
        await loginWithCredentials(email, password);
      }
    } catch (err: any) {
      if (err.unverified) {
        // User registered but unverified - redirect to OTP verify screen
        setOtpEmail(err.email || email);
        setIsOtpPending(true);
        if (err.otp) {
          setDevOtp(err.otp);
        }
        setErrorMsg(err.message || "Email is unverified. Verification code sent.");
      } else {
        setErrorMsg(err.message || "Authentication failed. Please check details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      await verifyCredentialOtp(otpEmail, otpCode);
      setSuccessMsg("Email verified successfully! Logging you in...");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await registerWithCredentials(username || otpEmail.split("@")[0], otpEmail, password || "password");
      if (res.otp) {
        setDevOtp(res.otp);
      }
      setSuccessMsg("Verification code resent successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleMockClick = (role: "admin" | "user") => {
    mockLogin(role);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 sm:p-6 font-sans antialiased text-[#1D1D1F]">
      
      {/* Auth Card Container (Clean iOS style) */}
      <div className="w-full max-w-[440px] bg-white border border-[#E8E8ED] p-8 sm:p-10 rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-6 flex flex-col transition-all">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="self-start flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93] hover:text-[#007AFF] tracking-tight transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-1">
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

        {/* If OTP is pending, show OTP Screen. Otherwise show Login/Register tabs + form */}
        {isOtpPending ? (
          /* --- OTP VERIFICATION CARD --- */
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center mx-auto mb-2">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#1D1D1F]">Verify your email</h2>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                We sent a 6-digit security code to <strong className="text-[#1D1D1F]">{otpEmail}</strong>.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-[#FF3B30]/5 border border-[#FF3B30]/20 rounded-xl p-3 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                <span className="text-xs text-[#FF3B30] font-medium">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-[#34C759]/5 border border-[#34C759]/20 rounded-xl p-3 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                <span className="text-xs text-[#34C759] font-medium">{successMsg}</span>
              </div>
            )}

            {devOtp && (
              <div className="bg-[#007AFF]/5 border border-[#007AFF]/20 rounded-xl p-3.5 space-y-1 text-center">
                <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider">Developer OTP Bypass</p>
                <p className="text-lg font-bold text-[#007AFF] tracking-widest">{devOtp}</p>
                <p className="text-[9px] text-[#8E8E93]">Use this generated code to verify instantly (no SMTP needed).</p>
              </div>
            )}

            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-lg font-bold tracking-[8px] bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:bg-white transition-all placeholder:tracking-normal"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3.5 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] disabled:opacity-50 text-white font-bold text-xs tracking-tight transition-all active:scale-[0.98] flex items-center justify-center shadow-sm"
              >
                {loading ? "Verifying..." : "Verify Code & Sign In"}
              </button>
            </form>

            <div className="flex flex-col gap-2.5 text-center pt-2 text-xs font-semibold">
              <button 
                type="button"
                onClick={handleResendCode}
                className="text-[#007AFF] hover:underline"
              >
                Didn't get the code? Resend
              </button>
              <button 
                type="button"
                onClick={() => setIsOtpPending(false)}
                className="text-[#8E8E93] hover:text-[#1D1D1F]"
              >
                Back to credentials login
              </button>
            </div>
          </div>
        ) : (
          /* --- SIGN IN / SIGN UP TABS & FORMS --- */
          <div className="space-y-6 animate-fadeIn">
            
            {/* iOS Segmented Control */}
            <div className="flex bg-[#F5F5F7] p-1 rounded-xl border border-[#E8E8ED]/65 shadow-inner">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "login"
                    ? "bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "text-[#8E8E93] hover:text-[#1D1D1F]"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "signup"
                    ? "bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "text-[#8E8E93] hover:text-[#1D1D1F]"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </button>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-[#1D1D1F]">
                {activeTab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-xs text-[#8E8E93]">
                {activeTab === "login" 
                  ? "Access your shortlist and premium listings." 
                  : "Start shortlisting your dream properties."}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-[#FF3B30]/5 border border-[#FF3B30]/20 rounded-xl p-3 flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-[#FF3B30] shrink-0 mt-0.5" />
                <span className="text-xs text-[#FF3B30] font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Google Sign In Option */}
            <div className="space-y-4">
              {isPlaceholder ? (
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleMockClick("user")}
                    className="w-full py-3 rounded-xl border border-[#D2D2D7] bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-bold text-xs tracking-tight transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <span>Developer Mock Sign In</span>
                  </button>
                </div>
              ) : (
                <div className="w-full flex justify-center border border-[#E8E8ED] bg-white hover:bg-[#FAFAFA] rounded-xl p-3 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        loginWithGoogle(credentialResponse.credential);
                      }
                    }}
                    onError={() => {
                      setErrorMsg("Google Sign-In failed. Please try again.");
                    }}
                    text={activeTab === "login" ? "signin_with" : "signup_with"}
                    useOneTap
                  />
                </div>
              )}

              {/* Form Divider */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 h-[1px] bg-[#E8E8ED]" />
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">or use credentials</span>
                <div className="flex-1 h-[1px] bg-[#E8E8ED]" />
              </div>

              {/* Credentials input Form */}
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                
                {/* Username Input (Signup Only) */}
                {activeTab === "signup" && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1">
                      Username
                    </label>
                    <div className="flex items-center gap-2.5 bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#007AFF] focus-within:bg-white transition-all">
                      <User className="w-4 h-4 text-[#8E8E93] shrink-0" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-[#1D1D1F] focus:outline-none placeholder-[#8E8E93]"
                        placeholder="john_doe"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2.5 bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#007AFF] focus-within:bg-white transition-all">
                    <Mail className="w-4 h-4 text-[#8E8E93] shrink-0" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#1D1D1F] focus:outline-none placeholder-[#8E8E93]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="flex items-center gap-2.5 bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#007AFF] focus-within:bg-white transition-all">
                    <Lock className="w-4 h-4 text-[#8E8E93] shrink-0" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#1D1D1F] focus:outline-none placeholder-[#8E8E93]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#1D1D1F] hover:bg-[#2C2C2E] disabled:opacity-50 text-white font-bold text-xs tracking-tight transition-all active:scale-[0.98] flex items-center justify-center shadow-sm"
                >
                  {loading 
                    ? "Please wait..." 
                    : activeTab === "login" 
                      ? "Sign In" 
                      : "Send Verification Code"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center pt-4 border-t border-[#F5F5F7]">
          <p className="text-[10px] text-[#8E8E93] font-medium flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#34C759]" />
            <span>Secure 256-bit encrypted authentication</span>
          </p>
        </div>

      </div>
    </div>
  );
}
