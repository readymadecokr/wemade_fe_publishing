import { Link } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 12;
const NEWS_PLACEHOLDER_IMAGE = "/manus-storage/ragnarok-news-default-banner_0d5427e8.png";

function formatNewsDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function NewsPageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: managedNews, isLoading } = trpc.publicNews.list.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
  const newsItems = managedNews ?? [];
  const totalPages = Math.max(1, Math.ceil(newsItems.length / ITEMS_PER_PAGE));
  const pageData = newsItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <>
      <section className="news-detail-page-banner news-detail-page-banner--list" aria-labelledby="news-page-title">
        <div className="container"><h1 id="news-page-title">News</h1><p>Latest news, interviews, and community highlights</p></div>
      </section>
      <main className="container fantasy-content-guide px-2 py-6 md:px-4 md:py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-6" aria-label="Loading news">
            {Array.from({ length: 6 }, (_, index) => <div className="fantasy-card h-40 animate-pulse rounded-lg bg-slate-100 md:h-64" key={index} />)}
          </div>
        ) : pageData.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-6">
              {pageData.map((item) => (
                <Link href={`/news/${item.id}`} key={item.id} className="fantasy-card flex h-full flex-col overflow-hidden rounded-lg transition-shadow hover:shadow-lg">
                  <div className="h-20 w-full overflow-hidden md:h-48">
                    <img src={item.imageUrl || NEWS_PLACEHOLDER_IMAGE} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-1.5 md:p-4">
                    <div>
                      <span className="rounded bg-[#e2eaf7] px-2 py-0.5 text-xs font-semibold text-[#4668a3]">{item.category.toLowerCase()}</span>
                      <h3 className="mt-0.5 line-clamp-2 text-xs font-bold text-[#2c241c] md:mt-2 md:text-lg">{item.title}</h3>
                    </div>
                    <span className="mt-0.5 text-xs text-[#7b6a51] md:mt-3 md:text-sm">{formatNewsDate(item.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mb-4 mt-10 flex items-center justify-center gap-2">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">«</button>
                <button onClick={() => setCurrentPage(page => Math.max(1, page - 1))} disabled={currentPage === 1} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">‹</button>
                <div className="flex items-center gap-1 rounded-full border border-slate-300 px-4 py-1 text-sm font-medium text-slate-700"><span>{currentPage}</span><span className="text-slate-400">/</span><span>{totalPages}</span></div>
                <button onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">›</button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">»</button>
              </div>
            )}
          </>
        ) : <p className="py-16 text-center text-sm text-[#7b6a51]">No news is currently published.</p>}
      </main>
    </>
  );
}

export default function NewsPage() {
  return <Layout variant="homeChrome" showClosingCta={false}><NewsPageContent /></Layout>;
}
