import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Sun, Moon, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Notice", href: "/notice" },
  { label: "Game Info", href: "/game-info" },
  { label: "Point Shop", href: "/point-shop" },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      window.location.href = "/";
    },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/manus-storage/logo_main_ascii_91a16bbc.png"
              alt="Ragnarok Universe"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? location === "/"
                  : location.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Theme Toggle + Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="max-w-[100px] truncate">{user?.name ?? "My Account"}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href="/my-page"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Page
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logoutMutation.mutate();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                size="sm"
                className="gaming-gradient text-white font-semibold px-4"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border mt-auto">
        <div className="container py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <img
                src={isDark ? "/manus-storage/gravity_logo_white_c8fbd1b5.webp" : "/manus-storage/gravity_logo_light_3c75ad7c.png"}
                alt="Gravity"
                className="h-8 w-auto mb-3"
              />
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Ragnarok Universe is the official gaming portal for all Ragnarok Online titles. Experience the world of Midgard.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <img src="/manus-storage/icon_fb_ascii_99aec49e.png" alt="Facebook" className="w-6 h-6 object-contain" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <img src="/manus-storage/Discord_icon_265b1ea4.png" alt="Discord" className="w-6 h-6 object-contain" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <img src="/manus-storage/icon_apple_ascii_42e26034.png" alt="App Store" className="w-6 h-6 object-contain" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              © 2026 Gravity Co., Ltd. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Ragnarok Universe — Official Gaming Portal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
