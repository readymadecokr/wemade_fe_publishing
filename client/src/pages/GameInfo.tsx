import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

/**
 * Design Philosophy: Flyff Universe + Play2Bit Style
 * - Professional gaming portal design
 * - Game information page
 * - Clean white background with blue accents
 * - English content throughout
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
      color: "bg-red-50 border-red-200",
    },
    {
      id: 2,
      name: "Mage",
      description: "Wielder of powerful magic spells. Deal massive magical damage from a distance with various elemental abilities.",
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: 3,
      name: "Archer",
      description: "Swift and precise ranged attacker. Deal consistent damage with high critical strike rates and mobility.",
      color: "bg-green-50 border-green-200",
    },
    {
      id: 4,
      name: "Priest",
      description: "Support specialist with healing and buffing abilities. Essential for group play with powerful recovery spells.",
      color: "bg-yellow-50 border-yellow-200",
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-black mb-2">🎮 Game Info</h1>
          <p className="text-blue-100">Learn everything about Ragnarok Universe</p>
        </div>
      </div>

      {/* Content */}
      <main className="container py-6">
        {/* Game Overview */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">About Ragnarok Universe</h2>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-foreground/80 text-lg leading-relaxed mb-4">
              Ragnarok Universe is an immersive MMORPG that brings together the classic gameplay of the legendary Ragnarok series with modern graphics and mechanics. 
              Explore a vast world filled with adventure, danger, and opportunity.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Whether you're a seasoned adventurer or new to the world of Ragnarok, you'll find countless hours of engaging content, from solo quests to cooperative dungeons 
              and competitive PvP battles. Join millions of players worldwide in this epic fantasy realm.
            </p>
          </div>
        </section>

        {/* Gameplay Trailer */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Gameplay Trailer</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Game Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameFeatures.map((feature) => (
              <div key={feature.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Game Classes */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Character Classes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {gameClasses.map((gameClass) => (
              <div key={gameClass.id} className="border border-border rounded-lg p-6 bg-card">
                <h3 className="text-2xl font-bold text-foreground mb-2">{gameClass.name}</h3>
                <p className="text-foreground/70">{gameClass.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-blue-100 mb-6">Join thousands of adventurers in Ragnarok Universe today!</p>
          <Link href="/">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3">
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
