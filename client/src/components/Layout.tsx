import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Globe, Menu, X, Disc, Moon, Sun } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showTTKeyDialog, setShowTTKeyDialog] = useState(false);
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isLoggedIn = localStorage.getItem("rou_logged_in") === "true";
  const userNickname = localStorage.getItem("rou_nickname") || "Adventurer";

  // RU Cash 잔액 조회 (Manus OAuth 로그인 사용자용)
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
    if (!cookieConsent) {
      setShowPrivacySettings(true);
    }
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
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/40 selection:text-white overflow-x-hidden">
      


      {/* Main Header */}
      <header className="sticky top-0 w-full z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container h-20 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <img src={`${ASSET_BASE_URL}/manus-storage/logo_main_ascii_c85e5b8d_8981998e.png`} alt="Ragnarok" className="h-12 w-auto group-hover:opacity-80 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className={`hover:text-blue-600 transition-colors cursor-pointer ${location === "/" ? "text-blue-600 font-bold" : "text-slate-600 dark:text-white"}`}>
              Home
            </Link>
            <Link href="/news" className={`hover:text-blue-600 transition-colors cursor-pointer ${location === "/news" ? "text-blue-600 font-bold" : "text-slate-600 dark:text-white"}`}>
              News
            </Link>
            <button onClick={() => setShowComingSoonDialog(true)} className="hover:text-blue-600 transition-colors cursor-pointer text-slate-600 dark:text-white font-bold text-base">
              Game Info
            </button>
            <button onClick={() => setShowComingSoonDialog(true)} className="hover:text-blue-600 transition-colors cursor-pointer text-slate-600 dark:text-white font-bold text-base">
              Shop
            </button>
            <button onClick={() => setShowTTKeyDialog(true)} className="hover:text-blue-600 transition-colors cursor-pointer text-slate-600 dark:text-white font-bold text-base">
              Discord
            </button>
          </nav>

          {/* Desktop CTA / Profile */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Auth Section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* RU Cash 잔액 + 마이페이지 통합 표기 */}
              <div className="flex items-center gap-0 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 overflow-hidden text-xs font-semibold shadow-sm">
                <Link href="/point-shop" className="flex items-center gap-1 px-3 py-2 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  <span>RU Cash: <span className="text-[#9b2020] font-black">{fmtRuc(ruCash)}</span></span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span>Bonus RU Cash: <span className="text-green-700 font-black">{fmtRuc(bonusCash)}</span></span>
                </Link>
                <Link href="/mypage" className="flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer border-l border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  마이페이지
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs border-blue-200 hover:bg-blue-50 text-slate-600">
                Logout
              </Button>
            </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all active:scale-95 cursor-pointer">
                  Sign In / Sign Up
                </Button>
              </Link>
            )}

            {/* Language and Theme */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer font-bold text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-slate-100">
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
              <button onClick={toggleTheme} disabled={!toggleTheme} className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full bg-white dark:bg-background border-b border-blue-100 dark:border-border py-6 px-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top-5 duration-200">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-bold ${location === "/" ? "text-blue-600" : "text-slate-600 dark:text-white"}`}>
              Home
            </Link>
            <Link href="/news" onClick={() => setIsMobileMenuOpen(false)} className={`text-left text-sm font-bold ${location === "/news" ? "text-blue-600" : "text-slate-600 dark:text-white"}`}>
              News
            </Link>
            <button onClick={() => { setShowComingSoonDialog(true); setIsMobileMenuOpen(false); }} className="text-left text-sm font-bold text-slate-600 dark:text-white hover:text-blue-600 w-full">
              Game Info
            </button>
            <button onClick={() => { setShowComingSoonDialog(true); setIsMobileMenuOpen(false); }} className="text-left text-sm font-bold text-slate-600 dark:text-white hover:text-blue-600 w-full">
              Shop
            </button>
            <button onClick={() => { setShowTTKeyDialog(true); setIsMobileMenuOpen(false); }} className="text-left text-sm font-bold text-slate-600 dark:text-white hover:text-blue-600 w-full">
              Discord
            </button>
            <hr className="border-blue-100 my-1" />
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-sm font-semibold text-slate-900">Welcome, {userNickname}!</span>
                </div>
                <Link href="/mypage" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm">
                    My Page
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="w-full text-sm border-blue-200 hover:bg-blue-50">
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Sign In / Sign Up
                </Button>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Cookie Consent Banner */}


      {/* Footer */}
      <footer className="w-full bg-background mt-auto">
        <div className="container py-12" style={{paddingTop: '30px'}}>
          {/* Footer Top: Company Logos */}
          <div className="flex justify-center items-center gap-6 text-xs font-semibold text-slate-600 dark:text-white mb-8">
            <a href="https://gravity.co.kr/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">GRAVITY</a>
            <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600"></span>
            <a href="https://wemadeconnect.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">WEMADE CONNECT</a>
            <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600"></span>
            <a href="https://www.gala.biz/ko" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">GALA</a>
          </div>

          {/* Footer Middle: Links and Discord */}
          <div className="flex justify-center items-center gap-2 text-sm mb-8 flex-wrap">
            <Link href="/terms-of-service" className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link href="/privacy-policy" className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button onClick={() => setShowPrivacySettings(true)} className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Privacy Settings</button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <Disc size={16} className="text-blue-600 dark:text-blue-400" />
              <a href="https://discord.gg/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Discord</a>
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
              <p className="text-xs text-slate-600 dark:text-white">Copyright &copy; Gravity Co., LTD & Lee MyoungJin(studio DTDS). All Rights Reserved.</p>
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">All trademarks used on this website are the property of their respective owners.</p>
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
      <div className="floating-social-box fixed top-1/2 -translate-y-1/2 right-3 z-40 flex flex-col items-center gap-2 bg-black/50 backdrop-blur-sm rounded-2xl py-3 px-2 shadow-2xl border border-white/10">
        {/* Discord */}
        <button
          onClick={() => window.open('https://discord.gg/yVWJkWdkAU', '_blank')}
          title="Discord"
          className="w-[58px] h-[58px] flex items-center justify-center rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <img src={`${ASSET_BASE_URL}/manus-storage/Discord_icon_230fdb89_6026051e.png`} alt="Discord" className="w-[43px] h-[43px] object-contain" />
        </button>
        {/* YouTube */}
        <button
          onClick={() => window.open('https://www.youtube.com/@RagnarokUniverse', '_blank')}
          title="YouTube"
          className="w-[58px] h-[58px] flex items-center justify-center rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <img src="/manus-storage/yt_icon_red_digital_78f0d0ca.png" alt="YouTube" className="w-[43px] h-[43px] object-contain" />
        </button>
      </div>
    </div>
  );
}
