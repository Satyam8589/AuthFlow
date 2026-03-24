import { useAuth } from "../context";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useAuth();

  const expiresAt = user?.expiresAt
    ? new Date(user.expiresAt).toLocaleString()
    : "N/A";

  const stats = [
    { icon: "🔐", label: "Auth Provider",   value: "Google OAuth" },
    { icon: "⏱️", label: "Session Expires", value: expiresAt, accent: true },
    { icon: "🛡️", label: "Route Type",      value: "Protected" },
    { icon: "💾", label: "Storage",          value: "TTL Only (Secure)" },
  ];

  return (
    <div className="relative h-screen bg-[#0a0a0f] overflow-hidden flex flex-col">

      <div className="pointer-events-none absolute -top-48 -right-48 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-violet-700 opacity-20 blur-[100px] sm:blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] rounded-full bg-blue-600 opacity-15 blur-[80px] sm:blur-[100px]" />

      <Navbar />

      <main className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8 md:py-10 flex flex-col gap-3 sm:gap-6">

        {/* Welcome Card */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 bg-white/[0.04] border border-white/[0.09] rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-lg text-center sm:text-left">
          <img
            src={user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=7c3aed&color=fff`}
            alt={user?.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-[3px] border-violet-500/60 shadow-[0_0_0_6px_rgba(124,58,237,0.1)] object-cover shrink-0"
          />
          <div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mb-1">{user?.name}</h1>
            <p className="text-slate-400 text-xs sm:text-sm break-all sm:break-normal">{user?.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map(({ icon, label, value, accent }) => (
            <div
              key={label}
              className="flex flex-col gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:bg-white/[0.07] hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-xl sm:text-3xl">{icon}</span>
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-0.5 sm:mb-1">{label}</p>
                <p className={`text-[11px] sm:text-sm font-semibold leading-snug break-words ${accent ? "text-violet-400" : "text-slate-200"}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-violet-500/[0.07] border border-violet-500/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-6">
          <h3 className="text-violet-300 font-bold text-sm sm:text-base mb-2 sm:mb-3">🛡️ How Session Security Works</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Only an anonymous TTL token is stored in{" "}
            <code className="bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded text-xs">localStorage</code>
            {" "}— no personal data (name, email) is ever written to disk.
            Your profile is fetched securely from Firebase on each visit.
            The session auto-expires after <strong className="text-violet-300">24 hours</strong> and clears immediately on logout.
          </p>
        </div>

      </main>
    </div>
  );
}
