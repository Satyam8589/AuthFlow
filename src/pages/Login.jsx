import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

export default function Login() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Cloud not sign in. Please try again.");
      setIsLoggingIn(false);
    }
  };

  if (loading || isLoggingIn) return <Loader message={isLoggingIn ? "Signing in..." : "Checking session..."} />;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden px-4 py-4 sm:py-8">

      {/* Animated Blobs — smaller on mobile */}
      <div className="absolute -top-20 -left-20 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-violet-700 opacity-30 blur-[80px] sm:blur-[100px] animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-blue-600 opacity-25 blur-[60px] sm:blur-[100px] animate-pulse delay-1000" />
      <div className="hidden sm:block absolute top-1/2 left-[60%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-pink-600 opacity-20 blur-[80px] animate-pulse delay-500" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/[0.04] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 p-2">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
            AuthFlow
          </span>
        </div>

        {/* Heading */}
        <div className="mb-5 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm">Sign in to continue to your dashboard</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-800 font-semibold py-2.5 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Secured with Firebase Auth</p>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: "🔐", label: "Protected Routes" },
            { icon: "⏱️", label: "24h Session TTL" },
            { icon: "🔄", label: "Auto Restore" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl py-2 sm:py-3 px-1 sm:px-2 hover:bg-white/[0.07] transition-colors"
            >
              <span className="text-lg sm:text-xl">{icon}</span>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium text-center leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
