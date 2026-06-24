import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

// Generate random nickname
const generateRandomNickname = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let nickname = '';
  for (let i = 0; i < 6; i++) nickname += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 4; i++) nickname += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return nickname.split('').sort(() => Math.random() - 0.5).join('');
};

interface SignInPanelProps {
  /** Called after successful login so parent can close the modal */
  onLoginSuccess?: () => void;
}

export default function SignInPanel({ onLoginSuccess }: SignInPanelProps) {
  const [, setLocation] = useLocation();

  const handleSocialClick = (provider: "Google" | "Apple" | "Facebook") => {
    toast.info(`Connecting ${provider} social account...`);
    setTimeout(() => {
      const isRegistered = localStorage.getItem(`rou_registered_${provider.toLowerCase()}`) === "true";
      if (isRegistered) {
        localStorage.setItem("rou_logged_in", "true");
        localStorage.setItem("rou_nickname", localStorage.getItem(`rou_nickname_${provider.toLowerCase()}`) || generateRandomNickname());
        localStorage.setItem("rou_social_provider", provider);
        toast.success(`Successfully signed in with ${provider}!`);
        onLoginSuccess?.();
        window.location.reload();
      } else {
        // New user — go to full registration page
        setLocation("/login");
        onLoginSuccess?.();
      }
    }, 1000);
  };

  const handleGuestMode = () => {
    const randomNickname = generateRandomNickname();
    localStorage.setItem("rou_logged_in", "true");
    localStorage.setItem("rou_nickname", randomNickname);
    localStorage.setItem("rou_guest_mode", "true");
    toast.success(`Welcome, ${randomNickname}! You are now in guest mode.`);
    onLoginSuccess?.();
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl font-black tracking-wider text-white uppercase">
          Sign In
        </h2>
      </div>

      {/* Social Login Buttons */}
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
  );
}
