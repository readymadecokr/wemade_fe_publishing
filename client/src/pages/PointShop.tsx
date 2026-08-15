import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

function fmtRuc(n: number): string { return Math.min(n, 9999999).toLocaleString("en-US"); }
function fmtAbs(n: number): string { return Math.min(Math.abs(n), 9999999).toLocaleString("en-US"); }
function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "-";
  const dt = new Date(d);
  const y = dt.getFullYear();
  const mo = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  const h = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${day} ${h}:${mi}`;
}

// ─── 공통 페이지네이션 ────────────────────────────────────────────────────────
function Pagination({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (p: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center items-center gap-1 mt-3">
      <button onClick={() => setPage(1)} disabled={page === 1} className="w-10 h-10 border border-slate-300 rounded bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">«</button>
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-10 h-10 border border-slate-300 rounded bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">&lt;</button>
      {pages.map(n => (
        <button key={n} onClick={() => setPage(n)} className={`w-10 h-10 border rounded text-sm font-bold transition-colors ${n === page ? "bg-[#9b2020] text-white border-[#9b2020]" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>{n}</button>
      ))}
      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-10 h-10 border border-slate-300 rounded bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">&gt;</button>
      <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="w-10 h-10 border border-slate-300 rounded bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">»</button>
    </div>
  );
}

// ─── 충전 탭 ─────────────────────────────────────────────────────────────────
function ChargeTab({ ruCash, bonusCash }: { ruCash: number; bonusCash: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: products = [] } = trpc.shop.listProducts.useQuery();
  // 상품 id(sortOrder 기준 1~8)별로 각각 다른 코인 아이콘
const COIN_ICONS: Record<number, string> = {
  1: "/manus-storage/rcoin-product-normalized-1_3a54dcfa.png",
  2: "/manus-storage/rcoin-product-normalized-2_7f2e6fc8.png",
  3: "/manus-storage/rcoin-product-normalized-3_a2066f09.png",
  4: "/manus-storage/rcoin-product-normalized-4_c97d1b25.png",
  5: "/manus-storage/rcoin-product-normalized-5_1f2fcd6a.png",
  6: "/manus-storage/rcoin-product-normalized-6_f8d73a29.png",
  7: "/manus-storage/rcoin-product-normalized-7_1846f0d0.png",
  8: "/manus-storage/rcoin-product-normalized-8_0af9497e.png",
};
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-h-[118px] rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-black tracking-wide text-slate-500 uppercase">rCoin</p>
          <p className="mt-1 text-3xl font-black text-[#a51f24]">{fmtRuc(ruCash)}</p>
          <p className="mt-1 text-xs text-slate-400">유료 충전 캐시</p>
        </div>
        <div className="min-h-[118px] rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-black tracking-wide text-slate-500 uppercase">Bonus rCoin</p>
          <p className="mt-1 text-3xl font-black text-green-700">{fmtRuc(bonusCash)}</p>
          <p className="mt-1 text-xs text-slate-400">보너스 캐시 (우선 차감)</p>
        </div>
      </section>

      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-slate-600">통화 USD 단위 <span className="mx-1 text-slate-300">·</span> 지역 통화는 PG 결제 페이지에서 전환</p>
        <p className="font-semibold text-slate-500">rCoin은 계정 귀속</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {(products as any[]).map((p: any) => {
          const isSelected = selected === p.id;
          const coinIcon = COIN_ICONS[p.id] ?? "/manus-storage/rucash-p1-1usd_95e76acd.png";
          const isBestSeller = p.id === 5;
          const isBestValue = p.id === 8;
          const isLargestProduct = p.id === 8;
          return (
            <button key={p.id} onClick={() => setSelected(p.id)} aria-label={`${fmtRuc(p.ruCashAmount)} rCoin 상품 선택`}
              className={`relative flex h-[174px] flex-col rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${isSelected ? "border-[#a51f24] bg-[#fffaf2] ring-1 ring-[#a51f24]" : "border-[#e3dfca] bg-[#faf8f0] hover:border-[#c6ba92]"}`}>
              {(isBestSeller || isBestValue) && (
                <img
                  src={isBestSeller ? "/manus-storage/rcoin-badge-best-seller-clean_432b87e4.png" : "/manus-storage/rcoin-badge-best-value-clean_4ae2a914.png"}
                  alt={isBestSeller ? "최다 판매" : "최고 혜택"}
                  className="absolute -left-2 -top-3 z-10 h-auto w-20 drop-shadow-md sm:w-24"
                />
              )}
              <div className="-ml-1 flex h-[104px] items-center gap-1 pt-1">
                <div className="flex w-[38%] shrink-0 items-center justify-start self-stretch min-[1280px]:w-[28%]">
                  <img src={coinIcon} alt="rCoin coin" className="h-[84px] w-[84px] max-h-full max-w-full object-contain object-center" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  {isLargestProduct ? (
                    <>
                      <div className="flex flex-col min-[1280px]:flex-row min-[1280px]:items-center min-[1280px]:gap-1">
                        <span className="shrink-0 text-2xl font-black leading-none tracking-tight text-slate-900 lg:text-3xl">{fmtRuc(p.ruCashAmount)}</span>
                        <span className="mt-1 w-fit shrink-0 rounded-lg bg-[#54866f] px-1.5 py-0.5 text-xs font-black leading-none text-white min-[1280px]:mt-0 lg:px-2 lg:py-1 lg:text-sm">+{fmtRuc(p.bonusCashAmount)}</span>
                      </div>
                      <div className="mt-2 text-base font-semibold text-slate-600 min-[1280px]:mt-1">rCoin</div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-nowrap items-center gap-1 whitespace-nowrap">
                        <span className="shrink-0 text-2xl font-black leading-none tracking-tight text-slate-900 lg:text-3xl">{fmtRuc(p.ruCashAmount)}</span>
                        {p.bonusCashAmount > 0 && (
                          <span className="shrink-0 rounded-lg bg-[#54866f] px-1.5 py-0.5 text-xs font-black leading-none text-white lg:px-2 lg:py-1 lg:text-sm">+{fmtRuc(p.bonusCashAmount)}</span>
                        )}
                      </div>
                      <div className="mt-1 text-base font-semibold text-slate-600">rCoin</div>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-1">
                <div className="w-full rounded-lg border border-[#e4a100] bg-gradient-to-b from-[#fff09b] via-[#ffd52b] to-[#f2ad05] px-3 py-2 text-center text-base font-black text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(181,105,0,0.32),0_3px_0_rgba(188,117,0,0.56),0_5px_9px_rgba(171,111,0,0.24)] sm:text-lg">${Number(p.priceUsd).toFixed(2)}</div>
              </div>
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="mt-6 flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex-1 text-sm text-slate-700">
            {(() => {
              const p = (products as any[]).find((x: any) => x.id === selected);
              if (!p) return null;
              const total = p.ruCashAmount + p.bonusCashAmount;
              return <span><strong>{p.name}</strong> 선택됨 — 합계 <strong className="text-[#9b2020]">{fmtRuc(total)} rCoin</strong>{p.bonusCashAmount > 0 ? <span className="text-green-600"> ({fmtRuc(p.ruCashAmount)} rCoin + {fmtRuc(p.bonusCashAmount)} Bonus rCoin)</span> : ""}</span>;
            })()}
          </div>
          <button className="px-6 py-2 bg-[#9b2020] hover:bg-[#7a1a1a] text-white font-bold rounded-lg text-sm transition-colors" onClick={() => alert("PG 결제 연동 후 이용 가능합니다.")}>충전하기</button>
        </div>
      )}
    </div>
  );
}

// ─── 구매 내역 탭 ─────────────────────────────────────────────────────────────
function ChargeHistoryTab() {
  const [page, setPage] = useState(1);
  const { data } = trpc.shop.myChargeHistory.useQuery({ page, pageSize: 10 });
  const items = (data?.items ?? []) as any[];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));
  const COLS = ["게임코드","TIME","충전전 rCoin","충전전 Bonus rCoin","PG","Price","충전량 rCoin","충전량 Bonus rCoin","충전후 rCoin","충전후 Bonus rCoin"];
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-800">구매 내역</h2>
      {!items.length ? (
        <div className="text-center py-12 text-slate-400 text-sm">충전 내역이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#9b2020] text-white">
                {COLS.map(c => <th key={c} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap border-r border-red-700 last:border-r-0">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((tx: any) => (
                <tr key={tx.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-[#9b2020] border-r border-slate-200">{tx.gameCode ?? "ROU"}</td>
                  <td className="px-3 py-2 whitespace-nowrap border-r border-slate-200">{fmtDate(tx.createdAt)}</td>
                  <td className="px-3 py-2 text-right border-r border-slate-200">{fmtRuc(tx.beforeRuCash)}</td>
                  <td className="px-3 py-2 text-right text-green-700 border-r border-slate-200">{fmtRuc(tx.beforeBonusCash)}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{tx.pgName ?? "-"}</td>
                  <td className="px-3 py-2 text-right border-r border-slate-200">{tx.priceUsd ? `$${Number(tx.priceUsd).toFixed(0)}` : "-"}</td>
                  <td className="px-3 py-2 text-right font-bold text-[#9b2020] border-r border-slate-200">{fmtAbs(tx.ruCashDelta)}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-700 border-r border-slate-200">{fmtAbs(tx.bonusCashDelta)}</td>
                  <td className="px-3 py-2 text-right font-bold border-r border-slate-200">{fmtRuc(tx.afterRuCash)}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-700">{fmtRuc(tx.afterBonusCash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

// ─── 사용 내역 탭 ─────────────────────────────────────────────────────────────
function UseHistoryTab() {
  const [page, setPage] = useState(1);
  const { data } = trpc.shop.myUseHistory.useQuery({ page, pageSize: 10 });
  const items = (data?.items ?? []) as any[];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));
  const COLS = ["게임코드","TIME","사용전 rCoin","사용전 Bonus rCoin","Item Name","QTY","Item Price","Total Price","잔량 rCoin","잔량 Bonus rCoin"];
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-800">사용 내역</h2>
      {!items.length ? (
        <div className="text-center py-12 text-slate-400 text-sm">사용 내역이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#9b2020] text-white">
                {COLS.map(c => <th key={c} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap border-r border-red-700 last:border-r-0">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((tx: any) => (
                <tr key={tx.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-[#9b2020] border-r border-slate-200">{tx.gameCode ?? "ROU"}</td>
                  <td className="px-3 py-2 whitespace-nowrap border-r border-slate-200">{fmtDate(tx.createdAt)}</td>
                  <td className="px-3 py-2 text-right border-r border-slate-200">{fmtRuc(tx.beforeRuCash)}</td>
                  <td className="px-3 py-2 text-right text-green-700 border-r border-slate-200">{fmtRuc(tx.beforeBonusCash)}</td>
                  <td className="px-3 py-2 border-r border-slate-200">{tx.itemName ?? "-"}</td>
                  <td className="px-3 py-2 text-right border-r border-slate-200">{tx.itemQty ?? 1}</td>
                  <td className="px-3 py-2 text-right border-r border-slate-200">{fmtAbs(tx.itemPriceRuc ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-bold border-r border-slate-200">{fmtAbs(tx.totalPriceRuc ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-bold border-r border-slate-200">{fmtRuc(tx.afterRuCash)}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-700">{fmtRuc(tx.afterBonusCash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

// ─── 메인 Shop 페이지 ─────────────────────────────────────────────────────────
export default function PointShop() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"charge" | "charge-history" | "use-history">("charge");
  const { user } = useAuth();
  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, { enabled: !!user });
  const ruCash = balance?.ruCash ?? 0;
  const bonusCash = balance?.bonusCash ?? 0;
  const menus: { key: typeof tab; label: string }[] = [
    { key: "charge", label: "충전" },
    { key: "charge-history", label: "구매 내역" },
    { key: "use-history", label: "사용 내역" },
  ];
  return (
    <Layout>
      <div className="bg-[#9b2020] text-white py-8">
        <div className="container">
          <h1 className="text-3xl font-black tracking-tight">Shop</h1>
          <p className="text-red-200 text-sm mt-1">rCoin 충전 및 사용 내역</p>
        </div>
      </div>
      <div className="container py-8">
        <div className="flex gap-6">
          <aside className="hidden w-44 shrink-0 md:flex md:flex-col">
            <nav className="flex flex-col gap-1">
              {menus.map(m => (
                <button key={m.key} onClick={() => setTab(m.key)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${tab === m.key ? "bg-[#9b2020] text-white shadow-sm" : "bg-white text-slate-700 hover:bg-red-50 border border-slate-200"}`}>
                  {m.label}
                </button>
              ))}
            </nav>
            <button onClick={() => setLocation("/")} className="mt-auto inline-flex items-center gap-1 border-t border-slate-200 pt-6 text-left text-sm font-medium text-slate-500 transition-colors hover:text-[#9b2020]">
              <ChevronLeft size={16} />Back to Home
            </button>
          </aside>
          <main className="flex-1 min-w-0">
            <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
              {menus.map(m => (
                <button key={m.key} onClick={() => setTab(m.key)} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold ${tab === m.key ? "bg-[#9b2020] text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{m.label}</button>
              ))}
            </div>
            {tab === "charge" && <ChargeTab ruCash={ruCash} bonusCash={bonusCash} />}
            {tab === "charge-history" && <ChargeHistoryTab />}
            {tab === "use-history" && <UseHistoryTab />}
          </main>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-5 md:ml-[200px]">
          <p className="text-sm font-medium text-slate-500">결제 즉시 지급 <span className="mx-2 text-slate-300">·</span> 환불 정책 안내 <span className="mx-2 text-slate-300">·</span> 문의하기</p>
        </div>
      </div>
    </Layout>
  );
}
