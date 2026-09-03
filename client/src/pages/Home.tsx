import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ChevronDown, ExternalLink, Globe } from "lucide-react";
import { Link, useLocation } from "wouter";
import "./reference-home.css";

const REFERENCE_HOME_URL = "/manus-storage/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll_ff1ba0e5.html";
const LOGO_URL = "/manus-storage/logo_main_ascii_c85e5b8d_8981998e.png";

function formatRcoin(value: number): string {
  return Math.min(value, 9_999_999).toLocaleString("en-US");
}

function ReferenceHomeHeader() {
  const [location] = useLocation();
  const { isAuthenticated, loading, logout } = useAuth();
  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });

  const sectionHref = (sectionId: string) => `${REFERENCE_HOME_URL}#${sectionId}`;
  const startLogin = () => {
    window.location.href = getLoginUrl();
  };
  const handleLogout = async () => {
    await logout();
    window.location.assign("/");
  };

  return (
    <header className="reference-home-live-header fixed inset-x-0 top-0 z-50 w-full text-white" aria-label="Ragnarok Universe service navigation">
      <div className="border-b border-white/10 bg-[#1c3147] [background-image:linear-gradient(100deg,rgba(32,56,78,1),rgba(58,84,110,.96),rgba(24,45,66,1))]">
        <div className="container flex h-11 items-center justify-end gap-2 py-1.5 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 shadow-sm sm:text-xs">
                <Link href="/point-shop" className="flex items-center gap-1 px-3 py-2 transition-colors hover:bg-red-50 whitespace-nowrap">
                  <span>rCoin: <strong className="font-black text-[#9b2020]">{formatRcoin(balance?.ruCash ?? 0)}</strong></span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span>Bonus rCoin: <strong className="font-black text-green-700">{formatRcoin(balance?.bonusCash ?? 0)}</strong></span>
                </Link>
                <Link href="/mypage" className="border-l border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 transition-colors hover:bg-slate-200 whitespace-nowrap">My Page</Link>
              </div>
              <button type="button" onClick={handleLogout} className="rounded-md border border-[#d5bd7d]/70 bg-[#fffaf0] px-3 py-2 text-[10px] font-bold text-[#263b5b] shadow-sm transition-colors hover:bg-[#f8edce] sm:text-xs">Logout</button>
            </div>
          ) : (
            <button type="button" onClick={startLogin} disabled={loading} className="rounded-md border border-[#d5bd7d]/70 bg-[#476da9] px-3 py-2 text-[10px] font-semibold text-white shadow-lg shadow-[#17283b]/30 transition-all hover:-translate-y-0.5 hover:border-[#fff0bd] hover:bg-[#6188c5] focus-visible:ring-2 focus-visible:ring-[#fff0bd] active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:px-4 sm:text-xs">
              {loading ? "Checking account…" : "Sign In / Sign Up"}
            </button>
          )}
          <button type="button" className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-100 transition-colors hover:text-[#f3d991] sm:text-xs" aria-label="Current language: English"><Globe size={14} /> EN</button>
        </div>
      </div>

      <div className="border-b border-[#c8d8e7]/30 bg-[#1c3147] shadow-[0_3px_18px_rgba(24,38,57,.28)] [background-image:linear-gradient(100deg,rgba(32,56,78,1),rgba(58,84,110,.9),rgba(24,45,66,1))]">
        <div className="container flex min-h-[4.125rem] flex-wrap items-center justify-between gap-x-2 gap-y-1 py-1.5 sm:flex-nowrap sm:gap-x-5 sm:py-2">
          <a href={sectionHref("home")} target="ragnarok-reference-frame" className="group flex shrink-0 items-center gap-2" aria-label="Ragnarok Universe home"><img src={LOGO_URL} alt="Ragnarok Universe" className="h-7 w-auto brightness-[1.28] contrast-90 transition-opacity group-hover:opacity-80 sm:h-9" /></a>
          <nav className="portal-nav order-3 grid w-full grid-cols-6 items-center text-[8px] sm:order-none sm:flex sm:w-auto sm:justify-center sm:gap-4 sm:text-[11px] lg:gap-6" aria-label="Primary navigation">
            <a href={sectionHref("home")} target="ragnarok-reference-frame" className="portal-nav-link portal-nav-link--active">HOME</a>
            <a href={sectionHref("news")} target="ragnarok-reference-frame" className="portal-nav-link">NEWS</a>
            <a href={sectionHref("game-info")} target="ragnarok-reference-frame" className="portal-nav-link">GAME INFO</a>
            <a href={sectionHref("media")} target="ragnarok-reference-frame" className="portal-nav-link">MEDIA</a>
            <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="portal-nav-link inline-flex items-center gap-1">COMMUNITY <ExternalLink size={11} aria-hidden="true" /></a>
            <Link href="/point-shop" className={`portal-nav-link inline-flex items-center gap-0.5 ${location === "/point-shop" ? "portal-nav-link--active" : ""}`}>SHOP <ChevronDown size={12} aria-hidden="true" /></Link>
          </nav>
          <div className="reference-header-cta shrink-0" aria-label="Quick actions">
            <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="reference-header-discord" aria-label="Join Ragnarok Universe on Discord">
              <img src="/manus-storage/Discord_icon_230fdb89_6026051e.png" alt="" className="h-4 w-4 object-contain" />
              <span>DISCORD</span>
            </a>
            <a href={sectionHref("game-start")} target="ragnarok-reference-frame" className="reference-header-game-start">
              <span>GAME START</span>
              <span className="reference-header-game-start__coin" aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/** The supplied final document remains the complete Home canvas; this live overlay restores the working service header. */
export default function Home() {
  return (
    <main className="reference-home-embed" aria-label="Ragnarok Universe homepage">
      <ReferenceHomeHeader />
      <iframe
        name="ragnarok-reference-frame"
        title="Ragnarok Universe homepage"
        src={REFERENCE_HOME_URL}
        className="reference-home-embed__frame"
      />
    </main>
  );
}
