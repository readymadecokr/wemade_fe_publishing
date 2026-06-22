import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

// Banner data
const BANNERS = [
  {
    id: 1,
    image: "/manus-storage/ChatGPT-Image-Play-With-Discord_735dde20.webp",
    title: "PLAY WITH DISCORD",
    subtitle: "Join our official Discord channel for exclusive updates and community events",
    link: "/game-info",
  },
  {
    id: 2,
    image: "/manus-storage/TRO-Championship-2026_d74b0527.webp",
    title: "TRO CHAMPIONSHIP 2026",
    subtitle: "The Ragnarok Online Thailand Championship — Watch the best players compete",
    link: "/news",
  },
  {
    id: 3,
    image: "/manus-storage/2-1-Gnjoysidebanner-1900x60006112025_a6e6656d.webp",
    title: "RAGNAROK ABYSS",
    subtitle: "Light Up The New Gen — Pre-Register Now",
    link: "/game-info",
  },
  {
    id: 4,
    image: "/manus-storage/6th-Anniversary-Sunset-of-Ayothaya-1900x600_4d61df38.webp",
    title: "SUNSET OF AYOTHAYA",
    subtitle: "6th Anniversary Celebration — Explore the legendary lands of Ayothaya",
    link: "/news",
  },
  {
    id: 5,
    image: "/manus-storage/ROS-Thailand-2026-1900x600_9802f0ff.webp",
    title: "RAGNAROK STARS THAILAND 2026",
    subtitle: "The ultimate Ragnarok Stars championship event of the year",
    link: "/news",
  },
];

// News data (6 items: 2 rows × 3 columns)
const NEWS_ITEMS = [
  {
    id: 1,
    title: "Ragnarok Online: Patch Update June 17, 2026",
    date: "June 17, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_pathupdate_17062026_3443274d.jpg",
  },
  {
    id: 2,
    title: "Ragnarok Online: Patch Update June 10, 2026",
    date: "June 10, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_10062026_8b6abd6d.jpg",
  },
  {
    id: 3,
    title: "Ragnarok Online: Patch Update June 4, 2026",
    date: "June 4, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_04062026-1_eab33218.jpg",
  },
  {
    id: 4,
    title: "Ragnarok Online: Patch Update May 27, 2026",
    date: "May 27, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_27052026_f346f204.webp",
  },
  {
    id: 5,
    title: "Ragnarok Online: Patch Update May 13, 2026",
    date: "May 13, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_patchupdate_13052026_61973db6.jpg",
  },
  {
    id: 6,
    title: "Ragnarok Online: Patch Update May 6, 2026",
    date: "May 6, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_06052026_ade8545e.jpg",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentBanner(index);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((currentBanner + 1) % BANNERS.length);
  }, [currentBanner, goTo]);

  const prev = useCallback(() => {
    goTo((currentBanner - 1 + BANNERS.length) % BANNERS.length);
  }, [currentBanner, goTo]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = BANNERS[currentBanner];

  return (
    <Layout>
      {/* ─── Hero Banner Carousel ─── */}
      <section className="relative w-full overflow-hidden bg-black" style={{ height: "480px" }}>
        {/* Banner Image */}
        <div
          key={currentBanner}
          className="absolute inset-0 carousel-slide"
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Banner Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 bg-primary/80 text-white text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
                Latest Update
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
                {banner.title}
              </h2>
              <p className="text-white/80 text-sm md:text-base mb-5 leading-relaxed drop-shadow">
                {banner.subtitle}
              </p>
              <Link href={banner.link}>
                <Button className="gaming-gradient text-white font-semibold px-6 py-2 shadow-lg hover:opacity-90 transition-opacity">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next Buttons */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Next banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentBanner
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ─── CTA Banner (Game Start) ─── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-700 py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to Enter Midgard?</h3>
            <p className="text-white/80 text-sm">
              Join millions of adventurers in the world of Ragnarok Online.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/manus-storage/game-start-btn_27f1a0a1.png"
              alt="Play Now"
              className="h-12 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
              onClick={() => !isAuthenticated && (window.location.href = getLoginUrl())}
            />
            {!isAuthenticated && (
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary font-semibold"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
        {/* Decorative character */}
        <img
          src="/manus-storage/poring-character_89ac5939.png"
          alt=""
          className="absolute right-0 bottom-0 h-32 w-auto object-contain opacity-20 pointer-events-none"
        />
      </section>

      {/* ─── News Section ─── */}
      <section className="py-14 bg-background">
        <div className="container">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Latest News</h2>
              <p className="text-muted-foreground text-sm mt-1">Stay up to date with the latest updates and events</p>
            </div>
            <Link href="/news">
              <Button variant="outline" size="sm" className="gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* 2 rows × 3 columns grid — fixed layout */}
          <div className="grid grid-cols-3 gap-5">
            {NEWS_ITEMS.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <div className="bg-card border border-border rounded-xl overflow-hidden card-hover cursor-pointer group">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1.5">{item.date}</p>
                    <h3 className="text-sm font-semibold text-card-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Banner Ad ─── */}
      <section className="py-6 bg-muted/30">
        <div className="container">
          <img
            src="/manus-storage/BannerWarpportaldesktop_v2_f82003d8.png"
            alt="Warp Portal"
            className="w-full rounded-lg object-cover max-h-24"
          />
        </div>
      </section>

      {/* ─── Game Showcase ─── */}
      <section className="py-14 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Official Portal</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4 leading-tight">
                Welcome to<br />Ragnarok Universe
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Ragnarok Universe is the official gaming portal for all Ragnarok Online titles by Gravity Co., Ltd. Explore news, events, game information, and connect with the global community of adventurers.
              </p>
              <div className="flex gap-3">
                <Link href="/game-info">
                  <Button className="gaming-gradient text-white font-semibold">
                    Game Info
                  </Button>
                </Link>
                <Link href="/news">
                  <Button variant="outline">
                    Latest News
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="/manus-storage/ragnarok-universe-character_f4b63ce7.png"
                alt="Ragnarok Universe Character"
                className="h-72 w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
