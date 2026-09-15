import { useEffect, useRef } from "react";
import { useState, type MouseEvent } from "react";
import { Link, useLocation } from "wouter";
import { Globe, Menu, X } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import "@/pages/reference-home.css";

const LOGO_URL = "/manus-storage/logo_main_ascii_c85e5b8d_8981998e.png";
const GAME_START_BUTTON_URL = "/manus-storage/gamestart_BTN_1c6449da.png";
const DISCORD_BUTTON_URL = "/manus-storage/Discord-Logo-White_b3128ea2.png";
const DISCORD_URL = "https://discord.gg/yVWJkWdkAU";

function formatRcoin(value: number): string {
  return Math.min(value, 9_999_999).toLocaleString("en-US");
}

export function GameStartButton({ className = "" }: { className?: string }) {
  return <a className={`home-game-start ${className}`.trim()} href="https://raguniverse-izcifhmz.manus.space/" target="_blank" rel="noreferrer" aria-label="Game Start"><img src={GAME_START_BUTTON_URL} alt="Game Start" /></a>;
}

export function DiscordButton({ className = "" }: { className?: string }) {
  return <a className={`home-discord-button ${className}`.trim()} href={DISCORD_URL} target="_blank" rel="noopener noreferrer" aria-label="Join Ragnarok Universe on Discord"><img src={DISCORD_BUTTON_URL} alt="Discord" /></a>;
}

type HomeHeaderProps = {
  activeSection: "home" | "discord" | "news" | "game-info" | "media" | "shop";
  onNavigate?: (sectionId: "home" | "discord" | "news" | "game-info" | "media") => void;
};

export default function HomeHeader({ activeSection, onNavigate }: HomeHeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const [location] = useLocation();
  const { isAuthenticated, loading, logout } = useAuth();
  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, { enabled: isAuthenticated, refetchOnWindowFocus: true, staleTime: 30_000 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const syncHeight = () => document.documentElement.style.setProperty("--react-home-header-height", `${Math.ceil(header.getBoundingClientRect().height)}px`);
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    window.addEventListener("resize", syncHeight);
    return () => { observer.disconnect(); window.removeEventListener("resize", syncHeight); };
  }, []);

  const startLogin = () => { window.location.href = getLoginUrl(); };
  const handleLogout = async () => { await logout(); window.location.assign("/"); };
  const handleHomeNavigate = (event: MouseEvent<HTMLAnchorElement>, sectionId: "home" | "discord" | "news" | "game-info" | "media") => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(sectionId);
  };
  const handleMobileHomeNavigate = (event: MouseEvent<HTMLAnchorElement>, sectionId: "home" | "discord" | "news" | "game-info" | "media") => {
    setMobileMenuOpen(false);
    handleHomeNavigate(event, sectionId);
  };
  const isHomeHeader = Boolean(onNavigate);
  const pathFor = (sectionId: "home" | "discord" | "news" | "game-info" | "media") => sectionId === "home" ? "/" : `/#${sectionId}`;

  const navigationClass = (sectionId: HomeHeaderProps["activeSection"]) => `portal-nav-link ${activeSection === sectionId ? "portal-nav-link--active" : ""}`;
  const renderUtilityControls = (mobile = false) => <>
    {isAuthenticated ? <div className={`flex items-center gap-2 sm:gap-3${mobile ? " reference-mobile-account" : ""}`}><div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 shadow-sm sm:text-xs"><Link href="/point-shop" onClick={mobile ? () => setMobileMenuOpen(false) : undefined} className="flex items-center gap-1 px-3 py-2 transition-colors hover:bg-red-50 whitespace-nowrap"><span>rCoin: <strong className="font-black text-[#9b2020]">{formatRcoin(balance?.ruCash ?? 0)}</strong></span><span className="mx-2 text-slate-300">|</span><span>Bonus rCoin: <strong className="font-black text-green-700">{formatRcoin(balance?.bonusCash ?? 0)}</strong></span></Link><Link href="/mypage" onClick={mobile ? () => setMobileMenuOpen(false) : undefined} className="border-l border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 transition-colors hover:bg-slate-200 whitespace-nowrap">My Page</Link></div><button type="button" onClick={handleLogout} className="rounded-md border border-[#d5bd7d]/70 bg-[#fffaf0] px-3 py-2 text-[10px] font-bold text-[#263b5b] shadow-sm transition-colors hover:bg-[#f8edce] sm:text-xs">Logout</button></div> : <button type="button" onClick={startLogin} disabled={loading} className="rounded-md border border-[#d5bd7d]/70 bg-[#476da9] px-3 py-2 text-[10px] font-semibold text-white shadow-lg shadow-[#17283b]/30 transition-all hover:-translate-y-0.5 hover:border-[#fff0bd] hover:bg-[#6188c5] focus-visible:ring-2 focus-visible:ring-[#fff0bd] active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:px-4 sm:text-xs">{loading ? "Checking account…" : "Sign In / Sign Up"}</button>}
    <button type="button" className="reference-header-language inline-flex items-center gap-1 text-[10px] font-bold text-slate-100 transition-colors hover:text-[#f3d991] sm:text-xs" aria-label="Current language: English"><Globe size={14} /> EN</button>
  </>;

  return <header ref={headerRef} className="reference-home-live-header fixed inset-x-0 top-0 z-50 w-full text-white" aria-label="Ragnarok Universe service navigation">
    <div className="bg-[#1c3147] [background-image:linear-gradient(100deg,rgba(32,56,78,1),rgba(58,84,110,.96),rgba(24,45,66,1))]">
      <div className="reference-header-utility container flex h-9 items-center justify-end gap-2 py-0.5 sm:gap-3">{renderUtilityControls()}</div>
    </div>
    <div className="border-b border-[#c8d8e7]/30 bg-[#1c3147] shadow-[0_3px_18px_rgba(24,38,57,.28)] [background-image:linear-gradient(100deg,rgba(32,56,78,1),rgba(58,84,110,.9),rgba(24,45,66,1))]">
      <div className="container reference-header-main-row">
        {isHomeHeader ? <a href="#home" onClick={(event) => handleHomeNavigate(event, "home")} className="reference-header-logo" aria-label="Ragnarok Universe home"><img src={LOGO_URL} alt="Ragnarok Universe" /></a> : <Link href="/" className="reference-header-logo" aria-label="Ragnarok Universe home"><img src={LOGO_URL} alt="Ragnarok Universe" /></Link>}
        <nav className="portal-nav" aria-label="Primary navigation">
          {isHomeHeader ? <a href="#home" onClick={(event) => handleHomeNavigate(event, "home")} className={navigationClass("home")}>HOME</a> : <Link href="/" className={navigationClass("home")}>HOME</Link>}
          {isHomeHeader ? <a href="#discord" onClick={(event) => handleHomeNavigate(event, "discord")} className={navigationClass("discord")}>COMMUNITY</a> : <Link href={pathFor("discord")} className={navigationClass("discord")}>COMMUNITY</Link>}
          {(["news", "game-info", "media"] as const).map((sectionId) => isHomeHeader ? <a key={sectionId} href={`#${sectionId}`} onClick={(event) => handleHomeNavigate(event, sectionId)} className={navigationClass(sectionId)}>{sectionId === "game-info" ? "GAME INFO" : sectionId.toUpperCase()}</a> : <Link key={sectionId} href={sectionId === "news" ? "/news" : pathFor(sectionId)} className={navigationClass(sectionId)}>{sectionId === "game-info" ? "GAME INFO" : sectionId.toUpperCase()}</Link>)}
          <Link href="/point-shop" className={navigationClass("shop")}>SHOP</Link>
        </nav>
        <div className="reference-header-cta shrink-0" aria-label="Quick actions"><DiscordButton className="reference-header-discord" /><GameStartButton className="reference-header-game-start" /></div>
        <button type="button" className="reference-mobile-menu-toggle" aria-label={mobileMenuOpen ? "Close primary navigation" : "Open primary navigation"} aria-expanded={mobileMenuOpen} aria-controls="reference-mobile-navigation" onClick={() => setMobileMenuOpen((open) => !open)}>{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        <nav id="reference-mobile-navigation" className={`reference-mobile-menu${mobileMenuOpen ? " is-open" : ""}`} aria-label="Mobile primary navigation">
          {isHomeHeader ? <a href="#home" onClick={(event) => handleMobileHomeNavigate(event, "home")} className={navigationClass("home")}>HOME</a> : <Link href="/" onClick={() => setMobileMenuOpen(false)} className={navigationClass("home")}>HOME</Link>}
          {isHomeHeader ? <a href="#discord" onClick={(event) => handleMobileHomeNavigate(event, "discord")} className={navigationClass("discord")}>COMMUNITY</a> : <Link href={pathFor("discord")} onClick={() => setMobileMenuOpen(false)} className={navigationClass("discord")}>COMMUNITY</Link>}
          {(["news", "game-info", "media"] as const).map((sectionId) => isHomeHeader ? <a key={sectionId} href={`#${sectionId}`} onClick={(event) => handleMobileHomeNavigate(event, sectionId)} className={navigationClass(sectionId)}>{sectionId === "game-info" ? "GAME INFO" : sectionId.toUpperCase()}</a> : <Link key={sectionId} href={sectionId === "news" ? "/news" : pathFor(sectionId)} onClick={() => setMobileMenuOpen(false)} className={navigationClass(sectionId)}>{sectionId === "game-info" ? "GAME INFO" : sectionId.toUpperCase()}</Link>)}
          <Link href="/point-shop" onClick={() => setMobileMenuOpen(false)} className={navigationClass("shop")}>SHOP</Link>
          <div className="reference-mobile-menu__utility">{renderUtilityControls(true)}</div>
        </nav>
      </div>
    </div>
  </header>;
}
