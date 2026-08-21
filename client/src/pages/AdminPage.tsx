import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import * as XLSX from "xlsx";
import type { AppRouter } from "../../../server/routers";
import {
  Activity, BarChart2, Banknote, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, CircleDollarSign, Coins, CreditCard, Eye, Gamepad2,
  Download, FileSpreadsheet, Gift, Image, Link, LogOut, Pencil, Plus, RefreshCw, Search, Shield, ShoppingCart, Upload,
  Tag, Trash2, ToggleLeft, ToggleRight, UserCheck, UserCog, UserPlus, Users, Users2, UsersRound, X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAllPaged } from "@/lib/pagedExport";

// ─── Admin tRPC client ────────────────────────────────────────────────────────
function createAdminClient(adminKey: string) {
  return createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers: () => ({ "x-admin-key": adminKey }),
      fetch: (input, init) => globalThis.fetch(input, { ...(init ?? {}), credentials: "include" }),
    })],
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d: Date | string | null | undefined) {
  if (!d) return "-";
  return new Date(d).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}

// 24시간 달력 + 시/분 드롭다운 콤포넌트
function DateTimeInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  // value: "YYYY-MM-DDTHH:mm" 형식
  const datePart = value ? value.slice(0, 10) : "";
  const timePart = value ? value.slice(11, 16) : "";
  const hour = timePart ? timePart.slice(0, 2) : "";
  const minute = timePart ? timePart.slice(3, 5) : "";

  const handleDate = (d: string) => {
    const h = hour || "00";
    const m = minute || "00";
    onChange(d ? `${d}T${h}:${m}` : "");
  };
  const handleHour = (h: string) => {
    const d = datePart || new Date().toISOString().slice(0, 10);
    const m = minute || "00";
    onChange(`${d}T${h}:${m}`);
  };
  const handleMinute = (m: string) => {
    const d = datePart || new Date().toISOString().slice(0, 10);
    const h = hour || "00";
    onChange(`${d}T${h}:${m}`);
  };

  return (
    <div className="flex gap-1 items-center">
      {/* 날짜 선택 */}
      <input
        type="date"
        value={datePart}
        onChange={e => handleDate(e.target.value)}
        className="flex h-10 rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      {/* 시 선택 (00~23) */}
      <select
        value={hour}
        onChange={e => handleHour(e.target.value)}
        className="flex h-10 w-16 rounded-md border border-input bg-background px-2 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">시</option>
        {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span className="text-muted-foreground text-sm">:</span>
      {/* 분 선택 (00~59) */}
      <select
        value={minute}
        onChange={e => handleMinute(e.target.value)}
        className="flex h-10 w-16 rounded-md border border-input bg-background px-2 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">분</option>
        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}

function SectionHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

function SearchBar({ value, onChange, onSearch, placeholder = "검색..." }: { value: string; onChange: (v: string) => void; onSearch: () => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => e.key === "Enter" && onSearch()} className="pl-8 h-8 text-sm" />
      </div>
      <Button size="sm" onClick={onSearch} className="h-8">검색</Button>
    </div>
  );
}

function Pagination({ page, total, pageSize, onChange }: { page: number; total: number; pageSize: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const btnCls = "flex items-center justify-center h-10 w-12 border border-input rounded-md text-base font-medium bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none select-none";
  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button className={btnCls} onClick={() => onChange(1)} disabled={page === 1}>&lt;&lt;</button>
      <button className={btnCls} onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>&lt;</button>
      <button className={`${btnCls} w-16 text-muted-foreground cursor-default pointer-events-none`} disabled>{page} / {totalPages}</button>
      <button className={btnCls} onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>&gt;</button>
      <button className={btnCls} onClick={() => onChange(totalPages)} disabled={page === totalPages}>&gt;&gt;</button>
    </div>
  );
}

type MemberHistoryTab = "all" | "charge" | "use" | "coupon";

export function MemberHistoryControls({ tab, searchInput, startDate, endDate, pageSize, onTabChange, onSearchInputChange, onStartDateChange, onEndDateChange, onPageSizeChange, onSearch }: {
  tab: MemberHistoryTab;
  searchInput: string;
  startDate: string;
  endDate: string;
  pageSize: number;
  onTabChange: (tab: MemberHistoryTab) => void;
  onSearchInputChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onSearch: () => void;
}) {
  const tabs = [
    { key: "all" as const, label: "전체" },
    { key: "charge" as const, label: "구매이력" },
    { key: "use" as const, label: "사용이력" },
    { key: "coupon" as const, label: "쿠폰 사용이력" },
  ];
  return (
    <div className="mb-3">
      <div className="flex border-b border-slate-200 dark:border-slate-700" role="tablist" aria-label="회원 거래 이력">
        {tabs.map(item => <button key={item.key} type="button" role="tab" aria-selected={tab === item.key} onClick={() => onTabChange(item.key)} className={`relative px-4 py-2 text-sm font-semibold ${tab === item.key ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}>{item.label}{tab === item.key && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />}</button>)}
      </div>
      <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <Input type="date" value={startDate} onChange={e => onStartDateChange(e.target.value)} className="h-8 w-36 text-sm" aria-label="거래 이력 시작일" />
          <span className="text-slate-400">~</span>
          <Input type="date" value={endDate} onChange={e => onEndDateChange(e.target.value)} className="h-8 w-36 text-sm" aria-label="거래 이력 종료일" />
        </div>
        <div className="flex w-full gap-2 lg:w-80">
          <Input value={searchInput} onChange={e => onSearchInputChange(e.target.value)} onKeyDown={e => { if (e.key === "Enter") onSearch(); }} placeholder={tab === "coupon" ? "이벤트명, 쿠폰 코드 검색" : "게임 코드, PG, 아이템명 검색"} className="h-8 text-sm" aria-label="회원 거래 이력 검색" />
          <Button size="sm" className="h-8 shrink-0" onClick={onSearch}>검색</Button>
        </div>
        <Select value={String(pageSize)} onValueChange={value => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-8 w-28 text-sm lg:ml-auto" aria-label="거래 이력 페이지 크기"><SelectValue /></SelectTrigger>
          <SelectContent>{[10, 20, 50, 100].map(value => <SelectItem key={value} value={String(value)}>{value}개씩</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function MemberTransactionTable({ items, tab, loading }: { items: any[]; tab: "all" | "charge" | "use"; loading: boolean }) {
  const value = (amount: unknown) => Number(amount ?? 0).toLocaleString();
  const timeCell = (tx: any) => <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">{fmt(tx.createdAt)}</td>;
  const empty = <tr><td colSpan={tab === "all" ? 12 : 10} className="px-2 py-4 text-center text-muted-foreground">표시할 이력이 없습니다.</td></tr>;
  const loadingRow = <tr><td colSpan={tab === "all" ? 12 : 10} className="px-2 py-4 text-center text-muted-foreground">이력 조회 중...</td></tr>;

  return (
    <div data-testid="member-transaction-table" className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-700">
      <table className="min-w-[960px] w-full text-xs">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {tab === "charge" ? <tr><th className="px-2 py-2 text-left">Game Code</th><th className="px-2 py-2 text-left">Time</th><th className="px-2 py-2 text-right">rCoin Before</th><th className="px-2 py-2 text-right">Bonus rCoin Before</th><th className="px-2 py-2 text-left">PG</th><th className="px-2 py-2 text-right">Price</th><th className="px-2 py-2 text-right">rCoin Charged</th><th className="px-2 py-2 text-right">Bonus rCoin Charged</th><th className="px-2 py-2 text-right">rCoin After</th><th className="px-2 py-2 text-right">Bonus rCoin After</th></tr>
            : tab === "use" ? <tr><th className="px-2 py-2 text-left">Game Code</th><th className="px-2 py-2 text-left">Time</th><th className="px-2 py-2 text-right">rCoin Before</th><th className="px-2 py-2 text-right">Bonus rCoin Before</th><th className="px-2 py-2 text-left">Item Name</th><th className="px-2 py-2 text-right">Qty</th><th className="px-2 py-2 text-right">Item Price</th><th className="px-2 py-2 text-right">Total Price</th><th className="px-2 py-2 text-right">rCoin After</th><th className="px-2 py-2 text-right">Bonus rCoin After</th></tr>
            : <tr><th className="px-2 py-2 text-left">Game Code</th><th className="px-2 py-2 text-left">Time</th><th className="px-2 py-2 text-right">rCoin Before</th><th className="px-2 py-2 text-right">Bonus rCoin Before</th><th className="px-2 py-2 text-left">PG</th><th className="px-2 py-2 text-right">Price</th><th className="px-2 py-2 text-right">rCoin Charged</th><th className="px-2 py-2 text-right">Bonus rCoin Charged</th><th className="px-2 py-2 text-right">rCoin After</th><th className="px-2 py-2 text-right">Bonus rCoin After</th></tr>}
        </thead>
        <tbody>
          {loading ? loadingRow : !items.length ? empty : items.map(tx => tab === "charge" ? (
            <tr key={tx.id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-2 py-2">{tx.gameCode}</td>{timeCell(tx)}<td className="px-2 py-2 text-right">{value(tx.beforeRuCash)}</td><td className="px-2 py-2 text-right text-emerald-700">{value(tx.beforeBonusCash)}</td><td className="px-2 py-2">{tx.pgName ?? "-"}</td><td className="px-2 py-2 text-right">{tx.priceUsd ? `$${tx.priceUsd}` : "-"}</td><td className="px-2 py-2 text-right font-medium text-blue-700">{value(tx.ruCashDelta)}</td><td className="px-2 py-2 text-right font-medium text-emerald-700">{value(tx.bonusCashDelta)}</td><td className="px-2 py-2 text-right font-medium">{value(tx.afterRuCash)}</td><td className="px-2 py-2 text-right font-medium text-emerald-700">{value(tx.afterBonusCash)}</td></tr>
          ) : tab === "use" ? (
            <tr key={tx.id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-2 py-2">{tx.gameCode}</td>{timeCell(tx)}<td className="px-2 py-2 text-right">{value(tx.beforeRuCash)}</td><td className="px-2 py-2 text-right text-emerald-700">{value(tx.beforeBonusCash)}</td><td className="px-2 py-2">{tx.itemName ?? "-"}</td><td className="px-2 py-2 text-right">{value(tx.itemQty)}</td><td className="px-2 py-2 text-right">{value(tx.itemPriceRuc)}</td><td className="px-2 py-2 text-right font-medium">{value(tx.totalPriceRuc)}</td><td className="px-2 py-2 text-right font-medium">{value(tx.afterRuCash)}</td><td className="px-2 py-2 text-right font-medium text-emerald-700">{value(tx.afterBonusCash)}</td></tr>
          ) : (
            <tr key={tx.id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-2 py-2">{tx.gameCode}</td>{timeCell(tx)}<td className="px-2 py-2 text-right">{value(tx.beforeRuCash)}</td><td className="px-2 py-2 text-right text-emerald-700">{value(tx.beforeBonusCash)}</td><td className="px-2 py-2">{tx.type === "charge" ? (tx.pgName ?? "-") : (tx.itemName ?? "-")}</td><td className="px-2 py-2 text-right">{tx.type === "charge" ? (tx.priceUsd ? `$${tx.priceUsd}` : "-") : value(tx.totalPriceRuc)}</td><td className="px-2 py-2 text-right font-medium text-blue-700">{value(tx.ruCashDelta)}</td><td className="px-2 py-2 text-right font-medium text-emerald-700">{value(tx.bonusCashDelta)}</td><td className="px-2 py-2 text-right font-medium">{value(tx.afterRuCash)}</td><td className="px-2 py-2 text-right font-medium text-emerald-700">{value(tx.afterBonusCash)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MemberCouponHistoryTable({ items, loading }: { items: any[]; loading: boolean }) {
  const formatBenefit = (item: any) => {
    const rewards = (() => { try { return JSON.parse(item.rewardItems ?? "[]") as Array<{ itemId: string; quantity: number }>; } catch { return []; } })();
    const values = [Number(item.bonusRcoin ?? 0) > 0 ? `Bonus rCoin ${Number(item.bonusRcoin).toLocaleString()}` : "", ...rewards.filter(reward => reward.itemId).map(reward => `ItemID ${reward.itemId} × ${reward.quantity}`)].filter(Boolean);
    return values.join(" / ") || (item.benefitType === "point" ? `rCoin ${Number(item.benefitValue ?? 0).toLocaleString()}` : `Product #${item.benefitValue ?? "-"}`);
  };
  return (
    <div data-testid="member-coupon-history-table" className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[920px] text-xs">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-300"><tr><th className="px-3 py-2 text-left">사용일시</th><th className="px-3 py-2 text-left">이벤트명</th><th className="px-3 py-2 text-left">쿠폰 코드</th><th className="px-3 py-2 text-left">게임코드</th><th className="px-3 py-2 text-left">타입</th><th className="px-3 py-2 text-left">보상</th><th className="px-3 py-2 text-left">서버</th><th className="px-3 py-2 text-center">상태</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan={8} className="px-3 py-4 text-center text-muted-foreground">이력 조회 중...</td></tr> : !items.length ? <tr><td colSpan={8} className="px-3 py-4 text-center text-muted-foreground">쿠폰 사용이력이 없습니다.</td></tr> : items.map(item => <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{fmt(item.usedAt)}</td><td className="px-3 py-2 font-medium">{item.eventName}</td><td className="px-3 py-2 font-mono">{item.couponCode}</td><td className="px-3 py-2">{item.gameCode}</td><td className="px-3 py-2">{item.couponType === "random" ? "난수" : "공용"}</td><td className="px-3 py-2 font-medium">{formatBenefit(item)}</td><td className="px-3 py-2">{item.serverCodes || "전 서버"}</td><td className="px-3 py-2 text-center"><span className="rounded-full bg-blue-100 px-2 py-1 font-semibold text-blue-700">사용</span></td></tr>)}</tbody>
      </table>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean | number }) {
  const on = active === true || active === 1;
  return <span className={`text-xs px-1.5 py-0.5 rounded-full ${on ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{on ? "활성" : "비활성"}</span>;
}

function ToggleBtn({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <button onClick={() => onChange(value ? 0 : 1)} className="flex items-center gap-2">
      {value ? <ToggleRight className="h-6 w-6 text-green-500" /> : <ToggleLeft className="h-6 w-6 text-slate-400" />}
      <span className="text-sm">{value ? "활성" : "비활성"}</span>
    </button>
  );
}

// ─── Menu sidebar item ────────────────────────────────────────────────────────
function MenuItem({ id, label, icon: Icon, active, onClick }: { id: string; label: string; icon: React.ElementType; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${active ? "bg-primary text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`} />
        {label}
      </div>
      <ChevronRight className={`h-3.5 w-3.5 opacity-50 ${active ? "text-white" : ""}`} />
    </button>
  );
}

// ─── MEMBERS SECTION ──────────────────────────────────────────────────────────
type UserRow = { id: number; openId: string; name: string | null; email: string | null; loginMethod: string | null; role: "user" | "admin"; status?: string; suspendedUntil?: Date | null; suspendReason?: string | null; csCode?: string | null; createdAt: Date; updatedAt: Date; lastSignedIn: Date };

export function MembersSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("createdAt"); const [sortOrder, setSortOrder] = useState("desc");
  const [roleFilter, setRoleFilter] = useState("all");
  const [memberTab, setMemberTab] = useState<"all" | "restricted">("all");
  const [searchField, setSearchField] = useState<"name" | "id" | "csCode">("name");
  const [registrationStartDate, setRegistrationStartDate] = useState("");
  const [registrationEndDate, setRegistrationEndDate] = useState("");
  const [isExcelDownloading, setIsExcelDownloading] = useState(false);
  const [excelProgress, setExcelProgress] = useState<{ current: number; total: number } | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState<{ name: string } | null>(null);
  const [nickCheckResult, setNickCheckResult] = useState<"idle" | "available" | "duplicate">("idle");
  const [nickChecking, setNickChecking] = useState(false);
  const [memberHistoryTab, setMemberHistoryTab] = useState<MemberHistoryTab>("all");
  const [memberHistorySearchInput, setMemberHistorySearchInput] = useState("");
  const [memberHistorySearch, setMemberHistorySearch] = useState("");
  const [memberHistoryPage, setMemberHistoryPage] = useState(1);
  const [memberHistoryPageSize, setMemberHistoryPageSize] = useState(20);
  const [memberHistoryStartDate, setMemberHistoryStartDate] = useState("");
  const [memberHistoryEndDate, setMemberHistoryEndDate] = useState("");
  const [suspendForm, setSuspendForm] = useState<{ status: string; reason: string; startDate: string; until: string; csCode: string; suspendDays: string } | null>(null);
  const [showSuspendPreview, setShowSuspendPreview] = useState(false);
  const [memberRestrictionPreview, setMemberRestrictionPreview] = useState<{
    status: "suspended" | "banned";
    csCode: string;
    reason: string;
    appliedAt: Date | string | null;
    suspendedUntil: Date | string | null;
  } | null>(null);
  const generateCsCode = () => String(Math.floor(10000000000 + Math.random() * 90000000000));
  const nowDateTimeLocal = () => new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 16);
  const calcExpiry = (start: string, days: string) => {
    if (!start || !days || isNaN(parseInt(days))) return "";
    const d = new Date(start);
    d.setDate(d.getDate() + parseInt(days));
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-members", search, searchField, memberTab, page, pageSize, sortBy, sortOrder, roleFilter, registrationStartDate, registrationEndDate],
    queryFn: () => adminClient!.admin.listUsers.query({ page, pageSize, search, searchField, statusFilter: memberTab, sortBy: sortBy as any, sortOrder: sortOrder as any, roleFilter: roleFilter as any, registrationStartDate: registrationStartDate || undefined, registrationEndDate: registrationEndDate || undefined }),
    enabled: !!adminClient,
  });
  const { data: restrictionHistory = [], isLoading: restrictionHistoryLoading } = useQuery({
    queryKey: ["admin-member-restriction-history", selectedUser?.id],
    queryFn: () => adminClient!.memberAdmin.restrictionHistory.query({ userId: selectedUser!.id }),
    enabled: !!adminClient && !!selectedUser,
  });
  const { data: memberTransactionHistory, isLoading: memberTransactionHistoryLoading } = useQuery({
    queryKey: ["admin-member-transaction-history", selectedUser?.id, memberHistoryTab, memberHistorySearch, memberHistoryStartDate, memberHistoryEndDate, memberHistoryPage, memberHistoryPageSize],
    queryFn: () => adminClient!.memberAdmin.transactionHistory.query({ userId: selectedUser!.id, type: memberHistoryTab === "coupon" ? "all" : memberHistoryTab, search: memberHistorySearch, startDate: memberHistoryStartDate || undefined, endDate: memberHistoryEndDate || undefined, page: memberHistoryPage, pageSize: memberHistoryPageSize }),
    enabled: !!adminClient && !!selectedUser && memberHistoryTab !== "coupon",
  });
  const { data: memberCouponHistory, isLoading: memberCouponHistoryLoading } = useQuery({
    queryKey: ["admin-member-coupon-history", selectedUser?.id, memberHistorySearch, memberHistoryStartDate, memberHistoryEndDate, memberHistoryPage, memberHistoryPageSize],
    queryFn: () => adminClient!.memberAdmin.couponHistory.query({ userId: selectedUser!.id, search: memberHistorySearch, startDate: memberHistoryStartDate || undefined, endDate: memberHistoryEndDate || undefined, page: memberHistoryPage, pageSize: memberHistoryPageSize }),
    enabled: !!adminClient && !!selectedUser && memberHistoryTab === "coupon",
  });
  const { data: memberPaymentSummary } = useQuery({
    queryKey: ["admin-member-payment-summary", selectedUser?.id],
    queryFn: () => adminClient!.memberAdmin.paymentSummary.query({ userId: selectedUser!.id }),
    enabled: !!adminClient && !!selectedUser,
  });
  const latestSuspensionHistory = (restrictionHistory as any[]).find(item => item.status === "suspended");
  const currentRestrictionHistory = (restrictionHistory as any[]).find(item => item.status === selectedUser?.status && item.csCode === selectedUser?.csCode)
    ?? (restrictionHistory as any[]).find(item => item.status === selectedUser?.status);

  const updateNickMutation = useMutation({
    mutationFn: (input: { userId: number; name: string }) => adminClient!.memberAdmin.updateNickname.mutate(input),
    onSuccess: () => { toast.success("닉네임이 수정되었습니다."); setEditForm(null); setSelectedUser(null); setNickCheckResult("idle"); refetch(); },
    onError: (e: Error) => toast.error(`실패: ${e.message}`),
  });

  const handleNickCheck = async () => {
    if (!selectedUser) return;
    // editForm이 없으면 selectedUser.name을 폴백으로 사용
    const nameToCheck = (editForm?.name ?? selectedUser.name ?? "").trim();
    if (!nameToCheck) return;
    setNickChecking(true);
    try {
      const res = await adminClient!.memberAdmin.checkNickname.query({ name: nameToCheck, excludeUserId: selectedUser.id });
      setNickCheckResult(res.isDuplicate ? "duplicate" : "available");
    } catch (e: any) {
      toast.error(`중복 확인 실패: ${e.message}`);
      setNickCheckResult("idle");
    }
    finally { setNickChecking(false); }
  };
  const suspendMutation = useMutation({
    mutationFn: (input: any) => adminClient!.memberAdmin.suspend.mutate(input),
    onSuccess: () => { toast.success("제재 처리되었습니다."); setSuspendForm(null); setSelectedUser(null); refetch(); },
    onError: (e: Error) => toast.error(`실패: ${e.message}`),
  });

  const totalPages = data?.totalPages ?? 1;

  const handleExcelDownload = async () => {
    if (!registrationStartDate || !registrationEndDate) {
      toast.error("Excel 저장 전 등록 기간의 시작일과 종료일을 모두 선택해 주세요.");
      return;
    }
    if (registrationStartDate > registrationEndDate) {
      toast.error("등록 기간의 시작일은 종료일보다 늦을 수 없습니다.");
      return;
    }
    setIsExcelDownloading(true);
    setExcelProgress(null);
    try {
      const exportPageSize = 100;
      const { rows: exportRows, total } = await fetchAllPaged(async (exportPage) => adminClient!.admin.listUsers.query({
        page: exportPage,
        pageSize: exportPageSize,
        search,
        searchField,
        statusFilter: memberTab,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        roleFilter: roleFilter as any,
        registrationStartDate,
        registrationEndDate,
      }), (current, totalPages) => setExcelProgress({ current, total: totalPages }), 50000);
      if (!exportRows.length) { toast.error("선택한 기간에 다운로드할 회원이 없습니다."); return; }
      const headers = ["User ID", "Nickname", "CS Code", "Provider", "Registration Date", "Last Activity", "상태"];
      const rows = exportRows.map((u) => [
        u.id,
        u.name ?? "-",
        u.csCode ?? "-",
        u.loginMethod ?? "-",
        fmt(u.createdAt),
        fmt(u.lastSignedIn),
        (u as any).status === "suspended" ? "이용정지" : (u as any).status === "banned" ? "영구정지" : "정상",
      ]);
      const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `members_${registrationStartDate}_${registrationEndDate}.csv`; a.click();
      URL.revokeObjectURL(url);
      toast.success(`${exportRows.length.toLocaleString()}건의 회원 목록을 저장했습니다.`);
    } catch (error) {
      toast.error(error instanceof Error ? `Excel 저장 실패: ${error.message}` : "Excel 저장에 실패했습니다.");
    } finally {
      setIsExcelDownloading(false);
      setExcelProgress(null);
    }
  };

  const memberTabs = [
    { value: "all" as const, label: "회원 관리" },
    { value: "restricted" as const, label: "이용 제한 회원 관리" },
  ];
  const changeMemberTab = (tab: "all" | "restricted") => {
    setMemberTab(tab);
    setPage(1);
    setSearchField("name");
  };

  if (selectedUser && !suspendForm) {
    return (
      <div className="space-y-6">
        <SectionHeader title="회원 상세" desc="회원 상세 정보를 확인하고 수정·제재 처리할 수 있습니다." action={
          <Button variant="outline" size="sm" onClick={() => { setSelectedUser(null); setEditForm(null); setNickCheckResult("idle"); }}>
            <ChevronLeft className="mr-1 h-4 w-4" />회원 목록
          </Button>
        } />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-0 divide-y text-sm">
              <div className="grid grid-cols-3 gap-2 py-3"><span className="font-medium text-muted-foreground">User ID</span><span className="col-span-2 font-mono">{selectedUser.id}</span></div>
              <div className="grid grid-cols-3 gap-2 py-3"><span className="font-medium text-muted-foreground">Open ID</span><span className="col-span-2 break-all font-mono text-xs">{selectedUser.openId}</span></div>
              <div className="grid grid-cols-3 gap-2 py-3 items-start">
                <span className="pt-1.5 font-medium text-muted-foreground">Nickname</span>
                <div className="col-span-2">
                  <div className="flex gap-2">
                    <Input value={editForm?.name ?? selectedUser.name ?? ""} onChange={e => { setEditForm({ name: e.target.value }); setNickCheckResult("idle"); }} className="h-8" />
                    <Button size="sm" className="h-8 bg-blue-500 text-white hover:bg-blue-600" onClick={handleNickCheck} disabled={nickChecking || !(editForm?.name ?? selectedUser.name)}>{nickChecking ? "검색중" : "검색"}</Button>
                  </div>
                  <p className={`mt-1 h-4 text-xs font-medium ${nickCheckResult === "available" ? "text-blue-500" : nickCheckResult === "duplicate" ? "text-red-500" : "text-transparent"}`}>
                    {nickCheckResult === "available" ? "사용 가능 합니다." : nickCheckResult === "duplicate" ? "이미 사용중인 닉네임 입니다" : " "}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 py-3"><span className="font-medium text-muted-foreground">Provider</span><span className="col-span-2">{selectedUser.loginMethod ?? "-"}</span></div>
              <div className="grid grid-cols-3 gap-2 py-3"><span className="font-medium text-muted-foreground">가입일</span><span className="col-span-2">{fmt(selectedUser.createdAt)}</span></div>
              <div className="grid grid-cols-3 gap-2 py-3"><span className="font-medium text-muted-foreground">마지막 로그인</span><span className="col-span-2">{fmt(selectedUser.lastSignedIn)}</span></div>
              <div className="grid grid-cols-3 gap-2 py-3"><span className="font-medium text-muted-foreground">누적 결제금액</span><span className="col-span-2 font-semibold text-blue-700">${Number(memberPaymentSummary?.totalPaymentUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              <div className="grid grid-cols-3 gap-2 py-3"><span className="font-medium text-muted-foreground">상태</span><span className={`col-span-2 font-medium ${(selectedUser as any).status === "active" ? "" : "text-red-500"}`}>{(selectedUser as any).status === "suspended" ? "이용정지" : (selectedUser as any).status === "banned" ? "영구정지" : "정상"}</span></div>
              <div className="py-4">
                <p className="mb-2 font-medium text-muted-foreground">이용제한 이력</p>
                <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                  <table className="w-full table-fixed text-xs"><thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-300"><tr><th className="px-2 py-2 text-left">처리일시</th><th className="px-2 py-2 text-left">구분</th><th className="px-2 py-2 text-left">CS Code</th><th className="px-2 py-2 text-left">이용정지 기간</th><th className="px-2 py-2 text-left">사유</th></tr></thead>
                    <tbody>{!(restrictionHistory as any[]).length ? <tr><td colSpan={5} className="px-2 py-4 text-center text-muted-foreground">이용제한 이력이 없습니다.</td></tr> : (restrictionHistory as any[]).map(history => <tr key={history.id} className="border-t"><td className="px-2 py-2">{fmt(history.appliedAt)}</td><td className="px-2 py-2">{history.status === "banned" ? "영구정지" : "이용정지"}</td><td className="px-2 py-2 font-mono">{history.csCode ?? "-"}</td><td className="px-2 py-2">{history.status === "suspended" ? `${fmt(history.appliedAt)} ~ ${fmt(history.suspendedUntil)}` : "영구 제한"}</td><td className="px-2 py-2">{history.reason ?? "-"}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
              <div className="py-4">
                <MemberHistoryControls tab={memberHistoryTab} searchInput={memberHistorySearchInput} startDate={memberHistoryStartDate} endDate={memberHistoryEndDate} pageSize={memberHistoryPageSize} onTabChange={nextTab => { setMemberHistoryTab(nextTab); setMemberHistoryPage(1); }} onSearchInputChange={setMemberHistorySearchInput} onStartDateChange={value => { setMemberHistoryStartDate(value); setMemberHistoryPage(1); }} onEndDateChange={value => { setMemberHistoryEndDate(value); setMemberHistoryPage(1); }} onPageSizeChange={value => { setMemberHistoryPageSize(value); setMemberHistoryPage(1); }} onSearch={() => { setMemberHistorySearch(memberHistorySearchInput); setMemberHistoryPage(1); }} />
                {memberHistoryTab === "coupon" ? <MemberCouponHistoryTable items={memberCouponHistory?.items ?? []} loading={memberCouponHistoryLoading} /> : <MemberTransactionTable items={memberTransactionHistory?.items ?? []} tab={memberHistoryTab} loading={memberTransactionHistoryLoading} />}
                <Pagination page={memberHistoryPage} total={memberHistoryTab === "coupon" ? memberCouponHistory?.total ?? 0 : memberTransactionHistory?.total ?? 0} pageSize={memberHistoryPageSize} onChange={setMemberHistoryPage} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-start gap-2">
              <Button variant="outline" className="border border-slate-300" disabled={updateNickMutation.isPending || nickCheckResult === "duplicate" || (!editForm && nickCheckResult === "idle")} onClick={() => { if (editForm) updateNickMutation.mutate({ userId: selectedUser.id, name: editForm.name }); }}>{updateNickMutation.isPending ? "저장 중..." : "저장"}</Button>
              <Button variant="outline" className="border border-slate-300" onClick={() => { setSelectedUser(null); setEditForm(null); setNickCheckResult("idle"); }}>이전</Button>
              <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => { const now = nowDateTimeLocal(); setSuspendForm({ status: "suspended", reason: "", startDate: now, until: calcExpiry(now, "7"), csCode: generateCsCode(), suspendDays: "7" }); }}>이용 제한</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="회원 관리" desc="가입 회원 목록 조회, 정보 수정, 제재 처리" action={
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700 text-white h-9 text-sm" onClick={handleExcelDownload} disabled={isExcelDownloading}>{isExcelDownloading ? (excelProgress ? `저장 중... (${excelProgress.current}/${excelProgress.total})` : "저장 준비 중...") : "Excel 저장"}</Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1" />새로고침</Button>
        </div>
      } />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            <div className="flex border-b border-slate-200 dark:border-slate-700" role="tablist" aria-label="회원 관리 상태 탭">
              {memberTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={memberTab === tab.value}
                  onClick={() => changeMemberTab(tab.value)}
                  className={`relative px-6 py-3 text-sm font-semibold transition-colors ${memberTab === tab.value ? "text-blue-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                >
                  {tab.label}
                  {memberTab === tab.value && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />}
                </button>
              ))}
            </div>
            <div className="flex flex-col xl:flex-row xl:items-center gap-3">
              <div className="flex items-center gap-2 w-full xl:w-[380px] shrink-0">
                <Select value={searchField} onValueChange={value => { setSearchField(value as "name" | "id" | "csCode"); setPage(1); }}>
                  <SelectTrigger className="w-36 h-8 text-sm shrink-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nickname</SelectItem>
                    <SelectItem value="id">User ID</SelectItem>
                    <SelectItem value="csCode">CS Code</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder={`${searchField === "name" ? "Nickname" : searchField === "id" ? "User ID" : "CS Code"} 검색`} value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (setSearch(searchInput), setPage(1))} className="pl-8 h-8 text-sm" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm shrink-0">
                <span className="shrink-0 font-medium text-slate-600 dark:text-slate-300">등록 기간</span>
                <Input type="date" value={registrationStartDate} onChange={e => { setRegistrationStartDate(e.target.value); setPage(1); }} className="h-8 w-36 text-sm" aria-label="등록 기간 시작일" />
                <span className="text-slate-400">~</span>
                <Input type="date" value={registrationEndDate} onChange={e => { setRegistrationEndDate(e.target.value); setPage(1); }} className="h-8 w-36 text-sm" aria-label="등록 기간 종료일" />
              </div>
              <Button size="sm" onClick={() => { setSearch(searchInput); setPage(1); }} className="h-8 w-14 shrink-0">검색</Button>
              <div className="flex flex-wrap gap-2 xl:ml-auto">
                <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
                  <SelectTrigger className="w-28 h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}개씩</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="text-center py-8 text-muted-foreground text-sm">로딩 중...</div> : !data?.data?.length ? (
            <div className="text-center py-8 text-muted-foreground text-sm">회원이 없습니다.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-muted-foreground text-xs">
                    <th className="text-left p-2">User ID</th>
                    <th className="text-left p-2">Nickname</th>
                    <th className="text-left p-2">CS Code</th>
                    <th className="text-left p-2">Provider</th>
                    <th className="text-left p-2">Registration Date</th>
                    <th className="text-left p-2">Last Activity</th>
                    <th className="text-left p-2">상태</th>
                    <th className="text-left p-2">처리</th>
                  </tr></thead>
                  <tbody>
                    {(data?.data ?? []).map((u: UserRow) => (
                      <tr key={u.id} className="border-b hover:bg-accent/20 cursor-pointer" onClick={() => setSelectedUser(u)}>
                        <td className="p-2 text-xs text-muted-foreground font-mono">{u.id}</td>
                        <td className="p-2 font-medium">{u.name ?? "-"}</td>
                        <td className="p-2 text-xs font-mono text-muted-foreground">{u.csCode ?? "-"}</td>
                        <td className="p-2 text-xs text-muted-foreground">{u.loginMethod ?? "-"}</td>
                        <td className="p-2 text-xs text-muted-foreground">{fmt(u.createdAt)}</td>
                        <td className="p-2 text-xs text-muted-foreground">{fmt(u.lastSignedIn)}</td>
                        <td className="p-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${(u as any).status === "suspended" ? "bg-orange-100 text-orange-700" : (u as any).status === "banned" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {(u as any).status === "suspended" ? "이용 정지" : (u as any).status === "banned" ? "영구 정지" : "정상"}
                          </span>
                        </td>
                        <td className="p-2" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs border border-slate-300" onClick={() => { setSelectedUser(u); }}>수정</Button>
                            <Button size="sm" className="h-7 text-xs bg-red-500 hover:bg-red-600 text-white" onClick={() => { setSelectedUser(u); (() => { const now = nowDateTimeLocal(); const expiry = calcExpiry(now, "7"); setSuspendForm({ status: "suspended", reason: "", startDate: now, until: expiry, csCode: generateCsCode(), suspendDays: "7" }); })(); }}>이용 제한</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} total={data.total} pageSize={pageSize} onChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>

      {/* 회원 상세 / 수정 모달 */}
      {/* 회원 정보 조회 + 닉네임 수정 통합 팝업 */}
      <Dialog open={!!selectedUser && !suspendForm} onOpenChange={() => { setSelectedUser(null); setEditForm(null); setNickCheckResult("idle"); }}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] sm:max-w-none xl:max-w-5xl max-h-[92vh] overflow-x-hidden overflow-y-auto">
          <DialogHeader>
            <DialogTitle>회원 정보 조회</DialogTitle>
            <DialogDescription>회원 상세 정보를 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-0 text-sm divide-y">
              {/* ID */}
              <div className="grid grid-cols-3 gap-2 py-2.5">
                <span className="text-muted-foreground font-medium">User ID</span>
                <span className="col-span-2 font-mono">{selectedUser.id}</span>
              </div>
              {/* Open ID */}
              <div className="grid grid-cols-3 gap-2 py-2.5">
                <span className="text-muted-foreground font-medium">Open ID</span>
                <span className="col-span-2 font-mono break-all text-xs">{selectedUser.openId}</span>
              </div>
              {/* Nickname - 인라인 편집 */}
              <div className="grid grid-cols-3 gap-2 py-2.5 items-start">
                <span className="text-muted-foreground font-medium pt-1.5">Nickname</span>
                <div className="col-span-2">
                  <div className="flex gap-2">
                    <Input
                      value={editForm?.name ?? selectedUser.name ?? ""}
                      onChange={e => {
                        setEditForm({ name: e.target.value });
                        setNickCheckResult("idle");
                      }}
                      className="h-8 text-sm"
                      placeholder="닉네임 입력"
                    />
                    <Button size="sm" className="h-8 shrink-0 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleNickCheck} disabled={nickChecking || !(editForm?.name ?? selectedUser.name)}>
                      {nickChecking ? "검색중" : "검색"}
                    </Button>
                  </div>
                  {/* 항상 공간 확보 - 결과 없을 때는 투명 */}
                  <p className={`text-xs font-medium mt-1 h-4 ${
                    nickCheckResult === "available" ? "text-blue-500" :
                    nickCheckResult === "duplicate" ? "text-red-500" :
                    "text-transparent"
                  }`}>
                    {nickCheckResult === "available" ? "사용 가능 합니다." :
                     nickCheckResult === "duplicate" ? "이미 사용중인 닉네임 입니다" :
                     " "}
                  </p>
                </div>
              </div>
              {/* Provider */}
              <div className="grid grid-cols-3 gap-2 py-2.5">
                <span className="text-muted-foreground font-medium">Provider</span>
                <span className="col-span-2">{selectedUser.loginMethod ?? "-"}</span>
              </div>
              {/* 가입일 */}
              <div className="grid grid-cols-3 gap-2 py-2.5">
                <span className="text-muted-foreground font-medium">가입일</span>
                <span className="col-span-2">{fmt(selectedUser.createdAt)}</span>
              </div>
              {/* 마지막 로그인 */}
              <div className="grid grid-cols-3 gap-2 py-2.5">
                <span className="text-muted-foreground font-medium">마지막 로그인</span>
                <span className="col-span-2">{fmt(selectedUser.lastSignedIn)}</span>
              </div>
              {/* 상태 */}
              <div className="grid grid-cols-3 gap-2 py-2.5">
                <span className="text-muted-foreground font-medium">상태</span>
                <div className={`col-span-2 flex min-w-0 flex-wrap items-center gap-3 font-medium ${
                  (selectedUser as any).status === "suspended" ? "text-red-500" :
                  (selectedUser as any).status === "banned" ? "text-red-500" :
                  "text-foreground"
                }`}>
                  <span>
                    {(selectedUser as any).status === "suspended" ? "이용정지" :
                     (selectedUser as any).status === "banned" ? "영구정지" :
                     "정상"}
                  </span>
                  {(selectedUser as any).status === "suspended" && (
                    <span className="text-xs font-normal text-slate-600 dark:text-slate-300">
                      기간: {fmt(latestSuspensionHistory?.appliedAt ?? selectedUser.updatedAt)} ~ {fmt(selectedUser.suspendedUntil)}
                    </span>
                  )}
                  {((selectedUser as any).status === "suspended" || (selectedUser as any).status === "banned") && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 border-slate-400 bg-white px-4 text-slate-700 hover:bg-slate-50"
                      onClick={() => setMemberRestrictionPreview({
                        status: (selectedUser as any).status,
                        csCode: selectedUser.csCode ?? currentRestrictionHistory?.csCode ?? "-",
                        reason: (selectedUser as any).suspendReason ?? currentRestrictionHistory?.reason ?? "",
                        appliedAt: currentRestrictionHistory?.appliedAt ?? selectedUser.updatedAt,
                        suspendedUntil: (selectedUser as any).suspendedUntil ?? currentRestrictionHistory?.suspendedUntil ?? null,
                      })}
                    >
                      팝업 미리보기
                    </Button>
                  )}
                </div>
              </div>
              <div className="py-3 space-y-2">
                <span className="text-muted-foreground font-medium">이용제한 이력</span>
                <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                  <table className="w-full table-fixed text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                      <tr>
                        <th className="w-[17%] px-2 py-2 text-left font-medium">처리일시</th>
                        <th className="w-[12%] px-2 py-2 text-left font-medium">구분</th>
                        <th className="w-[17%] px-2 py-2 text-left font-medium">CS Code</th>
                        <th className="w-[29%] px-2 py-2 text-left font-medium">이용정지 기간</th>
                        <th className="w-[25%] px-2 py-2 text-left font-medium">사유</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restrictionHistoryLoading ? (
                        <tr><td colSpan={5} className="px-2 py-4 text-center text-muted-foreground">이력 조회 중...</td></tr>
                      ) : !(restrictionHistory as any[]).length ? (
                        <tr><td colSpan={5} className="px-2 py-4 text-center text-muted-foreground">이용제한 이력이 없습니다.</td></tr>
                      ) : (restrictionHistory as any[]).map((history) => (
                        <tr key={history.id} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="px-2 py-2 break-words text-muted-foreground">{fmt(history.appliedAt)}</td>
                          <td className={`px-2 py-2 break-words font-medium ${history.status === "banned" ? "text-red-600" : history.status === "suspended" ? "text-orange-600" : "text-slate-600 dark:text-slate-300"}`}>{history.status === "banned" ? "영구정지" : history.status === "suspended" ? "이용정지" : "제한 해제"}</td>
                          <td className="px-2 py-2 break-all font-mono text-muted-foreground">{history.csCode ?? "-"}</td>
                          <td className="px-2 py-2 break-words text-muted-foreground">{history.status === "suspended" ? `${fmt(history.appliedAt)} ~ ${fmt(history.suspendedUntil)}` : history.status === "banned" ? "영구 제한" : "-"}</td>
                          <td className="px-2 py-2 break-words text-muted-foreground">{history.reason ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {(selectedUser as any).suspendReason && (
                <div className="grid grid-cols-3 gap-2 py-2.5">
                  <span className="text-muted-foreground font-medium">제재 사유</span>
                  <span className="col-span-2">{(selectedUser as any).suspendReason}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="border border-slate-300"
              disabled={updateNickMutation.isPending || nickCheckResult === "duplicate" || (!editForm && nickCheckResult === "idle")}
              onClick={() => {
                if (selectedUser && editForm) {
                  updateNickMutation.mutate({ userId: selectedUser.id, name: editForm.name });
                }
              }}
            >
              {updateNickMutation.isPending ? "저장 중..." : "저장"}
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                const now = nowDateTimeLocal();
                const expiry = calcExpiry(now, "7");
                setSuspendForm({ status: "suspended", reason: "", startDate: now, until: expiry, csCode: generateCsCode(), suspendDays: "7" });
              }}
            >이용 제한</Button>
            <Button variant="outline" className="border border-slate-300" onClick={() => { setSelectedUser(null); setEditForm(null); setNickCheckResult("idle"); }}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 현재 회원 제재 팝업 미리보기 */}
      <Dialog open={!!memberRestrictionPreview} onOpenChange={(open) => { if (!open) setMemberRestrictionPreview(null); }}>
        <DialogContent className="max-w-md border-0 bg-white p-0 shadow-2xl">
          <div className="p-7 text-slate-800">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-center text-xl font-bold">운영정책에 따른 접속 제한</DialogTitle>
              <DialogDescription className="sr-only">현재 제재 상태에 따른 접속 제한 안내입니다.</DialogDescription>
            </DialogHeader>
            {memberRestrictionPreview && (() => {
              const start = memberRestrictionPreview.appliedAt ? new Date(memberRestrictionPreview.appliedAt) : null;
              const end = memberRestrictionPreview.suspendedUntil ? new Date(memberRestrictionPreview.suspendedUntil) : null;
              const suspensionDays = start && end
                ? Math.max(1, Math.round((new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime() - new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()) / (1000 * 60 * 60 * 24)))
                : null;
              return (
                <div className="mt-5 space-y-2 text-sm leading-6">
                  <p><span className="font-semibold text-red-500">CS Code</span> : {memberRestrictionPreview.csCode}</p>
                  <p><span className="font-semibold text-red-500">제재 사유</span> : {memberRestrictionPreview.reason || "(사유 없음)"}</p>
                  <p><span className="font-semibold text-red-500">제재 시작일</span> : {start ? fmt(start) : "-"}</p>
                  <p><span className="font-semibold text-red-500">제재 일자</span> : {memberRestrictionPreview.status === "banned" ? "영구" : (start ? fmt(start) : "-")}</p>
                  {memberRestrictionPreview.status === "suspended" && suspensionDays && (
                    <p><span className="font-semibold text-red-500">제재 일수</span> : {suspensionDays}일</p>
                  )}
                </div>
              );
            })()}
            <div className="mt-6 flex gap-3">
              <Button type="button" variant="outline" className="flex-1 border-0 bg-slate-800 text-white hover:bg-slate-700">고객센터</Button>
              <Button type="button" className="flex-1 bg-blue-500 hover:bg-blue-600" onClick={() => setMemberRestrictionPreview(null)}>확인</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 이용 제한 모달 */}
      <Dialog open={!!suspendForm && !showSuspendPreview} onOpenChange={() => setSuspendForm(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold bg-pink-100 text-pink-800 px-3 py-1.5 rounded w-fit">이용 제한 설정</DialogTitle>
            <DialogDescription>{selectedUser?.name} 회원에 대한 제재를 처리합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-1">
            {/* CS Code */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">CS Code</label>
              <div className="flex gap-2">
                <Input value={suspendForm?.csCode ?? ""} readOnly className="font-mono bg-slate-50 flex-1" />
                <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setSuspendForm(f => f && ({ ...f, csCode: generateCsCode() }))}>재생성</Button>
              </div>
            </div>
            {/* 이용 제한 유형 */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold bg-pink-100 text-pink-800 px-2 py-0.5 rounded inline-block">이용 제한 유형</label>
              <Select value={suspendForm?.status ?? "suspended"} onValueChange={v => setSuspendForm(f => f && ({ ...f, status: v }))}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">제한 해제 (정상)</SelectItem>
                  <SelectItem value="suspended">이용 정지</SelectItem>
                  <SelectItem value="banned">영구 정지</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 이용 제한 시작일시 */}
            {suspendForm?.status !== "active" && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold bg-pink-100 text-pink-800 px-2 py-0.5 rounded inline-block">이용 제한 시작일시</label>
                <DateTimeInput
                  value={suspendForm?.startDate ?? ""}
                  onChange={start => {
                    setSuspendForm(f => {
                      if (!f) return f;
                      const expiry = calcExpiry(start, f.suspendDays);
                      return { ...f, startDate: start, until: expiry };
                    });
                  }}
                />
              </div>
            )}
            {/* 이용 제한 일수 */}
            {suspendForm?.status === "suspended" && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold bg-pink-100 text-pink-800 px-2 py-0.5 rounded inline-block">이용 제한 일수</label>
                <Input
                  type="number"
                  min="1"
                  value={suspendForm.suspendDays}
                  onChange={e => {
                    const days = e.target.value;
                    setSuspendForm(f => {
                      if (!f) return f;
                      const expiry = calcExpiry(f.startDate, days);
                      return { ...f, suspendDays: days, until: expiry };
                    });
                  }}
                  placeholder="정지 일수 (예: 7)"
                />
              </div>
            )}
            {/* 이용 제한 만료일시 */}
            {suspendForm?.status === "suspended" && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold bg-pink-100 text-pink-800 px-2 py-0.5 rounded inline-block">이용 제한 만료일시</label>
                <DateTimeInput
                  value={suspendForm?.until ?? ""}
                  onChange={v => setSuspendForm(f => f && ({ ...f, until: v }))}
                  placeholder="자동 계산 또는 직접 입력 (YYYY-MM-DD HH:mm)"
                />
              </div>
            )}
            {/* 이용 제한 사유 */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold bg-pink-100 text-pink-800 px-2 py-0.5 rounded inline-block">이용 제한 사유</label>
              <Input value={suspendForm?.reason ?? ""} onChange={e => setSuspendForm(f => f && ({ ...f, reason: e.target.value }))} placeholder="제재 사유 입력" />
            </div>
            {/* 팝업 미리보기 */}
            {suspendForm?.status !== "active" && (
              <Button type="button" variant="outline" className="w-full" onClick={() => setShowSuspendPreview(true)}>팝업 미리보기</Button>
            )}
          </div>
          <DialogFooter>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => { if (selectedUser && suspendForm) suspendMutation.mutate({ userId: selectedUser.id, status: suspendForm.status as any, suspendedUntil: suspendForm.until || undefined, reason: suspendForm.reason || undefined, csCode: suspendForm.csCode || undefined } as any); }} disabled={suspendMutation.isPending}>저장</Button>
            <Button variant="ghost" onClick={() => setSuspendForm(null)}>취소</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 제재 팝업 미리보기 */}
      <Dialog open={showSuspendPreview} onOpenChange={() => setShowSuspendPreview(false)}>
        <DialogContent className="max-w-sm">
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-center text-slate-800">운영정책에 따른 접속 제한</h2>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-red-500 font-semibold">CS Code</span> : {suspendForm?.csCode}</p>
              <p><span className="text-red-500 font-semibold">제재 사유</span> : {suspendForm?.reason || "(사유 없음)"}</p>
              <p><span className="text-red-500 font-semibold">제재 시작일</span> : {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, "년 ").replace(".", "일")}</p>
              <p><span className="text-red-500 font-semibold">제재 일자</span> : {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, "년 ").replace(".", "일")}</p>
              {suspendForm?.status === "suspended" && suspendForm.suspendDays && (
                <p><span className="text-red-500 font-semibold">제재 일수</span> : {suspendForm.suspendDays}일</p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 bg-slate-800 text-white hover:bg-slate-700 border-0">고객센터</Button>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600" onClick={() => setShowSuspendPreview(false)}>확인</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── GAME SECTION ─────────────────────────────────────────────────────────────
type GameForm = { id?: number; name: string; gameId: string; description: string; imageUrl: string; genre: string; platform: string; status: "active" | "inactive"; sortOrder: number };

function GameSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<GameForm | null>(null);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();
  const { data, refetch } = useQuery({ queryKey: ["admin-games", search, page], queryFn: () => adminClient!.games.list.query({ search, page, pageSize: 20 }), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.games.create.mutate(input), onSuccess: () => { toast.success("게임이 등록되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.games.update.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.games.delete.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const moveOrder = async (items: any[], idx: number, dir: "up" | "down") => {
    const arr = [...items];
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;

    // sortOrder가 동일한 경우 인덱스 기반으로 재할당
    const needsReindex = arr.some((g, i) => i > 0 && g.sortOrder === arr[i - 1].sortOrder);
    if (needsReindex) {
      arr.forEach((g, i) => { g.sortOrder = (i + 1) * 10; });
    }

    // 실제 스왕할 sortOrder 값
    const aOrder = arr[idx].sortOrder;
    const bOrder = arr[swapIdx].sortOrder;

    // 낙관적 업데이트: 즉시 UI 반영
    const newItems = arr.map((g, i) => {
      if (i === idx) return { ...g, sortOrder: bOrder };
      if (i === swapIdx) return { ...g, sortOrder: aOrder };
      return g;
    });
    newItems.sort((a, b) => a.sortOrder - b.sortOrder);
    queryClient.setQueryData(["admin-games", search, page], (old: any) =>
      old ? { ...old, items: newItems } : old
    );

    try {
      if (needsReindex) {
        // 전체 재인덱스 후 스왕
        await Promise.all(arr.map((g) => adminClient!.games.update.mutate({ id: g.id, sortOrder: g.sortOrder })));
      }
      await adminClient!.games.update.mutate({ id: arr[idx].id, sortOrder: bOrder });
      await adminClient!.games.update.mutate({ id: arr[swapIdx].id, sortOrder: aOrder });
    } catch (e: any) {
      // 실패 시 원래대로 롤백
      queryClient.setQueryData(["admin-games", search, page], (old: any) =>
        old ? { ...old, items: items } : old
      );
      toast.error(`순서 변경 실패: ${e.message}`);
    }
  };

  const empty: GameForm = { name: "", gameId: "", description: "", imageUrl: "", genre: "", platform: "", status: "active", sortOrder: 0 };
  const submit = () => { if (!form?.name) { toast.error("게임명을 입력하세요."); return; } form.id ? updateM.mutate(form) : createM.mutate(form); };

  const handleIconSelect = async () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/jpeg,image/webp,image/png,image/gif";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      if (file.size > 500 * 1024) { toast.error("500KB 이하 이미지를 선택해주세요."); return; }
      setUploading(true);
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>(r => { reader.onload = ev => r(ev.target?.result as string); reader.readAsDataURL(file); });
        // 파일명을 ASCII로 변환 (한글 등 비ASCII 문자 제거)
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const safeFilename = `game-icon-${Date.now()}.${ext}`;
        const result = await adminClient!.admin.uploadBannerImage.mutate({ base64, filename: safeFilename });
        setForm(f => f && ({ ...f, imageUrl: result.url }));
        toast.success("아이콘 업로드 완료");
      } catch (err: any) { toast.error(`업로드 실패: ${err.message}`); }
      finally { setUploading(false); }
    };
    input.click();
  };

  const toStatusLabel = (status: string) => status === "active" ? "활성" : "비활성";
  const toFormStatus = (status: string): "active" | "inactive" => (status === "active" ? "active" : "inactive");

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "게임 수정" : "게임 등록") : "Game 관리"} desc="서비스에서 제공할 게임 정보를 관리합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />게임 등록</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

      {!form ? (
        <Card>
          <CardHeader className="pb-3">
            <SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setPage(1); }} placeholder="게임명 검색..." />
          </CardHeader>
          <CardContent className="p-0">
            {!data?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 게임이 없습니다.</div> : (
              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 dark:bg-slate-800">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground w-20">아이콘</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">게임명</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">게임ID</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">장르</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">플랫폼</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">상태</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">순서</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((g: any, idx: number) => (
                      <tr
                        key={g.id}
                        className="border-b last:border-0 hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => setForm({ id: g.id, name: g.name, gameId: g.gameId ?? "", description: g.description ?? "", imageUrl: g.imageUrl ?? "", genre: g.genre ?? "", platform: g.platform ?? "", status: toFormStatus(g.status), sortOrder: g.sortOrder })}
                      >
                        <td className="px-4 py-3">
                          {g.imageUrl
                            ? <img src={g.imageUrl} alt={g.name} className="w-20 h-20 object-cover rounded-lg" />
                            : <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">없음</div>}
                        </td>
                        <td className="px-4 py-3 font-medium">{g.name}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{g.gameId ?? "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{g.genre ?? "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{g.platform ?? "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            g.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          }`}>{toStatusLabel(g.status)}</span>
                        </td>
                        <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost" size="sm"
                              disabled={idx === 0}
                              onClick={() => moveOrder(data.items, idx, "up")}
                              title="위로"
                            ><ChevronUp className="h-4 w-4" /></Button>
                            <Button
                              variant="ghost" size="sm"
                              disabled={idx === data.items.length - 1}
                              onClick={() => moveOrder(data.items, idx, "down")}
                              title="아래로"
                            ><ChevronDown className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3">
                  <Pagination page={page} total={data.total} pageSize={20} onChange={setPage} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">게임명 *</label><Input value={form.name} onChange={e => setForm(f => f && ({ ...f, name: e.target.value }))} placeholder="게임명" /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">게임ID *</label><Input value={form.gameId} onChange={e => setForm(f => f && ({ ...f, gameId: e.target.value }))} placeholder="게임 고유 ID (예: ragnarok-universe)" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">장르</label><Input value={form.genre} onChange={e => setForm(f => f && ({ ...f, genre: e.target.value }))} placeholder="Fantasy MMORPG" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">플랫폼</label><Input value={form.platform} onChange={e => setForm(f => f && ({ ...f, platform: e.target.value }))} placeholder="Web Browser" /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">소개</label><textarea className="w-full border rounded-md p-2 text-sm min-h-[80px]" value={form.description} onChange={e => setForm(f => f && ({ ...f, description: e.target.value }))} placeholder="게임 소개" /></div>
            {/* 아이콘 등록 */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">아이콘 등록</label>
              <div className="flex items-start gap-4">
                {/* 왼쪽 미리보기 */}
                <div className="shrink-0">
                  {form.imageUrl
                    ? <img src={form.imageUrl} alt="아이콘 미리보기" className="w-20 h-20 object-cover rounded-lg border shadow-sm" />
                    : <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 text-xs">미등록</div>}
                </div>
                {/* 오른쪽 컨트롤 */}
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleIconSelect} disabled={uploading}>
                    {uploading ? "업로드 중..." : "PC에서 이미지 파일 찾기"}
                  </Button>
                  {form.imageUrl && (
                    <Button type="button" variant="ghost" size="sm" className="text-red-500 justify-start px-2" onClick={() => setForm(f => f && ({ ...f, imageUrl: "" }))}>아이콘 삭제</Button>
                  )}
                  <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF · 최대 500KB</p>
                  {form.imageUrl && (
                    <p className="text-xs text-muted-foreground break-all max-w-xs">{form.imageUrl}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">상태</label>
              <Select value={form.status} onValueChange={v => setForm(f => f && ({ ...f, status: v as "active" | "inactive" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">순서</label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => f && ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
          </div>
          <div className="flex gap-2 pt-2"><Button onClick={submit} disabled={createM.isPending || updateM.isPending}>{form.id ? "수정 저장" : "게임 등록"}</Button><Button variant="outline" onClick={() => setForm(null)}>취소</Button></div>
        </CardContent></Card>
      )}
    </div>
  );
}

// ─── BANNER SECTION ───────────────────────────────────────────────────────────
type BannerRow = { id: number; title: string; imageUrl: string; imageKey: string | null; actionType: "url" | "content"; actionUrl: string | null; contentTitle: string | null; contentDate: string | null; contentBody: string | null; sortOrder: number; isActive: number; startDate: string | null; endDate: string | null; createdAt: Date; updatedAt: Date };
type BannerForm = { id?: number; title: string; imageUrl: string; actionType: "url" | "content"; actionUrl: string; contentTitle: string; contentDate: string; contentBody: string; sortOrder: number; isActive: number; startDate: string; endDate: string };

function BannerSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [form, setForm] = useState<BannerForm | null>(null);
  const [preview, setPreview] = useState<BannerRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  const [checkedBannerIds, setCheckedBannerIds] = useState<number[]>([]);
  const [isExposureMoving, setIsExposureMoving] = useState(false);
  const visibleBannerLimit = 10;

  const { data, refetch } = useQuery({ queryKey: ["admin-banners"], queryFn: () => adminClient!.admin.listBanners.query(), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.admin.createBanner.mutate(input), onSuccess: () => { toast.success("배너가 등록되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.admin.updateBanner.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.admin.deleteBanner.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const empty: BannerForm = { title: "", imageUrl: "", actionType: "url", actionUrl: "", contentTitle: "", contentDate: "", contentBody: "", sortOrder: (data?.length ?? 0), isActive: 1, startDate: "", endDate: "" };
  const submit = () => {
    if (!form?.title || !form?.imageUrl) { toast.error("제목과 이미지를 입력하세요."); return; }
    const p = { title: form.title, imageUrl: form.imageUrl, actionType: form.actionType, actionUrl: form.actionUrl || undefined, contentTitle: form.contentTitle || undefined, contentDate: form.contentDate || undefined, contentBody: form.contentBody || undefined, sortOrder: form.sortOrder, isActive: form.isActive, startDate: form.startDate || null, endDate: form.endDate || null };
    form.id ? updateM.mutate({ id: form.id, ...p }) : createM.mutate(p);
  };

  const handleFileSelect = async () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/jpeg,image/webp,image/png";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      if (file.size > 500 * 1024) { toast.error("500KB 초과"); return; }
      setUploading(true);
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>(r => { reader.onload = ev => r(ev.target?.result as string); reader.readAsDataURL(file); });
        const result = await adminClient!.admin.uploadBannerImage.mutate({ base64, filename: file.name });
        setForm(f => f && ({ ...f, imageUrl: result.url }));
        toast.success("이미지 업로드 완료");
      } catch (e: any) { toast.error(`업로드 실패: ${e.message}`); }
      finally { setUploading(false); }
    };
    input.click();
  };

  const allBanners = useMemo(() => [...(data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id), [data]);
  const selectedBanners = allBanners.filter(b => b.isActive === 1).slice(0, visibleBannerLimit);
  const unselectedBanners = [
    ...allBanners.filter(b => b.isActive === 1).slice(visibleBannerLimit),
    ...allBanners.filter(b => b.isActive !== 1),
  ];
  const matchSearch = (banner: BannerRow) => !search || banner.title.toLowerCase().includes(search.toLowerCase());
  const filteredSelected = selectedBanners.filter(matchSearch);
  const filteredUnselected = unselectedBanners.filter(matchSearch);
  const pagedUnselected = filteredUnselected.slice((page - 1) * pageSize, page * pageSize);
  const paged = pagedUnselected;
  const filtered = filteredUnselected;
  const openBannerForm = (banner: BannerRow) => setForm({ id: banner.id, title: banner.title, imageUrl: banner.imageUrl, actionType: banner.actionType, actionUrl: banner.actionUrl ?? "", contentTitle: banner.contentTitle ?? "", contentDate: banner.contentDate ?? "", contentBody: banner.contentBody ?? "", sortOrder: banner.sortOrder, isActive: banner.isActive, startDate: banner.startDate ?? "", endDate: banner.endDate ?? "" });
  const toggleBannerChecked = (id: number, checked: boolean) => setCheckedBannerIds(current => checked ? Array.from(new Set([...current, id])) : current.filter(item => item !== id));
  const toggleGroupChecked = (rows: BannerRow[], checked: boolean) => setCheckedBannerIds(current => checked ? Array.from(new Set([...current, ...rows.map(row => row.id)])) : current.filter(id => !rows.some(row => row.id === id)));
  const isGroupChecked = (rows: BannerRow[]) => rows.length > 0 && rows.every(row => checkedBannerIds.includes(row.id));

  const moveCheckedBanners = async (direction: "show" | "hide") => {
    const source = direction === "show" ? unselectedBanners : selectedBanners;
    const moving = source.filter(banner => checkedBannerIds.includes(banner.id));
    if (!moving.length) { toast.error(direction === "show" ? "노출할 배너를 선택하세요." : "미노출할 배너를 선택하세요."); return; }
    if (direction === "show" && selectedBanners.length + moving.length > visibleBannerLimit) {
      toast.error(`노출 배너는 최대 ${visibleBannerLimit}개까지 선택할 수 있습니다.`);
      return;
    }
    const nextSelected = direction === "show"
      ? [...selectedBanners, ...moving]
      : selectedBanners.filter(banner => !checkedBannerIds.includes(banner.id));
    const nextUnselected = direction === "show"
      ? unselectedBanners.filter(banner => !checkedBannerIds.includes(banner.id))
      : [...moving, ...unselectedBanners.filter(banner => !checkedBannerIds.includes(banner.id))];

    setIsExposureMoving(true);
    try {
      await Promise.all([
        ...nextSelected.map((banner, index) => adminClient!.admin.updateBanner.mutate({ id: banner.id, isActive: 1, sortOrder: index })),
        ...nextUnselected.map((banner, index) => adminClient!.admin.updateBanner.mutate({ id: banner.id, isActive: 0, sortOrder: nextSelected.length + index })),
      ]);
      setCheckedBannerIds([]);
      setPage(1);
      await refetch();
      toast.success(direction === "show" ? "선택한 배너를 노출 영역으로 이동했습니다." : "선택한 배너를 미노출 영역으로 이동했습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? `배너 이동 실패: ${error.message}` : "배너 이동에 실패했습니다.");
    } finally {
      setIsExposureMoving(false);
    }
  };

  const BannerTable = ({ rows, exposure }: { rows: BannerRow[]; exposure: "visible" | "hidden" }) => (
    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[820px]">
        <thead>
          <tr className="border-b bg-slate-50 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <th className="w-12 px-3 py-2.5 text-center font-medium"><input aria-label={`${exposure === "visible" ? "노출" : "미노출"} 배너 전체 선택`} type="checkbox" checked={isGroupChecked(rows)} onChange={event => toggleGroupChecked(rows, event.target.checked)} /></th>
            <th className="w-14 px-3 py-2.5 text-center font-medium whitespace-nowrap">순서</th>
            <th className="w-28 px-2 py-2.5 text-left font-medium">이미지</th>
            <th className="px-3 py-2.5 text-left font-medium">배너 제목</th>
            <th className="w-44 px-3 py-2.5 text-center font-medium">기간</th>
            <th className="w-20 px-3 py-2.5 text-center font-medium">노출 상태</th>
            <th className="w-10 px-2 py-2.5 text-center font-medium">보기</th>
            <th className="w-10 px-2 py-2.5 text-center font-medium">수정</th>
            <th className="w-10 px-2 py-2.5 text-center font-medium">삭제</th>
          </tr>
        </thead>
        <tbody>
          {!rows.length ? <tr><td colSpan={9} className="px-3 py-8 text-center text-sm text-muted-foreground">표시할 배너가 없습니다.</td></tr> : rows.map((banner, index) => (
            <tr key={banner.id} className="cursor-pointer border-b last:border-0 hover:bg-accent/30" onClick={() => openBannerForm(banner)}>
              <td className="px-3 py-3 text-center" onClick={event => event.stopPropagation()}><input aria-label={`${banner.title} 선택`} type="checkbox" checked={checkedBannerIds.includes(banner.id)} onChange={event => toggleBannerChecked(banner.id, event.target.checked)} /></td>
              <td className="px-3 py-3 text-center text-sm text-muted-foreground">{exposure === "visible" ? index + 1 : "-"}</td>
              <td className="px-2 py-3"><div className="h-14 w-24 overflow-hidden rounded bg-slate-100"><img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" /></div></td>
              <td className="px-3 py-3 text-sm font-medium">{banner.title}</td>
              <td className="px-3 py-3"><div className="rounded bg-slate-100 px-3 py-1.5 text-center dark:bg-slate-700"><p className="whitespace-nowrap font-mono text-xs leading-5 text-slate-600 dark:text-slate-300">{banner.startDate ? banner.startDate.replace("T", " ") : "-"}</p><p className="leading-4 text-slate-400">~</p><p className="whitespace-nowrap font-mono text-xs leading-5 text-slate-600 dark:text-slate-300">{banner.endDate ? banner.endDate.replace("T", " ") : "-"}</p></div></td>
              <td className="px-3 py-3 text-center"><StatusBadge active={exposure === "visible"} /></td>
              <td className="px-2 py-3 text-center" onClick={event => event.stopPropagation()}><Button variant="ghost" size="sm" onClick={() => setPreview(banner)}><Eye className="h-4 w-4" /></Button></td>
              <td className="px-2 py-3 text-center" onClick={event => event.stopPropagation()}><Button variant="ghost" size="sm" onClick={() => openBannerForm(banner)}><Pencil className="h-4 w-4" /></Button></td>
              <td className="px-2 py-3 text-center" onClick={event => event.stopPropagation()}><Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${banner.title}" 배너를 삭제하시겠습니까?`)) deleteM.mutate(banner.id); }}><Trash2 className="h-4 w-4" /></Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "배너 수정" : "배너 등록") : "Main Banner 관리"} desc="메인 화면 캐러셀 배너를 관리합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />배너 등록</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

      {!form ? (
        <>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setPage(1); }} placeholder="배너 제목 검색..." />
              <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-24 h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{[10, 20, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}개씩</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8"><RefreshCw className="h-3.5 w-3.5" /></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-4">
            <section className="overflow-hidden rounded-lg border border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
              <div className="flex flex-col gap-3 border-b border-blue-200 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900 dark:bg-slate-900/50">
                <div><h3 className="text-sm font-bold text-blue-900 dark:text-blue-200">선택된 노출 배너 <span className="ml-1 text-blue-600">{selectedBanners.length} / {visibleBannerLimit}</span></h3><p className="mt-0.5 text-xs text-muted-foreground">메인 화면에 노출되는 배너입니다. 최대 {visibleBannerLimit}개까지 선택할 수 있습니다.</p></div>
                <Button size="sm" variant="outline" className="border-blue-300 bg-white text-blue-700 hover:bg-blue-600 hover:text-white" disabled={isExposureMoving || !checkedBannerIds.some(id => selectedBanners.some(banner => banner.id === id))} onClick={() => moveCheckedBanners("hide")}><ChevronDown className="mr-1 h-4 w-4" />아래로 이동</Button>
              </div>
              <BannerTable rows={filteredSelected} exposure="visible" />
            </section>
            <section className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col gap-3 border-b bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-800">
                <div><h3 className="text-sm font-bold">미선택 배너</h3><p className="mt-0.5 text-xs text-muted-foreground">체크한 배너를 위로 이동하면 메인 화면 노출 배너로 변경됩니다.</p></div>
                <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600" disabled={isExposureMoving || !checkedBannerIds.some(id => unselectedBanners.some(banner => banner.id === id))} onClick={() => moveCheckedBanners("show")}><ChevronUp className="mr-1 h-4 w-4" />위로 이동</Button>
              </div>
              <BannerTable rows={pagedUnselected} exposure="hidden" />
              <div className="px-4 py-3"><Pagination page={page} total={filteredUnselected.length} pageSize={pageSize} onChange={setPage} /></div>
            </section>
          </CardContent>
        </Card>
        <Card className="hidden" aria-hidden="true">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setPage(1); }} placeholder="배너 제목 검색..." />
              <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-24 h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{[10, 20, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}개씩</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8"><RefreshCw className="h-3.5 w-3.5" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!paged.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 배너가 없습니다.</div> : (
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50 dark:bg-slate-800 text-xs text-muted-foreground">
                      <th className="px-3 py-2.5 text-center font-medium w-14 whitespace-nowrap">순서</th>
                      <th className="px-2 py-2.5 text-left font-medium w-28">이미지</th>
                      <th className="px-3 py-2.5 text-left font-medium">제목</th>
                      <th className="px-3 py-2.5 text-center font-medium w-44">노출일시</th>
                      <th className="px-3 py-2.5 text-center font-medium w-16">공개</th>
                      <th className="px-2 py-2.5 text-center font-medium w-10">보기</th>
                      <th className="px-2 py-2.5 text-center font-medium w-10">수정</th>
                      <th className="px-2 py-2.5 text-center font-medium w-10">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(b => (
                      <tr
                        key={b.id}
                        className="border-b last:border-0 hover:bg-accent/30 cursor-pointer"
                        onClick={() => setForm({ id: b.id, title: b.title, imageUrl: b.imageUrl, actionType: b.actionType, actionUrl: b.actionUrl ?? "", contentTitle: b.contentTitle ?? "", contentDate: b.contentDate ?? "", contentBody: b.contentBody ?? "", sortOrder: b.sortOrder, isActive: b.isActive, startDate: b.startDate ?? "", endDate: b.endDate ?? "" })}
                      >
                        {/* 번호 */}
                        <td className="px-3 py-3 w-14 text-sm text-muted-foreground text-center whitespace-nowrap">{b.sortOrder + 1}</td>
                        {/* 썸네일 */}
                        <td className="px-2 py-3 w-28">
                          <div className="w-24 h-14 rounded overflow-hidden bg-slate-100">
                            <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        {/* 제목 */}
                        <td className="px-3 py-3 font-medium text-sm">{b.title}</td>
                        {/* 기간 */}
                        <td className="px-3 py-3 w-44">
                          <div className="bg-slate-100 dark:bg-slate-700 rounded px-3 py-1.5 text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono tabular-nums leading-5 whitespace-nowrap">
                              {b.startDate ? b.startDate.replace("T", " ") : "-"}
                            </p>
                            <p className="text-xs text-slate-400 leading-4">~</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono tabular-nums leading-5 whitespace-nowrap">
                              {b.endDate ? b.endDate.replace("T", " ") : "-"}
                            </p>
                          </div>
                        </td>
                        {/* 활성 */}
                        <td className="px-3 py-3 w-16 whitespace-nowrap"><StatusBadge active={b.isActive} /></td>
                        {/* 보기 */}
                        <td className="px-2 py-3 w-10 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => setPreview(b)}><Eye className="h-4 w-4" /></Button>
                        </td>
                        {/* 수정 */}
                        <td className="px-2 py-3 w-10 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => setForm({ id: b.id, title: b.title, imageUrl: b.imageUrl, actionType: b.actionType, actionUrl: b.actionUrl ?? "", contentTitle: b.contentTitle ?? "", contentDate: b.contentDate ?? "", contentBody: b.contentBody ?? "", sortOrder: b.sortOrder, isActive: b.isActive, startDate: b.startDate ?? "", endDate: b.endDate ?? "" })}><Pencil className="h-4 w-4" /></Button>
                        </td>
                        {/* 삭제 */}
                        <td className="px-2 py-3 w-10 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${b.title}" 배너를 삭제하시겠습니까?`)) deleteM.mutate(b.id); }}><Trash2 className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3">
                  <Pagination page={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </>
      ) : (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-1"><label className="text-sm font-medium">배너 제목 *</label><Input value={form.title} onChange={e => setForm(f => f && ({ ...f, title: e.target.value }))} placeholder="배너 제목" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">노출 시작일시 (선택)</label><DateTimeInput value={form.startDate} onChange={v => setForm(f => f && ({ ...f, startDate: v }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">노출 종료일시 (선택)</label><DateTimeInput value={form.endDate} onChange={v => setForm(f => f && ({ ...f, endDate: v }))} /></div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">이미지 등록 *</label>
            <div className="flex gap-2"><Input value={form.imageUrl} onChange={e => setForm(f => f && ({ ...f, imageUrl: e.target.value }))} placeholder="/manus-storage/..." className="flex-1" /><Button type="button" variant="outline" onClick={handleFileSelect} disabled={uploading}>{uploading ? "업로드 중..." : "PC에서 찾아보기"}</Button></div>
            <p className="text-xs text-muted-foreground">권장: 1900×600px | 500KB 미만 | JPG, WebP, PNG</p>
            {form.imageUrl && <div className="rounded overflow-hidden border bg-slate-100" style={{ aspectRatio: "1900/600" }}><img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" /></div>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">클릭 시 동작</label>
            <div className="flex gap-4">
              {(["url", "content"] as const).map(t => <label key={t} className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={form.actionType === t} onChange={() => setForm(f => f && ({ ...f, actionType: t }))} /><span className="text-sm">{t === "url" ? "새창 띄우기" : "기존 페이지 전환"}</span></label>)}
            </div>
          </div>
          {form.actionType === "url" && <div className="space-y-1"><label className="text-sm font-medium">이동 URL</label><Input value={form.actionUrl} onChange={e => setForm(f => f && ({ ...f, actionUrl: e.target.value }))} placeholder="https://..." /></div>}
          {form.actionType === "content" && (
            <div className="space-y-1"><label className="text-sm font-medium">이동 URL</label><Input value={form.actionUrl} onChange={e => setForm(f => f && ({ ...f, actionUrl: e.target.value }))} placeholder="https://..." /></div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">순서</label><Input type="number" value={form.sortOrder + 1} onChange={e => setForm(f => f && ({ ...f, sortOrder: Math.max(0, parseInt(e.target.value) || 1) - 1 }))} min={1} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">활성 상태</label><div className="h-10 flex items-center"><ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} /></div></div>
          </div>
          <div className="flex gap-2 pt-2"><Button onClick={submit} disabled={createM.isPending || updateM.isPending}>{form.id ? "수정 저장" : "배너 등록"}</Button><Button variant="outline" onClick={() => setForm(null)}>취소</Button></div>
        </CardContent></Card>
      )}

      {/* 미리보기 다이얼로그 */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>배너 미리보기: {preview?.title}</DialogTitle></DialogHeader>
          {preview && <div className="rounded-lg overflow-hidden border"><img src={preview.imageUrl} alt={preview.title} className="w-full object-cover" style={{ aspectRatio: "1900/600" }} /></div>}
          <DialogFooter><Button variant="outline" onClick={() => setPreview(null)}>닫기</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── NEWS SECTION ─────────────────────────────────────────────────────────────
type NewsForm = { id?: number; title: string; category: string; summary: string; content: string; imageUrl: string; isActive: number; sortOrder: number; publishedAt: string };

function NewsSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<NewsForm | null>(null);

  const { data, refetch } = useQuery({ queryKey: ["admin-news", search, page], queryFn: () => adminClient!.news.list.query({ search, page, pageSize: 20 }), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.news.create.mutate(input), onSuccess: () => { toast.success("등록되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.news.update.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.news.delete.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const empty: NewsForm = { title: "", category: "Update", summary: "", content: "", imageUrl: "", isActive: 1, sortOrder: 0, publishedAt: new Date().toISOString().slice(0, 10) };
  const submit = () => {
    if (!form?.title) { toast.error("제목을 입력하세요."); return; }
    // publishedAt: DateTimeInput에서 YYYY-MM-DDTHH:mm 형식으로 저장됨 - 그대로 전달
    const p = { title: form.title, category: form.category, summary: form.summary || undefined, content: form.content || undefined, imageUrl: form.imageUrl || undefined, isActive: form.isActive, publishedAt: form.publishedAt || undefined };
    form.id ? updateM.mutate({ id: form.id, ...p }) : createM.mutate(p);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "뉴스 수정" : "뉴스 등록") : "News 관리"} desc="카드 뉴스 및 알림 콘텐츠를 관리합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />뉴스 등록</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

      {!form ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex gap-2"><SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setPage(1); }} placeholder="제목 또는 내용 검색..." /><Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8"><RefreshCw className="h-3.5 w-3.5" /></Button></div>
          </CardHeader>
          <CardContent className="p-0">
            {!data?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 뉴스가 없습니다.</div> : (
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50 dark:bg-slate-800 text-xs text-muted-foreground">
                      <th className="px-3 py-2.5 text-center font-medium w-14 whitespace-nowrap">순서</th>
                      <th className="px-2 py-2.5 text-left font-medium w-28">이미지</th>
                      <th className="px-3 py-2.5 text-left font-medium">제목</th>
                      <th className="px-3 py-2.5 text-center font-medium w-40">등록일시</th>
                      <th className="px-2 py-2.5 text-center font-medium w-16">메인</th>
                      <th className="px-3 py-2.5 text-center font-medium w-16">공개</th>
                      <th className="px-2 py-2.5 text-center font-medium w-16">수정</th>
                      <th className="px-2 py-2.5 text-center font-medium w-12">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item: any, idx: number) => (
                      <tr
                        key={item.id}
                        className="border-b last:border-0 hover:bg-accent/30 cursor-pointer"
                        onClick={() => setForm({ id: item.id, title: item.title, category: item.category, summary: item.summary ?? "", content: item.content ?? "", imageUrl: item.imageUrl ?? "", isActive: item.isActive, sortOrder: item.sortOrder ?? 0, publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : "" })}
                      >
                        {/* 번호 */}
                        <td className="px-3 py-3 w-14 text-sm text-muted-foreground text-center whitespace-nowrap">{(item.sortOrder ?? 0) + 1}</td>
                        {/* 썸네일 */}
                        <td className="px-2 py-3 w-28">
                          {item.imageUrl
                            ? <div className="w-24 h-14 rounded overflow-hidden bg-slate-100"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /></div>
                            : <div className="w-24 h-14 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">없음</div>}
                        </td>
                        {/* 제목 */}
                        <td className="px-3 py-3 font-medium text-sm">{item.title}</td>
                        {/* 등록일시 */}
                        <td className="px-3 py-3 w-40 whitespace-nowrap">
                          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 rounded px-2 py-1 font-mono">
                            {item.publishedAt ? new Date(item.publishedAt).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }) : "-"}
                          </span>
                        </td>
                        <td className="px-2 py-3 w-16 text-center whitespace-nowrap">
                          {data.mainNewsIds?.includes(item.id) ? <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">활성</span> : <span className="text-xs text-slate-400">-</span>}
                        </td>
                        {/* 활성 */}
                        <td className="px-3 py-3 w-16 whitespace-nowrap"><StatusBadge active={item.isActive} /></td>

                        {/* 수정 */}
                        <td className="px-2 py-3 w-16 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" onClick={() => setForm({ id: item.id, title: item.title, category: item.category, summary: item.summary ?? "", content: item.content ?? "", imageUrl: item.imageUrl ?? "", isActive: item.isActive, sortOrder: item.sortOrder ?? 0, publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : "" })}><Pencil className="h-4 w-4" /></Button>
                        </td>
                        {/* 삭제 */}
                        <td className="px-2 py-3 w-12 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${item.title}" 뉴스를 삭제하시겠습니까?`)) deleteM.mutate(item.id); }}><Trash2 className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3">
                  <Pagination page={page} total={data.total} pageSize={20} onChange={setPage} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card><CardContent className="pt-6 space-y-5">
          {/* ① 뉴스 제목 */}
          <div className="space-y-1">
            <label className="text-sm font-medium">뉴스 제목</label>
            <Input value={form.title} onChange={e => setForm(f => f && ({ ...f, title: e.target.value }))} placeholder="뉴스 제목" />
          </div>
          {/* ② 이미지 등록 */}
          <div className="space-y-1">
            <label className="text-sm font-medium">이미지 등록 *</label>
            <div className="flex gap-2">
              <Input value={form.imageUrl} onChange={e => setForm(f => f && ({ ...f, imageUrl: e.target.value }))} placeholder="/manus-storage/..." className="flex-1" />
              <Button type="button" variant="outline" onClick={async () => {
                const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/jpeg,image/webp,image/png';
                input.onchange = async (ev) => {
                  const file = (ev.target as HTMLInputElement).files?.[0]; if (!file) return;
                  if (file.size > 100 * 1024) { toast.error('100KB 이하 이미지를 선택해주세요.'); return; }
                  try {
                    const reader = new FileReader();
                    const base64 = await new Promise<string>(r => { reader.onload = ev => r(ev.target?.result as string); reader.readAsDataURL(file); });
                    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
                    const safeFilename = `news-img-${Date.now()}.${ext}`;
                    const result = await adminClient!.admin.uploadBannerImage.mutate({ base64, filename: safeFilename });
                    setForm(f => f && ({ ...f, imageUrl: result.url }));
                    toast.success('이미지 업로드 완료');
                  } catch (e: any) { toast.error(`업로드 실패: ${e.message}`); }
                };
                input.click();
              }}>PC에서 찾아보기</Button>
            </div>
            <p className="text-xs text-muted-foreground">권장 : 700 x 360px  |  100KB 미만  |  Jpg,webp,png</p>
            {form.imageUrl && (
              <img src={form.imageUrl} alt="preview" className="mt-2 rounded border h-24 object-cover" />
            )}
          </div>
          {/* ③ 등록일시 + ④ 날짜 */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium shrink-0">등록일시</label>
            <DateTimeInput value={form.publishedAt} onChange={v => setForm(f => f && ({ ...f, publishedAt: v }))} />
          </div>
          {/* ⑤ 내용 (웹에디터 영역 확보) */}
          <div className="space-y-1">
            <label className="text-sm font-medium">내용</label>
            <div className="border rounded-md bg-slate-50 dark:bg-slate-900" style={{ minHeight: 240 }}>
              {/* 웹에디터 툴바 영역 */}
              <div className="border-b bg-slate-100 dark:bg-slate-800 px-3 py-2 flex flex-wrap gap-1">
                {["B", "I", "U", "S", "A•", "A•", "≡", "≡", "≡", "≡"].map((t, i) => (
                  <button key={i} type="button" className="px-2 py-0.5 text-xs border rounded bg-white dark:bg-slate-700 hover:bg-slate-200 font-mono">{t}</button>
                ))}
                <span className="text-slate-300 mx-1">|</span>
                {["스타일", "본문", "글꼴", "크기"].map((t, i) => (
                  <button key={i} type="button" className="px-2 py-0.5 text-xs border rounded bg-white dark:bg-slate-700 hover:bg-slate-200">{t} ▾</button>
                ))}
              </div>
              {/* 에디터 본문 영역 */}
              <textarea
                className="w-full bg-transparent p-3 text-sm resize-none focus:outline-none"
                style={{ minHeight: 180 }}
                value={form.content}
                onChange={e => setForm(f => f && ({ ...f, content: e.target.value }))}
                placeholder="등록 후 웹에디터가 연결됩니다."
              />
            </div>
          </div>
          {/* ⑥ 순서 자동 부여 + 활성 상태 */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-md border border-dashed bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <p className="font-medium text-slate-700">순서</p>
              <p className="mt-1 text-xs">신규 등록 시 등록일시 기준으로 자동 부여됩니다.</p>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">활성 상태</label>
              <div className="flex items-center h-10">
                <ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} />
              </div>
            </div>
          </div>
          {/* ⑦ 확인/취소 */}
          <div className="flex gap-2 pt-1">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6" onClick={submit} disabled={createM.isPending || updateM.isPending}>확인</Button>
            <Button variant="outline" className="px-6" onClick={() => setForm(null)}>취소</Button>
          </div>
        </CardContent></Card>
      )}
    </div>
  );
}

// ─── MEDIA SECTION ────────────────────────────────────────────────────────────
type MediaForm = { id?: number; title: string; youtubeUrl: string; description: string; sortOrder: number; isActive: number };

function MediaSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [form, setForm] = useState<MediaForm | null>(null);
  const { data, refetch } = useQuery({ queryKey: ["admin-media"], queryFn: () => adminClient!.mediaAdmin.list.query(), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.mediaAdmin.create.mutate(input), onSuccess: () => { toast.success("등록되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.mediaAdmin.update.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.mediaAdmin.delete.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const getYtId = (url: string) => { const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?/\s]+)/); return m ? m[1] : null; };
  const empty: MediaForm = { title: "", youtubeUrl: "", description: "", sortOrder: data?.length ?? 0, isActive: 1 };
  const submit = () => {
    if (!form?.title || !form?.youtubeUrl) { toast.error("제목과 YouTube URL을 입력하세요."); return; }
    form.id ? updateM.mutate(form) : createM.mutate(form);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? "동영상 수정" : "Media 관리"} desc="YouTube 영상 링크를 수정합니다."
        action={form ? <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button> : undefined} />

      {!form ? (
        <Card><CardContent className="pt-4">
          {!data?.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 동영상이 없습니다.</div> : (
            <div className="space-y-3">
              {data.map((item: any) => {
                const ytId = getYtId(item.youtubeUrl);
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 cursor-pointer" onClick={() => setForm({ id: item.id, title: item.title, youtubeUrl: item.youtubeUrl, description: item.description ?? "", sortOrder: item.sortOrder, isActive: item.isActive })}>
                    {ytId && <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={item.title} className="w-24 h-14 object-cover rounded shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.youtubeUrl}</p>
                      <StatusBadge active={item.isActive} />
                    </div>
                    <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setForm({ id: item.id, title: item.title, youtubeUrl: item.youtubeUrl, description: item.description ?? "", sortOrder: item.sortOrder, isActive: item.isActive })}><Pencil className="h-4 w-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent></Card>
      ) : (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-1"><label className="text-sm font-medium">제목 *</label><Input value={form.title} onChange={e => setForm(f => f && ({ ...f, title: e.target.value }))} placeholder="동영상 제목" /></div>
          <div className="space-y-1"><label className="text-sm font-medium">YouTube URL *</label><Input value={form.youtubeUrl} onChange={e => setForm(f => f && ({ ...f, youtubeUrl: e.target.value }))} placeholder="https://youtu.be/..." /></div>
          {form.youtubeUrl && getYtId(form.youtubeUrl) && <div className="rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}><iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYtId(form.youtubeUrl)}`} title="preview" frameBorder="0" allowFullScreen /></div>}
          <div className="space-y-1"><label className="text-sm font-medium">설명</label><Input value={form.description} onChange={e => setForm(f => f && ({ ...f, description: e.target.value }))} placeholder="설명 (선택)" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">순서</label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => f && ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">활성 상태</label><div className="h-10 flex items-center"><ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} /></div></div>
          </div>
          <div className="flex gap-2 pt-2"><Button onClick={submit} disabled={createM.isPending || updateM.isPending}>{form.id ? "수정 저장" : "동영상 등록"}</Button><Button variant="outline" onClick={() => setForm(null)}>취소</Button></div>
        </CardContent></Card>
      )}
    </div>
  );
}

// ─── PRODUCTS SECTION ─────────────────────────────────────────────────────────
type ProductForm = { id?: number; name: string; description: string; price: string; currency: string; pointAmount: number; imageUrl: string; isActive: number; sortOrder: number };

function ProductsSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ProductForm | null>(null);
  const [grantForm, setGrantForm] = useState<{ productId: number; userId: string; reason: string } | null>(null);

  const { data, refetch } = useQuery({ queryKey: ["admin-products", search, page], queryFn: () => adminClient!.products.list.query({ search, page, pageSize: 20 }), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.products.create.mutate(input), onSuccess: () => { toast.success("등록되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.products.update.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.products.delete.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const grantM = useMutation({ mutationFn: (input: any) => adminClient!.productGrant.grant.mutate(input), onSuccess: (r: any) => { toast.success(`${r.pointAmount} 포인트가 지급되었습니다.`); setGrantForm(null); }, onError: (e: Error) => toast.error(e.message) });

  const empty: ProductForm = { name: "", description: "", price: "0.00", currency: "USD", pointAmount: 0, imageUrl: "", isActive: 1, sortOrder: 0 };
  const submit = () => {
    if (!form?.name || !form?.price) { toast.error("상품명과 가격을 입력하세요."); return; }
    form.id ? updateM.mutate(form) : createM.mutate(form);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "상품 수정" : "상품 등록") : "인앱상품 관리"} desc="판매 중인 인앱 상품을 관리합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />상품 등록</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

      {!form ? (
        <Card>
          <CardHeader className="pb-3"><div className="flex gap-2"><SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setPage(1); }} placeholder="상품명 검색..." /><Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8"><RefreshCw className="h-3.5 w-3.5" /></Button></div></CardHeader>
          <CardContent>
            {!data?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 상품이 없습니다.</div> : (
              <div className="space-y-2">
                {data.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 cursor-pointer" onClick={() => setForm({ id: item.id, name: item.name, description: item.description ?? "", price: String(item.price), currency: item.currency, pointAmount: item.pointAmount, imageUrl: item.imageUrl ?? "", isActive: item.isActive, sortOrder: item.sortOrder })}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{item.price} {item.currency}</span>
                        <span className="text-xs text-blue-600">{item.pointAmount.toLocaleString()} pts</span>
                        <StatusBadge active={item.isActive} />
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="text-green-600 text-xs h-7" onClick={() => setGrantForm({ productId: item.id, userId: "", reason: "" })}>지급</Button>
                      <Button variant="ghost" size="sm" onClick={() => setForm({ id: item.id, name: item.name, description: item.description ?? "", price: String(item.price), currency: item.currency, pointAmount: item.pointAmount, imageUrl: item.imageUrl ?? "", isActive: item.isActive, sortOrder: item.sortOrder })}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${item.name}" 상품을 삭제하시겠습니까?`)) deleteM.mutate(item.id); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                <Pagination page={page} total={data.total} pageSize={20} onChange={setPage} />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">상품명 *</label><Input value={form.name} onChange={e => setForm(f => f && ({ ...f, name: e.target.value }))} placeholder="상품명" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">가격 *</label><Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => f && ({ ...f, price: e.target.value }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">통화</label><Input value={form.currency} onChange={e => setForm(f => f && ({ ...f, currency: e.target.value }))} placeholder="USD" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">지급 포인트</label><Input type="number" value={form.pointAmount} onChange={e => setForm(f => f && ({ ...f, pointAmount: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">순서</label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => f && ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">설명</label><Input value={form.description} onChange={e => setForm(f => f && ({ ...f, description: e.target.value }))} /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">이미지 URL</label><Input value={form.imageUrl} onChange={e => setForm(f => f && ({ ...f, imageUrl: e.target.value }))} placeholder="/manus-storage/..." /></div>
            <div className="space-y-1"><label className="text-sm font-medium">활성 상태</label><div className="h-10 flex items-center"><ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} /></div></div>
          </div>
          <div className="flex gap-2 pt-2"><Button onClick={submit} disabled={createM.isPending || updateM.isPending}>{form.id ? "수정 저장" : "상품 등록"}</Button><Button variant="outline" onClick={() => setForm(null)}>취소</Button></div>
        </CardContent></Card>
      )}

      {/* 상품 지급 모달 */}
      <Dialog open={!!grantForm} onOpenChange={() => setGrantForm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>상품 지급</DialogTitle><DialogDescription>회원에게 상품을 지급합니다.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1"><label className="text-sm font-medium">회원 ID *</label><Input type="number" value={grantForm?.userId ?? ""} onChange={e => setGrantForm(f => f && ({ ...f, userId: e.target.value }))} placeholder="회원 ID" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">사유</label><Input value={grantForm?.reason ?? ""} onChange={e => setGrantForm(f => f && ({ ...f, reason: e.target.value }))} placeholder="지급 사유" /></div>
          </div>
          <DialogFooter>
            <Button onClick={() => { if (!grantForm?.userId) { toast.error("회원 ID를 입력하세요."); return; } grantM.mutate({ productId: grantForm.productId, userId: parseInt(grantForm.userId), reason: grantForm.reason || undefined }); }} disabled={grantM.isPending}>지급</Button>
            <Button variant="ghost" onClick={() => setGrantForm(null)}>취소</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── PAYMENTS SECTION ─────────────────────────────────────────────────────────
function PaymentsSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [tab, setTab] = useState<"payments" | "points">("payments");
  const [page, setPage] = useState(1);
  const [grantForm, setGrantForm] = useState<{ userId: string; type: "paid" | "free"; amount: string; reason: string } | null>(null);

  const { data: paymentsData, refetch: refetchP } = useQuery({ queryKey: ["admin-payments", page], queryFn: () => adminClient!.payments.list.query({ page, pageSize: 20 }), enabled: !!adminClient && tab === "payments" });
  const { data: pointsData, refetch: refetchPt } = useQuery({ queryKey: ["admin-points", page], queryFn: () => adminClient!.payments.pointList.query({ page, pageSize: 20 }), enabled: !!adminClient && tab === "points" });
  const refundM = useMutation({ mutationFn: (input: any) => adminClient!.payments.refund.mutate(input), onSuccess: () => { toast.success("환불 처리되었습니다."); refetchP(); }, onError: (e: Error) => toast.error(e.message) });
  const grantM = useMutation({ mutationFn: (input: any) => adminClient!.payments.grantPoint.mutate(input), onSuccess: () => { toast.success("처리되었습니다."); setGrantForm(null); refetchPt(); }, onError: (e: Error) => toast.error(e.message) });

  return (
    <div className="space-y-6">
      <SectionHeader title="결제 관리" desc="결제 내역 및 포인트를 관리합니다."
        action={tab === "points" ? <Button onClick={() => setGrantForm({ userId: "", type: "free", amount: "", reason: "" })}><Plus className="h-4 w-4 mr-2" />포인트 지급/회수</Button> : undefined} />

      <div className="flex gap-2 border-b">
        {(["payments", "points"] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t === "payments" ? "결제 내역" : "포인트 내역"}
          </button>
        ))}
      </div>

      {tab === "payments" && (
        <Card><CardContent className="pt-4">
          {!paymentsData?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">결제 내역이 없습니다.</div> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-muted-foreground text-xs"><th className="text-left p-2">ID</th><th className="text-left p-2">회원</th><th className="text-left p-2">금액</th><th className="text-left p-2">상태</th><th className="text-left p-2">일시</th><th className="text-left p-2">처리</th></tr></thead>
                  <tbody>
                    {paymentsData.items.map(({ payment, user }: any) => (
                      <tr key={payment.id} className="border-b hover:bg-accent/20">
                        <td className="p-2">{payment.id}</td>
                        <td className="p-2">{user?.name ?? user?.openId ?? "-"}</td>
                        <td className="p-2">{payment.amount} {payment.currency}</td>
                        <td className="p-2"><span className={`px-1.5 py-0.5 rounded-full text-xs ${payment.status === "completed" ? "bg-green-100 text-green-700" : payment.status === "refunded" ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"}`}>{payment.status}</span></td>
                        <td className="p-2 text-xs text-muted-foreground">{fmt(payment.createdAt)}</td>
                        <td className="p-2">{payment.status === "completed" && <Button variant="ghost" size="sm" className="text-orange-500 h-7 text-xs" onClick={() => { if (confirm("환불 처리하시겠습니까?")) refundM.mutate({ id: payment.id }); }}>환불</Button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} total={paymentsData.total} pageSize={20} onChange={setPage} />
            </>
          )}
        </CardContent></Card>
      )}

      {tab === "points" && (
        <Card><CardContent className="pt-4">
          {!pointsData?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">포인트 내역이 없습니다.</div> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-muted-foreground text-xs"><th className="text-left p-2">ID</th><th className="text-left p-2">회원 ID</th><th className="text-left p-2">유형</th><th className="text-left p-2">수량</th><th className="text-left p-2">사유</th><th className="text-left p-2">일시</th></tr></thead>
                  <tbody>
                    {pointsData.items.map((item: any) => (
                      <tr key={item.id} className="border-b hover:bg-accent/20">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.userId}</td>
                        <td className="p-2"><span className={`px-1.5 py-0.5 rounded-full text-xs ${item.type === "paid" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{item.type}</span></td>
                        <td className="p-2 font-mono">{item.amount > 0 ? `+${item.amount}` : item.amount}</td>
                        <td className="p-2 text-muted-foreground">{item.reason ?? "-"}</td>
                        <td className="p-2 text-xs text-muted-foreground">{fmt(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} total={pointsData.total} pageSize={20} onChange={setPage} />
            </>
          )}
        </CardContent></Card>
      )}

      {/* 포인트 지급/회수 모달 */}
      <Dialog open={!!grantForm} onOpenChange={() => setGrantForm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>포인트 지급/회수</DialogTitle><DialogDescription>음수 입력 시 회수됩니다.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1"><label className="text-sm font-medium">회원 ID *</label><Input type="number" value={grantForm?.userId ?? ""} onChange={e => setGrantForm(f => f && ({ ...f, userId: e.target.value }))} placeholder="회원 ID" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">포인트 유형</label>
              <Select value={grantForm?.type ?? "free"} onValueChange={v => setGrantForm(f => f && ({ ...f, type: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="free">무료 포인트</SelectItem><SelectItem value="paid">유료 포인트</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">수량 (음수=회수) *</label><Input type="number" value={grantForm?.amount ?? ""} onChange={e => setGrantForm(f => f && ({ ...f, amount: e.target.value }))} placeholder="100 또는 -100" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">사유</label><Input value={grantForm?.reason ?? ""} onChange={e => setGrantForm(f => f && ({ ...f, reason: e.target.value }))} placeholder="지급/회수 사유" /></div>
          </div>
          <DialogFooter>
            <Button onClick={() => { if (!grantForm?.userId || !grantForm?.amount) { toast.error("회원 ID와 수량을 입력하세요."); return; } grantM.mutate({ userId: parseInt(grantForm.userId), type: grantForm.type, amount: parseInt(grantForm.amount), reason: grantForm.reason || undefined }); }} disabled={grantM.isPending}>처리</Button>
            <Button variant="ghost" onClick={() => setGrantForm(null)}>취소</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── SHOP SECTION ─────────────────────────────────────────────────────────────
function fmtRuc(n: number): string { return Math.min(n, 9999999).toLocaleString("en-US"); }

type ShopProductForm = { id?: number; name: string; priceUsd: string; ruCashAmount: number; bonusCashAmount: number; imageUrl: string; isActive: number; sortOrder: number };

function ShopSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [tab, setTab] = useState<"products" | "charge" | "use" | "balances">("products");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ShopProductForm | null>(null);
  const [adjustForm, setAdjustForm] = useState<{ userId: string; ruCashDelta: string; bonusCashDelta: string; reason: string } | null>(null);
  const [balanceSearch, setBalanceSearch] = useState(""); const [balanceSearchInput, setBalanceSearchInput] = useState("");

  const { data: productsData, refetch: refetchProducts } = useQuery({ queryKey: ["admin-shop-products", page], queryFn: () => adminClient!.shop.adminListProducts.query({ page, pageSize: 50 }), enabled: !!adminClient && tab === "products" });
  const { data: chargeData, refetch: refetchCharge } = useQuery({ queryKey: ["admin-shop-charge", page], queryFn: () => adminClient!.shop.adminChargeHistory.query({ page, pageSize: 20 }), enabled: !!adminClient && tab === "charge" });
  const { data: useData, refetch: refetchUse } = useQuery({ queryKey: ["admin-shop-use", page], queryFn: () => adminClient!.shop.adminUseHistory.query({ page, pageSize: 20 }), enabled: !!adminClient && tab === "use" });
  const { data: balancesData, refetch: refetchBalances } = useQuery({ queryKey: ["admin-shop-balances", page, balanceSearch], queryFn: () => adminClient!.shop.adminBalances.query({ page, pageSize: 20, search: balanceSearch || undefined }), enabled: !!adminClient && tab === "balances" });

  const createProductM = useMutation({ mutationFn: (input: any) => adminClient!.shop.adminCreateProduct.mutate(input), onSuccess: () => { toast.success("등록되었습니다."); setForm(null); refetchProducts(); }, onError: (e: Error) => toast.error(e.message) });
  const updateProductM = useMutation({ mutationFn: (input: any) => adminClient!.shop.adminUpdateProduct.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetchProducts(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteProductM = useMutation({ mutationFn: (id: number) => adminClient!.shop.adminDeleteProduct.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetchProducts(); }, onError: (e: Error) => toast.error(e.message) });
  const adjustM = useMutation({ mutationFn: (input: any) => adminClient!.shop.adminAdjustBalance.mutate(input), onSuccess: () => { toast.success("잔액이 조정되었습니다."); setAdjustForm(null); refetchBalances(); }, onError: (e: Error) => toast.error(e.message) });

  const emptyProduct: ShopProductForm = { name: "", priceUsd: "0.00", ruCashAmount: 0, bonusCashAmount: 0, imageUrl: "", isActive: 1, sortOrder: 0 };

  const handleExcelCharge = () => {
    const items = (chargeData?.items ?? []) as any[];
    if (!items.length) { toast.error("내역이 없습니다."); return; }
    const headers = ["회원", "게임코드", "TIME", "충전전 rCoin", "충전전 Bonus rCoin", "PG", "Price(USD)", "충전량 rCoin", "충전량 Bonus rCoin", "충전후 rCoin", "충전후 Bonus rCoin"];
    const rows = items.map((r: any) => [r.user?.name ?? r.user?.openId ?? "-", r.tx.gameCode, new Date(r.tx.createdAt).toLocaleString("ko-KR"), r.tx.beforeRuCash, r.tx.beforeBonusCash, r.tx.pgName ?? "-", r.tx.priceUsd ?? "-", r.tx.ruCashDelta, r.tx.bonusCashDelta, r.tx.afterRuCash, r.tx.afterBonusCash]);
    const csv = [headers, ...rows].map(r => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "charge_history.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const handleExcelUse = () => {
    const items = (useData?.items ?? []) as any[];
    if (!items.length) { toast.error("내역이 없습니다."); return; }
    const headers = ["회원", "게임코드", "TIME", "사용전 rCoin", "사용전 Bonus rCoin", "Item Name", "QTY", "Item Price", "Total Price", "잔량 rCoin", "잔량 Bonus rCoin"];
    const rows = items.map((r: any) => [r.user?.name ?? r.user?.openId ?? "-", r.tx.gameCode, new Date(r.tx.createdAt).toLocaleString("ko-KR"), r.tx.beforeRuCash, r.tx.beforeBonusCash, r.tx.itemName ?? "-", r.tx.itemQty ?? 1, r.tx.itemPriceRuc ?? 0, r.tx.totalPriceRuc ?? 0, r.tx.afterRuCash, r.tx.afterBonusCash]);
    const csv = [headers, ...rows].map(r => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "use_history.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const tabs = [
    { key: "products" as const, label: "상품 관리" },
    { key: "charge" as const, label: "충전 내역" },
    { key: "use" as const, label: "사용 내역" },
    { key: "balances" as const, label: "잔액 조회" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "상품 수정" : "상품 등록") : "Shop (rCoin) 관리"} desc="rCoin 충전 상품, 충전/사용 내역, 잔액을 관리합니다."
        action={!form ? (
          <div className="flex gap-2">
            {tab === "products" && <Button onClick={() => setForm(emptyProduct)}><Plus className="h-4 w-4 mr-1" />상품 등록</Button>}
            {tab === "charge" && <Button className="bg-green-600 hover:bg-green-700 text-white h-9 text-sm" onClick={handleExcelCharge}>Excel 저장</Button>}
            {tab === "use" && <Button className="bg-green-600 hover:bg-green-700 text-white h-9 text-sm" onClick={handleExcelUse}>Excel 저장</Button>}
            <Button variant="outline" size="sm" onClick={() => { if (tab === "products") refetchProducts(); else if (tab === "charge") refetchCharge(); else if (tab === "use") refetchUse(); else refetchBalances(); }}><RefreshCw className="h-4 w-4" /></Button>
          </div>
        ) : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>}
      />

      {!form ? (
        <>
          {/* 탭 */}
          <div className="flex gap-2 border-b">
            {tabs.map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* 상품 관리 */}
          {tab === "products" && (
            <Card><CardContent className="pt-4">
              {!productsData?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 상품이 없습니다.</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-xs text-muted-foreground">
                      <th className="text-left p-2">순서</th><th className="text-left p-2">상품명</th><th className="text-right p-2">USD</th><th className="text-right p-2">rCoin</th><th className="text-right p-2">Bonus rCoin</th><th className="text-left p-2">상태</th><th className="text-left p-2">수정</th><th className="text-left p-2">삭제</th>
                    </tr></thead>
                    <tbody>
                      {(productsData.items as any[]).map((p: any) => (
                        <tr key={p.id} className="border-b hover:bg-accent/20 cursor-pointer" onClick={() => setForm({ id: p.id, name: p.name, priceUsd: String(p.priceUsd), ruCashAmount: p.ruCashAmount, bonusCashAmount: p.bonusCashAmount, imageUrl: p.imageUrl ?? "", isActive: p.isActive, sortOrder: p.sortOrder })}>
                          <td className="p-2 text-xs text-muted-foreground">{p.sortOrder}</td>
                          <td className="p-2 font-medium">{p.name}</td>
                          <td className="p-2 text-right">{Number(p.priceUsd).toFixed(2)}</td>
                          <td className="p-2 text-right font-mono text-[#9b2020]">{fmtRuc(p.ruCashAmount)}</td>
                          <td className="p-2 text-right font-mono text-green-700">{fmtRuc(p.bonusCashAmount)}</td>
                          <td className="p-2"><StatusBadge active={p.isActive} /></td>
                          <td className="p-2" onClick={e => e.stopPropagation()}><Button variant="ghost" size="sm" className="h-7" onClick={() => setForm({ id: p.id, name: p.name, priceUsd: String(p.priceUsd), ruCashAmount: p.ruCashAmount, bonusCashAmount: p.bonusCashAmount, imageUrl: p.imageUrl ?? "", isActive: p.isActive, sortOrder: p.sortOrder })}><Pencil className="h-3.5 w-3.5" /></Button></td>
                          <td className="p-2" onClick={e => e.stopPropagation()}><Button variant="ghost" size="sm" className="h-7 text-red-500" onClick={() => { if (confirm(`"${p.name}" 상품을 삭제하시겠습니까?`)) deleteProductM.mutate(p.id); }}><Trash2 className="h-3.5 w-3.5" /></Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent></Card>
          )}

          {/* 충전 내역 */}
          {tab === "charge" && (
            <Card><CardContent className="pt-4">
              {!chargeData?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">충전 내역이 없습니다.</div> : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-muted-foreground">
                        {["회원", "게임코드", "TIME", "충전전 rCoin", "충전전 Bonus rCoin", "PG", "Price(USD)", "충전량 rCoin", "충전량 Bonus rCoin", "충전후 rCoin", "충전후 Bonus rCoin"].map(h => <th key={h} className="text-left p-2 whitespace-nowrap">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {(chargeData.items as any[]).map((r: any) => (
                          <tr key={r.tx.id} className="border-b hover:bg-accent/20">
                            <td className="p-2">{r.user?.name ?? r.user?.openId ?? "-"}</td>
                            <td className="p-2">{r.tx.gameCode}</td>
                            <td className="p-2 whitespace-nowrap">{fmt(r.tx.createdAt)}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.beforeRuCash)}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.beforeBonusCash)}</td>
                            <td className="p-2">{r.tx.pgName ?? "-"}</td>
                            <td className="p-2 text-right">{r.tx.priceUsd ? Number(r.tx.priceUsd).toFixed(2) : "-"}</td>
                            <td className="p-2 text-right text-[#9b2020] font-semibold">+{fmtRuc(r.tx.ruCashDelta)}</td>
                            <td className="p-2 text-right text-green-700 font-semibold">+{fmtRuc(r.tx.bonusCashDelta)}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.afterRuCash)}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.afterBonusCash)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={page} total={chargeData.total} pageSize={20} onChange={setPage} />
                </>
              )}
            </CardContent></Card>
          )}

          {/* 사용 내역 */}
          {tab === "use" && (
            <Card><CardContent className="pt-4">
              {!useData?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">사용 내역이 없습니다.</div> : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-muted-foreground">
                        {["회원", "게임코드", "TIME", "사용전 rCoin", "사용전 Bonus rCoin", "Item Name", "QTY", "Item Price", "Total Price", "잔량 rCoin", "잔량 Bonus rCoin"].map(h => <th key={h} className="text-left p-2 whitespace-nowrap">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {(useData.items as any[]).map((r: any) => (
                          <tr key={r.tx.id} className="border-b hover:bg-accent/20">
                            <td className="p-2">{r.user?.name ?? r.user?.openId ?? "-"}</td>
                            <td className="p-2">{r.tx.gameCode}</td>
                            <td className="p-2 whitespace-nowrap">{fmt(r.tx.createdAt)}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.beforeRuCash)}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.beforeBonusCash)}</td>
                            <td className="p-2">{r.tx.itemName ?? "-"}</td>
                            <td className="p-2 text-right">{r.tx.itemQty ?? 1}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.itemPriceRuc ?? 0)}</td>
                            <td className="p-2 text-right text-[#9b2020] font-semibold">{fmtRuc(r.tx.totalPriceRuc ?? 0)}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.afterRuCash)}</td>
                            <td className="p-2 text-right">{fmtRuc(r.tx.afterBonusCash)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={page} total={useData.total} pageSize={20} onChange={setPage} />
                </>
              )}
            </CardContent></Card>
          )}

          {/* 잔액 조회 */}
          {tab === "balances" && (
            <Card><CardContent className="pt-4">
              <div className="flex gap-2 mb-4">
                <Input placeholder="닉네임 / Open ID 검색..." value={balanceSearchInput} onChange={e => setBalanceSearchInput(e.target.value)} className="max-w-xs h-8 text-sm" onKeyDown={e => { if (e.key === "Enter") { setBalanceSearch(balanceSearchInput); setPage(1); } }} />
                <Button size="sm" className="h-8" onClick={() => { setBalanceSearch(balanceSearchInput); setPage(1); }}><Search className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" className="h-8 text-blue-600" onClick={() => setAdjustForm({ userId: "", ruCashDelta: "", bonusCashDelta: "", reason: "" })}>잔액 조정</Button>
              </div>
              {!balancesData?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">잔액 데이터가 없습니다.</div> : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-xs text-muted-foreground">
                        <th className="text-left p-2">User ID</th><th className="text-left p-2">Nickname</th><th className="text-right p-2">rCoin</th><th className="text-right p-2">Bonus rCoin</th><th className="text-left p-2">최종 갱신</th>
                      </tr></thead>
                      <tbody>
                        {(balancesData.items as any[]).map((r: any) => (
                          <tr key={r.balance.id} className="border-b hover:bg-accent/20">
                            <td className="p-2 text-xs text-muted-foreground font-mono">{r.user?.id ?? "-"}</td>
                            <td className="p-2 font-medium">{r.user?.name ?? r.user?.openId ?? "-"}</td>
                            <td className="p-2 text-right font-mono text-[#9b2020] font-semibold">{fmtRuc(r.balance.ruCash)}</td>
                            <td className="p-2 text-right font-mono text-green-700 font-semibold">{fmtRuc(r.balance.bonusCash)}</td>
                            <td className="p-2 text-xs text-muted-foreground">{fmt(r.balance.updatedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={page} total={balancesData.total} pageSize={20} onChange={setPage} />
                </>
              )}
            </CardContent></Card>
          )}
        </>
      ) : (
        /* 상품 등록/수정 폼 */
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">상품명 *</label><Input value={form.name} onChange={e => setForm(f => f && ({ ...f, name: e.target.value }))} placeholder="예: USD 10" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">USD 가격 *</label><Input type="number" step="0.01" value={form.priceUsd} onChange={e => setForm(f => f && ({ ...f, priceUsd: e.target.value }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">순서</label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => f && ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">rCoin 지급량 *</label><Input type="number" value={form.ruCashAmount} onChange={e => setForm(f => f && ({ ...f, ruCashAmount: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Bonus rCoin 지급량</label><Input type="number" value={form.bonusCashAmount} onChange={e => setForm(f => f && ({ ...f, bonusCashAmount: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">이미지 URL</label><Input value={form.imageUrl} onChange={e => setForm(f => f && ({ ...f, imageUrl: e.target.value }))} placeholder="/manus-storage/..." /></div>
            <div className="space-y-1"><label className="text-sm font-medium">활성 상태</label><div className="h-10 flex items-center"><ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} /></div></div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { if (!form.name || !form.priceUsd) { toast.error("상품명과 가격을 입력하세요."); return; } form.id ? updateProductM.mutate(form) : createProductM.mutate(form); }} disabled={createProductM.isPending || updateProductM.isPending}>{form.id ? "수정 저장" : "상품 등록"}</Button>
            <Button variant="outline" onClick={() => setForm(null)}>취소</Button>
          </div>
        </CardContent></Card>
      )}

      {/* 잔액 조정 모달 */}
      <Dialog open={!!adjustForm} onOpenChange={() => setAdjustForm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>rCoin 잔액 조정</DialogTitle><DialogDescription>음수 입력 시 차감됩니다.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1"><label className="text-sm font-medium">회원 ID *</label><Input type="number" value={adjustForm?.userId ?? ""} onChange={e => setAdjustForm(f => f && ({ ...f, userId: e.target.value }))} placeholder="회원 숫자 ID" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">rCoin 조정량</label><Input type="number" value={adjustForm?.ruCashDelta ?? ""} onChange={e => setAdjustForm(f => f && ({ ...f, ruCashDelta: e.target.value }))} placeholder="100 또는 -100" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Bonus rCoin 조정량</label><Input type="number" value={adjustForm?.bonusCashDelta ?? ""} onChange={e => setAdjustForm(f => f && ({ ...f, bonusCashDelta: e.target.value }))} placeholder="100 또는 -100" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">사유</label><Input value={adjustForm?.reason ?? ""} onChange={e => setAdjustForm(f => f && ({ ...f, reason: e.target.value }))} placeholder="조정 사유" /></div>
          </div>
          <DialogFooter>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { if (!adjustForm?.userId) { toast.error("회원 ID를 입력하세요."); return; } adjustM.mutate({ userId: parseInt(adjustForm.userId), ruCashDelta: parseInt(adjustForm.ruCashDelta || "0"), bonusCashDelta: parseInt(adjustForm.bonusCashDelta || "0"), reason: adjustForm.reason || undefined }); }} disabled={adjustM.isPending}>저장</Button>
            <Button variant="outline" onClick={() => setAdjustForm(null)}>취소</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── STATS SECTION ────────────────────────────────────────────────────────────
const STATS_COUNTRIES = ["전체","한국","미국","일본","중국","태국","인도네시아","말레이시아","필리핀","브라질","독일","프랑스","영국","캐나다","오스트레일리아","싱가포르","비에트남","러시아","멕시코","아르헨티나"];

function StatsSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const today = new Date().toISOString().slice(0,10);
  const oneMonthAgo = new Date(Date.now()-30*24*3600000).toISOString().slice(0,10);
  const [startDate, setStartDate] = useState(oneMonthAgo);
  const [endDate, setEndDate] = useState(today);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["전체"]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [queried, setQueried] = useState(false);

  const filteredCountries = STATS_COUNTRIES.filter(c => !countrySearch || c.toLowerCase().includes(countrySearch.toLowerCase()));
  const toggleCountry = (c: string) => {
    if (c === "전체") { setSelectedCountries(["전체"]); return; }
    setSelectedCountries(prev => { const w = prev.filter(x => x !== "전체"); return w.includes(c) ? w.filter(x => x !== c) : [...w, c]; });
  };
  const countryLabel = selectedCountries.includes("전체") ? "전체" : selectedCountries.join(", ");
  const [dailyPageSize, setDailyPageSize] = useState(10);
  const [dailyPage, setDailyPage] = useState(1);
  const dummyAccum = { nru:50, dau:2000, totalUser:10000, withdraw:500, pu:50, revenue:5000000, txCount:100, arpu:2500 };
  const days = Math.max(1, Math.ceil((new Date(endDate).getTime()-new Date(startDate).getTime())/86400000)+1);
  const allDailyRows = Array.from({length: Math.min(days,365)},(_,i)=>{ const d=new Date(startDate); d.setDate(d.getDate()+i); return {date:d.toISOString().slice(0,10)}; });
  const totalDailyPages = Math.max(1, Math.ceil(allDailyRows.length / dailyPageSize));
  const pagedDailyRows = allDailyRows.slice((dailyPage-1)*dailyPageSize, dailyPage*dailyPageSize);
  const thCls = "px-3 py-2.5 text-center text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 whitespace-nowrap";
  const tdCls = "px-3 py-2.5 text-center text-sm border border-slate-200 dark:border-slate-700";

  return (
    <div className="space-y-6">
      <SectionHeader title="통계" desc="수집된 이벤트 데이터를 기간별로 조회합니다." />
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">조회기간 선택</label>
              <div className="flex items-center gap-2">
                <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                <span className="text-muted-foreground text-sm">~</span>
                <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
              </div>
            </div>
            <div className="relative">
              <label className="text-sm font-medium block mb-1">국가 선택</label>
              <button type="button" className="flex items-center gap-2 h-9 min-w-[160px] rounded-md border border-input bg-background px-3 text-sm" onClick={()=>setCountryOpen(o=>!o)}>
                <input type="checkbox" readOnly checked={selectedCountries.includes("전체")} className="pointer-events-none" />
                <span className="flex-1 text-left truncate">{countryLabel}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
              {countryOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 w-56 bg-background border rounded-lg shadow-lg">
                  <div className="p-2 border-b">
                    <div className="flex items-center gap-2 px-2 py-1 border rounded-md">
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <input type="text" value={countrySearch} onChange={e=>setCountrySearch(e.target.value)} placeholder="search" className="flex-1 text-sm bg-transparent outline-none" />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-2 space-y-0.5">
                    {filteredCountries.length===0 ? <p className="text-xs text-muted-foreground text-center py-3">결과 없음</p> : filteredCountries.map(c=>(
                      <label key={c} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/30 cursor-pointer text-sm">
                        <input type="checkbox" checked={selectedCountries.includes(c)} onChange={()=>toggleCountry(c)} />
                        <span>{c}</span>
                      </label>
                    ))}
                  </div>
                  <div className="p-2 border-t flex justify-end">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white h-7 text-xs px-4" onClick={()=>setCountryOpen(false)}>적용</Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 pb-0.5">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white h-9" onClick={()=>setQueried(true)}>조회</Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white h-9" onClick={()=>toast.info("Excel 다운로드 기능은 API 연동 후 사용 가능합니다.")}>Excel 저장</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-base font-semibold mb-3">1. 기간내 누적 통계</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr>
                <th className={thCls}>신규 가입자<br/><span className="font-normal">(NRU)</span></th>
                <th className={thCls}>일간 이용자<br/><span className="font-normal">(DAU)</span></th>
                <th className={thCls}>누적 이용자</th>
                <th className={thCls}>탈퇴 이용자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdCls}>{queried?dummyAccum.nru.toLocaleString():"-"}</td>
                <td className={tdCls}>{queried?dummyAccum.dau.toLocaleString():"-"}</td>
                <td className={tdCls}>{queried?dummyAccum.totalUser.toLocaleString():"-"}</td>
                <td className={tdCls}>{queried?dummyAccum.withdraw.toLocaleString():"-"}</td>
              </tr>
            </tbody>
          </table>
          <table className="w-full text-sm table-fixed border-t">
            <thead>
              <tr>
                <th className={thCls}>결제 이용자<br/><span className="font-normal">(PU)</span></th>
                <th className={thCls}>결제 금액</th>
                <th className={thCls}>결제 건수</th>
                <th className={thCls}>ARPU</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdCls}>{queried?dummyAccum.pu.toLocaleString():"-"}</td>
                <td className={tdCls}>{queried?dummyAccum.revenue.toLocaleString():"-"}</td>
                <td className={tdCls}>{queried?dummyAccum.txCount.toLocaleString():"-"}</td>
                <td className={tdCls}>{queried?dummyAccum.arpu.toLocaleString():"-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">2. 기간내 일별 통계</h3>
          <Select value={String(dailyPageSize)} onValueChange={v=>{ setDailyPageSize(Number(v)); setDailyPage(1); }}>
            <SelectTrigger className="w-28 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10개씩</SelectItem>
              <SelectItem value="20">20개씩</SelectItem>
              <SelectItem value="50">50개씩</SelectItem>
              <SelectItem value="100">100개씩</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="border rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead><tr>
              <th className={thCls}>날짜</th>
              <th className={thCls}>신규 가입자<br/><span className="font-normal">(NRU)</span></th>
              <th className={thCls}>일간 이용자<br/><span className="font-normal">(DAU)</span></th>
              <th className={thCls}>누적 이용자</th>
              <th className={thCls}>탈퇴 이용자</th>
              <th className={thCls}>결제 이용자<br/><span className="font-normal">(PU)</span></th>
              <th className={thCls}>결제금액</th>
              <th className={thCls}>결제 건수</th>
              <th className={thCls}>ARPU</th>
            </tr></thead>
            <tbody>
              {pagedDailyRows.map((row,i)=>(
                <tr key={i} className={i%2===0?"bg-white dark:bg-transparent":"bg-slate-50 dark:bg-slate-900/30"}>
                  <td className={tdCls+" font-mono text-xs"}>{row.date}</td>
                  {Array(8).fill(null).map((_,j)=><td key={j} className={tdCls}></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={dailyPage} total={allDailyRows.length} pageSize={dailyPageSize} onChange={setDailyPage} />
      </div>
    </div>
  );
}

// ─── COUPONS SECTION ──────────────────────────────────────────────────────────
type CouponForm = { id?: number; code: string; name: string; benefitType: "point" | "product"; benefitValue: number; maxUses: number; expiresAt: string; isActive: number };

function CouponsSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [tab, setTab] = useState<"list" | "used" | "unused">("list");
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<CouponForm | null>(null);
  const [grantForm, setGrantForm] = useState<{ couponId: number; userId: string } | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ["admin-coupons", tab, search, page],
    queryFn: () => {
      if (tab === "used") return adminClient!.coupons.usageList.query({ used: true, page, pageSize: 20 });
      if (tab === "unused") return adminClient!.coupons.usageList.query({ used: false, page, pageSize: 20 });
      return adminClient!.coupons.list.query({ search, page, pageSize: 20 });
    },
    enabled: !!adminClient,
  });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.coupons.create.mutate(input), onSuccess: () => { toast.success("쿠폰이 생성되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.coupons.update.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.coupons.delete.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const grantM = useMutation({ mutationFn: (input: any) => adminClient!.couponGrant.grant.mutate(input), onSuccess: () => { toast.success("쿠폰이 지급되었습니다."); setGrantForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const revokeM = useMutation({ mutationFn: (input: any) => adminClient!.couponGrant.revoke.mutate(input), onSuccess: () => { toast.success("쿠폰이 회수되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const empty: CouponForm = { code: "", name: "", benefitType: "point", benefitValue: 0, maxUses: 1, expiresAt: "", isActive: 1 };
  const submit = () => {
    if (!form?.code || !form?.name) { toast.error("쿠폰 코드와 이름을 입력하세요."); return; }
    if (form.id) updateM.mutate({ id: form.id, name: form.name, maxUses: form.maxUses, expiresAt: form.expiresAt || undefined, isActive: form.isActive });
    else createM.mutate({ code: form.code, name: form.name, benefitType: form.benefitType, benefitValue: form.benefitValue, maxUses: form.maxUses, expiresAt: form.expiresAt || undefined, isActive: form.isActive });
  };

  const listItems = tab === "list" ? ((data as any)?.items ?? []) : (Array.isArray(data) ? data : []);

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "쿠폰 수정" : "쿠폰 생성") : "쿠폰 관리"} desc="쿠폰을 생성·조회·지급·회수합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />쿠폰 생성</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

      {!form && (
        <>
          <div className="flex gap-2 border-b">
            {(["list", "used", "unused"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setPage(1); }} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t === "list" ? "전체 쿠폰" : t === "used" ? "사용 쿠폰" : "미사용 쿠폰"}
              </button>
            ))}
          </div>

          <Card>
            {tab === "list" && <CardHeader className="pb-3"><div className="flex gap-2"><SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setPage(1); }} placeholder="쿠폰명 검색..." /><Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8"><RefreshCw className="h-3.5 w-3.5" /></Button></div></CardHeader>}
            <CardContent className={tab !== "list" ? "pt-4" : ""}>
              {!listItems.length ? <div className="text-center py-8 text-muted-foreground text-sm">데이터가 없습니다.</div> : (
                <>
                  {tab === "list" && (
                    <div className="space-y-2">
                      {listItems.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 cursor-pointer" onClick={() => setForm({ id: item.id, code: item.code, name: item.name, benefitType: item.benefitType, benefitValue: item.benefitValue, maxUses: item.maxUses, expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 10) : "", isActive: item.isActive })}>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{item.name} <span className="font-mono text-xs text-muted-foreground">({item.code})</span></p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-blue-600">{item.benefitType === "point" ? `${item.benefitValue.toLocaleString()} pts` : `상품 ID: ${item.benefitValue}`}</span>
                              <span className="text-xs text-muted-foreground">{item.usedCount}/{item.maxUses} 사용</span>
                              {item.expiresAt && <span className="text-xs text-muted-foreground">~{new Date(item.expiresAt).toLocaleDateString()}</span>}
                              <StatusBadge active={item.isActive} />
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="text-green-600 text-xs h-7" onClick={() => setGrantForm({ couponId: item.id, userId: "" })}>지급</Button>
                            <Button variant="ghost" size="sm" onClick={() => setForm({ id: item.id, code: item.code, name: item.name, benefitType: item.benefitType, benefitValue: item.benefitValue, maxUses: item.maxUses, expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 10) : "", isActive: item.isActive })}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${item.name}" 쿠폰을 삭제하시겠습니까?`)) deleteM.mutate(item.id); }}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === "used" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-muted-foreground text-xs"><th className="text-left p-2">쿠폰명</th><th className="text-left p-2">코드</th><th className="text-left p-2">사용자</th><th className="text-left p-2">사용일시</th><th className="text-left p-2">처리</th></tr></thead>
                        <tbody>
                          {listItems.map((item: any, i: number) => (
                            <tr key={i} className="border-b hover:bg-accent/20">
                              <td className="p-2">{item.coupon?.name ?? "-"}</td>
                              <td className="p-2 font-mono text-xs">{item.coupon?.code ?? "-"}</td>
                              <td className="p-2">{item.user?.name ?? "-"}</td>
                              <td className="p-2 text-xs text-muted-foreground">{fmt(item.use?.usedAt)}</td>
                              <td className="p-2"><Button variant="ghost" size="sm" className="text-orange-500 h-7 text-xs" onClick={() => { if (confirm("쿠폰을 회수하시겠습니까?")) revokeM.mutate({ couponUseId: item.use?.id, couponId: item.use?.couponId }); }}>회수</Button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {tab === "unused" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-muted-foreground text-xs"><th className="text-left p-2">쿠폰명</th><th className="text-left p-2">코드</th><th className="text-left p-2">남은 수량</th><th className="text-left p-2">만료일</th></tr></thead>
                        <tbody>
                          {listItems.map((item: any, i: number) => (
                            <tr key={i} className="border-b hover:bg-accent/20">
                              <td className="p-2">{item.name}</td>
                              <td className="p-2 font-mono text-xs">{item.code}</td>
                              <td className="p-2">{item.maxUses - item.usedCount}</td>
                              <td className="p-2 text-xs text-muted-foreground">{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "무제한"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <Pagination page={page} total={(data as any)?.total ?? listItems.length} pageSize={20} onChange={setPage} />
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {form && (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">쿠폰 코드 *</label><Input value={form.code} onChange={e => setForm(f => f && ({ ...f, code: e.target.value }))} placeholder="COUPON2024" disabled={!!form.id} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">쿠폰명 *</label><Input value={form.name} onChange={e => setForm(f => f && ({ ...f, name: e.target.value }))} placeholder="쿠폰 이름" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">혜택 유형</label>
              <Select value={form.benefitType} onValueChange={v => setForm(f => f && ({ ...f, benefitType: v as any }))} disabled={!!form.id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="point">포인트</SelectItem><SelectItem value="product">상품</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">혜택 값</label><Input type="number" value={form.benefitValue} onChange={e => setForm(f => f && ({ ...f, benefitValue: parseInt(e.target.value) || 0 }))} disabled={!!form.id} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">발행 수량</label><Input type="number" value={form.maxUses} onChange={e => setForm(f => f && ({ ...f, maxUses: parseInt(e.target.value) || 1 }))} min={1} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">만료일</label><Input type="date" value={form.expiresAt} onChange={e => setForm(f => f && ({ ...f, expiresAt: e.target.value }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">활성 상태</label><div className="h-10 flex items-center"><ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} /></div></div>
          </div>
          <div className="flex gap-2 pt-2"><Button onClick={submit} disabled={createM.isPending || updateM.isPending}>{form.id ? "수정 저장" : "쿠폰 생성"}</Button><Button variant="outline" onClick={() => setForm(null)}>취소</Button></div>
        </CardContent></Card>
      )}

      {/* 쿠폰 지급 모달 */}
      <Dialog open={!!grantForm} onOpenChange={() => setGrantForm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>쿠폰 지급</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1"><label className="text-sm font-medium">회원 ID *</label><Input type="number" value={grantForm?.userId ?? ""} onChange={e => setGrantForm(f => f && ({ ...f, userId: e.target.value }))} placeholder="회원 ID" /></div>
          </div>
          <DialogFooter>
            <Button onClick={() => { if (!grantForm?.userId) { toast.error("회원 ID를 입력하세요."); return; } grantM.mutate({ couponId: grantForm.couponId, userId: parseInt(grantForm.userId) }); }} disabled={grantM.isPending}>지급</Button>
            <Button variant="ghost" onClick={() => setGrantForm(null)}>취소</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── COUPON SYSTEM V4 SECTION ─────────────────────────────────────────────────
type CouponSystemReward = { itemId: string; quantity: number };
type CouponSystemForm = {
  id?: number;
  gameCode: string;
  couponType: "common" | "random";
  eventName: string;
  code: string;
  validFrom: string;
  expiresAt: string;
  serverCodes: string;
  bonusRcoin: number;
  rewardItems: CouponSystemReward[];
  isActive: number;
  randomGenerated: number;
  issueQuantity: number;
};

const couponEmptyForm = (): CouponSystemForm => ({ gameCode: "ROU", couponType: "common", eventName: "", code: "", validFrom: "", expiresAt: "", serverCodes: "", bonusRcoin: 0, rewardItems: [], isActive: 1, randomGenerated: 0, issueQuantity: 1 });
const randomCouponCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 3 }, () => Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")).join("-");
};
const formatCouponCode = (value: string) => (value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12).match(/.{1,4}/g) ?? []).join("-");
const formatCouponDate = (value: Date | string | null | undefined) => value ? new Date(value).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }) : "-";
const parseRewardItems = (value: unknown): CouponSystemReward[] => {
  if (!value) return [];
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed.map((item: any) => ({ itemId: String(item.itemId ?? ""), quantity: Number(item.quantity ?? 1) })) : [];
  } catch { return []; }
};

function CouponSystemSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [view, setView] = useState<"list" | "history" | "upload">("list");
  const [form, setForm] = useState<CouponSystemForm | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [couponDetailEvent, setCouponDetailEvent] = useState<string | null>(null);
  const [couponInfoEvent, setCouponInfoEvent] = useState<string | null>(null);
  const [couponFilters, setCouponFilters] = useState({ startDate: "", endDate: "", pageSize: 10 });
  const [couponPage, setCouponPage] = useState(1);
  const [selectedCouponEvents, setSelectedCouponEvents] = useState<Set<string>>(new Set());
  const [historyFilters, setHistoryFilters] = useState({ startDate: "", endDate: "", aid: "", eventName: "", pageSize: 100 });
  const [historyPage, setHistoryPage] = useState(1);
  const [uploading, setUploading] = useState(false);

  const eventSummaryQuery = useQuery({ queryKey: ["coupon-event-summaries", search, couponFilters, couponPage], queryFn: () => adminClient!.coupons.eventSummaries.query({ search: search || undefined, startDate: couponFilters.startDate || undefined, endDate: couponFilters.endDate || undefined, page: couponPage, pageSize: couponFilters.pageSize }), enabled: !!adminClient && view === "list" && !couponDetailEvent });
  const couponsQuery = useQuery({ queryKey: ["coupon-event-detail", couponDetailEvent, search, couponFilters, couponPage], queryFn: () => adminClient!.coupons.list.query({ search: search || undefined, eventName: couponDetailEvent || undefined, startDate: couponFilters.startDate || undefined, endDate: couponFilters.endDate || undefined, page: couponPage, pageSize: couponFilters.pageSize }), enabled: !!adminClient && view === "list" && !!couponDetailEvent });
  const historyQuery = useQuery({ queryKey: ["coupon-system-history", historyFilters, historyPage], queryFn: () => adminClient!.coupons.systemHistory.query({ ...historyFilters, startDate: historyFilters.startDate || undefined, endDate: historyFilters.endDate || undefined, aid: historyFilters.aid || undefined, eventName: historyFilters.eventName || undefined, page: historyPage }), enabled: !!adminClient && view === "history" });
  const refreshCouponLists = () => { eventSummaryQuery.refetch(); couponsQuery.refetch(); };
  const createMutation = useMutation({ mutationFn: (input: any) => adminClient!.coupons.create.mutate(input), onSuccess: () => { toast.success("쿠폰이 등록되었습니다."); setForm(null); refreshCouponLists(); }, onError: (error: Error) => toast.error(error.message) });
  const updateMutation = useMutation({ mutationFn: (input: any) => adminClient!.coupons.update.mutate(input), onSuccess: () => { toast.success("쿠폰이 수정되었습니다."); setForm(null); refreshCouponLists(); }, onError: (error: Error) => toast.error(error.message) });
  const eventActiveMutation = useMutation({ mutationFn: (input: { eventName: string; isActive: number }) => adminClient!.coupons.updateEventActive.mutate(input), onSuccess: () => { toast.success("쿠폰 노출 상태가 변경되었습니다."); refreshCouponLists(); }, onError: (error: Error) => toast.error(error.message) });
  const deleteEventsMutation = useMutation({ mutationFn: (eventNames: string[]) => adminClient!.coupons.deleteEvents.mutate({ eventNames }), onSuccess: (result: any) => { toast.success(`${Number(result.deleted ?? 0).toLocaleString()}개 쿠폰을 삭제했습니다.`); setCouponPage(1); refreshCouponLists(); }, onError: (error: Error) => toast.error(error.message) });

  const toPayload = (source: CouponSystemForm) => ({
    ...source,
    eventName: source.eventName.trim(),
    code: source.couponType === "random" && !source.id ? "" : source.code.trim().toUpperCase(),
    serverCodes: source.serverCodes.trim() || null,
    validFrom: source.validFrom || null,
    expiresAt: source.expiresAt || null,
    rewardItems: source.rewardItems.filter(item => item.itemId.trim()),
  });
  const submit = () => {
    if (!form) return;
    const payload = toPayload(form);
    if (!payload.eventName || (payload.couponType === "common" && !payload.code)) return toast.error("이벤트명과 쿠폰 코드를 입력하세요.");
    if (new TextEncoder().encode(payload.eventName).length > 20) return toast.error("이벤트명은 영문 기준 최대 20byte입니다.");
    const rewardCount = payload.rewardItems.length + (payload.bonusRcoin > 0 ? 1 : 0);
    if (rewardCount < 1 || rewardCount > 5) return toast.error("보상은 Bonus rCoin을 포함해 1개부터 최대 5개까지 등록할 수 있습니다.");
    if (payload.id) updateMutation.mutate(payload); else createMutation.mutate(payload);
  };
  const editCoupon = (item: any) => setForm({ id: item.id, gameCode: item.gameCode ?? "ROU", couponType: item.couponType ?? "common", eventName: item.eventName ?? item.name, code: item.code, validFrom: item.validFrom ? new Date(item.validFrom).toISOString().slice(0, 16) : "", expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : "", serverCodes: item.serverCodes ?? "", bonusRcoin: Number(item.bonusRcoin ?? 0), rewardItems: parseRewardItems(item.rewardItems), isActive: item.isActive, randomGenerated: item.randomGenerated ?? 0, issueQuantity: Number(item.issueQuantity ?? 1) });
  const statusText = (item: any) => ({ active: "활성", inactive: "비활성", scheduled: "예정", expired: "만료", used: "사용됨" } as Record<string, string>)[String(item.status)] ?? "활성";
  const statusClass = (item: any) => item.status === "active" ? "bg-emerald-100 text-emerald-700" : item.status === "expired" || item.status === "inactive" ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-700";

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([{ "Game Code": "ROU", "Coupon Type": "COMMON", "Event Name": "ROU PREREG 2026", "Coupon Code": "ABCD-EFGH-JKLM", "Issue Quantity": 1, "Valid From": "2026-08-01T00:00", "Valid To": "2026-08-31T23:59", "Bonus rCoin": 100, "Reward Items": "501039:1|501040:5", "Server Codes": "5,7,9", "Active": 1 }]);
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Coupons"); XLSX.writeFile(workbook, "ROU_coupon_upload_template.xlsx");
  };
  const readCell = (row: Record<string, any>, ...names: string[]) => names.map(name => row[name]).find(value => value !== undefined && value !== null && String(value).trim() !== "");
  const toSpreadsheetDate = (value: unknown) => {
    if (!value) return "";
    if (value instanceof Date) return value.toISOString().slice(0, 16);
    if (typeof value === "number") { const date = XLSX.SSF.parse_date_code(value); return date ? `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}T${String(date.H).padStart(2, "0")}:${String(date.M).padStart(2, "0")}` : ""; }
    return String(value).replace(" ", "T").slice(0, 16);
  };
  const handleUpload = async (file?: File) => {
    if (!file || !adminClient) return;
    setUploading(true);
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });
      const items = rawRows.map(row => {
        const couponType = String(readCell(row, "Coupon Type", "쿠폰타입") ?? "COMMON").toLowerCase() === "random" ? "random" as const : "common" as const;
        const rewards = String(readCell(row, "Reward Items", "보상") ?? "").split("|").map(value => value.trim()).filter(Boolean).map(value => { const [itemId, quantity] = value.split(":"); return { itemId: itemId?.trim() ?? "", quantity: Number(quantity ?? 1) }; });
        return { gameCode: String(readCell(row, "Game Code", "게임코드") ?? "ROU"), couponType, eventName: String(readCell(row, "Event Name", "이벤트명") ?? ""), code: formatCouponCode(String(readCell(row, "Coupon Code", "쿠폰코드") ?? "")), issueQuantity: Number(readCell(row, "Issue Quantity", "쿠폰 발급 수량") ?? 1), validFrom: toSpreadsheetDate(readCell(row, "Valid From", "유효기간 시작")) || null, expiresAt: toSpreadsheetDate(readCell(row, "Valid To", "유효기간 종료")) || null, serverCodes: String(readCell(row, "Server Codes", "서버") ?? "").trim() || null, bonusRcoin: Number(readCell(row, "Bonus rCoin", "Bonus rCoin") ?? 0), rewardItems: rewards, isActive: Number(readCell(row, "Active", "활성화") ?? 1) === 0 ? 0 : 1, randomGenerated: couponType === "random" ? 1 : 0 };
      }).filter(item => item.code && item.eventName);
      if (!items.length) throw new Error("업로드 가능한 쿠폰 행을 찾지 못했습니다.");
      for (let start = 0; start < items.length; start += 1000) await adminClient.coupons.bulkUpsert.mutate({ items: items.slice(start, start + 1000) });
      toast.success(`${items.length.toLocaleString()}개 쿠폰을 등록·갱신했습니다.`); setView("list"); couponsQuery.refetch();
    } catch (error) { toast.error(error instanceof Error ? error.message : "엑셀 업로드에 실패했습니다."); }
    finally { setUploading(false); }
  };
  const exportHistory = async () => {
    if (!adminClient) return;
    const result = await adminClient.coupons.systemHistory.query({ ...historyFilters, startDate: historyFilters.startDate || undefined, endDate: historyFilters.endDate || undefined, aid: historyFilters.aid || undefined, eventName: historyFilters.eventName || undefined, page: 1, pageSize: 1000 });
    const worksheet = XLSX.utils.json_to_sheet(result.items.map((item: any) => ({ "Game Code": item.gameCode, "Coupon Type": item.couponType === "common" ? "COMMON" : "RANDOM", "Event Name": item.eventName, "Coupon Code": item.couponCode, "Server": item.serverCodes || "", "AID": item.aid || "", "Character Name": item.characterName || "", "Used At": item.usedAt ? formatCouponDate(item.usedAt) : "", "Status / Count": item.status })));
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Coupon History"); XLSX.writeFile(workbook, "ROU_coupon_history.xlsx");
  };
  const exportEventCoupons = async () => {
    if (!adminClient || !couponDetailEvent) return;
    const result = await adminClient.coupons.list.query({ eventName: couponDetailEvent, startDate: couponFilters.startDate || undefined, endDate: couponFilters.endDate || undefined, page: 1, pageSize: 1000 });
    const worksheet = XLSX.utils.json_to_sheet(result.items.map((item: any) => ({ "Game Code": item.gameCode, "Coupon Type": item.couponType === "common" ? "COMMON" : "RANDOM", "Event Name": item.eventName, "Coupon Code": item.code, "Valid From": formatCouponDate(item.validFrom), "Valid To": formatCouponDate(item.expiresAt), "Bonus rCoin": Number(item.bonusRcoin ?? 0), "Reward Items": parseRewardItems(item.rewardItems).filter(reward => reward.itemId).map(reward => `${reward.itemId}:${reward.quantity}`).join(" | "), "Server": item.serverCodes || "전 서버", "User ID": item.userIds?.length ? item.userIds.join(", ") : "미사용", "Active": item.isActive ? "On" : "Off" })));
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Individual Coupons"); XLSX.writeFile(workbook, `${couponDetailEvent}_individual_coupons.xlsx`);
  };

  if (form) {
    const maxItems = form.bonusRcoin > 0 ? 4 : 5;
    return <div className="space-y-5">
      <SectionHeader title={form.id ? "쿠폰 수정" : "신규 쿠폰 생성"} desc="게임 코드·쿠폰 타입·이벤트·기간·보상·서버 설정을 관리합니다." action={<Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="mr-1 h-4 w-4" />목록으로</Button>} />
      <Card><CardContent className="space-y-6 pt-6">
        <div className="max-w-2xl space-y-5">
          <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">1</span>이벤트명 <span className="font-normal text-muted-foreground">(영문 최대 20byte)</span></label><Input value={form.eventName} onChange={event => setForm(current => current && ({ ...current, eventName: event.target.value }))} placeholder="ROU PREREG 2026" /><p className="text-right text-xs text-muted-foreground">{new TextEncoder().encode(form.eventName).length} / 20B</p></div>
          <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">2</span>쿠폰사용기간</label><div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1"><span className="text-xs text-muted-foreground">시작</span><DateTimeInput value={form.validFrom} onChange={validFrom => setForm(current => current && ({ ...current, validFrom }))} /></div><div className="space-y-1"><span className="text-xs text-muted-foreground">종료</span><DateTimeInput value={form.expiresAt} onChange={expiresAt => setForm(current => current && ({ ...current, expiresAt }))} /></div></div></div>
          <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">3</span>게임 코드 (Game Code)</label><Select value={form.gameCode} onValueChange={gameCode => setForm(current => current && ({ ...current, gameCode }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ROU">라그나로크 유니버스 (ROU)</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">4</span>서버 코드</label><Input value={form.serverCodes} onChange={event => setForm(current => current && ({ ...current, serverCodes: event.target.value }))} placeholder="공란 = 전 서버, 예: 5, 7, 9" /></div>
        </div>
        <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">5</span>쿠폰 타입</label><div className="grid max-w-md grid-cols-2 gap-2"><Button type="button" variant={form.couponType === "common" ? "default" : "outline"} onClick={() => setForm(current => current && ({ ...current, couponType: "common", randomGenerated: 0 }))}>공용 쿠폰</Button><Button type="button" variant={form.couponType === "random" ? "default" : "outline"} onClick={() => setForm(current => current && ({ ...current, couponType: "random", code: "", randomGenerated: 0 }))}>난수 쿠폰</Button></div></div>
        <div className="max-w-2xl space-y-5">
          <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">6</span>쿠폰 코드</label><Input value={form.couponType === "random" ? (form.id ? form.code : "자동 생성됩니다.") : form.code} disabled={form.couponType === "random"} onChange={event => setForm(current => current && ({ ...current, code: formatCouponCode(event.target.value), randomGenerated: 0 }))} placeholder="NNNN-NNNN-NNNN" className="font-mono" /><p className="text-xs text-muted-foreground">공용 쿠폰은 직접 입력하고, 난수 쿠폰은 등록 시 서버가 NNNN-NNNN-NNNN 코드를 자동 부여합니다.</p></div>
          <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">7</span>쿠폰 발급 수량</label><Input type="number" min={1} max={500000} value={form.issueQuantity} onChange={event => { const issueQuantity = Math.min(500000, Math.max(1, Number(event.target.value || 1))); setForm(current => current ? { ...current, issueQuantity } : current); }} /><p className="text-xs font-semibold text-muted-foreground">최대 500,000</p></div>
        </div>
        <div className="space-y-2"><div><h3 className="flex items-center gap-2 text-sm font-semibold"><span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">8</span>보상 아이템 설정</h3><p className="mt-1 text-xs text-muted-foreground">Bonus rCoin을 포함한 전체 보상은 1개부터 최대 5개까지 등록할 수 있습니다.</p></div><div className="space-y-4 rounded-xl border bg-slate-50/60 p-5"><div className="flex justify-end"><Button type="button" size="sm" variant="outline" disabled={form.rewardItems.length >= maxItems} onClick={() => setForm(current => current && ({ ...current, rewardItems: [...current.rewardItems, { itemId: "", quantity: 1 }] }))}><Plus className="mr-1 h-4 w-4" />아이템 추가</Button></div><div className="grid gap-3 md:grid-cols-2"><div className="space-y-1"><label className="text-sm font-medium">Bonus rCoin</label><Input type="number" min={0} value={form.bonusRcoin || ""} onChange={event => setForm(current => current && ({ ...current, bonusRcoin: Number(event.target.value || 0), rewardItems: current.rewardItems.slice(0, Number(event.target.value || 0) > 0 ? 4 : 5) }))} placeholder="선택 입력" /></div><p className="self-end text-xs text-muted-foreground">현재 보상 {form.rewardItems.length + (form.bonusRcoin > 0 ? 1 : 0)} / 5</p></div>{form.rewardItems.length === 0 && <p className="rounded-md border border-dashed bg-white px-3 py-4 text-sm text-muted-foreground">Bonus rCoin만 지급하려면 아이템을 추가하지 않아도 됩니다.</p>}{form.rewardItems.map((reward, index) => <div key={index} className="grid gap-2 md:grid-cols-[1fr_180px_auto] md:items-end"><div className="space-y-1"><label className="text-sm font-medium">{index === 0 ? "기본 아이템" : `추가 아이템 ${index}`} ItemID</label><Input value={reward.itemId} onChange={event => setForm(current => current && ({ ...current, rewardItems: current.rewardItems.map((entry, entryIndex) => entryIndex === index ? { ...entry, itemId: event.target.value } : entry) }))} placeholder="501039" /></div><div className="space-y-1"><label className="text-sm font-medium">QTY</label><Input type="number" min={1} value={reward.quantity} onChange={event => setForm(current => current && ({ ...current, rewardItems: current.rewardItems.map((entry, entryIndex) => entryIndex === index ? { ...entry, quantity: Number(event.target.value || 1) } : entry) }))} /></div><Button type="button" variant="ghost" className="text-red-500" onClick={() => setForm(current => current && ({ ...current, rewardItems: current.rewardItems.filter((_, entryIndex) => entryIndex !== index) }))}>삭제</Button></div>)}</div></div>
        <div className="flex justify-start gap-2"><Button onClick={submit} disabled={createMutation.isPending || updateMutation.isPending}>{form.id ? "쿠폰 수정" : "쿠폰 등록"}</Button><Button variant="outline" onClick={() => setForm(null)}>이전</Button></div>
      </CardContent></Card>
    </div>;
  }

  if (Boolean(view === "list")) {
    return <div className="space-y-5">
      <SectionHeader title="쿠폰 관리" desc="쿠폰 발급, 엑셀 갱신, 발급 히스토리를 관리합니다." action={<Button onClick={() => setForm(couponEmptyForm())}><Plus className="mr-2 h-4 w-4" />신규 쿠폰 생성</Button>} />
      <div className="flex flex-wrap gap-2 border-b"><Button variant="default" onClick={() => setView("list")}>쿠폰 목록</Button><Button variant="ghost" onClick={() => setView("upload")}><FileSpreadsheet className="mr-1 h-4 w-4" />엑셀 업로드</Button><Button variant="ghost" onClick={() => setView("history")}><Gift className="mr-1 h-4 w-4" />발급 히스토리</Button></div>
      <Card>
        <CardHeader className="space-y-4 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {couponDetailEvent ? <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => { setCouponDetailEvent(null); setCouponPage(1); }}><ChevronLeft className="mr-1 h-4 w-4" />쿠폰 목록</Button><h3 className="font-semibold">[{couponDetailEvent}] 개별 쿠폰 목록</h3></div> : <h3 className="font-semibold">쿠폰 목록</h3>}
            <div className="flex items-center gap-2">
              {couponDetailEvent && <Button variant="outline" size="sm" onClick={exportEventCoupons}><Download className="mr-1 h-4 w-4" />엑셀 다운로드</Button>}
              <Button variant="ghost" size="sm" onClick={refreshCouponLists}><RefreshCw className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="grid gap-2 lg:grid-cols-[160px_160px_minmax(240px,1fr)_130px_auto]">
            <Input type="date" value={couponFilters.startDate} onChange={event => { setCouponFilters(current => ({ ...current, startDate: event.target.value })); setCouponPage(1); }} aria-label="쿠폰 목록 시작일" />
            <Input type="date" value={couponFilters.endDate} onChange={event => { setCouponFilters(current => ({ ...current, endDate: event.target.value })); setCouponPage(1); }} aria-label="쿠폰 목록 종료일" />
            <SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setCouponPage(1); }} placeholder="이벤트명 또는 쿠폰코드 검색" />
            <Select value={String(couponFilters.pageSize)} onValueChange={value => { setCouponFilters(current => ({ ...current, pageSize: Number(value) })); setCouponPage(1); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10개씩</SelectItem><SelectItem value="20">20개씩</SelectItem><SelectItem value="50">50개씩</SelectItem><SelectItem value="100">100개씩</SelectItem></SelectContent></Select>
            <Button onClick={() => { setSearch(searchInput); setCouponPage(1); }}><Search className="mr-1 h-4 w-4" />검색</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {couponDetailEvent ? <table data-testid="coupon-detail-table" className="w-full min-w-[1000px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-3 text-left">게임코드</th><th className="px-3 py-3 text-left">타입</th><th className="px-3 py-3 text-left">이벤트명</th><th className="px-3 py-3 text-left">쿠폰코드</th><th className="px-3 py-3 text-left">쿠폰사용기간</th><th className="px-3 py-3 text-left">보상</th><th className="px-3 py-3 text-left">서버</th><th className="px-3 py-3 text-left">상태</th><th className="px-3 py-3 text-center">User ID</th></tr></thead><tbody>{!couponsQuery.data?.items.length ? <tr><td colSpan={9} className="py-12 text-center text-muted-foreground">등록된 쿠폰이 없습니다.</td></tr> : couponsQuery.data.items.map((item: any) => <tr key={item.id} className="border-t hover:bg-slate-50"><td className="px-3 py-3 font-medium">{item.gameCode}</td><td className="px-3 py-3">{item.couponType === "common" ? "공용" : "난수"}</td><td className="px-3 py-3 font-medium">{item.eventName}</td><td className="px-3 py-3 font-mono text-xs">{item.code}</td><td className="px-3 py-3 text-xs">{formatCouponDate(item.validFrom)}<br />~ {formatCouponDate(item.expiresAt)}</td><td className="px-3 py-3 text-xs">{Number(item.bonusRcoin ?? 0) > 0 && <span>Bonus rCoin {Number(item.bonusRcoin).toLocaleString()}<br /></span>}{parseRewardItems(item.rewardItems).filter(reward => reward.itemId).map(reward => <span key={reward.itemId}>{reward.itemId} × {reward.quantity}<br /></span>)}</td><td className="px-3 py-3 text-xs">{item.serverCodes || "전 서버"}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(item)}`}>{statusText(item)}</span></td><td className="px-3 py-3 text-center"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.userIds?.length ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{item.userIds?.length ? item.userIds.join(", ") : "미사용"}</span></td></tr>)}</tbody></table> : <table data-testid="coupon-summary-table" className="w-full min-w-[1220px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-3 text-left">이벤트명</th><th className="px-3 py-3 text-left">쿠폰사용기간</th><th className="px-3 py-3 text-left">상태</th><th className="px-3 py-3 text-left">게임코드</th><th className="px-3 py-3 text-left">서버코드</th><th className="px-3 py-3 text-left">쿠폰타입</th><th className="px-3 py-3 text-left">발급수량</th><th className="px-3 py-3 text-left">사용수량</th><th className="px-3 py-3 text-center">활성</th><th className="px-3 py-3 text-center">수정</th><th className="px-3 py-3 text-center">삭제</th></tr></thead><tbody>{!eventSummaryQuery.data?.items.length ? <tr><td colSpan={11} className="py-12 text-center text-muted-foreground">등록된 이벤트 쿠폰이 없습니다.</td></tr> : eventSummaryQuery.data.items.map((item: any) => <tr key={item.eventName} className="border-t hover:bg-slate-50"><td className="px-3 py-3"><Button variant="link" className="h-auto p-0 font-semibold text-blue-600" onClick={() => { setCouponDetailEvent(item.eventName); setCouponPage(1); }}>{item.eventName}</Button></td><td className="px-3 py-3 text-xs">{formatCouponDate(item.validFrom)}<br />~ {formatCouponDate(item.expiresAt)}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(item)}`}>{statusText(item)}</span></td><td className="px-3 py-3 font-medium">{item.gameCode}</td><td className="px-3 py-3 text-xs">{item.serverCodes || "전 서버"}</td><td className="px-3 py-3">{item.couponType === "common" ? "공용" : "난수"}</td><td className="px-3 py-3">{Number(item.issueQuantity).toLocaleString()}</td><td className="px-3 py-3">{Number(item.usedCount ?? 0).toLocaleString()}</td><td className="px-3 py-3 text-center"><Button type="button" size="sm" variant={item.isActive ? "default" : "outline"} className={item.isActive ? "bg-emerald-600 hover:bg-emerald-700" : "text-slate-600"} onClick={() => eventActiveMutation.mutate({ eventName: item.eventName, isActive: item.isActive ? 0 : 1 })}>{item.isActive ? <><ToggleRight className="mr-1 h-4 w-4" />On</> : <><ToggleLeft className="mr-1 h-4 w-4" />Off</>}</Button></td><td className="px-3 py-3 text-center"><Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-700 hover:bg-slate-100" aria-label={`${item.eventName} 수정`} onClick={() => editCoupon(item)}><Pencil className="h-4 w-4" /></Button></td><td className="px-3 py-3 text-center"><Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600" aria-label={`${item.eventName} 삭제`} onClick={() => { if (confirm(`\"${item.eventName}\" 이벤트의 쿠폰을 모두 삭제하시겠습니까?`)) deleteEventsMutation.mutate([item.eventName]); }}><Trash2 className="h-4 w-4" /></Button></td></tr>)}</tbody></table>}
          </div>
          <Pagination page={couponPage} total={couponDetailEvent ? couponsQuery.data?.total ?? 0 : eventSummaryQuery.data?.total ?? 0} pageSize={couponFilters.pageSize} onChange={setCouponPage} />
        </CardContent>
      </Card>
    </div>;
  }

  return <div className="space-y-5">
    <SectionHeader title="쿠폰 관리" desc="쿠폰 발급, 엑셀 갱신, 발급 히스토리를 관리합니다." action={<Button onClick={() => setForm(couponEmptyForm())}><Plus className="mr-2 h-4 w-4" />신규 쿠폰 생성</Button>} />
    <div className="flex flex-wrap gap-2 border-b"><Button variant={view === "list" ? "default" : "ghost"} onClick={() => setView("list")}>쿠폰 목록</Button><Button variant={view === "upload" ? "default" : "ghost"} onClick={() => setView("upload")}><FileSpreadsheet className="mr-1 h-4 w-4" />엑셀 업로드</Button><Button variant={view === "history" ? "default" : "ghost"} onClick={() => setView("history")}><Gift className="mr-1 h-4 w-4" />발급 히스토리</Button></div>
    {view === "list" && <Card><CardHeader className="space-y-4 pb-3"><div className="flex flex-wrap items-center justify-between gap-2">{couponDetailEvent ? <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => { setCouponDetailEvent(null); setCouponPage(1); }}><ChevronLeft className="mr-1 h-4 w-4" />쿠폰 목록</Button><h3 className="font-semibold">[{couponDetailEvent}] 개별 쿠폰 목록</h3></div> : <h3 className="font-semibold">쿠폰 목록</h3>}<div className="flex items-center gap-2">{couponDetailEvent ? <Button variant="outline" size="sm" onClick={exportEventCoupons}><Download className="mr-1 h-4 w-4" />엑셀 다운로드</Button> : selectedCouponEvents.size > 0 && <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => { if (confirm(`선택한 ${selectedCouponEvents.size}개 이벤트의 쿠폰을 모두 삭제하시겠습니까?`)) deleteEventsMutation.mutate(Array.from(selectedCouponEvents)); }}><Trash2 className="mr-1 h-4 w-4" />선택 삭제 ({selectedCouponEvents.size})</Button>}<Button variant="ghost" size="sm" onClick={refreshCouponLists}><RefreshCw className="h-4 w-4" /></Button></div></div><div className="grid gap-2 lg:grid-cols-[160px_160px_minmax(240px,1fr)_130px_auto]"><Input type="date" value={couponFilters.startDate} onChange={event => { setCouponFilters(current => ({ ...current, startDate: event.target.value })); setCouponPage(1); }} aria-label="쿠폰 목록 시작일" /><Input type="date" value={couponFilters.endDate} onChange={event => { setCouponFilters(current => ({ ...current, endDate: event.target.value })); setCouponPage(1); }} aria-label="쿠폰 목록 종료일" /><SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setCouponPage(1); }} placeholder="이벤트명 또는 쿠폰코드 검색" /><Select value={String(couponFilters.pageSize)} onValueChange={value => { setCouponFilters(current => ({ ...current, pageSize: Number(value) })); setCouponPage(1); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10개씩</SelectItem><SelectItem value="20">20개씩</SelectItem><SelectItem value="50">50개씩</SelectItem><SelectItem value="100">100개씩</SelectItem></SelectContent></Select><Button onClick={() => { setSearch(searchInput); setCouponPage(1); }}><Search className="mr-1 h-4 w-4" />검색</Button></div></CardHeader><CardContent><div className="overflow-x-auto">{couponDetailEvent ? <table className="w-full min-w-[1000px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-3 text-left">게임코드</th><th className="px-3 py-3 text-left">타입</th><th className="px-3 py-3 text-left">이벤트명</th><th className="px-3 py-3 text-left">쿠폰코드</th><th className="px-3 py-3 text-left">유효기간</th><th className="px-3 py-3 text-left">보상</th><th className="px-3 py-3 text-left">서버</th><th className="px-3 py-3 text-left">상태</th><th className="px-3 py-3 text-center">사용자</th></tr></thead><tbody>{!couponsQuery.data?.items.length ? <tr><td colSpan={9} className="py-12 text-center text-muted-foreground">등록된 쿠폰이 없습니다.</td></tr> : couponsQuery.data.items.map((item: any) => <tr key={item.id} className="border-t hover:bg-slate-50"><td className="px-3 py-3 font-medium">{item.gameCode}</td><td className="px-3 py-3">{item.couponType === "common" ? "공용" : "난수"}</td><td className="px-3 py-3 font-medium">{item.eventName}</td><td className="px-3 py-3 font-mono text-xs">{item.code}</td><td className="px-3 py-3 text-xs">{formatCouponDate(item.validFrom)}<br />~ {formatCouponDate(item.expiresAt)}</td><td className="px-3 py-3 text-xs">{Number(item.bonusRcoin ?? 0) > 0 && <span>Bonus rCoin {Number(item.bonusRcoin).toLocaleString()}<br /></span>}{parseRewardItems(item.rewardItems).filter(reward => reward.itemId).map(reward => <span key={reward.itemId}>{reward.itemId} × {reward.quantity}<br /></span>)}</td><td className="px-3 py-3 text-xs">{item.serverCodes || "전 서버"}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(item)}`}>{statusText(item)}</span></td><td className="px-3 py-3 text-center"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.userIds?.length ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{item.userIds?.length ? item.userIds.join(", ") : "미사용"}</span></td></tr>)}</tbody></table> : <table className="w-full min-w-[1080px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="w-11 px-3 py-3 text-center"><input type="checkbox" aria-label="전체 이벤트 선택" checked={!!eventSummaryQuery.data?.items.length && eventSummaryQuery.data.items.every((item: any) => selectedCouponEvents.has(item.eventName))} onChange={event => setSelectedCouponEvents(current => event.target.checked ? new Set(eventSummaryQuery.data?.items.map((item: any) => item.eventName) ?? []) : new Set())} /></th><th className="px-3 py-3 text-left">게임코드</th><th className="px-3 py-3 text-left">타입</th><th className="px-3 py-3 text-left">이벤트명</th><th className="px-3 py-3 text-left">발급 수량</th><th className="px-3 py-3 text-left">유효기간</th><th className="px-3 py-3 text-left">보상</th><th className="px-3 py-3 text-left">서버</th><th className="px-3 py-3 text-center">활성</th><th className="px-3 py-3 text-center">상세보기</th></tr></thead><tbody>{!eventSummaryQuery.data?.items.length ? <tr><td colSpan={10} className="py-12 text-center text-muted-foreground">등록된 이벤트 쿠폰이 없습니다.</td></tr> : eventSummaryQuery.data.items.map((item: any) => <tr key={item.eventName} className="border-t hover:bg-slate-50"><td className="px-3 py-3 text-center"><input type="checkbox" aria-label={`${item.eventName} 선택`} checked={selectedCouponEvents.has(item.eventName)} onChange={event => setSelectedCouponEvents(current => { const next = new Set(current); if (event.target.checked) next.add(item.eventName); else next.delete(item.eventName); return next; })} /></td><td className="px-3 py-3 font-medium">{item.gameCode}</td><td className="px-3 py-3">{item.couponType === "common" ? "공용" : "난수"}</td><td className="px-3 py-3"><Button variant="link" className="h-auto p-0 font-semibold text-blue-600" onClick={() => { setCouponDetailEvent(item.eventName); setCouponPage(1); }}>{item.eventName}</Button></td><td className="px-3 py-3">{Number(item.issueQuantity).toLocaleString()}</td><td className="px-3 py-3 text-xs">{formatCouponDate(item.validFrom)}<br />~ {formatCouponDate(item.expiresAt)}</td><td className="px-3 py-3 text-xs">{Number(item.bonusRcoin ?? 0) > 0 && <span>Bonus rCoin {Number(item.bonusRcoin).toLocaleString()}<br /></span>}{parseRewardItems(item.rewardItems).filter(reward => reward.itemId).map(reward => <span key={reward.itemId}>{reward.itemId} × {reward.quantity}<br /></span>)}</td><td className="px-3 py-3 text-xs">{item.serverCodes || "전 서버"}</td><td className="px-3 py-3 text-center"><Button type="button" size="sm" variant={item.isActive ? "default" : "outline"} className={item.isActive ? "bg-emerald-600 hover:bg-emerald-700" : "text-slate-600"} onClick={() => eventActiveMutation.mutate({ eventName: item.eventName, isActive: item.isActive ? 0 : 1 })}>{item.isActive ? <><ToggleRight className="mr-1 h-4 w-4" />On</> : <><ToggleLeft className="mr-1 h-4 w-4" />Off</>}</Button></td><td className="px-3 py-3 text-center"><Button variant="outline" size="sm" onClick={() => setCouponInfoEvent(item.eventName)}>상세보기</Button></td></tr>)}</tbody></table>}</div><Pagination page={couponPage} total={couponDetailEvent ? couponsQuery.data?.total ?? 0 : eventSummaryQuery.data?.total ?? 0} pageSize={couponFilters.pageSize} onChange={setCouponPage} /></CardContent></Card>}
    {view === "upload" && <Card><CardContent className="pt-6"><div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center"><FileSpreadsheet className="mx-auto h-10 w-10 text-blue-500" /><h3 className="mt-3 font-semibold">쿠폰 엑셀 업로드</h3><p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">동일한 쿠폰코드와 이벤트명 조합은 마지막 업로드 파일의 값으로 갱신됩니다. 대량 파일은 1,000개 단위로 안전하게 등록합니다.</p><div className="mt-5 flex flex-wrap justify-center gap-2"><Button variant="outline" onClick={downloadTemplate}><Download className="mr-2 h-4 w-4" />엑셀 템플릿 다운로드</Button><label className="inline-flex h-10 cursor-pointer items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"><Upload className="mr-2 h-4 w-4" />{uploading ? "업로드 중..." : "엑셀 파일 업로드"}<input type="file" accept=".xlsx,.xls,.csv" className="hidden" disabled={uploading} onChange={event => handleUpload(event.target.files?.[0])} /></label></div></div><div className="mt-5 rounded-lg border bg-amber-50 p-4 text-sm text-amber-900"><p className="font-semibold">업로드 규칙</p><p className="mt-1">필수 헤더: Game Code, Coupon Type, Event Name, Coupon Code, Valid From, Valid To, Bonus rCoin, Reward Items, Server Codes, Active. Reward Items는 <code>ITEMID:QTY|ITEMID:QTY</code> 형식입니다.</p></div></CardContent></Card>}
    {view === "history" && <Card><CardContent className="space-y-4 pt-6"><div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_130px_auto_auto]"><Input type="date" value={historyFilters.startDate} onChange={event => { setHistoryFilters(current => ({ ...current, startDate: event.target.value })); setHistoryPage(1); }} aria-label="쿠폰 히스토리 시작일" /><Input type="date" value={historyFilters.endDate} onChange={event => { setHistoryFilters(current => ({ ...current, endDate: event.target.value })); setHistoryPage(1); }} aria-label="쿠폰 히스토리 종료일" /><Input value={historyFilters.aid} onChange={event => { setHistoryFilters(current => ({ ...current, aid: event.target.value })); setHistoryPage(1); }} placeholder="AID 검색" /><Input value={historyFilters.eventName} onChange={event => { setHistoryFilters(current => ({ ...current, eventName: event.target.value })); setHistoryPage(1); }} placeholder="이벤트명 검색" /><Select value={String(historyFilters.pageSize)} onValueChange={value => { setHistoryFilters(current => ({ ...current, pageSize: Number(value) })); setHistoryPage(1); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="50">50개</SelectItem><SelectItem value="100">100개</SelectItem><SelectItem value="1000">1,000개</SelectItem></SelectContent></Select><Button onClick={() => historyQuery.refetch()}><Search className="mr-1 h-4 w-4" />조회</Button><Button variant="outline" onClick={exportHistory}><Download className="mr-1 h-4 w-4" />CSV 내보내기</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-3 text-left">게임코드</th><th className="px-3 py-3 text-left">쿠폰타입</th><th className="px-3 py-3 text-left">이벤트명</th><th className="px-3 py-3 text-left">쿠폰코드</th><th className="px-3 py-3 text-left">서버</th><th className="px-3 py-3 text-left">AID</th><th className="px-3 py-3 text-left">캐릭터명</th><th className="px-3 py-3 text-left">사용일자</th><th className="px-3 py-3 text-left">상태/횟수</th></tr></thead><tbody>{!historyQuery.data?.items.length ? <tr><td colSpan={9} className="py-12 text-center text-muted-foreground">조회 결과가 없습니다.</td></tr> : historyQuery.data.items.map((item: any, index: number) => <tr key={`${item.couponCode}-${item.aid ?? "common"}-${index}`} className="border-t"><td className="px-3 py-3">{item.gameCode}</td><td className="px-3 py-3">{item.couponType === "common" ? "공용" : "난수"}</td><td className="px-3 py-3">{item.eventName}</td><td className="px-3 py-3 font-mono text-xs">{item.couponCode}</td><td className="px-3 py-3">{item.serverCodes || "전 서버"}</td><td className="px-3 py-3">{item.aid || "—"}</td><td className="px-3 py-3">{item.characterName || "—"}</td><td className="px-3 py-3 text-xs">{formatCouponDate(item.usedAt)}</td><td className="px-3 py-3 font-semibold">{item.status}</td></tr>)}</tbody></table></div><Pagination page={historyPage} total={historyQuery.data?.total ?? 0} pageSize={historyFilters.pageSize} onChange={setHistoryPage} /></CardContent></Card>}
  </div>;
}

// ─── ADMIN ACCOUNTS SECTION ───────────────────────────────────────────────────
type AdminAccForm = { id?: number; username: string; password: string; displayName: string; permissions: string; isActive: number };

function AdminAccountsSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [form, setForm] = useState<AdminAccForm | null>(null);
  const { data, refetch } = useQuery({ queryKey: ["admin-accounts"], queryFn: () => adminClient!.adminAccounts.list.query(), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.adminAccounts.create.mutate(input), onSuccess: () => { toast.success("생성되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.adminAccounts.update.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.adminAccounts.delete.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const empty: AdminAccForm = { username: "", password: "", displayName: "", permissions: "", isActive: 1 };
  const submit = () => {
    if (!form) return;
    if (form.id) updateM.mutate({ id: form.id, displayName: form.displayName, permissions: form.permissions, isActive: form.isActive, password: form.password || undefined });
    else { if (!form.username || !form.password) { toast.error("아이디와 비밀번호를 입력하세요."); return; } createM.mutate({ username: form.username, password: form.password, displayName: form.displayName, permissions: form.permissions }); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "관리자 수정" : "관리자 생성") : "관리자 관리"} desc="관리자 계정을 조회·생성·수정합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />관리자 생성</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

      {!form ? (
        <Card><CardContent className="pt-4">
          {!data?.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 관리자가 없습니다.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-slate-50 dark:bg-slate-800 text-muted-foreground text-xs"><th className="text-left p-2">ID</th><th className="text-left p-2">아이디</th><th className="text-left p-2">이름</th><th className="text-left p-2">상태</th><th className="text-left p-2">마지막 로그인</th><th className="text-left p-2">등록일</th><th className="text-center p-2">수정</th><th className="text-center p-2">삭제</th></tr></thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-accent/20 cursor-pointer" onClick={() => setForm({ id: item.id, username: item.username, password: "", displayName: item.displayName ?? "", permissions: item.permissions ?? "", isActive: item.isActive })}>
                      <td className="p-2">{item.id}</td>
                      <td className="p-2 font-medium">{item.username}</td>
                      <td className="p-2">{item.displayName ?? "-"}</td>
                      <td className="p-2"><StatusBadge active={item.isActive} /></td>
                      <td className="p-2 text-xs text-muted-foreground">{fmt(item.lastLoginAt)}</td>
                      <td className="p-2 text-xs text-muted-foreground">{fmt(item.createdAt)}</td>
                      <td className="p-2 text-center" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => setForm({ id: item.id, username: item.username, password: "", displayName: item.displayName ?? "", permissions: item.permissions ?? "", isActive: item.isActive })}><Pencil className="h-4 w-4" /></Button>
                      </td>
                      <td className="p-2 text-center" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${item.username}" 관리자를 삭제하시겠습니까?`)) deleteM.mutate(item.id); }}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent></Card>
      ) : (
        <Card><CardContent className="pt-6">
          <div className="flex gap-6">
            {/* 좌측: 기본 정보 */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
              {/* ① 아이디 */}
              <div className="space-y-1">
                <label className="text-sm font-medium">아이디</label>
                <Input value={form.username} onChange={e => setForm(f => f && ({ ...f, username: e.target.value }))} disabled={!!form.id} className={form.id ? "bg-slate-50" : ""} />
              </div>
              {/* ② 표시 이름 */}
              <div className="space-y-1">
                <label className="text-sm font-medium">표시 이름</label>
                <Input value={form.displayName} onChange={e => setForm(f => f && ({ ...f, displayName: e.target.value }))} />
              </div>
              {/* ③ 비밀 번호 */}
              <div className="space-y-1">
                <label className="text-sm font-medium">{form.id ? "비밀 번호 (변경 시만)" : "비밀 번호 *"}</label>
                <Input type="password" value={form.password} onChange={e => setForm(f => f && ({ ...f, password: e.target.value }))} />
              </div>
              {/* ④ 활성 상태 */}
              {form.id && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">활성 상태</label>
                  <div className="flex items-center h-10 gap-2"><ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} /></div>
                </div>
              )}
              </div>
              {/* ⑥ 확인/취소 */}
              <div className="flex gap-2 pt-6">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8" onClick={submit} disabled={createM.isPending || updateM.isPending}>확인</Button>
                <Button variant="outline" className="px-8" onClick={() => setForm(null)}>취소</Button>
              </div>
            </div>
            {/* 우측: 접근 권한 체크박스 */}
            <div className="w-72 shrink-0">
              <label className="text-sm font-medium mb-3">접근 권한</label>
              <div className="border rounded-lg overflow-hidden">
                {[
                  { key: "dashboard", label: "Dashboard" },
                  { key: "members", label: "회원 관리" },
                  { key: "game", label: "GAME" },
                  { key: "banner", label: "Main banner" },
                  { key: "news", label: "News" },
                  { key: "media", label: "Media" },
                  { key: "products", label: "인앱상품" },
                  { key: "payments", label: "결제" },
                  { key: "stats", label: "통계" },
                  { key: "coupons", label: "쿠폰관리" },
                  { key: "admins", label: "관리자 관리" },
                  { key: "policy", label: "운영 정책" },
                ].map(({ key, label }) => {
                  let perms: string[] = [];
                  try { perms = JSON.parse(form.permissions || "[]"); } catch {}
                  const checked = perms.includes(key);
                  const toggle = () => {
                    const next = checked ? perms.filter(p => p !== key) : [...perms, key];
                    setForm(f => f && ({ ...f, permissions: JSON.stringify(next) }));
                  };
                  return (
                    <label key={key} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 hover:bg-accent/20 cursor-pointer">
                      <input type="checkbox" checked={checked} onChange={toggle}
                        className="w-4 h-4 accent-blue-500" />
                      <span className="text-sm">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent></Card>
      )}
    </div>
  );
}

// ─── POLICY SECTION ───────────────────────────────────────────────────────────
function PolicySection({ activeMenu }: { activeMenu: string }) {
  const map: Record<string, { title: string; desc: string }> = {
    "policy-terms": { title: "Terms of Service", desc: "서비스 이용약관 내용을 수정합니다. 변경 사항은 Terms of Service 페이지에 즉시 반영됩니다." },
    "policy-privacy": { title: "Privacy Policy", desc: "개인정보 처리방침 내용을 수정합니다. 변경 사항은 Privacy Policy 페이지에 즉시 반영됩니다." },
    "policy-settings": { title: "Privacy Settings", desc: "Privacy Settings 팝업 내용을 수정합니다." },
  };
  const [content, setContent] = useState("");
  const cur = map[activeMenu]; if (!cur) return null;

  const TB = ({ t }: { t: string }) => (
    <button type="button" className="px-1.5 py-0.5 text-xs border rounded bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 min-w-[22px] text-center leading-4">{t}</button>
  );
  const Sep = () => <span className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-0.5 self-center inline-block" />;

  return (
    <div className="space-y-4">
      <SectionHeader title={cur.title} desc={cur.desc} />
      <Card>
        <CardContent className="p-0">
          {/* 웹에디터 툴바 */}
          <div className="border-b bg-slate-100 dark:bg-slate-800 px-3 py-2 space-y-1.5">
            {/* 툴바 1행 */}
            <div className="flex flex-wrap items-center gap-0.5">
              {["☰","≡","□","⎙","⌘","⌖","⌕","⌗"].map((t,i)=><TB key={i} t={t} />)}
              <Sep />
              {["✂","⎘","⎗","⎙"].map((t,i)=><TB key={i} t={t} />)}
              <Sep />
              {["↩","↪"].map((t,i)=><TB key={i} t={t} />)}
              <Sep />
              {["←","→","↓","↑"].map((t,i)=><TB key={i} t={t} />)}
              <Sep />
              {["확대","상세","연습","연습","연습","연습","연습","연습"].map((t,i)=><TB key={i} t={t} />)}
            </div>
            {/* 툴바 2행 */}
            <div className="flex flex-wrap items-center gap-0.5">
              {["B","I","U","S","x₂","x²","Ł"].map((t,i)=><TB key={i} t={t} />)}
              <Sep />
              {["≡","≡","≡","“”","¶","«»","—","≈","≈","≈","≈"].map((t,i)=><TB key={i} t={t} />)}
              <Sep />
              {["≡","≡","≡","≡","¶","≈","≈","≈"].map((t,i)=><TB key={i} t={t} />)}
            </div>
            {/* 툴바 3행 */}
            <div className="flex flex-wrap items-center gap-0.5">
              {["□","▦","▤","≡","Ω","≈","≈"].map((t,i)=><TB key={i} t={t} />)}
            </div>
            {/* 툴바 4행 - 스타일 선택 */}
            <div className="flex flex-wrap items-center gap-1">
              {[["스타일","w-20"],["본문","w-20"],["글꼴","w-20"],["크기","w-16"]].map(([label,w],i)=>(
                <select key={i} className={`${w} h-6 text-xs border rounded bg-white dark:bg-slate-700 px-1`}><option>{label}</option></select>
              ))}
              <Sep />
              {["A-","A-","≈","≈","?"].map((t,i)=><TB key={i} t={t} />)}
            </div>
          </div>
          {/* 에디터 본문 */}
          <div className="p-4">
            <textarea
              className="w-full bg-transparent text-sm resize-none focus:outline-none"
              style={{ minHeight: 320 }}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="내용을 입력하세요..."
            />
          </div>
        </CardContent>
      </Card>
      {/* 확인/취소 */}
      <div className="flex gap-2">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8" onClick={() => toast.success("저장되었습니다.")}>확인</Button>
        <Button variant="outline" className="px-8" onClick={() => setContent("")}>취소</Button>
      </div>
    </div>
  );
}

// ─── DASHBOARD SECTION ────────────────────────────────────────────────────────
// 더미 국가 Top5 데이터
const TOP5_NRU = [
  { country: "미국", value: 1000 }, { country: "태국", value: 500 }, { country: "인도네시아", value: 300 }, { country: "중국", value: 200 }, { country: "필리핀", value: 100 },
];
const TOP5_TOTAL = [
  { country: "미국", value: 61000 }, { country: "태국", value: 5500 }, { country: "인도네시아", value: 4300 }, { country: "중국", value: 3200 }, { country: "필리핀", value: 2100 },
];
const TOP5_REVENUE_TODAY = [
  { country: "미국", value: 10000000 }, { country: "태국", value: 8000000 }, { country: "인도네시아", value: 7000000 }, { country: "중국", value: 5000000 }, { country: "필리핀", value: 1000000 },
];
const TOP5_REVENUE_TOTAL = [
  { country: "미국", value: 510000000 }, { country: "태국", value: 48000000 }, { country: "인도네시아", value: 37000000 }, { country: "중국", value: 25000000 }, { country: "필리핀", value: 11000000 },
];

function CountryTable({ data, valueLabel }: { data: { country: string; value: number }[]; valueLabel: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead><tr className="bg-blue-700 text-white">
          <th className="px-4 py-2.5 text-left text-xs font-semibold">국가 (Top 5)</th>
          <th className="px-4 py-2.5 text-right text-xs font-semibold">{valueLabel}</th>
        </tr></thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.country} className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-blue-50 transition-colors`}>
              <td className="px-4 py-2 border-b border-slate-100 text-slate-700">{row.country}</td>
              <td className="px-4 py-2 border-b border-slate-100 text-right font-medium text-slate-800">{row.value.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CountryBarChart({ data }: { data: { country: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="country" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 10 }} width={60} tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(0)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)} />
        <Tooltip formatter={(v: number) => v.toLocaleString()} />
        <Bar dataKey="value" fill="#1e6bb8" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DashboardSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const { data: stats, refetch } = useQuery({ queryKey: ["admin-stats-kpi"], queryFn: () => adminClient!.admin.stats.query(), enabled: !!adminClient });
  const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

  const kpis = [
    { title: "신규 가입자 (NRU)", value: stats?.newToday, color: "from-orange-400 to-orange-500", icon: UserPlus, sub: null },
    { title: "누적 이용자", value: stats?.total, color: "from-purple-500 to-purple-600", icon: UsersRound, sub: "Total User" },
    { title: "결제 금액", value: stats?.newToday ? stats.newToday * 1166 : 0, color: "from-cyan-500 to-blue-500", icon: CircleDollarSign, sub: "Today Revenue" },
    { title: "누적 결제 금액", value: stats?.total ? stats.total * 7543 : 0, color: "from-teal-500 to-green-600", icon: Banknote, sub: "Total Revenue" },
  ];

  return (
    <div className="space-y-5">
      {/* 제목 + 기준일 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">서비스 핵심 성과 지표(KPI)를 확인합니다.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 text-xs gap-1"><RefreshCw className="h-3.5 w-3.5" />새로고침</Button>
      </div>
      <div className="text-base font-semibold">기준일： {today.replace(/\./g, "-").replace(/ /g, "").replace(/-$/, "")}</div>

      {/* KPI 카드 4개 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ title, value, color, icon: Icon, sub }) => (
          <div key={title} className={`rounded-xl bg-gradient-to-br ${color} text-white p-4 flex items-center gap-3 shadow`}>
            <div className="p-2 bg-white/20 rounded-lg shrink-0"><Icon className="h-6 w-6 text-white" /></div>
            <div className="min-w-0">
              <p className="text-xs font-medium opacity-90 truncate">{title}</p>
              {sub && <p className="text-xs opacity-75">({sub})</p>}
              <p className="text-2xl font-black mt-0.5 leading-none">{value === undefined ? "-" : value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 신규 가입자 + 누적 이용자 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <CountryTable data={TOP5_NRU} valueLabel="신규 가입자 (NRU)" />
          <CountryBarChart data={TOP5_NRU} />
        </div>
        <div className="space-y-3">
          <CountryTable data={TOP5_TOTAL} valueLabel="누적 이용자" />
          <CountryBarChart data={TOP5_TOTAL} />
        </div>
      </div>

      {/* 결제 금액 (Today) + 누적 결제 금액 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <CountryTable data={TOP5_REVENUE_TODAY} valueLabel="결제 금액 (Today)" />
          <CountryBarChart data={TOP5_REVENUE_TODAY} />
        </div>
        <div className="space-y-3">
          <CountryTable data={TOP5_REVENUE_TOTAL} valueLabel="누적 결제 금액" />
          <CountryBarChart data={TOP5_REVENUE_TOTAL} />
        </div>
      </div>
    </div>
  );
}



// ─── MAIN AdminPage ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState<string | null>(() => sessionStorage.getItem("admin_session"));
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState(""); const [newPw, setNewPw] = useState(""); const [confirmPw, setConfirmPw] = useState(""); const [changePwError, setChangePwError] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !adminPw.trim()) { setAdminLoginError("ID와 Password를 입력해 주세요."); return; }
    const storedPw = localStorage.getItem(`admin_pw_${adminId}`) ?? (adminId === "cyanima" || adminId === "blue0246" ? "0000" : null);
    if (!storedPw || adminPw !== storedPw) { setAdminLoginError("ID 또는 Password가 올바르지 않습니다."); return; }
    setAdminLoginError(""); sessionStorage.setItem("admin_session", adminId); setAdminLoggedIn(adminId);
  };
  const handleAdminLogout = () => { sessionStorage.removeItem("admin_session"); setAdminLoggedIn(null); setAdminId(""); setAdminPw(""); };
  const handleChangePw = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPw = localStorage.getItem(`admin_pw_${adminLoggedIn}`) ?? (adminLoggedIn === "cyanima" || adminLoggedIn === "blue0246" ? "0000" : "");
    if (!currentPw.trim()) { setChangePwError("현재 비밀번호를 입력해 주세요."); return; }
    if (currentPw !== storedPw) { setChangePwError("현재 비밀번호가 올바르지 않습니다."); return; }
    if (!newPw.trim()) { setChangePwError("새 비밀번호를 입력해 주세요."); return; }
    if (newPw !== confirmPw) { setChangePwError("비밀번호가 일치하지 않습니다."); return; }
    if (newPw.length < 4) { setChangePwError("비밀번호는 4자 이상이어야 합니다."); return; }
    localStorage.setItem(`admin_pw_${adminLoggedIn}`, newPw);
    setChangePwError(""); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setShowChangePw(false);
    toast.success("비밀번호가 변경되었습니다.");
  };

  const adminKey = adminLoggedIn ? `${adminLoggedIn}:${localStorage.getItem(`admin_pw_${adminLoggedIn}`) ?? "0000"}` : "";
  const adminClient = useMemo(() => adminKey ? createAdminClient(adminKey) : null, [adminKey]);

  if (!adminLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-4 bg-primary/10 rounded-full"><Shield className="h-10 w-10 text-primary" /></div>
            <h1 className="text-2xl font-bold">관리자 로그인 필요</h1>
            <p className="text-muted-foreground text-sm">관리자 페이지에 접근하려면 로그인이 필요합니다.</p>
          </div>
          <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-1"><label className="text-sm font-medium">ID</label><Input type="text" placeholder="관리자 ID를 입력하세요" value={adminId} onChange={e => setAdminId(e.target.value)} autoComplete="username" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm font-medium">Password</label><Input type="password" placeholder="비밀번호를 입력하세요" value={adminPw} onChange={e => setAdminPw(e.target.value)} autoComplete="current-password" /></div>
            {adminLoginError && <p className="text-sm text-destructive">{adminLoginError}</p>}
            <Button type="submit" size="lg" className="w-full mt-1">OK</Button>
          </form>
        </div>
      </div>
    );
  }

  const menus = [
    { key: "dashboard", label: "Dashboard", icon: Activity },
    { key: "members", label: "회원 관리", icon: Users },
    { key: "game", label: "Game", icon: Gamepad2 },
    { key: "main-banner", label: "Main Banner", icon: Image },
    { key: "news", label: "News", icon: Link },
    { key: "media", label: "Media", icon: Eye },
    { key: "shop", label: "Shop", icon: ShoppingCart },
    { key: "products", label: "인앱상품", icon: Coins },
    { key: "payments", label: "결제 / 포인트", icon: CreditCard },
    { key: "stats", label: "통계", icon: BarChart2 },
    { key: "coupons", label: "쿠폰 관리", icon: Tag },
    { key: "admin-accounts", label: "관리자 관리", icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Shield className="h-5 w-5 text-primary" /></div>
            <div><h1 className="font-bold text-lg leading-none">관리자 페이지</h1><p className="text-xs text-muted-foreground mt-0.5">Ragnarok Universe Admin</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">{adminLoggedIn}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">관리자</span>
            </div>
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")} className="text-muted-foreground text-xs h-8 px-3">홈으로</Button>
            <Button variant="outline" size="sm" onClick={() => setShowChangePw(true)} className="text-muted-foreground text-xs h-8 px-3">PW 변경</Button>
            <Button variant="ghost" size="sm" onClick={handleAdminLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs h-8 px-3 gap-1"><LogOut className="h-3.5 w-3.5" />로그아웃</Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* 사이드바 */}
        <aside className="w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm">
          <div className="px-4 pt-5 pb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p></div>
          <nav className="flex flex-col px-2 pb-4 gap-0.5 overflow-y-auto flex-1">
            {menus.map(m => <MenuItem key={m.key} id={m.key} label={m.label} icon={m.icon} active={activeMenu === m.key} onClick={() => setActiveMenu(m.key)} />)}
            {/* 운영정책 서브메뉴 */}
            <button onClick={() => setActiveMenu(activeMenu.startsWith("policy") ? "dashboard" : "policy-terms")} className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${activeMenu.startsWith("policy") ? "bg-primary text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              <div className="flex items-center gap-3"><Shield className={`h-4 w-4 ${activeMenu.startsWith("policy") ? "text-white" : "text-slate-400"}`} />운영정책</div>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform opacity-50 ${activeMenu.startsWith("policy") ? "rotate-90 text-white" : ""}`} />
            </button>
            {activeMenu.startsWith("policy") && (
              <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-primary/30 pl-3">
                {[{ key: "policy-terms", label: "Terms of Service" }, { key: "policy-privacy", label: "Privacy Policy" }, { key: "policy-settings", label: "Privacy Settings" }].map(sub => (
                  <button key={sub.key} onClick={() => setActiveMenu(sub.key)} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left w-full ${activeMenu === sub.key ? "text-primary font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeMenu === sub.key ? "bg-primary" : "bg-slate-300"}`} />{sub.label}
                  </button>
                ))}
              </div>
            )}
          </nav>
          <div className="p-3 border-t border-slate-200 dark:border-slate-700">
            <button onClick={handleAdminLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
              <LogOut className="h-4 w-4" />로그아웃
            </button>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-4 sm:px-6 py-8 overflow-auto">
          {activeMenu === "dashboard" && <DashboardSection adminClient={adminClient} />}
          {activeMenu === "members" && <MembersSection adminClient={adminClient} />}
          {activeMenu === "game" && <GameSection adminClient={adminClient} />}
          {activeMenu === "main-banner" && <BannerSection adminClient={adminClient} />}
          {activeMenu === "news" && <NewsSection adminClient={adminClient} />}
          {activeMenu === "media" && <MediaSection adminClient={adminClient} />}
          {activeMenu === "products" && <ProductsSection adminClient={adminClient} />}
          {activeMenu === "shop" && <ShopSection adminClient={adminClient} />}
          {activeMenu === "payments" && <PaymentsSection adminClient={adminClient} />}
          {activeMenu === "stats" && <StatsSection adminClient={adminClient} />}
          {activeMenu === "coupons" && <CouponSystemSection adminClient={adminClient} />}
          {activeMenu === "admin-accounts" && <AdminAccountsSection adminClient={adminClient} />}
          {activeMenu.startsWith("policy") && <PolicySection activeMenu={activeMenu} />}
        </main>
      </div>

      {/* 비밀번호 변경 다이얼로그 */}
      <Dialog open={showChangePw} onOpenChange={setShowChangePw}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Password 변경</DialogTitle><DialogDescription>{adminLoggedIn} 계정의 비밀번호를 변경합니다.</DialogDescription></DialogHeader>
          <form onSubmit={handleChangePw} className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">현재 비밀번호</label>
              <Input type="password" placeholder="" value={currentPw} onChange={e => { setCurrentPw(e.target.value); setChangePwError(""); }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">새 Password</label>
              <Input type="password" placeholder="새 비밀번호 (4자 이상)" value={newPw} onChange={e => { setNewPw(e.target.value); setChangePwError(""); }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">비밀번호 확인</label>
              <Input type="password" placeholder="비밀번호 다시 입력" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setChangePwError(""); }} />
            </div>
            {changePwError && <p className="text-sm text-destructive">{changePwError}</p>}
            <div className="flex gap-2 mt-2">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">변경</Button>
              <Button type="button" variant="outline" onClick={() => { setShowChangePw(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setChangePwError(""); }}>취소</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
