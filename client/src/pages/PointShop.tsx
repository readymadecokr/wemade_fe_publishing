import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Zap, Package, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const CATEGORIES = ["All", "Costumes", "Mounts", "Consumables", "Bundles", "Limited"];

const SHOP_ITEMS = [
  {
    id: 1,
    name: "Summer Crown Headgear",
    category: "Costumes",
    price: 500,
    originalPrice: null,
    image: "/manus-storage/RO1_pathupdate_17062026_3443274d.jpg",
    badge: "New",
    description: "A dazzling summer crown that shines under the Midgard sun.",
    limited: false,
  },
  {
    id: 2,
    name: "Ocean Wave Costume Set",
    category: "Costumes",
    price: 1200,
    originalPrice: 1500,
    image: "/manus-storage/GGT-RO-Shop-Craft-Play-3-1920x1080_37bb44a8.webp",
    badge: "Sale",
    description: "Complete summer costume set with ocean-themed accessories.",
    limited: false,
  },
  {
    id: 3,
    name: "Tropical Poring Mount",
    category: "Mounts",
    price: 2000,
    originalPrice: null,
    image: "/manus-storage/poring-character_89ac5939.png",
    badge: "Popular",
    description: "Ride the adorable Tropical Poring across Midgard in style.",
    limited: false,
  },
  {
    id: 4,
    name: "Summer Token Booster Pack",
    category: "Consumables",
    price: 300,
    originalPrice: null,
    image: "/manus-storage/RO_PatchUpdate_27052026_f346f204.webp",
    badge: null,
    description: "Boost your Summer Token collection rate for 7 days.",
    limited: false,
  },
  {
    id: 5,
    name: "Anniversary Bundle — 6th Year",
    category: "Bundles",
    price: 3500,
    originalPrice: 5000,
    image: "/manus-storage/RO1-Banner-6TH-Music-Performance-Resize-1920x1080_4149e08c.png",
    badge: "Limited",
    description: "Exclusive 6th Anniversary bundle with rare costume, mount, and consumables.",
    limited: true,
  },
  {
    id: 6,
    name: "EXP Boost Potion (30 days)",
    category: "Consumables",
    price: 800,
    originalPrice: null,
    image: "/manus-storage/RO_PatchUpdate_10062026_8b6abd6d.jpg",
    badge: null,
    description: "Increase your EXP gain by 50% for 30 days.",
    limited: false,
  },
  {
    id: 7,
    name: "Discord Exclusive Headgear",
    category: "Costumes",
    price: 0,
    originalPrice: null,
    image: "/manus-storage/ChatGPT-Image-Play-With-Discord_735dde20.webp",
    badge: "Free",
    description: "Exclusive headgear for Discord community members. Join our Discord to claim!",
    limited: true,
  },
  {
    id: 8,
    name: "Champion's War Steed",
    category: "Mounts",
    price: 4500,
    originalPrice: null,
    image: "/manus-storage/TRO-Championship-2026_d74b0527.webp",
    badge: "Premium",
    description: "The legendary war steed used by TRO Championship champions.",
    limited: true,
  },
  {
    id: 9,
    name: "Starter Adventure Pack",
    category: "Bundles",
    price: 1000,
    originalPrice: 1800,
    image: "/manus-storage/RO_PatchUpdate_22042026_c87e4338.webp",
    badge: "Sale",
    description: "Perfect for new adventurers — includes EXP boost, equipment, and currency.",
    limited: false,
  },
  {
    id: 10,
    name: "Kafra Teleport Tickets (x50)",
    category: "Consumables",
    price: 200,
    originalPrice: null,
    image: "/manus-storage/RO_PatchUpdate_700X360_04022026_055a0936.webp",
    badge: null,
    description: "50 Kafra Teleport Tickets for instant travel across Midgard.",
    limited: false,
  },
  {
    id: 11,
    name: "Ayothaya Festival Costume",
    category: "Costumes",
    price: 1800,
    originalPrice: null,
    image: "/manus-storage/6th-Anniversary-Sunset-of-Ayothaya-1900x600_4d61df38.webp",
    badge: "Limited",
    description: "Exclusive costume from the Sunset of Ayothaya 6th Anniversary event.",
    limited: true,
  },
  {
    id: 12,
    name: "Premium Monthly Pass",
    category: "Bundles",
    price: 2500,
    originalPrice: null,
    image: "/manus-storage/ROS-Thailand-2026-1900x600_9802f0ff.webp",
    badge: "Best Value",
    description: "30-day premium pass with daily rewards, EXP boost, and exclusive items.",
    limited: false,
  },
];

const BADGE_STYLES: Record<string, string> = {
  New: "bg-green-500 text-white",
  Sale: "bg-red-500 text-white",
  Popular: "bg-orange-500 text-white",
  Limited: "bg-purple-600 text-white",
  Premium: "bg-yellow-500 text-black",
  Free: "bg-blue-500 text-white",
  "Best Value": "bg-emerald-600 text-white",
};

export default function PointShop() {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<number[]>([]);

  const filtered = activeCategory === "All"
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((i) => i.category === activeCategory);

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase items.");
      setTimeout(() => (window.location.href = getLoginUrl()), 1000);
      return;
    }
    if (item.price === 0) {
      toast.success(`${item.name} claimed successfully!`);
      return;
    }
    setCart((prev) => [...prev, item.id]);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-10">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Point Shop</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Purchase exclusive items, costumes, and bundles
            </p>
          </div>
          {cart.length > 0 && (
            <Button className="gaming-gradient text-white gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart ({cart.length})
            </Button>
          )}
        </div>
      </div>

      <div className="container py-10">
        {/* Point Balance Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Your Point Balance</p>
              <p className="text-xl font-bold text-foreground">
                {isAuthenticated ? "0 Points" : "Sign in to view"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Package className="w-4 h-4" /> Purchase Points
            </Button>
            {!isAuthenticated && (
              <Button
                size="sm"
                className="gaming-gradient text-white"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
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
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} items</span>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl overflow-hidden card-hover flex flex-col"
            >
              {/* Item Image */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {item.badge && (
                  <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded ${BADGE_STYLES[item.badge] ?? "bg-primary text-white"}`}>
                    {item.badge}
                  </span>
                )}
                {item.limited && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Limited
                  </span>
                )}
              </div>

              {/* Item Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-card-foreground text-sm mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">{item.description}</p>

                {/* Price & Buy */}
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    {item.price === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-bold text-sm">FREE</span>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-primary text-sm flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3" />
                          {item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className={`text-xs ${cart.includes(item.id) ? "bg-green-600 hover:bg-green-700 text-white" : "gaming-gradient text-white"}`}
                    onClick={() => handleBuy(item)}
                    disabled={cart.includes(item.id)}
                  >
                    {cart.includes(item.id) ? (
                      <><Star className="w-3 h-3 mr-1" /> Added</>
                    ) : item.price === 0 ? (
                      "Claim"
                    ) : (
                      <><ShoppingCart className="w-3 h-3 mr-1" /> Buy</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-10 bg-muted/50 border border-border rounded-xl p-5 text-center">
          <p className="text-sm text-muted-foreground">
            All purchases are subject to our{" "}
            <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a>.
            Virtual items have no real-world monetary value and are non-refundable.
          </p>
        </div>
      </div>
    </Layout>
  );
}
