import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Shield, ExternalLink, LogIn } from "lucide-react";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [agreements, setAgreements] = useState({
    terms: false,
    age: false,
    marketing: false,
  });
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [showAgePopup, setShowAgePopup] = useState(false);
  const [showMarketingPopup, setShowMarketingPopup] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/my-page");
    }
  }, [isAuthenticated, loading, setLocation]);

  const canProceed = agreements.terms && agreements.age;

  const handleSignIn = () => {
    if (!canProceed) return;
    window.location.href = getLoginUrl();
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to access your Ragnarok Universe account
          </p>
        </div>
      </div>

      <div className="container py-16 flex justify-center">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/manus-storage/logo_main_ascii_91a16bbc.png"
                alt="Ragnarok Universe"
                className="h-14 w-auto object-contain"
              />
            </div>

            <h2 className="text-xl font-bold text-card-foreground text-center mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Sign in with your Ragnarok Universe account to continue your adventure.
            </p>

            {/* Agreements */}
            <div className="space-y-3 mb-6">
              {/* Terms of Service */}
              <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                <Checkbox
                  id="terms"
                  checked={agreements.terms}
                  onCheckedChange={(v) => setAgreements((a) => ({ ...a, terms: !!v }))}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor="terms" className="text-sm font-medium text-card-foreground cursor-pointer">
                    Terms of Service <span className="text-red-500 text-xs">(required)</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    I agree to the Ragnarok Universe Terms of Service.
                  </p>
                </div>
                <button
                  onClick={() => setShowTermsPopup(true)}
                  className="shrink-0 text-xs text-primary hover:underline flex items-center gap-0.5"
                >
                  View <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Age Verification */}
              <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                <Checkbox
                  id="age"
                  checked={agreements.age}
                  onCheckedChange={(v) => setAgreements((a) => ({ ...a, age: !!v }))}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor="age" className="text-sm font-medium text-card-foreground cursor-pointer">
                    Age 20+ Verification <span className="text-red-500 text-xs">(required)</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    I confirm that I am 20 years of age or older.
                  </p>
                </div>
                <button
                  onClick={() => setShowAgePopup(true)}
                  className="shrink-0 text-xs text-primary hover:underline flex items-center gap-0.5"
                >
                  View <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                <Checkbox
                  id="marketing"
                  checked={agreements.marketing}
                  onCheckedChange={(v) => setAgreements((a) => ({ ...a, marketing: !!v }))}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor="marketing" className="text-sm font-medium text-card-foreground cursor-pointer">
                    Receive Marketing Information <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    I agree to receive news, events, and promotional information.
                  </p>
                </div>
                <button
                  onClick={() => setShowMarketingPopup(true)}
                  className="shrink-0 text-xs text-primary hover:underline flex items-center gap-0.5"
                >
                  View <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              className="w-full gaming-gradient text-white font-semibold py-5 text-base gap-2 disabled:opacity-50"
              onClick={handleSignIn}
              disabled={!canProceed || loading}
            >
              <LogIn className="w-5 h-5" />
              Sign In with Ragnarok Universe
            </Button>

            {!canProceed && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Please accept the required agreements to continue.
              </p>
            )}

            {/* Security Note */}
            <div className="flex items-center gap-2 mt-6 pt-5 border-t border-border">
              <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                Your account is protected by Manus OAuth. We never store your password.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Terms Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowTermsPopup(false)}>
          <div className="bg-popover border border-border rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-popover-foreground mb-4">Terms of Service</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              By using the Ragnarok Universe gaming portal, you agree to abide by our Terms of Service. These terms govern your use of our services, including the game client, website, and Point Shop.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              You must be at least 13 years of age to use this Service. You are responsible for maintaining the security of your account and all activities that occur under it.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Prohibited activities include cheating, hacking, exploiting bugs, and engaging in real-money trading. Violations may result in account suspension or permanent ban.
            </p>
            <div className="flex gap-2">
              <a href="/terms-of-service" target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1">
                Read Full Terms <ExternalLink className="w-3 h-3" />
              </a>
              <span className="ml-auto">
                <Button size="sm" onClick={() => { setAgreements((a) => ({ ...a, terms: true })); setShowTermsPopup(false); }}>
                  Accept & Close
                </Button>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Age Popup */}
      {showAgePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAgePopup(false)}>
          <div className="bg-popover border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-popover-foreground mb-4">Age 20+ Verification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Certain features of the Ragnarok Universe platform, including the Point Shop and in-game purchases, require users to be at least 20 years of age.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              By checking this box, you confirm that you are 20 years of age or older and are legally permitted to make purchases on this platform.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowAgePopup(false)}>Close</Button>
              <Button size="sm" onClick={() => { setAgreements((a) => ({ ...a, age: true })); setShowAgePopup(false); }}>
                Confirm Age & Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Popup */}
      {showMarketingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowMarketingPopup(false)}>
          <div className="bg-popover border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-popover-foreground mb-4">Receive Marketing Information</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              By opting in, you agree to receive marketing communications from Ragnarok Universe, including news about game updates, events, promotions, and exclusive offers.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              You can unsubscribe from marketing communications at any time through your account settings. This is entirely optional and will not affect your ability to use the Service.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowMarketingPopup(false)}>Decline</Button>
              <Button size="sm" onClick={() => { setAgreements((a) => ({ ...a, marketing: true })); setShowMarketingPopup(false); }}>
                Accept & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
