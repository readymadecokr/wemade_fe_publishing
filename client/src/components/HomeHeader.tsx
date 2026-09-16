import { useEffect, useRef } from "react";
import { useState, type MouseEvent } from "react";
import { Link, useLocation } from "wouter";
import { Gamepad2, Globe, Menu, X } from "lucide-react";
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

function DiscordBrandIcon() {
  return <img className="reference-header-discord-brand-icon" src="/manus-storage/Discord_icon_230fdb89_6026051e.png" alt="" aria-hidden="true" />;
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
  const renderUtilityControls = (mobile = false) => isAuthenticated
    ? <div className={`reference-header-account-links${mobile ? " reference-mobile-account" : ""}`}><Link href="/point-shop" onClick={mobile ? () => setMobileMenuOpen(false) : undefined}>rCoin <strong>{formatRcoin(balance?.ruCash ?? 0)}</strong> · Bonus rCoin <strong>{formatRcoin(balance?.bonusCash ?? 0)}</strong></Link><Link href="/mypage" onClick={mobile ? () => setMobileMenuOpen(false) : undefined}>My Page</Link><button type="button" onClick={handleLogout}>Logout</button></div>
    : <button type="button" onClick={startLogin} disabled={loading} className="reference-header-auth-link">{loading ? "Checking account…" : "Sign in / Sign up"}</button>;

  const renderLanguage = () => <button type="button" className="reference-header-language" aria-label="Current language: English"><Globe size={14} /> EN</button>;

  return <header ref={headerRef} className="reference-home-live-header fixed inset-x-0 top-0 z-50 w-full text-white" aria-label="Ragnarok Universe service navigation">
    <div className="reference-header-utility-surface bg-[#1c3147] [background-image:linear-gradient(100deg,rgba(32,56,78,1),rgba(58,84,110,.96),rgba(24,45,66,1))]">
      <div className="reference-header-utility container flex h-9 items-center justify-end gap-2 py-0.5 sm:gap-3">{renderUtilityControls()}<div className="reference-header-top-actions" aria-label="Quick actions"><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="reference-header-top-action reference-header-top-action--discord"><DiscordBrandIcon /><span>DISCORD</span></a><a href="https://raguniverse-izcifhmz.manus.space/" target="_blank" rel="noreferrer" className="reference-header-top-action reference-header-top-action--game-start"><Gamepad2 aria-hidden="true" size={14} /><span>GAME START</span></a></div></div>
    </div>
    <div className="reference-header-gnb-surface">
      <div className="container reference-header-main-row">
        {isHomeHeader ? <a href="#home" onClick={(event) => handleHomeNavigate(event, "home")} className="reference-header-logo" aria-label="Ragnarok Universe home"><img src={LOGO_URL} alt="Ragnarok Universe" /></a> : <Link href="/" className="reference-header-logo" aria-label="Ragnarok Universe home"><img src={LOGO_URL} alt="Ragnarok Universe" /></Link>}
        <nav className="portal-nav" aria-label="Primary navigation">
          {isHomeHeader ? <a href="#home" onClick={(event) => handleHomeNavigate(event, "home")} className={navigationClass("home")}>HOME</a> : <Link href="/" className={navigationClass("home")}>HOME</Link>}
          {isHomeHeader ? <a href="#discord" onClick={(event) => handleHomeNavigate(event, "discord")} className={navigationClass("discord")}>COMMUNITY</a> : <Link href={pathFor("discord")} className={navigationClass("discord")}>COMMUNITY</Link>}
          {(["news", "game-info", "media"] as const).map((sectionId) => isHomeHeader ? <a key={sectionId} href={`#${sectionId}`} onClick={(event) => handleHomeNavigate(event, sectionId)} className={navigationClass(sectionId)}>{sectionId === "game-info" ? "GAME INFO" : sectionId.toUpperCase()}</a> : <Link key={sectionId} href={sectionId === "news" ? "/news" : pathFor(sectionId)} className={navigationClass(sectionId)}>{sectionId === "game-info" ? "GAME INFO" : sectionId.toUpperCase()}</Link>)}
          <Link href="/point-shop" className={navigationClass("shop")}>SHOP</Link>
        </nav>
        {renderLanguage()}
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
