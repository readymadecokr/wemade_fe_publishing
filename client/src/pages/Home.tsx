import { ChevronLeft, ChevronRight, ExternalLink, Pause, Play, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import SignInPanel from "@/components/SignInPanel";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import "./reference-home.css";

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? "";
const DISCORD_URL = "https://discord.gg/yVWJkWdkAU";

const fallbackBanners = [
  {
    id: 1,
    imageUrl: `${ASSET_BASE_URL}/manus-storage/mainbanner_01_new_1c67868c.jpg`,
    title: "MIDGARD RUNS IN YOUR BROWSER",
    actionUrl: DISCORD_URL,
    actionType: "url" as const,
    contentTitle: null,
    contentDate: null,
    contentBody: null,
    eyebrow: "OPEN BETA · PLAY IN YOUR BROWSER",
    description: "No download, no install, no launcher. Open a tab on your phone or PC and begin your adventure.",
    actionLabel: "EXPLORE THE BETA",
  },
  {
    id: 2,
    imageUrl: `${ASSET_BASE_URL}/manus-storage/mainbanner_02_e759d77c.jpg`,
    title: "A NEW CHAPTER AWAITS",
    actionUrl: "/game-info",
    actionType: "url" as const,
    contentTitle: null,
    contentDate: null,
    contentBody: null,
    eyebrow: "RAGNAROK UNIVERSE",
    description: "Meet a familiar world, shape a new story, and play directly from your browser.",
    actionLabel: "EXPLORE GAME INFO",
  },
];

const screenshots = [
  "https://raguniverse-izcifhmz.manus.space/manus-storage/main2_0c694426_d1284510.png",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281494281_bb3eae6d.webp",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281479124_091e48a2.webp",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281449016_eb9de628.jpg",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/main2_0c694426_d1284510.png",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281494281_bb3eae6d.webp",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281479124_091e48a2.webp",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281449016_eb9de628.jpg",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/main2_0c694426_d1284510.png",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281494281_bb3eae6d.webp",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281479124_091e48a2.webp",
  "https://raguniverse-izcifhmz.manus.space/manus-storage/banners/news-img-1787281449016_eb9de628.jpg",
] as const;

const fallbackNews = [
  { id: 1, category: "NOTICE", title: "Ragnarok Universe Beta Roadmap", summary: "A look at the next testing phase, planned improvements, and the road ahead.", publishedAt: "2026-08-21T09:00:00.000Z", imageUrl: screenshots[1] },
  { id: 2, category: "EVENT", title: "Discord Founders Event Now Open", summary: "Meet fellow adventurers and take part in the first founders mission.", publishedAt: "2026-08-21T09:00:00.000Z", imageUrl: screenshots[2] },
  { id: 3, category: "NEWS", title: "Welcome to a New Era of Midgard", summary: "Discover the vision behind a browser-based return to Ragnarok.", publishedAt: "2026-08-21T09:00:00.000Z", imageUrl: screenshots[3] },
];

const communityChannels = ["Announcements", "Dev Message", "Patch Notes", "Early Preview"];

export default function Home() {
  const { data: dbBanners } = trpc.banner.list.useQuery(undefined, { retry: false });
  const { data: dbNews } = trpc.publicNews.list.useQuery(undefined, { retry: false });
  const [bannerIndex, setBannerIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const banners = useMemo(() => {
    const source = dbBanners && dbBanners.length > 0 ? dbBanners : fallbackBanners;
    return source.map((banner, index) => ({
      id: banner.id,
      imageUrl: banner.imageUrl,
      title: banner.contentTitle || banner.title || fallbackBanners[index % fallbackBanners.length].title,
      actionUrl: banner.actionUrl || fallbackBanners[index % fallbackBanners.length].actionUrl,
      eyebrow: banner.contentDate || fallbackBanners[index % fallbackBanners.length].eyebrow,
      description: banner.contentBody || fallbackBanners[index % fallbackBanners.length].description,
      actionLabel: banner.actionType === "content" ? "VIEW DETAILS" : fallbackBanners[index % fallbackBanners.length].actionLabel,
    }));
  }, [dbBanners]);

  const activeBanner = banners[bannerIndex] ?? banners[0];
  const newsItems = useMemo(() => {
    if (!dbNews || dbNews.length === 0) return fallbackNews;
    return dbNews.slice(0, 3).map((item) => ({
      id: item.id,
      category: "NEWS",
      title: item.title,
      summary: "Read the latest official Ragnarok Universe update.",
      publishedAt: item.publishedAt,
      imageUrl: item.imageUrl || screenshots[0],
    }));
  }, [dbNews]);

  useEffect(() => {
    if (bannerIndex >= banners.length) setBannerIndex(0);
  }, [bannerIndex, banners.length]);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const interval = window.setInterval(() => setBannerIndex((current) => (current + 1) % banners.length), 5500);
    return () => window.clearInterval(interval);
  }, [banners.length, paused]);

  useEffect(() => {
    const sectionIds = ["game-start", "discord-community", "news", "game-info", "media", "site-footer"];
    let wheelLocked = false;
    let unlockTimer = 0;

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 900 || Math.abs(event.deltaY) < 10) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("iframe, [data-allow-native-scroll], [role=dialog]")) return;
      const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
      if (sections.length === 0) return;
      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => { wheelLocked = false; }, 240);

      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 106;
      const activeIndex = sections.reduce((closest, section, index) => (
        Math.abs(section.getBoundingClientRect().top - headerHeight) < Math.abs(sections[closest].getBoundingClientRect().top - headerHeight) ? index : closest
      ), 0);
      const direction = event.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(sections.length - 1, activeIndex + direction));
      sections[next].scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(unlockTimer);
    };
  }, []);

  const openBannerAction = () => {
    if (!activeBanner?.actionUrl) return;
    if (activeBanner.actionUrl.startsWith("http")) {
      window.open(activeBanner.actionUrl, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = activeBanner.actionUrl;
  };

  const handleGameStart = () => {
    if (localStorage.getItem("rou_logged_in") === "true") {
      window.open(DISCORD_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setShowSignInDialog(true);
  };

  const previousBanner = () => setBannerIndex((current) => (current - 1 + banners.length) % banners.length);
  const nextBanner = () => setBannerIndex((current) => (current + 1) % banners.length);

  return (
    <Layout>
      <div className="reference-home">
        <section id="game-start" className="reference-panel reference-hero-panel">
          <div className="reference-hero-stage">
            {activeBanner && <img src={activeBanner.imageUrl} alt={activeBanner.title} className="reference-hero-image" />}
            <div className="reference-hero-shade" />
            <div className="reference-home-container reference-hero-content">
              <div className="reference-hero-copy">
                <p className="reference-hero-eyebrow">{activeBanner?.eyebrow}</p>
                <h1>{activeBanner?.title}</h1>
                <p>{activeBanner?.description}</p>
                <button type="button" onClick={openBannerAction} className="reference-light-cta">{activeBanner?.actionLabel} <ChevronRight size={15} aria-hidden="true" /></button>
              </div>
            </div>
            <div className="reference-home-container reference-hero-controls" aria-label="Banner controls">
              <div className="reference-banner-tabs">
                {banners.slice(0, 3).map((banner, index) => <button type="button" key={banner.id} className={index === bannerIndex ? "is-active" : ""} onClick={() => setBannerIndex(index)}><b>{String(index + 1).padStart(2, "0")}</b><span>{index === 0 ? "OPEN BETA S2" : index === 1 ? "FOUNDERS EVENT" : "WAR OF EMPERIUM"}</span></button>)}
              </div>
              <div className="reference-banner-arrows">
                <button type="button" onClick={previousBanner} aria-label="Previous banner"><ChevronLeft size={17} /></button>
                <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume banner" : "Pause banner"}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
                <button type="button" onClick={nextBanner} aria-label="Next banner"><ChevronRight size={17} /></button>
              </div>
            </div>
          </div>
          <div className="reference-hero-cta-rail">
            <button type="button" onClick={handleGameStart} className="reference-game-start"><img src={`${ASSET_BASE_URL}/manus-storage/gamestart_BTN2_cdf3e7b7.png`} alt="Game Start" /></button>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="reference-discord-cta">● <strong>JOIN DISCORD</strong><small>Official community</small><ChevronRight size={17} aria-hidden="true" /></a>
            <p><span>✓ Free to play</span><span>✓ No download, runs in your browser</span><span>✓ Works on low-spec phones</span><span>✓ Chrome · Safari · Edge</span></p>
          </div>
        </section>

        <section id="discord-community" className="reference-panel reference-discord-panel">
          <div className="reference-home-container reference-community-wrap">
            <div className="reference-section-heading reference-section-heading--light">
              <div><span>OFFICIAL COMMUNITY</span><h2>Discord</h2></div>
              <p>Development news and community updates from the official Ragnarok Universe Discord.</p>
            </div>
            <div className="reference-community-card">
              <aside>
                <div className="reference-community-brand"><span>●</span><strong>Ragnarok Universe</strong><small>Official Discord</small></div>
                <div className="reference-community-channels">{communityChannels.map((channel, index) => <button key={channel} type="button" onClick={() => setSelectedChannel(index)} className={selectedChannel === index ? "is-active" : ""}># {channel}</button>)}</div>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="reference-community-join">Join Discord <ChevronRight size={14} /></a>
              </aside>
              <div className="reference-community-feed">
                <img src={`${ASSET_BASE_URL}/manus-storage/mainbanner_01_new_1c67868c.jpg`} alt="Ragnarok Universe Discord community" />
                <article>
                  <div className="reference-post-meta"><span>R</span><b>Ragnarok Universe</b><em>OFFICIAL</em><time>AUG 26, 2026</time></div>
                  <small>OFFICIAL ANNOUNCEMENT</small>
                  <h3>{selectedChannel === 0 ? "Developer Note #1 is Here" : `${communityChannels[selectedChannel]} Update`}</h3>
                  <p>Read the latest note covering the current direction, improvements based on player feedback, and what comes next.</p>
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Continue on Discord <ChevronRight size={13} /></a>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="news" className="reference-panel reference-news-panel">
          <div className="reference-home-container reference-news-wrap">
            <div className="reference-section-heading"><div><span>NEWS AND NOTICE</span><h2>Latest from Midgard</h2></div><Link href="/news" className="reference-plus-link" aria-label="View all news">+</Link></div>
            <div className="reference-news-grid">{newsItems.map((item) => <Link href={`/news/${item.id}`} key={item.id} className="reference-news-card"><img src={item.imageUrl} alt="" /><div><div className="reference-news-meta"><span>PINNED</span><b>{item.category}</b><time>{new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}</time></div><h3>{item.title}</h3><p>{item.summary}</p><i>Read more <ChevronRight size={14} /></i></div></Link>)}</div>
          </div>
        </section>

        <section id="game-info" className="reference-panel reference-game-info-panel">
          <div className="reference-home-container reference-game-info-wrap">
            <div className="reference-game-visual"><img src={`${ASSET_BASE_URL}/manus-storage/main2_0c694426_d1284510.png`} alt="Ragnarok Universe gameplay" /><span>HTML5 MMORPG</span></div>
            <div className="reference-game-copy"><span>ABOUT RAGNAROK UNIVERSE</span><h2>Classic adventure.<br />A new way to play.</h2><p>Experience the legendary fantasy MMORPG directly in your web browser. Explore a familiar world, meet a growing community, and help shape the next chapter.</p><dl><div><dt>Platform</dt><dd>Web Browser</dd></div><div><dt>Genre</dt><dd>Fantasy MMORPG</dd></div><div><dt>Status</dt><dd>Beta Testing</dd></div><div><dt>Access</dt><dd>No Download</dd></div></dl><Link href="/game-info" className="reference-blue-cta">Explore Game Info <ChevronRight size={16} /></Link></div>
          </div>
        </section>

        <section id="media" className="reference-panel reference-media-panel">
          <div className="reference-home-container reference-media-wrap">
            <div className="reference-section-heading"><div><span>SEE THE WORLD IN MOTION</span><h2>Media</h2></div><p>Gameplay PV</p></div>
            <a href="https://www.youtube.com/watch?v=8QmGQ_sjbLo" target="_blank" rel="noopener noreferrer" className="reference-media-video"><img src={`${ASSET_BASE_URL}/manus-storage/main2_0c694426_d1284510.png`} alt="Ragnarok Universe gameplay video" /><span>▶</span><b>GAMEPLAY PVE</b></a>
            <div className="reference-shot-label"><b>SCREENSHOTS</b><span>DRAG TO EXPLORE ›</span></div>
            <div data-allow-native-scroll className="reference-shot-strip" aria-label="Ragnarok Universe screenshots">{screenshots.map((source, index) => <button type="button" key={`${source}-${index}`} onClick={() => setSelectedScreenshot(index)} aria-label={`View screenshot ${index + 1} full screen`}><img src={source} alt={`Ragnarok Universe screenshot ${index + 1}`} draggable={false} /><span>VIEW FULLSCREEN</span></button>)}</div>
          </div>
        </section>

        {showSignInDialog && <div role="dialog" aria-modal="true" className="reference-signin-dialog"><div><button type="button" onClick={() => setShowSignInDialog(false)} aria-label="Close sign in"><X size={20} /></button><SignInPanel onLoginSuccess={() => setShowSignInDialog(false)} /></div></div>}
        {selectedScreenshot !== null && <div role="dialog" aria-modal="true" className="reference-lightbox"><button type="button" onClick={() => setSelectedScreenshot(null)} aria-label="Close screenshot viewer"><X size={22} /></button><button type="button" onClick={() => setSelectedScreenshot((current) => current === null ? 0 : (current - 1 + screenshots.length) % screenshots.length)} aria-label="Previous screenshot"><ChevronLeft /></button><img src={screenshots[selectedScreenshot]} alt={`Ragnarok Universe screenshot ${selectedScreenshot + 1}`} /><button type="button" onClick={() => setSelectedScreenshot((current) => current === null ? 0 : (current + 1) % screenshots.length)} aria-label="Next screenshot"><ChevronRight /></button></div>}
      </div>
    </Layout>
  );
}
