import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import ContentRenderer from "@/components/ContentRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Bell } from "lucide-react";

const NOTICES = [
  {
    id: 1,
    title: "Server Maintenance Notice — June 24, 2026",
    date: "June 22, 2026",
    category: "Maintenance",
    important: true,
    content: `Dear Adventurers,

We would like to inform you that scheduled server maintenance will take place on June 24, 2026.

**Maintenance Schedule:**
- Start Time: June 24, 2026 at 02:00 (UTC+7)
- End Time: June 24, 2026 at 06:00 (UTC+7)
- Duration: Approximately 4 hours

**During Maintenance:**
All game services, including the game client, website, and Point Shop, will be temporarily unavailable. Please log out before the maintenance begins to avoid any data loss.

**What to Expect After Maintenance:**
- Patch Update June 24 will be applied
- New summer event content will be available
- Various bug fixes and performance improvements

We apologize for any inconvenience this may cause and thank you for your patience. Compensation items will be distributed to all active accounts after maintenance is complete.

Thank you for your continued support of Ragnarok Universe.`,
  },
  {
    id: 2,
    title: "Summer Festival Event Schedule 2026",
    date: "June 20, 2026",
    category: "Event",
    important: false,
    content: `Dear Adventurers,

The Summer Festival 2026 is coming! Prepare for a season full of fun events, exclusive rewards, and special activities.

**Event Period:**
June 25, 2026 — July 31, 2026

**Event Activities:**
- Summer Token Collection: Defeat summer-themed monsters to collect Summer Tokens
- Beach Party Quests: Complete daily quests at the special summer event map
- Sandcastle Building Contest: Compete with other players in the creative building event
- Summer Fishing Tournament: Catch rare fish for exclusive rewards

**Exclusive Rewards:**
- Summer Crown Headgear
- Beach Outfit Costume Set
- Summer Poring Pet
- Limited-time summer-themed mount
- Special summer title "Sun Chaser"

**How to Participate:**
Talk to the Summer Event NPC in Prontera to begin your summer adventure!

We hope you enjoy the Summer Festival 2026. See you in Midgard!`,
  },
  {
    id: 3,
    title: "Anti-Cheat System Update Notice",
    date: "June 18, 2026",
    category: "System",
    important: true,
    content: `Dear Adventurers,

We have updated our anti-cheat detection system to ensure a fair and enjoyable gaming environment for all players.

**What Has Changed:**
- Enhanced detection algorithms for third-party automation programs
- Improved real-time monitoring of suspicious in-game activities
- Stricter enforcement of our Terms of Service regarding cheating

**Consequences for Violations:**
- First offense: 7-day account suspension
- Second offense: 30-day account suspension
- Third offense: Permanent account ban

**Prohibited Activities:**
- Using bots or automation programs
- Exploiting game bugs for unfair advantage
- Using speed hacks or teleport hacks
- Engaging in real-money trading (RMT)

**Reporting Cheaters:**
If you encounter suspicious players, please report them through the in-game reporting system or contact our support team.

We are committed to maintaining a fair gaming environment. Thank you for your cooperation.`,
  },
  {
    id: 4,
    title: "Point Shop New Items Added — June 2026",
    date: "June 15, 2026",
    category: "Shop",
    important: false,
    content: `Dear Adventurers,

New summer-themed items have been added to the Point Shop! These limited-edition items are only available for a limited time.

**New Items:**
- Summer Breeze Headgear (Costume) — 500 Points
- Ocean Wave Costume Set — 1,200 Points
- Tropical Poring Mount — 2,000 Points
- Summer Token Booster Pack — 300 Points
- Beach Party Emote Bundle — 400 Points

**Limited Quantities:**
Please note that some items have limited quantities available. Once sold out, they will not be restocked.

**Sale Period:**
June 15, 2026 — July 31, 2026

Visit the Point Shop now to secure your summer items before they're gone!`,
  },
  {
    id: 5,
    title: "6th Anniversary Celebration Details",
    date: "June 10, 2026",
    category: "Event",
    important: false,
    content: `Dear Adventurers,

We are thrilled to announce the full details for the Ragnarok Online 6th Anniversary Celebration!

**Anniversary Period:**
June 1, 2026 — June 30, 2026

**Special Events:**
- Anniversary Login Bonus: Log in daily to receive exclusive anniversary rewards
- Memory Lane Quest Chain: Relive iconic moments from RO history
- Anniversary Boss Hunt: Defeat special anniversary boss monsters
- Community Screenshot Contest: Share your best RO memories

**Exclusive Anniversary Rewards:**
- 6th Anniversary Crown (Headgear)
- Anniversary Costume Set
- Special Title: "Veteran of Midgard"
- Anniversary Poring Pet
- 6th Anniversary Weapon Skin

**Live Music Performance:**
A special live orchestral performance of iconic Ragnarok Online music will be streamed on our official YouTube channel on June 15, 2026 at 20:00 (UTC+7).

Thank you for 6 wonderful years of adventure. Here's to many more!`,
  },
  {
    id: 6,
    title: "Account Security Reminder",
    date: "June 5, 2026",
    category: "Security",
    important: true,
    content: `Dear Adventurers,

Your account security is our top priority. We want to remind all players to take steps to protect their accounts.

**Security Recommendations:**
- Use a strong, unique password for your Ragnarok Universe account
- Enable two-factor authentication (2FA) in your account settings
- Never share your account credentials with anyone
- Be cautious of phishing websites that impersonate our official site
- Log out of your account when using shared computers

**Warning Signs of Account Compromise:**
- Unexpected login notifications
- Missing items or currency
- Changes to your account settings you didn't make
- Unfamiliar characters on your account

**What to Do If Compromised:**
If you believe your account has been compromised, immediately:
1. Change your password
2. Contact our support team at support@ragnarokuniversal.com
3. Provide your account details for verification

Stay safe, adventurers!`,
  },
  {
    id: 7,
    title: "Server Maintenance Notice — June 10, 2026",
    date: "June 8, 2026",
    category: "Maintenance",
    important: false,
    content: `Dear Adventurers,

Scheduled maintenance will take place on June 10, 2026 for the deployment of the latest patch update.

**Maintenance Schedule:**
- Start Time: June 10, 2026 at 02:00 (UTC+7)
- End Time: June 10, 2026 at 04:00 (UTC+7)
- Duration: Approximately 2 hours

**Changes in This Patch:**
- New quests added in Alberta
- Daily login rewards updated
- Several bug fixes applied

Thank you for your patience during maintenance.`,
  },
  {
    id: 8,
    title: "TRO Championship 2026 Official Rules",
    date: "June 1, 2026",
    category: "Event",
    important: false,
    content: `Dear Adventurers,

The official rules and regulations for the Thailand Ragnarok Online Championship 2026 have been published. All participants must read and agree to these rules before registering.

**Tournament Format:**
- Team size: 5 players per team
- Format: Double elimination bracket
- Match type: WoE-style 5v5 battles

**Eligibility:**
- Players must be at least 18 years old
- Players must have an active Ragnarok Online account in good standing
- Players must be residents of Thailand

**Prize Pool:**
- 1st Place: 300,000 THB + Championship Trophy
- 2nd Place: 150,000 THB
- 3rd Place: 50,000 THB

**Registration:**
Registration is open from June 1 to June 15, 2026. Register through the official tournament portal.

Good luck to all participants!`,
  },
  {
    id: 9,
    title: "Privacy Policy Update Notice",
    date: "May 28, 2026",
    category: "Policy",
    important: true,
    content: `Dear Adventurers,

We have updated our Privacy Policy, effective June 1, 2026. Please review the key changes below.

**Key Changes:**
- Updated data retention policies to comply with new regulations
- Clarified how we use analytics data
- Added information about third-party service providers
- Updated your rights regarding personal data

**What This Means for You:**
Your rights regarding your personal data remain the same. You can still request access, correction, or deletion of your data by contacting us at privacy@gravity.co.kr.

**Full Policy:**
The complete updated Privacy Policy is available on our website. We encourage all users to read the full document.

By continuing to use our services after June 1, 2026, you acknowledge the updated Privacy Policy.

If you have any questions, please contact our privacy team.`,
  },
  {
    id: 10,
    title: "Server Maintenance Notice — May 27, 2026",
    date: "May 25, 2026",
    category: "Maintenance",
    important: false,
    content: `Dear Adventurers,

Scheduled maintenance will take place on May 27, 2026 for system upgrades and patch deployment.

**Maintenance Schedule:**
- Start Time: May 27, 2026 at 02:00 (UTC+7)
- End Time: May 27, 2026 at 05:00 (UTC+7)
- Duration: Approximately 3 hours

**Improvements in This Update:**
- New dungeon content: Thanatos Tower floors 11-13
- Performance optimizations
- Server stability improvements

Thank you for your patience.`,
  },
  {
    id: 11,
    title: "New Payment Methods Available",
    date: "May 20, 2026",
    category: "Shop",
    important: false,
    content: `Dear Adventurers,

We are pleased to announce that new payment methods are now available for Point Shop purchases.

**New Payment Methods:**
- TrueMoney Wallet
- Rabbit LINE Pay
- PromptPay QR Code
- Additional bank transfer options

**Existing Payment Methods:**
- Credit/Debit Cards (Visa, Mastercard)
- PayPal
- AIS, DTAC, TRUE mobile top-up

We are committed to making it as convenient as possible for you to purchase Points. If you encounter any issues with payments, please contact our support team.`,
  },
  {
    id: 12,
    title: "Terms of Service Update",
    date: "May 15, 2026",
    category: "Policy",
    important: true,
    content: `Dear Adventurers,

Our Terms of Service have been updated, effective June 1, 2026. Please review the key changes.

**Key Changes:**
- Virtual Items Policy: Clarified that virtual items have no real-world monetary value
- Age Verification: Added requirement for age verification for Point Shop purchases
- Account Sharing: Clarified rules regarding account sharing between players
- Dispute Resolution: Updated dispute resolution process

**Action Required:**
You will be asked to review and accept the updated Terms of Service upon your next login after June 1, 2026.

The complete updated Terms of Service are available on our website. Please read them carefully.`,
  },
  {
    id: 13,
    title: "Discord Server Rules Update",
    date: "May 10, 2026",
    category: "Community",
    important: false,
    content: `Dear Community Members,

The rules for our official Discord server have been updated. All members are required to review and comply with the new guidelines.

**Key Rule Changes:**
- Added rules regarding spoiler content
- Updated language policy for non-English channels
- New rules for the trading channel
- Updated moderation procedures

**Consequences for Violations:**
- Warning system: 3 warnings result in a temporary mute
- Severe violations may result in immediate ban

Please review the full rules in the #rules channel on our Discord server. Thank you for helping us maintain a positive community!`,
  },
  {
    id: 14,
    title: "Server Maintenance Notice — May 13, 2026",
    date: "May 11, 2026",
    category: "Maintenance",
    important: false,
    content: `Dear Adventurers,

Scheduled maintenance will take place on May 13, 2026 for patch deployment.

**Maintenance Schedule:**
- Start Time: May 13, 2026 at 02:00 (UTC+7)
- End Time: May 13, 2026 at 04:30 (UTC+7)
- Duration: Approximately 2.5 hours

**Changes in This Patch:**
- New equipment sets added
- PvP balance adjustments
- Bug fixes

Thank you for your patience.`,
  },
  {
    id: 15,
    title: "Compensation Notice — April Service Disruption",
    date: "May 5, 2026",
    category: "Compensation",
    important: false,
    content: `Dear Adventurers,

We sincerely apologize for the service disruption that occurred on April 15-16, 2026. As compensation for the inconvenience, we have distributed the following items to all active accounts.

**Compensation Items:**
- 3x EXP Boost Potion (1 hour)
- 1x Premium Costume Box
- 500,000 Zeny
- 3x Kafra Teleport Ticket

**Distribution:**
Items have been sent to your in-game mailbox. Please log in and collect them before May 31, 2026.

We have taken steps to prevent similar disruptions in the future and have improved our server infrastructure. Thank you for your understanding and continued support.`,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Maintenance: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Event: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  System: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Shop: "bg-green-500/10 text-green-600 dark:text-green-400",
  Security: "bg-red-500/10 text-red-600 dark:text-red-400",
  Policy: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  Community: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Compensation: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export default function NoticeDetail() {
  const params = useParams<{ id: string }>();
  const noticeId = parseInt(params.id ?? "1", 10);
  const item = NOTICES.find((n) => n.id === noticeId);

  if (!item) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Notice Not Found</h1>
          <Link href="/notice">
            <Button>Back to Notice</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const prevNotice = NOTICES.find((n) => n.id === noticeId - 1);
  const nextNotice = NOTICES.find((n) => n.id === noticeId + 1);

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-6">
        <div className="container">
          <Link href="/notice">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-3">
              <ArrowLeft className="w-4 h-4" /> Back to Notice
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
        </div>
      </div>

      <div className="container py-10 max-w-3xl mx-auto">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-8">
          {item.important && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
              <Bell className="w-3 h-3" /> Important
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category] ?? "bg-muted text-muted-foreground"}`}>
            {item.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {item.date}
          </span>
        </div>

        {/* Content */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <ContentRenderer content={item.content} />
          </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border gap-4">
          {prevNotice ? (
            <Link href={`/notice/${prevNotice.id}`}>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="line-clamp-1">{prevNotice.title}</span>
              </button>
            </Link>
          ) : (
            <div />
          )}
          <Link href="/notice">
            <Button variant="outline" size="sm">List</Button>
          </Link>
          {nextNotice ? (
            <Link href={`/notice/${nextNotice.id}`}>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-right">
                <span className="line-clamp-1">{nextNotice.title}</span>
                <ArrowLeft className="w-4 h-4 shrink-0 rotate-180" />
              </button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </Layout>
  );
}
