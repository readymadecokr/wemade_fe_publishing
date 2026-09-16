const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? "";

export default function FloatingSocialLinks({ hidden = false }: { hidden?: boolean }) {
  return (
    <>
      <style>{`
        @keyframes float-social {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes floating-social-glow {
          0%, 100% { box-shadow: 0 0 0 2px rgba(255,255,255,.32), 0 0 14px rgba(244,219,133,.48), 0 0 28px rgba(244,219,133,.24); }
          50% { box-shadow: 0 0 0 3px rgba(255,255,255,.72), 0 0 24px rgba(244,219,133,.92), 0 0 46px rgba(244,219,133,.52); }
        }
        .floating-social-box { animation: float-social 3s ease-in-out infinite; transition: opacity 180ms ease; }
        .floating-social-box.is-hidden { opacity: 0; pointer-events: none; }
        .floating-social-link { position: relative; isolation: isolate; }
        .floating-social-link:hover, .floating-social-link:focus-visible { animation: floating-social-glow 1.15s ease-in-out infinite; filter: brightness(1.1) saturate(1.08); }
        .floating-social-link:focus-visible { outline: 2px solid #f4db85; outline-offset: 4px; }
        @media (prefers-reduced-motion: reduce) { .floating-social-link:hover, .floating-social-link:focus-visible { animation: none; } }
      `}</style>
      <div className={`floating-social-box fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-5${hidden ? " is-hidden" : ""}`} aria-label="Official social links">
        <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" title="Discord" aria-label="Visit Ragnarok Universe on Discord" className="floating-social-link flex h-12 w-12 items-center justify-center rounded-full border-0 bg-[#5865f2] shadow-[0_6px_16px_rgba(53,66,159,.38)] transition-all duration-200 hover:scale-110 hover:brightness-110 active:scale-95 sm:h-[52px] sm:w-[52px]"><img src={`${ASSET_BASE_URL}/manus-storage/Discord_icon_230fdb89_6026051e.png`} alt="" className="h-9 w-9 object-contain sm:h-10 sm:w-10" /></a>
        <a href="https://facebook.com/RagnarokUniverseEN" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Visit Ragnarok Universe on Facebook" className="floating-social-link flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-0 bg-[#1877f2] shadow-[0_6px_16px_rgba(24,119,242,.35)] transition-all duration-200 hover:scale-110 hover:brightness-110 active:scale-95 sm:h-[52px] sm:w-[52px]"><img src={`${ASSET_BASE_URL}/manus-storage/facebook-logo-primary_2867583f.webp`} alt="" className="h-full w-full object-contain" /></a>
        <a href="https://www.youtube.com/@RagnarokUniverse" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="Visit Ragnarok Universe on YouTube" className="floating-social-link flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white text-[#ff0033] shadow-[0_6px_16px_rgba(82,42,47,.24)] transition-all duration-200 hover:scale-110 hover:brightness-105 active:scale-95 sm:h-[52px] sm:w-[52px]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-current"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg></a>
        <a href="https://x.com/RagUniOfficial" target="_blank" rel="noopener noreferrer" title="X" aria-label="Visit Ragnarok Universe on X" className="floating-social-link flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-0 bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,.22)] transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95 sm:h-[52px] sm:w-[52px]"><img src={`${ASSET_BASE_URL}/manus-storage/x-logo-black_193d8b29.webp`} alt="" className="h-full w-full object-contain" /></a>
      </div>
    </>
  );
}
