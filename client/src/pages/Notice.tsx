import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight } from "lucide-react";

const NOTICES = [
  {
    id: 1,
    title: "Server Maintenance Notice — June 24, 2026",
    date: "June 22, 2026",
    category: "Maintenance",
    important: true,
    excerpt: "Scheduled server maintenance on June 24, 2026 from 02:00 to 06:00 (UTC+7). All services will be unavailable during this period.",
  },
  {
    id: 2,
    title: "Summer Festival Event Schedule 2026",
    date: "June 20, 2026",
    category: "Event",
    important: false,
    excerpt: "The Summer Festival event runs from June 25 to July 31, 2026. Check the full schedule and reward list inside.",
  },
  {
    id: 3,
    title: "Anti-Cheat System Update Notice",
    date: "June 18, 2026",
    category: "System",
    important: true,
    excerpt: "We have updated our anti-cheat detection system. Players using unauthorized third-party programs will be permanently banned.",
  },
  {
    id: 4,
    title: "Point Shop New Items Added — June 2026",
    date: "June 15, 2026",
    category: "Shop",
    important: false,
    excerpt: "New summer-themed items have been added to the Point Shop. Limited quantities available — get them while they last!",
  },
  {
    id: 5,
    title: "6th Anniversary Celebration Details",
    date: "June 10, 2026",
    category: "Event",
    important: false,
    excerpt: "Full details for the Ragnarok Online 6th Anniversary celebration, including events, rewards, and special login bonuses.",
  },
  {
    id: 6,
    title: "Account Security Reminder",
    date: "June 5, 2026",
    category: "Security",
    important: true,
    excerpt: "Please ensure your account password is secure. We recommend enabling two-factor authentication for added protection.",
  },
  {
    id: 7,
    title: "Server Maintenance Notice — June 10, 2026",
    date: "June 8, 2026",
    category: "Maintenance",
    important: false,
    excerpt: "Scheduled maintenance on June 10, 2026 from 02:00 to 04:00 (UTC+7) for patch update deployment.",
  },
  {
    id: 8,
    title: "TRO Championship 2026 Official Rules",
    date: "June 1, 2026",
    category: "Event",
    important: false,
    excerpt: "The official rules and regulations for the Thailand Ragnarok Online Championship 2026 have been published.",
  },
  {
    id: 9,
    title: "Privacy Policy Update Notice",
    date: "May 28, 2026",
    category: "Policy",
    important: true,
    excerpt: "Our Privacy Policy has been updated effective June 1, 2026. Please review the changes to understand how we handle your data.",
  },
  {
    id: 10,
    title: "Server Maintenance Notice — May 27, 2026",
    date: "May 25, 2026",
    category: "Maintenance",
    important: false,
    excerpt: "Scheduled maintenance on May 27, 2026 from 02:00 to 05:00 (UTC+7) for system upgrades.",
  },
  {
    id: 11,
    title: "New Payment Methods Available",
    date: "May 20, 2026",
    category: "Shop",
    important: false,
    excerpt: "We have added new payment methods including additional mobile payment options for Point Shop purchases.",
  },
  {
    id: 12,
    title: "Terms of Service Update",
    date: "May 15, 2026",
    category: "Policy",
    important: true,
    excerpt: "Our Terms of Service have been updated. Key changes include the virtual items policy and age verification requirements.",
  },
  {
    id: 13,
    title: "Discord Server Rules Update",
    date: "May 10, 2026",
    category: "Community",
    important: false,
    excerpt: "The official Discord server rules have been updated. All members are required to review and comply with the new guidelines.",
  },
  {
    id: 14,
    title: "Server Maintenance Notice — May 13, 2026",
    date: "May 11, 2026",
    category: "Maintenance",
    important: false,
    excerpt: "Scheduled maintenance on May 13, 2026 from 02:00 to 04:30 (UTC+7) for patch deployment.",
  },
  {
    id: 15,
    title: "Compensation Notice — April Service Disruption",
    date: "May 5, 2026",
    category: "Compensation",
    important: false,
    excerpt: "Compensation items have been distributed to all active accounts for the service disruption that occurred in April 2026.",
  },
];

const CATEGORIES = ["All", "Maintenance", "Event", "System", "Shop", "Security", "Policy", "Community", "Compensation"];

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

export default function Notice() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = activeCategory === "All"
    ? NOTICES
    : NOTICES.filter((n) => n.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">Notice</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Official announcements and system notices
          </p>
        </div>
      </div>

      <div className="container py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={activeCategory === cat ? "gaming-gradient text-white" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Notice List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_120px_140px_40px] gap-4 px-6 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Title</span>
            <span>Category</span>
            <span>Date</span>
            <span></span>
          </div>

          {/* Notice Rows */}
          {paginated.map((notice, idx) => (
            <Link key={notice.id} href={`/notice/${notice.id}`}>
              <div className={`grid grid-cols-1 md:grid-cols-[1fr_120px_140px_40px] gap-2 md:gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-accent/50 transition-colors cursor-pointer group ${
                idx % 2 === 0 ? "" : "bg-muted/20"
              }`}>
                <div className="flex items-start gap-2">
                  {notice.important && (
                    <Bell className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  )}
                  <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {notice.title}
                  </span>
                </div>
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[notice.category] ?? "bg-muted text-muted-foreground"}`}>
                    {notice.category}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground self-center">{notice.date}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground self-center hidden md:block group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}

          {paginated.length === 0 && (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No notices found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className={p === page ? "gaming-gradient text-white" : ""}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
