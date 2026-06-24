import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { User, Shield, LogOut, Trash2, CheckCircle2, ShieldAlert, CreditCard, Clock, ArrowRight, Edit2, Ticket, Unlink, Mail, Users, LogIn, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Layout from "@/components/Layout";

export default function MyPage() {
  const [, setLocation] = useLocation();
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agreeWithdrawTerms, setBgAgreeWithdrawTerms] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showNicknameEdit, setShowNicknameEdit] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

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
    if (stored && stored !== "모험가") {
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
      return { icon: "🔵", label: "Google 로그인" };
    } else if (provider === "Facebook") {
      return { icon: "📘", label: "Facebook 로그인" };
    }
    return { icon: "👤", label: "Guest 로그인" };
  };

  const loginInfo = getLoginTypeInfo();

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background dark:to-slate-900 px-4">
          <div className="text-center">
            <LogIn size={48} className="mx-auto mb-4 text-slate-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Not Logged In</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to access your profile.</p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
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

  const handleCouponSubmit = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }

    setIsValidatingCoupon(true);
    
    // Simulate coupon validation
    const validCoupons = ["WELCOME2026", "SUMMER100", "NEWPLAYER50"];
    
    setTimeout(() => {
      if (validCoupons.includes(couponCode.toUpperCase())) {
        toast.success(`Coupon ${couponCode} applied successfully!`);
        setCouponCode("");
        setShowCouponInput(false);
      } else {
        toast.error("Invalid coupon code. Please try again.");
      }
      setIsValidatingCoupon(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("rou_logged_in");
    localStorage.removeItem("rou_nickname");
    localStorage.removeItem("rou_guest_mode");
    localStorage.removeItem("rou_social_provider");
    toast.success("Logged out successfully!");
    setLocation("/");
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeWithdrawTerms) {
      toast.error("You must agree to the withdrawal terms.");
      return;
    }
    setIsWithdrawing(true);
    setTimeout(() => {
      localStorage.removeItem("rou_logged_in");
      localStorage.removeItem("rou_nickname");
      localStorage.removeItem("rou_guest_mode");
      localStorage.removeItem("rou_social_provider");
      toast.success("Account withdrawn successfully.");
      setLocation("/");
    }, 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background dark:to-slate-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Page</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-3xl border border-white/10 dark:bg-[#131313] bg-[#f2f2f2] dark:border-slate-700/50 sticky top-8">
                {/* Profile Card */}
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-black/10 dark:border-white/10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-3">
                    <User size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-black dark:text-white text-center">{userNickname}</h3>
                  <p className="text-xs text-black/60 dark:text-white/60 mt-1">{loginInfo.icon} {loginInfo.label}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full text-xs border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={() => { setShowNicknameEdit(true); setNewNickname(userNickname); }}
                  >
                    <Edit2 size={12} className="mr-1" /> Change Nickname
                  </Button>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  <button onClick={() => toast.info("Payment history feature coming soon.")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                    <CreditCard size={16} className="text-black dark:text-white" />
                    <span>Payment History</span>
                  </button>
                  <button onClick={() => toast.info("Usage history feature coming soon.")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                    <Clock size={16} className="text-black dark:text-white" />
                    <span>Points/Item Usage</span>
                  </button>
                  <button onClick={() => toast.info("Customer inquiry feature coming soon.")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                    <Mail size={16} className="text-black dark:text-white" />
                    <span>1:1 Inquiry</span>
                  </button>
                  <button onClick={() => setShowCouponInput(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                    <Ticket size={16} className="text-black dark:text-white" />
                    <span>Enter Coupon</span>
                  </button>
                </nav>

                {/* Account Actions */}
                <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10 space-y-2">
                  <Button variant="outline" onClick={handleLogout} className="w-full text-xs border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5">
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
              {showWithdrawDialog ? (
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
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">Name</TableHead>
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">Provider</TableHead>
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">Registration Date</TableHead>
                            <TableHead className="text-black/70 dark:text-white/70 font-semibold">Last Account Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5">
                            <TableCell className="text-black dark:text-white font-medium">{userNickname}</TableCell>
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
                            <TableCell className="text-black/70 dark:text-white/70">06/19/2026 at 5:14 AM</TableCell>
                            <TableCell className="text-black/70 dark:text-white/70">South Korea • 06/19/2026 • 05:49 AM</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <p className="text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Name</p>
                        <p className="text-sm text-black dark:text-white font-medium">{userNickname}</p>
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
                        <p className="text-sm text-black dark:text-white">06/19/2026 at 5:14 AM</p>
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

                          {/* Marketing Consent — user-controllable toggle */}
                          <div className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                            marketingConsent
                              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40"
                              : "bg-black/5 dark:bg-white/5 border-transparent"
                          }`}>
                            <div className="flex items-start gap-2">
                              <Bell size={15} className={`mt-0.5 shrink-0 ${marketingConsent ? "text-blue-600" : "text-black/40 dark:text-white/40"}`} />
                              <div>
                                <p className="text-sm font-medium text-black dark:text-white">Receive Marketing Information</p>
                                <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                                  {marketingConsent
                                    ? "You are currently receiving marketing updates."
                                    : "You are not receiving marketing updates."}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={marketingConsent}
                              onCheckedChange={handleMarketingToggle}
                              className="shrink-0 ml-4 data-[state=checked]:bg-blue-600"
                            />
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

      {/* Coupon Input Dialog */}
      {showCouponInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#131313] rounded-2xl p-6 max-w-sm w-full border border-white/10 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">Enter Coupon</h3>
            <Input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="mb-4 bg-white dark:bg-slate-800 border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCouponInput(false)}
                className="flex-1 border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCouponSubmit}
                disabled={isValidatingCoupon}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isValidatingCoupon ? "Validating..." : "Apply Coupon"}
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
