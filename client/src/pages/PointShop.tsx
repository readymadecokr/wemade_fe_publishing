import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Check, ChevronDown, ChevronLeft, Coins, ShieldCheck } from "lucide-react";
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
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">rCoin</p>
        <p className="mt-1 text-3xl font-black text-[#a51f24]">{fmtCoin(rCoin)}</p>
        <p className="mt-1 text-xs text-slate-400">Paid Currency</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Bonus rCoin</p>
        <p className="mt-1 text-3xl font-black text-green-700">{fmtCoin(bonusCoin)}</p>
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
      <DialogContent className="w-[calc(100%-1rem)] max-h-[90vh] max-w-[500px] overflow-x-hidden overflow-y-auto rounded-2xl border-slate-200 bg-white p-0 text-slate-900">
        <div className="border-b border-slate-200 px-6 py-5">
          <DialogTitle className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Purchase rCoin</DialogTitle>
          <DialogDescription className="sr-only">Choose a package, payment method, and confirm the security check.</DialogDescription>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="whitespace-nowrap text-[22px] font-black leading-none tracking-tight text-slate-950">{fmtCoin(selected.ruCashAmount)} rCoin<span className="ml-1.5 text-green-700">{bonusText}</span></p>
            <div className="relative shrink-0">
              <button type="button" onClick={() => setPriceOpen(value => !value)} className="inline-flex min-w-[92px] items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm hover:border-blue-400">
                ${Number(selected.priceUsd).toFixed(2)} <ChevronDown className="h-4 w-4" />
              </button>
              {priceOpen && <div className="absolute right-0 z-30 mt-2 max-h-52 w-28 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-xl">
                {products.map(product => <button type="button" key={product.id} onClick={() => { onSelectProduct(product.id); setPriceOpen(false); }} className={`block w-full rounded px-2 py-2 text-left text-sm font-semibold hover:bg-blue-50 ${product.id === selected.id ? "bg-blue-50 text-blue-700" : "text-slate-700"}`}>${Number(product.priceUsd).toFixed(2)}</button>)}
              </div>}
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <section>
            <p className="mb-2 text-sm font-black text-slate-800">Payment Method</p>
            <div className="space-y-2">
              {primaryPaymentMethods.map(item => <button type="button" key={item.id} onClick={() => setMethod(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${method === item.id ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-200 hover:border-blue-300"}`}>
                <span className="font-bold text-slate-800">{item.label}</span><span className={`text-xs font-semibold ${item.id === "goc" ? "text-blue-600" : "text-slate-400"}`}>{item.sublabel}</span>
              </button>)}
              {showMore && extraPaymentMethods.map(item => <button type="button" key={item.id} onClick={() => setMethod(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${method === item.id ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-200 hover:border-blue-300"}`}><span className="font-bold text-slate-800">{item.label}</span><span className="text-xs text-slate-400">Payment partner</span></button>)}
            </div>
            <button type="button" onClick={() => setShowMore(value => !value)} className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700">{showMore ? "Show less" : "More payment methods"}</button>
          </section>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <input type="checkbox" checked={captchaChecked} onChange={event => setCaptchaChecked(event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-slate-500" />I am not a robot</span>
          </label>
        </div>
        <div className="border-t border-slate-200 px-6 py-4">
          <button type="button" disabled={!captchaChecked} onClick={() => alert("Payment provider integration will be available soon.")} className="w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300">Pay ${Number(selected.priceUsd).toFixed(2)}</button>
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
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm text-slate-500"><span>All prices are shown in USD.</span><span>rCoin is bound to your account.</span></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {orderedProducts.map((product, index) => {
          const order = product.sortOrder ?? index + 1;
          const isBestSeller = order === 5;
          const isBestValue = order === 8;
          return <button type="button" key={product.id} data-shop-product={product.id} onClick={() => { setSelectedId(product.id); setPurchaseOpen(true); }} className="relative min-h-[154px] rounded-2xl border border-[#e7e2c9] bg-[#faf9f2] p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md">
            {(isBestSeller || isBestValue) && <span className={`absolute -left-1 -top-3 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-sm ${isBestSeller ? "bg-[#a51f24]" : "bg-[#5d4387]"}`}>{isBestSeller ? "Best Seller" : "Best Value"}</span>}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center"><img src={COIN_ICONS[order] ?? COIN_ICONS[index + 1]} alt="rCoin package" className="h-[76px] w-[76px] object-contain" /></div>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-x-1 gap-y-1"><span className="text-2xl font-black leading-none text-slate-950">{fmtCoin(product.ruCashAmount)}</span><span className="text-sm font-bold text-slate-600">rCoin</span>{product.bonusCashAmount > 0 && <span className="text-sm font-black text-green-700">+{fmtCoin(product.bonusCashAmount)} Bonus</span>}</div></div>
            </div>
            <div className="mt-3 rounded-lg border border-[#e4a100] bg-gradient-to-b from-[#fff39b] via-[#ffd52b] to-[#f1ad05] px-3 py-2 text-center text-lg font-black text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_3px_0_rgba(188,117,0,.52)]">${Number(product.priceUsd).toFixed(2)}</div>
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
    <div className="bg-[#a51f24] py-12 text-white"><div className="container"><div className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25"><Coins size={28} strokeWidth={2.2} /></span><h1 className="text-4xl font-black tracking-tight">Shop</h1></div><p className="mt-2 text-red-100">Top up rCoin</p></div></div>
    <div className="container py-8"><div className="flex gap-6"><aside className="hidden w-44 shrink-0 md:flex md:flex-col"><button className="rounded-lg bg-[#a51f24] px-4 py-3 text-left text-sm font-bold text-white shadow-sm">Top Up</button><button onClick={() => setLocation("/")} className="mt-auto inline-flex items-center gap-1 border-t border-slate-200 pt-6 text-left text-sm font-medium text-slate-500 hover:text-[#a51f24]"><ChevronLeft size={16} />Back to Home</button></aside><main className="min-w-0 flex-1"><ChargeTab rCoin={balance?.ruCash ?? 0} bonusCoin={balance?.bonusCash ?? 0} /></main></div></div>
  </Layout>;
}
