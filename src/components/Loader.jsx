export default function Loader({ message = "Checking session..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] z-50">

      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-violet-700 opacity-20 blur-[80px] animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-[250px] h-[250px] rounded-full bg-blue-600 opacity-15 blur-[80px] animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center gap-5">

        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-blue-600 rounded-[7px] flex items-center justify-center p-1">
            <svg viewBox="0 0 24 24" fill="none" className="text-white w-full h-full" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
            AuthFlow
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium tracking-widest uppercase animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
