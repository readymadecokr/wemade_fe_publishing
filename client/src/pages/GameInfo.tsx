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
      <div className="relative overflow-hidden border-b border-[#617089] bg-[linear-gradient(110deg,#314b66,#526f8d_50%,#314b66)] py-11 text-white">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_18%_10%,white_0,transparent_28%),radial-gradient(circle_at_82%_80%,#efcf8b_0,transparent_30%)]" />
        <div className="container">
          <h1 className="relative font-serif text-4xl font-bold mb-2">Game Info</h1>
          <p className="relative text-[#e9dfc8]">Learn everything about Ragnarok Universe</p>
        </div>
      </div>

      {/* Content */}
      <main className="container fantasy-content-guide py-8">
        {/* Game Overview */}
        <section className="mb-8">
          <h2 className="fantasy-section-title mb-4 flex items-center gap-3 text-3xl"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#7283a0] bg-[#445d82] text-sm text-[#f9edcb]">✦</span>About Ragnarok Universe</h2>
          <div className="fantasy-card rounded-xl p-5">
            <p className="mb-4 text-lg leading-relaxed text-[#5d4f3d]">
              Ragnarok Universe is an immersive MMORPG that brings together the classic gameplay of the legendary Ragnarok series with modern graphics and mechanics. 
              Explore a vast world filled with adventure, danger, and opportunity.
            </p>
            <p className="text-lg leading-relaxed text-[#5d4f3d]">
              Whether you're a seasoned adventurer or new to the world of Ragnarok, you'll find countless hours of engaging content, from solo quests to cooperative dungeons 
              and competitive PvP battles. Join millions of players worldwide in this epic fantasy realm.
            </p>
          </div>
        </section>

        {/* Gameplay Trailer */}
        <section className="mb-8">
          <h2 className="fantasy-section-title mb-4 flex items-center gap-3 text-3xl"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#7283a0] bg-[#445d82] text-sm text-[#f9edcb]">✦</span>Gameplay Trailer</h2>
          <div className="fantasy-frame overflow-hidden rounded-xl bg-[#283e55]">
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
          <h2 className="fantasy-section-title mb-4 flex items-center gap-3 text-3xl"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#7283a0] bg-[#445d82] text-sm text-[#f9edcb]">✦</span>Game Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameFeatures.map((feature) => (
              <div key={feature.id} className="fantasy-card rounded-xl p-6 transition-shadow hover:shadow-lg">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="mb-2 font-serif text-xl font-bold text-[#302419]">{feature.title}</h3>
                <p className="text-[#675843]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Game Classes */}
        <section>
          <h2 className="fantasy-section-title mb-4 flex items-center gap-3 text-3xl"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#7283a0] bg-[#445d82] text-sm text-[#f9edcb]">✦</span>Character Classes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {gameClasses.map((gameClass) => (
              <div key={gameClass.id} className="fantasy-card rounded-xl p-6">
                <h3 className="mb-2 font-serif text-2xl font-bold text-[#302419]">{gameClass.name}</h3>
                <p className="text-[#675843]">{gameClass.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-8 rounded-xl border border-[#405e90] bg-[linear-gradient(110deg,#395782,#5277ad,#395782)] p-7 text-center shadow-lg">
          <h2 className="mb-3 font-serif text-3xl font-bold text-[#fff6e4]">Ready to Start Your Adventure?</h2>
          <p className="mb-6 text-[#e8dfcd]">Join thousands of adventurers in Ragnarok Universe today!</p>
          <Link href="/">
            <Button className="border border-[#d5bd7d] bg-[#fff8e8] px-8 py-3 font-bold text-[#34588f] hover:bg-white">
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
    <Layout variant="homeChrome">
      <GameInfoPageContent />
    </Layout>
  );
}
