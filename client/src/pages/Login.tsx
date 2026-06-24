import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Shield, Check, Info, User, CheckCircle2, AlertTriangle, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import SignInPanel from "@/components/SignInPanel";

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

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

export default function Login() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"login" | "register_social" | "register_guest" | "register_success" | "find_account">("login");
  
  // Login / Form States
  const [socialProvider, setSocialProvider] = useState<"Google" | "Apple" | "Facebook" | "">("Google");
  const [nickname, setNickname] = useState("");
  const [agreeTerms, setBgAgreeTerms] = useState(false);
  const [agreeAge, setBgAgreeAge] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [isVerifyingTurnstile, setIsVerifyingTurnstile] = useState(false);

  // Find ID States (Password reset removed)
  const [findEmail, setFindEmail] = useState("");
  const [findStep, setFindStep] = useState<"input" | "success">("input");

  // Auto-jump to guest register step if ?guest=1 in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("guest") === "1") {
      setSocialProvider("");
      setStep("register_guest");
    }
  }, []);

  // Modal States for Terms Details
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);

  // Handle Social Login (Google 우선 진행)
  const handleSocialClick = (provider: "Google" | "Apple" | "Facebook") => {
    setSocialProvider(provider);
    toast.info(`Connecting ${provider} social account...`);
    
    // Simulate API call to check if user is already registered
    setTimeout(() => {
      // PPTX 기획안 11번 슬라이드: 가입이 안 된 상태라면 가입부터 진행됨, 별도 register 버튼 불필요
      const isRegistered = localStorage.getItem(`rou_registered_${provider.toLowerCase()}`) === "true";
      
      if (isRegistered) {
        // Log in immediately
        localStorage.setItem("rou_logged_in", "true");
        localStorage.setItem("rou_nickname", localStorage.getItem(`rou_nickname_${provider.toLowerCase()}`) || generateRandomNickname());
        localStorage.setItem("rou_social_provider", provider);
        toast.success(`Successfully signed in with ${provider}!`);
        setLocation("/");
      } else {
        // Go to social registration flow
        setStep("register_social");
        toast.success(`${provider} account verified! Please complete your profile.`);
      }
    }, 1000);
  };

  // Handle Guest Mode — go to Verify & Accept first
  const handleGuestMode = () => {
    setSocialProvider("");
    setStep("register_guest");
  };

  // Complete Guest Registration after Verify & Accept
  const handleGuestRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }
    if (!agreeAge) {
      toast.error("You must confirm that you are 15 years or older.");
      return;
    }
    const randomNickname = generateRandomNickname();
    localStorage.setItem("rou_logged_in", "true");
    localStorage.setItem("rou_nickname", randomNickname);
    localStorage.setItem("rou_guest_mode", "true");
    localStorage.setItem("rou_marketing_consent", agreeMarketing ? "true" : "false");
    // Save agreement timestamp
    localStorage.setItem("rou_agreed_at", new Date().toISOString());
    toast.success(`Welcome, ${randomNickname}! You are now in guest mode.`);
    setStep("register_success");
  };

  // Handle Social Register (PPTX 기획안 2번, 7번 슬라이드)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    if (!agreeAge) {
      toast.error("You must confirm that you are 20 years or older.");
      return;
    }

    // Note: agreeMarketing is optional, no validation needed
    // Note: turnstileVerified is optional, no validation needed

    // Simulate Register Success & DB Save
    toast.loading("Saving your registration...");
    setTimeout(() => {
      const defaultNickname = generateRandomNickname();
      localStorage.setItem(`rou_registered_${socialProvider.toLowerCase()}`, "true");
      localStorage.setItem(`rou_nickname_${socialProvider.toLowerCase()}`, defaultNickname);
      localStorage.setItem(`rou_marketing_${socialProvider.toLowerCase()}`, agreeMarketing ? "true" : "false");
      
      // Auto Log in
      localStorage.setItem("rou_logged_in", "true");
      localStorage.setItem("rou_nickname", defaultNickname);
      localStorage.setItem("rou_social_provider", socialProvider);
      localStorage.setItem("rou_marketing_consent", agreeMarketing ? "true" : "false");
      // Save agreement timestamp
      localStorage.setItem("rou_agreed_at", new Date().toISOString());
      
      toast.dismiss();
      setStep("register_success");
    }, 1500);
  };

  // Find Account Process (PPTX 기획안 5번 슬라이드)
  const handleFindSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findEmail.trim() || !findEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.loading("Looking up your account...");
    setTimeout(() => {
      toast.dismiss();
      setFindStep("success");
      toast.success("Account recovery email has been sent.");
    }, 1200);
  };

  return (
    <Layout>
      <div className="container min-h-[75vh] flex items-center justify-center py-12">
        <div className="relative w-full max-w-md">
          {/* Background Decorative Blur */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-primary to-accent opacity-20 blur-xl"></div>
          
          <div className="relative glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl bg-slate-900/80 backdrop-blur-2xl">
            
            {/* STEP 1: LOGIN PAGE */}
            {step === "login" && (
              <div className="flex flex-col gap-6">
                <div className="text-center flex flex-col gap-2 hidden">
                  <h2 className="text-2xl font-black tracking-wider text-white uppercase font-display">
                    Sign In
                  </h2>
                </div>

                {/* Social Login Buttons (PPTX 기획안 11번 슬라이드) */}
                <div className="flex flex-col gap-3.5 mt-2">
                  <Button 
                    onClick={() => handleSocialClick("Google")}
                    className="w-full bg-white hover:bg-slate-100 text-black font-bold text-sm py-6 rounded-xl flex items-center justify-center gap-3 shadow-lg cursor-pointer transition-all active:scale-98"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Sign In with Google
                  </Button>

                  <Button 
                    onClick={() => handleSocialClick("Apple")}
                    className="w-full bg-white hover:bg-slate-100 text-black font-bold text-sm py-6 rounded-xl flex items-center justify-center gap-3 shadow-lg cursor-pointer transition-all active:scale-98"
                  >
                    <img src={`${ASSET_BASE_URL}/manus-storage/icon_apple_ascii_ae22901e_e0e901f2.png`} alt="Apple" className="w-5 h-5" />
                    Sign In with Apple
                  </Button>

                  <Button 
                    onClick={() => handleSocialClick("Facebook")}
                    className="w-full bg-white hover:bg-slate-100 text-black font-bold text-sm py-6 rounded-xl flex items-center justify-center gap-3 shadow-lg cursor-pointer transition-all active:scale-98"
                  >
                    <img src={`${ASSET_BASE_URL}/manus-storage/icon_fb_ascii_315f83e7_ea4d87ad.png`} alt="Facebook" className="w-5 h-5" />
                    Sign In with Facebook
                  </Button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-widest">or</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* Guest Mode & Find Link (PPTX 기획안 11번, 5번 슬라이드) */}
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleGuestMode}
                    className="w-full bg-white hover:bg-slate-100 text-black font-bold text-sm py-6 rounded-xl flex items-center justify-center gap-3 shadow-lg cursor-pointer transition-all active:scale-98"
                  >
                    GUEST MODE (Try as Guest)
                  </Button>

                  {/* Cloudflare Turnstile */}
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                      <Shield size={16} className="text-emerald-400 animate-pulse shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-300">Cloudflare Turnstile</span>
                        <span className="text-[10px] text-slate-500">Automatic verification - no action required</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold shrink-0">
                      <CheckCircle2 size={14} /> Verified
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 2: SOCIAL REGISTER FORM */}
            {step === "register_social" && (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">
                <div className="text-center flex flex-col gap-2">
                  <Badge className="bg-primary/20 text-primary border border-primary/30 self-center text-[10px]">SIGN UP</Badge>
                  <h2 className="text-2xl font-black tracking-wider text-white uppercase font-display">
                    Verify &amp; Accept
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Terms Checkboxes (PPTX 기획안 2번 슬라이드) */}
                  <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/5 mt-2">
                    {/* Select All Checkbox */}
                    <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                      <Checkbox 
                        id="selectAll" 
                        checked={agreeTerms && agreeAge && agreeMarketing}
                        onCheckedChange={(checked) => {
                          setBgAgreeTerms(!!checked);
                          setBgAgreeAge(!!checked);
                          setAgreeMarketing(!!checked);
                        }}
                        className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="selectAll" className="text-xs text-slate-300 font-semibold cursor-pointer">
                        Select All Checkbox
                      </Label>
                    </div>

                    {/* Age Verification */}
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox 
                          id="agreeAge" 
                          checked={agreeAge} 
                          onCheckedChange={(checked) => setBgAgreeAge(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="agreeAge" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                          (Required) I am 15 years of age or older.
                        </Label>
                      </div>
                    </div>

                    {/* Terms of Service */}
                    <div className="flex items-start gap-3 border-t border-white/5 pt-3 mt-1 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox 
                          id="agreeTerms" 
                          checked={agreeTerms} 
                          onCheckedChange={(checked) => setBgAgreeTerms(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="agreeTerms" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                          (Required) I acknowledge that I have read and agree to the Terms of Service.
                        </Label>
                      </div>
                      <a
                        href="https://raguniverse-izcifhmz.manus.space/terms-of-service"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap ml-2 underline"
                      >
                        Read more
                      </a>
                    </div>

                    {/* Privacy Policy */}
                    <div className="flex items-start gap-3 border-t border-white/5 pt-3 mt-1 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox 
                          id="agreeMarketing" 
                          checked={agreeMarketing} 
                          onCheckedChange={(checked) => setAgreeMarketing(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="agreeMarketing" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                          (Required) I acknowledge that I have read and understood the Privacy Policy.
                        </Label>
                      </div>
                      <a
                        href="https://raguniverse-izcifhmz.manus.space/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap ml-2 underline"
                      >
                        Read more
                      </a>
                    </div>
                  </div>


                </div>

                <div className="flex gap-3 mt-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setStep("login")}
                    className="w-1/3 border-white/10 hover:bg-white/5 text-slate-400 text-xs py-5 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    className="w-2/3 bg-primary hover:bg-primary/90 text-white font-bold text-xs py-5 rounded-xl cursor-pointer"
                  >
                    Confirm
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2-B: GUEST REGISTER FORM (Verify & Accept) */}
            {step === "register_guest" && (
              <form onSubmit={handleGuestRegisterSubmit} className="flex flex-col gap-6">
                <div className="text-center flex flex-col gap-2">
                  <Badge className="bg-primary/20 text-primary border border-primary/30 self-center text-[10px]">GUEST</Badge>
                  <h2 className="text-2xl font-black tracking-wider text-white uppercase font-display">
                    Verify &amp; Accept
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/5 mt-2">
                    {/* Select All */}
                    <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                      <Checkbox
                        id="guestSelectAll"
                        checked={agreeTerms && agreeAge && agreeMarketing}
                        onCheckedChange={(checked) => {
                          setBgAgreeTerms(!!checked);
                          setBgAgreeAge(!!checked);
                          setAgreeMarketing(!!checked);
                        }}
                        className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="guestSelectAll" className="text-xs text-slate-300 font-semibold cursor-pointer">
                        Select All Checkbox
                      </Label>
                    </div>

                    {/* Age */}
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          id="guestAgreeAge"
                          checked={agreeAge}
                          onCheckedChange={(checked) => setBgAgreeAge(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="guestAgreeAge" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                          (Required) I am 15 years of age or older.
                        </Label>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 border-t border-white/5 pt-3 mt-1 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          id="guestAgreeTerms"
                          checked={agreeTerms}
                          onCheckedChange={(checked) => setBgAgreeTerms(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="guestAgreeTerms" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                          (Required) I acknowledge that I have read and agree to the Terms of Service.
                        </Label>
                      </div>
                      <a href="https://raguniverse-izcifhmz.manus.space/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap ml-2 underline">Read more</a>
                    </div>

                    {/* Privacy */}
                    <div className="flex items-start gap-3 border-t border-white/5 pt-3 mt-1 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          id="guestAgreeMarketing"
                          checked={agreeMarketing}
                          onCheckedChange={(checked) => setAgreeMarketing(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="guestAgreeMarketing" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                          (Required) I acknowledge that I have read and understood the Privacy Policy.
                        </Label>
                      </div>
                      <a href="https://raguniverse-izcifhmz.manus.space/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap ml-2 underline">Read more</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("login")}
                    className="w-1/3 border-white/10 hover:bg-white/5 text-slate-400 text-xs py-5 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-2/3 bg-primary hover:bg-primary/90 text-white font-bold text-xs py-5 rounded-xl cursor-pointer"
                  >
                    Confirm
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 3: REGISTER SUCCESS (PPTX 기획안 2번 슬라이드: 완료 화면) */}
            {step === "register_success" && (
              <div className="flex flex-col gap-5 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center self-center text-emerald-400">
                  <Check size={24} />
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black tracking-wider text-white uppercase font-display">
                    Welcome, {localStorage.getItem("rou_nickname") || "모험가"}!
                  </h2>
                  <p className="text-xs text-slate-400">
                    Your account has been created successfully.
                  </p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-emerald-200 text-xs">
                  <p className="font-semibold mb-1">Account Created</p>
                  <p>You are now logged in. Redirecting to home page...</p>
                </div>

                <Button 
                  onClick={() => setLocation("/")}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs py-5 rounded-xl cursor-pointer mt-2"
                >
                  Go to Home
                </Button>
              </div>
            )}

            {/* STEP 4: FIND ACCOUNT (PPTX 기획안 5번 슬라이드) */}
            {step === "find_account" && (
              <div className="flex flex-col gap-6">
                <div className="text-center flex flex-col gap-2">
                  <h2 className="text-2xl font-black tracking-wider text-white uppercase font-display">
                    Find Your ID
                  </h2>
                  <p className="text-xs text-slate-400">
                    We'll look up your ID using your registered email address.
                  </p>
                </div>

                {findStep === "input" ? (
                  <form onSubmit={handleFindSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="findEmail" className="text-xs text-slate-300 font-semibold">
                        Your Registered Email Address
                      </Label>
                      <Input 
                        id="findEmail"
                        type="email"
                        placeholder="example@email.com"
                        value={findEmail}
                        onChange={(e) => setFindEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl py-5"
                        required
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setStep("login")}
                        className="w-1/3 border-white/10 hover:bg-white/5 text-slate-400 text-xs py-5 rounded-xl"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        className="w-2/3 bg-primary hover:bg-primary/90 text-white font-bold text-xs py-5 rounded-xl cursor-pointer"
                      >
                        Find My ID
                      </Button>
                    </div>
                  </form>
                ) : (
                  // Success State (PPTX 기획안 5번 슬라이드: 완료 화면)
                  <div className="flex flex-col gap-5 text-center py-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center self-center text-emerald-400">
                      <Check size={24} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-bold text-white">
                        Check Your Email
                      </h2>
                      <p className="text-xs text-slate-400">
                        We've sent account recovery instructions to your email address.
                      </p>
                    </div>

                    <Button 
                      onClick={() => { setStep("login"); setFindStep("input"); }}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs py-5 rounded-xl cursor-pointer"
                    >
                      Sign In 화면으로 돌아가기
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Terms of Service</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 text-slate-300 text-sm space-y-5">
              <p className="text-slate-400 text-xs">Last updated: May 24, 2018</p>

              <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-white mb-1">Accepting the Terms</p>
                <p className="text-xs text-slate-300">If you reside outside of the Republic of Korea, the terms of this agreement govern the relationship between you and Wemade Connect regarding your play or use of, or participation in, Wemade Connect mobile games and related services.</p>
              </div>

              <div>
                <p className="font-bold text-white mb-2">1. Parties</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">1.1.</strong> These Terms create a legally binding agreement between you ("User" or "you") and Wemade Connect in relation to the Services.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">1.2.</strong> Natural persons as opposed to any kinds of legal entities shall have the right to create an account. By accessing, using and/or submitting content or messages to or through our Services, you represent and agree that you have the legal capacity to agree to accept the Terms of Service in the jurisdiction where you reside.</p>
                <p className="text-xs text-slate-300"><strong className="text-slate-200">1.3.</strong> You agree to comply with the Terms of Service on behalf of yourself and, at your discretion, any minor children for whom you are the parent or legal guardian and whom you have authorized to use our Services using your account.</p>
              </div>

              <div>
                <p className="font-bold text-white mb-2">2. About Accessing and Using Our Services</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">2.1 Limited License:</strong> Subject to your agreement and complete compliance with the Terms of Service, we grant you a non-exclusive, non-transferable, non-sublicensable, revocable limited license to access and use our Services for your own personal and non-commercial use.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">2.2 Revocation of Limited License:</strong> We reserve the right to revoke the limited license granted to you in our sole and absolute discretion. We may also limit or terminate your right to access or use our Services or part thereof, maintain or delete your account and any items associated therewith, including but not limited to any Virtual Money or Virtual Goods, without any liability to you.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">2.3 System Outage:</strong> There may be times when our Services or any part thereof are not available for technical or maintenance related reasons. You agree that Wemade Connect has no responsibility and is not liable for unavailability of the Services or any loss caused by such system outages.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">2.4 Game Rules:</strong> The specific game rules, scoring rules, controls and guidelines for each Service form part of the Terms of Service and you agree that you shall comply with them.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">2.5 Third Party Charges:</strong> You are responsible for the internet connection and/or mobile charges that you may incur for playing the Games or using the Services. We are not responsible or liable to you for any credit card or bank-related charges and fees related to your transactions.</p>
                <p className="text-xs text-slate-300"><strong className="text-slate-200">2.6 Equipment/Internet:</strong> You are responsible for obtaining and maintaining your device, operating system, data connection or network environment, and any services necessary for using the Service under your own responsibility and at your own expense.</p>
              </div>

              <div>
                <p className="font-bold text-white mb-2">3. Accounts</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">3.1 Guest Account:</strong> If you use the Services without creating a Wemade Connect account, we will create and assign to your device an identifier that is similar to an account number ("Guest Accounts"). Please note that you may not receive customer support or use Virtual Money or Virtual Goods if you change your mobile device without creating a Wemade Connect account.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">3.2 SNS Account:</strong> You may allow our Services to interact with a third party social network or platform. If you choose to connect through a third-party social network such as Facebook, we may collect personal information from your profile on such third-party social networks, such as your name, username, and photograph.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">3.3 Responsibility of Account User:</strong> You are solely and fully responsible for keeping your login details confidential and all uses of your account. You may not use anyone else's account or permit others to use your account at any time. You acknowledge and agree to accept full responsibility for all fees and purchases made through your account.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">3.4 Termination of Inactive Account:</strong> We reserve the right to terminate your account without any notice if your account has not been accessed for more than 1 year since your last accessed time. Any Virtual Money and/or Virtual Goods associated with the terminated account will also be deleted, and no refund will be offered.</p>
                <p className="text-xs text-slate-300"><strong className="text-slate-200">3.5 Effect of Account Termination:</strong> You understand that if you delete your account, or if we terminate and/or delete your account, you may lose access to any data previously associated with your account.</p>
              </div>

              <div>
                <p className="font-bold text-white mb-2">4. Virtual Goods and Virtual Money</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">4.1:</strong> Our Services may include fictional currencies such as coins, gold coins and points ("Virtual Money") and virtual items or services for use with our Services ("Virtual Goods"). You can buy Virtual Money from us for real money if you are a legal adult in your country of residence.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">4.2:</strong> You do not own Virtual Goods or Virtual Money but instead you purchase a limited personal revocable license to use Virtual Goods or Virtual Money exclusively within the Services. Virtual Money and Virtual Goods have no cash value and can never be exchanged for real money, goods or services from us or anyone else.</p>
                <p className="text-xs text-slate-300 mb-2"><strong className="text-slate-200">4.3:</strong> You agree that all sales of Virtual Money and Virtual Goods are final and that we will not refund any transaction once it has been made. A license to use Virtual Goods or Virtual Money is granted immediately when your purchase is complete.</p>
                <p className="text-xs text-slate-300"><strong className="text-slate-200">4.4:</strong> We reserve the right to control, regulate, change or remove any Virtual Money or Virtual Goods in our sole discretion and without any liability to you.</p>
              </div>

              <div>
                <p className="font-bold text-white mb-2">Eligibility</p>
                <p className="text-xs text-slate-300">By agreeing with these Terms, you represent that you are thirteen (13) years of age or older. If you are a minor, you represent that your legal guardian has reviewed and agreed to these Terms. Wemade Connect may amend any portion of these Terms at any time by posting or displaying the amended Terms within and/or on the Games, or any of the Websites.</p>
              </div>

              <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-xs text-slate-300"><strong className="text-yellow-300">Important:</strong> By downloading or playing the Game, accessing and/or using the Services, and/or creating a Wemade Connect account, you accept and agree to be bound by these Terms of Service, the Privacy Policy, and Wemade Connect's community standards.</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <a
                  href="https://raguniverse-izcifhmz.manus.space/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline text-xs break-all"
                >
                  View full Terms of Service page →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Age Verification Modal */}
      {showAgeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Age 20+ Verification</h2>
              <button
                onClick={() => setShowAgeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 text-slate-300 text-sm space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4 text-amber-200">
                <p className="font-semibold mb-2">Age Restriction Notice</p>
                <p>This game is rated for ages 20 and up. By checking this box, you confirm that you are at least 20 years old.</p>
              </div>
              <div className="mt-6 space-y-3">
                <p className="font-semibold text-white">Why Age Verification?</p>
                <ul className="list-disc list-inside space-y-2 text-xs">
                  <li>This game contains content that may not be suitable for younger audiences</li>
                  <li>Age verification helps us comply with regional regulations</li>
                  <li>It ensures a safe and appropriate gaming environment</li>
                  <li>By agreeing, you confirm your legal age in your jurisdiction</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Information Modal */}
      {showMarketingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Marketing Information</h2>
              <button
                onClick={() => setShowMarketingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 text-slate-300 text-sm space-y-4">
              <p>This is an optional service. You can change your preference anytime in your account settings.</p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 text-blue-200">
                <p className="font-semibold mb-2">What You'll Receive</p>
                <ul className="list-disc list-inside space-y-2 text-xs">
                  <li>Exclusive event announcements and special promotions</li>
                  <li>Game updates and new content releases</li>
                  <li>Seasonal events and limited-time offers</li>
                  <li>Community news and developer updates</li>
                </ul>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <p className="font-semibold text-white">Your Privacy</p>
                <p>We respect your privacy. Your email will only be used for marketing communications related to Ragnarok Universe. You can unsubscribe at any time.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
