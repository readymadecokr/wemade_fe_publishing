import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";
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
  4: "/manus-storage/rcoin-product-normalized-4-original_0c88b775.png",
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
  currency?: "TWD" | "USD" | string;
};

function formatPrice(product: Pick<Product, "priceUsd" | "currency">) {
  const currency = product.currency === "TWD" ? "TWD" : "USD";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: currency === "TWD" ? 0 : 2, maximumFractionDigits: currency === "TWD" ? 0 : 2 }).format(Number(product.priceUsd));
}

function BalanceCards({ rCoin, bonusCoin }: { rCoin: number; bonusCoin: number }) {
  return <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="fantasy-card rounded-xl px-6 py-5">
      <p className="text-xs font-black uppercase tracking-wide text-[#786850]">rCoin</p>
      <p className="mt-1 text-3xl font-black text-[#a51f24]">{fmtCoin(rCoin)}</p>
      <p className="mt-1 text-xs text-[#8a795e]">Paid Currency</p>
    </div>
    <div className="fantasy-card rounded-xl px-6 py-5">
      <p className="text-xs font-black uppercase tracking-wide text-[#786850]">Bonus rCoin</p>
      <p className="mt-1 text-3xl font-black text-green-700">{fmtCoin(bonusCoin)}</p>
      <p className="mt-1 text-xs text-[#8a795e]">Bonus Currency (Used First)</p>
    </div>
  </section>;
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
const shopEntryProviders = [
  { id: "mycard", label: "MyCard", description: "Taiwan payment service", currency: "TWD" },
  { id: "xsolla", label: "Xsolla", description: "Global payments", currency: "USD" },
  { id: "goc", label: "GOC Pay", description: "Game-focused payments", currency: "USD" },
] as const;
type ShopEntryProvider = (typeof shopEntryProviders)[number]["id"];

export function PurchaseDialog({ products, productId, open, onOpenChange, onSelectProduct, defaultMethod = "goc" }: { products: Product[]; productId: number | null; open: boolean; onOpenChange: (open: boolean) => void; onSelectProduct: (id: number) => void; defaultMethod?: string }) {
  const [priceOpen, setPriceOpen] = useState(false);
  const [method, setMethod] = useState(defaultMethod);
  const [showMore, setShowMore] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const selected = products.find(product => product.id === productId) ?? products[0];

  useEffect(() => {
    if (open) {
      setPriceOpen(false);
      setMethod(defaultMethod);
      setShowMore(false);
      setCaptchaChecked(false);
    }
  }, [open, productId, defaultMethod]);

  if (!selected) return null;
  const bonusText = selected.bonusCashAmount > 0 ? ` +${fmtCoin(selected.bonusCashAmount)} Bonus` : "";

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[calc(100%-1rem)] max-h-[90vh] max-w-[500px] overflow-x-hidden overflow-y-auto rounded-2xl border-[#b9a57b] bg-[#fffaf0] p-0 text-[#2c241c] shadow-[0_18px_45px_rgba(75,55,29,.3)]">
      <div className="border-b border-[#ddcfad] px-6 py-5">
        <DialogTitle className="font-serif text-lg font-bold text-[#3b5688]">Purchase rCoin</DialogTitle>
        <DialogDescription className="sr-only">Choose a package, payment method, and confirm the security check.</DialogDescription>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="whitespace-nowrap text-[22px] font-black leading-none tracking-tight text-[#2c241c]">{fmtCoin(selected.ruCashAmount)} rCoin<span className="ml-1.5 text-green-700">{bonusText}</span></p>
          <div className="relative shrink-0">
            <button type="button" onClick={() => setPriceOpen(value => !value)} className="inline-flex min-w-[92px] items-center justify-between gap-2 rounded-lg border border-[#b8a57d] bg-white px-3 py-2 text-sm font-bold text-[#3a4659] shadow-sm hover:border-[#5371a8]">{formatPrice(selected)} <ChevronDown className="h-4 w-4" /></button>
            {priceOpen && <div className="absolute right-0 z-30 mt-2 max-h-52 w-32 overflow-y-auto rounded-lg border border-[#cbb98f] bg-[#fffaf0] p-1 shadow-xl">{products.map(product => <button type="button" key={product.id} onClick={() => { onSelectProduct(product.id); setPriceOpen(false); }} className={`block w-full rounded px-2 py-2 text-left text-sm font-semibold hover:bg-[#e7eefb] ${product.id === selected.id ? "bg-[#e7eefb] text-[#3b5c93]" : "text-[#5a4b38]"}`}>{formatPrice(product)}</button>)}</div>}
          </div>
        </div>
      </div>
      <div className="space-y-5 px-6 py-5">
        <section>
          <p className="mb-2 text-sm font-black text-[#3b2f22]">Payment Method</p>
          <div className="space-y-2">
            {primaryPaymentMethods.map(item => <button type="button" key={item.id} onClick={() => setMethod(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${method === item.id ? "border-[#5d78aa] bg-[#e9f0fb] ring-1 ring-[#5d78aa]" : "border-[#ded0ad] hover:border-[#7994c1]"}`}><span className="font-bold text-[#3b2f22]">{item.label}</span><span className={`text-xs font-semibold ${item.id === "goc" ? "text-[#4668a3]" : "text-[#8c7b61]"}`}>{item.sublabel}</span></button>)}
            {showMore && extraPaymentMethods.map(item => <button type="button" key={item.id} onClick={() => setMethod(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${method === item.id ? "border-[#5d78aa] bg-[#e9f0fb] ring-1 ring-[#5d78aa]" : "border-[#ded0ad] hover:border-[#7994c1]"}`}><span className="font-bold text-[#3b2f22]">{item.label}</span><span className="text-xs text-[#8c7b61]">Payment partner</span></button>)}
          </div>
          <button type="button" onClick={() => setShowMore(value => !value)} className="mt-3 text-sm font-bold text-[#4668a3] hover:text-[#2f4f83]">{showMore ? "Show less" : "More payment methods"}</button>
        </section>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#ded0ad] bg-[#f9f2e2] p-3 text-sm text-[#5a4b38]"><input type="checkbox" checked={captchaChecked} onChange={event => setCaptchaChecked(event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-slate-500" />I am not a robot</span></label>
      </div>
      <div className="border-t border-[#ddcfad] px-6 py-4"><button type="button" disabled={!captchaChecked} onClick={() => alert("Payment provider integration will be available soon.")} className="w-full rounded-lg border border-[#2e5189] bg-[#4668a3] px-4 py-3 text-sm font-black text-white transition-colors hover:bg-[#385a92] disabled:cursor-not-allowed disabled:bg-slate-300">Pay {formatPrice(selected)}</button></div>
    </DialogContent>
  </Dialog>;
}

function ChargeTab({ rCoin, bonusCoin, paymentProvider, onPaymentProviderChange }: { rCoin: number; bonusCoin: number; paymentProvider: ShopEntryProvider; onPaymentProviderChange: (provider: ShopEntryProvider) => void }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const { data: products = [] } = trpc.shop.listProducts.useQuery({ paymentProvider });
  const orderedProducts = useMemo(() => [...(products as Product[])].sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id)), [products]);
  const provider = shopEntryProviders.find(item => item.id === paymentProvider) ?? shopEntryProviders[0];

  return <div className="space-y-5">
    <BalanceCards rCoin={rCoin} bonusCoin={bonusCoin} />
    <div className="flex flex-col gap-3 border-b border-[#cdbb91] pb-3 text-sm text-[#776952] sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-[264px]">
        <label htmlFor="shop-payment-provider" className="sr-only">Payment provider</label>
        <select id="shop-payment-provider" value={paymentProvider} onChange={event => onPaymentProviderChange(event.target.value as ShopEntryProvider)} className="h-10 w-full appearance-none rounded-lg border border-[#b8a57d] bg-white px-4 pr-10 text-sm font-black text-[#3b5688] shadow-sm outline-none transition-colors hover:border-[#5371a8] focus:border-[#5371a8] focus:ring-2 focus:ring-[#5371a8]/20">
          {shopEntryProviders.map(provider => <option key={provider.id} value={provider.id}>{provider.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7e9d]" />
      </div>
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-6"><span>All prices are shown in {provider.currency}.</span><span>Payment provider: <strong className="text-[#3b5688]">{provider.label}</strong></span></div>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {orderedProducts.map((product, index) => {
        const order = product.sortOrder ?? index + 1;
        const isBestSeller = order === 5;
        const isBestValue = order === 8;
        return <button type="button" key={product.id} data-shop-product={product.id} onClick={() => { setSelectedId(product.id); setPurchaseOpen(true); }} className="fantasy-card relative min-h-[154px] rounded-xl p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#5c79ad] hover:shadow-md">
          {(isBestSeller || isBestValue) && <span className={`absolute -left-1 -top-3 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-sm ${isBestSeller ? "bg-[#a51f24]" : "bg-[#5d4387]"}`}>{isBestSeller ? "Best Seller" : "Best Value"}</span>}
          <div className="flex items-center gap-3 pt-2"><div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-lg bg-[#f0e7d2]"><img src={COIN_ICONS[order] ?? COIN_ICONS[index + 1]} alt="rCoin package" className="h-[76px] w-[76px] object-contain" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-x-1 gap-y-1"><span className="text-2xl font-black leading-none text-[#2c241c]">{fmtCoin(product.ruCashAmount)}</span><span className="text-sm font-bold text-[#655540]">rCoin</span>{product.bonusCashAmount > 0 && <span className="text-sm font-black text-green-700">+{fmtCoin(product.bonusCashAmount)} Bonus</span>}</div></div></div>
          <div className="mt-3 rounded-lg border border-[#4a68a0] bg-gradient-to-b from-[#5e80bb] to-[#3d609d] px-3 py-2 text-center text-lg font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_3px_0_rgba(46,73,123,.45)]">{formatPrice(product)}</div>
        </button>;
      })}
    </div>
    <PurchaseDialog products={orderedProducts} productId={selectedId} open={purchaseOpen} onOpenChange={setPurchaseOpen} onSelectProduct={setSelectedId} defaultMethod={paymentProvider} />
  </div>;
}

export default function PointShop() {
  const { user } = useAuth();
  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, { enabled: !!user });
  const [paymentProvider, setPaymentProvider] = useState<ShopEntryProvider>("xsolla");
  return <Layout variant="homeChrome" showClosingCta={false}>
    <><section className="news-detail-page-banner shop-detail-page-banner" aria-labelledby="shop-detail-page-title"><div className="container"><h1 id="shop-detail-page-title">Shop</h1><p>Purchase rCoin and continue your adventure.</p></div></section><div className="fantasy-page-shell shop-detail-page-shell"><div className="service-content-container fantasy-content-guide shop-content-guide pt-6 pb-8 md:pt-8"><main className="min-w-0 w-full"><ChargeTab rCoin={balance?.ruCash ?? 0} bonusCoin={balance?.bonusCash ?? 0} paymentProvider={paymentProvider} onPaymentProviderChange={setPaymentProvider} /></main></div></div></>
  </Layout>;
}
