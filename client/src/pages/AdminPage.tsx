import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../../server/routers";

// AdminPage 전용 직접 API 호출 함수 (x-admin-key 헤더 주입)
function createAdminClient(adminKey: string) {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "/api/trpc",
        transformer: superjson,
        headers: () => ({ "x-admin-key": adminKey }),
        fetch(input, init) {
          return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
        },
      }),
    ],
  });
}
import {
  Activity,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Image,
  Link,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  ToggleLeft,
  ToggleRight,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type SortBy = "id" | "name" | "email" | "createdAt" | "lastSignedIn" | "role";
type SortOrder = "asc" | "desc";
type RoleFilter = "all" | "user" | "admin";

type BannerRow = {
  id: number;
  title: string;
  imageUrl: string;
  imageKey: string | null;
  actionType: "url" | "content";
  actionUrl: string | null;
  contentTitle: string | null;
  contentDate: string | null;
  contentBody: string | null;
  sortOrder: number;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
};

type UserRow = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">
            {value === undefined ? (
              <span className="text-muted-foreground text-base">로딩 중...</span>
            ) : (
              value.toLocaleString()
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function UserDetailModal({
  user,
  open,
  onClose,
  onRoleChange,
}: {
  user: UserRow | null;
  open: boolean;
  onClose: () => void;
  onRoleChange: (id: number, role: "user" | "admin") => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.name?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{user.name ?? "-"}</div>
              <div className="text-sm text-muted-foreground font-normal">{user.loginMethod ?? "-"}</div>
            </div>
          </DialogTitle>
          <DialogDescription>회원 상세 정보</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium">ID</span>
            <span className="col-span-2 font-mono">{user.id}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium">Open ID</span>
            <span className="col-span-2 font-mono text-xs break-all">{user.openId}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium">로그인 방식</span>
            <span className="col-span-2">{user.loginMethod ?? "-"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium">가입일</span>
            <span className="col-span-2">{formatDate(user.createdAt)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium">마지막 로그인</span>
            <span className="col-span-2">{formatDate(user.lastSignedIn)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium">정보 수정일</span>
            <span className="col-span-2">{formatDate(user.updatedAt)}</span>
          </div>

          {/* Terms Agreement */}
          <div className="border-t pt-3 mt-1">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Terms Agreement</p>
            <div className="flex flex-col gap-1.5">
              {[
                "Terms of Service",
                "Privacy Policy",
                "Age Verification",
              ].map((term) => (
                <div key={term} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{term}</span>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Agreed</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPage() {
  const { user, loading, logout } = useAuth();

  // 하드코딩 관리자 계정 (기본 PW, 변경 시 localStorage에 저장)
  const ADMIN_ACCOUNTS: Record<string, string> = {
    cyanima: localStorage.getItem("admin_pw_cyanima") ?? "0000",
    blue0246: localStorage.getItem("admin_pw_blue0246") ?? "0000",
  };

  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState<string | null>(
    () => sessionStorage.getItem("admin_session")
  );

  // 비밀번호 변경 상태
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [changePwError, setChangePwError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !adminPw.trim()) {
      setAdminLoginError("ID와 Password를 입력해 주세요.");
      return;
    }
    const storedPw = localStorage.getItem(`admin_pw_${adminId}`) ?? (adminId === "cyanima" || adminId === "blue0246" ? "0000" : null);
    if (!storedPw || adminPw !== storedPw) {
      setAdminLoginError("ID 또는 Password가 올바르지 않습니다.");
      return;
    }
    setAdminLoginError("");
    sessionStorage.setItem("admin_session", adminId);
    setAdminLoggedIn(adminId);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("admin_session");
    setAdminLoggedIn(null);
    setAdminId("");
    setAdminPw("");
  };

  const handleChangePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw.trim()) { setChangePwError("새 비밀번호를 입력해 주세요."); return; }
    if (newPw !== confirmPw) { setChangePwError("비밀번호가 일치하지 않습니다."); return; }
    if (newPw.length < 4) { setChangePwError("비밀번호는 4자 이상이어야 합니다."); return; }
    localStorage.setItem(`admin_pw_${adminLoggedIn}`, newPw);
    setChangePwError("");
    setNewPw("");
    setConfirmPw("");
    setShowChangePw(false);
    toast.success("비밀번호가 변경되었습니다.");
  };

  // 사이드바 메뉴 상태
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // 배너 관리 상태
  const [bannerForm, setBannerForm] = useState<{
    id?: number;
    title: string;
    imageUrl: string;
    actionType: "url" | "content";
    actionUrl: string;
    contentTitle: string;
    contentDate: string;
    contentBody: string;
    sortOrder: number;
    isActive: number;
  } | null>(null);
  const [bannerPreview, setBannerPreview] = useState<BannerRow | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerSearch, setBannerSearch] = useState("");
  const [bannerSearchInput, setBannerSearchInput] = useState("");
  const [bannerPageSize, setBannerPageSize] = useState(10);
  const [bannerPage, setBannerPage] = useState(1);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // adminLoggedIn 기반 adminClient 생성
  const adminKey = adminLoggedIn
    ? `${adminLoggedIn}:${localStorage.getItem(`admin_pw_${adminLoggedIn}`) ?? "0000"}`
    : "";
  const adminClient = useMemo(() => adminKey ? createAdminClient(adminKey) : null, [adminKey]);
  const qc = useQueryClient();

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["admin", "stats", adminKey],
    queryFn: () => adminClient!.admin.stats.query(),
    enabled: !!adminClient,
    retry: false,
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["admin", "listUsers", adminKey, page, pageSize, search, sortBy, sortOrder, roleFilter],
    queryFn: () => adminClient!.admin.listUsers.query({ page, pageSize, search, sortBy, sortOrder, roleFilter }),
    enabled: !!adminClient,
    retry: false,
  });

  // 배너 목록 query
  const { data: bannersData, refetch: refetchBanners } = useQuery({
    queryKey: ["admin", "listBanners", adminKey],
    queryFn: () => adminClient!.admin.listBanners.query(),
    enabled: !!adminClient,
    retry: false,
  });

  const createBannerMutation = useMutation({
    mutationFn: (input: { title: string; imageUrl: string; actionType: "url" | "content"; actionUrl?: string; contentTitle?: string; contentDate?: string; contentBody?: string; sortOrder?: number; isActive?: number; }) =>
      adminClient!.admin.createBanner.mutate(input),
    onSuccess: () => { toast.success("배너가 등록되었습니다."); qc.invalidateQueries({ queryKey: ["admin", "listBanners"] }); setBannerForm(null); },
    onError: (err: Error) => toast.error(`등록 실패: ${err.message}`),
  });

  const updateBannerMutation = useMutation({
    mutationFn: (input: { id: number; title?: string; imageUrl?: string; actionType?: "url" | "content"; actionUrl?: string | null; contentTitle?: string | null; contentDate?: string | null; contentBody?: string | null; sortOrder?: number; isActive?: number; }) =>
      adminClient!.admin.updateBanner.mutate(input),
    onSuccess: () => { toast.success("배너가 수정되었습니다."); qc.invalidateQueries({ queryKey: ["admin", "listBanners"] }); setBannerForm(null); },
    onError: (err: Error) => toast.error(`수정 실패: ${err.message}`),
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id: number) => adminClient!.admin.deleteBanner.mutate({ id }),
    onSuccess: () => { toast.success("배너가 삭제되었습니다."); qc.invalidateQueries({ queryKey: ["admin", "listBanners"] }); },
    onError: (err: Error) => toast.error(`삭제 실패: ${err.message}`),
  });

  const handleBannerSubmit = async () => {
    if (!bannerForm) return;
    if (!bannerForm.title.trim()) { toast.error("배너 제목을 입력하세요."); return; }
    if (!bannerForm.imageUrl.trim()) { toast.error("이미지 URL을 입력하세요."); return; }
    const payload = {
      title: bannerForm.title,
      imageUrl: bannerForm.imageUrl,
      actionType: bannerForm.actionType,
      actionUrl: bannerForm.actionUrl || undefined,
      contentTitle: bannerForm.contentTitle || undefined,
      contentDate: bannerForm.contentDate || undefined,
      contentBody: bannerForm.contentBody || undefined,
      sortOrder: bannerForm.sortOrder,
      isActive: bannerForm.isActive,
    };
    if (bannerForm.id) {
      updateBannerMutation.mutate({ id: bannerForm.id, ...payload });
    } else {
      createBannerMutation.mutate(payload);
    }
  };

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: "user" | "admin" }) =>
      adminClient!.admin.updateUserRole.mutate({ id, role }),
    onSuccess: () => {
      toast.success("역할이 변경되었습니다.");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err: Error) => {
      toast.error(`역할 변경 실패: ${err.message}`);
    },
  });

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleRoleChange = (id: number, role: "user" | "admin") => {
    updateRoleMutation.mutate({ id, role });
  };

  const handleRefresh = () => {
    refetchUsers();
    refetchStats();
    toast.success("데이터를 새로고침했습니다.");
  };

  useEffect(() => {
    setPage(1);
  }, [roleFilter]);

  // adminLoggedIn 세션이 없으면 항상 로그인 화면 표시
  if (!adminLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">관리자 로그인 필요</h1>
            <p className="text-muted-foreground text-sm">
              관리자 페이지에 접근하려면 로그인이 필요합니다.
            </p>
          </div>
          <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">ID</label>
              <Input
                type="text"
                placeholder="관리자 ID를 입력하세요"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full"
                autoComplete="username"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={adminPw}
                onChange={(e) => setAdminPw(e.target.value)}
                className="w-full"
                autoComplete="current-password"
              />
            </div>
            {adminLoginError && (
              <p className="text-sm text-destructive">{adminLoginError}</p>
            )}
            <Button type="submit" size="lg" className="w-full mt-1">
              OK
            </Button>
          </form>
        </div>
      </div>
    );
  }



  const totalPages = usersData?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">관리자 페이지</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Ragnarok Universe Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {adminLoggedIn?.charAt(0).toUpperCase() ?? "A"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{adminLoggedIn}</span>
              <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">관리자</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChangePw(true)}
              className="text-muted-foreground text-xs"
            >
              PW 변경
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/")}
              className="text-muted-foreground"
            >
              홈으로
            </Button>
            <Button variant="ghost" size="sm" onClick={handleAdminLogout} className="text-muted-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
      {/* 왼쪽 사이드바 - EDUMIN 스타일 */}
      <aside className="w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm">
        {/* MAIN MENU 섹션 */}
        <div className="px-4 pt-5 pb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
        </div>
        <nav className="flex flex-col px-2 pb-4">
          {/* Dashboard */}
          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full group ${
              activeMenu === "dashboard"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity className={`h-4 w-4 ${activeMenu === "dashboard" ? "text-white" : "text-slate-400"}`} />
              Dashboard
            </div>
            <ChevronRight className={`h-3.5 w-3.5 opacity-50 ${activeMenu === "dashboard" ? "text-white" : ""}`} />
          </button>

          {/* 회원 관리 */}
          <button
            onClick={() => setActiveMenu("members")}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
              activeMenu === "members"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`h-4 w-4 ${activeMenu === "members" ? "text-white" : "text-slate-400"}`} />
              회원 관리
            </div>
            <ChevronRight className={`h-3.5 w-3.5 opacity-50 ${activeMenu === "members" ? "text-white" : ""}`} />
          </button>

          {/* Main Banner */}
          <button
            onClick={() => setActiveMenu("main-banner")}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
              activeMenu === "main-banner"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <RefreshCw className={`h-4 w-4 ${activeMenu === "main-banner" ? "text-white" : "text-slate-400"}`} />
              Main Banner
            </div>
            <ChevronRight className={`h-3.5 w-3.5 opacity-50 ${activeMenu === "main-banner" ? "text-white" : ""}`} />
          </button>

          {/* News */}
          <button
            onClick={() => setActiveMenu("news")}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
              activeMenu === "news"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Search className={`h-4 w-4 ${activeMenu === "news" ? "text-white" : "text-slate-400"}`} />
              News
            </div>
            <ChevronRight className={`h-3.5 w-3.5 opacity-50 ${activeMenu === "news" ? "text-white" : ""}`} />
          </button>

          {/* Media */}
          <button
            onClick={() => setActiveMenu("media")}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
              activeMenu === "media"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck className={`h-4 w-4 ${activeMenu === "media" ? "text-white" : "text-slate-400"}`} />
              Media
            </div>
            <ChevronRight className={`h-3.5 w-3.5 opacity-50 ${activeMenu === "media" ? "text-white" : ""}`} />
          </button>

          {/* Point Shop */}
          <button
            onClick={() => setActiveMenu("point-shop")}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
              activeMenu === "point-shop"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <MoreHorizontal className={`h-4 w-4 ${activeMenu === "point-shop" ? "text-white" : "text-slate-400"}`} />
              Point Shop
            </div>
            <ChevronRight className={`h-3.5 w-3.5 opacity-50 ${activeMenu === "point-shop" ? "text-white" : ""}`} />
          </button>

          {/* 정책 변경 (서브메뉴 포함) */}
          <button
            onClick={() => setActiveMenu(activeMenu === "policy" || activeMenu.startsWith("policy-") ? "dashboard" : "policy")}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
              activeMenu === "policy" || activeMenu.startsWith("policy-")
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className={`h-4 w-4 ${activeMenu === "policy" || activeMenu.startsWith("policy-") ? "text-white" : "text-slate-400"}`} />
              정책 변경
            </div>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform opacity-50 ${
              activeMenu === "policy" || activeMenu.startsWith("policy-") ? "rotate-90 text-white" : ""
            }`} />
          </button>

          {/* 정책 변경 서브메뉴 */}
          {(activeMenu === "policy" || activeMenu.startsWith("policy-")) && (
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-primary/30 pl-3">
              {[
                { key: "policy-privacy", label: "Privacy Policy" },
                { key: "policy-terms", label: "Terms of Service" },
                { key: "policy-cookie", label: "Privacy Settings" },
              ].map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => setActiveMenu(sub.key)}
                  className={`flex items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-colors text-left w-full ${
                    activeMenu === sub.key
                      ? "text-primary font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeMenu === sub.key ? "bg-primary" : "bg-slate-300"}`} />
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* 하단 로그아웃 */}
        <div className="mt-auto p-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 sm:px-6 py-8 space-y-8 overflow-auto">
        {/* Main Banner 관리 UI */}
        {activeMenu === "main-banner" && (
          <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {bannerForm ? (
                    <button onClick={() => setBannerForm(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-base font-normal mr-2">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  ) : null}
                  {bannerForm ? (bannerForm.id ? "배너 수정" : "배너 등록") : "Main Banner 관리"}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {bannerForm ? "배너 정보를 수정하고 저장하세요." : "메인 페이지 상단 캐러셀 배너를 관리합니다."}
                </p>
              </div>
              {!bannerForm && (
                <Button onClick={() => setBannerForm({ title: "", imageUrl: "", actionType: "url", actionUrl: "", contentTitle: "", contentDate: "", contentBody: "", sortOrder: (bannersData?.length ?? 0), isActive: 1 })}>
                  <Plus className="h-4 w-4 mr-2" /> 배너 등록
                </Button>
              )}
              {bannerForm && (
                <Button variant="outline" onClick={() => setBannerForm(null)}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> 목록으로
                </Button>
              )}
            </div>

            {/* 배너 목록 - bannerForm 없을 때만 표시 */}
            {!bannerForm && <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    등록된 배너 ({(() => {
                      const filtered = (bannersData ?? []).filter(b => !bannerSearch || b.title.toLowerCase().includes(bannerSearch.toLowerCase()));
                      return filtered.length;
                    })()}개)
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="배너 제목 검색..."
                        value={bannerSearchInput}
                        onChange={e => setBannerSearchInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { setBannerSearch(bannerSearchInput); setBannerPage(1); } }}
                        className="pl-8 h-8 w-48 text-sm"
                      />
                    </div>
                    <Button size="sm" onClick={() => { setBannerSearch(bannerSearchInput); setBannerPage(1); }} className="h-8">검색</Button>
                    <Select value={String(bannerPageSize)} onValueChange={v => { setBannerPageSize(Number(v)); setBannerPage(1); }}>
                      <SelectTrigger className="w-24 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10개씩</SelectItem>
                        <SelectItem value="20">20개씩</SelectItem>
                        <SelectItem value="50">50개씩</SelectItem>
                        <SelectItem value="100">100개씩</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => refetchBanners()} className="h-8">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const filtered = (bannersData ?? []).filter(b => !bannerSearch || b.title.toLowerCase().includes(bannerSearch.toLowerCase()));
                  const totalBannerPages = Math.ceil(filtered.length / bannerPageSize);
                  const paged = filtered.slice((bannerPage - 1) * bannerPageSize, bannerPage * bannerPageSize);
                  return (
                    <>
                      {filtered.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">{bannerSearch ? `"${bannerSearch}" 검색 결과가 없습니다.` : "등록된 배너가 없습니다."}</div>
                      ) : (
                        <div className="space-y-3">
                          {paged.map((banner) => (
                      <div key={banner.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => setBannerForm({ id: banner.id, title: banner.title, imageUrl: banner.imageUrl, actionType: banner.actionType, actionUrl: banner.actionUrl ?? "", contentTitle: banner.contentTitle ?? "", contentDate: banner.contentDate ?? "", contentBody: banner.contentBody ?? "", sortOrder: banner.sortOrder, isActive: banner.isActive })}>
                        {/* 순서 */}
                        <span className="text-xs text-muted-foreground w-5 text-center font-mono">{banner.sortOrder + 1}</span>
                        {/* 썸네일 */}
                        <div className="w-24 h-14 rounded overflow-hidden bg-slate-100 shrink-0">
                          <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                        </div>
                        {/* 정보 */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{banner.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {banner.actionType === "url" ? (
                              <span className="flex items-center gap-1 text-xs text-blue-600"><Link className="h-3 w-3" /> URL 연결</span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-green-600"><Pencil className="h-3 w-3" /> 콘텐츠</span>
                            )}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${banner.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                              {banner.isActive ? "활성" : "비활성"}
                            </span>
                          </div>
                        </div>
                        {/* 버튼 */}
                        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => setBannerPreview(banner as BannerRow)} title="미리보기">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setBannerForm({ id: banner.id, title: banner.title, imageUrl: banner.imageUrl, actionType: banner.actionType, actionUrl: banner.actionUrl ?? "", contentTitle: banner.contentTitle ?? "", contentDate: banner.contentDate ?? "", contentBody: banner.contentBody ?? "", sortOrder: banner.sortOrder, isActive: banner.isActive })} title="수정">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { if (confirm(`"${banner.title}" 배너를 삭제하시겠습니까?`)) deleteBannerMutation.mutate(banner.id); }} title="삭제" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => updateBannerMutation.mutate({ id: banner.id, isActive: banner.isActive ? 0 : 1 })} title="활성/비활성 토글">
                            {banner.isActive ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                          </Button>
                        </div>
                      </div>
                          ))}
                          {/* end paged.map */}
                        </div>
                      )}
                      {/* 페이지네이션 */}
                      {totalBannerPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                          <Button variant="outline" size="sm" onClick={() => setBannerPage(p => Math.max(1, p - 1))} disabled={bannerPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-muted-foreground">{bannerPage} / {totalBannerPages}</span>
                          <Button variant="outline" size="sm" onClick={() => setBannerPage(p => Math.min(totalBannerPages, p + 1))} disabled={bannerPage === totalBannerPages}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>}

            {/* 배너 등록/수정 폼 - 상세 페이지 */}
            {bannerForm && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{bannerForm.id ? "배너 수정" : "배너 등록"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 배너 제목 */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">배너 제목 <span className="text-red-500">*</span></label>
                    <Input value={bannerForm.title} onChange={e => setBannerForm(f => f && ({ ...f, title: e.target.value }))} placeholder="배너 제목 입력" />
                  </div>

                  {/* 이미지 등록 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">이미지 등록 <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <Input
                        value={bannerForm.imageUrl}
                        onChange={e => setBannerForm(f => f && ({ ...f, imageUrl: e.target.value }))}
                        placeholder="/manus-storage/banner_image.jpg"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/jpeg,image/webp,image/png';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            if (file.size > 500 * 1024) {
                              toast.error('파일 용량이 500KB를 초과합니다.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string;
                              setBannerForm(f => f && ({ ...f, imageUrl: dataUrl }));
                              toast.info('이미지가 선택되었습니다. 실제 배포 시 manus-storage URL로 교체해 주세요.');
                            };
                            reader.readAsDataURL(file);
                          };
                          input.click();
                        }}
                        className="shrink-0"
                      >
                        PC에서 찾아보기
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">권장: 1900×600px | 500KB 미만 | JPG, WebP, PNG</p>
                    {bannerForm.imageUrl && (
                      <div className="mt-2 rounded overflow-hidden border bg-slate-100" style={{ aspectRatio: '1900/600' }}>
                        <img src={bannerForm.imageUrl} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </div>

                  {/* 클릭 액션 타입 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">클릭 시 동작</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="actionType" value="url" checked={bannerForm.actionType === "url"} onChange={() => setBannerForm(f => f && ({ ...f, actionType: "url" }))} />
                        <Link className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">URL 이동</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="actionType" value="content" checked={bannerForm.actionType === "content"} onChange={() => setBannerForm(f => f && ({ ...f, actionType: "content" }))} />
                        <Pencil className="h-4 w-4 text-green-500" />
                        <span className="text-sm">콘텐츠 표시</span>
                      </label>
                    </div>
                  </div>

                  {/* URL 입력 */}
                  {bannerForm.actionType === "url" && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">이동 URL</label>
                      <Input value={bannerForm.actionUrl} onChange={e => setBannerForm(f => f && ({ ...f, actionUrl: e.target.value }))} placeholder="https://discord.gg/..." />
                    </div>
                  )}

                  {/* 콘텐츠 입력 */}
                  {bannerForm.actionType === "content" && (
                    <div className="space-y-3 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">콘텐츠 작성</p>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">제목</label>
                        <Input value={bannerForm.contentTitle} onChange={e => setBannerForm(f => f && ({ ...f, contentTitle: e.target.value }))} placeholder="콘텐츠 제목" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">날짜</label>
                        <Input value={bannerForm.contentDate} onChange={e => setBannerForm(f => f && ({ ...f, contentDate: e.target.value }))} placeholder="2026-07-01" type="date" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">내용</label>
                        <textarea
                          value={bannerForm.contentBody}
                          onChange={e => setBannerForm(f => f && ({ ...f, contentBody: e.target.value }))}
                          placeholder="콘텐츠 내용을 입력하세요..."
                          rows={6}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* 정렬 순서 및 활성 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">순서</label>
                      <Input type="number" value={bannerForm.sortOrder} onChange={e => setBannerForm(f => f && ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} min={0} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">활성 상태</label>
                      <div className="flex items-center gap-2 h-10">
                        <button onClick={() => setBannerForm(f => f && ({ ...f, isActive: f.isActive ? 0 : 1 }))} className="flex items-center gap-2">
                          {bannerForm.isActive ? <ToggleRight className="h-6 w-6 text-green-500" /> : <ToggleLeft className="h-6 w-6 text-slate-400" />}
                          <span className="text-sm">{bannerForm.isActive ? "활성" : "비활성"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 버튼 */}
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleBannerSubmit} disabled={createBannerMutation.isPending || updateBannerMutation.isPending}>
                      {bannerForm.id ? "수정 저장" : "배너 등록"}
                    </Button>
                    <Button variant="outline" onClick={() => setBannerForm(null)}>취소</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 미리보기 다이얼로그 */}
            <Dialog open={!!bannerPreview} onOpenChange={() => setBannerPreview(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>배너 미리보기: {bannerPreview?.title}</DialogTitle>
                </DialogHeader>
                {bannerPreview && (
                  <div className="space-y-3">
                    <div className="rounded-lg overflow-hidden border">
                      <img src={bannerPreview.imageUrl} alt={bannerPreview.title} className="w-full object-cover" style={{ aspectRatio: '1900/600' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">클릭 액션:</span> {bannerPreview.actionType === "url" ? `URL 이동 → ${bannerPreview.actionUrl}` : "콘텐츠 표시"}</div>
                      <div><span className="text-muted-foreground">상태:</span> {bannerPreview.isActive ? "활성" : "비활성"}</div>
                    </div>
                    {bannerPreview.actionType === "content" && bannerPreview.contentTitle && (
                      <div className="border rounded-lg p-4 space-y-2">
                        <p className="font-semibold">{bannerPreview.contentTitle}</p>
                        {bannerPreview.contentDate && <p className="text-xs text-muted-foreground">{bannerPreview.contentDate}</p>}
                        {bannerPreview.contentBody && <p className="text-sm whitespace-pre-wrap">{bannerPreview.contentBody}</p>}
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBannerPreview(null)}>닫기</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* 메뉴별 안내 (미구현 메뉴) */}
        {activeMenu !== "dashboard" && activeMenu !== "members" && activeMenu !== "main-banner" && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
            <div className="text-5xl">
              {activeMenu === "main-banner" && "🖼️"}
              {activeMenu === "news" && "📰"}
              {activeMenu === "media" && "🎬"}
              {activeMenu === "point-shop" && "🛒"}
              {(activeMenu === "policy" || activeMenu.startsWith("policy-")) && "📋"}
            </div>
            <p className="text-lg font-semibold">
              {activeMenu === "main-banner" && "Main Banner 관리"}
              {activeMenu === "news" && "News 관리"}
              {activeMenu === "media" && "Media 관리"}
              {activeMenu === "point-shop" && "Point Shop 관리"}
              {activeMenu === "policy" && "정책 변경"}
              {activeMenu === "policy-privacy" && "Privacy Policy 관리"}
              {activeMenu === "policy-terms" && "Terms of Service 관리"}
              {activeMenu === "policy-cookie" && "Privacy Settings 관리"}
            </p>
            <p className="text-sm">준비 중입니다.</p>
          </div>
        )}
        {/* Dashboard: 통계 카드 */}
        {(activeMenu === "dashboard" || activeMenu === "members") && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="전체 회원"
            value={stats?.total}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="관리자"
            value={stats?.admins}
            icon={Shield}
            color="bg-amber-500"
          />
          <StatCard
            title="오늘 가입"
            value={stats?.newToday}
            icon={UserCheck}
            color="bg-green-500"
          />
          <StatCard
            title="30일 활성"
            value={stats?.activeMonth}
            icon={Activity}
            color="bg-purple-500"
          />
        </div>}

        {/* 회원 목록 */}
        {(activeMenu === "dashboard" || activeMenu === "members") && <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                회원 목록
                {usersData && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    (총 {usersData.total.toLocaleString()}명)
                  </span>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="self-start sm:self-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                새로고침
              </Button>
            </div>

            {/* 필터 영역 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="닉네임, Open ID로 검색..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearch} size="sm" className="shrink-0">
                검색
              </Button>
              <Select
                value={roleFilter}
                onValueChange={v => setRoleFilter(v as RoleFilter)}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="역할 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 역할</SelectItem>
                  <SelectItem value="user">일반 회원</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={String(pageSize)}
                onValueChange={v => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10개씩</SelectItem>
                  <SelectItem value="20">20개씩</SelectItem>
                  <SelectItem value="50">50개씩</SelectItem>
                  <SelectItem value="100">100개씩</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors select-none"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Nickname
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Provider</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors select-none hidden sm:table-cell"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Registration Date
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors select-none hidden xl:table-cell"
                      onClick={() => handleSort("lastSignedIn")}
                    >
                      <div className="flex items-center gap-1">
                        Last Account Activity
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 bg-muted animate-pulse rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : usersData?.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-8 w-8 opacity-30" />
                          <p>검색 결과가 없습니다.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    usersData?.data.map(u => (
                      <TableRow
                        key={u.id}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => {
                          setSelectedUser(u as UserRow);
                          setDetailOpen(true);
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {u.name?.charAt(0).toUpperCase() ?? "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium truncate max-w-[160px]">
                              {u.name ?? <span className="text-muted-foreground italic">-</span>}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {u.loginMethod ? (
                            <div className="flex items-center gap-1.5">
                              {u.loginMethod.toLowerCase() === "google" && (
                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                              )}
                              {u.loginMethod.toLowerCase() === "facebook" && (
                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                              )}
                              {u.loginMethod.toLowerCase() === "apple" && (
                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                              )}
                              <Badge variant="outline" className="text-xs capitalize">
                                {u.loginMethod}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                          {formatDate(u.lastSignedIn)}
                        </TableCell>

                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 페이지네이션 */}
            {usersData && totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {((page - 1) * pageSize + 1).toLocaleString()} -{" "}
                  {Math.min(page * pageSize, usersData.total).toLocaleString()} /{" "}
                  {usersData.total.toLocaleString()}명
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          className="w-9 h-9"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>}
      </main>
      </div>

      {/* 비밀번호 변경 다이얼로그 */}
      <Dialog open={showChangePw} onOpenChange={setShowChangePw}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Password 변경</DialogTitle>
            <DialogDescription>{adminLoggedIn} 계정의 비밀번호를 변경합니다.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePw} className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">새 Password</label>
              <Input
                type="password"
                placeholder="새 비밀번호 (4자 이상)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">비밀번호 확인</label>
              <Input
                type="password"
                placeholder="비밀번호 다시 입력"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
            </div>
            {changePwError && <p className="text-sm text-destructive">{changePwError}</p>}
            <DialogFooter className="mt-2">
              <Button type="button" variant="ghost" onClick={() => { setShowChangePw(false); setNewPw(""); setConfirmPw(""); setChangePwError(""); }}>취소</Button>
              <Button type="submit">변경</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 회원 상세 모달 */}
      <UserDetailModal
        user={selectedUser}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}
