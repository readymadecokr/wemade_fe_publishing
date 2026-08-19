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
    <div className="min-h-screen flex flex-col bg-[#050816] text-slate-100 selection:bg-cyan-300/40 selection:text-white overflow-x-hidden">
      


      {/* Main Header */}
      <header className="sticky top-0 w-full z-40 bg-[#07101e]/90 backdrop-blur-xl border-b border-cyan-300/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <div className="container min-h-20 flex flex-wrap items-center gap-x-3 gap-y-2 py-3 lg:h-20 lg:flex-nowrap lg:gap-4 lg:py-0">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2 group cursor-pointer">
            <img src={`${ASSET_BASE_URL}/manus-storage/logo_main_ascii_c85e5b8d_8981998e.png`} alt="Ragnarok" className="h-12 w-auto group-hover:opacity-80 transition-opacity" />
          </Link>

          {/* Navigation remains visible on mobile; the header scrolls horizontally when needed. */}
          <nav className="order-3 flex basis-full items-center justify-between gap-2 text-xs lg:order-none lg:basis-auto lg:gap-8 lg:text-base">
            <Link href="/" className={`hover:text-cyan-300 transition-colors cursor-pointer ${location === "/" ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
              Home
            </Link>
            <Link href="/news" className={`hover:text-cyan-300 transition-colors cursor-pointer ${location === "/news" ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
              News
            </Link>
            <Link href="/game-info" className={`hover:text-cyan-300 transition-colors cursor-pointer ${location === "/game-info" ? "text-cyan-300 font-bold" : "text-slate-300 font-bold"}`}>
              Game Info
            </Link>
            <Link href="/point-shop" className={`hover:text-cyan-300 transition-colors cursor-pointer ${location === "/point-shop" ? "text-cyan-300 font-bold" : "text-slate-300 font-bold"}`}>
              Shop
            </Link>
            <button onClick={() => setShowTTKeyDialog(true)} className="hover:text-cyan-300 transition-colors cursor-pointer text-slate-300 font-bold text-base">
              Discord
            </button>
          </nav>

          {/* CTA / Profile */}
          <div className="flex shrink-0 items-center gap-3 lg:gap-4">
            {/* Auth Section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* rCoin 잔액 + 마이페이지 통합 표기 */}
              <div className="flex items-center gap-0 rounded-lg border border-cyan-300/20 bg-slate-950/80 overflow-hidden text-xs font-semibold shadow-[0_0_18px_rgba(25,216,230,0.08)]">
                <Link href="/point-shop" className="flex items-center gap-1 px-3 py-2 hover:bg-cyan-300/10 transition-colors cursor-pointer text-slate-200 whitespace-nowrap">
                  <span>rCoin: <span className="text-[#fb4b68] font-black">{fmtRuc(ruCash)}</span></span>
                  <span className="mx-2 text-slate-600">|</span>
                  <span>Bonus rCoin: <span className="text-emerald-400 font-black">{fmtRuc(bonusCash)}</span></span>
                </Link>
                <Link href="/mypage" className="flex items-center px-3 py-2 bg-cyan-300/10 hover:bg-cyan-300/20 transition-colors cursor-pointer border-l border-cyan-300/15 text-cyan-100 whitespace-nowrap">
                  마이페이지
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs border-cyan-300/25 bg-transparent hover:bg-cyan-300/10 text-slate-200">
                Logout
              </Button>
            </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-cyan-300 hover:bg-cyan-200 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg shadow-lg shadow-cyan-300/20 hover:shadow-cyan-300/30 transition-all active:scale-95 cursor-pointer">
                  Sign In / Sign Up
                </Button>
              </Link>
            )}

            {/* Language and Theme */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer font-bold text-slate-300">
                  <Globe size={14} /> {lang}
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#0b1628] border border-cyan-300/20 rounded-lg shadow-2xl z-50">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLangSelect(l.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                          lang === l.code ? "text-cyan-300 font-bold bg-cyan-300/10" : "text-slate-200"
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={toggleTheme} disabled={!toggleTheme} className="hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
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
      <footer className="w-full mt-auto border-t border-cyan-300/10 bg-[#050816]">
        <div className="container py-12" style={{paddingTop: '30px'}}>
          {/* Footer Top: Company Logos */}
          <div className="flex justify-center items-center gap-6 text-xs font-semibold text-slate-400 mb-8">
            <a href="https://gravity.co.kr/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">GRAVITY</a>
            <span className="h-4 w-[1px] bg-cyan-300/20"></span>
            <a href="https://wemadeconnect.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">WEMADE CONNECT</a>
            <span className="h-4 w-[1px] bg-cyan-300/20"></span>
            <a href="https://www.gala.biz/ko" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">GALA</a>
          </div>

          {/* Footer Middle: Links and Discord */}
          <div className="flex justify-center items-center gap-2 text-sm mb-8 flex-wrap">
            <Link href="/terms-of-service" className="text-slate-400 hover:text-cyan-300 transition-colors">Terms of Service</Link>
            <span className="text-slate-700">|</span>
            <Link href="/privacy-policy" className="text-slate-400 hover:text-cyan-300 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">|</span>
            <button onClick={() => setShowPrivacySettings(true)} className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer">Privacy Settings</button>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <Disc size={16} className="text-cyan-300" />
              <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors">Discord</a>
            </div>
          </div>

          {/* Footer Bottom: Copyright with Logo */}
          <div style={{paddingTop: '0px'}}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={`${ASSET_BASE_URL}/manus-storage/gravity_logo_white_5424057b_66bab3ca.webp`}
                alt="GRAVITY"
                className="h-8 w-auto"
              />
              <p className="text-xs text-slate-500">Copyright &copy; Gravity Co., LTD & Lee MyoungJin(studio DTDS). All Rights Reserved.</p>
            </div>
            <p className="text-center text-xs text-slate-600">All trademarks used on this website are the property of their respective owners.</p>
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

      {/* Floating Social Box — Discord + YouTube in one rounded semi-transparent box */}
      <style>{`
        @keyframes float-social {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .floating-social-box {
          animation: float-social 3s ease-in-out infinite;
        }
      `}</style>
      <div className="floating-social-box fixed bottom-4 right-3 z-40 flex flex-col items-center gap-1 rounded-2xl border border-cyan-300/15 bg-slate-950/80 px-1.5 py-2 shadow-2xl backdrop-blur-sm sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 sm:gap-2 sm:px-2 sm:py-3">
        {/* Discord */}
        <button
          onClick={() => window.open('https://discord.gg/yVWJkWdkAU', '_blank')}
          title="Discord"
          className="h-12 w-12 flex items-center justify-center rounded-xl hover:bg-cyan-300/15 transition-all duration-200 hover:scale-110 active:scale-95 sm:h-[58px] sm:w-[58px]"
        >
          <img src={`${ASSET_BASE_URL}/manus-storage/Discord_icon_230fdb89_6026051e.png`} alt="Discord" className="h-9 w-9 object-contain sm:h-[43px] sm:w-[43px]" />
        </button>
        {/* YouTube */}
        <button
          onClick={() => window.open('https://www.youtube.com/@RagnarokUniverse', '_blank')}
          title="YouTube"
          className="h-12 w-12 flex items-center justify-center rounded-xl hover:bg-cyan-300/15 transition-all duration-200 hover:scale-110 active:scale-95 sm:h-[58px] sm:w-[58px]"
        >
          <img src="/manus-storage/yt_icon_red_digital_78f0d0ca.png" alt="YouTube" className="h-9 w-9 object-contain sm:h-[43px] sm:w-[43px]" />
        </button>
      </div>
    </div>
  );
}
