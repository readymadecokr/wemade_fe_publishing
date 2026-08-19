import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

/**
 * Design Philosophy: Ragnarok Universe dark neon game guide
 */

function GameInfoPageContent() {
  const gameFeatures = [
    {
      id: 1,
      title: "Epic Quests",
      description: "Embark on hundreds of quests across a vast fantasy world. Uncover mysteries, defeat powerful enemies, and become a legend.",
      icon: "⚔️",
    },
    {
      id: 2,
      title: "Multiplayer Dungeons",
      description: "Team up with friends to tackle challenging dungeons. Coordinate strategies and claim legendary rewards together.",
      icon: "🏰",
    },
    {
      id: 3,
      title: "PvP Battles",
      description: "Test your skills against other players in thrilling PvP arenas. Climb the rankings and prove your dominance.",
      icon: "⚡",
    },
    {
      id: 4,
      title: "Character Customization",
      description: "Create your unique character with extensive customization options. Choose your class, appearance, and playstyle.",
      icon: "🎨",
    },
    {
      id: 5,
      title: "Guilds & Community",
      description: "Join guilds to connect with other adventurers. Participate in guild wars and community events.",
      icon: "👥",
    },
    {
      id: 6,
      title: "Trading System",
      description: "Buy, sell, and trade items with other players. Build your wealth and acquire rare equipment.",
      icon: "💰",
    },
  ];

  const gameClasses = [
    {
      id: 1,
      name: "Swordsman",
      description: "Master of melee combat with high defense and damage output. Perfect for tanking and dealing physical damage.",
      color: "border-rose-400/25 bg-rose-400/5",
    },
    {
      id: 2,
      name: "Mage",
      description: "Wielder of powerful magic spells. Deal massive magical damage from a distance with various elemental abilities.",
      color: "border-cyan-300/25 bg-cyan-300/5",
    },
    {
      id: 3,
      name: "Archer",
      description: "Swift and precise ranged attacker. Deal consistent damage with high critical strike rates and mobility.",
      color: "border-emerald-400/25 bg-emerald-400/5",
    },
    {
      id: 4,
      name: "Priest",
      description: "Support specialist with healing and buffing abilities. Essential for group play with powerful recovery spells.",
      color: "border-violet-400/25 bg-violet-400/5",
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="relative overflow-hidden border-b border-cyan-300/20 bg-[linear-gradient(120deg,#081b32_0%,#091326_44%,#27123d_100%)] py-12 text-white">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="container">
          <p className="neon-kicker mb-2">World guide</p>
          <h1 className="text-4xl font-black mb-2">Game Info</h1>
          <p className="text-slate-300">Learn everything about Ragnarok Universe</p>
        </div>
      </div>

      {/* Content */}
      <main className="container py-6">
        {/* Game Overview */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="neon-kicker mb-2">The journey begins</p>
            <h2 className="text-3xl font-bold text-slate-100">About Ragnarok Universe</h2>
          </div>
          <div className="neon-panel rounded-2xl p-6">
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              Ragnarok Universe is an immersive MMORPG that brings together the classic gameplay of the legendary Ragnarok series with modern graphics and mechanics. 
              Explore a vast world filled with adventure, danger, and opportunity.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed">
              Whether you're a seasoned adventurer or new to the world of Ragnarok, you'll find countless hours of engaging content, from solo quests to cooperative dungeons 
              and competitive PvP battles. Join millions of players worldwide in this epic fantasy realm.
            </p>
          </div>
        </section>

        {/* Gameplay Trailer */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="neon-kicker mb-2">See it in motion</p>
            <h2 className="text-3xl font-bold text-slate-100">Gameplay Trailer</h2>
          </div>
          <div className="neon-card overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/LB4l4orKv18"
                title="Ragnarok Universe Gameplay Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Game Features */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="neon-kicker mb-2">Built for adventure</p>
            <h2 className="text-3xl font-bold text-slate-100">Game Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameFeatures.map((feature) => (
              <div key={feature.id} className="neon-card p-6">
                <div className="text-4xl mb-3 drop-shadow-[0_0_12px_rgba(25,216,230,0.35)]">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Game Classes */}
        <section>
          <div className="mb-4">
            <p className="neon-kicker mb-2">Choose your calling</p>
            <h2 className="text-3xl font-bold text-slate-100">Character Classes</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {gameClasses.map((gameClass) => (
              <div key={gameClass.id} className={`rounded-2xl border p-6 shadow-[0_0_20px_rgba(25,216,230,0.04)] ${gameClass.color}`}>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">{gameClass.name}</h3>
                <p className="text-slate-400">{gameClass.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative mt-8 overflow-hidden rounded-2xl border border-cyan-300/25 bg-[linear-gradient(115deg,rgba(10,42,64,.95),rgba(37,16,61,.95))] p-8 text-center shadow-[0_0_32px_rgba(25,216,230,0.12)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(25,216,230,.16),transparent_48%)] pointer-events-none" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-slate-300 mb-6">Join thousands of adventurers in Ragnarok Universe today!</p>
          <Link href="/">
            <Button className="relative bg-cyan-300 text-slate-950 hover:bg-cyan-200 font-black px-8 py-3 shadow-[0_0_20px_rgba(25,216,230,0.32)]">
              Play Now
            </Button>
          </Link>
        </section>
      </main>
    </>
  );
}

export default function GameInfoPage() {
  return (
    <Layout>
      <GameInfoPageContent />
    </Layout>
  );
}
