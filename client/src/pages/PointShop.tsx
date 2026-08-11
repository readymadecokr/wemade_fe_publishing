import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// ─── 포인트 포맷 (콤마, 최대 9자 = 9,999,999) ─────────────────────────────────
function fmtRuc(n: number): string {
  const clamped = Math.min(n, 9999999);
  return clamped.toLocaleString("en-US");
}

function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "-";
  return new Date(d).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}

// ─── 잔액 바 ──────────────────────────────────────────────────────────────────
function BalanceBar({ ruCash, bonusCash }: { ruCash: number; bonusCash: number }) {
  return (
    <div className="flex items-center gap-4 bg-[#7a1a1a] text-white rounded-lg px-5 py-3 text-sm font-semibold">
      <span>RU Cash: <span className="text-yellow-300">{fmtRuc(ruCash)}</span></span>
      <span className="h-4 w-px bg-white/40" />
      <span>Bonus RU Cash: <span className="text-yellow-300">{fmtRuc(bonusCash)}</span></span>
    </div>
  );
}

// ─── 충전 탭 ──────────────────────────────────────────────────────────────────
function ChargeTab({ ruCash, bonusCash }: { ruCash: number; bonusCash: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: products = [] } = trpc.shop.listProducts.useQuery();

  return (
    <div className="space-y-6">
      <BalanceBar ruCash={ruCash} bonusCash={bonusCash} />
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">충전 상품 선택</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(products as any[]).map((p: any) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${selected === p.id ? "border-[#9b2020] bg-red-50 shadow-md" : "border-slate-200 bg-white hover:border-red-300"}`}
            >
              <div className="text-base font-bold text-slate-800 mb-1">{p.name}</div>
              <div className="text-sm text-slate-600 mb-2">
                <span className="font-semibold text-[#9b2020]">{fmtRuc(p.ruCashAmount)}</span> RU Cash
                {p.bonusCashAmount > 0 && (
                  <div className="text-xs text-green-700 mt-0.5">+{fmtRuc(p.bonusCashAmount)} Bonus</div>
                )}
              </div>
              <div className="text-xs font-bold text-slate-500">USD {Number(p.priceUsd).toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex-1">
            {(() => {
              const p = (products as any[]).find((x: any) => x.id === selected);
              if (!p) return null;
              return (
                <div className="text-sm text-slate-700">
                  <span className="font-bold">{p.name}</span> 선택됨 — {fmtRuc(p.ruCashAmount)} RU Cash{p.bonusCashAmount > 0 ? ` + ${fmtRuc(p.bonusCashAmount)} Bonus RU Cash` : ""} / USD {Number(p.priceUsd).toFixed(2)}
                </div>
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
      <p className="text-xs text-slate-400">※ 실제 결제는 PG 연동 후 이용 가능합니다. 현재는 상품 구성 확인 단계입니다.</p>
    </div>
  );
}

// ─── 현재 소지 상태 탭 ────────────────────────────────────────────────────────
function StatusTab({ ruCash, bonusCash }: { ruCash: number; bonusCash: number }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">현재 소지 상태</h2>
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

// ─── 구매 내역 탭 ─────────────────────────────────────────────────────────────
function ChargeHistoryTab() {
  const [page, setPage] = useState(1);
  const { data } = trpc.shop.myChargeHistory.useQuery({ page, pageSize: 10 });
  const items = (data?.items ?? []) as any[];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">구매 내역 (충전 내역)</h2>
      {!items.length ? (
        <div className="text-center py-12 text-slate-400 text-sm">충전 내역이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#9b2020] text-white">
                {["게임코드", "TIME", "충전전 RUC", "충전전 Bonus", "PG", "Price(USD)", "충전량 RUC", "충전량 Bonus", "충전후 RUC", "충전후 Bonus"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((tx: any) => (
                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2">{tx.gameCode ?? "ROU"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.beforeRuCash)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.beforeBonusCash)}</td>
                  <td className="px-3 py-2">{tx.pgName ?? "-"}</td>
                  <td className="px-3 py-2 text-right">{tx.priceUsd ? Number(tx.priceUsd).toFixed(2) : "-"}</td>
                  <td className="px-3 py-2 text-right text-[#9b2020] font-semibold">+{fmtRuc(tx.ruCashDelta)}</td>
                  <td className="px-3 py-2 text-right text-green-700 font-semibold">+{fmtRuc(tx.bonusCashDelta)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.afterRuCash)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.afterBonusCash)}</td>
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

// ─── 사용 내역 탭 ─────────────────────────────────────────────────────────────
function UseHistoryTab() {
  const [page, setPage] = useState(1);
  const { data } = trpc.shop.myUseHistory.useQuery({ page, pageSize: 10 });
  const items = (data?.items ?? []) as any[];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">사용 내역</h2>
      {!items.length ? (
        <div className="text-center py-12 text-slate-400 text-sm">사용 내역이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#9b2020] text-white">
                {["게임코드", "TIME", "사용전 RUC", "사용전 Bonus", "Item Name", "QTY", "Item Price", "Total Price", "잔량 RUC", "잔량 Bonus"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((tx: any) => (
                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2">{tx.gameCode ?? "ROU"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.beforeRuCash)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.beforeBonusCash)}</td>
                  <td className="px-3 py-2">{tx.itemName ?? "-"}</td>
                  <td className="px-3 py-2 text-right">{tx.itemQty ?? 1}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.itemPriceRuc ?? 0)}</td>
                  <td className="px-3 py-2 text-right text-[#9b2020] font-semibold">{fmtRuc(tx.totalPriceRuc ?? 0)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.afterRuCash)}</td>
                  <td className="px-3 py-2 text-right">{fmtRuc(tx.afterBonusCash)}</td>
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
      <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
        ※ 사용 시 Bonus RU Cash가 우선 차감되며, 부족분은 RU Cash에서 차감됩니다.
      </p>
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
        {!user ? (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-4">Shop을 이용하려면 로그인이 필요합니다.</p>
            <button onClick={() => setLocation("/login")} className="px-6 py-2 bg-[#9b2020] text-white font-bold rounded-lg hover:bg-[#7a1a1a] transition-colors">
              로그인
            </button>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* 좌측 메뉴 */}
            <aside className="w-48 shrink-0">
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
              {tab === "charge" && <ChargeTab ruCash={ruCash} bonusCash={bonusCash} />}
              {tab === "charge-history" && <ChargeHistoryTab />}
              {tab === "use-history" && <UseHistoryTab />}
            </main>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-200">
          <button onClick={() => setLocation("/")} className="inline-flex items-center gap-1 text-slate-500 hover:text-[#9b2020] text-sm font-medium transition-colors">
            <ChevronLeft size={16} />Back to Home
          </button>
        </div>
      </div>
    </Layout>
  );
}
