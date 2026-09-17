import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import FloatingSocialLinks from "@/components/FloatingSocialLinks";
import HomeHeader, { DiscordButton, GameStartButton } from "@/components/HomeHeader";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import "./reference-home.css";
import "./media-strip.css";

const HERO_DESKTOP_URL = "/manus-storage/eb185c22e6e1_e39bfa40.png";
const DISCORD_URL = "https://discord.gg/yVWJkWdkAU";

const DEFAULT_HERO_BANNERS = [
  { id: "default", title: "Midgard runs in your browser", imageUrl: HERO_DESKTOP_URL, heroCategory: "UPDATE", heroTitle: "MIDGARD RUNS\nIN YOUR BROWSER", heroDescription: "No download, no install, no launcher. Open a tab on your phone or PC and begin your adventure.", actionType: "content", actionUrl: "/news" },
] as const;

const NEWS_PLACEHOLDER_IMAGE = "/manus-storage/ragnarok-news-default-banner_0d5427e8.png";

function formatHomeNewsDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", month: "short", day: "2-digit", year: "numeric" })
    .format(new Date(value))
    .toUpperCase();
}

function getYoutubeEmbedUrl(youtubeUrl: string) {
  const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?/\s]+)/);
  return match?.[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
}

function HomeCtaPair({ className = "" }: { className?: string }) {
  return <div className={`home-cta-pair ${className}`.trim()}><DiscordButton /><GameStartButton /></div>;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [heroIndex, setHeroIndex] = useState(0);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);
  const [screenshotScroll, setScreenshotScroll] = useState(0);
  const [screenshotViewport, setScreenshotViewport] = useState(25);
  const screenshotStripRef = useRef<HTMLDivElement | null>(null);
  const { data: managedBanners } = trpc.banner.list.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  const heroBanners = managedBanners?.length ? managedBanners : DEFAULT_HERO_BANNERS;
  const currentHero = heroBanners[heroIndex % heroBanners.length];
  const requestedHeroTitle = "MIDGARD RUNS IN YOUR BROWSER";
  const rawHeroTitle = currentHero.heroTitle || "MIDGARD RUNS\nIN YOUR BROWSER";
  const suppliedHeroTitleLines = rawHeroTitle.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 2);
  const heroTitleLines = rawHeroTitle.replace(/\s+/g, " ").trim().toUpperCase() === requestedHeroTitle
    ? [requestedHeroTitle]
    : suppliedHeroTitleLines;
  const heroDescription = currentHero.heroDescription || "No download, no install, no launcher. Open a tab on your phone or PC and begin your adventure.";
  const heroCategory = currentHero.heroCategory || "UPDATE";
  const heroActionUrl = currentHero.actionUrl || "/news";
  const heroActionOpensNewTab = currentHero.actionType === "url" && /^https?:\/\//i.test(heroActionUrl);
  const { data: managedVideos } = trpc.publicMedia.list.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  const featuredVideo = managedVideos?.[0];
  const featuredVideoEmbedUrl = featuredVideo ? getYoutubeEmbedUrl(featuredVideo.youtubeUrl) : null;
  const { data: managedScreenshots } = trpc.publicScreenshots.list.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  const mediaScreenshots = managedScreenshots?.map((screenshot) => ({ title: screenshot.title, image: screenshot.imageUrl })) ?? [];
  const { data: managedNews, isLoading: isNewsLoading } = trpc.publicNews.home.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
  const homeNews = managedNews ?? [];

  const navigateTo = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-home-section]"));
    const syncActiveSection = () => {
      const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--react-home-header-height")) || 0;
      const activationLine = headerHeight + 8;
      let currentSection = sections[0];

      for (const section of sections) {
        const { top, bottom } = section.getBoundingClientRect();
        if (top <= activationLine && bottom > activationLine) {
          currentSection = section;
          break;
        }
        if (top > activationLine) break;
        currentSection = section;
      }

      if (currentSection?.id) setActiveSection(currentSection.id);
    };

    const observer = new IntersectionObserver(syncActiveSection, { threshold: [0, 0.01, 1] });
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", syncActiveSection, { passive: true });
    window.addEventListener("resize", syncActiveSection);
    syncActiveSection();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncActiveSection);
      window.removeEventListener("resize", syncActiveSection);
    };
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
      if (event.key === "ArrowLeft") setSelectedScreenshot((current) => current === null ? current : (current + mediaScreenshots.length - 1) % mediaScreenshots.length);
      if (event.key === "ArrowRight") setSelectedScreenshot((current) => current === null ? current : (current + 1) % mediaScreenshots.length);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedScreenshot, mediaScreenshots.length]);

  useEffect(() => {
    const root = document.documentElement;
    const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-snap-panel]"));
    let wheelLocked = false;
    let pendingWheelDelta = 0;
    let touchLocked = false;
    let transitionTimer: number | undefined;
    let touchStartX: number | null = null;
    let touchStartY: number | null = null;
    let touchStartPanelIndex: number | null = null;

    const isMobilePanelViewport = () => window.matchMedia("(max-width: 760px)").matches;
    const isDesktopPanelViewport = () => window.matchMedia("(min-width: 761px)").matches;
    const getPanelScrollTop = (panel: HTMLElement) => {
      const headerHeight = Number.parseFloat(getComputedStyle(root).getPropertyValue("--react-home-header-height")) || 0;
      return Math.max(0, Math.round(window.scrollY + panel.getBoundingClientRect().top - headerHeight));
    };
    const releaseTransitionLock = () => {
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => {
        wheelLocked = false;
        touchLocked = false;
      }, 760);
    };
    const getCurrentPanelIndex = () => {
      const headerHeight = Number.parseFloat(getComputedStyle(root).getPropertyValue("--react-home-header-height")) || 0;
      return panels.reduce((nearestIndex, panel, index) => {
        const nearestDistance = Math.abs(panels[nearestIndex].getBoundingClientRect().top - headerHeight);
        const panelDistance = Math.abs(panel.getBoundingClientRect().top - headerHeight);
        return panelDistance < nearestDistance ? index : nearestIndex;
      }, 0);
    };
    const movePanel = (direction: -1 | 1, startingIndex = getCurrentPanelIndex()) => {
      const currentIndex = startingIndex;
      const nextIndex = Math.max(0, Math.min(panels.length - 1, currentIndex + direction));
      if (nextIndex === currentIndex) return false;
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      window.scrollTo({ top: getPanelScrollTop(panels[nextIndex]), behavior });
      return true;
    };
    const handleWheel = (event: WheelEvent) => {
      if (!isDesktopPanelViewport() || event.ctrlKey) return;
      event.preventDefault();
      if (wheelLocked) return;

      pendingWheelDelta += event.deltaY;
      if (Math.abs(pendingWheelDelta) < 12) return;

      const direction = pendingWheelDelta > 0 ? 1 : -1;
      pendingWheelDelta = 0;
      if (!movePanel(direction)) return;

      wheelLocked = true;
      releaseTransitionLock();
    };
    const handleTouchStart = (event: TouchEvent) => {
      if (!isMobilePanelViewport()) return;
      const touch = event.touches[0];
      touchStartX = touch?.clientX ?? null;
      touchStartY = touch?.clientY ?? null;
      touchStartPanelIndex = getCurrentPanelIndex();
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (!isMobilePanelViewport() || touchStartX === null || touchStartY === null) return;
      const touch = event.touches[0];
      const horizontalTravel = Math.abs((touch?.clientX ?? touchStartX) - touchStartX);
      const verticalTravel = Math.abs((touch?.clientY ?? touchStartY) - touchStartY);
      if (verticalTravel > 8 && verticalTravel > horizontalTravel) event.preventDefault();
    };
    const handleTouchEnd = (event: TouchEvent) => {
      if (!isMobilePanelViewport() || touchLocked || touchStartX === null || touchStartY === null) return;
      const touch = event.changedTouches[0];
      const horizontalTravel = Math.abs((touch?.clientX ?? touchStartX) - touchStartX);
      const verticalTravel = (touch?.clientY ?? touchStartY) - touchStartY;
      touchStartX = null;
      touchStartY = null;
      const startingPanelIndex = touchStartPanelIndex;
      touchStartPanelIndex = null;
      if (Math.abs(verticalTravel) < 48 || Math.abs(verticalTravel) <= horizontalTravel) return;
      if (!movePanel(verticalTravel > 0 ? -1 : 1, startingPanelIndex ?? getCurrentPanelIndex())) return;
      touchLocked = true;
      releaseTransitionLock();
    };

    root.classList.add("react-home-snap");
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.clearTimeout(transitionTimer);
      root.classList.remove("react-home-snap");
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const selectHero = (direction: -1 | 1) => setHeroIndex((current) => (current + direction + heroBanners.length) % heroBanners.length);
  const syncScreenshotScroll = () => {
    const strip = screenshotStripRef.current;
    if (!strip) return;
    const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
    setScreenshotScroll(maxScroll === 0 ? 0 : (strip.scrollLeft / maxScroll) * 100);
    setScreenshotViewport(strip.scrollWidth === 0 ? 100 : Math.min(100, (strip.clientWidth / strip.scrollWidth) * 100));
  };
  const seekScreenshotStrip = (value: number) => {
    const strip = screenshotStripRef.current;
    if (!strip) return;
    const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
    strip.scrollTo({ left: (value / 100) * maxScroll, behavior: "smooth" });
  };
  const moveScreenshotStrip = (direction: -1 | 1) => {
    const strip = screenshotStripRef.current;
    if (!strip) return;
    strip.scrollBy({ left: direction * Math.max(180, strip.clientWidth * 0.86), behavior: "smooth" });
  };
  const screenshotWindowLeft = screenshotScroll * (100 - screenshotViewport) / 100;

  useEffect(() => {
    const strip = screenshotStripRef.current;
    if (!strip) return;
    const updateViewport = () => {
      const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
      setScreenshotScroll(maxScroll === 0 ? 0 : (strip.scrollLeft / maxScroll) * 100);
      setScreenshotViewport(strip.scrollWidth === 0 ? 100 : Math.min(100, (strip.clientWidth / strip.scrollWidth) * 100));
    };
    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="react-home" aria-label="Ragnarok Universe homepage">
      <HomeHeader activeSection={activeSection as "home" | "discord" | "news" | "game-info" | "media" | "shop"} onNavigate={navigateTo} />
      <FloatingSocialLinks />

      <div className="react-home-layout" aria-label="Homepage content regions">
      <div className="react-home-home-stage" data-snap-panel>
      <section id="home" data-home-section className="react-home-panel react-home-hero">
        <img className="react-home-hero__visual" src={currentHero.imageUrl} alt="" fetchPriority="high" />
        <div className="react-home-hero__shade" />
        <div className="react-home-hero__content">
          <div className="react-home-hero__tags"><span>{heroCategory}</span></div>
          <h1>{heroTitleLines.map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{heroDescription}</p>
          <a className="react-home-white-cta" href={heroActionUrl} target={heroActionOpensNewTab ? "_blank" : undefined} rel={heroActionOpensNewTab ? "noopener noreferrer" : undefined}><span>VIEW MORE</span><span className="react-home-white-cta__play" aria-hidden="true"><Play fill="currentColor" /></span></a>
        </div>
        <div className="react-home-hero__dots" aria-label="Hero banner position">{heroBanners.map((banner, index) => <button type="button" key={banner.id} aria-label={`Banner ${index + 1}: ${banner.title}`} aria-current={heroIndex % heroBanners.length === index} className={heroIndex % heroBanners.length === index ? "is-active" : ""} onClick={() => setHeroIndex(index)} />)}</div>
        <div className="react-home-hero__controls" aria-label="Hero banners">
          <button className="react-home-hero__arrow react-home-hero__arrow--left" type="button" aria-label="Previous banner" onClick={() => selectHero(-1)}><ChevronLeft /></button>
          <button className="react-home-hero__arrow react-home-hero__arrow--right" type="button" aria-label="Next banner" onClick={() => selectHero(1)}><ChevronRight /></button>
        </div>
      </section>

      </div>

      <div className="react-home-boundary-game-start" aria-label="Hero Game Start"><GameStartButton className="home-game-start--discord-hero" /></div>

      <section id="discord" data-home-section data-snap-panel className="react-home-panel react-home-discord">
        <div className="react-home-section-shell react-home-discord__shell">
          <div className="react-home-section-heading react-home-section-heading--light"><div><span>OFFICIAL COMMUNITY</span><h2>DISCORD</h2></div><p className="react-home-discord__description">Development news and community updates from the official Ragnarok Universe Discord.</p></div>
          <div className="react-home-widget" aria-label="Official Ragnarok Universe Discord channel browser">
            <iframe className="react-home-widget__frame" src="https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051" title="Ragnarok Universe official Discord channel browser" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            <a className="react-home-widget__invite-overlay" href="https://discord.com/invite/yVWJkWdkAU" target="_blank" rel="noopener noreferrer" aria-label="Open the official Ragnarok Universe Discord invite to sign in or send a message"><span className="sr-only">Sign in or send a message in the official Ragnarok Universe Discord</span></a>
          </div>
        </div>
      </section>

      <section id="news" data-home-section data-snap-panel className="react-home-panel react-home-news">
        <div className="react-home-section-shell">
          <div className="react-home-section-heading"><div><span>NEWS &amp; NOTICE</span><h2>LATEST FROM MIDGARD</h2></div><Link href="/news" className="react-home-outline-cta react-home-news-more" aria-label="View more news">+</Link></div>
          <div className="react-home-news-grid">
            {isNewsLoading ? Array.from({ length: 4 }, (_, index) => <div className={`react-home-news-card animate-pulse${index === 3 ? " react-home-news-card--mobile-extra" : ""}`} key={index} aria-label="Loading news"><div className="min-h-40 bg-slate-200/70" /><div className="space-y-3 p-4"><div className="h-3 w-1/3 rounded bg-slate-200" /><div className="h-5 rounded bg-slate-200" /><div className="h-3 rounded bg-slate-200" /></div></div>) : homeNews.length > 0 ? homeNews.map((item, index) => <Link href={`/news/${item.id}`} aria-label={`Read ${item.title}`} className={`react-home-news-card${index === 3 ? " react-home-news-card--mobile-extra" : ""}`} key={item.id}><img src={item.imageUrl || NEWS_PLACEHOLDER_IMAGE} alt="" loading="lazy" /><div><div className="react-home-news-card__meta"><span>{item.category.toUpperCase()}</span><time>{formatHomeNewsDate(item.publishedAt)}</time></div><h3>{item.title}</h3><p>{item.summary || item.content?.split(/\n\s*\n/)[0] || ""}</p><span className="react-home-news-card__link">READ MORE <b>›</b></span></div></Link>) : <p className="react-home-news-empty col-span-full py-10 text-center">No news is currently published.</p>}
          </div>
        </div>
      </section>

      <section id="game-info" data-home-section data-snap-panel className="react-home-panel react-home-game-info">
        <div className="react-home-section-shell react-home-game-info__grid">
          <div className="react-home-game-info__copy"><span>ABOUT RAGNAROK UNIVERSE</span><h2>CLASSIC ADVENTURE<br />A NEW WAY TO PLAY</h2><p>Experience the legendary fantasy MMORPG directly in your web browser. Explore a familiar world, meet a growing community, and help shape the next chapter.</p><div className="react-home-game-info__facts" aria-label="Ragnarok Universe game information"><div><span>PLATFORM</span><strong>Web Browser</strong></div><div><span>GENRE</span><strong>Fantasy MMORPG</strong></div><div><span>STATUS</span><strong>Beta Testing</strong></div><div><span>ACCESS</span><strong>No Download</strong></div></div><button type="button" className="react-home-outline-cta" onClick={() => setLibraryOpen(true)}>RUNE-MIDGARTS LIBRARY <b>›</b></button></div>
          <div className="react-home-game-info__art"><div className="react-home-game-info__art-paper"><img src="/manus-storage/main2_0c694426_d1284510.png" alt="Ragnarok Universe gameplay" loading="eager" /></div></div>
        </div>
      </section>

      <section id="media" data-home-section data-snap-panel className="react-home-panel react-home-media">
        <div className="react-home-section-shell">
          <div className="react-home-section-heading react-home-section-heading--light"><div><span>SEE THE WORLD IN MOTION</span><h2>MEDIA</h2></div></div>
          <div className="react-home-media__feature">
            {featuredVideoEmbedUrl ? (
              <iframe src={featuredVideoEmbedUrl} title={featuredVideo?.title ?? "Ragnarok Universe video"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            ) : (
              <div className="react-home-media__feature-fallback"><img src="/manus-storage/main2_0c694426_d1284510.png" alt="Ragnarok Universe gameplay" loading="lazy" /><span>NO ACTIVE VIDEO REGISTERED</span></div>
            )}
          </div>
          {mediaScreenshots.length > 0 && <div className="react-home-media__gallery" aria-label="Ragnarok Universe screenshots">
            <div className="react-home-media__gallery-label"><span>SCREENSHOTS</span></div>
            <div ref={screenshotStripRef} className="react-home-media__strip" onScroll={syncScreenshotScroll}>
              {mediaScreenshots.map((screenshot, index) => (
                <button type="button" key={screenshot.image} className="react-home-media__thumbnail" onClick={() => setSelectedScreenshot(index)} aria-label={`View screenshot ${index + 1}: ${screenshot.title}`}>
                  <img src={screenshot.image} alt={screenshot.title} loading={index < 6 ? "eager" : "lazy"} />
                  <span>VIEW FULLSCREEN</span>
                </button>
              ))}
            </div>
            <div className="react-home-media__scrollbar" aria-label="Screenshot strip position">
              <button type="button" className="react-home-media__scroll-arrow" onClick={() => moveScreenshotStrip(-1)} disabled={screenshotScroll <= 0.5} aria-label="Previous screenshots"><ChevronLeft /></button>
              <div className="react-home-media__position-track">
                <span className="react-home-media__position-window" style={{ width: `${screenshotViewport}%`, left: `${screenshotWindowLeft}%` }} aria-hidden="true" />
                <input className="react-home-media__position-input" type="range" min="0" max="100" step="1" value={screenshotScroll} onChange={(event) => seekScreenshotStrip(Number(event.target.value))} aria-label="Browse screenshots" />
              </div>
              <button type="button" className="react-home-media__scroll-arrow" onClick={() => moveScreenshotStrip(1)} disabled={screenshotScroll >= 99.5} aria-label="Next screenshots"><ChevronRight /></button>
            </div>
          </div>}
        </div>
      </section>

      <section className="react-home-panel react-home-closing-panel" data-home-section data-snap-panel aria-label="Ragnarok Universe closing call to action">
        <div className="react-home-closing"><div className="react-home-closing__content"><span>YOUR STORY BEGINS HERE</span><h2>TWO CLICKS TO<br />MIDGARD</h2><p>Start the game in your browser, then join the Discord to find a party, get patch news first and take part in founder events.</p><HomeCtaPair /></div></div>
      </section>
      <footer className="react-home-footer" data-snap-panel aria-label="Ragnarok Universe footer">
        <div className="react-home-footer__inner"><div><div className="react-home-footer__brands">GRAVITY <i /> WEMADE CONNECT <i /> GALA</div><nav><a href="/">Terms of Service</a><a href="/">Privacy Policy</a><a href="/">Privacy Settings</a><a href="/">Customer Support</a></nav><img src="/manus-storage/rou-gravity-logo-white_c5669483.png" alt="GRAVITY" loading="lazy" /><p><span>Copyright © Gravity Co., LTD &amp; Lee MyoungJin(studio DTDS). All Rights Reserved.</span><span>All trademarks used on this website are the property of their respective owners.</span></p></div><div className="react-home-footer__social"><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" aria-label="Discord"><img src="/manus-storage/Discord_icon_230fdb89_6026051e.png" alt="" /></a><a href="https://facebook.com/RagnarokUniverseEN" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><img src="/manus-storage/facebook-logo-primary_2867583f.webp" alt="" /></a><a href="https://www.youtube.com/@RagnarokUniverse" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg></a><a href="https://x.com/RagUniOfficial" target="_blank" rel="noopener noreferrer" aria-label="X" className="react-home-footer__social-x"><img src="/manus-storage/x-logo-black_193d8b29.webp" alt="" /></a></div></div>
      </footer>
      </div>

      {libraryOpen && <div className="react-home-modal" role="dialog" aria-modal="true" aria-labelledby="library-coming-soon-title"><button aria-label="Close" className="react-home-modal__backdrop" onClick={() => setLibraryOpen(false)} /><div className="react-home-modal__card"><button type="button" className="react-home-modal__close" onClick={() => setLibraryOpen(false)} aria-label="Close">×</button><p>RUNE-MIDGARTS LIBRARY</p><h2 id="library-coming-soon-title">WE&apos;RE GETTING READY!</h2><span>Rune-Midgarts Library is coming soon. Please check back for more information.</span><button type="button" onClick={() => setLibraryOpen(false)}>CONFIRM</button></div></div>}
      {selectedScreenshot !== null && <div className="react-home-gallery-modal" role="dialog" aria-modal="true" aria-label={`Screenshot ${selectedScreenshot + 1} of ${mediaScreenshots.length}`}><button type="button" className="react-home-gallery-modal__backdrop" onClick={() => setSelectedScreenshot(null)} aria-label="Close screenshot" /><div className="react-home-gallery-modal__card"><button type="button" className="react-home-gallery-modal__close" onClick={() => setSelectedScreenshot(null)} aria-label="Close screenshot">×</button><button type="button" className="react-home-gallery-modal__nav react-home-gallery-modal__nav--previous" onClick={() => setSelectedScreenshot((selectedScreenshot + mediaScreenshots.length - 1) % mediaScreenshots.length)} aria-label="Previous screenshot"><ChevronLeft /></button><img src={mediaScreenshots[selectedScreenshot].image} alt={mediaScreenshots[selectedScreenshot].title} /><button type="button" className="react-home-gallery-modal__nav react-home-gallery-modal__nav--next" onClick={() => setSelectedScreenshot((selectedScreenshot + 1) % mediaScreenshots.length)} aria-label="Next screenshot"><ChevronRight /></button></div></div>}
    </main>
  );
}
