import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

/**
 * Design Philosophy: Flyff Universe + Play2Bit Style
 * - Professional gaming portal design
 * - Notice detail page (text-focused, document style)
 * - Clean white background with blue accents
 */

function NoticeDetailContent() {
  const params = useParams();
  const noticeId = parseInt(params.id || "1");

  // Notice data
  const noticeData = [
    {
      id: 1,
      title: "Chapter 2 Update Released",
      date: "2026.06.04",
      category: "Update",
      briefContent: "Experience the new Chapter 2 with exciting content, new dungeons, and challenging bosses. Join thousands of adventurers in the latest expansion! This major update brings three brand new dungeons with unique mechanics, powerful bosses with epic loot drops, and new skills to unlock for your class.",
    },
    {
      id: 2,
      title: "Server Maintenance Notice",
      date: "2026.06.05",
      category: "Maintenance",
      briefContent: "We will be performing scheduled server maintenance on June 5th from 2:00 AM to 4:00 AM UTC. The game will be unavailable during this time. We apologize for any inconvenience this may cause. All data will be preserved and there will be no character loss. Thank you for your patience.",
    },
    {
      id: 3,
      title: "New Dungeon Unlocked",
      date: "2026.06.02",
      category: "Update",
      briefContent: "A mysterious new dungeon has appeared! Gather your party and face the challenges within. Defeat the boss to claim legendary rewards. The Abyss Dungeon is recommended for level 60+ players in parties of 3-5. Face the powerful Abyssal Guardian boss with multiple phases that requires coordination with your party.",
    },
    {
      id: 4,
      title: "Terms of Service Updated",
      date: "2026.06.01",
      category: "Policy",
      briefContent: "Our Terms of Service have been updated effective June 1st, 2026. Please review the changes to ensure compliance with our updated policies. Key changes include updated account security requirements, new community guidelines, and clarifications on in-game conduct. All players must accept the new terms to continue playing.",
    },
    {
      id: 5,
      title: "Balance Patch Notes",
      date: "2026.05.31",
      category: "Update",
      briefContent: "We've made several balance adjustments to improve gameplay. Check the full patch notes for details on class changes and bug fixes. Warrior defense increased by 10%, Mage spell damage scaling improved, Archer critical strike chance enhanced, and Rogue stealth mechanics balanced. Server stability also improved significantly.",
    },
    {
      id: 6,
      title: "Emergency Maintenance Alert",
      date: "2026.05.28",
      category: "Maintenance",
      briefContent: "Due to critical server issues, we will be performing emergency maintenance on May 28th at 10:00 PM UTC. Expected duration: 2 hours. We apologize for the short notice. This maintenance is critical to ensure server stability and prevent data loss. Thank you for your understanding.",
    },
  ];

  const notice = noticeData.find(n => n.id === noticeId);

  if (!notice) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Notice Not Found</h1>
          <Link href="/notice">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Notices
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Update":
        return "bg-blue-100 text-blue-700";
      case "Maintenance":
        return "bg-red-100 text-red-700";
      case "Policy":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout>
      <>
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container">
            <Link href="/notice" className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 w-fit">
              <ArrowLeft size={20} />
              Back to Notices
            </Link>
            <h1 className="text-4xl font-black mb-4 uppercase">{notice.title}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded text-xs font-semibold ${getCategoryColor(notice.category)}`}>
                {notice.category.toLowerCase()}
              </span>
              <span className="text-blue-100">{notice.date}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container py-12">
          <div className="max-w-3xl mx-auto">
            {/* Article Content */}
            <div className="bg-white rounded-lg p-8 border border-blue-100">
              <p className="text-slate-700 text-base leading-relaxed">
                {notice.briefContent}
              </p>
            </div>

            {/* Navigation */}
            <div className="mt-8">
              <Link href="/notice" className="inline-block">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  Back to Notices
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    </Layout>
  );
}

export default function NoticeDetailPage() {
  return <NoticeDetailContent />;
}
