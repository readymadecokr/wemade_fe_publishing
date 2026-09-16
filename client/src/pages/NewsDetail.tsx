import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";

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

function NewsDetailContent() {
  const params = useParams();
  const newsId = Number(params.id);
  const validNewsId = Number.isInteger(newsId) && newsId > 0;
  const { data: news, isLoading } = trpc.publicNews.byId.useQuery({ id: validNewsId ? newsId : 1 }, { enabled: validNewsId });
  const { data: allNews = [] } = trpc.publicNews.list.useQuery(undefined, { staleTime: 30_000, refetchOnWindowFocus: true });

  if (isLoading) {
    return <Layout variant="homeChrome" showClosingCta={false}><div className="container py-16 text-center text-sm text-[#7b6a51]">Loading news...</div></Layout>;
  }

  if (!news) {
    return <Layout variant="homeChrome"><div className="container py-12 text-center"><h1 className="mb-4 text-2xl font-bold text-slate-900">News Not Found</h1><Link href="/news"><Button className="bg-purple-600 hover:bg-purple-700">Back to News</Button></Link></div></Layout>;
  }

  const currentIndex = allNews.findIndex(item => item.id === news.id);
  const previousNews = currentIndex >= 0 ? allNews[currentIndex + 1] : undefined;
  const nextNews = currentIndex > 0 ? allNews[currentIndex - 1] : undefined;
  const paragraphs = news.content?.split(/\n\s*\n/).filter(Boolean) ?? [];

  return (
    <Layout variant="homeChrome" showClosingCta={false}>
      <>
        <section className="news-detail-page-banner news-detail-page-banner--detail" aria-labelledby="news-detail-page-title"><div className="container"><h1 id="news-detail-page-title">News</h1><p>Latest news, interviews, and community highlights</p></div></section>
        <div className="fantasy-page-shell news-detail-surface pt-6 pb-8 md:pt-8"><div className="container fantasy-content-guide mx-auto max-w-3xl"><Link href="/news" className="mb-4 flex w-fit items-center gap-1.5 text-sm text-[#4668a3] hover:text-[#2f4e82]"><ArrowLeft size={16} />Back to News</Link><h2 className="mb-3 font-serif text-2xl font-bold leading-tight text-[#302419] md:text-3xl">{news.title}</h2><div className="flex flex-wrap items-center gap-3"><span className="rounded bg-[#e2eaf7] px-3 py-1 text-xs font-semibold text-[#4668a3]">{news.category.toLowerCase()}</span><span className="text-sm text-[#7b6a51]">{formatNewsDate(news.publishedAt)}</span></div></div></div>
        <main className="fantasy-page-shell news-detail-surface"><div className="container fantasy-content-guide mx-auto max-w-3xl py-10">{news.imageUrl && <div className="fantasy-frame mb-8 overflow-hidden rounded-xl"><img src={news.imageUrl} alt={news.title} className="max-h-96 w-full object-cover" /></div>}<div className="fantasy-card mb-12 rounded-xl p-6">{paragraphs.length > 0 ? paragraphs.map((paragraph, index) => <p className="mb-4 text-base leading-relaxed text-[#5d4f3d] last:mb-0" key={index}>{paragraph}</p>) : <p className="text-base leading-relaxed text-[#5d4f3d]">No article content has been provided.</p>}</div><div className="flex items-center justify-between gap-3 border-t border-[#cdbb91] pt-6">{previousNews ? <Link href={`/news/${previousNews.id}`} className="flex-1"><button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#bca77a] px-4 py-3 text-sm font-semibold text-[#5d4f3d] transition-colors hover:bg-[#eadfc4]"><ArrowLeft size={15} className="text-[#4668a3]" />Previous</button></Link> : <div className="flex-1"><button disabled className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-purple-100 px-4 py-3 text-sm text-slate-300"><ArrowLeft size={15} />Previous</button></div>}<Link href="/news" className="flex-1"><button className="flex w-full items-center justify-center rounded-xl border border-[#36578f] bg-[#4668a3] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#385a92]">News List</button></Link>{nextNews ? <Link href={`/news/${nextNews.id}`} className="flex-1"><button className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50">Next<ArrowLeft size={15} className="rotate-180 text-purple-500" /></button></Link> : <div className="flex-1"><button disabled className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-purple-100 px-4 py-3 text-sm text-slate-300">Next<ArrowLeft size={15} className="rotate-180" /></button></div>}</div></div></main>
      </>
    </Layout>
  );
}

export default function NewsDetailPage() {
  return <NewsDetailContent />;
}
