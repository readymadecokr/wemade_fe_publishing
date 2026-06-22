import { Play, ChevronRight, ChevronLeft, ArrowRight, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";

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
  const [ttKeyInput, setTTKeyInput] = useState("");
  const [ttKeyError, setTTKeyError] = useState("");

  const isLoggedIn = localStorage.getItem("rou_logged_in") === "true";

  // Banner images carousel
  const bannerImages = [
    {
      id: 1,
      url: `${ASSET_BASE_URL}/manus-storage/ChatGPT-Image-Play-With-Discord_f803e1b3_988b3aeb.webp`,
      title: "PLAY WITH DISCORD",
      subtitle: "Please visit our official Discord channel for more information",
      link: "/game-info",
    },
    {
      id: 2,
      url: `${ASSET_BASE_URL}/manus-storage/TRO-Championship-2026_c417f04e_848eb2d9.webp`,
      title: "RAGNAROK CHAMPIONSHIP",
      subtitle: "The Ragnarok Sea Championship 2026",
      link: "/game-info",
    },
    {
      id: 3,
      url: `${ASSET_BASE_URL}/manus-storage/2-1-Gnjoysidebanner-1900x60006112025_9eb2918f_10d96d95.webp`,
      title: "RAGNAROK ABYSS",
      subtitle: "Light Up The New Gen - Pre-Register Now",
      link: "/game-info",
    },
    {
      id: 4,
      url: `${ASSET_BASE_URL}/manus-storage/6th-Anniversary-Sunset-of-Ayothaya-1900x600_ad2ad494_1cd501ef.webp`,
      title: "SUNSET OF AYOTHAYA",
      subtitle: "6th Anniversary Celebration",
      link: "/game-info",
    },
    {
      id: 5,
      url: `${ASSET_BASE_URL}/manus-storage/ROS-Thailand-2026-1900x600_509eb9c7_7491dd69.webp`,
      title: "RAGNAROK STARS",
      subtitle: "Thailand Championship 2026",
      link: "/game-info",
    },
  ];

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
      toast.info("Please sign in to start the game.");
      setLocation("/login");
      return;
    }
    setShowTTKeyDialog(true);
  };

  const handleTTKeySubmit = () => {
    if (!ttKeyInput.trim()) {
      setTTKeyError("Please enter a valid TT Key");
      return;
    }
    toast.success("TT Key verified! Starting game...");
    setShowTTKeyDialog(false);
    setTTKeyInput("");
    setTTKeyError("");
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
      <div className="min-h-screen bg-background">
        {/* BANNER SECTION */}
        <section className="relative w-full bg-foreground/10 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '1900 / 600' }}>
          {/* Banner Image */}
          <img
            src={bannerImages[currentBannerIndex].url}
            alt={bannerImages[currentBannerIndex].title}
            onClick={() => {
              // Only "PLAY WITH DISCORD" banner triggers the TT Key dialog
              if (bannerImages[currentBannerIndex].id === 1) {
                setShowTTKeyDialog(true);
              }
              // Other banners do nothing
            }}
            className="h-full w-full object-cover cursor-pointer"
          />




          {/* Banner Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevBanner();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/25 hover:bg-white/40 text-white p-2 rounded-none transition-all backdrop-blur-sm pointer-events-auto"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextBanner();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/25 hover:bg-white/40 text-white p-2 rounded-none transition-all backdrop-blur-sm pointer-events-auto"
          >
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Game Start and Join Community Buttons Section */}
        <section className="py-0 bg-background flex items-center justify-center">
          <div className="flex flex-row items-center justify-center gap-2 md:gap-6 py-3 md:py-4 w-full px-2 md:px-0">
            {/* START GAME NOW Button */}
            <button
              onClick={() => setShowTTKeyDialog(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-8 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs md:text-base shadow-lg transition-all hover:shadow-xl active:scale-95 rounded"
              title="Start Game Now"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Play size={16} className="md:w-5 md:h-5" /> <span className="hidden md:inline">START GAME NOW</span><span className="md:hidden text-center"><div>START</div><div>GAME NOW</div></span>
            </button>

            {/* JOIN COMMUNITY Button */}
            <button
              onClick={() => window.open('https://discord.com/invite/ragnarok', '_blank')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-8 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-base shadow-lg transition-all hover:shadow-xl active:scale-95 rounded"
              title="Join Community"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.007-.12a10.15 10.15 0 0 0 .372-.294a.074.074 0 0 1 .076-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .076.01c.12.098.246.198.373.294a.072.072 0 0 1-.006.12a12.3 12.3 0 0 1-1.873.892a.077.077 0 0 0-.037.099c.36.698.772 1.362 1.293 2.1a.074.074 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.761-.838-8.898-3.557-12.562a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.967-2.157-2.156c0-1.193.93-2.157 2.157-2.157c1.226 0 2.157.964 2.157 2.157c0 1.19-.93 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.967-2.157-2.156c0-1.193.93-2.157 2.157-2.157c1.226 0 2.157.964 2.157 2.157c0 1.19-.931 2.155-2.157 2.155z" />
              </svg>
              <span className="hidden md:inline">JOIN COMMUNITY</span><span className="md:hidden text-center"><div>JOIN</div><div>COMMUNITY</div></span>
            </button>
          </div>
        </section>

        {/* NEWS SECTION - Unified layout */}
        <section id="news" className="py-0 bg-background border-b border-border">
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
        <section id="game-info" className="py-12 md:py-16 bg-background border-b border-border">
          <div className="container">
            {/* Header */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">
                About Ragnarok Universe
              </h2>
              <p className="text-lg text-foreground/60">Discover the world of Ragnarok</p>
            </div>

            {/* Game Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-center">
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
          </div>
        </section>

        {/* TT Key Dialog */}
        {showTTKeyDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-foreground">Enter TT Key</h3>
                <button
                  onClick={() => setShowTTKeyDialog(false)}
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-foreground/70 mb-6">
                Please enter your TT Key to start playing Ragnarok Universe.
              </p>

              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter your TT Key"
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
                  Start Game
                </Button>

                <Button
                  onClick={() => setShowTTKeyDialog(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
