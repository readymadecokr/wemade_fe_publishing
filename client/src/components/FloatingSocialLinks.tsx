const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? "";

export default function FloatingSocialLinks({ hidden = false }: { hidden?: boolean }) {
  return (
    <>
      <style>{`
        @keyframes float-social {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .floating-social-box { animation: float-social 3s ease-in-out infinite; transition: opacity 180ms ease; }
        .floating-social-box.is-hidden { opacity: 0; pointer-events: none; }
      `}</style>
      <div className={`floating-social-box fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-5${hidden ? " is-hidden" : ""}`} aria-label="Official social links">
        <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" title="Discord" aria-label="Visit Ragnarok Universe on Discord" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#5865f2] shadow-[0_6px_16px_rgba(53,66,159,.38)] transition-all duration-200 hover:scale-110 hover:brightness-110 active:scale-95 sm:h-[52px] sm:w-[52px]"><img src={`${ASSET_BASE_URL}/manus-storage/Discord_icon_230fdb89_6026051e.png`} alt="" className="h-9 w-9 object-contain sm:h-10 sm:w-10" /></a>
        <a href="https://facebook.com/RagnarokUniverseEN" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Visit Ragnarok Universe on Facebook" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#1877f2] text-white shadow-[0_6px_16px_rgba(24,119,242,.35)] transition-all duration-200 hover:scale-110 hover:brightness-110 active:scale-95 sm:h-[52px] sm:w-[52px]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-current"><path d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.4-.1c-2.4 0-4 1.4-4 4.1V10H8v3h2.6v8h3.2Z" /></svg></a>
        <a href="https://www.youtube.com/@RagnarokUniverse" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="Visit Ragnarok Universe on YouTube" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white text-[#ff0033] shadow-[0_6px_16px_rgba(82,42,47,.24)] transition-all duration-200 hover:scale-110 hover:brightness-105 active:scale-95 sm:h-[52px] sm:w-[52px]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-current"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg></a>
        <a href="https://x.com/RagUniOfficial" target="_blank" rel="noopener noreferrer" title="X" aria-label="Visit Ragnarok Universe on X" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#161616] text-white shadow-[0_6px_16px_rgba(0,0,0,.34)] transition-all duration-200 hover:scale-110 hover:bg-black active:scale-95 sm:h-[52px] sm:w-[52px]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M18.9 2H22l-6.8 7.8 8 12.2H17l-4.8-7.3L5.8 22H2.7l7.3-8.4L2.3 2h6.3l4.3 6.6L18.9 2Zm-1.1 18h1.7L7.7 3.9H5.9L17.8 20Z" /></svg></a>
      </div>
    </>
  );
}
