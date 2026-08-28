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

const ITEMS_PER_PAGE = 12;

function NewsPageContent() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
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
      image: `${ASSET_BASE_URL}/manus-storage/RO1_pathupdate_17062026_f83f13b8_0ccbefaa.jpg`,
    },
    {
      id: 2,
      title: "Ragnarok Online: Patch Update June 10, 2026",
      date: "6/17/2026 10:32 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_10062026_219a465c_5903482d.jpg`,
    },
    {
      id: 3,
      title: "Ragnarok Online: Patch Update June 4, 2026",
      date: "6/17/2026 1:08:40 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_04062026-1_29153260_878bf95f.jpg`,
    },
    {
      id: 4,
      title: "Ragnarok Online: Patch Update May 27, 2026",
      date: "5/28/2026 4:07:24 PM",
      category: "Interview",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_27052026_953943aa_fa54354f.webp`,
    },
    {
      id: 5,
      title: "Gravity Game Tech Launches LINE Official Account",
      date: "5/28/2026 2:18:45 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/PR-pack-Line-OA-Cover-700x36020052026_d4332f85_70996280.webp`,
    },
    {
      id: 6,
      title: "Ragnarok Online: Music Contest Winners Announced",
      date: "5/22/2026 2:03:43 PM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_bc640d8a_0c8f7386.png`,
    },
    {
      id: 7,
      title: "Ragnarok Online: Patch Update May 13, 2026",
      date: "5/14/2026 8:54:59 AM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO1_patchupdate_13052026_700e9d1f_01c2e74f.jpg`,
    },
    {
      id: 8,
      title: "Ragnarok Online: Special Anniversary Event",
      date: "5/11/2026 10:02:34 AM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO1_04032026PatchUpdate_700X360_3345ccff_33b86c1a.webp`,
    },
    {
      id: 9,
      title: "Ragnarok Monster Shop @ Craft & Play 2026",
      date: "5/6/2026 5:40:04 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_46621aa6_4cf197fb.webp`,
    },
    {
      id: 10,
      title: "Ragnarok Online: Patch Update May 6, 2026",
      date: "5/6/2026 2:47:16 PM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO1_06052026_47ecad62_ae242c6b.jpg`,
    },
    {
      id: 11,
      title: "Ragnarok Online: Patch Update April 29, 2026",
      date: "4/30/2026 11:29:14 AM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate18032026_700x360_68e5480e_82a64304.webp`,
    },
    {
      id: 12,
      title: "Ragnarok Online: Patch Update April 22, 2026",
      date: "4/30/2026 11:27:05 AM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_22042026_337d2472_7c5c5406.webp`,
    },
    {
      id: 13,
      title: "Ragnarok Online: Patch Update April 8, 2026",
      date: "4/8/2026 2:24:50 PM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_700x360_01042026_04e81156_70b5b497.webp`,
    },
    {
      id: 14,
      title: "Ragnarok Online: Patch Update April 1, 2026",
      date: "4/8/2026 2:22:00 PM",
      category: "Event",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_700X360_04022026_d0450ed3_83809f8e.webp`,
    },
    {
      id: 15,
      title: "Ragnarok Online: Patch Update March 25, 2026",
      date: "4/7/2026 6:49:23 AM",
      category: "Update",
      image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate11032026_700x360_e08b651b_934c919f.webp`,
    },
    {
      id: 16,
      title: "Important: Account Security Policy Update",
      date: "3/15/2026 9:00:00 AM",
      category: "Notice",
      image: `${ASSET_BASE_URL}/manus-storage/ragnarok-news-default-banner_0d5427e8.png`,
    },
    {
      id: 17,
      title: "Ragnarok Universe Community Guidelines Revision",
      date: "3/1/2026 2:00:00 PM",
      category: "Notice",
      image: `${ASSET_BASE_URL}/manus-storage/ragnarok-news-default-banner_0d5427e8.png`,
    },
    {
      id: 18,
      title: "Developer Note: Upcoming Content Roadmap 2026",
      date: "2/20/2026 11:00:00 AM",
      category: "Interview",
      image: `${ASSET_BASE_URL}/manus-storage/ragnarok-news-default-banner_0d5427e8.png`,
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
      case "Notice":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderCard = (news: any) => (
    <div className="fantasy-card flex h-full flex-col overflow-hidden rounded-lg transition-shadow hover:shadow-lg">
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
          <span className="rounded bg-[#e2eaf7] px-2 py-0.5 text-xs font-semibold text-[#4668a3]">
            {news.category.toLowerCase()}
          </span>
          <h3 className="mt-0.5 text-xs font-bold text-[#2c241c] md:mt-2 md:text-lg line-clamp-2">
            {news.title}
          </h3>
        </div>
        <span className="mt-0.5 text-xs text-[#7b6a51] md:mt-3 md:text-sm">{news.date}</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Header */}
      <div className="border-b border-[#617089] bg-[linear-gradient(110deg,#314b66,#526f8d_50%,#314b66)] py-11 text-white">
        <div className="container">
          <h1 className="mb-2 font-serif text-4xl font-bold">News</h1>
          <p className="text-[#e9dfc8]">Latest news, interviews, and community highlights</p>
        </div>
      </div>

      {/* Content - 2 columns grid on mobile, 3 columns on desktop */}
      <main className="container fantasy-content-guide px-2 py-6 md:px-4 md:py-12">
        {(() => {
          const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
          const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
          const pageData = newsData.slice(startIdx, startIdx + ITEMS_PER_PAGE);
          return (
            <>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-6">
                {pageData.map((news) => (
                  <div key={news.id}>
                    {isMobile ? (
                      renderCard(news)
                    ) : (
                      <Link href={`/news/${news.id}`} asChild>
                        <a>{renderCard(news)}</a>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 mb-4">
                  {/* First page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    «
                  </button>
                  {/* Prev page */}
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ‹
                  </button>
                  {/* Page indicator */}
                  <div className="flex items-center gap-1 px-4 py-1 rounded-full border border-slate-300 text-sm text-slate-700 font-medium">
                    <span>{currentPage}</span>
                    <span className="text-slate-400">/</span>
                    <span>{totalPages}</span>
                  </div>
                  {/* Next page */}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ›
                  </button>
                  {/* Last page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    »
                  </button>
                </div>
              )}
            </>
          );
        })()}
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
