import { BookOpen, CircleHelp, CreditCard, Sparkles, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

function formatCoin(value: number | undefined) {
  return Math.min(Math.max(value ?? 0, 0), 9_999_999).toLocaleString("en-US");
}

export default function PortalGuidePanel({ eyebrow = "UNIVERSE PORTAL", title = "ADVENTURER COMMAND" }: { eyebrow?: string; title?: string }) {
  const [location] = useLocation();
  const { data: balance } = trpc.shop.myBalance.useQuery(undefined, { retry: false });
  const nickname = localStorage.getItem("rou_nickname") || "ADVENTURER";
  const nav = [
    { href: "/game-info", label: "GAME GUIDE", icon: BookOpen },
    { href: "/point-shop", label: "TOP UP rCOIN", icon: CreditCard },
    { href: "/mypage", label: "MY PAGE", icon: UserRound },
  ];

  return <aside className="neon-panel hidden min-h-[520px] flex-col rounded-2xl p-4 lg:flex lg:sticky lg:top-24">
    <div className="flex flex-col items-center border-b border-cyan-300/10 pb-4">
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/25 bg-slate-950/60"><UserRound className="h-6 w-6 text-slate-500" /></div>
      <p className="text-[10px] font-black tracking-[0.2em] text-cyan-200">{eyebrow}</p>
      <p className="mt-1 text-center text-sm font-black text-slate-100">{nickname}</p>
    </div>
    <div className="mt-4 rounded-xl border border-cyan-300/10 bg-slate-950/45 p-3">
      <p className="text-xs font-bold text-rose-300">rCoin <span className="float-right text-rose-400">{formatCoin(balance?.ruCash)}</span></p>
      <p className="mt-3 border-t border-cyan-300/10 pt-3 text-xs font-bold text-emerald-300">Bonus rCoin <span className="float-right text-emerald-400">{formatCoin(balance?.bonusCash)}</span></p>
    </div>
    <p className="mt-5 text-xs font-black tracking-[0.14em] text-slate-500">{title}</p>
    <nav className="mt-2 space-y-1" aria-label="Universe portal">
      {nav.map(item => {
        const Icon = item.icon;
        const active = location === item.href;
        return <Link key={item.href} href={item.href} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-black transition ${active ? "border border-cyan-300/25 bg-cyan-300/10 text-cyan-100" : "text-slate-400 hover:bg-cyan-300/10 hover:text-cyan-200"}`}><Icon className="h-3.5 w-3.5" />{item.label}</Link>;
      })}
    </nav>
    <div className="mt-auto space-y-2"><div className="rounded-xl border border-emerald-300/10 bg-emerald-300/5 p-3"><p className="text-[10px] font-black tracking-[0.16em] text-slate-500">UNIVERSE STATUS</p><p className="mt-1 text-xs font-bold text-emerald-300">● ONLINE · BETA</p></div><button type="button" className="flex w-full items-center gap-2 rounded-xl border border-cyan-300/15 bg-slate-950/45 p-3 text-left text-xs font-black text-slate-300 hover:border-cyan-300/35"><CircleHelp className="h-4 w-4 text-cyan-300" />SUPPORT CENTER</button></div>
  </aside>;
}
