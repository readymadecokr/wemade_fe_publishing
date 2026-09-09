import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Globe, Play } from "lucide-react";
import FloatingSocialLinks from "@/components/FloatingSocialLinks";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import "./reference-home.css";
import "./media-strip.css";

const LOGO_URL = "/manus-storage/logo_main_ascii_c85e5b8d_8981998e.png";
const GAME_START_BUTTON_URL = "/manus-storage/gamestart_BTN_1c6449da.png";
const DISCORD_BUTTON_URL = "/manus-storage/Discord-Logo-White_b3128ea2.png";
const HERO_DESKTOP_URL = "/manus-storage/eb185c22e6e1_e39bfa40.png";
const DISCORD_URL = "https://discord.gg/yVWJkWdkAU";

const DEFAULT_HERO_BANNERS = [
  { id: "default", title: "Midgard runs in your browser", imageUrl: HERO_DESKTOP_URL },
] as const;

const NEWS_ITEMS = [
  { title: "Ragnarok Universe Beta Roadmap", copy: "A look at the next testing phase, planned improvements, and the road ahead.", image: "/manus-storage/banners/news-img-1787281494281_bb3eae6d.webp", date: "AUG 21, 2026", tag: "NOTICE" },
  { title: "Discord Founders Event Now Open", copy: "Meet other adventurers and take part in the first founders missions.", image: "/manus-storage/banners/news-img-1787281479124_091e48a2.webp", date: "AUG 19, 2026", tag: "EVENT" },
  { title: "Welcome to a New Era of Midgard", copy: "Discover the vision behind a browser-based return to Ragnarok.", image: "/manus-storage/banners/news-img-1787281449016_eb9de628.jpg", date: "AUG 15, 2026", tag: "NEWS" },
] as const;

const MEDIA_SCREENSHOTS = [
  { title: "Ragnarok Online: Patch Update June 17, 2026", image: "/manus-storage/RO1_pathupdate_17062026_f83f13b8_0ccbefaa.jpg" },
  { title: "Ragnarok Online: Patch Update June 10, 2026", image: "/manus-storage/RO_PatchUpdate_10062026_219a465c_5903482d.jpg" },
  { title: "Ragnarok Online: Patch Update June 4, 2026", image: "/manus-storage/RO_PatchUpdate_04062026-1_29153260_878bf95f.jpg" },
  { title: "Ragnarok Online: Patch Update May 27, 2026", image: "/manus-storage/RO_PatchUpdate_27052026_953943aa_fa54354f.webp" },
  { title: "Gravity Game Tech Launches LINE Official Account", image: "/manus-storage/PR-pack-Line-OA-Cover-700x36020052026_d4332f85_70996280.webp" },
  { title: "Ragnarok Online: Music Contest Winners Announced", image: "/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_bc640d8a_0c8f7386.png" },
  { title: "Ragnarok Online: Patch Update May 13, 2026", image: "/manus-storage/RO1_patchupdate_13052026_700e9d1f_01c2e74f.jpg" },
  { title: "Ragnarok Online: Special Anniversary Event", image: "/manus-storage/RO1_04032026PatchUpdate_700X360_3345ccff_33b86c1a.webp" },
  { title: "Ragnarok Monster Shop at Craft and Play 2026", image: "/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_46621aa6_4cf197fb.webp" },
  { title: "Ragnarok Online: Patch Update May 6, 2026", image: "/manus-storage/RO1_06052026_47ecad62_ae242c6b.jpg" },
  { title: "Ragnarok Online: Patch Update April 29, 2026", image: "/manus-storage/RO_PatchUpdate18032026_700x360_68e5480e_82a64304.webp" },
  { title: "Ragnarok Online: Patch Update April 22, 2026", image: "/manus-storage/RO_PatchUpdate_22042026_337d2472_7c5c5406.webp" },
] as const;

function formatRcoin(value: number): string {
  return Math.min(value, 9_999_999).toLocaleString("en-US");
}

function GameStartButton({ className = "" }: { className?: string }) {
  return (
    <a className={`home-game-start ${className}`.trim()} href="https://raguniverse-izcifhmz.manus.space/" target="_blank" rel="noreferrer" aria-label="Game Start">
      <img src={GAME_START_BUTTON_URL} alt="Game Start" />
    </a>
  );
}

function DiscordButton({ className = "" }: { className?: string }) {
  return (
    <a className={`home-discord-button ${className}`.trim()} href={DISCORD_URL} target="_blank" rel="noopener noreferrer" aria-label="Join Ragnarok Universe on Discord">
      <img src={DISCORD_BUTTON_URL} alt="Discord" />
    </a>
  );
}

function ReferenceHomeHeader({ activeSection, onNavigate }: { activeSection: string; onNavigate: (sectionId: string) => void }) {
  const [location] = useLocation();
  const { isAuthenticated, loading, logout } = useAuth();
  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });

  const startLogin = () => {
    window.location.href = getLoginUrl();
  };
  const handleLogout = async () => {
    await logout();
    window.location.assign("/");
  };
  const navigateTo = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    onNavigate(sectionId);
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
        <div className="container reference-header-main-row">
          <a href="#home" onClick={(event) => navigateTo(event, "home")} className="reference-header-logo" aria-label="Ragnarok Universe home"><img src={LOGO_URL} alt="Ragnarok Universe" /></a>
          <nav className="portal-nav" aria-label="Primary navigation">
            <a href="#home" onClick={(event) => navigateTo(event, "home")} className={`portal-nav-link ${activeSection === "home" ? "portal-nav-link--active" : ""}`}>HOME</a>
            <a href="#discord" onClick={(event) => navigateTo(event, "discord")} className={`portal-nav-link inline-flex items-center gap-1 ${activeSection === "discord" ? "portal-nav-link--active" : ""}`}>COMMUNITY <ExternalLink size={11} aria-hidden="true" /></a>
            {(["news", "game-info", "media"] as const).map((sectionId) => (
              <a key={sectionId} href={`#${sectionId}`} onClick={(event) => navigateTo(event, sectionId)} className={`portal-nav-link ${activeSection === sectionId ? "portal-nav-link--active" : ""}`}>{sectionId === "game-info" ? "GAME INFO" : sectionId.toUpperCase()}</a>
            ))}
            <Link href="/point-shop" className={`portal-nav-link inline-flex items-center gap-0.5 ${location === "/point-shop" ? "portal-nav-link--active" : ""}`}>SHOP <ChevronDown size={12} aria-hidden="true" /></Link>
          </nav>
          <div className="reference-header-cta shrink-0" aria-label="Quick actions">
            <GameStartButton className="reference-header-game-start" />
            <DiscordButton className="reference-header-discord" />
          </div>
        </div>
      </div>
      </header>
  );
}

function HomeCtaPair({ className = "" }: { className?: string }) {
  return <div className={`home-cta-pair ${className}`.trim()}><GameStartButton /><DiscordButton /></div>;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [heroIndex, setHeroIndex] = useState(0);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);
  const [screenshotScroll, setScreenshotScroll] = useState(0);
  const screenshotStripRef = useRef<HTMLDivElement | null>(null);
  const { data: managedBanners } = trpc.banner.list.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  const heroBanners = managedBanners?.length ? managedBanners : DEFAULT_HERO_BANNERS;
  const currentHero = heroBanners[heroIndex % heroBanners.length];

  const navigateTo = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-home-section]"));
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target.id) setActiveSection(current.target.id);
    }, { threshold: [0.35, 0.55, 0.75] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (!new Set(["home", "discord", "news", "game-info", "media"]).has(sectionId)) return;
    window.requestAnimationFrame(() => {
      setActiveSection(sectionId);
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, []);

  useEffect(() => {
    if (selectedScreenshot === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedScreenshot(null);
      if (event.key === "ArrowLeft") setSelectedScreenshot((current) => current === null ? current : (current + MEDIA_SCREENSHOTS.length - 1) % MEDIA_SCREENSHOTS.length);
      if (event.key === "ArrowRight") setSelectedScreenshot((current) => current === null ? current : (current + 1) % MEDIA_SCREENSHOTS.length);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedScreenshot]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".reference-home-live-header");
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty("--react-home-header-height", `${Math.ceil(header.getBoundingClientRect().height)}px`);
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-snap-panel]"));
    let wheelLocked = false;

    const isPanelViewport = () => window.matchMedia("(min-width: 769px)").matches;
    const getCurrentPanelIndex = () => {
      const headerHeight = Number.parseFloat(getComputedStyle(root).getPropertyValue("--react-home-header-height")) || 0;
      return panels.reduce((nearestIndex, panel, index) => {
        const nearestDistance = Math.abs(panels[nearestIndex].getBoundingClientRect().top - headerHeight);
        const panelDistance = Math.abs(panel.getBoundingClientRect().top - headerHeight);
        return panelDistance < nearestDistance ? index : nearestIndex;
      }, 0);
    };
    const handleWheel = (event: WheelEvent) => {
      if (!isPanelViewport() || wheelLocked || Math.abs(event.deltaY) < 8 || event.ctrlKey) return;
      if (event.target instanceof Element && event.target.closest(".react-home-widget")) return;

      const currentIndex = getCurrentPanelIndex();
      const nextIndex = Math.max(0, Math.min(panels.length - 1, currentIndex + (event.deltaY > 0 ? 1 : -1)));
      if (nextIndex === currentIndex) return;

      event.preventDefault();
      wheelLocked = true;
      panels[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => { wheelLocked = false; }, 680);
    };

    root.classList.add("react-home-snap");
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      root.classList.remove("react-home-snap");
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const selectHero = (direction: -1 | 1) => setHeroIndex((current) => (current + direction + heroBanners.length) % heroBanners.length);
  const syncScreenshotScroll = () => {
    const strip = screenshotStripRef.current;
    if (!strip) return;
    const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
    setScreenshotScroll(maxScroll === 0 ? 0 : (strip.scrollLeft / maxScroll) * 100);
  };
  const seekScreenshotStrip = (value: number) => {
    const strip = screenshotStripRef.current;
    if (!strip) return;
    const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
    strip.scrollTo({ left: (value / 100) * maxScroll, behavior: "smooth" });
  };

  return (
    <main className="react-home" aria-label="Ragnarok Universe homepage">
      <ReferenceHomeHeader activeSection={activeSection} onNavigate={navigateTo} />
      <FloatingSocialLinks hidden={activeSection === "home"} />

      <div className="react-home-layout" aria-label="Homepage content regions">
      <div className="react-home-home-stage" data-snap-panel>
      <section id="home" data-home-section className="react-home-panel react-home-hero">
        <img className="react-home-hero__visual" src={currentHero.imageUrl} alt="" fetchPriority="high" />
        <div className="react-home-hero__shade" />
        <div className="react-home-hero__content">
          <div className="react-home-hero__tags"><span>OPEN BETA</span><span>PLAY IN YOUR BROWSER</span></div>
          <h1><span>MIDGARD RUNS</span><span>IN YOUR BROWSER</span></h1>
          <p>No download, no install, no launcher. Open a tab on your phone or PC and begin your adventure.</p>
          <button type="button" className="react-home-white-cta" onClick={() => navigateTo("game-info")}>EXPLORE THE BETA <b>›</b></button>
        </div>
        <div className="react-home-hero__controls" aria-label="Hero banners">
          <button className="react-home-hero__arrow react-home-hero__arrow--left" type="button" aria-label="Previous banner" onClick={() => selectHero(-1)}><ChevronLeft /></button>
          <div className="react-home-hero__dots">{heroBanners.map((banner, index) => <button type="button" key={banner.id} aria-label={`Banner ${index + 1}: ${banner.title}`} aria-current={heroIndex % heroBanners.length === index} className={heroIndex % heroBanners.length === index ? "is-active" : ""} onClick={() => setHeroIndex(index)} />)}</div>
          <button className="react-home-hero__arrow react-home-hero__arrow--right" type="button" aria-label="Next banner" onClick={() => selectHero(1)}><ChevronRight /></button>
        </div>
      </section>

      <div className="react-home-hero-cta-row" aria-label="Hero quick actions"><HomeCtaPair className="home-cta-pair--hero" /></div>
      </div>

      <section id="discord" data-home-section data-snap-panel className="react-home-panel react-home-discord">
        <div className="react-home-section-shell react-home-discord__shell">
          <div className="react-home-section-heading react-home-section-heading--light"><div><span>OFFICIAL COMMUNITY</span><h2>DISCORD</h2></div><p>Development news and community updates from the official Ragnarok Universe Discord.</p></div>
          <div className="react-home-widget">
            <iframe src="https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051" title="Ragnarok Universe official Discord" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            <div className="react-home-widget__bar"><DiscordButton /></div>
          </div>
        </div>
      </section>

      <section id="news" data-home-section data-snap-panel className="react-home-panel react-home-news">
        <div className="react-home-section-shell">
          <div className="react-home-section-heading"><div><span>NEWS &amp; NOTICE</span><h2>LATEST FROM MIDGARD</h2></div><button type="button" className="react-home-outline-cta" onClick={() => setLibraryOpen(true)}>VIEW MORE <b>›</b></button></div>
          <div className="react-home-news-grid">
            {NEWS_ITEMS.map((item) => <article className="react-home-news-card" key={item.title}><img src={item.image} alt="" loading="lazy" /><div><div className="react-home-news-card__meta"><span>{item.tag}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.copy}</p><button type="button" onClick={() => setLibraryOpen(true)}>READ MORE <b>›</b></button></div></article>)}
          </div>
        </div>
      </section>

      <section id="game-info" data-home-section data-snap-panel className="react-home-panel react-home-game-info">
        <div className="react-home-section-shell react-home-game-info__grid">
          <div className="react-home-game-info__copy"><span>EXPLORE MIDGARD</span><h2>CLASSIC ADVENTURE<br />A NEW WAY TO PLAY</h2><p>Experience the legendary fantasy MMORPG directly in your web browser. Explore a familiar world, meet a growing community, and help shape the next chapter.</p><button type="button" className="react-home-outline-cta" onClick={() => setLibraryOpen(true)}>RUNE-MIDGARTS LIBRARY <b>›</b></button></div>
          <img src="/manus-storage/main2_0c694426_d1284510.png" alt="Ragnarok Universe gameplay" loading="lazy" />
        </div>
      </section>

      <section id="media" data-home-section data-snap-panel className="react-home-panel react-home-media">
        <div className="react-home-section-shell">
          <div className="react-home-section-heading react-home-section-heading--light"><div><span>SEE THE WORLD IN MOTION</span><h2>MEDIA</h2></div></div>
          <div className="react-home-media__feature"><img src="/manus-storage/main2_0c694426_d1284510.png" alt="Ragnarok Universe gameplay" loading="lazy" /><button type="button" aria-label="Play gameplay video"><Play fill="currentColor" /></button></div>
          <div className="react-home-media__gallery" aria-label="Ragnarok Universe screenshots">
            <div className="react-home-media__gallery-label"><span>SCREENSHOTS</span><span>DRAG TO EXPLORE</span></div>
            <div ref={screenshotStripRef} className="react-home-media__strip" onScroll={syncScreenshotScroll}>
              {MEDIA_SCREENSHOTS.map((screenshot, index) => (
                <button type="button" key={screenshot.image} className="react-home-media__thumbnail" onClick={() => setSelectedScreenshot(index)} aria-label={`View screenshot ${index + 1}: ${screenshot.title}`}>
                  <img src={screenshot.image} alt={screenshot.title} loading="lazy" />
                  <span>VIEW FULLSCREEN</span>
                </button>
              ))}
            </div>
            <div className="react-home-media__scrollbar" aria-label="Screenshot strip position">
              <input type="range" min="0" max="100" step="1" value={screenshotScroll} onChange={(event) => seekScreenshotStrip(Number(event.target.value))} aria-label="Browse screenshots" />
            </div>
          </div>
        </div>
      </section>

      <section className="react-home-panel react-home-final-panel" data-home-section data-snap-panel aria-label="Ragnarok Universe closing and footer">
        <div className="react-home-closing"><div className="react-home-closing__content"><span>YOUR STORY BEGINS HERE</span><h2>TWO CLICKS TO<br />MIDGARD</h2><p>Start the game in your browser, then join the Discord to find a party, get patch news first and take part in founder events.</p><HomeCtaPair /></div></div>
        <footer className="react-home-footer">
          <div className="react-home-footer__inner"><div><div className="react-home-footer__brands">GRAVITY <i /> WEMADE CONNECT <i /> GALA</div><nav><a href="/">Terms of Service</a><a href="/">Privacy Policy</a><a href="/">Privacy Settings</a><a href="/">Customer Support</a></nav><img src="/manus-storage/gravity_logo_light_c14f48f8_5e3a7c41.png" alt="GRAVITY" loading="lazy" /><p>Copyright © Gravity Co., LTD &amp; Lee Myoungjin(studio DTDS). All Rights Reserved. All trademarks used on this website are the property of their respective owners.</p></div><div className="react-home-footer__social"><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" aria-label="Discord">D</a><a href="https://facebook.com/RagnarokUniverseEN" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a><a href="https://www.youtube.com/@RagnarokUniverse" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶</a><a href="https://x.com/RagUniOfficial" target="_blank" rel="noopener noreferrer" aria-label="X">X</a></div></div>
        </footer>
      </section>
      </div>

      {libraryOpen && <div className="react-home-modal" role="dialog" aria-modal="true" aria-labelledby="library-coming-soon-title"><button aria-label="Close" className="react-home-modal__backdrop" onClick={() => setLibraryOpen(false)} /><div className="react-home-modal__card"><button type="button" className="react-home-modal__close" onClick={() => setLibraryOpen(false)} aria-label="Close">×</button><p>RUNE-MIDGARTS LIBRARY</p><h2 id="library-coming-soon-title">WE&apos;RE GETTING READY!</h2><span>Rune-Midgarts Library is coming soon. Please check back for more information.</span><button type="button" onClick={() => setLibraryOpen(false)}>CONFIRM</button></div></div>}
      {selectedScreenshot !== null && <div className="react-home-gallery-modal" role="dialog" aria-modal="true" aria-label={`Screenshot ${selectedScreenshot + 1} of ${MEDIA_SCREENSHOTS.length}`}><button type="button" className="react-home-gallery-modal__backdrop" onClick={() => setSelectedScreenshot(null)} aria-label="Close screenshot" /><div className="react-home-gallery-modal__card"><button type="button" className="react-home-gallery-modal__close" onClick={() => setSelectedScreenshot(null)} aria-label="Close screenshot">×</button><button type="button" className="react-home-gallery-modal__nav react-home-gallery-modal__nav--previous" onClick={() => setSelectedScreenshot((selectedScreenshot + MEDIA_SCREENSHOTS.length - 1) % MEDIA_SCREENSHOTS.length)} aria-label="Previous screenshot"><ChevronLeft /></button><img src={MEDIA_SCREENSHOTS[selectedScreenshot].image} alt={MEDIA_SCREENSHOTS[selectedScreenshot].title} /><button type="button" className="react-home-gallery-modal__nav react-home-gallery-modal__nav--next" onClick={() => setSelectedScreenshot((selectedScreenshot + 1) % MEDIA_SCREENSHOTS.length)} aria-label="Next screenshot"><ChevronRight /></button><p>{selectedScreenshot + 1} / {MEDIA_SCREENSHOTS.length} · {MEDIA_SCREENSHOTS[selectedScreenshot].title}</p></div></div>}
    </main>
  );
}
