import { useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "wouter";
import { Globe, X, Disc, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import PrivacySettingsDialog from "./PrivacySettingsDialog";
import FloatingSocialLinks from "./FloatingSocialLinks";
import { trpc } from "@/lib/trpc";
import HomeHeader from "./HomeHeader";
import ServiceFooter from "./ServiceFooter";
import "./news-layout.css";

function fmtRuc(n: number): string { return Math.min(n, 9999999).toLocaleString("en-US"); }

// Footer logo image updated to GravityCI-가로형(2022).png for light mode
const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

interface LayoutProps {
  children: React.ReactNode;
  variant?: "default" | "homeChrome";
  showClosingCta?: boolean;
}

export default function Layout({ children, variant = "homeChrome", showClosingCta = true }: LayoutProps) {
  const [location] = useLocation();
  const usePlainDetailSurface = variant === "homeChrome" && (location.startsWith("/news") || location === "/point-shop");
  const useShopSurface = variant === "homeChrome" && location === "/point-shop";
  const [lang, setLang] = useState("EN");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showTTKeyDialog, setShowTTKeyDialog] = useState(false);
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const { theme } = useTheme();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.style.scrollBehavior = previousScrollBehavior;
  }, [location]);

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
    <div className={`fantasy-site-atlas min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/40 selection:text-white overflow-x-hidden${usePlainDetailSurface ? " fantasy-site-atlas--detail-plain" : ""}${useShopSurface ? " fantasy-site-atlas--shop-surface" : ""}`}>
      


      <HomeHeader activeSection={location.startsWith("/news") ? "news" : location === "/point-shop" ? "shop" : "home"} />

      {/* Main Content */}
      <main className={`flex-1 w-full ${variant === "homeChrome" ? "home-chrome-content" : "pt-[136px] sm:pt-[106px]"}`}>
        {children}
      </main>

      {/* Cookie Consent Banner */}


      {variant === "homeChrome" ? (
      <>
        {showClosingCta && <section className="news-home-closing" aria-label="Ragnarok Universe closing call to action">
          <div className="news-home-closing__content">
            <span>YOUR STORY BEGINS HERE</span>
            <h2>TWO CLICKS TO<br />MIDGARD</h2>
            <p>Start the game in your browser, then join the Discord to find a party, get patch news first and take part in founder events.</p>
            <div className="news-home-closing__actions">
              <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="news-home-closing__discord"><img src={`${ASSET_BASE_URL}/manus-storage/Discord-Logo-White_b3128ea2.png`} alt="Discord" /></a>
              <a href="https://raguniverse-izcifhmz.manus.space/" target="_blank" rel="noreferrer" className="news-home-closing__game-start"><img src={`${ASSET_BASE_URL}/manus-storage/gamestart_BTN_1c6449da.png`} alt="Game Start" /></a>
            </div>
          </div>
        </section>}
        <ServiceFooter onPrivacySettings={() => setShowPrivacySettings(true)} />
      </>
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
