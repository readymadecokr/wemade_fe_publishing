import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import ContentRenderer from "@/components/ContentRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

const ALL_NEWS = [
  {
    id: 1,
    title: "Ragnarok Online: Patch Update June 17, 2026",
    date: "June 17, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_pathupdate_17062026_3443274d.jpg",
    content: `This week's patch update for Ragnarok Online brings a host of new content and balance adjustments to enhance your gameplay experience.

**New Content:**
- New seasonal quests available in Prontera and Geffen
- Limited-time summer event items added to the item shop
- New headgear crafting recipes introduced

**Balance Changes:**
- Knight class: Increased Bash damage by 5%
- Wizard class: Reduced cast time for Storm Gust by 0.5 seconds
- Priest class: Holy Light SP cost reduced from 15 to 12

**Bug Fixes:**
- Fixed an issue where party members would not receive EXP correctly in certain dungeons
- Resolved a client crash occurring when opening the equipment window
- Fixed incorrect item descriptions for several newly added items

**System Improvements:**
- Improved server stability during peak hours
- Enhanced anti-cheat detection systems
- Optimized loading times for major cities`,
  },
  {
    id: 2,
    title: "Ragnarok Online: Patch Update June 10, 2026",
    date: "June 10, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_10062026_8b6abd6d.jpg",
    content: `The June 10th patch update brings new quests, item adjustments, and important bug fixes to Ragnarok Online.

**New Quests:**
- "The Lost Merchant" quest chain added in Alberta
- Daily login rewards updated with new summer-themed items
- New achievement system milestones added

**Item Adjustments:**
- Several mid-tier equipment sets have had their stats rebalanced
- New crafting materials added to monster drop tables
- Zeny sink events introduced to stabilize the in-game economy

**Bug Fixes:**
- Fixed skill animation issues for Assassin Cross
- Resolved map loading errors in the Abyss Lake dungeon
- Corrected tooltip errors for several buff skills`,
  },
  {
    id: 3,
    title: "Ragnarok Online: Patch Update June 4, 2026",
    date: "June 4, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_04062026-1_eab33218.jpg",
    content: `June 4th patch update includes new seasonal content and class balance improvements for all adventurers.

**Seasonal Content:**
- Summer Festival event begins — collect Summer Tokens for exclusive rewards
- New NPC vendors added in major cities for event items
- Limited-time summer-themed costumes available

**Class Balance:**
- Sniper: Falcon Assault damage increased by 8%
- Paladin: Shield Chain now properly applies element modifiers
- High Wizard: Napalm Vulcan range slightly increased

**System Updates:**
- Guild storage capacity increased from 600 to 800 slots
- Improved party finder UI with new filter options`,
  },
  {
    id: 4,
    title: "Ragnarok Online: Patch Update May 27, 2026",
    date: "May 27, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_27052026_f346f204.webp",
    content: `May 27th update delivers new dungeon content and significant performance improvements.

**New Dungeon:**
- Thanatos Tower floors 11-13 now accessible
- New boss monster "Thanatos Fragment" added
- Exclusive equipment drops from new dungeon floors

**Performance Improvements:**
- Server tick rate optimized for smoother combat
- Reduced memory usage for clients with lower-end hardware
- Improved network packet handling to reduce lag spikes`,
  },
  {
    id: 5,
    title: "Ragnarok Online: Patch Update May 13, 2026",
    date: "May 13, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_patchupdate_13052026_61973db6.jpg",
    content: `Mid-May patch introduces new equipment sets and PvP balance changes to improve competitive gameplay.

**New Equipment:**
- Shadow Equipment set "Twilight Shadow" added
- New enchantment options for mid-tier armor
- Costume headgear collection expanded with 12 new items

**PvP Changes:**
- WoE castle defense mechanics adjusted
- BG (Battleground) reward rates increased by 15%
- New PvP ranking system introduced`,
  },
  {
    id: 6,
    title: "Ragnarok Online: Patch Update May 6, 2026",
    date: "May 6, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_06052026_ade8545e.jpg",
    content: `Early May update focuses on guild system improvements and new crafting recipes.

**Guild System:**
- Guild hall customization options expanded
- New guild skills added for support roles
- Guild log system improved with more detailed records

**Crafting:**
- 25 new crafting recipes added across all professions
- Crafting success rates adjusted for high-tier items
- New material exchange NPC added in Prontera`,
  },
  {
    id: 7,
    title: "Ragnarok Online: Patch Update April 22, 2026",
    date: "April 22, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_22042026_c87e4338.webp",
    content: `Spring patch brings new seasonal events and limited-time rewards for all players.

**Spring Events:**
- Cherry Blossom Festival event active until May 5
- New spring-themed costumes and headgears available
- Special spring dungeon with unique rewards

**Rewards:**
- Login bonus updated with spring event tokens
- New achievement rewards for event participation`,
  },
  {
    id: 8,
    title: "Ragnarok Online: Patch Update April 1, 2026",
    date: "April 1, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_700x360_01042026_5124866d.webp",
    content: `April Fool's Day special patch with surprise content and limited events — not everything is as it seems!

**April Fool's Content:**
- Special April Fool's Day quests with humorous storylines
- Limited-time joke items available in the shop
- Hidden Easter eggs scattered throughout the game world

**Regular Updates:**
- Standard weekly maintenance and bug fixes applied
- Server stability improvements`,
  },
  {
    id: 9,
    title: "Ragnarok Online: Patch Update March 18, 2026",
    date: "March 18, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate18032026_700x360_e42342e6.webp",
    content: `March 18th patch includes new map areas and improved monster AI for a more challenging experience.

**New Areas:**
- Expanded Niflheim map with new exploration zones
- New field monster spawns in Yuno fields
- Secret dungeon entrance discovered in Comodo

**Monster AI:**
- Boss monsters now use more varied skill patterns
- Field monsters have improved pathfinding
- New elite monster variants added to several dungeons`,
  },
  {
    id: 10,
    title: "Ragnarok Online: Patch Update March 11, 2026",
    date: "March 11, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate11032026_700x360_e6f2da5a.webp",
    content: `New skill updates and party system improvements make grouping with friends more rewarding.

**Skill Updates:**
- Several underused skills have been buffed across all classes
- New skill synergy bonuses added for party play
- Skill description improvements for clarity

**Party System:**
- Party EXP sharing formula adjusted to benefit all party sizes
- New party mission system introduced
- Party leader tools expanded with new management options`,
  },
  {
    id: 11,
    title: "Ragnarok Online: Patch Update March 4, 2026",
    date: "March 4, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_04032026PatchUpdate_700X360_6a1e12c3.webp",
    content: `Early March patch delivers new headgear items and crafting system updates.

**New Headgears:**
- 8 new craftable headgear items added
- Headgear enchantment system expanded
- New headgear quest chain in Lighthalzen

**Crafting System:**
- Crafting UI completely redesigned for better usability
- Batch crafting feature added
- Crafting material preview system implemented`,
  },
  {
    id: 12,
    title: "Ragnarok Online: Patch Update February 4, 2026",
    date: "February 4, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_700X360_04022026_055a0936.webp",
    content: `February patch brings Valentine's Day events and new couple quests for pairs of adventurers.

**Valentine's Events:**
- Couple quest system introduced — complete quests with your partner for exclusive rewards
- Valentine's Day limited items available in the event shop
- Special couple costume set available for a limited time

**Event Details:**
- Event runs from February 4 to February 28
- Collect Chocolate Tokens to exchange for rewards
- New couple-exclusive titles and achievements`,
  },
  {
    id: 13,
    title: "6th Anniversary Music Performance",
    date: "June 1, 2026",
    category: "Event",
    image: "/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_4149e08c.png",
    content: `Celebrate the 6th anniversary of Ragnarok Online with a spectacular live music performance event!

**Event Details:**
- Live orchestral performance of iconic Ragnarok Online music
- Special in-game rewards for all participants
- Anniversary login bonus active for the entire month

**Exclusive Rewards:**
- 6th Anniversary Crown headgear
- Special anniversary title
- Exclusive costume set
- Limited-time pet companion`,
  },
  {
    id: 14,
    title: "TRO Championship 2026 — Registration Open",
    date: "May 20, 2026",
    category: "Event",
    image: "/manus-storage/TRO-Championship-2026_d74b0527.webp",
    content: `The Thailand Ragnarok Online Championship 2026 registration is now open! Compete against the best players in the region.

**Tournament Details:**
- Format: 5v5 WoE-style team battles
- Prize pool: 500,000 THB
- Registration deadline: June 15, 2026
- Tournament dates: July 1-15, 2026

**How to Register:**
- Form a team of 5 players
- Submit your team registration through the official portal
- Complete the qualification rounds to advance to the finals`,
  },
  {
    id: 15,
    title: "Play With Discord — Community Event",
    date: "May 15, 2026",
    category: "Event",
    image: "/manus-storage/ChatGPT-Image-Play-With-Discord_735dde20.webp",
    content: `Join our official Discord server and participate in the Play With Discord community event for exclusive in-game rewards!

**Event Details:**
- Join our Discord server at discord.gg/ragnarokuniversal
- Complete Discord-based challenges and mini-games
- Earn Discord Points to redeem for in-game rewards

**Rewards:**
- Exclusive Discord-themed headgear
- Special Discord title
- In-game currency bonuses
- Limited-time costume items`,
  },
  {
    id: 16,
    title: "LINE OA Official Channel Launch",
    date: "May 20, 2026",
    category: "Event",
    image: "/manus-storage/PR-pack-Line-OA-Cover-700x36020052026_073afc30.webp",
    content: `We are excited to announce the launch of our official LINE Official Account! Follow us for exclusive news, promotions, and giveaways.

**What to Expect:**
- Breaking news and patch update notifications
- Exclusive LINE-only promotions and giveaways
- Direct customer support through LINE chat
- Community polls and feedback channels

**How to Follow:**
- Search for "Ragnarok Universe" in LINE
- Scan the QR code in the banner image
- Follow and receive a welcome gift in-game`,
  },
  {
    id: 17,
    title: "Ragnarok Online MC Championship 2024",
    date: "December 20, 2024",
    category: "Event",
    image: "/manus-storage/20241220_ROMC_PC_Banner_86d74bdb.jpg",
    content: `Relive the excitement of the Ragnarok Online MC Championship 2024 grand finals!

**Event Highlights:**
- 32 teams competed from across Southeast Asia
- Grand finals held in Bangkok, Thailand
- Champion team received 1,000,000 THB prize

**Match Results:**
- Champion: Team Midgard Warriors
- Runner-up: Team Prontera Knights
- Third place: Team Geffen Mages`,
  },
  {
    id: 18,
    title: "GGT RO Shop — Craft & Play",
    date: "April 10, 2026",
    category: "Event",
    image: "/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_37bb44a8.webp",
    content: `New crafting items are now available in the GGT RO Shop! Craft, play, and earn exclusive rewards.

**New Shop Items:**
- Premium crafting material bundles
- Exclusive GGT-branded costume items
- Special crafting boost consumables

**Craft & Play Event:**
- Purchase crafting bundles to earn Craft Points
- Redeem Craft Points for exclusive limited-edition items
- Event runs from April 10 to April 30, 2026`,
  },
];

export default function NewsDetail() {
  const params = useParams<{ id: string }>();
  const newsId = parseInt(params.id ?? "1", 10);
  const item = ALL_NEWS.find((n) => n.id === newsId);

  if (!item) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Link href="/news">
            <Button>Back to News</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const related = ALL_NEWS.filter((n) => n.id !== item.id && n.category === item.category).slice(0, 3);

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-6">
        <div className="container">
          <Link href="/news">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-3">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
        </div>
      </div>

      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white ${
              item.category === "Event" ? "bg-purple-600" : "bg-primary"
            }`}>
              <Tag className="w-3 h-3" />
              {item.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {item.date}
            </span>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden mb-8 border border-border">
            <img
              src={item.image}
              alt={item.title}
              className="w-full object-cover max-h-96"
            />
          </div>

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ContentRenderer content={item.content} />
          </div>

          {/* Back Button */}
          <div className="mt-10 pt-6 border-t border-border">
            <Link href="/news">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to News
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12">
            <h2 className="text-lg font-semibold text-foreground mb-5">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.id} href={`/news/${rel.id}`}>
                  <div className="bg-card border border-border rounded-lg overflow-hidden card-hover cursor-pointer group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">{rel.date}</p>
                      <h3 className="text-xs font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {rel.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
