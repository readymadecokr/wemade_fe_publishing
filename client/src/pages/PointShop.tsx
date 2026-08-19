import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Check, ChevronDown, ChevronLeft, ShieldCheck } from "lucide-react";
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

function BalanceCards({ rCoin, bonusCoin }: { rCoin: number; bonusCoin: number }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="neon-card px-6 py-5">
        <p className="neon-kicker">rCoin</p>
        <p className="mt-1 text-3xl font-black text-rose-400">{fmtCoin(rCoin)}</p>
        <p className="mt-1 text-xs text-slate-400">Paid Currency</p>
      </div>
      <div className="neon-card px-6 py-5">
        <p className="neon-kicker">Bonus rCoin</p>
        <p className="mt-1 text-3xl font-black text-emerald-400">{fmtCoin(bonusCoin)}</p>
        <p className="mt-1 text-xs text-slate-400">Bonus Currency (Used First)</p>
      </div>
    </section>
  );
}

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
              {primaryPaymentMethods.map(item => <button type="button" key={item.id} onClick={() => setMethod(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${method === item.id ? "border-cyan-300 bg-cyan-300/10 ring-1 ring-cyan-300/40" : "border-slate-700 hover:border-cyan-300/50"}`}>
                <span className="font-bold text-slate-100">{item.label}</span><span className={`text-xs font-semibold ${item.id === "goc" ? "text-cyan-300" : "text-slate-400"}`}>{item.sublabel}</span>
              </button>)}
              {showMore && extraPaymentMethods.map(item => <button type="button" key={item.id} onClick={() => setMethod(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${method === item.id ? "border-cyan-300 bg-cyan-300/10 ring-1 ring-cyan-300/40" : "border-slate-700 hover:border-cyan-300/50"}`}><span className="font-bold text-slate-100">{item.label}</span><span className="text-xs text-slate-400">Payment partner</span></button>)}
            </div>
            <button type="button" onClick={() => setShowMore(value => !value)} className="mt-3 text-sm font-bold text-cyan-300 hover:text-cyan-200">{showMore ? "Show less" : "More payment methods"}</button>
          </section>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-300">
            <input type="checkbox" checked={captchaChecked} onChange={event => setCaptchaChecked(event.target.checked)} className="h-5 w-5 rounded border-slate-500 text-cyan-300 focus:ring-cyan-300" />
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-300" />I am not a robot</span>
          </label>
        </div>
        <div className="border-t border-cyan-300/15 px-6 py-4">
          <button type="button" disabled={!captchaChecked} onClick={() => alert("Payment provider integration will be available soon.")} className="w-full rounded-lg bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">Pay ${Number(selected.priceUsd).toFixed(2)}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChargeTab({ rCoin, bonusCoin }: { rCoin: number; bonusCoin: number }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const { data: products = [] } = trpc.shop.listProducts.useQuery();
  const orderedProducts = useMemo(() => [...(products as Product[])].sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id)), [products]);

  return (
    <div className="space-y-5">
      <BalanceCards rCoin={rCoin} bonusCoin={bonusCoin} />
      <div className="flex flex-col items-start gap-1 border-b border-cyan-300/15 pb-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>All prices are shown in USD.</span><span>rCoin is bound to your account.</span></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {orderedProducts.map((product, index) => {
          const order = product.sortOrder ?? index + 1;
          const isBestSeller = order === 5;
          const isBestValue = order === 8;
          return <button type="button" key={product.id} data-shop-product={product.id} onClick={() => { setSelectedId(product.id); setPurchaseOpen(true); }} className="relative min-h-[154px] rounded-2xl border border-cyan-300/15 bg-[linear-gradient(145deg,rgba(12,26,46,.95),rgba(6,13,28,.95))] p-4 text-left shadow-[0_0_20px_rgba(25,216,230,0.05)] transition-all hover:-translate-y-0.5 hover:border-cyan-300/55 hover:shadow-[0_0_26px_rgba(25,216,230,0.15)]">
            {(isBestSeller || isBestValue) && <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-sm ${isBestSeller ? "bg-rose-500" : "bg-violet-500"}`}>{isBestSeller ? "Best Seller" : "Best Value"}</span>}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center"><img src={COIN_ICONS[order] ?? COIN_ICONS[index + 1]} alt="rCoin package" className="h-[76px] w-[76px] object-contain" /></div>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-x-1 gap-y-1"><span className="text-2xl font-black leading-none text-slate-100">{fmtCoin(product.ruCashAmount)}</span><span className="text-sm font-bold text-slate-300">rCoin</span>{product.bonusCashAmount > 0 && <span className="text-sm font-black text-emerald-400">+{fmtCoin(product.bonusCashAmount)} Bonus</span>}</div></div>
            </div>
            <div className="mt-3 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-center text-lg font-black text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_3px_0_rgba(6,104,116,.38)]">${Number(product.priceUsd).toFixed(2)}</div>
          </button>;
        })}
      </div>
      <PurchaseDialog products={orderedProducts} productId={selectedId} open={purchaseOpen} onOpenChange={setPurchaseOpen} onSelectProduct={setSelectedId} />
    </div>
  );
}

export default function PointShop() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, { enabled: !!user });
  return <Layout>
    <div className="relative overflow-hidden border-b border-cyan-300/20 bg-[linear-gradient(120deg,#081b32_0%,#091326_44%,#27123d_100%)] py-12 text-white"><div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-cyan-300/15 blur-3xl" /><div className="container relative"><p className="neon-kicker mb-2">Secure top up</p><h1 className="text-4xl font-black mb-2">Shop</h1><p className="text-slate-300">Top up rCoin</p></div></div>
    <div className="container py-8"><div className="flex gap-6"><aside className="hidden w-44 shrink-0 md:flex md:flex-col"><button className="rounded-lg border border-cyan-300/30 bg-cyan-300/15 px-4 py-3 text-left text-sm font-bold text-cyan-100 shadow-[0_0_18px_rgba(25,216,230,.1)]">Top Up</button><button onClick={() => setLocation("/")} className="mt-auto inline-flex items-center gap-1 border-t border-cyan-300/15 pt-6 text-left text-sm font-medium text-slate-400 hover:text-cyan-300"><ChevronLeft size={16} />Back to Home</button></aside><main className="min-w-0 flex-1"><ChargeTab rCoin={balance?.ruCash ?? 0} bonusCoin={balance?.bonusCash ?? 0} /></main></div></div>
  </Layout>;
}
