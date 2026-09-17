import { Link } from "wouter";
import "../pages/reference-home.css";

const DISCORD_URL = "https://discord.gg/yVWJkWdkAU";

interface ServiceFooterProps {
  onPrivacySettings?: () => void;
  snapPanel?: boolean;
}

/**
 * The single Footer contract for the public Ragnarok Universe service.
 * Home and all shared-chrome service pages use this component so the brand,
 * legal links, social marks, spacing, and mobile copyright layout cannot drift.
 */
export default function ServiceFooter({ onPrivacySettings, snapPanel = false }: ServiceFooterProps) {
  return (
    <footer className="react-home-footer" data-snap-panel={snapPanel || undefined} aria-label="Ragnarok Universe footer">
      <div className="react-home-footer__inner">
        <div>
          <div className="react-home-footer__brands">GRAVITY <i /> WEMADE CONNECT <i /> GALA</div>
          <nav>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            {onPrivacySettings ? (
              <button type="button" className="react-home-footer__privacy-settings" onClick={onPrivacySettings}>Privacy Settings</button>
            ) : (
              <Link href="/privacy-policy">Privacy Settings</Link>
            )}
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Customer Support</a>
          </nav>
          <img src="/manus-storage/rou-gravity-logo-white_c5669483.png" alt="GRAVITY" loading="lazy" />
          <p>
            <span>Copyright © Gravity Co., LTD &amp; Lee MyoungJin(studio DTDS). All Rights Reserved.</span>
            <span>All trademarks used on this website are the property of their respective owners.</span>
          </p>
        </div>
        <div className="react-home-footer__social" aria-label="Official social links">
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" aria-label="Discord"><img src="/manus-storage/Discord_icon_230fdb89_6026051e.png" alt="" /></a>
          <a href="https://facebook.com/RagnarokUniverseEN" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><img src="/manus-storage/facebook-logo-primary_2867583f.webp" alt="" /></a>
          <a href="https://www.youtube.com/@RagnarokUniverse" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg></a>
          <a href="https://x.com/RagUniOfficial" target="_blank" rel="noopener noreferrer" aria-label="X" className="react-home-footer__social-x"><img src="/manus-storage/x-logo-black_193d8b29.webp" alt="" /></a>
        </div>
      </div>
    </footer>
  );
}
