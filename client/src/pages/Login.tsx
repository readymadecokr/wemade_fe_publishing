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
  const [step, setStep] = useState<"login" | "register_social" | "register_success" | "find_account">("login");
  
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

  // Handle Guest Mode (PPTX 기획안 11번 슬라이드)
  const handleGuestMode = () => {
    const randomNickname = generateRandomNickname();
    localStorage.setItem("rou_logged_in", "true");
    localStorage.setItem("rou_nickname", randomNickname);
    localStorage.setItem("rou_guest_mode", "true");
    toast.success(`Welcome, ${randomNickname}! You are now in guest mode.`);
    setLocation("/");
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
                <div className="text-center flex flex-col gap-2">
                  <h2 className="text-2xl font-black tracking-wider text-white uppercase font-display">
                    Sign In
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ragnarok Universe & Portal Unified Social Sign In
                  </p>
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
                    <img src={`${ASSET_BASE_URL}/manus-storage/icon_apple_ascii_ae22901e.png`} alt="Apple" className="w-5 h-5" />
                    Sign In with Apple
                  </Button>

                  <Button 
                    onClick={() => handleSocialClick("Facebook")}
                    className="w-full bg-white hover:bg-slate-100 text-black font-bold text-sm py-6 rounded-xl flex items-center justify-center gap-3 shadow-lg cursor-pointer transition-all active:scale-98"
                  >
                    <img src={`${ASSET_BASE_URL}/manus-storage/icon_fb_ascii_315f83e7.png`} alt="Facebook" className="w-5 h-5" />
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
                  
                  <button 
                    onClick={() => { setStep("find_account"); setFindStep("input"); }}
                    className="text-xs text-slate-500 hover:text-primary transition-colors text-center mt-2 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <HelpCircle size={12} /> Forgot your ID?
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SOCIAL REGISTER FORM */}
            {step === "register_social" && (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">
                <div className="text-center flex flex-col gap-2">
                  <Badge className="bg-primary/20 text-primary border border-primary/30 self-center text-[10px]">SIGN UP</Badge>
                  <h2 className="text-2xl font-black tracking-wider text-white uppercase font-display">
                    Complete Your Profile
                  </h2>
                  <p className="text-xs text-slate-400">
                    Complete your profile with {socialProvider} account
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Terms Checkboxes (PPTX 기획안 2번 슬라이드) */}
                  <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/5 mt-2">
                    {/* Select All Checkbox */}
                    <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                      <Checkbox 
                        id="selectAll" 
                        checked={agreeTerms && agreeAge}
                        onCheckedChange={(checked) => {
                          setBgAgreeTerms(!!checked);
                          setBgAgreeAge(!!checked);
                        }}
                        className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="selectAll" className="text-xs text-slate-300 font-semibold cursor-pointer">
                        Select All
                      </Label>
                    </div>

                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox 
                          id="agreeTerms" 
                          checked={agreeTerms} 
                          onCheckedChange={(checked) => setBgAgreeTerms(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="agreeTerms" className="text-xs text-slate-300 font-semibold cursor-pointer">
                            Ragnarok Universe Terms of Service (Required)
                          </Label>
                          <span className="text-[10px] text-slate-500">Agree to service terms and privacy policy</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap ml-2 underline"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="flex items-start gap-3 border-t border-white/5 pt-3 mt-1 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox 
                          id="agreeAge" 
                          checked={agreeAge} 
                          onCheckedChange={(checked) => setBgAgreeAge(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="agreeAge" className="text-xs text-slate-300 font-semibold cursor-pointer">
                            Age 20+ Verification (Required)
                          </Label>
                          <span className="text-[10px] text-slate-500">This game is rated for ages 20 and up</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAgeModal(true)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap ml-2 underline"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="flex items-start gap-3 border-t border-white/5 pt-3 mt-1 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox 
                          id="agreeMarketing" 
                          checked={agreeMarketing} 
                          onCheckedChange={(checked) => setAgreeMarketing(!!checked)}
                          className="mt-0.5 border-white/20 data-[state=checked]:bg-primary"
                        />
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="agreeMarketing" className="text-xs text-slate-300 font-semibold cursor-pointer">
                            Receive Marketing Information (Optional)
                          </Label>
                          <span className="text-[10px] text-slate-500">Get updates about new events, promotions, and game news</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMarketingModal(true)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap ml-2 underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Cloudflare Turnstile Automatic Verification (PPTX 기획안 2번 슬라이드) */}
                  <div className="flex flex-col gap-2 mt-2">
                    <Label className="text-xs text-slate-300 font-semibold">Security Verification (Auto)</Label>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield size={18} className="text-emerald-400 animate-pulse" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-300">Cloudflare Turnstile</span>
                          <span className="text-[10px] text-slate-500">Automatic verification - no action required</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 size={16} /> Verified
                      </div>
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
            <div className="p-6 text-slate-300 text-sm space-y-4">
              <p>For the complete Terms of Service, please visit:</p>
              <a
                href="https://www.warpportal.com/policy/useragreement.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline break-all"
              >
                https://www.warpportal.com/policy/useragreement.html
              </a>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="font-semibold text-white mb-2">Summary:</p>
                <ul className="list-disc list-inside space-y-2 text-xs">
                  <li>You agree to comply with all applicable laws and regulations</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree not to engage in any prohibited activities</li>
                  <li>The game service may be modified or terminated at any time</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                </ul>
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
