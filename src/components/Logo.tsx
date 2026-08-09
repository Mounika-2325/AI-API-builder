export default function Logo({ className = "h-8" }: { className?: string }) {
  return (
     <div className={`flex items-center gap-2.5 ${className}`}>
       <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1000a9] via-[#0566d9] to-[#c0c1ff] p-[1.5px] flex items-center justify-center shadow-[0_0_12px_rgba(192,193,255,0.25)]">
        <div className="w-full h-full bg-[#0b1326] rounded-[7px] flex items-center justify-center relative overflow-hidden">
          <svg className="w-5 h-5 text-[#c0c1ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18L10 12L14 16L20 8" />
            <path d="M14 8H20V14" />
            <path d="M3 21h18" strokeOpacity="0.3" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold tracking-tight text-[#c0c1ff] text-lg leading-none font-['Inter']">
          AI API BUILDER
        </span>
        <span className="text-[9px] font-semibold tracking-widest text-[#4edea3] uppercase leading-tight font-['JetBrains_Mono']">
          LUMINA NEXUS
        </span>
      </div>
    </div>
  );
}
