import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, CreditCard, Headphones, History, ShieldCheck, SlidersHorizontal, Sparkles, UserRound } from "lucide-react";
import Layout from "@/components/Layout";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

function fmtCoin(value: number) {
  return Math.min(Math.max(Number(value) || 0, 0), 9_999_999).toLocaleString("en-US");
}

const COIN_ICONS: Record<number, string> = {
  1: "/manus-storage/rcoin-product-normalized-1_3a54dcfa.png",
  2: "/manus-storage/rcoin-product-normalized-2_e83f10a6.png",
  3: "/manus-storage/rcoin-product-normalized-3_a2066f09.png",
  4: "/manus-storage/rcoin-product-normalized-4_c97d1b25.png",
  5: "/manus-storage/rcoin-product-normalized-5_1f2fcd6a.png",
  6: "/manus-storage/rcoin-product-normalized-6_f8d73a29.png",
  7: "/manus-storage/rcoin-product-normalized-7_1846f0d0.png",
  8: "/manus-storage/rcoin-product-normalized-8_0af9497e.png",
};

type Product = {
  id: number;
  sortOrder?: number | null;
  ruCashAmount: number;
  bonusCashAmount: number;
  priceUsd: number | string;
};

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, sortOrder: 1, ruCashAmount: 100, bonusCashAmount: 0, priceUsd: 1 },
  { id: 2, sortOrder: 2, ruCashAmount: 500, bonusCashAmount: 0, priceUsd: 5 },
  { id: 3, sortOrder: 3, ruCashAmount: 1000, bonusCashAmount: 50, priceUsd: 10 },
  { id: 4, sortOrder: 4, ruCashAmount: 1500, bonusCashAmount: 90, priceUsd: 15 },
  { id: 5, sortOrder: 5, ruCashAmount: 2000, bonusCashAmount: 150, priceUsd: 20 },
  { id: 6, sortOrder: 6, ruCashAmount: 3000, bonusCashAmount: 300, priceUsd: 30 },
  { id: 7, sortOrder: 7, ruCashAmount: 5000, bonusCashAmount: 625, priceUsd: 50 },
  { id: 8, sortOrder: 8, ruCashAmount: 10000, bonusCashAmount: 1500, priceUsd: 100 },
];

type ProductFilter = "all" | "recommended" | "special";

const primaryPaymentMethods = [
  { id: "goc", label: "GOC Pay", sublabel: "Recommended" },
  { id: "xsolla", label: "Xsolla", sublabel: "Global payments" },
  { id: "paypal", label: "PayPal", sublabel: "Pay securely" },
];
const extraPaymentMethods = [
  { id: "mycard", label: "MyCard" },
  { id: "ebanx", label: "EBANX" },
  { id: "payermax", label: "PayerMax" },
];

export function PurchaseDialog({ products, productId, open, onOpenChange, onSelectProduct }: { products: Product[]; productId: number | null; open: boolean; onOpenChange: (open: boolean) => void; onSelectProduct: (id: number) => void }) {
  const [priceOpen, setPriceOpen] = useState(false);
  const [method, setMethod] = useState("goc");
  const [showMore, setShowMore] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const selected = products.find(product => product.id === productId) ?? products[0];

  useEffect(() => {
    if (open) {
      setPriceOpen(false);
      setMethod("goc");
      setShowMore(false);
      setCaptchaChecked(false);
    }
  }, [open, productId]);

  if (!selected) return null;
  const bonusText = selected.bonusCashAmount > 0 ? ` +${fmtCoin(selected.bonusCashAmount)} Bonus` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1rem)] max-h-[90vh] max-w-[500px] overflow-x-hidden overflow-y-auto rounded-2xl border-cyan-300/25 bg-[#081326] p-0 text-slate-100 shadow-[0_0_42px_rgba(25,216,230,0.16)]">
        <div className="border-b border-cyan-300/15 px-6 py-5">
          <DialogTitle className="neon-kicker">Purchase rCoin</DialogTitle>
          <DialogDescription className="sr-only">Choose a package, payment method, and confirm the security check.</DialogDescription>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="whitespace-nowrap text-[22px] font-black leading-none tracking-tight text-slate-100">{fmtCoin(selected.ruCashAmount)} rCoin<span className="ml-1.5 text-emerald-400">{bonusText}</span></p>
            <div className="relative shrink-0">
              <button type="button" onClick={() => setPriceOpen(value => !value)} className="inline-flex min-w-[92px] items-center justify-between gap-2 rounded-lg border border-cyan-300/30 bg-slate-950/70 px-3 py-2 text-sm font-bold text-cyan-100 shadow-sm hover:border-cyan-300">
                ${Number(selected.priceUsd).toFixed(2)} <ChevronDown className="h-4 w-4" />
              </button>
              {priceOpen && <div className="absolute right-0 z-30 mt-2 max-h-52 w-28 overflow-y-auto rounded-lg border border-cyan-300/20 bg-[#0c1a2e] p-1 shadow-xl">
                {products.map(product => <button type="button" key={product.id} onClick={() => { onSelectProduct(product.id); setPriceOpen(false); }} className={`block w-full rounded px-2 py-2 text-left text-sm font-semibold hover:bg-cyan-300/10 ${product.id === selected.id ? "bg-cyan-300/10 text-cyan-300" : "text-slate-300"}`}>${Number(product.priceUsd).toFixed(2)}</button>)}
              </div>}
            </div>
          </div>
        </div>
        <div className="space-y-5 px-6 py-5">
          <section>
            <p className="mb-2 text-sm font-black text-slate-100">Payment Method</p>
            <div className="space-y-2">
              {primaryPaymentMethods.map(item => <button type="button" key={item.id} onClick={() => setMethod(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${method === item.id ? "border-cyan-300 bg-cyan-300/10 ring-1 ring-cyan-300/40" : "border-slate-700 hover:border-cyan-300/50"}`}><span className="font-bold text-slate-100">{item.label}</span><span className={`text-xs font-semibold ${item.id === "goc" ? "text-cyan-300" : "text-slate-400"}`}>{item.sublabel}</span></button>)}
              {showMore && extraPaymentMethods.map(item => <button type="button" key={item.id} onClick={() => setMethod(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${method === item.id ? "border-cyan-300 bg-cyan-300/10 ring-1 ring-cyan-300/40" : "border-slate-700 hover:border-cyan-300/50"}`}><span className="font-bold text-slate-100">{item.label}</span><span className="text-xs text-slate-400">Payment partner</span></button>)}
            </div>
            <button type="button" onClick={() => setShowMore(value => !value)} className="mt-3 text-sm font-bold text-cyan-300 hover:text-cyan-200">{showMore ? "Show less" : "More payment methods"}</button>
          </section>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-300">
            <input type="checkbox" checked={captchaChecked} onChange={event => setCaptchaChecked(event.target.checked)} className="h-5 w-5 rounded border-slate-500 text-cyan-300 focus:ring-cyan-300" />
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-300" />I am not a robot</span>
          </label>
        </div>
        <div className="border-t border-cyan-300/15 px-6 py-4"><button type="button" disabled={!captchaChecked} onClick={() => alert("Payment provider integration will be available soon.")} className="w-full rounded-lg bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">Pay ${Number(selected.priceUsd).toFixed(2)}</button></div>
      </DialogContent>
    </Dialog>
  );
}

function AccountPanel({ rCoin, bonusCoin, onHistory }: { rCoin: number; bonusCoin: number; onHistory: () => void }) {
  const nickname = localStorage.getItem("rou_nickname") || "ADVENTURER";
  return <aside className="neon-panel flex h-full min-h-[640px] flex-col rounded-2xl p-4 lg:sticky lg:top-24">
    <div className="flex flex-col items-center border-b border-cyan-300/15 pb-5">
      <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/35 bg-[radial-gradient(circle_at_30%_20%,rgba(25,216,230,.2),transparent_45%),#0a1222] shadow-[0_0_24px_rgba(25,216,230,.16)]"><UserRound className="h-9 w-9 text-slate-500" /><span className="absolute -bottom-2 rounded-full border border-cyan-300/25 bg-[#0c1b2c] px-2 py-0.5 text-[9px] font-black tracking-wider text-cyan-200">ROU</span></div>
      <p className="text-base font-black tracking-wide text-slate-100">{nickname}</p>
    </div>
    <div className="mt-4 overflow-hidden rounded-xl border border-cyan-300/15 bg-slate-950/60">
      <div className="flex items-center justify-between border-b border-cyan-300/10 px-3 py-3"><span className="text-xs font-bold text-rose-300">rCoin</span><span className="text-lg font-black text-rose-400">{fmtCoin(rCoin)}</span></div>
      <div className="flex items-center justify-between px-3 py-3"><span className="text-xs font-bold text-emerald-300">Bonus rCoin</span><span className="text-lg font-black text-emerald-400">{fmtCoin(bonusCoin)}</span></div>
    </div>
    <nav className="mt-5 space-y-1.5" aria-label="Shop navigation">
      <a href="#top-up" className="flex items-center gap-3 rounded-lg border border-rose-400/20 bg-[linear-gradient(90deg,rgba(251,63,104,.22),rgba(251,63,104,.02))] px-3 py-3 text-sm font-black text-slate-100"><CreditCard className="h-4 w-4 text-rose-300" />TOP UP</a>
      <button type="button" onClick={onHistory} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold text-slate-400 transition-colors hover:bg-cyan-300/10 hover:text-cyan-200"><History className="h-4 w-4" />PURCHASE HISTORY</button>
      <button type="button" onClick={onHistory} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold text-slate-400 transition-colors hover:bg-cyan-300/10 hover:text-cyan-200"><SlidersHorizontal className="h-4 w-4" />USAGE HISTORY</button>
    </nav>
    <div className="mt-5 border-t border-cyan-300/10 pt-5"><p className="mb-2 text-[10px] font-black tracking-[0.18em] text-slate-500">FILTER</p><div className="flex gap-2"><span className="rounded-md border border-cyan-300/35 bg-cyan-300/10 px-2.5 py-1.5 text-[10px] font-black text-cyan-200">ALL</span><span className="rounded-md border border-slate-700 px-2.5 py-1.5 text-[10px] font-bold text-slate-500">RECOMMENDED</span></div></div>
    <button type="button" className="mt-auto flex items-center gap-3 rounded-xl border border-cyan-300/15 bg-slate-950/45 p-3 text-left transition-colors hover:border-cyan-300/35"><Headphones className="h-5 w-5 text-cyan-300" /><span><span className="block text-xs font-black text-slate-200">NEED HELP?</span><span className="text-[10px] text-slate-500">Visit our Support Center</span></span></button>
  </aside>;
}

function ShopContent({ rCoin, bonusCoin }: { rCoin: number; bonusCoin: number }) {
  const [, setLocation] = useLocation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [filter, setFilter] = useState<ProductFilter>("all");
  const { data: products } = trpc.shop.listProducts.useQuery();
  const orderedProducts = useMemo(() => [...((products?.length ? products : FALLBACK_PRODUCTS) as Product[])].sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id)), [products]);
  const visibleProducts = orderedProducts.filter((product, index) => {
    const order = product.sortOrder ?? index + 1;
    return filter === "all" || (filter === "recommended" ? order === 4 || order === 8 : product.bonusCashAmount > 0);
  });
  const startTopUp = () => document.getElementById("top-up")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return <div className="container py-5 lg:py-7">
    <div className="grid gap-5 lg:grid-cols-[286px_minmax(0,1fr)]">
      <AccountPanel rCoin={rCoin} bonusCoin={bonusCoin} onHistory={() => setLocation("/mypage")} />
      <main className="min-w-0 space-y-5">
        <section className="relative min-h-[238px] overflow-hidden rounded-2xl border border-cyan-300/35 bg-[linear-gradient(112deg,rgba(4,19,39,.98),rgba(15,28,59,.88)_54%,rgba(31,12,49,.83))] p-7 shadow-[0_0_34px_rgba(25,216,230,.12)] sm:p-9">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" /><div className="absolute bottom-0 left-[45%] h-40 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative z-10 max-w-[60%] sm:max-w-[55%]"><p className="neon-kicker mb-3">rCoin rewards</p><h1 className="font-serif text-4xl font-black leading-[.95] text-slate-100 sm:text-5xl">POWER UP<br /><span className="text-cyan-200">YOUR ADVENTURE</span></h1><p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">Top up rCoin and unlock limitless possibilities in Ragnarok Universe.</p><button type="button" onClick={startTopUp} className="mt-5 rounded-lg border border-cyan-200/60 bg-cyan-300 px-6 py-2.5 text-sm font-black text-slate-950 shadow-[0_0_22px_rgba(25,216,230,.34)] transition hover:bg-cyan-200">TOP UP NOW</button></div>
          <img src={COIN_ICONS[8]} alt="rCoin treasure package" className="absolute bottom-0 right-2 z-10 h-[86%] w-[46%] object-contain object-bottom opacity-95 sm:right-7" />
        </section>
        <section id="top-up" className="scroll-mt-24">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="neon-kicker">Choose your amount</p><h2 className="mt-1 text-2xl font-black text-slate-100">Top Up rCoin</h2></div><div className="flex rounded-lg border border-cyan-300/15 bg-slate-950/55 p-1">{(["all", "recommended", "special"] as ProductFilter[]).map(value => <button type="button" key={value} onClick={() => setFilter(value)} className={`rounded-md px-3 py-1.5 text-[10px] font-black uppercase tracking-wide transition ${filter === value ? "bg-cyan-300/15 text-cyan-200" : "text-slate-500 hover:text-slate-300"}`}>{value}</button>)}</div></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {visibleProducts.map((product, index) => {
              const order = product.sortOrder ?? index + 1;
              const displayOrder = orderedProducts.findIndex(candidate => candidate.id === product.id) + 1;
              const isBestSeller = displayOrder === 4;
              const isBestValue = displayOrder === 8;
              return <button type="button" key={product.id} data-shop-product={product.id} onClick={() => { setSelectedId(product.id); setPurchaseOpen(true); }} className={`group relative overflow-hidden rounded-2xl border bg-[linear-gradient(155deg,rgba(13,31,52,.97),rgba(4,12,27,.98))] text-center shadow-[0_0_24px_rgba(25,216,230,.07)] transition duration-200 hover:-translate-y-1 hover:border-cyan-200/75 hover:shadow-[0_0_30px_rgba(25,216,230,.2)] ${isBestValue ? "border-amber-300/45" : "border-cyan-300/25"}`}>
                {(isBestSeller || isBestValue) && <span className={`absolute right-0 top-0 z-20 rounded-bl-xl px-3 py-2 text-[10px] font-black leading-none text-white ${isBestSeller ? "bg-rose-600" : "bg-amber-500 text-slate-950"}`}>{isBestSeller ? "BEST\nSELLER" : "BEST\nVALUE"}</span>}
                <div className="border-b border-cyan-300/10 px-3 pb-1 pt-4"><p className="text-xs font-bold text-rose-300">rCoin</p><p className="text-2xl font-black text-rose-400">{fmtCoin(product.ruCashAmount)}</p><div className="relative mx-auto mt-1 h-28 w-full overflow-hidden"><div className="absolute inset-x-3 bottom-1 h-8 rounded-full bg-cyan-300/10 blur-xl" /><img src={COIN_ICONS[order] ?? COIN_ICONS[index + 1]} alt={`${fmtCoin(product.ruCashAmount)} rCoin package`} className="relative z-10 mx-auto h-full w-full object-contain transition duration-300 group-hover:scale-105" /></div></div>
                <div className="flex items-center justify-center gap-2 bg-slate-950/50 px-3 py-2 text-xs"><span className="text-emerald-300">Bonus rCoin</span><span className="font-black text-emerald-400">+{fmtCoin(product.bonusCashAmount)}</span></div><div className="border-t border-cyan-300/15 py-2.5 text-xl font-black text-slate-100">${Number(product.priceUsd).toFixed(2)}</div>
              </button>;
            })}
          </div>
        </section>
        <p className="text-center text-xs text-slate-500">All prices are shown in USD. rCoin is bound to your account. Bonus rCoin is used first.</p>
      </main>
    </div>
    <PurchaseDialog products={orderedProducts} productId={selectedId} open={purchaseOpen} onOpenChange={setPurchaseOpen} onSelectProduct={setSelectedId} />
  </div>;
}

export default function PointShop() {
  const { user } = useAuth();
  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, { enabled: !!user });
  return <Layout><ShopContent rCoin={balance?.ruCash ?? 0} bonusCoin={balance?.bonusCash ?? 0} /></Layout>;
}
