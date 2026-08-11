import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// ─── 포맷 유틸 ────────────────────────────────────────────────────────────────
function fmtRuc(n: number): string {
  return Math.min(n, 9999999).toLocaleString("en-US");
}

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

// ─── 잔액 바 (PDF 12페이지: 검정 배경, RU Cash | Bonus RU Cash 두 칸) ─────────
function BalanceBar({ ruCash, bonusCash }: { ruCash: number; bonusCash: number }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-slate-200 text-sm font-bold mb-6">
      <div className="flex-1 bg-[#1a1a1a] text-white px-6 py-3">
        RU Cash: <span className="text-white font-black ml-1">{fmtRuc(ruCash)}</span>
      </div>
      <div className="flex-1 bg-[#2a2a2a] text-white px-6 py-3 border-l border-slate-600">
        Bonus RU Cash: <span className="text-white font-black ml-1">{fmtRuc(bonusCash)}</span>
      </div>
    </div>
  );
}

// ─── 충전 탭 (PDF 12페이지: $금액 / RUC / +Bonus 카드 4열) ───────────────────
function ChargeTab({ ruCash, bonusCash, isLoggedIn = true }: { ruCash: number; bonusCash: number; isLoggedIn?: boolean }) { // eslint-disable-line
  const [selected, setSelected] = useState<number | null>(null);
  const { data: products = [] } = trpc.shop.listProducts.useQuery();

  return (
    <div>
      {isLoggedIn && <BalanceBar ruCash={ruCash} bonusCash={bonusCash} />}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(products as any[]).map((p: any) => {
          const isSelected = selected === p.id;
          const total = p.ruCashAmount + p.bonusCashAmount;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`rounded-xl border-2 p-5 text-center transition-all hover:shadow-lg flex flex-col gap-1 ${isSelected ? "border-[#9b2020] bg-red-50 shadow-lg" : "border-slate-200 bg-white hover:border-red-300"}`}
            >
              {/* 1줄: 합계 지급량 - 가장 크게 강조 */}
              <div className="text-xl font-black text-[#9b2020] leading-tight">{fmtRuc(total)}<span className="text-sm font-bold ml-1">RUC</span></div>
              {/* 2줄: RUC + Bonus 구성 */}
              {p.bonusCashAmount > 0 ? (
                <div className="text-xs font-semibold text-green-600">{fmtRuc(p.ruCashAmount)} RUC + {fmtRuc(p.bonusCashAmount)} Bonus</div>
              ) : (
                <div className="text-xs text-transparent">-</div>
              )}
              {/* 3줄: USD 금액 */}
              <div className="text-base font-black text-slate-800 mt-1">{p.name}</div>
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
              return (
                <span>
                  <strong>{p.name}</strong> 선택됨 — 합계 <strong className="text-[#9b2020]">{fmtRuc(total)} RUC</strong>
                  {p.bonusCashAmount > 0 ? <span className="text-green-600"> ({fmtRuc(p.ruCashAmount)} + {fmtRuc(p.bonusCashAmount)} Bonus)</span> : ""}
                </span>
              );
            })()}
          </div>
          <button
            className="px-6 py-2 bg-[#9b2020] hover:bg-[#7a1a1a] text-white font-bold rounded-lg text-sm transition-colors"
            onClick={() => alert("PG 결제 연동 후 이용 가능합니다.")}
          >
            충전하기
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 현재 소지 상태 탭 ────────────────────────────────────────────────────────
function StatusTab({ ruCash, bonusCash }: { ruCash: number; bonusCash: number }) {
  return (
    <div className="space-y-4">
      <BalanceBar ruCash={ruCash} bonusCash={bonusCash} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wide">RU Cash</div>
          <div className="text-3xl font-black text-[#9b2020]">{fmtRuc(ruCash)}</div>
          <div className="text-xs text-slate-400 mt-1">유료 충전 캐시</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wide">Bonus RU Cash</div>
          <div className="text-3xl font-black text-green-700">{fmtRuc(bonusCash)}</div>
          <div className="text-xs text-slate-400 mt-1">보너스 캐시 (우선 차감)</div>
        </div>
      </div>
      <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
        ※ 사용 시 Bonus RU Cash가 우선 차감되며, 부족분은 RU Cash에서 차감됩니다.<br />
        ※ 소지 한도: 최대 9,999,999 (콤마 포함 9자리)
      </div>
    </div>
  );
}

// ─── 구매 내역 탭 (PDF 14페이지) ──────────────────────────────────────────────
// 컬럼: 게임코드 / TIME / 충전전 RUC / 충전전 Bonus / PG / Price / 충전량 RUC / 충전량 Bonus / 충전후 RUC / 충전후 Bonus
function ChargeHistoryTab() {
  const [page, setPage] = useState(1);
  const { data } = trpc.shop.myChargeHistory.useQuery({ page, pageSize: 10 });
  const items = (data?.items ?? []) as any[];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  const COLS = [
    { label: "게임코드", key: "gameCode" },
    { label: "TIME", key: "time" },
    { label: "충전전 RUC", key: "beforeRuCash" },
    { label: "충전전 Bonus", key: "beforeBonusCash" },
    { label: "PG", key: "pgName" },
    { label: "Price", key: "priceUsd" },
    { label: "충전량 RUC", key: "ruCashDelta" },
    { label: "충전량 Bonus", key: "bonusCashDelta" },
    { label: "충전후 RUC", key: "afterRuCash" },
    { label: "충전후 Bonus", key: "afterBonusCash" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-800">구매 내역</h2>
      {!items.length ? (
        <div className="text-center py-12 text-slate-400 text-sm">충전 내역이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#9b2020] text-white">
                {COLS.map(c => (
                  <th key={c.key} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((tx: any) => (
                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-[#9b2020]">{tx.gameCode ?? "ROU"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.beforeRuCash)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.beforeBonusCash)}</td>
                  <td className="px-3 py-2">{tx.pgName ?? "-"}</td>
                  <td className="px-3 py-2 text-right">{tx.priceUsd ? `$${Number(tx.priceUsd).toFixed(0)}` : "-"}</td>
                  <td className="px-3 py-2 text-right font-bold text-[#9b2020]">{fmtRuc(tx.ruCashDelta)}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-700">{fmtRuc(tx.bonusCashDelta)}</td>
                  <td className="px-3 py-2 text-right font-bold">{fmtRuc(tx.afterRuCash)}</td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700">{fmtRuc(tx.afterBonusCash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
          <button onClick={() => setPage(1)} disabled={page === 1} className="w-10 h-9 border rounded text-sm disabled:opacity-40">«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-9 border rounded text-sm disabled:opacity-40">‹</button>
          <span className="w-16 h-9 border rounded text-sm flex items-center justify-center font-medium">{page}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-10 h-9 border rounded text-sm disabled:opacity-40">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="w-10 h-9 border rounded text-sm disabled:opacity-40">»</button>
        </div>
      )}
    </div>
  );
}

// ─── 사용 내역 탭 (PDF 16페이지) ──────────────────────────────────────────────
// 컬럼: 게임코드 / TIME / 사용전 RUC / 사용전 Bonus / Item Name / QTY / Item Price / Total Price / 잔량 RUC / 잔량 Bonus
function UseHistoryTab() {
  const [page, setPage] = useState(1);
  const { data } = trpc.shop.myUseHistory.useQuery({ page, pageSize: 10 });
  const items = (data?.items ?? []) as any[];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  const COLS = [
    { label: "게임코드", key: "gameCode" },
    { label: "TIME", key: "time" },
    { label: "사용전 RUC", key: "beforeRuCash" },
    { label: "사용전 Bonus", key: "beforeBonusCash" },
    { label: "Item Name", key: "itemName" },
    { label: "QTY", key: "itemQty" },
    { label: "Item Price", key: "itemPriceRuc" },
    { label: "Total Price", key: "totalPriceRuc" },
    { label: "잔량 RUC", key: "afterRuCash" },
    { label: "잔량 Bonus", key: "afterBonusCash" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-800">사용 내역</h2>
      {!items.length ? (
        <div className="text-center py-12 text-slate-400 text-sm">사용 내역이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#9b2020] text-white">
                {COLS.map(c => (
                  <th key={c.key} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((tx: any) => (
                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-[#9b2020]">{tx.gameCode ?? "ROU"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                  <td className="px-3 py-2 text-right font-bold text-[#9b2020]">{fmtRuc(tx.beforeRuCash)}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-700">{fmtRuc(tx.beforeBonusCash)}</td>
                  <td className="px-3 py-2">{tx.itemName ?? "-"}</td>
                  <td className="px-3 py-2 text-right">{tx.itemQty ?? 1}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.itemPriceRuc ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-bold">{fmtRuc(tx.totalPriceRuc ?? 0)}</td>
                  <td className="px-3 py-2 text-right font-bold text-[#9b2020]">{fmtRuc(tx.afterRuCash)}</td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700">{tx.afterBonusCash === 0 ? <span className="text-slate-400">0</span> : fmtRuc(tx.afterBonusCash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
          <button onClick={() => setPage(1)} disabled={page === 1} className="w-10 h-9 border rounded text-sm disabled:opacity-40">«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-9 border rounded text-sm disabled:opacity-40">‹</button>
          <span className="w-16 h-9 border rounded text-sm flex items-center justify-center font-medium">{page}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-10 h-9 border rounded text-sm disabled:opacity-40">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="w-10 h-9 border rounded text-sm disabled:opacity-40">»</button>
        </div>
      )}
    </div>
  );
}

// ─── 메인 Shop 페이지 ─────────────────────────────────────────────────────────
export default function PointShop() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"status" | "charge" | "charge-history" | "use-history">("charge");
  const { user } = useAuth();

  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, { enabled: !!user });
  const ruCash = balance?.ruCash ?? 0;
  const bonusCash = balance?.bonusCash ?? 0;

  const menus: { key: typeof tab; label: string }[] = [
    { key: "status", label: "현재 소지 상태" },
    { key: "charge", label: "충전" },
    { key: "charge-history", label: "구매 내역" },
    { key: "use-history", label: "사용 내역" },
  ];

  return (
    <Layout>
      {/* 페이지 타이틀 */}
      <div className="bg-[#9b2020] text-white py-8">
        <div className="container">
          <h1 className="text-3xl font-black tracking-tight">Shop</h1>
          <p className="text-red-200 text-sm mt-1">RU Cash 충전 및 사용 내역</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-6">
          {/* 좌측 메뉴 */}
          <aside className="w-44 shrink-0">
            <nav className="flex flex-col gap-1">
              {menus.map(m => (
                <button
                  key={m.key}
                  onClick={() => setTab(m.key)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${tab === m.key ? "bg-[#9b2020] text-white shadow-sm" : "bg-white text-slate-700 hover:bg-red-50 border border-slate-200"}`}
                >
                  {m.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* 우측 본문 */}
          <main className="flex-1 min-w-0">
            {tab === "status" && <StatusTab ruCash={ruCash} bonusCash={bonusCash} />}
            {tab === "charge" && <ChargeTab ruCash={ruCash} bonusCash={bonusCash} isLoggedIn={!!user} />}
            {tab === "charge-history" && <ChargeHistoryTab />}
            {tab === "use-history" && <UseHistoryTab />}
          </main>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <button onClick={() => setLocation("/")} className="inline-flex items-center gap-1 text-slate-500 hover:text-[#9b2020] text-sm font-medium transition-colors">
            <ChevronLeft size={16} />Back to Home
          </button>
        </div>
      </div>
    </Layout>
  );
}
