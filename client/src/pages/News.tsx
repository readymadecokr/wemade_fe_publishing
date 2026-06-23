import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

/**
 * Design Philosophy: Flyff Universe + Play2Bit Style
 * - Professional gaming portal design
 * - News listing page (promotional content)
 * - Interviews, events, updates with banner images
 */

function NewsPageContent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 15 news items with banner images
  const newsData = [
    {
      id: 1,
      title: "Ragnarok Online: Patch Update June 17, 2026",
      date: "6/17/2026 10:38 PM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO1_pathupdate_17062026_f83f13b8.jpg`,
    },
    {
      id: 2,
      title: "Ragnarok Online: Patch Update June 10, 2026",
      date: "6/17/2026 10:32 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_10062026_219a465c.jpg`,
    },
    {
      id: 3,
      title: "Ragnarok Online: Patch Update June 4, 2026",
      date: "6/17/2026 1:08:40 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_04062026-1_29153260.jpg`,
    },
    {
      id: 4,
      title: "Ragnarok Online: Patch Update May 27, 2026",
      date: "5/28/2026 4:07:24 PM",
      category: "Interview",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_27052026_953943aa.webp`,
    },
    {
      id: 5,
      title: "Gravity Game Tech Launches LINE Official Account",
      date: "5/28/2026 2:18:45 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/PR-pack-Line-OA-Cover-700x36020052026_d4332f85.webp`,
    },
    {
      id: 6,
      title: "Ragnarok Online: Music Contest Winners Announced",
      date: "5/22/2026 2:03:43 PM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_bc640d8a.png`,
    },
    {
      id: 7,
      title: "Ragnarok Online: Patch Update May 13, 2026",
      date: "5/14/2026 8:54:59 AM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO1_patchupdate_13052026_700e9d1f.jpg`,
    },
    {
      id: 8,
      title: "Ragnarok Online: Special Anniversary Event",
      date: "5/11/2026 10:02:34 AM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO1_04032026PatchUpdate_700X360_3345ccff.webp`,
    },
    {
      id: 9,
      title: "Ragnarok Monster Shop @ Craft & Play 2026",
      date: "5/6/2026 5:40:04 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_46621aa6.webp`,
    },
    {
      id: 10,
      title: "Ragnarok Online: Patch Update May 6, 2026",
      date: "5/6/2026 2:47:16 PM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO1_06052026_47ecad62.jpg`,
    },
    {
      id: 11,
      title: "Ragnarok Online: Patch Update April 29, 2026",
      date: "4/30/2026 11:29:14 AM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate18032026_700x360_68e5480e.webp`,
    },
    {
      id: 12,
      title: "Ragnarok Online: Patch Update April 22, 2026",
      date: "4/30/2026 11:27:05 AM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_22042026_337d2472.webp`,
    },
    {
      id: 13,
      title: "Ragnarok Online: Patch Update April 8, 2026",
      date: "4/8/2026 2:24:50 PM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_700x360_01042026_04e81156.webp`,
    },
    {
      id: 14,
      title: "Ragnarok Online: Patch Update April 1, 2026",
      date: "4/8/2026 2:22:00 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_700X360_04022026_d0450ed3.webp`,
    },
    {
      id: 15,
      title: "Ragnarok Online: Patch Update March 25, 2026",
      date: "4/7/2026 6:49:23 AM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate11032026_700x360_e08b651b.webp`,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Update":
        return "bg-purple-100 text-purple-700";
      case "Event":
        return "bg-pink-100 text-pink-700";
      case "Interview":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderCard = (news: any) => (
    <div className="bg-white border border-purple-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image */}
      <div className="w-full h-20 md:h-48 overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-1.5 md:p-4 flex flex-col justify-between flex-1">
        <div>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getCategoryColor(news.category)}`}>
            {news.category.toLowerCase()}
          </span>
          <h3 className="text-xs md:text-lg font-bold text-slate-900 mt-0.5 md:mt-2 line-clamp-2">
            {news.title}
          </h3>
        </div>
        <span className="text-xs md:text-sm text-slate-500 mt-0.5 md:mt-3">{news.date}</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-black mb-2">📰 News</h1>
          <p className="text-purple-100">Latest news, interviews, and community highlights</p>
        </div>
      </div>

      {/* Content - 2 columns grid on mobile, 3 columns on desktop */}
      <main className="container py-4 px-2 md:px-4 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
          {newsData.map((news) => (
            <div key={news.id}>
              {isMobile ? (
                // Mobile: No link, just display card
                renderCard(news)
              ) : (
                // Desktop: Clickable link
                <Link href={`/news/${news.id}`} asChild>
                  <a>
                    {renderCard(news)}
                  </a>
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default function NewsPage() {
  return (
    <Layout>
      <NewsPageContent />
    </Layout>
  );
}
