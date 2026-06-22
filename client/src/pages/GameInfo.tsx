import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Play, Users, Globe, Shield, Sword, Star } from "lucide-react";

const GAME_FEATURES = [
  {
    icon: <Sword className="w-6 h-6" />,
    title: "Dynamic Combat",
    description: "Experience real-time combat with over 50 unique job classes, each with distinct skill trees and playstyles.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Guild Wars",
    description: "Form powerful guilds and compete in War of Emperium — large-scale castle siege battles with hundreds of players.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Vast World",
    description: "Explore the world of Midgard with over 100 unique maps, dungeons, and hidden areas to discover.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Deep Crafting",
    description: "Craft and refine powerful equipment using thousands of materials gathered from monsters and quests.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Rich Story",
    description: "Immerse yourself in an epic storyline spanning multiple continents with hundreds of quests and lore.",
  },
  {
    icon: <Play className="w-6 h-6" />,
    title: "Regular Updates",
    description: "Enjoy frequent content updates with new maps, items, events, and balance improvements every week.",
  },
];

const MEDIA_ITEMS = [
  {
    id: 1,
    title: "6th Anniversary Music Performance",
    image: "/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_4149e08c.png",
    type: "Event",
  },
  {
    id: 2,
    title: "GGT RO Shop — Craft & Play",
    image: "/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_37bb44a8.webp",
    type: "Gameplay",
  },
  {
    id: 3,
    title: "TRO Championship 2026",
    image: "/manus-storage/TRO-Championship-2026_d74b0527.webp",
    type: "Esports",
  },
  {
    id: 4,
    title: "Ragnarok Stars Thailand 2026",
    image: "/manus-storage/ROS-Thailand-2026-1900x600_9802f0ff.webp",
    type: "Esports",
  },
  {
    id: 5,
    title: "Sunset of Ayothaya — 6th Anniversary",
    image: "/manus-storage/6th-Anniversary-Sunset-of-Ayothaya-1900x600_4d61df38.webp",
    type: "Event",
  },
  {
    id: 6,
    title: "Play With Discord Community",
    image: "/manus-storage/ChatGPT-Image-Play-With-Discord_735dde20.webp",
    type: "Community",
  },
];

const JOB_CLASSES = [
  "Swordsman", "Mage", "Archer", "Thief", "Acolyte", "Merchant",
  "Knight", "Wizard", "Hunter", "Assassin", "Priest", "Blacksmith",
  "Lord Knight", "High Wizard", "Sniper", "Assassin Cross", "High Priest", "Whitesmith",
];

export default function GameInfo() {
  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">Game Info</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Discover the world of Ragnarok Online
          </p>
        </div>
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-blue-900/10 py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-xl">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Official Game</span>
              <h2 className="text-4xl font-bold text-foreground mt-2 mb-4 leading-tight">
                Ragnarok Online
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Ragnarok Online is a massively multiplayer online role-playing game developed by Gravity Co., Ltd. Set in the mythical world of Midgard, players embark on epic adventures, battle fearsome monsters, and forge alliances in a rich, ever-evolving world.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With over 20 years of history and millions of players worldwide, Ragnarok Online continues to be one of the most beloved MMORPGs of all time. Experience the classic gameplay that defined a generation, now enhanced with modern features and regular content updates.
              </p>
              <div className="flex gap-3">
                <Button className="gaming-gradient text-white font-semibold gap-2">
                  <Play className="w-4 h-4" /> Play Now
                </Button>
                <Link href="/news">
                  <Button variant="outline">Latest Updates</Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="/manus-storage/main2_329f90c6.png"
                alt="Ragnarok Online"
                className="max-w-md w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Game Features ─── */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground">Game Features</h2>
            <p className="text-muted-foreground mt-2 text-sm">What makes Ragnarok Online unique</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAME_FEATURES.map((feature, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 card-hover">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Job Classes ─── */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Job Classes</h2>
            <p className="text-muted-foreground mt-2 text-sm">Choose from dozens of unique character classes</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {JOB_CLASSES.map((job) => (
              <span
                key={job}
                className="px-3 py-1.5 bg-card border border-border rounded-full text-sm font-medium text-card-foreground hover:border-primary hover:text-primary transition-colors cursor-default"
              >
                {job}
              </span>
            ))}
            <span className="px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm font-medium text-primary">
              + Many More
            </span>
          </div>
        </div>
      </section>

      {/* ─── Media Gallery ─── */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Media Gallery</h2>
            <p className="text-muted-foreground mt-2 text-sm">Screenshots, events, and esports highlights</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MEDIA_ITEMS.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden card-hover group cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Play className="w-10 h-10 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                  </div>
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                    {item.type}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-card-foreground line-clamp-1">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Download CTA ─── */}
      <section className="py-16 gaming-gradient">
        <div className="container text-center">
          <img
            src="/manus-storage/logo_main_ascii_91a16bbc.png"
            alt="Ragnarok Universe"
            className="h-16 w-auto mx-auto mb-6 object-contain"
          />
          <h2 className="text-3xl font-bold text-white mb-4">Start Your Adventure Today</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Join millions of players in the world of Midgard. Free to play, forever.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold gap-2">
              <Play className="w-5 h-5" /> Play Now — Free
            </Button>
            <a href="#" className="flex items-center gap-2">
              <img src="/manus-storage/icon_apple_ascii_42e26034.png" alt="App Store" className="h-10 w-auto object-contain" />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
