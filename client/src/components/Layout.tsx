import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Globe, Menu, X, Disc, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import PrivacySettingsDialog from "./PrivacySettingsDialog";

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

  // Check if user has already accepted cookies
  useEffect(() => {
    const cookieConsent = localStorage.getItem("rou_cookie_consent");
    if (!cookieConsent) {
      setShowCookieConsent(true);
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
            <img src={`${ASSET_BASE_URL}/manus-storage/logo_main_ascii_c85e5b8d.png`} alt="Ragnarok" className="h-12 w-auto group-hover:opacity-80 transition-opacity" />
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
              Point Shop
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
                <Link href="/mypage" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer">
                  <span className="text-xs font-semibold text-slate-900">My Page</span>
                </Link>
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
              Point Shop
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
      {showCookieConsent && (
        <>
        <div className="fixed bottom-0 left-0 right-0 bg-slate-700/50 text-white p-4 z-50 shadow-lg backdrop-blur-sm">
          <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/90">
              We use cookies on this website to make your experience better. Hereby you give your consent to the use of cookies for personalizing content under the{" "}
              <Link href="/privacy-policy" className="underline hover:text-blue-100">Privacy Policy</Link> and the{" "}
              <Link href="/cookie-policy" className="underline hover:text-blue-100">Cookies Policy.</Link>
            </p>
            <div className="flex gap-3 whitespace-nowrap">
              <button
                onClick={() => handleCookieConsent(false)}
                className="px-4 py-2 text-sm font-semibold bg-slate-600 hover:bg-slate-500 rounded transition-colors"
              >
                Essential Cookies Only
              </button>
              <button
                onClick={() => handleCookieConsent(true)}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Allow All
              </button>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Footer */}
      <footer className="w-full bg-background border-t border-blue-100 mt-auto">
        <div className="container py-12">
          {/* Footer Top: Company Logos */}
          <div className="flex justify-center items-center gap-6 text-xs font-semibold text-slate-600 dark:text-white mb-8">
            <span>GRAVITY</span>
            <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600"></span>
            <span>WEMADE CONNECT</span>
            <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600"></span>
            <span>GALA</span>
          </div>

          {/* Footer Middle: Links and Discord */}
          <div className="flex justify-center items-center gap-2 text-sm mb-8 flex-wrap">
            <Link href="/privacy-policy" className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link href="/terms-of-service" className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button onClick={() => setShowPrivacySettings(true)} className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Privacy Settings</button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link href="/cookie-policy" className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <Disc size={16} className="text-blue-600 dark:text-blue-400" />
              <a href="https://discord.gg/ragnarok" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Discord</a>
            </div>
          </div>

          {/* Footer Bottom: Copyright with Logo */}
          <div className="pt-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={theme === "dark" ? `${ASSET_BASE_URL}/manus-storage/gravity_logo_white_5424057b.webp` : `${ASSET_BASE_URL}/manus-storage/gravity_logo_light_c14f48f8.png`}
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
              <Button onClick={() => { window.open('https://discord.com/invite/ragnarok', '_blank'); setShowTTKeyDialog(false); }} className="flex-1 bg-blue-600 hover:bg-blue-700">
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

      {/* Floating Discord Icon */}
      <button
        onClick={() => setShowTTKeyDialog(true)}
        className="floating-discord fixed top-80 right-4 md:right-4 z-40 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="Join Discord"
      >
        <img src={`${ASSET_BASE_URL}/manus-storage/Discord_icon_230fdb89.png`} alt="Discord" className="w-full h-full rounded-full" />
      </button>
    </div>
  );
}
