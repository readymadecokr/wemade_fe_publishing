import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Globe, X, Disc, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import PrivacySettingsDialog from "./PrivacySettingsDialog";
import FloatingSocialLinks from "./FloatingSocialLinks";
import { trpc } from "@/lib/trpc";
import HomeHeader from "./HomeHeader";
import "./news-layout.css";

function fmtRuc(n: number): string { return Math.min(n, 9999999).toLocaleString("en-US"); }

// Footer logo image updated to GravityCI-가로형(2022).png for light mode
const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

interface LayoutProps {
  children: React.ReactNode;
  variant?: "default" | "homeChrome";
}

export default function Layout({ children, variant = "default" }: LayoutProps) {
  const [location] = useLocation();
  const [lang, setLang] = useState("EN");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showTTKeyDialog, setShowTTKeyDialog] = useState(false);
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const { theme } = useTheme();

  const isLoggedIn = localStorage.getItem("rou_logged_in") === "true";
  const userNickname = localStorage.getItem("rou_nickname") || "Adventurer";

  // rCoin 잔액 조회 (Manus OAuth 로그인 사용자용)
  const { data: ruBalance } = trpc.shop.myBalance.useQuery(undefined, {
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });
  const ruCash = ruBalance?.ruCash ?? 0;
  const bonusCash = ruBalance?.bonusCash ?? 0;
  const hasBalance = ruBalance !== undefined;

  // Show Privacy Settings popup on first visit (no cookie consent yet)
  useEffect(() => {
    const cookieConsent = localStorage.getItem("rou_cookie_consent");
    // 자동 팝업 비활성화 - 사용자가 직접 Privacy Settings 클릭 시에만 표시
    void cookieConsent;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rou_logged_in");
    localStorage.removeItem("rou_nickname");
    localStorage.removeItem("rou_social_provider");
    toast.success("Logged out successfully!");
    window.location.reload();
  };

  const handlePlaceholderClick = (featureName: string) => {
    toast.info(`'${featureName}' coming soon!`);
  };

  const handleCookieConsent = (allCookies: boolean) => {
    localStorage.setItem("rou_cookie_consent", allCookies ? "all" : "essential");
    setShowCookieConsent(false);
    toast.success("Cookie preferences saved!");
  };

  const languages = [
    { code: "EN", label: "English", flag: "🇺🇸" },
    { code: "CN", label: "中文", flag: "🇨🇳" },
    { code: "TH", label: "ภาษาไทย", flag: "🇹🇭" },
    { code: "ID", label: "Indonesia", flag: "🇮🇩" }
  ];

  const handleLangSelect = (code: string) => {
    setLang(code);
    setLangDropdownOpen(false);
    toast.success(`Language changed to ${code}`);
  };

  return (
    <div className="fantasy-site-atlas min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/40 selection:text-white overflow-x-hidden">
      


      {variant === "homeChrome" ? (
      <HomeHeader activeSection={location.startsWith("/news") ? "news" : location === "/game-info" ? "game-info" : location === "/point-shop" ? "shop" : "home"} />
      ) : (
      <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-[#c8d8e7]/30 bg-[#1c3147]/92 text-white shadow-[0_3px_18px_rgba(24,38,57,.28)] backdrop-blur-xl [background-image:linear-gradient(100deg,rgba(32,56,78,.94),rgba(58,84,110,.78),rgba(24,45,66,.92))]">
        <div className="border-b border-white/10 bg-[#102235]/35">
          <div className="container flex min-h-10 flex-wrap items-center justify-end gap-2 py-1.5 sm:gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white text-xs font-semibold shadow-sm">
                  <Link href="/point-shop" className="flex cursor-pointer items-center gap-1 px-3 py-2 text-slate-700 transition-colors hover:bg-red-50 whitespace-nowrap">
                    <span>rCoin: <span className="font-black text-[#9b2020]">{fmtRuc(ruCash)}</span></span><span className="mx-2 text-slate-300">|</span><span>Bonus rCoin: <span className="font-black text-green-700">{fmtRuc(bonusCash)}</span></span>
                  </Link>
                  <Link href="/mypage" className="flex cursor-pointer items-center border-l border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 transition-colors hover:bg-slate-200 whitespace-nowrap">My Page</Link>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-[#e6c972] bg-[#fffaf0] text-xs font-bold text-[#263b5b] shadow-sm hover:bg-[#f8edce] hover:text-[#1d3150]">Logout</Button>
              </div>
            ) : (
              <Link href="/login"><Button size="sm" className="border border-[#d5bd7d]/70 bg-[#476da9] px-3 py-2 text-[10px] font-semibold text-white shadow-lg shadow-[#17283b]/30 transition-all hover:-translate-y-0.5 hover:border-[#fff0bd] hover:bg-[#6188c5] hover:shadow-[0_8px_20px_rgba(18,39,70,.42),inset_0_1px_rgba(255,255,255,.45)] focus-visible:ring-2 focus-visible:ring-[#fff0bd] active:scale-95 sm:px-4 sm:text-xs">Sign In / Sign Up</Button></Link>
            )}
            <div className="relative">
              <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex cursor-pointer items-center gap-1 text-[10px] font-bold text-slate-100 transition-colors hover:text-[#f3d991] sm:text-xs"><Globe size={14} /> {lang}</button>
              {langDropdownOpen && <div className="absolute right-0 mt-2 w-40 rounded-lg border border-blue-200 bg-white shadow-lg z-50">
                {languages.map((l) => <button key={l.code} onClick={() => handleLangSelect(l.code)} className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-blue-50 ${lang === l.code ? "bg-blue-50 font-bold text-blue-600" : "text-slate-900"}`}><span>{l.flag}</span><span>{l.label}</span></button>)}
              </div>}
            </div>
          </div>
        </div>
        <div className="container flex min-h-[5.75rem] flex-wrap items-center justify-between gap-x-2 gap-y-1 py-1.5 sm:min-h-16 sm:flex-nowrap sm:gap-x-5 sm:gap-y-2 sm:py-2 lg:justify-between">
          <Link href="/" className="group flex cursor-pointer items-center gap-2"><img src={`${ASSET_BASE_URL}/manus-storage/logo_main_ascii_c85e5b8d_8981998e.png`} alt="Ragnarok" className="h-7 w-auto brightness-[1.28] contrast-90 transition-opacity group-hover:opacity-80 sm:h-9" /></Link>
          <nav className="portal-nav order-3 grid w-full grid-cols-6 items-center text-[8px] sm:order-none sm:flex sm:w-auto sm:justify-center sm:gap-4 sm:text-[11px] lg:gap-6" aria-label="Primary navigation">
            <Link href="/" className={`portal-nav-link ${location === "/" ? "portal-nav-link--active" : ""}`}>HOME</Link>
            <Link href="/news" className={`portal-nav-link ${location === "/news" ? "portal-nav-link--active" : ""}`}>NEWS</Link>
            <Link href="/game-info" className={`portal-nav-link ${location === "/game-info" ? "portal-nav-link--active" : ""}`}>GAME INFO</Link>
            <a href="/#media" className="portal-nav-link">MEDIA</a>
            <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="portal-nav-link portal-nav-link--external"><span className="portal-nav-link__label">DISCORD</span><ExternalLink className="portal-nav-link__icon" aria-hidden="true" /></a>
            <Link href="/point-shop" className={`portal-nav-link inline-flex items-center gap-0.5 ${location === "/point-shop" ? "portal-nav-link--active" : ""}`}>SHOP <ChevronDown size={12} aria-hidden="true" /></Link>
          </nav>
          <a href="/#game-start" className="shrink-0 rounded-md border border-[#d5bd7d]/70 bg-[#476da9] px-2.5 py-1.5 text-[9px] font-bold text-white shadow-lg shadow-[#17283b]/30 transition-all hover:-translate-y-0.5 hover:border-[#fff0bd] hover:bg-[#6188c5] hover:shadow-[0_8px_20px_rgba(18,39,70,.42),inset_0_1px_rgba(255,255,255,.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff0bd] active:scale-95 sm:px-3 sm:py-2 sm:text-[10px]">GAME START</a>
        </div>
      </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 w-full ${variant === "homeChrome" ? "home-chrome-content" : "pt-[136px] sm:pt-[106px]"}`}>
        {children}
      </main>

      {/* Cookie Consent Banner */}


      {variant === "homeChrome" ? (
      <footer id="site-footer" className="news-home-footer mt-auto w-full">
        <section className="news-home-closing" aria-label="Ragnarok Universe closing call to action">
          <div className="news-home-closing__content">
            <span>YOUR STORY BEGINS HERE</span>
            <h2>TWO CLICKS TO<br />MIDGARD</h2>
            <p>Start the game in your browser, then join the Discord to find a party, get patch news first and take part in founder events.</p>
            <div className="news-home-closing__actions">
              <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="news-home-closing__discord"><img src={`${ASSET_BASE_URL}/manus-storage/Discord-Logo-White_b3128ea2.png`} alt="Discord" /></a>
              <a href="https://raguniverse-izcifhmz.manus.space/" target="_blank" rel="noreferrer" className="news-home-closing__game-start"><img src={`${ASSET_BASE_URL}/manus-storage/gamestart_BTN_1c6449da.png`} alt="Game Start" /></a>
            </div>
          </div>
        </section>
        <section className="news-home-footer__bar">
          <div className="news-home-footer__inner">
            <div>
              <div className="news-home-footer__brands">GRAVITY <i /> WEMADE CONNECT <i /> GALA</div>
              <nav><Link href="/terms-of-service">Terms of Service</Link><Link href="/privacy-policy">Privacy Policy</Link><button type="button" onClick={() => setShowPrivacySettings(true)}>Privacy Settings</button><a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer">Customer Support</a></nav>
              <img src={`${ASSET_BASE_URL}/manus-storage/gravity_logo_light_c14f48f8_5e3a7c41.png`} alt="GRAVITY" />
              <p>Copyright © Gravity Co., LTD &amp; Lee Myoungjin(studio DTDS). All Rights Reserved. All trademarks used on this website are the property of their respective owners.</p>
            </div>
            <div className="news-home-footer__social" aria-label="Official social links"><a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" aria-label="Discord">D</a><a href="https://facebook.com/RagnarokUniverseEN" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a><a href="https://www.youtube.com/@RagnarokUniverse" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶</a><a href="https://x.com/RagUniOfficial" target="_blank" rel="noopener noreferrer" aria-label="X">X</a></div>
          </div>
        </section>
      </footer>
      ) : (
      /* Footer */
      <footer id="site-footer" className="fantasy-site-footer home-scroll-panel home-section-surface home-surface--closing home-panel-fill mt-auto w-full text-[#17120c]">
        <div className="container py-12" style={{paddingTop: '30px'}}>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#735c39]">Your story begins here</p>
            <h2 className="font-serif text-2xl font-black tracking-tight text-[#2c241c] md:text-4xl">Two Clicks to Midgard</h2>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a href="/#game-start" className="rounded-md bg-[#4068a5] px-5 py-2.5 text-xs font-bold text-white shadow-[0_5px_12px_rgba(36,70,120,.28)] transition-transform hover:-translate-y-0.5 hover:bg-[#537fbe] active:scale-[.97]">Game Start</a>
              <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-[#6f7df5] bg-[#5865f2] px-5 py-2.5 text-xs font-bold text-white shadow-[0_5px_12px_rgba(53,66,159,.28)] transition-transform hover:-translate-y-0.5 hover:bg-[#6974f5] active:scale-[.97]">Join Discord <ExternalLink size={13} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="mb-8 flex justify-end">
            <div className="flex items-center gap-2" aria-label="Official social links">
              <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" aria-label="Visit Ragnarok Universe on Discord" className="footer-social-link bg-[#5865f2]"><img src={`${ASSET_BASE_URL}/manus-storage/Discord_icon_230fdb89_6026051e.png`} alt="" className="h-5 w-5 object-contain" /></a>
              <a href="https://facebook.com/RagnarokUniverseEN" target="_blank" rel="noopener noreferrer" aria-label="Visit Ragnarok Universe on Facebook" className="footer-social-link bg-[#1877f2]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.4-.1c-2.4 0-4 1.4-4 4.1V10H8v3h2.6v8h3.2Z" /></svg></a>
              <a href="https://www.youtube.com/@RagnarokUniverse" target="_blank" rel="noopener noreferrer" aria-label="Visit Ragnarok Universe on YouTube" className="footer-social-link bg-[#e62429]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg></a>
              <a href="https://x.com/RagUniOfficial" target="_blank" rel="noopener noreferrer" aria-label="Visit Ragnarok Universe on X" className="footer-social-link bg-[#171717]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.9 2H22l-6.8 7.8 8 12.2H17l-4.8-7.3L5.8 22H2.7l7.3-8.4L2.3 2h6.3l4.3 6.6L18.9 2Zm-1.1 18h1.7L7.7 3.9H5.9L17.8 20Z" /></svg></a>
            </div>
          </div>
          {/* Footer Top: Company Logos */}
          <div className="mb-8 flex items-center justify-center gap-6 text-xs font-semibold text-[#17120c]">
            <a href="https://gravity.co.kr/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#163f7d]">GRAVITY</a>
            <span className="h-4 w-px bg-[#705c36]"></span>
            <a href="https://wemadeconnect.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#163f7d]">WEMADE CONNECT</a>
            <span className="h-4 w-px bg-[#705c36]"></span>
            <a href="https://www.gala.biz/ko" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#163f7d]">GALA</a>
          </div>

          {/* Footer Middle: Links and Discord */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
            <Link href="/terms-of-service" className="font-medium text-[#17120c] transition-colors hover:text-[#163f7d]">Terms of Service</Link>
            <span className="text-[#705c36]">|</span>
            <Link href="/privacy-policy" className="font-medium text-[#17120c] transition-colors hover:text-[#163f7d]">Privacy Policy</Link>
            <span className="text-[#705c36]">|</span>
            <button onClick={() => setShowPrivacySettings(true)} className="cursor-pointer font-medium text-[#17120c] transition-colors hover:text-[#163f7d]">Privacy Settings</button>
            <span className="text-[#705c36]">|</span>
            <div className="flex items-center gap-2">
              <Disc size={16} className="text-blue-600 dark:text-blue-400" />
              <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="font-medium text-[#17120c] transition-colors hover:text-[#163f7d]">Discord</a>
            </div>
          </div>

          {/* Footer Bottom: Copyright with Logo */}
          <div style={{paddingTop: '0px'}}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={theme === "dark" ? `${ASSET_BASE_URL}/manus-storage/gravity_logo_white_5424057b_66bab3ca.webp` : `${ASSET_BASE_URL}/manus-storage/gravity_logo_light_c14f48f8_5e3a7c41.png`}
                alt="GRAVITY"
                className="h-8 w-auto"
              />
              <p className="text-xs font-medium text-[#17120c]">Copyright &copy; Gravity Co., LTD & Lee MyoungJin(studio DTDS). All Rights Reserved.</p>
            </div>
            <p className="text-center text-xs font-medium text-[#17120c]">All trademarks used on this website are the property of their respective owners.</p>
          </div>
        </div>
      </footer>
      )}

      {/* Privacy Settings Dialog */}
      <PrivacySettingsDialog isOpen={showPrivacySettings} onClose={() => setShowPrivacySettings(false)} />

      {/* TT Key Dialog */}
      {showTTKeyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Get a key to play</h2>
              <button onClick={() => setShowTTKeyDialog(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <X size={24} />
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Join our Discord community to get a key and start playing Ragnarok Universe!</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowTTKeyDialog(false)} className="flex-1">
                Close
              </Button>
              <Button onClick={() => { window.open('https://discord.gg/yVWJkWdkAU', '_blank'); setShowTTKeyDialog(false); }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Join Discord
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Dialog */}
      {showComingSoonDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">We're Getting Ready!</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Please visit our official Discord channel for more information.</p>
            <Button onClick={() => setShowComingSoonDialog(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Confirm
            </Button>
          </div>
        </div>
      )}

      <FloatingSocialLinks />
    </div>
  );
}
