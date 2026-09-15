import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const NEWS_ITEMS = [
  { title: "Ragnarok Online: Patch Update June 17, 2026", copy: "The latest game updates and community announcements from Ragnarok Universe.", image: "/manus-storage/RO1_pathupdate_17062026_f83f13b8_0ccbefaa.jpg", date: "JUN 17, 2026", tag: "UPDATE" },
  { title: "Ragnarok Online: Patch Update June 10, 2026", copy: "Discover the newest event information and content updates from Midgard.", image: "/manus-storage/RO_PatchUpdate_10062026_219a465c_5903482d.jpg", date: "JUN 17, 2026", tag: "EVENT" },
  { title: "Ragnarok Online: Patch Update June 4, 2026", copy: "Keep up with the latest Ragnarok Universe news and event updates.", image: "/manus-storage/RO_PatchUpdate_04062026-1_29153260_878bf95f.jpg", date: "JUN 17, 2026", tag: "EVENT" },
  { title: "Ragnarok Online: Patch Update May 27, 2026", copy: "Read the newest interviews, patch notes, and community announcements.", image: "/manus-storage/RO_PatchUpdate_27052026_953943aa_fa54354f.webp", date: "MAY 28, 2026", tag: "INTERVIEW" },
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
  const heroTitleLines = (currentHero.heroTitle || "MIDGARD RUNS\nIN YOUR BROWSER").split(/\r?\n/).filter(Boolean).slice(0, 2);
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
    const root = document.documentElement;
    const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-snap-panel]"));
    let wheelLocked = false;
    let touchLocked = false;
    let touchStartX: number | null = null;
    let touchStartY: number | null = null;
    let touchStartPanelIndex: number | null = null;

    const isMobilePanelViewport = () => window.matchMedia("(max-width: 760px)").matches;
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
      panels[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };
    const handleWheel = (event: WheelEvent) => {
      if (wheelLocked || Math.abs(event.deltaY) < 8 || event.ctrlKey) return;

      if (!movePanel(event.deltaY > 0 ? 1 : -1)) return;

      event.preventDefault();
      wheelLocked = true;
      window.setTimeout(() => { wheelLocked = false; }, 680);
    };
    const handleTouchStart = (event: TouchEvent) => {
      if (!isMobilePanelViewport()) return;
      const touch = event.touches[0];
      touchStartX = touch?.clientX ?? null;
      touchStartY = touch?.clientY ?? null;
      touchStartPanelIndex = getCurrentPanelIndex();
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
      if (Math.abs(verticalTravel) < 36 || Math.abs(verticalTravel) <= horizontalTravel) return;
      if (!movePanel(verticalTravel > 0 ? -1 : 1, startingPanelIndex ?? getCurrentPanelIndex())) return;
      touchLocked = true;
      window.setTimeout(() => { touchLocked = false; }, 680);
    };

    root.classList.add("react-home-snap");
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      root.classList.remove("react-home-snap");
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
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
      <FloatingSocialLinks hidden={activeSection === "home"} />

      <div className="react-home-layout" aria-label="Homepage content regions">
      <div className="react-home-home-stage" data-snap-panel>
      <section id="home" data-home-section className="react-home-panel react-home-hero">
        <img className="react-home-hero__visual" src={currentHero.imageUrl} alt="" fetchPriority="high" />
        <div className="react-home-hero__shade" />
        <div className="react-home-hero__content">
          <div className="react-home-hero__tags"><span>{heroCategory}</span></div>
          <h1>{heroTitleLines.map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{heroDescription}</p>
          <a className="react-home-white-cta" href={heroActionUrl} target={heroActionOpensNewTab ? "_blank" : undefined} rel={heroActionOpensNewTab ? "noopener noreferrer" : undefined}>VIEW MORE <b>›</b></a>
        </div>
        <div className="react-home-hero__controls" aria-label="Hero banners">
          <button className="react-home-hero__arrow react-home-hero__arrow--left" type="button" aria-label="Previous banner" onClick={() => selectHero(-1)}><ChevronLeft /></button>
          <div className="react-home-hero__dots">{heroBanners.map((banner, index) => <button type="button" key={banner.id} aria-label={`Banner ${index + 1}: ${banner.title}`} aria-current={heroIndex % heroBanners.length === index} className={heroIndex % heroBanners.length === index ? "is-active" : ""} onClick={() => setHeroIndex(index)} />)}</div>
          <button className="react-home-hero__arrow react-home-hero__arrow--right" type="button" aria-label="Next banner" onClick={() => selectHero(1)}><ChevronRight /></button>
        </div>
      </section>

      <div className="react-home-hero-cta-row" aria-label="Hero Game Start"><GameStartButton className="home-game-start--hero-solo" /></div>
      </div>

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
            {NEWS_ITEMS.map((item, index) => <article className={`react-home-news-card${index === 3 ? " react-home-news-card--mobile-extra" : ""}`} key={item.title}><img src={item.image} alt="" loading="lazy" /><div><div className="react-home-news-card__meta"><span>{item.tag}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.copy}</p><button type="button" onClick={() => setLibraryOpen(true)}>READ MORE <b>›</b></button></div></article>)}
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
          <div className="react-home-media__gallery" aria-label="Ragnarok Universe screenshots">
            <div className="react-home-media__gallery-label"><span>SCREENSHOTS</span><span>DRAG TO EXPLORE</span></div>
            <div ref={screenshotStripRef} className="react-home-media__strip" onScroll={syncScreenshotScroll}>
              {MEDIA_SCREENSHOTS.map((screenshot, index) => (
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
          </div>
        </div>
      </section>

      <section className="react-home-panel react-home-final-panel" data-home-section data-snap-panel aria-label="Ragnarok Universe closing call to action and footer">
        <div className="react-home-closing"><div className="react-home-closing__content"><span>YOUR STORY BEGINS HERE</span><h2>TWO CLICKS TO<br />MIDGARD</h2><p>Start the game in your browser, then join the Discord to find a party, get patch news first and take part in founder events.</p><HomeCtaPair /></div></div>
      <footer className="react-home-footer" aria-label="Ragnarok Universe footer">
        <div className="react-home-footer__inner"><div><div className="react-home-footer__brands">GRAVITY <i /> WEMADE CONNECT <i /> GALA</div><nav><a href="/">Terms of Service</a><a href="/">Privacy Policy</a><a href="/">Privacy Settings</a><a href="/">Customer Support</a></nav><img src="/manus-storage/gravity_logo_light_c14f48f8_5e3a7c41.png" alt="GRAVITY" loading="lazy" /><p><span>Copyright © Gravity Co., LTD &amp; Lee MyoungJin(studio DTDS). All Rights Reserved.</span><span>All trademarks used on this website are the property of their respective owners.</span></p></div><div className="react-home-footer__social"><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" aria-label="Discord"><img src="/manus-storage/Discord_icon_230fdb89_6026051e.png" alt="" /></a><a href="https://facebook.com/RagnarokUniverseEN" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><img src="/manus-storage/facebook-logo-primary_2867583f.webp" alt="" /></a><a href="https://www.youtube.com/@RagnarokUniverse" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg></a><a href="https://x.com/RagUniOfficial" target="_blank" rel="noopener noreferrer" aria-label="X" className="react-home-footer__social-x"><img src="/manus-storage/x-logo-black_193d8b29.webp" alt="" /></a></div></div>
      </footer>
      </section>
      </div>

      {libraryOpen && <div className="react-home-modal" role="dialog" aria-modal="true" aria-labelledby="library-coming-soon-title"><button aria-label="Close" className="react-home-modal__backdrop" onClick={() => setLibraryOpen(false)} /><div className="react-home-modal__card"><button type="button" className="react-home-modal__close" onClick={() => setLibraryOpen(false)} aria-label="Close">×</button><p>RUNE-MIDGARTS LIBRARY</p><h2 id="library-coming-soon-title">WE&apos;RE GETTING READY!</h2><span>Rune-Midgarts Library is coming soon. Please check back for more information.</span><button type="button" onClick={() => setLibraryOpen(false)}>CONFIRM</button></div></div>}
      {selectedScreenshot !== null && <div className="react-home-gallery-modal" role="dialog" aria-modal="true" aria-label={`Screenshot ${selectedScreenshot + 1} of ${MEDIA_SCREENSHOTS.length}`}><button type="button" className="react-home-gallery-modal__backdrop" onClick={() => setSelectedScreenshot(null)} aria-label="Close screenshot" /><div className="react-home-gallery-modal__card"><button type="button" className="react-home-gallery-modal__close" onClick={() => setSelectedScreenshot(null)} aria-label="Close screenshot">×</button><button type="button" className="react-home-gallery-modal__nav react-home-gallery-modal__nav--previous" onClick={() => setSelectedScreenshot((selectedScreenshot + MEDIA_SCREENSHOTS.length - 1) % MEDIA_SCREENSHOTS.length)} aria-label="Previous screenshot"><ChevronLeft /></button><img src={MEDIA_SCREENSHOTS[selectedScreenshot].image} alt={MEDIA_SCREENSHOTS[selectedScreenshot].title} /><button type="button" className="react-home-gallery-modal__nav react-home-gallery-modal__nav--next" onClick={() => setSelectedScreenshot((selectedScreenshot + 1) % MEDIA_SCREENSHOTS.length)} aria-label="Next screenshot"><ChevronRight /></button></div></div>}
    </main>
  );
}
