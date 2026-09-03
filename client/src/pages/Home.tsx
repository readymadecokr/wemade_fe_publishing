import { ChevronRight, ChevronLeft, X } from "lucide-react";
import SignInPanel from "@/components/SignInPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

/**
 * Design Philosophy: Flyff Universe + Play2Bit Style
 * - Professional gaming portal design
 * - Large hero banner with game start CTA
 * - Multi-category news section
 * - Clean white background with blue accents
 * - English content throughout
 */

export default function Home() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showTTKeyDialog, setShowTTKeyDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showTTEndedDialog, setShowTTEndedDialog] = useState(false);
  const [ttKeyInput, setTTKeyInput] = useState("");
  const [ttKeyError, setTTKeyError] = useState("");

  const isLoggedIn = localStorage.getItem("rou_logged_in") === "true";
  const isTTKeyVerified = localStorage.getItem("rou_ttkey_verified") === "true";

  // DB에서 배너 데이터 가져오기 (fallback: 하드코딩 배너)
  const { data: dbBanners } = trpc.banner.list.useQuery(undefined, { retry: false });
  const { data: dbNews } = trpc.publicNews.list.useQuery(undefined, { retry: false });

  const fallbackBanners = [
    {
      id: 1,
      imageUrl: `${ASSET_BASE_URL}/manus-storage/mainbanner_01_new_1c67868c.jpg`,
      title: "PLAY WITH DISCORD",
      actionType: "url" as const,
      actionUrl: "https://discord.com/invite/yVWJkWdkAU",
      contentTitle: null, contentDate: null, contentBody: null,
    },
    {
      id: 2,
      imageUrl: `${ASSET_BASE_URL}/manus-storage/mainbanner_02_e759d77c.jpg`,
      title: "Enter The Ragnarok Universe",
      actionType: "url" as const,
      actionUrl: "game-start",
      contentTitle: null, contentDate: null, contentBody: null,
    },
  ];

  const bannerImages = (dbBanners && dbBanners.length > 0 ? dbBanners : fallbackBanners).map(b => ({
    id: b.id,
    url: b.imageUrl,
    title: b.title,
    actionType: b.actionType,
    actionUrl: b.actionUrl ?? "",
    contentTitle: b.contentTitle,
    contentDate: b.contentDate,
    contentBody: b.contentBody,
  }));
  const currentBanner = bannerImages[currentBannerIndex] ?? bannerImages[0];
  const heroEyebrow = currentBanner?.contentDate || "Ragnarok Universe";
  const heroTitle = currentBanner?.contentTitle || currentBanner?.title || "Begin Your Adventure";
  const heroBody = currentBanner?.contentBody || "Explore Midgard in your browser. Join the official community for updates, events, and the next chapter of Ragnarok Universe.";

  useEffect(() => {
    setCurrentBannerIndex(previous => bannerImages.length ? Math.min(previous, bannerImages.length - 1) : 0);
  }, [bannerImages.length]);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => bannerImages.length ? (prev + 1) % bannerImages.length : 0);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => bannerImages.length ? (prev - 1 + bannerImages.length) % bannerImages.length : 0);
  };

  const handleCurrentBannerAction = () => {
    const banner = currentBanner;
    if (!banner) return;
    if (banner.actionType === "url") {
      if (banner.actionUrl === "game-start") {
        handleGameStart();
      } else if (banner.actionUrl) {
        window.open(banner.actionUrl, "_blank");
      }
      return;
    }
    if (banner.actionType === "content") {
      toast.info(banner.contentTitle ?? banner.title);
    }
  };

  useEffect(() => {
    const sectionIds = ["game-start", "discord-community", "news", "game-info", "media", "site-footer"];
    let wheelLocked = false;
    let unlockTimer = 0;

    const handleSectionWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 900 || Math.abs(event.deltaY) < 8) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("iframe, [data-allow-native-scroll]")) return;
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section));
      if (sections.length === 0) return;

      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => { wheelLocked = false; }, 520);

      const currentIndex = sections.reduce((closestIndex, section, index) => (
        Math.abs(section.getBoundingClientRect().top) < Math.abs(sections[closestIndex].getBoundingClientRect().top)
          ? index
          : closestIndex
      ), 0);
      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + (event.deltaY > 0 ? 1 : -1)));
      sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("wheel", handleSectionWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleSectionWheel);
      window.clearTimeout(unlockTimer);
    };
  }, []);

  // Auto-rotate banner every 5 seconds
  useEffect(() => {
    if (bannerImages.length < 2) return;
    const interval = setInterval(nextBanner, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // News fallback - 공개 News API가 비어 있을 때만 표시
  const fallbackNewsData = [
    {
      id: 1,
      title: "Ragnarok Online: Patch Update June 17, 2026",
      date: "6/17/2026 10:38 PM",
      image: `${ASSET_BASE_URL}/manus-storage/RO1_pathupdate_17062026_f83f13b8_0ccbefaa.jpg`,
    },
    {
      id: 2,
      title: "Ragnarok Online: Patch Update June 10, 2026",
      date: "6/17/2026 10:32 PM",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_10062026_219a465c_5903482d.jpg`,
    },
    {
      id: 3,
      title: "Ragnarok Online: Patch Update June 4, 2026",
      date: "6/17/2026 1:08:40 PM",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_04062026-1_29153260_878bf95f.jpg`,
    },
    {
      id: 4,
      title: "Ragnarok Online: Patch Update May 27, 2026",
      date: "5/28/2026 4:07:24 PM",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_27052026_953943aa_fa54354f.webp`,
    },
    {
      id: 5,
      title: "Gravity Game Tech Launches LINE Official Account",
      date: "5/28/2026 2:18:45 PM",
      image: `${ASSET_BASE_URL}/manus-storage/PR-pack-Line-OA-Cover-700x36020052026_d4332f85_70996280.webp`,
    },
    {
      id: 6,
      title: "Ragnarok Online: Music Contest Winners Announced",
      date: "5/22/2026 2:03:43 PM",
      image: `${ASSET_BASE_URL}/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_bc640d8a_0c8f7386.png`,
    },
  ];
  const newsData = dbNews && dbNews.length > 0
    ? dbNews.map(item => ({
        id: item.id,
        title: item.title,
        date: item.publishedAt ? new Date(item.publishedAt).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }) : "",
        image: item.imageUrl || `${ASSET_BASE_URL}/manus-storage/ragnarok-news-default-banner_0d5427e8.png`,
      }))
    : fallbackNewsData;

  const handleGameStart = () => {
    if (!isLoggedIn) {
      // 1. 비로그인 → Sign In 팝업
      setShowSignInDialog(true);
      return;
    }
    if (isTTKeyVerified) {
      // 3. TT Key 인증 완료 → 바로 게임 실행
      toast.success("Launching game...");
      window.open("https://discord.gg/yVWJkWdkAU", "_blank");
      return;
    }
    // 2. 로그인 O, TT Key 미인증 → TT Key 팝업
    setShowTTKeyDialog(true);
  };

  const handleTTKeySubmit = () => {
    if (!ttKeyInput.trim()) {
      setTTKeyError("Please enter a valid Technical Test Key");
      return;
    }
    // Save verified state
    localStorage.setItem("rou_ttkey_verified", "true");
    toast.success("Technical Test Key verified! Launching game...");
    setShowTTKeyDialog(false);
    setTTKeyInput("");
    setTTKeyError("");
    window.open("https://discord.gg/yVWJkWdkAU", "_blank");
  };

  // Notice data
  const noticeData = [
    {
      id: 1,
      category: "Maintenance",
      categoryColor: "bg-yellow-400",
      title: "Server Maintenance Scheduled for June 10",
      description: "Game servers will be down from 2:00 AM to 6:00 AM UTC for system updates and improvements. Thank you for your patience.",
      date: "2026.06.08",
      featured: true,
    },
    {
      id: 2,
      category: "Events",
      categoryColor: "bg-blue-500",
      title: "New Player Welcome Bonus Extended",
      description: "Extended until end of June! New players enjoy 30 days of premium benefits including double experience and exclusive items.",
      date: "2026.06.05",
      featured: false,
    },
    {
      id: 3,
      category: "Security",
      categoryColor: "bg-red-500",
      title: "Anti-Cheat System Update",
      description: "Enhanced anti-cheat system implemented to ensure fair gameplay. Accounts violating terms will face immediate suspension.",
      date: "2026.06.01",
      featured: false,
    },
    {
      id: 4,
      category: "Policy",
      categoryColor: "bg-purple-500",
      title: "Community Guidelines Update",
      description: "Review updated community guidelines to ensure compliance. Violations may result in account restrictions or bans.",
      date: "2026.05.28",
      featured: false,
    },
  ];

  // News Card Component
  const NewsCard = ({ item, category }: { item: any; category: string }) => (
    <div className="fantasy-card flex h-full flex-col overflow-hidden rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-xl cursor-pointer">
      <div className="aspect-video overflow-hidden bg-foreground/10">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
      </div>
      <div className="flex min-h-[84px] flex-1 flex-col p-3">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#5971a3]">{category}</p>
        <h3 className="mb-1 min-h-[2.5rem] text-sm font-bold leading-snug text-[#2c241c] line-clamp-2">{item.title}</h3>
        <p className="mt-auto text-[11px] text-[#7c6a52]">{item.date}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="fantasy-page-shell">
        {/* BANNER + GAME START — wrapper with overflow visible so button can overlap */}
        <div id="game-start" className="home-scroll-panel relative w-full">
          {/* BANNER SECTION */}
          <section className="relative w-full bg-foreground/10 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '1900 / 600' }}>
            {/* Banner Image */}
            {currentBanner ? <img
              src={currentBanner.url}
              alt={currentBanner.title}
              onClick={handleCurrentBannerAction}
              className="h-full w-full object-cover cursor-pointer"
            /> : <div className="flex h-full w-full items-center justify-center bg-[#213b58] text-sm font-semibold text-white">No banner is currently available.</div>}
            {currentBanner && <div className="pointer-events-none absolute inset-0 z-10 flex items-start bg-gradient-to-r from-[#071b2d]/55 via-transparent to-transparent px-4 py-4 sm:px-7 sm:py-6 lg:px-12 lg:py-8">
              <article className="pointer-events-auto max-w-[290px] rounded-md border border-white/20 bg-[#112c43]/78 p-3 text-left text-white shadow-[0_12px_24px_rgba(5,18,31,.2)] backdrop-blur-[2px] sm:max-w-sm sm:p-4">
                <p className="mb-1 text-[9px] font-black uppercase tracking-[0.17em] text-[#f4d78e]">{heroEyebrow}</p>
                <h1 className="font-serif text-lg font-black leading-tight sm:text-2xl">{heroTitle}</h1>
                <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-[#edf4fb] sm:text-xs">{heroBody}</p>
                <button onClick={handleCurrentBannerAction} className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#f8d57e] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f8d57e]">Explore More <ChevronRight size={14} aria-hidden="true" /></button>
              </article>
            </div>}
            {/* Banner Navigation Buttons */}
            {bannerImages.length > 1 && <><button
              onClick={(e) => { e.stopPropagation(); prevBanner(); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/25 hover:bg-white/40 text-white p-2 rounded-none transition-all backdrop-blur-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextBanner(); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/25 hover:bg-white/40 text-white p-2 rounded-none transition-all backdrop-blur-sm"
            >
              <ChevronRight size={16} />
            </button></>}
          </section>

          {/* GAME START Button — 배너 하단 중앙, 절반 걸치기 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[50%] z-30">
            <style>{`
              .game-start-btn-wrap {
                width: clamp(154px, 32vw, 520px);
                height: auto;
              }
              .game-start-btn:hover .game-start-img {
                transform: scale(1.04);
              }
            `}</style>
            <button
              onClick={handleGameStart}
              className="game-start-btn game-start-btn-wrap group relative transition-all duration-300 active:scale-95 focus:outline-none block"

              title="Game Start"
            >
              <img
                src={`${ASSET_BASE_URL}/manus-storage/gamestart_BTN2_cdf3e7b7.png`}
                alt="Game Start"
                className="game-start-img w-full h-auto object-contain transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Spacer: 버튼 높이의 50% (translate-y[50%] 기준) */}
        <div style={{ height: 'clamp(60px, 8vw, 130px)' }} />

        {/* DISCORD COMMUNITY — 메인 배너 바로 아래 WidgetBot 임베드 */}
        <section id="discord-community" className="home-scroll-panel pb-8 pt-2 md:pb-10">
          <div className="container fantasy-content-guide">
            <div className="mb-5 text-center md:mb-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#735c39]">Official Community</p>
              <h2 className="font-serif text-3xl font-black tracking-tight text-[#2c241c] md:text-4xl">Discord</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-[#675843]">Development news and community updates from the official Ragnarok Universe Discord.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#d7c5a3] bg-[#fffdf9] shadow-[0_14px_34px_rgba(59,49,35,.18)]">
              <div className="h-[560px] overflow-hidden md:h-[500px]">
                <iframe
                  src="https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051"
                  title="Ragnarok Universe Discord community"
                  className="block h-[632px] w-full border-0 md:h-[572px]"
                  loading="lazy"
                  allow="clipboard-read; clipboard-write; fullscreen"
                  allowFullScreen
                  tabIndex={-1}
                />
              </div>
              <div
                aria-label="Read-only Discord chat"
                role="note"
                className="flex h-[68px] items-start justify-center border-t border-white/10 bg-[#2f3136] px-4 pt-2 shadow-[0_-6px_14px_rgba(0,0,0,.18)] md:h-[72px] md:pt-3"
              >
                <a
                  href="https://discord.gg/yVWJkWdkAU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-[#7b87ff]/70 bg-[#5865f2] px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-[0_4px_12px_rgba(47,55,170,.38)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#6974f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8ceff] active:translate-y-0 active:scale-[.97]"
                >
                  Join Official Discord <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* NEWS SECTION - Unified layout */}
        <section id="news" className="home-scroll-panel py-2">
          <div className="container fantasy-content-guide pt-5 md:pt-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#735c39]">News and Notice</p>
                <h2 className="fantasy-section-title flex items-center gap-3 text-3xl md:text-4xl"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#7283a0] bg-[#445d82] text-sm text-[#f9edcb] shadow-sm">✦</span>Latest From Midgard</h2>
              </div>
              <Link href="/news">
                <Button variant="outline" aria-label="View all news" className="h-10 w-10 rounded-full border-[#7386a5] bg-[#fffdf7]/78 p-0 text-xl font-semibold text-[#3e609b] hover:bg-[#4668a3] hover:text-white">
                  +
                </Button>
              </Link>
            </div>

            {/* Home shows the three most recent News items; full archive remains available via View More. */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {newsData.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="block h-full">
                  <NewsCard item={item} category="NEWS" />
                </Link>
              ))}
            </div>
          </div>
        </section>



        {/* GAME INFO SECTION */}
        <section id="game-info" className="home-scroll-panel py-0">
          <div className="container fantasy-content-guide py-0" style={{paddingTop: '48px', paddingBottom: '0px'}}>
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#735c39]">About Ragnarok Universe</p>
                <h2 className="font-serif text-3xl font-black leading-[.92] tracking-tight text-[#2c241c] md:text-5xl">Classic Adventure<br />A New Way to Play</h2>
              </div>
              <Link href="/game-info" className="shrink-0 pt-1">
                <Button variant="outline" className="border-[#7386a5] bg-[#fffdf7]/78 px-5 text-sm font-semibold text-[#3e609b] hover:bg-[#4668a3] hover:text-white">
                  View More
                </Button>
              </Link>
            </div>

            {/* Game Info Card */}
            <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:items-start lg:gap-8">
              {/* Game Image */}
              <div className="fantasy-frame overflow-hidden rounded-xl">
                <img
                  src={`${ASSET_BASE_URL}/manus-storage/main2_0c694426_d1284510.png`}
                  alt="Ragnarok Universe Gameplay"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Game Details */}
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-[#675843] md:text-base">
                  Experience the legendary fantasy MMORPG directly in your web browser. Explore a familiar world, meet a growing community, and help shape the next chapter.
                </p>

                {/* Game Specs Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="fantasy-card rounded-lg p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase text-[#786850]">Platform</p>
                    <p className="text-base font-black text-[#2c241c]">Web Browser</p>
                  </div>
                  <div className="fantasy-card rounded-lg p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase text-[#786850]">Genre</p>
                    <p className="text-base font-black text-[#2c241c]">Fantasy MMORPG</p>
                  </div>
                  <div className="fantasy-card rounded-lg p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase text-[#786850]">Age Rating</p>
                    <p className="text-base font-black text-[#2c241c]">18+</p>
                  </div>
                  <div className="fantasy-card rounded-lg p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase text-[#786850]">Status</p>
                    <p className="text-base font-black text-[#4668a3]">Beta Testing</p>
                  </div>
                </div>
                <button onClick={() => toast.info("Rune-Midgarts Library is coming soon.")} className="inline-flex w-fit items-center gap-2 rounded-md bg-[#4068a5] px-5 py-3 text-xs font-bold text-white shadow-[0_5px_12px_rgba(36,70,120,.28)] transition-transform hover:-translate-y-0.5 hover:bg-[#537fbe] active:scale-[.97]">Rune-Midgarts Library <ChevronRight size={15} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </section>

        {/* Gameplay Trailer and media gallery */}
        <MediaSection />

        {/* Sign In Modal — full login panel as popup */}
        {showSignInDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17283b]/55 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
              {/* Decorative blur */}
              <div className="pointer-events-none absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#37598e] to-[#d7ba74] opacity-30 blur-xl"></div>
              <div className="fantasy-card relative rounded-3xl p-8 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={() => setShowSignInDialog(false)}
                  className="absolute right-4 top-4 z-10 text-[#766347] transition-colors hover:text-[#355d9d]"
                >
                  <X size={22} />
                </button>
                <SignInPanel onLoginSuccess={() => setShowSignInDialog(false)} />
              </div>
            </div>
          </div>
        )}

        {/* TT Ended Dialog */}
        {showTTEndedDialog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
              {/* Close button */}
              <div className="flex justify-end p-3 pb-0">
                <button
                  onClick={() => setShowTTEndedDialog(false)}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
              {/* Content */}
              <div className="px-8 pb-6 pt-2">
                <h2 className="text-xl font-black text-slate-900 text-center mb-2">The Technical Test has ended.</h2>
                <p className="text-slate-500 text-sm text-center mb-6">Thanks for playing!</p>
                <hr className="border-slate-200 mb-5" />
                <div className="flex items-center justify-between gap-4">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Stay tuned for future tests, and join our Discord for the latest updates.
                  </p>
                  <a
                    href="https://discord.com/invite/yVWJkWdkAU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors shadow-lg"
                    title="Join Discord"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.007-.12a10.15 10.15 0 0 0 .372-.294a.074.074 0 0 1 .076-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .076.01c.12.098.246.198.373.294a.072.072 0 0 1-.006.12a12.3 12.3 0 0 1-1.873.892a.077.077 0 0 0-.037.099c.36.698.772 1.362 1.293 2.1a.074.074 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.761-.838-8.898-3.557-12.562a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.967-2.157-2.156c0-1.193.93-2.157 2.157-2.157c1.226 0 2.157.964 2.157 2.157c0 1.19-.93 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.967-2.157-2.156c0-1.193.93-2.157 2.157-2.157c1.226 0 2.157.964 2.157 2.157c0 1.19-.931 2.155-2.157 2.155z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TT Key Dialog */}
        {showTTKeyDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background border border-border rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-foreground whitespace-nowrap">Please enter your Technical Test Key</h3>
                <button
                  onClick={() => setShowTTKeyDialog(false)}
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter your Technical Test Key"
                  value={ttKeyInput}
                  onChange={(e) => {
                    setTTKeyInput(e.target.value);
                    setTTKeyError("");
                  }}
                  className="w-full"
                />

                {ttKeyError && (
                  <p className="text-red-500 text-sm font-semibold">{ttKeyError}</p>
                )}

                <Button
                  onClick={handleTTKeySubmit}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                >
                  Confirm
                </Button>

                {/* Discord info row below Confirm */}
                <div className="flex items-center gap-3 pt-1">
                  <p className="text-foreground/60 text-sm flex-1">
                    Check the "Technical Test Key" on our official Discord.
                  </p>
                  <a
                    href="https://discord.gg/yVWJkWdkAU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    title="Go to Discord"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.007-.12a10.15 10.15 0 0 0 .372-.294a.074.074 0 0 1 .076-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .076.01c.12.098.246.198.373.294a.072.072 0 0 1-.006.12a12.3 12.3 0 0 1-1.873.892a.077.077 0 0 0-.037.099c.36.698.772 1.362 1.293 2.1a.074.074 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.761-.838-8.898-3.557-12.562a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.967-2.157-2.156c0-1.193.93-2.157 2.157-2.157c1.226 0 2.157.964 2.157 2.157c0 1.19-.93 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.967-2.157-2.156c0-1.193.93-2.157 2.157-2.157c1.226 0 2.157.964 2.157 2.157c0 1.19-.931 2.155-2.157 2.155z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Media 섹션 컴포넌트 - DB에서 활성 상태인 영상만 표시
function MediaSection() {
  const { data: mediaList } = trpc.publicMedia.list.useQuery();
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  // 활성 영상이 없으면 섹션 자체를 숨김
  if (!mediaList || mediaList.length === 0) return null;

  // YouTube URL에서 embed ID 추출
  const getYoutubeEmbedUrl = (url: string) => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?/\s]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  };

  const mediaItems = mediaList
    .map((item) => ({ ...item, embedUrl: getYoutubeEmbedUrl(item.youtubeUrl) }))
    .filter((item): item is typeof item & { embedUrl: string } => Boolean(item.embedUrl))
    .slice(0, 12);
  const selectedMedia = selectedMediaIndex === null ? null : mediaItems[selectedMediaIndex];

  if (mediaItems.length === 0) return null;

  return (
    <section id="media" className="home-scroll-panel pb-12 pt-12 md:pb-16 md:pt-16">
      <div className="container fantasy-content-guide">
        <div className="mb-5 text-center md:mb-7">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#735c39]">See the World in Motion</p>
          <h2 className="font-serif text-3xl font-black tracking-tight text-[#2c241c] md:text-4xl">Media</h2>
        </div>
        <div className="fantasy-frame overflow-hidden rounded-xl">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe className="absolute inset-0 h-full w-full" src={mediaItems[0].embedUrl} title={mediaItems[0].title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {mediaItems.map((item, index) => {
            const videoId = item.embedUrl.split("/").pop();
            return <button key={item.id} onClick={() => setSelectedMediaIndex(index)} className="group relative aspect-video overflow-hidden rounded-lg border border-[#d7c5a3] bg-[#263746] text-left shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4068a5]">
              <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={`${item.title} preview`} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center bg-[#17283b]/30 text-2xl text-white transition-colors group-hover:bg-[#17283b]/15">▶</span>
            </button>;
          })}
        </div>
      </div>
      {selectedMedia && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#101825]/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${selectedMedia.title} media viewer`}>
        <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-[#111d2b] shadow-2xl">
          <button onClick={() => setSelectedMediaIndex(null)} className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black" aria-label="Close media viewer"><X size={20} /></button>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}><iframe className="absolute inset-0 h-full w-full" src={selectedMedia.embedUrl} title={selectedMedia.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
          {mediaItems.length > 1 && <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between"><button onClick={() => setSelectedMediaIndex((selectedMediaIndex! - 1 + mediaItems.length) % mediaItems.length)} className="rounded-full bg-black/55 p-2 text-white hover:bg-black" aria-label="Previous media"><ChevronLeft /></button><button onClick={() => setSelectedMediaIndex((selectedMediaIndex! + 1) % mediaItems.length)} className="rounded-full bg-black/55 p-2 text-white hover:bg-black" aria-label="Next media"><ChevronRight /></button></div>}
        </div>
      </div>}
    </section>
  );
}
