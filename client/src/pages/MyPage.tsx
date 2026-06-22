import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { User, Mail, Calendar, Shield, LogOut, Settings, ShoppingBag, Bell, ChevronRight } from "lucide-react";

export default function MyPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      window.location.href = "/";
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  const lastSignIn = user.lastSignedIn
    ? new Date(user.lastSignedIn).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  const QUICK_LINKS = [
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Point Shop", href: "/point-shop", desc: "Browse and purchase items" },
    { icon: <Bell className="w-5 h-5" />, label: "Notices", href: "/notice", desc: "View official announcements" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "#", desc: "Manage account preferences" },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">My Page</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage your Ragnarok Universe account
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-xl font-bold text-card-foreground mb-1">
                {user.name ?? "Adventurer"}
              </h2>
              {user.email && (
                <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
              )}

              {/* Role Badge */}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5 ${
                user.role === "admin"
                  ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30"
                  : "bg-primary/10 text-primary border border-primary/30"
              }`}>
                {user.role === "admin" ? "Administrator" : "Adventurer"}
              </span>

              {/* Logout */}
              <Button
                variant="outline"
                className="w-full gap-2 text-destructive hover:text-destructive hover:border-destructive"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4" />
                {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>

          {/* Right: Account Details + Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-base font-semibold text-card-foreground mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Account Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Display Name</p>
                    <p className="text-sm font-medium text-card-foreground truncate">{user.name ?? "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="text-sm font-medium text-card-foreground truncate">{user.email ?? "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium text-card-foreground">{joinDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Last Sign In</p>
                    <p className="text-sm font-medium text-card-foreground">{lastSignIn}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-base font-semibold text-card-foreground mb-5">Quick Access</h3>
              <div className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <Link key={link.label} href={link.href}>
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {link.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">{link.label}</p>
                        <p className="text-xs text-muted-foreground">{link.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Point Balance */}
            <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Point Balance</p>
                  <p className="text-3xl font-bold text-foreground">0 <span className="text-base font-normal text-muted-foreground">Points</span></p>
                </div>
                <Link href="/point-shop">
                  <Button className="gaming-gradient text-white font-semibold">
                    Go to Shop
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
