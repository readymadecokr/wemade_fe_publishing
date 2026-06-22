import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

/**
 * Design Philosophy: Flyff Universe + Play2Bit Style
 * - Professional gaming portal design
 * - News detail page: single article view with image, meta, and content
 */

// Shared news data (same as News.tsx)
const newsData = [
  {
    id: 1,
    title: "Ragnarok Online: Patch Update June 17, 2026",
    date: "6/17/2026 10:38 PM",
    category: "Update",
    image: `${ASSET_BASE_URL}/manus-storage/RO1_pathupdate_17062026_f83f13b8_0ccbefaa.jpg`,
    content: `This week's patch update for Ragnarok Online brings a host of new content and balance adjustments to enhance your gameplay experience.\n\nNew seasonal quests are now available in Prontera and Geffen, alongside limited-time summer event items added to the item shop. New headgear crafting recipes have also been introduced.\n\nBalance changes include a 5% increase to Knight class Bash damage, a 0.5-second reduction in cast time for Wizard's Storm Gust, and reduced SP cost for Priest's Holy Light from 15 to 12.\n\nBug fixes address incorrect EXP distribution in certain dungeons, a client crash when opening the equipment window, and incorrect item descriptions for several newly added items.\n\nServer stability has been improved during peak hours, and anti-cheat detection systems have been enhanced.`,
  },
  {
    id: 2,
    title: "Ragnarok Online: Patch Update June 10, 2026",
    date: "6/17/2026 10:32 PM",
    category: "Event",
    image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_10062026_219a465c_5903482d.jpg`,
    content: `The June 10th patch update brings new quests, item adjustments, and important bug fixes to Ragnarok Online.\n\nA new "The Lost Merchant" quest chain has been added in Alberta, and daily login rewards have been updated with new summer-themed items. New achievement system milestones are also available.\n\nSeveral mid-tier equipment sets have had their stats rebalanced, new crafting materials have been added to monster drop tables, and Zeny sink events have been introduced to stabilize the in-game economy.\n\nBug fixes include skill animation issues for Assassin Cross, map loading errors in the Abyss Lake dungeon, and corrected tooltip errors for several buff skills.`,
  },
  {
    id: 3,
    title: "Ragnarok Online: Patch Update June 4, 2026",
    date: "6/17/2026 1:08:40 PM",
    category: "Event",
    image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_04062026-1_29153260_878bf95f.jpg`,
    content: `The June 4th patch update includes new seasonal content and class balance improvements for all adventurers.\n\nThe Summer Festival event has begun — collect Summer Tokens for exclusive rewards. New NPC vendors have been added in major cities for event items, and limited-time summer-themed costumes are now available.\n\nClass balance changes include an 8% increase to Sniper's Falcon Assault damage, a fix for Paladin's Shield Chain to properly apply element modifiers, and a slight range increase for High Wizard's Napalm Vulcan.\n\nGuild storage capacity has been increased from 600 to 800 slots, and the party finder UI has been improved with new filter options.`,
  },
  {
    id: 4,
    title: "Ragnarok Online: Patch Update May 27, 2026",
    date: "5/28/2026 4:07:24 PM",
    category: "Interview",
    image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_27052026_953943aa_fa54354f.webp`,
    content: `The May 27th update delivers new dungeon content and significant performance improvements to Ragnarok Online.\n\nThanathos Tower floors 11–13 are now accessible, featuring the new boss monster "Thanatos Fragment" with exclusive equipment drops.\n\nServer tick rate has been optimized for smoother combat, memory usage has been reduced for clients with lower-end hardware, and network packet handling has been improved to reduce lag spikes during peak hours.`,
  },
  {
    id: 5,
    title: "Gravity Game Tech Launches LINE Official Account",
    date: "5/28/2026 2:18:45 PM",
    category: "Event",
    image: `${ASSET_BASE_URL}/manus-storage/PR-pack-Line-OA-Cover-700x36020052026_d4332f85_70996280.webp`,
    content: `Gravity Game Tech is excited to announce the launch of its official LINE Official Account! Follow us for exclusive news, promotions, and giveaways directly on LINE.\n\nBy following our LINE OA, you will receive breaking news and patch update notifications, exclusive LINE-only promotions and giveaways, direct customer support through LINE chat, and community polls and feedback channels.\n\nTo follow, search for "Gravity Game Tech" in LINE or scan the QR code in the banner image. All new followers will receive a welcome gift in-game.`,
  },
  {
    id: 6,
    title: "Ragnarok Online: Music Contest Winners Announced",
    date: "5/22/2026 2:03:43 PM",
    category: "Update",
    image: `${ASSET_BASE_URL}/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_bc640d8a_0c8f7386.png`,
    content: `We are thrilled to announce the winners of the Ragnarok Online 6th Anniversary Music Contest!\n\nThe contest received hundreds of submissions from talented musicians across the community. After careful evaluation by our panel of judges, the winners have been selected.\n\nFirst Place: "Echoes of Midgard" by adventurer Melodia_RO — a sweeping orchestral arrangement of the Prontera theme.\n\nSecond Place: "Poring Dance Remix" by DJ_Kafra — an upbeat electronic reimagining of the beloved Poring theme.\n\nThird Place: "Moonlit Payon" by GuitarHero_RO — a beautiful acoustic guitar arrangement of the Payon field music.\n\nAll winners will receive exclusive in-game rewards and their tracks will be featured in the official 6th Anniversary celebration stream.`,
  },
  {
    id: 7,
    title: "Ragnarok Online: Patch Update May 13, 2026",
    date: "5/14/2026 8:54:59 AM",
    category: "Update",
    image: `${ASSET_BASE_URL}/manus-storage/RO1_patchupdate_13052026_700e9d1f_01c2e74f.jpg`,
    content: `The mid-May patch introduces new equipment sets and PvP balance changes to improve competitive gameplay.\n\nA new Shadow Equipment set "Twilight Shadow" has been added, along with new enchantment options for mid-tier armor and 12 new costume headgear items.\n\nPvP changes include adjusted WoE castle defense mechanics, a 15% increase in BG (Battleground) reward rates, and the introduction of a new PvP ranking system.\n\nAdditionally, several underused skills have been buffed, and the party EXP sharing formula has been adjusted to benefit all party sizes.`,
  },
  {
    id: 8,
    title: "Ragnarok Online: Special Anniversary Event",
    date: "5/11/2026 10:02:34 AM",
    category: "Event",
    image: `${ASSET_BASE_URL}/manus-storage/RO1_04032026PatchUpdate_700X360_3345ccff_33b86c1a.webp`,
    content: `Celebrate the Ragnarok Online Special Anniversary with a month full of exclusive events and rewards!\n\nThe Anniversary Login Bonus is now active — log in daily to receive exclusive anniversary rewards throughout the entire month.\n\nSpecial anniversary boss monsters have been added to various field maps. Defeating them yields Anniversary Coins that can be exchanged for exclusive items at the Anniversary NPC in Prontera.\n\nExclusive anniversary rewards include the Anniversary Crown headgear, a special Anniversary Costume Set, the title "Veteran of Midgard", an Anniversary Poring Pet, and a limited-edition Anniversary Weapon Skin.`,
  },
  {
    id: 9,
    title: "Ragnarok Monster Shop @ Craft & Play 2026",
    date: "5/6/2026 5:40:04 PM",
    category: "Event",
    image: `${ASSET_BASE_URL}/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_46621aa6_4cf197fb.webp`,
    content: `The Ragnarok Monster Shop will be making a special appearance at the Craft & Play 2026 event!\n\nVisit our booth to purchase exclusive merchandise, meet the development team, and get a first look at upcoming content. Special event-only items will be available for purchase at the booth, including limited-edition figures, apparel, and accessories.\n\nThe Craft & Play 2026 event takes place on May 15–17, 2026 at the Bangkok International Trade & Exhibition Centre (BITEC). Our booth will be located in Hall 5, Booth C-12.\n\nAttendees who visit our booth will receive a free exclusive in-game item code. Quantities are limited, so arrive early!`,
  },
  {
    id: 10,
    title: "Ragnarok Online: Patch Update May 6, 2026",
    date: "5/6/2026 2:47:16 PM",
    category: "Update",
    image: `${ASSET_BASE_URL}/manus-storage/RO1_06052026_47ecad62_ae242c6b.jpg`,
    content: `The early May update focuses on guild system improvements and new crafting recipes.\n\nGuild hall customization options have been expanded, new guild skills have been added for support roles, and the guild log system has been improved with more detailed records.\n\n25 new crafting recipes have been added across all professions, crafting success rates have been adjusted for high-tier items, and a new material exchange NPC has been added in Prontera.\n\nAdditionally, the crafting UI has been completely redesigned for better usability, a batch crafting feature has been added, and a crafting material preview system has been implemented.`,
  },
  {
    id: 11,
    title: "Ragnarok Online: Patch Update April 29, 2026",
    date: "4/30/2026 11:29:14 AM",
    category: "Event",
    image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate18032026_700x360_68e5480e_82a64304.webp`,
    content: `The April 29th patch brings new seasonal events and limited-time rewards for all players.\n\nThe Cherry Blossom Festival event is now active until May 15. New spring-themed costumes and headgears are available, and a special spring dungeon with unique rewards has been added.\n\nLogin bonuses have been updated with spring event tokens, and new achievement rewards for event participation are available.\n\nThis patch also includes standard weekly maintenance improvements and various bug fixes reported by the community.`,
  },
  {
    id: 12,
    title: "Ragnarok Online: Patch Update April 22, 2026",
    date: "4/30/2026 11:27:05 AM",
    category: "Update",
    image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_22042026_337d2472_7c5c5406.webp`,
    content: `The April 22nd patch delivers new map areas and improved monster AI for a more challenging experience.\n\nThe Niflheim map has been expanded with new exploration zones, new field monster spawns have been added to Yuno fields, and a secret dungeon entrance has been discovered in Comodo.\n\nBoss monsters now use more varied skill patterns, field monsters have improved pathfinding, and new elite monster variants have been added to several dungeons.\n\nThis update also includes performance optimizations and several community-requested quality-of-life improvements.`,
  },
  {
    id: 13,
    title: "Ragnarok Online: Patch Update April 8, 2026",
    date: "4/8/2026 2:24:50 PM",
    category: "Update",
    image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_700x360_01042026_04e81156_70b5b497.webp`,
    content: `The April 8th patch introduces new skill updates and party system improvements, making grouping with friends more rewarding.\n\nSeveral underused skills have been buffed across all classes, new skill synergy bonuses have been added for party play, and skill descriptions have been improved for clarity.\n\nThe party EXP sharing formula has been adjusted to benefit all party sizes, a new party mission system has been introduced, and party leader tools have been expanded with new management options.\n\nAdditionally, the April Fool's Day special event content has been removed and replaced with regular spring content.`,
  },
  {
    id: 14,
    title: "Ragnarok Online: Patch Update April 1, 2026",
    date: "4/8/2026 2:22:00 PM",
    category: "Event",
    image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate_700X360_04022026_d0450ed3_83809f8e.webp`,
    content: `April Fool's Day special patch with surprise content and limited events — not everything is as it seems!\n\nSpecial April Fool's Day quests with humorous storylines have been added, limited-time joke items are available in the shop, and hidden Easter eggs have been scattered throughout the game world.\n\nThe April Fool's event runs from April 1–3, 2026. All event items will be removed after the event ends.\n\nRegular weekly maintenance and bug fixes have also been applied alongside the event content.`,
  },
  {
    id: 15,
    title: "Ragnarok Online: Patch Update March 25, 2026",
    date: "4/7/2026 6:49:23 AM",
    category: "Update",
    image: `${ASSET_BASE_URL}/manus-storage/RO_PatchUpdate11032026_700x360_e08b651b_934c919f.webp`,
    content: `The March 25th patch delivers new headgear items and crafting system updates.\n\nEight new craftable headgear items have been added, the headgear enchantment system has been expanded, and a new headgear quest chain is available in Lighthalzen.\n\nThe crafting UI has been completely redesigned for better usability, a batch crafting feature has been added, and a crafting material preview system has been implemented.\n\nThis patch also includes standard bug fixes and server stability improvements based on community feedback.`,
  },
];

function NewsDetailContent() {
  const params = useParams();
  const newsId = parseInt(params.id || "1");

  const news = newsData.find(n => n.id === newsId);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Update":
        return "bg-purple-100 text-purple-700";
      case "Event":
        return "bg-pink-100 text-pink-700";
      case "Interview":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!news) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">News Not Found</h1>
          <Link href="/news">
            <Button className="bg-purple-600 hover:bg-purple-700">Back to News</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <>
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
          <div className="container">
            <Link href="/news" className="flex items-center gap-2 text-purple-100 hover:text-white mb-4 w-fit">
              <ArrowLeft size={20} />
              Back to News
            </Link>
            <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">{news.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded text-xs font-semibold ${getCategoryColor(news.category)}`}>
                {news.category.toLowerCase()}
              </span>
              <span className="text-purple-100 text-sm">{news.date}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <main className="container py-10">
          <div className="max-w-3xl mx-auto">
            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden mb-8 border border-purple-100 shadow-sm">
              <img
                src={news.image}
                alt={news.title}
                className="w-full object-cover max-h-96"
              />
            </div>

            {/* Body Text */}
            <div className="bg-white rounded-xl border border-purple-100 p-6 md:p-8 mb-8">
              {news.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-slate-700 text-base leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Back Button */}
            <Link href="/news">
              <Button variant="outline" className="border-purple-200 hover:bg-purple-50 gap-2">
                <ArrowLeft size={16} />
                Back to News
              </Button>
            </Link>
          </div>

        </main>
      </>
    </Layout>
  );
}

export default function NewsDetailPage() {
  return <NewsDetailContent />;
}
