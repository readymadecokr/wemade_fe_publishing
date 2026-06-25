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
import {
  Activity,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type SortBy = "id" | "name" | "email" | "createdAt" | "lastSignedIn" | "role";
type SortOrder = "asc" | "desc";
type RoleFilter = "all" | "user" | "admin";

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
            <span className="text-muted-foreground font-medium">역할</span>
            <span className="col-span-2">
              <Badge
                variant={user.role === "admin" ? "default" : "secondary"}
                className={user.role === "admin" ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                {user.role === "admin" ? "관리자" : "일반 회원"}
              </Badge>
            </span>
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
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <div className="flex gap-2">
            {user.role === "user" ? (
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() => {
                  onRoleChange(user.id, "admin");
                  onClose();
                }}
              >
                <Shield className="h-4 w-4 mr-1" />
                관리자로 변경
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  onRoleChange(user.id, "user");
                  onClose();
                }}
              >
                <User className="h-4 w-4 mr-1" />
                일반 회원으로 변경
              </Button>
            )}
          </div>
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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: stats, refetch: refetchStats } = trpc.admin.stats.useQuery(undefined, {
    retry: false,
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = trpc.admin.listUsers.useQuery(
    { page, pageSize, search, sortBy, sortOrder, roleFilter },
    { retry: false }
  );

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("역할이 변경되었습니다.");
      refetchUsers();
      refetchStats();
    },
    onError: (err) => {
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

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>

        {/* 회원 목록 */}
        <Card>
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
                  placeholder="이름, 이메일, Open ID로 검색..."
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
                    <TableHead className="text-right">Terms Agreement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 bg-muted animate-pulse rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : usersData?.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
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
                            <Badge variant="outline" className="text-xs capitalize">
                              {u.loginMethod}
                            </Badge>
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
                        <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Agreed</span>
                            <span className="text-[10px] text-muted-foreground">
                              {(() => {
                                const d = u.createdAt ? new Date(u.createdAt) : null;
                                if (!d) return "-";
                                const mm = String(d.getMonth() + 1).padStart(2, '0');
                                const dd = String(d.getDate()).padStart(2, '0');
                                const yyyy = d.getFullYear();
                                const h = d.getHours();
                                const min = String(d.getMinutes()).padStart(2, '0');
                                const ap = h >= 12 ? 'PM' : 'AM';
                                const h12 = h % 12 || 12;
                                return `${mm}/${dd}/${yyyy} ${h12}:${min} ${ap}`;
                              })()}
                            </span>
                          </div>
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
        </Card>
      </main>

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
