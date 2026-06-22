import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const ALL_NEWS = [
  {
    id: 1,
    title: "Ragnarok Online: Patch Update June 17, 2026",
    date: "June 17, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_pathupdate_17062026_3443274d.jpg",
    excerpt: "New content and balance adjustments arrive in this week's patch update for Ragnarok Online.",
  },
  {
    id: 2,
    title: "Ragnarok Online: Patch Update June 10, 2026",
    date: "June 10, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_10062026_8b6abd6d.jpg",
    excerpt: "This week's patch brings new quests, item adjustments, and bug fixes to Ragnarok Online.",
  },
  {
    id: 3,
    title: "Ragnarok Online: Patch Update June 4, 2026",
    date: "June 4, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_04062026-1_eab33218.jpg",
    excerpt: "June 4th patch update includes new seasonal content and class balance improvements.",
  },
  {
    id: 4,
    title: "Ragnarok Online: Patch Update May 27, 2026",
    date: "May 27, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_27052026_f346f204.webp",
    excerpt: "May 27th update delivers new dungeon content and performance improvements.",
  },
  {
    id: 5,
    title: "Ragnarok Online: Patch Update May 13, 2026",
    date: "May 13, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_patchupdate_13052026_61973db6.jpg",
    excerpt: "Mid-May patch introduces new equipment sets and PvP balance changes.",
  },
  {
    id: 6,
    title: "Ragnarok Online: Patch Update May 6, 2026",
    date: "May 6, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_06052026_ade8545e.jpg",
    excerpt: "Early May update focuses on guild system improvements and new crafting recipes.",
  },
  {
    id: 7,
    title: "Ragnarok Online: Patch Update April 22, 2026",
    date: "April 22, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_22042026_c87e4338.webp",
    excerpt: "Spring patch brings new seasonal events and limited-time rewards.",
  },
  {
    id: 8,
    title: "Ragnarok Online: Patch Update April 1, 2026",
    date: "April 1, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_700x360_01042026_5124866d.webp",
    excerpt: "April Fool's Day special patch with surprise content and limited events.",
  },
  {
    id: 9,
    title: "Ragnarok Online: Patch Update March 18, 2026",
    date: "March 18, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate18032026_700x360_e42342e6.webp",
    excerpt: "March 18th patch includes new map areas and improved monster AI.",
  },
  {
    id: 10,
    title: "Ragnarok Online: Patch Update March 11, 2026",
    date: "March 11, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate11032026_700x360_e6f2da5a.webp",
    excerpt: "New skill updates and party system improvements in this week's patch.",
  },
  {
    id: 11,
    title: "Ragnarok Online: Patch Update March 4, 2026",
    date: "March 4, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO1_04032026PatchUpdate_700X360_6a1e12c3.webp",
    excerpt: "Early March patch delivers new headgear items and crafting system updates.",
  },
  {
    id: 12,
    title: "Ragnarok Online: Patch Update February 4, 2026",
    date: "February 4, 2026",
    category: "Patch Update",
    image: "/manus-storage/RO_PatchUpdate_700X360_04022026_055a0936.webp",
    excerpt: "February patch brings Valentine's Day events and new couple quests.",
  },
  {
    id: 13,
    title: "6th Anniversary Music Performance",
    date: "June 1, 2026",
    category: "Event",
    image: "/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_4149e08c.png",
    excerpt: "Celebrate the 6th anniversary with a special live music performance event.",
  },
  {
    id: 14,
    title: "TRO Championship 2026 — Registration Open",
    date: "May 20, 2026",
    category: "Event",
    image: "/manus-storage/TRO-Championship-2026_d74b0527.webp",
    excerpt: "Register now for the Thailand Ragnarok Online Championship 2026.",
  },
  {
    id: 15,
    title: "Play With Discord — Community Event",
    date: "May 15, 2026",
    category: "Event",
    image: "/manus-storage/ChatGPT-Image-Play-With-Discord_735dde20.webp",
    excerpt: "Join our Discord community event for exclusive in-game rewards.",
  },
  {
    id: 16,
    title: "LINE OA Official Channel Launch",
    date: "May 20, 2026",
    category: "Event",
    image: "/manus-storage/PR-pack-Line-OA-Cover-700x36020052026_073afc30.webp",
    excerpt: "Follow our new official LINE OA channel for exclusive news and promotions.",
  },
  {
    id: 17,
    title: "Ragnarok Online MC Championship 2024",
    date: "December 20, 2024",
    category: "Event",
    image: "/manus-storage/20241220_ROMC_PC_Banner_86d74bdb.jpg",
    excerpt: "Highlights from the Ragnarok Online MC Championship 2024 grand finals.",
  },
  {
    id: 18,
    title: "GGT RO Shop — Craft & Play",
    date: "April 10, 2026",
    category: "Event",
    image: "/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_37bb44a8.webp",
    excerpt: "New crafting items available in the GGT RO Shop. Craft, play, and earn rewards.",
  },
];

const CATEGORIES = ["All", "Patch Update", "Event"];

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? ALL_NEWS
    : ALL_NEWS.filter((n) => n.category === activeCategory);

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">News</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Latest patch updates, events, and announcements
          </p>
        </div>
      </div>

      <div className="container py-10">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "gaming-gradient text-white" : ""}
            >
              {cat}
            </Button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} articles</span>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <div className="bg-card border border-border rounded-xl overflow-hidden card-hover cursor-pointer group h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 text-white text-xs font-semibold rounded ${
                    item.category === "Event" ? "bg-purple-600" : "bg-primary"
                  }`}>
                    {item.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground mb-1.5">{item.date}</p>
                  <h3 className="text-sm font-semibold text-card-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
