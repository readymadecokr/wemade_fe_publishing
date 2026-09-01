import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Globe, X, Disc, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import PrivacySettingsDialog from "./PrivacySettingsDialog";
import { trpc } from "@/lib/trpc";

function fmtRuc(n: number): string { return Math.min(n, 9999999).toLocaleString("en-US"); }

// Footer logo image updated to GravityCI-가로형(2022).png for light mode
const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [lang, setLang] = useState("EN");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showTTKeyDialog, setShowTTKeyDialog] = useState(false);
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
      


      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#c8d8e7]/30 bg-[#1c3147]/72 text-white shadow-[0_3px_18px_rgba(24,38,57,.28)] backdrop-blur-xl [background-image:linear-gradient(100deg,rgba(32,56,78,.84),rgba(58,84,110,.58),rgba(24,45,66,.82))]">
        <div className="container flex min-h-16 flex-wrap items-center justify-center gap-x-5 gap-y-1 py-2 lg:min-h-18 lg:flex-nowrap lg:justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <img src={`${ASSET_BASE_URL}/manus-storage/logo_main_ascii_c85e5b8d_8981998e.png`} alt="Ragnarok" className="h-10 w-auto brightness-[1.28] contrast-90 group-hover:opacity-80 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="portal-nav flex items-center justify-center gap-3 text-[11px] sm:gap-5 sm:text-xs lg:gap-7" aria-label="Primary navigation">
            <Link href="/" className={`transition-colors cursor-pointer ${location === "/" ? "text-[#f3d991] font-bold" : "text-slate-100 hover:text-[#f3d991]"}`}>
              Home
            </Link>
            <Link href="/news" className={`transition-colors cursor-pointer ${location === "/news" ? "text-[#f3d991] font-bold" : "text-slate-100 hover:text-[#f3d991]"}`}>
              News
            </Link>
            <Link href="/game-info" className={`transition-colors cursor-pointer ${location === "/game-info" ? "text-[#f3d991] font-bold" : "text-slate-100 hover:text-[#f3d991]"}`}>
              Game Info
            </Link>
            <Link href="/point-shop" className={`transition-colors cursor-pointer ${location === "/point-shop" ? "text-[#f3d991] font-bold" : "text-slate-100 hover:text-[#f3d991]"}`}>
              Shop
            </Link>
            <button onClick={() => setShowTTKeyDialog(true)} className="cursor-pointer text-[11px] text-slate-100 transition-colors hover:text-[#f3d991] sm:text-xs">
              Discord
            </button>
          </nav>

          {/* Desktop CTA / Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auth Section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* rCoin 잔액 + 마이페이지 통합 표기 */}
              <div className="flex items-center gap-0 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 overflow-hidden text-xs font-semibold shadow-sm">
                <Link href="/point-shop" className="flex items-center gap-1 px-3 py-2 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  <span>rCoin: <span className="text-[#9b2020] font-black">{fmtRuc(ruCash)}</span></span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span>Bonus rCoin: <span className="text-green-700 font-black">{fmtRuc(bonusCash)}</span></span>
                </Link>
                <Link href="/mypage" className="flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer border-l border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  My Page
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-[#e6c972] bg-[#fffaf0] text-xs font-bold text-[#263b5b] shadow-sm hover:bg-[#f8edce] hover:text-[#1d3150]">
                Logout
              </Button>
            </div>
            ) : (
              <Link href="/login">
              <Button size="sm" className="border border-[#d5bd7d]/70 bg-[#476da9] px-3 py-2 text-[10px] font-semibold text-white shadow-lg shadow-[#17283b]/30 transition-all hover:-translate-y-0.5 hover:border-[#fff0bd] hover:bg-[#6188c5] hover:shadow-[0_8px_20px_rgba(18,39,70,.42),inset_0_1px_rgba(255,255,255,.45)] focus-visible:ring-2 focus-visible:ring-[#fff0bd] active:scale-95 sm:px-4 sm:text-xs">
                  Sign In / Sign Up
                </Button>
              </Link>
            )}

            {/* Language and Theme */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex cursor-pointer items-center gap-1 text-[10px] font-bold text-slate-100 transition-colors hover:text-[#f3d991] sm:text-xs">
                  <Globe size={14} /> {lang}
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLangSelect(l.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                          lang === l.code ? "text-blue-600 font-bold bg-blue-50 dark:bg-slate-700" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={toggleTheme} disabled={!toggleTheme} className="flex cursor-pointer items-center gap-1 text-slate-100 transition-colors hover:text-[#f3d991] disabled:cursor-not-allowed disabled:opacity-50">
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Cookie Consent Banner */}


      {/* Footer */}
      <footer className="mt-auto w-full bg-transparent text-[#17120c]">
        <div className="container py-12" style={{paddingTop: '30px'}}>
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

      {/* Floating Social Links — reference order: Discord, Facebook, YouTube, X */}
      <style>{`
        @keyframes float-social {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .floating-social-box {
          animation: float-social 3s ease-in-out infinite;
        }
      `}</style>
      <div className="floating-social-box fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-5">
        {/* Discord */}
        <a
          href="https://discord.gg/yVWJkWdkAU"
          target="_blank"
          rel="noopener noreferrer"
          title="Discord"
          aria-label="Visit Ragnarok Universe on Discord"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#5865f2] shadow-[0_6px_16px_rgba(53,66,159,.38)] transition-all duration-200 hover:scale-110 hover:brightness-110 active:scale-95 sm:h-[52px] sm:w-[52px]"
        >
          <img src={`${ASSET_BASE_URL}/manus-storage/Discord_icon_230fdb89_6026051e.png`} alt="" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
        </a>
        {/* Facebook */}
        <a
          href="https://facebook.com/RagnarokUniverseEN"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
          aria-label="Visit Ragnarok Universe on Facebook"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#1877f2] text-white shadow-[0_6px_16px_rgba(24,119,242,.35)] transition-all duration-200 hover:scale-110 hover:brightness-110 active:scale-95 sm:h-[52px] sm:w-[52px]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-current"><path d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.4-.1c-2.4 0-4 1.4-4 4.1V10H8v3h2.6v8h3.2Z" /></svg>
        </a>
        {/* YouTube */}
        <a
          href="https://www.youtube.com/@RagnarokUniverse"
          target="_blank"
          rel="noopener noreferrer"
          title="YouTube"
          aria-label="Visit Ragnarok Universe on YouTube"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white text-[#ff0033] shadow-[0_6px_16px_rgba(82,42,47,.24)] transition-all duration-200 hover:scale-110 hover:brightness-105 active:scale-95 sm:h-[52px] sm:w-[52px]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-current"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>
        </a>
        {/* X */}
        <a
          href="https://x.com/RagUniOfficial"
          target="_blank"
          rel="noopener noreferrer"
          title="X"
          aria-label="Visit Ragnarok Universe on X"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#161616] text-white shadow-[0_6px_16px_rgba(0,0,0,.34)] transition-all duration-200 hover:scale-110 hover:bg-black active:scale-95 sm:h-[52px] sm:w-[52px]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M18.9 2H22l-6.8 7.8 8 12.2H17l-4.8-7.3L5.8 22H2.7l7.3-8.4L2.3 2h6.3l4.3 6.6L18.9 2Zm-1.1 18h1.7L7.7 3.9H5.9L17.8 20Z" /></svg>
        </a>
      </div>
    </div>
  );
}
