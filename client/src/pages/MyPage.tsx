import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { User, Shield, LogOut, Trash2, CheckCircle2, ShieldAlert, CreditCard, Clock, ArrowRight, Edit2, Ticket, Unlink, Mail, Users, LogIn, Bell, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";

type HistorySection = "purchase" | "usage";
type MyPageSection = "account" | HistorySection | "coupon";

const formatHistoryNumber = (value: number | null | undefined) => Number(value ?? 0).toLocaleString();

function HistoryTime({ value }: { value: Date | string | null | undefined }) {
  if (!value) return <>-</>;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return <>-</>;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return <><span>{yyyy}-{mm}-{dd}</span><br /><span>{hh}:{min}</span></>;
}

function MyPageHistory({ section }: { section: HistorySection }) {
  const [page, setPage] = useState(1);
  const { data: balance } = trpc.shop.myBalance.useQuery();
  const { data: purchaseHistory } = trpc.shop.myChargeHistory.useQuery({ page, pageSize: 10 }, { enabled: section === "purchase" });
  const { data: usageHistory } = trpc.shop.myUseHistory.useQuery({ page, pageSize: 10 }, { enabled: section === "usage" });
  const data = section === "purchase" ? purchaseHistory : usageHistory;
  const items = (data?.items ?? []) as any[];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));
  const isPurchase = section === "purchase";
  const headers = isPurchase
    ? ["Game\nCode", "Time", "rCoin\nBefore", "Bonus rCoin\nBefore", "PG", "Price", "rCoin\nCharged", "Bonus rCoin\nCharged", "rCoin\nAfter", "Bonus rCoin\nAfter"]
    : ["Game\nCode", "Time", "rCoin\nBefore", "Bonus rCoin\nBefore", "Item\nName", "Qty", "Item\nPrice", "Total\nPrice", "rCoin\nAfter", "Bonus rCoin\nAfter"];

  return (
    <div data-testid="history-layout" className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">rCoin</p>
          <p className="mt-1 text-3xl font-black text-[#9b2020]">{formatHistoryNumber(balance?.ruCash)}</p>
          <p className="mt-1 text-xs text-slate-400">Paid Currency</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Bonus rCoin</p>
          <p className="mt-1 text-3xl font-black text-green-700">{formatHistoryNumber(balance?.bonusCash)}</p>
          <p className="mt-1 text-xs text-slate-400">Bonus Currency (Used First)</p>
        </div>
      </div>

      {!items.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center text-sm text-slate-400">No {isPurchase ? "purchase" : "usage"} history available.</div>
      ) : (
        <div data-testid="history-table" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full table-fixed border-collapse text-[11px] sm:text-xs">
            <thead>
              <tr className="bg-[#9b2020] text-white">
                {headers.map((header, index) => <th key={header} className={`border-r border-red-800 px-1 py-2 text-center font-semibold whitespace-pre-line leading-tight last:border-r-0 ${index === 1 ? "w-[92px]" : ""}`}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50">
                  <td className="px-1 py-2 text-center font-medium text-[#9b2020]">{tx.gameCode ?? "ROU"}</td>
                  <td className="w-[92px] px-1 py-2 text-center leading-4 text-slate-700"><HistoryTime value={tx.createdAt} /></td>
                  <td className="px-1 py-2 text-right">{formatHistoryNumber(tx.beforeRuCash)}</td>
                  <td className="px-1 py-2 text-right text-green-700">{formatHistoryNumber(tx.beforeBonusCash)}</td>
                  {isPurchase ? <>
                    <td className="px-1 py-2 text-center">{tx.pgName ?? "-"}</td>
                    <td className="px-1 py-2 text-right">{tx.priceUsd ? `$${Number(tx.priceUsd).toFixed(0)}` : "-"}</td>
                    <td className="px-1 py-2 text-right font-bold text-[#9b2020]">{formatHistoryNumber(Math.abs(tx.ruCashDelta ?? 0))}</td>
                    <td className="px-1 py-2 text-right font-bold text-green-700">{formatHistoryNumber(Math.abs(tx.bonusCashDelta ?? 0))}</td>
                  </> : <>
                    <td className="px-1 py-2 text-center break-words">{tx.itemName ?? "-"}</td>
                    <td className="px-1 py-2 text-right">{tx.itemQty ?? 1}</td>
                    <td className="px-1 py-2 text-right">{formatHistoryNumber(Math.abs(tx.itemPriceRuc ?? 0))}</td>
                    <td className="px-1 py-2 text-right font-bold">{formatHistoryNumber(Math.abs(tx.totalPriceRuc ?? 0))}</td>
                  </>}
                  <td className="px-1 py-2 text-right font-bold">{formatHistoryNumber(tx.afterRuCash)}</td>
                  <td className="px-1 py-2 text-right font-bold text-green-700">{formatHistoryNumber(tx.afterBonusCash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-1 pt-1">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(1)}>«</Button>
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>‹</Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <Button key={number} size="sm" variant={page === number ? "default" : "outline"} onClick={() => setPage(number)}>{number}</Button>)}
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>›</Button>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</Button>
        </div>
      )}
    </div>
  );
}

function MyPageCouponEntry() {
  const [serverCode, setServerCode] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const couponBalance = trpc.shop.myBalance.useQuery();
  const couponHistory = trpc.coupon.myHistory.useQuery({ page: historyPage, pageSize: 20 });
  const redeemCoupon = trpc.coupon.redeem.useMutation({
    onSuccess: () => {
      setNotice({ type: "success", message: "Your coupon has been registered. Please check your mailbox." });
      setCouponCode("");
      setConfirmOpen(false);
      couponBalance.refetch();
      couponHistory.refetch();
    },
    onError: (error) => {
      setNotice({ type: "error", message: error.message || "This coupon code is invalid." });
      setConfirmOpen(false);
    },
  });
  const totalPages = Math.max(1, Math.ceil((couponHistory.data?.total ?? 0) / 20));
  const requestConfirmation = () => {
    setNotice(null);
    if (!serverCode || !characterName || !couponCode) {
      setNotice({ type: "error", message: "Please complete all fields required to receive your coupon rewards." });
      return;
    }
    setConfirmOpen(true);
  };

  return <div data-testid="coupon-entry" className="space-y-5">
    <section className="rounded-2xl border border-[#decfc0] bg-[#fffdf9]/95 p-6 shadow-[0_8px_24px_rgba(93,73,43,.1)]">
      <div className="mb-6 border-b border-[#e7d9c8] pb-4"><p className="text-xs font-bold tracking-[.14em] text-[#a51f24]">COUPON REGISTRATION</p><p className="mt-2 text-sm text-[#776952]">Select the server and character that will receive your coupon reward.</p></div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-[#eadfce] bg-white px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-[#786850]">rCoin</p><p className="mt-1 text-xl font-black text-[#a51f24]">{Number(couponBalance.data?.ruCash ?? 0).toLocaleString()}</p></div><div className="rounded-lg border border-[#eadfce] bg-white px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-[#786850]">Bonus rCoin</p><p className="mt-1 text-xl font-black text-emerald-700">{Number(couponBalance.data?.bonusCash ?? 0).toLocaleString()}</p></div></div>
      {notice && <div role="status" className={`mb-5 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{notice.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}{notice.message}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-[#4e402f]"><span>Server</span><select aria-label="Coupon server" value={serverCode} onChange={event => { setServerCode(event.target.value); setCharacterName(""); }} className="h-10 w-full rounded-md border border-[#cbb797] bg-white px-3 text-sm outline-none focus:border-[#a51f24] focus:ring-2 focus:ring-[#a51f24]/15"><option value="">Select server</option><option value="1">Server 1 · Prontera</option><option value="2">Server 2 · Geffen</option><option value="3">Server 3 · Payon</option><option value="4">Server 4 · Morroc</option><option value="5">Server 5 · Aldebaran</option><option value="6">Server 6 · Comodo</option></select></label>
        <label className="space-y-2 text-sm font-semibold text-[#4e402f]"><span>Character Name</span><select aria-label="Coupon character" value={characterName} disabled={!serverCode} onChange={event => setCharacterName(event.target.value)} className="h-10 w-full rounded-md border border-[#cbb797] bg-white px-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-[#a51f24] focus:ring-2 focus:ring-[#a51f24]/15"><option value="">Select character</option><option value="ValkyrieKnight">ValkyrieKnight</option><option value="RuneMage">RuneMage</option><option value="ShadowRanger">ShadowRanger</option></select></label>
      </div>
      <label className="mt-4 block space-y-2 text-sm font-semibold text-[#4e402f]"><span>Coupon Code</span><Input aria-label="Coupon code" value={couponCode} onChange={event => setCouponCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))} placeholder="NNNN-NNNN-NNNN" maxLength={64} className="border-[#cbb797] bg-white font-mono tracking-[.08em] focus-visible:ring-[#a51f24]" /></label>
      <div className="mt-6 flex justify-center"><Button onClick={requestConfirmation} className="min-w-36 bg-[#a51f24] font-bold text-white hover:bg-[#86191d]"><Ticket className="mr-2 h-4 w-4" />COUPON REGISTRATION</Button></div>
    </section>

    <section aria-label="Coupon history" className="overflow-hidden rounded-2xl border border-[#decfc0] bg-[#fffdf9]/95 shadow-[0_8px_24px_rgba(93,73,43,.1)]"><div className="border-b border-[#e7d9c8] px-6 py-4"><p className="text-xs font-bold tracking-[.14em] text-[#a51f24]">COUPON HISTORY</p></div>{couponHistory.isLoading ? <p className="px-6 py-10 text-center text-sm text-[#776952]">Loading coupon history...</p> : !couponHistory.data?.items.length ? <p className="px-6 py-10 text-center text-sm text-[#776952]">No coupon history available.</p> : <><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead className="bg-[#a51f24] text-white"><tr><th className="px-4 py-3 text-left">Event Name</th><th className="px-4 py-3 text-left">Coupon Code</th><th className="px-4 py-3 text-left">Character Name</th><th className="px-4 py-3 text-left">Registered Date</th><th className="px-4 py-3 text-center">Status</th></tr></thead><tbody>{couponHistory.data.items.map(item => <tr key={item.id} className="border-t border-[#eadfce]"><td className="px-4 py-3 font-medium text-[#302419]">{item.eventName}</td><td className="px-4 py-3 font-mono text-xs text-[#4e402f]">{item.couponCode}</td><td className="px-4 py-3 text-[#4e402f]">{item.characterName}</td><td className="px-4 py-3 text-[#776952]">{new Date(item.registeredAt).toLocaleDateString("en-CA")}</td><td className="px-4 py-3 text-center font-semibold text-emerald-700">{item.status}</td></tr>)}</tbody></table></div>{totalPages > 1 && <div className="flex justify-center gap-1 border-t border-[#e7d9c8] p-3">{Array.from({ length: totalPages }, (_, index) => index + 1).map(page => <Button key={page} size="sm" variant={historyPage === page ? "default" : "outline"} onClick={() => setHistoryPage(page)}>{page}</Button>)}</div>}</>}</section>

    {confirmOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"><div className="w-full max-w-md rounded-2xl border border-[#decfc0] bg-[#fffdf9] p-6 shadow-2xl"><p className="text-xs font-bold tracking-[.14em] text-[#a51f24]">CONFIRM COUPON USE</p><h3 className="mt-2 font-serif text-xl font-bold text-[#302419]">Redeem this coupon?</h3><p className="mt-3 text-sm leading-6 text-[#675843]">Coupon rewards will be registered to <strong>{characterName}</strong> on <strong>{`Server ${serverCode}`}</strong>.</p><div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button><Button disabled={redeemCoupon.isPending} onClick={() => redeemCoupon.mutate({ code: couponCode, serverCode, characterName })} className="bg-[#a51f24] text-white hover:bg-[#86191d]">{redeemCoupon.isPending ? "Registering..." : "Confirm"}</Button></div></div></div>}
  </div>;
}

export default function MyPage() {
  const [, setLocation] = useLocation();
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agreeWithdrawTerms, setBgAgreeWithdrawTerms] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showNicknameEdit, setShowNicknameEdit] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [activeSection, setActiveSection] = useState<MyPageSection>("account");

  // Generate random nickname (10 characters: letters + numbers)
  const generateRandomNickname = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let nickname = '';
    
    // Generate 6 random letters
    for (let i = 0; i < 6; i++) {
      nickname += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Generate 4 random numbers
    for (let i = 0; i < 4; i++) {
      nickname += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    // Shuffle the string
    return nickname.split('').sort(() => Math.random() - 0.5).join('');
  };

  const isLoggedIn = localStorage.getItem("rou_logged_in") === "true";

  // DB에서 실제 createdAt 가져오기
  const { data: meData } = trpc.auth.me.useQuery();
  const userIdDisplay = meData?.id ? String(meData.id) : "-";

  const formatRegistrationDate = (date: Date | string | null | undefined): string => {
    if (!date) return "-";
    const d = new Date(date as string | Date);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    const h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${mm}/${dd}/${yyyy} at ${h12}:${min} ${ap}`;
  };

  // DB createdAt 우선, 없으면 localStorage rou_agreed_at fallback
  const registrationDate = (() => {
    if (meData?.createdAt) {
      const d = meData.createdAt instanceof Date ? meData.createdAt : new Date(meData.createdAt as unknown as string);
      if (!isNaN(d.getTime())) return formatRegistrationDate(d);
    }
    const raw = localStorage.getItem("rou_agreed_at");
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return formatRegistrationDate(d);
    }
    return "-";
  })();

  // Format agreed_at as "Agreed on: MM/DD/YYYY H:MM AM/PM"
  const agreedDateStr = (() => {
    const raw = localStorage.getItem("rou_agreed_at");
    if (!raw) return null;
    const d = new Date(raw);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const h12 = hours % 12 || 12;
    const ap = hours >= 12 ? 'PM' : 'AM';
    return `Agreed on: ${mm}/${dd}/${yyyy} ${h12}:${minutes} ${ap}`;
  })();

  // Marketing consent state — synced with onboarding value via localStorage
  const [marketingConsent, setMarketingConsent] = useState<boolean>(() => {
    const stored = localStorage.getItem("rou_marketing_consent");
    return stored === "true";
  });

  const handleMarketingToggle = (value: boolean) => {
    setMarketingConsent(value);
    // Persist as the latest consent log (mirrors /gdpr/consent API behaviour)
    localStorage.setItem("rou_marketing_consent", value ? "true" : "false");
    // Record timestamp of the change
    localStorage.setItem("rou_marketing_consent_updated_at", new Date().toISOString());
    toast.success(
      value
        ? "Marketing information consent has been enabled."
        : "Marketing information consent has been disabled."
    );
  };

  // Initialize with stored nickname or generate a new one if not found
  const [userNickname, setUserNickname] = useState(() => {
    const stored = localStorage.getItem("rou_nickname");
    const legacyDefaultNickname = "\uBAA8\uD5D8\uAC00";
    if (stored === legacyDefaultNickname) {
      localStorage.setItem("rou_nickname", "Adventurer");
      return "Adventurer";
    }
    if (stored) {
      return stored;
    }
    const newNickname = generateRandomNickname();
    localStorage.setItem("rou_nickname", newNickname);
    return newNickname;
  });
  const socialProvider = localStorage.getItem("rou_social_provider") || "Guest";

  // Get login type display info
  const getLoginTypeInfo = () => {
    const provider = socialProvider;
    if (provider === "Google") {
      return { icon: "🔵", label: "Google Login" };
    } else if (provider === "Facebook") {
      return { icon: "📘", label: "Facebook Login" };
    }
    return { icon: "👤", label: "Guest Login" };
  };

  const loginInfo = getLoginTypeInfo();

  if (!isLoggedIn) {
    return (
      <Layout showClosingCta={false}>
        <div className="fantasy-page-shell flex min-h-screen items-center justify-center px-4">
          <div className="fantasy-card w-full max-w-md rounded-2xl p-9 text-center">
            <LogIn size={48} className="mx-auto mb-4 text-[#5871a0]" />
            <h1 className="mb-2 font-serif text-3xl font-bold text-[#302419]">Not Logged In</h1>
            <p className="mb-6 text-[#75664f]">Please log in to access your profile.</p>
            <Link href="/login">
              <Button className="border border-[#395b94] bg-[#4668a3] font-semibold text-white hover:bg-[#385a92]">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleNicknameChange = () => {
    if (newNickname.length < 2 || newNickname.length > 20) {
      toast.error("Nickname must be between 2 and 20 characters.");
      return;
    }
    setUserNickname(newNickname);
    localStorage.setItem("rou_nickname", newNickname);
    toast.success(`Nickname changed to ${newNickname}!`);
    setShowNicknameEdit(false);
    setNewNickname("");
  };

  const handleLogout = () => {
    localStorage.removeItem("rou_logged_in");
    localStorage.removeItem("rou_nickname");
    localStorage.removeItem("rou_guest_mode");
    localStorage.removeItem("rou_social_provider");
    toast.success("Logged out successfully!");
    setLocation("/");
  };

  const withdrawMutation = trpc.user.withdraw.useMutation();

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeWithdrawTerms) {
      toast.error("You must agree to the withdrawal terms.");
      return;
    }
    setIsWithdrawing(true);
    // 서버에 withdrawnAt 저장
    withdrawMutation.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("rou_logged_in");
        localStorage.removeItem("rou_nickname");
        localStorage.removeItem("rou_guest_mode");
        localStorage.removeItem("rou_social_provider");
        localStorage.removeItem("rou_open_id");
        toast.success("Account withdrawn successfully.");
        setLocation("/");
      },
    });
  };

  return (
    <Layout showClosingCta={false}>
      <section className="news-detail-page-banner news-detail-page-banner--list" aria-labelledby="mypage-page-title">
        <div className="container">
          <h1 id="mypage-page-title">My Page</h1>
          <p>Manage your profile, coupons, and rCoin activity.</p>
        </div>
      </section>
      <div className="fantasy-page-shell fantasy-account min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="fantasy-card sticky top-8 rounded-2xl p-6">
                {/* Profile Card */}
                <div className="mb-6 flex flex-col items-center border-b border-[#d8c8a3] pb-6">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[#bca76d] bg-[linear-gradient(135deg,#5474aa,#334f82)]">
                    <User size={32} className="text-white" />
                  </div>
                  <h3 className="text-center font-serif text-lg font-bold text-[#302419]">{userNickname}</h3>
                  <p className="mt-1 text-xs text-[#776952]">{loginInfo.icon} {loginInfo.label}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full border-[#bca76d] text-xs text-[#405f95] hover:bg-[#e7eef9]"
                    onClick={() => { setShowNicknameEdit(true); setNewNickname(userNickname); }}
                  >
                    <Edit2 size={12} className="mr-1" /> Change Nickname
                  </Button>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  <button onClick={() => setActiveSection("purchase")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${activeSection === "purchase" ? "bg-[#4668a3] text-white" : "text-[#4e402f] hover:bg-[#eadfc4]"}`}>
                    <CreditCard size={16} className={activeSection === "purchase" ? "text-white" : "text-[#4e402f]"} />
                    <span>Payment History</span>
                  </button>
                  <button onClick={() => setActiveSection("usage")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${activeSection === "usage" ? "bg-[#4668a3] text-white" : "text-[#4e402f] hover:bg-[#eadfc4]"}`}>
                    <Clock size={16} className={activeSection === "usage" ? "text-white" : "text-[#4e402f]"} />
                    <span>Points/Item Usage</span>
                  </button>
                  <button onClick={() => toast.info("Customer inquiry feature coming soon.")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#4e402f] hover:bg-[#eadfc4] transition-colors text-sm font-medium">
                    <Mail size={16} className="text-[#4e402f]" />
                    <span>1:1 Inquiry</span>
                  </button>
                  <button onClick={() => setActiveSection("coupon")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${activeSection === "coupon" ? "bg-[#4668a3] text-white" : "text-[#4e402f] hover:bg-[#eadfc4]"}`}>
                    <Ticket size={16} className={activeSection === "coupon" ? "text-white" : "text-[#4e402f]"} />
                    <span>Coupon</span>
                  </button>
                </nav>

                {/* Account Actions */}
                <div className="mt-6 space-y-2 border-t border-[#d8c8a3] pt-6">
                  <Button variant="outline" onClick={handleLogout} className="w-full border-[#bca76d] text-xs text-[#4e402f] hover:bg-[#eadfc4]">
                    <LogOut size={12} className="mr-1" /> Logout
                  </Button>

                    <Button
                    variant="outline"
                    onClick={() => setShowWithdrawDialog(true)}
                    className="w-full text-xs border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <ShieldAlert size={12} className="mr-1" /> Account Deletion
                  </Button>

                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-3">
              {activeSection === "purchase" ? (
                <MyPageHistory key="purchase" section="purchase" />
              ) : activeSection === "usage" ? (
                <MyPageHistory key="usage" section="usage" />
              ) : activeSection === "coupon" ? (
                <MyPageCouponEntry />
              ) : showWithdrawDialog ? (
                // Withdrawal Dialog
                <div className="glass-panel p-6 rounded-3xl border border-white/10 dark:bg-[#131313] bg-[#f2f2f2] dark:border-slate-700/50">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <ShieldAlert size={20} className="text-red-600" />
                    Account Deletion
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70 mb-4">
                    This action is permanent and cannot be undone. All of your data will be deleted.
                  </p>
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="withdraw-agree"
                        checked={agreeWithdrawTerms}
                        onCheckedChange={(checked) => setBgAgreeWithdrawTerms(checked as boolean)}
                        className="border-2 border-black dark:border-white data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <Label htmlFor="withdraw-agree" className="text-sm text-black dark:text-white cursor-pointer">
                        I understand that my account will be permanently deleted.
                      </Label>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowWithdrawDialog(false)}
                        className="text-xs border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button"
                        disabled={isWithdrawing || !agreeWithdrawTerms}
                        onClick={() => agreeWithdrawTerms && setShowDeleteConfirm(true)}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-8 py-4 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isWithdrawing ? "Processing..." : "Delete Account"}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                // Default: Social Providers + Game Info + Security view
                <div className="flex flex-col gap-6">
                  {/* Account Information */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/10 dark:bg-[#131313] bg-[#f2f2f2] dark:border-slate-700/50">
                    <h4 className="text-black dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <Users size={18} />
                      Account Information
                    </h4>
                    
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow className="border-black/10 dark:border-white/10 hover:bg-transparent">
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">Nickname</TableHead>
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">User ID</TableHead>
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">Provider</TableHead>
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">Registration Date</TableHead>
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">Last Account Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5">
                            <TableCell className="text-black dark:text-white font-medium">{userNickname}</TableCell>
                            <TableCell className="text-black/70 dark:text-white/70">{userIdDisplay}</TableCell>
                            <TableCell>
                              {socialProvider === "Google" ? (
                                <span className="inline-flex items-center gap-1 text-black dark:text-white">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                  Google
                                </span>
                              ) : socialProvider === "Facebook" ? (
                                <span className="inline-flex items-center gap-1 text-black dark:text-white">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                  Facebook
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-black dark:text-white">
                                  <User size={14} />
                                  Guest
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-black/70 dark:text-white/70">{registrationDate}</TableCell>
                            <TableCell className="text-black/70 dark:text-white/70">South Korea • 06/19/2026 • 05:49 AM</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <p className="text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Nickname</p>
                        <p className="text-sm text-black dark:text-white font-medium">{userNickname}</p>
                      </div>
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <p className="text-xs font-semibold text-black/70 dark:text-white/70 mb-1">User ID</p>
                        <p className="text-sm text-black dark:text-white">{userIdDisplay}</p>
                      </div>
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <p className="text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Provider</p>
                        <div className="text-sm">
                          {socialProvider === "Google" ? (
                            <span className="inline-flex items-center gap-1 text-black dark:text-white">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                              Google
                            </span>
                          ) : socialProvider === "Facebook" ? (
                            <span className="inline-flex items-center gap-1 text-black dark:text-white">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                              Facebook
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-black dark:text-white">
                              <User size={14} />
                              Guest
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <p className="text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Registration Date</p>
                        <p className="text-sm text-black dark:text-white">{registrationDate}</p>
                      </div>
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <p className="text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Last Account Activity</p>
                        <p className="text-sm text-black dark:text-white">South Korea • 06/19/2026 • 05:49 AM</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Providers Buttons */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/10 dark:bg-[#131313] bg-[#f2f2f2] dark:border-slate-700/50">
                    <h4 className="text-black dark:text-white font-bold text-sm mb-4">Link Additional Accounts</h4>
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      {socialProvider !== "Google" && (
                        <Button className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2" onClick={() => toast.info("Associate with Google coming soon.")}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/></svg>
                          Associate with Google
                        </Button>
                      )}
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2" onClick={() => toast.info("Associate with Facebook coming soon.")}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Associate with Facebook
                      </Button>
                      <Button className="flex-1 bg-black hover:bg-gray-900 text-white text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2" onClick={() => toast.info("Associate with Apple coming soon.")}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                        Associate with Apple
                      </Button>
                    </div>

                  </div>

                  {/* Playing Games */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/10 dark:bg-[#131313] bg-[#f2f2f2] dark:border-slate-700/50">
                    <h4 className="text-black dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <Shield size={18} />
                      Playing Games
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <span className="text-sm font-medium text-black dark:text-white">Ragnarok Universe</span>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                          Start <ArrowRight size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/10 dark:bg-[#131313] bg-[#f2f2f2] dark:border-slate-700/50">
                    {/* Agreed date — always shown above Terms Agreement title */}
                    <p className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">
                      {agreedDateStr ?? "Agreed on: -"}
                    </p>
                    <h4 className="text-black dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      Terms Agreement
                    </h4>
                    <div className="space-y-3">
                          {/* Terms of Service */}
                          <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                              <span className="text-sm text-black dark:text-white">Terms of Service</span>
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full shrink-0 ml-2">Agreed</span>
                          </div>

                          {/* Privacy Policy */}
                          <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                              <span className="text-sm text-black dark:text-white">Privacy Policy</span>
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full shrink-0 ml-2">Agreed</span>
                          </div>

                          {/* Age Verification */}
                          <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                              <span className="text-sm text-black dark:text-white">Age Verification</span>
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full shrink-0 ml-2">Agreed</span>
                          </div>


                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nickname Edit Dialog */}
      {showNicknameEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#131313] rounded-2xl p-6 max-w-sm w-full border border-white/10 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">Change Nickname</h3>
            <Input
              type="text"
              placeholder="Enter new nickname"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              maxLength={20}
              className="mb-4 bg-white dark:bg-slate-800 border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
            />
            <p className="text-xs text-black dark:text-white mb-4">
              {newNickname.length}/20 characters (minimum 2)
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowNicknameEdit(false)}
                className="flex-1 border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleNicknameChange}
                disabled={isEditingNickname}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isEditingNickname ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131313] rounded-2xl p-6 max-w-sm w-full border border-red-200 dark:border-red-900/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <ShieldAlert size={20} className="text-red-600" />
              </div>
              <h3 className="text-base font-bold text-black dark:text-white">Are you sure you want to delete your account?</h3>
            </div>
            <p className="text-sm text-black/60 dark:text-white/60 mb-6">
              This action cannot be undone. Your account and all associated data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setIsWithdrawing(true);
                  setTimeout(() => {
                    localStorage.removeItem("rou_logged_in");
                    localStorage.removeItem("rou_nickname");
                    localStorage.removeItem("rou_guest_mode");
                    localStorage.removeItem("rou_social_provider");
                    localStorage.removeItem("rou_ttkey_verified");
                    localStorage.removeItem("rou_agreed_at");
                    toast.success("Your account has been permanently deleted.");
                    setLocation("/");
                  }, 1500);
                }}
                disabled={isWithdrawing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {isWithdrawing ? "Deleting..." : "Yes, Delete Account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
