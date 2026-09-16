export type LegacyServiceNews = {
  sourceId: number;
  title: string;
  publishedAt: string;
  category: string;
  imageUrl: string | null;
  content: string;
  summary?: string;
};

/**
 * 서비스 News에 기존에 하드코딩돼 있던 실제 기사 데이터입니다.
 * 이 모듈은 일회성 DB 이전 이력용이며, 서비스 화면은 이 값을 직접 사용하지 않습니다.
 */
export const legacyServiceNews: LegacyServiceNews[] = [
  {
    sourceId: 1,
    title: "Ragnarok Online: Patch Update June 17, 2026",
    publishedAt: "6/17/2026 10:38 PM",
    category: "Update",
    imageUrl: "/manus-storage/RO1_pathupdate_17062026_f83f13b8_0ccbefaa.jpg",
    summary: "The latest game updates and community announcements from Ragnarok Universe.",
    content: `This week's patch update for Ragnarok Online brings a host of new content and balance adjustments to enhance your gameplay experience.

New seasonal quests are now available in Prontera and Geffen, alongside limited-time summer event items added to the item shop. New headgear crafting recipes have also been introduced.

Balance changes include a 5% increase to Knight class Bash damage, a 0.5-second reduction in cast time for Wizard's Storm Gust, and reduced SP cost for Priest's Holy Light from 15 to 12.

Bug fixes address incorrect EXP distribution in certain dungeons, a client crash when opening the equipment window, and incorrect item descriptions for several newly added items.

Server stability has been improved during peak hours, and anti-cheat detection systems have been enhanced.`,
  },
  {
    sourceId: 2,
    title: "Ragnarok Online: Patch Update June 10, 2026",
    publishedAt: "6/17/2026 10:32 PM",
    category: "Event",
    imageUrl: "/manus-storage/RO_PatchUpdate_10062026_219a465c_5903482d.jpg",
    summary: "Discover the newest event information and content updates from Midgard.",
    content: `The June 10th patch update brings new quests, item adjustments, and important bug fixes to Ragnarok Online.

A new "The Lost Merchant" quest chain has been added in Alberta, and daily login rewards have been updated with new summer-themed items. New achievement system milestones are also available.

Several mid-tier equipment sets have had their stats rebalanced, new crafting materials have been added to monster drop tables, and Zeny sink events have been introduced to stabilize the in-game economy.

Bug fixes include skill animation issues for Assassin Cross, map loading errors in the Abyss Lake dungeon, and corrected tooltip errors for several buff skills.`,
  },
  {
    sourceId: 3,
    title: "Ragnarok Online: Patch Update June 4, 2026",
    publishedAt: "6/17/2026 1:08:40 PM",
    category: "Event",
    imageUrl: "/manus-storage/RO_PatchUpdate_04062026-1_29153260_878bf95f.jpg",
    summary: "Keep up with the latest Ragnarok Universe news and event updates.",
    content: `The June 4th patch update includes new seasonal content and class balance improvements for all adventurers.

The Summer Festival event has begun — collect Summer Tokens for exclusive rewards. New NPC vendors have been added in major cities for event items, and limited-time summer-themed costumes are now available.

Class balance changes include an 8% increase to Sniper's Falcon Assault damage, a fix for Paladin's Shield Chain to properly apply element modifiers, and a slight range increase for High Wizard's Napalm Vulcan.

Guild storage capacity has been increased from 600 to 800 slots, and the party finder UI has been improved with new filter options.`,
  },
  {
    sourceId: 4,
    title: "Ragnarok Online: Patch Update May 27, 2026",
    publishedAt: "5/28/2026 4:07:24 PM",
    category: "Interview",
    imageUrl: "/manus-storage/RO_PatchUpdate_27052026_953943aa_fa54354f.webp",
    summary: "Read the newest interviews, patch notes, and community announcements.",
    content: `The May 27th update delivers new dungeon content and significant performance improvements to Ragnarok Online.

Thanathos Tower floors 11–13 are now accessible, featuring the new boss monster "Thanatos Fragment" with exclusive equipment drops.

Server tick rate has been optimized for smoother combat, memory usage has been reduced for clients with lower-end hardware, and network packet handling has been improved to reduce lag spikes during peak hours.`,
  },
  {
    sourceId: 5,
    title: "Gravity Game Tech Launches LINE Official Account",
    publishedAt: "5/28/2026 2:18:45 PM",
    category: "Event",
    imageUrl: "/manus-storage/PR-pack-Line-OA-Cover-700x36020052026_d4332f85_70996280.webp",
    content: `Gravity Game Tech is excited to announce the launch of its official LINE Official Account! Follow us for exclusive news, promotions, and giveaways directly on LINE.

By following our LINE OA, you will receive breaking news and patch update notifications, exclusive LINE-only promotions and giveaways, direct customer support through LINE chat, and community polls and feedback channels.

To follow, search for "Gravity Game Tech" in LINE or scan the QR code in the banner image. All new followers will receive a welcome gift in-game.`,
  },
  {
    sourceId: 6,
    title: "Ragnarok Online: Music Contest Winners Announced",
    publishedAt: "5/22/2026 2:03:43 PM",
    category: "Update",
    imageUrl: "/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_bc640d8a_0c8f7386.png",
    content: `We are thrilled to announce the winners of the Ragnarok Online 6th Anniversary Music Contest!

The contest received hundreds of submissions from talented musicians across the community. After careful evaluation by our panel of judges, the winners have been selected.

First Place: "Echoes of Midgard" by adventurer Melodia_RO — a sweeping orchestral arrangement of the Prontera theme.

Second Place: "Poring Dance Remix" by DJ_Kafra — an upbeat electronic reimagining of the beloved Poring theme.

Third Place: "Moonlit Payon" by GuitarHero_RO — a beautiful acoustic guitar arrangement of the Payon field music.

All winners will receive exclusive in-game rewards and their tracks will be featured in the official 6th Anniversary celebration stream.`,
  },
  {
    sourceId: 7,
    title: "Ragnarok Online: Patch Update May 13, 2026",
    publishedAt: "5/14/2026 8:54:59 AM",
    category: "Update",
    imageUrl: "/manus-storage/RO1_patchupdate_13052026_700e9d1f_01c2e74f.jpg",
    content: `The mid-May patch introduces new equipment sets and PvP balance changes to improve competitive gameplay.

A new Shadow Equipment set "Twilight Shadow" has been added, along with new enchantment options for mid-tier armor and 12 new costume headgear items.

PvP changes include adjusted WoE castle defense mechanics, a 15% increase in BG (Battleground) reward rates, and the introduction of a new PvP ranking system.

Additionally, several underused skills have been buffed, and the party EXP sharing formula has been adjusted to benefit all party sizes.`,
  },
  {
    sourceId: 8,
    title: "Ragnarok Online: Special Anniversary Event",
    publishedAt: "5/11/2026 10:02:34 AM",
    category: "Event",
    imageUrl: "/manus-storage/RO1_04032026PatchUpdate_700X360_3345ccff_33b86c1a.webp",
    content: `Celebrate the Ragnarok Online Special Anniversary with a month full of exclusive events and rewards!

The Anniversary Login Bonus is now active — log in daily to receive exclusive anniversary rewards throughout the entire month.

Special anniversary boss monsters have been added to various field maps. Defeating them yields Anniversary Coins that can be exchanged for exclusive items at the Anniversary NPC in Prontera.

Exclusive anniversary rewards include the Anniversary Crown headgear, a special Anniversary Costume Set, the title "Veteran of Midgard", an Anniversary Poring Pet, and a limited-edition Anniversary Weapon Skin.`,
  },
  {
    sourceId: 9,
    title: "Ragnarok Monster Shop @ Craft & Play 2026",
    publishedAt: "5/6/2026 5:40:04 PM",
    category: "Event",
    imageUrl: "/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_46621aa6_4cf197fb.webp",
    content: `The Ragnarok Monster Shop will be making a special appearance at the Craft & Play 2026 event!

Visit our booth to purchase exclusive merchandise, meet the development team, and get a first look at upcoming content. Special event-only items will be available for purchase at the booth, including limited-edition figures, apparel, and accessories.

The Craft & Play 2026 event takes place on May 15–17, 2026 at the Bangkok International Trade & Exhibition Centre (BITEC). Our booth will be located in Hall 5, Booth C-12.

Attendees who visit our booth will receive a free exclusive in-game item code. Quantities are limited, so arrive early!`,
  },
  {
    sourceId: 10,
    title: "Ragnarok Online: Patch Update May 6, 2026",
    publishedAt: "5/6/2026 2:47:16 PM",
    category: "Update",
    imageUrl: "/manus-storage/RO1_06052026_47ecad62_ae242c6b.jpg",
    content: `The early May update focuses on guild system improvements and new crafting recipes.

Guild hall customization options have been expanded, new guild skills have been added for support roles, and the guild log system has been improved with more detailed records.

25 new crafting recipes have been added across all professions, crafting success rates have been adjusted for high-tier items, and a new material exchange NPC has been added in Prontera.

Additionally, the crafting UI has been completely redesigned for better usability, a batch crafting feature has been added, and a crafting material preview system has been implemented.`,
  },
  {
    sourceId: 11,
    title: "Ragnarok Online: Patch Update April 29, 2026",
    publishedAt: "4/30/2026 11:29:14 AM",
    category: "Event",
    imageUrl: "/manus-storage/RO_PatchUpdate18032026_700x360_68e5480e_82a64304.webp",
    content: `The April 29th patch brings new seasonal events and limited-time rewards for all players.

The Cherry Blossom Festival event is now active until May 15. New spring-themed costumes and headgears are available, and a special spring dungeon with unique rewards has been added.

Login bonuses have been updated with spring event tokens, and new achievement rewards for event participation are available.

This patch also includes standard weekly maintenance improvements and various bug fixes reported by the community.`,
  },
  {
    sourceId: 12,
    title: "Ragnarok Online: Patch Update April 22, 2026",
    publishedAt: "4/30/2026 11:27:05 AM",
    category: "Update",
    imageUrl: "/manus-storage/RO_PatchUpdate_22042026_337d2472_7c5c5406.webp",
    content: `The April 22nd patch delivers new map areas and improved monster AI for a more challenging experience.

The Niflheim map has been expanded with new exploration zones, new field monster spawns have been added to Yuno fields, and a secret dungeon entrance has been discovered in Comodo.

Boss monsters now use more varied skill patterns, field monsters have improved pathfinding, and new elite monster variants have been added to several dungeons.

This update also includes performance optimizations and several community-requested quality-of-life improvements.`,
  },
  {
    sourceId: 13,
    title: "Ragnarok Online: Patch Update April 8, 2026",
    publishedAt: "4/8/2026 2:24:50 PM",
    category: "Update",
    imageUrl: "/manus-storage/RO_PatchUpdate_700x360_01042026_04e81156_70b5b497.webp",
    content: `The April 8th patch introduces new skill updates and party system improvements, making grouping with friends more rewarding.

Several underused skills have been buffed across all classes, new skill synergy bonuses have been added for party play, and skill descriptions have been improved for clarity.

The party EXP sharing formula has been adjusted to benefit all party sizes, a new party mission system has been introduced, and party leader tools have been expanded with new management options.

Additionally, the April Fool's Day special event content has been removed and replaced with regular spring content.`,
  },
  {
    sourceId: 14,
    title: "Ragnarok Online: Patch Update April 1, 2026",
    publishedAt: "4/8/2026 2:22:00 PM",
    category: "Event",
    imageUrl: "/manus-storage/RO_PatchUpdate_700X360_04022026_d0450ed3_83809f8e.webp",
    content: `April Fool's Day special patch with surprise content and limited events — not everything is as it seems!

Special April Fool's Day quests with humorous storylines have been added, limited-time joke items are available in the shop, and hidden Easter eggs have been scattered throughout the game world.

The April Fool's event runs from April 1–3, 2026. All event items will be removed after the event ends.

Regular weekly maintenance and bug fixes have also been applied alongside the event content.`,
  },
  {
    sourceId: 15,
    title: "Ragnarok Online: Patch Update March 25, 2026",
    publishedAt: "4/7/2026 6:49:23 AM",
    category: "Update",
    imageUrl: "/manus-storage/RO_PatchUpdate11032026_700x360_e08b651b_934c919f.webp",
    content: `The March 25th patch delivers new headgear items and crafting system updates.

Eight new craftable headgear items have been added, the headgear enchantment system has been expanded, and a new headgear quest chain is available in Lighthalzen.

The crafting UI has been completely redesigned for better usability, a batch crafting feature has been added, and a crafting material preview system has been implemented.

This patch also includes standard bug fixes and server stability improvements based on community feedback.`,
  },
  {
    sourceId: 16,
    title: "Important: Account Security Policy Update",
    publishedAt: "3/15/2026 9:00:00 AM",
    category: "Notice",
    imageUrl: null,
    content: `Dear Adventurers,

We are writing to inform you of an important update to our Account Security Policy, effective April 1, 2026.

In response to increasing security threats across the gaming industry, Ragnarok Universe is strengthening its account protection measures to better safeguard your personal information and in-game assets.

Key Changes:

1. Two-Factor Authentication (2FA) will become mandatory for all accounts performing in-game purchases or account modifications starting April 1, 2026.

2. Suspicious login detection has been enhanced. If our system detects a login from an unrecognized device or location, you will receive an email notification and may be asked to verify your identity.

3. Password requirements have been updated. All passwords must now be at least 8 characters long and include a combination of uppercase letters, lowercase letters, numbers, and special characters.

4. Session timeout has been reduced from 30 days to 14 days for inactive sessions to minimize unauthorized access risks.

Action Required:

Please review your current account security settings and enable 2FA before April 1, 2026. Accounts without 2FA enabled will be prompted to set it up upon their next login after the deadline.

If you have any questions or concerns about these changes, please contact our support team at support@ragnarokuniversal.com.

Thank you for your continued trust in Ragnarok Universe. Your security is our top priority.`,
  },
  {
    sourceId: 17,
    title: "Ragnarok Universe Community Guidelines Revision",
    publishedAt: "3/1/2026 2:00:00 PM",
    category: "Notice",
    imageUrl: null,
    content: `Dear Community Members,

We have revised our Community Guidelines to create a safer, more inclusive, and more enjoyable environment for all Ragnarok Universe players. The updated guidelines take effect on March 15, 2026.

Summary of Key Changes:

Respect and Inclusion: We have strengthened our policies against harassment, discrimination, and hate speech. All players are expected to treat others with respect regardless of their background, nationality, or playstyle.

Content Standards: Clearer guidelines have been established for user-generated content, including player profiles, guild names, and in-game chat. Content that is offensive, misleading, or violates intellectual property rights is prohibited.

Trading and Commerce: Updated rules for player-to-player trading to prevent scams and protect both buyers and sellers. Real-money trading (RMT) remains strictly prohibited.

Cheating and Exploits: Zero-tolerance policy for the use of third-party programs, bots, or exploits that provide unfair advantages. Violations will result in immediate account suspension.

Reporting System: We have improved our in-game reporting tools to make it easier to report violations. All reports are reviewed by our moderation team within 48 hours.

Consequences for Violations:

Minor violations will result in a warning. Repeated or serious violations will result in temporary suspension. Severe violations, including cheating and harassment, will result in permanent account termination.

We encourage all players to read the full updated Community Guidelines available on our website. Together, we can make Ragnarok Universe a welcoming place for adventurers of all backgrounds.`,
  },
  {
    sourceId: 18,
    title: "Developer Note: Upcoming Content Roadmap 2026",
    publishedAt: "2/20/2026 11:00:00 AM",
    category: "Interview",
    imageUrl: null,
    content: `Greetings, Adventurers!

The Ragnarok Universe development team is excited to share our content roadmap for the remainder of 2026. We have been working hard on new features and content that we believe will significantly enhance your gaming experience.

Q2 2026 (April – June):

New Job Classes: We are introducing two new advanced job classes — the Shadow Chaser and the Mechanic. Each class brings a unique playstyle and skill set that will open up new strategic possibilities in both PvE and PvP content.

Expanded World: Three new field maps will be added, expanding the explorable world of Midgard. These areas will feature new monsters, hidden quests, and rare item drops.

Guild System Overhaul: The guild system is receiving a major update, including new guild skills, expanded guild halls, and a revamped War of Emperium experience.

Q3 2026 (July – September):

New Dungeon: "The Abyss of Forgotten Gods" — a challenging 10-player raid dungeon with multiple boss encounters and exclusive legendary equipment rewards.

PvP Ranked Season: The first official PvP ranked season will launch, featuring a competitive ladder, seasonal rewards, and a new PvP arena map.

Mobile Companion App: A companion app for iOS and Android will allow players to manage their characters, check auction house listings, and receive push notifications while away from the game.

Q4 2026 (October – December):

Holiday Events: Exciting seasonal events for Halloween and the Winter Festival, featuring limited-time content, exclusive cosmetics, and special login rewards.

Major Story Expansion: A new story chapter will continue the main narrative, featuring fully voiced cutscenes and new lore-rich questlines.

We are committed to delivering high-quality content updates that keep Ragnarok Universe fresh and exciting. Thank you for your continued support and feedback — it directly shapes the direction of our development.

See you in Midgard!

— The Ragnarok Universe Development Team`,
  },
];
