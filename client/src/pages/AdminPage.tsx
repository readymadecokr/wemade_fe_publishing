import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../../server/routers";
import {
  Activity, BarChart2, ChevronLeft, ChevronRight, CreditCard, Eye, Gamepad2,
  Image, Link, LogOut, Pencil, Plus, RefreshCw, Search, Shield, ShoppingCart,
  Tag, Trash2, ToggleLeft, ToggleRight, UserCheck, UserCog, Users, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  return new Date(d).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
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
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button variant="outline" size="sm" onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
      <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
      <Button variant="outline" size="sm" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
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
type UserRow = { id: number; openId: string; name: string | null; email: string | null; loginMethod: string | null; role: "user" | "admin"; status?: string; suspendedUntil?: Date | null; suspendReason?: string | null; createdAt: Date; updatedAt: Date; lastSignedIn: Date };

function MembersSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("createdAt"); const [sortOrder, setSortOrder] = useState("desc");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState<{ name: string } | null>(null);
  const [suspendForm, setSuspendForm] = useState<{ status: string; reason: string; until: string } | null>(null);
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-members", search, page, pageSize, sortBy, sortOrder, roleFilter],
    queryFn: () => adminClient!.admin.listUsers.query({ page, pageSize, search, sortBy: sortBy as any, sortOrder: sortOrder as any, roleFilter: roleFilter as any }),
    enabled: !!adminClient,
  });

  const updateNickMutation = useMutation({
    mutationFn: (input: { userId: number; name: string }) => adminClient!.memberAdmin.updateNickname.mutate(input),
    onSuccess: () => { toast.success("닉네임이 수정되었습니다."); setEditForm(null); setSelectedUser(null); refetch(); },
    onError: (e: Error) => toast.error(`실패: ${e.message}`),
  });
  const suspendMutation = useMutation({
    mutationFn: (input: any) => adminClient!.memberAdmin.suspend.mutate(input),
    onSuccess: () => { toast.success("제재 처리되었습니다."); setSuspendForm(null); setSelectedUser(null); refetch(); },
    onError: (e: Error) => toast.error(`실패: ${e.message}`),
  });

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <SectionHeader title="회원 관리" desc="가입 회원 목록 조회, 정보 수정, 제재 처리" action={<Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1" />새로고침</Button>} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setPage(1); }} placeholder="닉네임, Open ID 검색..." />
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
                <SelectTrigger className="w-28 h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 역할</SelectItem>
                  <SelectItem value="user">일반 회원</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                </SelectContent>
              </Select>
              <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-20 h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}개씩</SelectItem>)}
                </SelectContent>
              </Select>
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
                    <th className="text-left p-2">Nickname</th>
                    <th className="text-left p-2">Provider</th>
                    <th className="text-left p-2">Registration Date</th>
                    <th className="text-left p-2">Last Activity</th>
                    <th className="text-left p-2">상태</th>
                    <th className="text-left p-2">처리</th>
                  </tr></thead>
                  <tbody>
                    {(data?.data ?? []).map((u: UserRow) => (
                      <tr key={u.id} className="border-b hover:bg-accent/20 cursor-pointer" onClick={() => setSelectedUser(u)}>
                        <td className="p-2 font-medium">{u.name ?? "-"}</td>
                        <td className="p-2 text-xs text-muted-foreground">{u.loginMethod ?? "-"}</td>
                        <td className="p-2 text-xs text-muted-foreground">{fmt(u.createdAt)}</td>
                        <td className="p-2 text-xs text-muted-foreground">{fmt(u.lastSignedIn)}</td>
                        <td className="p-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${(u as any).status === "suspended" ? "bg-orange-100 text-orange-700" : (u as any).status === "banned" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {(u as any).status === "suspended" ? "정지" : (u as any).status === "banned" ? "차단" : "정상"}
                          </span>
                        </td>
                        <td className="p-2" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setSelectedUser(u); setEditForm({ name: u.name ?? "" }); }}>수정</Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-orange-500" onClick={() => { setSelectedUser(u); setSuspendForm({ status: "suspended", reason: "", until: "" }); }}>제재</Button>
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
      <Dialog open={!!selectedUser && !editForm && !suspendForm} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>회원 정보 조회</DialogTitle>
            <DialogDescription>회원 상세 정보를 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3 text-sm">
              {[["ID", selectedUser.id], ["Open ID", selectedUser.openId], ["Nickname", selectedUser.name ?? "-"], ["Provider", selectedUser.loginMethod ?? "-"], ["가입일", fmt(selectedUser.createdAt)], ["마지막 로그인", fmt(selectedUser.lastSignedIn)], ["상태", (selectedUser as any).status ?? "active"]].map(([k, v]) => (
                <div key={String(k)} className="grid grid-cols-3 gap-2"><span className="text-muted-foreground font-medium">{k}</span><span className="col-span-2 font-mono break-all">{String(v)}</span></div>
              ))}
              {(selectedUser as any).suspendReason && <div className="grid grid-cols-3 gap-2"><span className="text-muted-foreground font-medium">제재 사유</span><span className="col-span-2">{(selectedUser as any).suspendReason}</span></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditForm({ name: selectedUser?.name ?? "" }); }}>정보 수정</Button>
            <Button variant="outline" className="text-orange-500" onClick={() => setSuspendForm({ status: "suspended", reason: "", until: "" })}>제재</Button>
            <Button variant="ghost" onClick={() => setSelectedUser(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 닉네임 수정 모달 */}
      <Dialog open={!!editForm} onOpenChange={() => { setEditForm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>회원 정보 수정</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">닉네임</label>
              <Input value={editForm?.name ?? ""} onChange={e => setEditForm(f => f && ({ ...f, name: e.target.value }))} placeholder="새 닉네임" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { if (selectedUser && editForm) updateNickMutation.mutate({ userId: selectedUser.id, name: editForm.name }); }} disabled={updateNickMutation.isPending}>저장</Button>
            <Button variant="ghost" onClick={() => setEditForm(null)}>취소</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 제재 모달 */}
      <Dialog open={!!suspendForm} onOpenChange={() => setSuspendForm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>회원 제재</DialogTitle><DialogDescription>{selectedUser?.name} 회원에 대한 제재를 처리합니다.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">제재 유형</label>
              <Select value={suspendForm?.status ?? "suspended"} onValueChange={v => setSuspendForm(f => f && ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">제재 해제 (정상)</SelectItem>
                  <SelectItem value="suspended">일시 정지</SelectItem>
                  <SelectItem value="banned">영구 차단</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {suspendForm?.status === "suspended" && (
              <div className="space-y-1">
                <label className="text-sm font-medium">정지 해제일 (선택)</label>
                <Input type="datetime-local" value={suspendForm.until} onChange={e => setSuspendForm(f => f && ({ ...f, until: e.target.value }))} />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium">사유</label>
              <Input value={suspendForm?.reason ?? ""} onChange={e => setSuspendForm(f => f && ({ ...f, reason: e.target.value }))} placeholder="제재 사유 입력" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { if (selectedUser && suspendForm) suspendMutation.mutate({ userId: selectedUser.id, status: suspendForm.status as any, suspendedUntil: suspendForm.until || undefined, reason: suspendForm.reason || undefined }); }} disabled={suspendMutation.isPending}>처리</Button>
            <Button variant="ghost" onClick={() => setSuspendForm(null)}>취소</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── GAME SECTION ─────────────────────────────────────────────────────────────
type GameForm = { id?: number; name: string; description: string; imageUrl: string; genre: string; platform: string; status: "active" | "beta" | "maintenance" | "inactive"; sortOrder: number };

function GameSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<GameForm | null>(null);

  const { data, refetch } = useQuery({ queryKey: ["admin-games", search, page], queryFn: () => adminClient!.games.list.query({ search, page, pageSize: 20 }), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.games.create.mutate(input), onSuccess: () => { toast.success("게임이 등록되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.games.update.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.games.delete.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const empty: GameForm = { name: "", description: "", imageUrl: "", genre: "", platform: "", status: "active", sortOrder: 0 };
  const submit = () => { if (!form?.name) { toast.error("게임명을 입력하세요."); return; } form.id ? updateM.mutate(form) : createM.mutate(form); };

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "게임 수정" : "게임 등록") : "Game 관리"} desc="서비스에서 제공할 게임 정보를 관리합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />게임 등록</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

      {!form ? (
        <Card>
          <CardHeader className="pb-3">
            <SearchBar value={searchInput} onChange={setSearchInput} onSearch={() => { setSearch(searchInput); setPage(1); }} placeholder="게임명 검색..." />
          </CardHeader>
          <CardContent>
            {!data?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 게임이 없습니다.</div> : (
              <div className="space-y-2">
                {data.items.map((g: any) => (
                  <div key={g.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 cursor-pointer" onClick={() => setForm({ id: g.id, name: g.name, description: g.description ?? "", imageUrl: g.imageUrl ?? "", genre: g.genre ?? "", platform: g.platform ?? "", status: g.status, sortOrder: g.sortOrder })}>
                    {g.imageUrl && <img src={g.imageUrl} alt={g.name} className="w-16 h-10 object-cover rounded shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{g.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {g.genre && <span className="text-xs text-muted-foreground">{g.genre}</span>}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${g.status === "active" ? "bg-green-100 text-green-700" : g.status === "beta" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{g.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setForm({ id: g.id, name: g.name, description: g.description ?? "", imageUrl: g.imageUrl ?? "", genre: g.genre ?? "", platform: g.platform ?? "", status: g.status, sortOrder: g.sortOrder })}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${g.name}" 게임을 삭제하시겠습니까?`)) deleteM.mutate(g.id); }}><Trash2 className="h-4 w-4" /></Button>
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
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">게임명 *</label><Input value={form.name} onChange={e => setForm(f => f && ({ ...f, name: e.target.value }))} placeholder="게임명" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">장르</label><Input value={form.genre} onChange={e => setForm(f => f && ({ ...f, genre: e.target.value }))} placeholder="Fantasy MMORPG" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">플랫폼</label><Input value={form.platform} onChange={e => setForm(f => f && ({ ...f, platform: e.target.value }))} placeholder="Web Browser" /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">소개</label><textarea className="w-full border rounded-md p-2 text-sm min-h-[80px]" value={form.description} onChange={e => setForm(f => f && ({ ...f, description: e.target.value }))} placeholder="게임 소개" /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">이미지 URL</label><Input value={form.imageUrl} onChange={e => setForm(f => f && ({ ...f, imageUrl: e.target.value }))} placeholder="/manus-storage/..." /></div>
            <div className="space-y-1"><label className="text-sm font-medium">상태</label>
              <Select value={form.status} onValueChange={v => setForm(f => f && ({ ...f, status: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
type BannerRow = { id: number; title: string; imageUrl: string; imageKey: string | null; actionType: "url" | "content"; actionUrl: string | null; contentTitle: string | null; contentDate: string | null; contentBody: string | null; sortOrder: number; isActive: number; createdAt: Date; updatedAt: Date };
type BannerForm = { id?: number; title: string; imageUrl: string; actionType: "url" | "content"; actionUrl: string; contentTitle: string; contentDate: string; contentBody: string; sortOrder: number; isActive: number };

function BannerSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [form, setForm] = useState<BannerForm | null>(null);
  const [preview, setPreview] = useState<BannerRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);

  const { data, refetch } = useQuery({ queryKey: ["admin-banners"], queryFn: () => adminClient!.admin.listBanners.query(), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.admin.createBanner.mutate(input), onSuccess: () => { toast.success("배너가 등록되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.admin.updateBanner.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.admin.deleteBanner.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const empty: BannerForm = { title: "", imageUrl: "", actionType: "url", actionUrl: "", contentTitle: "", contentDate: "", contentBody: "", sortOrder: (data?.length ?? 0), isActive: 1 };
  const submit = () => {
    if (!form?.title || !form?.imageUrl) { toast.error("제목과 이미지를 입력하세요."); return; }
    const p = { title: form.title, imageUrl: form.imageUrl, actionType: form.actionType, actionUrl: form.actionUrl || undefined, contentTitle: form.contentTitle || undefined, contentDate: form.contentDate || undefined, contentBody: form.contentBody || undefined, sortOrder: form.sortOrder, isActive: form.isActive };
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

  const filtered = (data ?? []).filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <SectionHeader title={form ? (form.id ? "배너 수정" : "배너 등록") : "Main Banner 관리"} desc="메인 화면 캐러셀 배너를 관리합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />배너 등록</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

      {!form ? (
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
          <CardContent>
            {!paged.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 배너가 없습니다.</div> : (
              <div className="space-y-2">
                {paged.map(b => (
                  <div key={b.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 cursor-pointer" onClick={() => setForm({ id: b.id, title: b.title, imageUrl: b.imageUrl, actionType: b.actionType, actionUrl: b.actionUrl ?? "", contentTitle: b.contentTitle ?? "", contentDate: b.contentDate ?? "", contentBody: b.contentBody ?? "", sortOrder: b.sortOrder, isActive: b.isActive })}>
                    <span className="text-xs text-muted-foreground w-5 text-center">{b.sortOrder + 1}</span>
                    <div className="w-24 h-14 rounded overflow-hidden bg-slate-100 shrink-0"><img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{b.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-blue-600">{b.actionType === "url" ? "URL 연결" : "콘텐츠"}</span>
                        <StatusBadge active={b.isActive} />
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setPreview(b)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setForm({ id: b.id, title: b.title, imageUrl: b.imageUrl, actionType: b.actionType, actionUrl: b.actionUrl ?? "", contentTitle: b.contentTitle ?? "", contentDate: b.contentDate ?? "", contentBody: b.contentBody ?? "", sortOrder: b.sortOrder, isActive: b.isActive })}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${b.title}" 배너를 삭제하시겠습니까?`)) deleteM.mutate(b.id); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                <Pagination page={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="space-y-1"><label className="text-sm font-medium">배너 제목 *</label><Input value={form.title} onChange={e => setForm(f => f && ({ ...f, title: e.target.value }))} placeholder="배너 제목" /></div>
          <div className="space-y-1">
            <label className="text-sm font-medium">이미지 등록 *</label>
            <div className="flex gap-2"><Input value={form.imageUrl} onChange={e => setForm(f => f && ({ ...f, imageUrl: e.target.value }))} placeholder="/manus-storage/..." className="flex-1" /><Button type="button" variant="outline" onClick={handleFileSelect} disabled={uploading}>{uploading ? "업로드 중..." : "PC에서 찾아보기"}</Button></div>
            <p className="text-xs text-muted-foreground">권장: 1900×600px | 500KB 미만 | JPG, WebP, PNG</p>
            {form.imageUrl && <div className="rounded overflow-hidden border bg-slate-100" style={{ aspectRatio: "1900/600" }}><img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" /></div>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">클릭 시 동작</label>
            <div className="flex gap-4">
              {(["url", "content"] as const).map(t => <label key={t} className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={form.actionType === t} onChange={() => setForm(f => f && ({ ...f, actionType: t }))} /><span className="text-sm">{t === "url" ? "URL 이동" : "콘텐츠 표시"}</span></label>)}
            </div>
          </div>
          {form.actionType === "url" && <div className="space-y-1"><label className="text-sm font-medium">이동 URL</label><Input value={form.actionUrl} onChange={e => setForm(f => f && ({ ...f, actionUrl: e.target.value }))} placeholder="https://..." /></div>}
          {form.actionType === "content" && (
            <div className="space-y-3">
              <div className="space-y-1"><label className="text-sm font-medium">제목</label><Input value={form.contentTitle} onChange={e => setForm(f => f && ({ ...f, contentTitle: e.target.value }))} /></div>
              <div className="space-y-1"><label className="text-sm font-medium">날짜</label><Input value={form.contentDate} onChange={e => setForm(f => f && ({ ...f, contentDate: e.target.value }))} placeholder="2026-07-01" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">내용</label><textarea className="w-full border rounded-md p-2 text-sm min-h-[80px]" value={form.contentBody} onChange={e => setForm(f => f && ({ ...f, contentBody: e.target.value }))} /></div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">순서</label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => f && ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
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
type NewsForm = { id?: number; title: string; category: string; summary: string; content: string; imageUrl: string; isActive: number; publishedAt: string };

function NewsSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [search, setSearch] = useState(""); const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<NewsForm | null>(null);

  const { data, refetch } = useQuery({ queryKey: ["admin-news", search, page], queryFn: () => adminClient!.news.list.query({ search, page, pageSize: 20 }), enabled: !!adminClient });
  const createM = useMutation({ mutationFn: (input: any) => adminClient!.news.create.mutate(input), onSuccess: () => { toast.success("등록되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const updateM = useMutation({ mutationFn: (input: any) => adminClient!.news.update.mutate(input), onSuccess: () => { toast.success("수정되었습니다."); setForm(null); refetch(); }, onError: (e: Error) => toast.error(e.message) });
  const deleteM = useMutation({ mutationFn: (id: number) => adminClient!.news.delete.mutate({ id }), onSuccess: () => { toast.success("삭제되었습니다."); refetch(); }, onError: (e: Error) => toast.error(e.message) });

  const empty: NewsForm = { title: "", category: "Update", summary: "", content: "", imageUrl: "", isActive: 1, publishedAt: new Date().toISOString().slice(0, 10) };
  const submit = () => {
    if (!form?.title) { toast.error("제목을 입력하세요."); return; }
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
          <CardContent>
            {!data?.items?.length ? <div className="text-center py-8 text-muted-foreground text-sm">등록된 뉴스가 없습니다.</div> : (
              <div className="space-y-2">
                {data.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 cursor-pointer" onClick={() => setForm({ id: item.id, title: item.title, category: item.category, summary: item.summary ?? "", content: item.content ?? "", imageUrl: item.imageUrl ?? "", isActive: item.isActive, publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : "" })}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                        <StatusBadge active={item.isActive} />
                        <span className="text-xs text-muted-foreground">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setForm({ id: item.id, title: item.title, category: item.category, summary: item.summary ?? "", content: item.content ?? "", imageUrl: item.imageUrl ?? "", isActive: item.isActive, publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : "" })}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${item.title}" 뉴스를 삭제하시겠습니까?`)) deleteM.mutate(item.id); }}><Trash2 className="h-4 w-4" /></Button>
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
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">제목 *</label><Input value={form.title} onChange={e => setForm(f => f && ({ ...f, title: e.target.value }))} placeholder="뉴스 제목" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">카테고리</label><Input value={form.category} onChange={e => setForm(f => f && ({ ...f, category: e.target.value }))} placeholder="Update / Event / Interview" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">발행일</label><Input type="date" value={form.publishedAt} onChange={e => setForm(f => f && ({ ...f, publishedAt: e.target.value }))} /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">요약</label><Input value={form.summary} onChange={e => setForm(f => f && ({ ...f, summary: e.target.value }))} placeholder="짧은 요약 (선택)" /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">본문</label><textarea className="w-full border rounded-md p-2 text-sm min-h-[120px]" value={form.content} onChange={e => setForm(f => f && ({ ...f, content: e.target.value }))} placeholder="뉴스 본문" /></div>
            <div className="space-y-1 col-span-2"><label className="text-sm font-medium">이미지 URL</label><Input value={form.imageUrl} onChange={e => setForm(f => f && ({ ...f, imageUrl: e.target.value }))} placeholder="/manus-storage/..." /></div>
            <div className="space-y-1"><label className="text-sm font-medium">활성 상태</label><div className="h-10 flex items-center"><ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} /></div></div>
          </div>
          <div className="flex gap-2 pt-2"><Button onClick={submit} disabled={createM.isPending || updateM.isPending}>{form.id ? "수정 저장" : "뉴스 등록"}</Button><Button variant="outline" onClick={() => setForm(null)}>취소</Button></div>
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
      <SectionHeader title={form ? (form.id ? "동영상 수정" : "동영상 등록") : "Media 관리"} desc="YouTube 영상 링크를 등록·수정합니다."
        action={!form ? <Button onClick={() => setForm(empty)}><Plus className="h-4 w-4 mr-2" />동영상 등록</Button> : <Button variant="outline" onClick={() => setForm(null)}><ChevronLeft className="h-4 w-4 mr-1" />목록으로</Button>} />

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
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${item.title}" 동영상을 삭제하시겠습니까?`)) deleteM.mutate(item.id); }}><Trash2 className="h-4 w-4" /></Button>
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

// ─── STATS SECTION ────────────────────────────────────────────────────────────
function StatsSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const [activeEvent, setActiveEvent] = useState("signup");
  const eventTypes = [
    { key: "signup", label: "회원가입" }, { key: "login", label: "로그인" }, { key: "logout", label: "로그아웃" },
    { key: "withdraw", label: "회원탈퇴" }, { key: "game_start", label: "게임실행" }, { key: "page_visit", label: "페이지 방문" },
    { key: "purchase", label: "구매" }, { key: "refund", label: "환불" },
  ];
  const { data: totalData } = useQuery({ queryKey: ["admin-stats-total"], queryFn: () => adminClient!.stats.totalByType.query(), enabled: !!adminClient });
  const { data: chartData } = useQuery({ queryKey: ["admin-stats-chart", activeEvent], queryFn: () => adminClient!.stats.summary.query({ eventType: activeEvent }), enabled: !!adminClient });
  const getTotal = (type: string) => Number(totalData?.find((d: any) => d.eventType === type)?.count ?? 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="통계" desc="수집된 이벤트 데이터를 기간별로 조회합니다." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {eventTypes.map(({ key, label }) => (
          <Card key={key} className={`cursor-pointer transition-all ${activeEvent === key ? "ring-2 ring-primary" : "hover:shadow-md"}`} onClick={() => setActiveEvent(key)}>
            <CardContent className="pt-4 pb-3"><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-bold mt-1">{getTotal(key).toLocaleString()}</p></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">{eventTypes.find(e => e.key === activeEvent)?.label} 일별 현황</CardTitle></CardHeader>
        <CardContent>
          {!chartData?.length ? <div className="text-center py-8 text-muted-foreground text-sm">데이터가 없습니다.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground"><th className="text-left p-2">날짜</th><th className="text-right p-2">건수</th></tr></thead>
                <tbody>{chartData.map((row: any, i: number) => <tr key={i} className="border-b hover:bg-accent/20"><td className="p-2">{row.date}</td><td className="p-2 text-right font-mono">{Number(row.count).toLocaleString()}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
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
                <thead><tr className="border-b text-muted-foreground text-xs"><th className="text-left p-2">ID</th><th className="text-left p-2">아이디</th><th className="text-left p-2">이름</th><th className="text-left p-2">상태</th><th className="text-left p-2">마지막 로그인</th><th className="text-left p-2">등록일</th><th className="text-left p-2">처리</th></tr></thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-accent/20">
                      <td className="p-2">{item.id}</td>
                      <td className="p-2 font-medium">{item.username}</td>
                      <td className="p-2">{item.displayName ?? "-"}</td>
                      <td className="p-2"><StatusBadge active={item.isActive} /></td>
                      <td className="p-2 text-xs text-muted-foreground">{fmt(item.lastLoginAt)}</td>
                      <td className="p-2 text-xs text-muted-foreground">{fmt(item.createdAt)}</td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setForm({ id: item.id, username: item.username, password: "", displayName: item.displayName ?? "", permissions: item.permissions ?? "", isActive: item.isActive })}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`"${item.username}" 관리자를 삭제하시겠습니까?`)) deleteM.mutate(item.id); }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent></Card>
      ) : (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">아이디 *</label><Input value={form.username} onChange={e => setForm(f => f && ({ ...f, username: e.target.value }))} disabled={!!form.id} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">{form.id ? "새 비밀번호 (변경 시만)" : "비밀번호 *"}</label><Input type="password" value={form.password} onChange={e => setForm(f => f && ({ ...f, password: e.target.value }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">표시 이름</label><Input value={form.displayName} onChange={e => setForm(f => f && ({ ...f, displayName: e.target.value }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">권한 (JSON)</label><Input value={form.permissions} onChange={e => setForm(f => f && ({ ...f, permissions: e.target.value }))} placeholder='["dashboard"]' /></div>
            {form.id && <div className="space-y-1"><label className="text-sm font-medium">활성 상태</label><div className="h-10 flex items-center"><ToggleBtn value={form.isActive} onChange={v => setForm(f => f && ({ ...f, isActive: v }))} /></div></div>}
          </div>
          <div className="flex gap-2 pt-2"><Button onClick={submit} disabled={createM.isPending || updateM.isPending}>{form.id ? "수정 저장" : "관리자 생성"}</Button><Button variant="outline" onClick={() => setForm(null)}>취소</Button></div>
        </CardContent></Card>
      )}
    </div>
  );
}

// ─── POLICY SECTION ───────────────────────────────────────────────────────────
function PolicySection({ activeMenu }: { activeMenu: string }) {
  const map: Record<string, { title: string; url: string; desc: string }> = {
    "policy-terms": { title: "Terms of Service", url: "/terms-of-service", desc: "서비스 이용약관 내용을 수정합니다. 변경 사항은 Terms of Service 페이지에 즉시 반영됩니다." },
    "policy-privacy": { title: "Privacy Policy", url: "/privacy-policy", desc: "개인정보 처리방침 내용을 수정합니다. 변경 사항은 Privacy Policy 페이지에 즉시 반영됩니다." },
    "policy-settings": { title: "Privacy Settings", url: "/", desc: "Privacy Settings 팝업 내용을 수정합니다." },
  };
  const cur = map[activeMenu]; if (!cur) return null;
  return (
    <div className="space-y-6">
      <SectionHeader title={cur.title} desc={cur.desc} />
      <Card><CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4 py-8">
          <Shield className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground text-sm text-center">정책 페이지 내용은 개발자가 소스 코드에서 직접 수정합니다.<br />아래 버튼을 클릭하면 해당 페이지를 미리볼 수 있습니다.</p>
          <a href={cur.url} target="_blank" rel="noopener noreferrer"><Button variant="outline"><Eye className="h-4 w-4 mr-2" />{cur.title} 페이지 보기</Button></a>
        </div>
      </CardContent></Card>
    </div>
  );
}

// ─── DASHBOARD SECTION ────────────────────────────────────────────────────────
function DashboardSection({ adminClient }: { adminClient: ReturnType<typeof createAdminClient> | null }) {
  const { data: stats } = useQuery({ queryKey: ["admin-stats-kpi"], queryFn: () => adminClient!.admin.stats.query(), enabled: !!adminClient });
  const kpis = [
    { title: "전체 회원", value: stats?.total, color: "bg-blue-500", icon: Users },
    { title: "관리자", value: stats?.admins, color: "bg-amber-500", icon: Shield },
    { title: "오늘 가입", value: stats?.newToday, color: "bg-green-500", icon: UserCheck },
    { title: "30일 활성", value: stats?.activeMonth, color: "bg-purple-500", icon: Activity },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" desc="서비스 핵심 성과 지표(KPI)를 확인합니다." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(({ title, value, color, icon: Icon }) => (
          <Card key={title}><CardContent className="flex items-center gap-4 p-6">
            <div className={`p-3 rounded-xl ${color}`}><Icon className="h-6 w-6 text-white" /></div>
            <div><p className="text-sm text-muted-foreground">{title}</p><p className="text-2xl font-bold">{value === undefined ? <span className="text-base text-muted-foreground">-</span> : value.toLocaleString()}</p></div>
          </CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />최근 가입 회원</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">회원 관리 메뉴에서 전체 회원 목록을 확인하세요.</p></CardContent>
      </Card>
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
  const [newPw, setNewPw] = useState(""); const [confirmPw, setConfirmPw] = useState(""); const [changePwError, setChangePwError] = useState("");
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
    if (!newPw.trim()) { setChangePwError("새 비밀번호를 입력해 주세요."); return; }
    if (newPw !== confirmPw) { setChangePwError("비밀번호가 일치하지 않습니다."); return; }
    if (newPw.length < 4) { setChangePwError("비밀번호는 4자 이상이어야 합니다."); return; }
    localStorage.setItem(`admin_pw_${adminLoggedIn}`, newPw);
    setChangePwError(""); setNewPw(""); setConfirmPw(""); setShowChangePw(false);
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
    { key: "news", label: "News", icon: Search },
    { key: "media", label: "Media", icon: UserCheck },
    { key: "products", label: "인앱상품", icon: ShoppingCart },
    { key: "payments", label: "결제", icon: CreditCard },
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
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-7 w-7"><AvatarFallback className="text-xs bg-primary/10 text-primary">{adminLoggedIn?.charAt(0).toUpperCase() ?? "A"}</AvatarFallback></Avatar>
              <span className="font-medium text-foreground">{adminLoggedIn}</span>
              <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">관리자</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowChangePw(true)} className="text-muted-foreground text-xs">PW 변경</Button>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")} className="text-muted-foreground">홈으로</Button>
            <Button variant="ghost" size="sm" onClick={handleAdminLogout} className="text-muted-foreground"><LogOut className="h-4 w-4" /></Button>
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
          {activeMenu === "payments" && <PaymentsSection adminClient={adminClient} />}
          {activeMenu === "stats" && <StatsSection adminClient={adminClient} />}
          {activeMenu === "coupons" && <CouponsSection adminClient={adminClient} />}
          {activeMenu === "admin-accounts" && <AdminAccountsSection adminClient={adminClient} />}
          {activeMenu.startsWith("policy") && <PolicySection activeMenu={activeMenu} />}
        </main>
      </div>

      {/* 비밀번호 변경 다이얼로그 */}
      <Dialog open={showChangePw} onOpenChange={setShowChangePw}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Password 변경</DialogTitle><DialogDescription>{adminLoggedIn} 계정의 비밀번호를 변경합니다.</DialogDescription></DialogHeader>
          <form onSubmit={handleChangePw} className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1"><label className="text-sm font-medium">새 Password</label><Input type="password" placeholder="새 비밀번호 (4자 이상)" value={newPw} onChange={e => setNewPw(e.target.value)} /></div>
            <div className="flex flex-col gap-1"><label className="text-sm font-medium">비밀번호 확인</label><Input type="password" placeholder="비밀번호 다시 입력" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} /></div>
            {changePwError && <p className="text-sm text-destructive">{changePwError}</p>}
            <div className="flex gap-2 mt-2"><Button type="submit">변경</Button><Button type="button" variant="ghost" onClick={() => { setShowChangePw(false); setNewPw(""); setConfirmPw(""); setChangePwError(""); }}>취소</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
