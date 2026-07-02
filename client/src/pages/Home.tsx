import { ChevronRight, ChevronLeft, ArrowRight, X } from "lucide-react";
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
  const [ttKeyInput, setTTKeyInput] = useState("");
  const [ttKeyError, setTTKeyError] = useState("");

  const isLoggedIn = localStorage.getItem("rou_logged_in") === "true";
  const isTTKeyVerified = localStorage.getItem("rou_ttkey_verified") === "true";

  // DB에서 배너 데이터 가져오기 (fallback: 하드코딩 배너)
  const { data: dbBanners } = trpc.banner.list.useQuery(undefined, { retry: false });

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

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  // Auto-rotate banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextBanner, 5000);
    return () => clearInterval(interval);
  }, []);

  // News data - unified single section (6 items for 2 rows x 3 columns) with banner images
  const newsData = [
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
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer">
      <div className="aspect-video overflow-hidden bg-foreground/10">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
      </div>
      <div className="p-4">
        <p className="text-xs font-bold text-foreground/60 uppercase mb-2">{category}</p>
        <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-xs text-foreground/70">{item.date}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-background">
        {/* BANNER + GAME START — wrapper with overflow visible so button can overlap */}
        <div className="relative w-full">
          {/* BANNER SECTION */}
          <section className="relative w-full bg-foreground/10 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '1900 / 600' }}>
            {/* Banner Image */}
            <img
              src={bannerImages[currentBannerIndex].url}
              alt={bannerImages[currentBannerIndex].title}
              onClick={() => {
                const banner = bannerImages[currentBannerIndex];
                if (banner.actionType === "url") {
                  if (banner.actionUrl === "game-start") {
                    handleGameStart();
                  } else if (banner.actionUrl) {
                    window.open(banner.actionUrl, '_blank');
                  }
                } else if (banner.actionType === "content") {
                  // 콘텐츠 모달 표시 (TODO: 콘텐츠 모달 구현)
                  toast.info(banner.contentTitle ?? banner.title);
                }
              }}
              className="h-full w-full object-cover cursor-pointer"
            />
            {/* Banner Navigation Buttons */}
            <button
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
            </button>
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
        <div className="bg-background" style={{ height: 'clamp(60px, 8vw, 130px)', display: 'none' }} />

        {/* NEWS SECTION - Unified layout */}
        <section id="news" className="py-0 bg-background border-b border-border" style={{display: 'none'}}>
          <div className="container pt-3 md:pt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">
                News
              </h2>
              <Link href="/news">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-semibold text-sm px-5">
                  View More
                </Button>
              </Link>
            </div>

            {/* News Grid - 2 rows of 3 cards on desktop, 2 columns on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {newsData.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`}>
                  <NewsCard item={item} category="NEWS" />
                </Link>
              ))}
            </div>
          </div>
        </section>



        {/* GAME INFO SECTION */}
        <section id="game-info" className="py-0 bg-background">
          <div className="container py-0">
            {/* Header */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight" style={{display: 'none'}}>
                About Ragnarok Universe
              </h2>
              <p className="text-lg text-foreground/60" style={{display: 'none'}}>Discover the world of Ragnarok</p>
            </div>

            {/* Game Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-center" style={{display: 'none'}}>
              {/* Game Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={`${ASSET_BASE_URL}/manus-storage/main2_0c694426_d1284510.png`}
                  alt="Ragnarok Universe Gameplay"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Game Details */}
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-3xl font-black text-foreground mb-3">Romantic Fantasy MMORPG</h3>
                  <p className="text-base text-foreground/70 leading-relaxed">
                    Ragnarok Universe brings the legendary online game to a new era. Play directly in your web browser without any downloads. Experience epic battles, explore vast worlds, and join millions of adventurers in this timeless fantasy universe.
                  </p>
                </div>

                {/* Game Specs Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs font-bold text-foreground/60 uppercase mb-2">Platform</p>
                    <p className="text-lg font-black text-foreground">Web Browser</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs font-bold text-foreground/60 uppercase mb-2">Genre</p>
                    <p className="text-lg font-black text-foreground">Fantasy MMORPG</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs font-bold text-foreground/60 uppercase mb-2">Age Rating</p>
                    <p className="text-lg font-black text-foreground">18+</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs font-bold text-foreground/60 uppercase mb-2">Status</p>
                    <p className="text-lg font-black text-primary">Beta Testing</p>
                  </div>
                </div>

                <Link href="/game-info">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                    Learn More <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Gameplay Trailer - DB 기반 */}
            <MediaSection />
          </div>
        </section>

        {/* Sign In Modal — full login panel as popup */}
        {showSignInDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
              {/* Decorative blur */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-primary to-accent opacity-20 blur-xl pointer-events-none"></div>
              <div className="relative rounded-3xl border border-white/10 p-8 shadow-2xl bg-slate-900/90 backdrop-blur-2xl">
                {/* Close button */}
                <button
                  onClick={() => setShowSignInDialog(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                >
                  <X size={22} />
                </button>
                <SignInPanel onLoginSuccess={() => setShowSignInDialog(false)} />
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

  // 활성 영상이 없으면 섹션 자체를 숨김
  if (!mediaList || mediaList.length === 0) return null;

  // YouTube URL에서 embed ID 추출
  const getYoutubeEmbedUrl = (url: string) => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?/\s]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  };

  return (
    <>
      {mediaList.map((item) => {
        const embedUrl = getYoutubeEmbedUrl(item.youtubeUrl);
        if (!embedUrl) return null;
        return (
          <div key={item.id} style={{ paddingTop: '30px' }}>
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4 tracking-tight">Media</h3>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={embedUrl}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
