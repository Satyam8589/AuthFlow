import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { toast } from "react-hot-toast";
import Loader from "./Loader";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (isLoggingOut) return <Loader message="Signing out..." />;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-[8px] sm:rounded-[9px] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 24 24" fill="none" className="text-white w-full h-full" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-base sm:text-lg font-bold text-violet-400 tracking-tight">AuthFlow</span>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/10 text-red-400 border border-red-500/25 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-red-500/20 hover:border-red-400/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span className="hidden xs:inline sm:inline">Logout</span>
        <span className="sm:hidden">Out</span>
      </button>
    </nav>
  );
}
