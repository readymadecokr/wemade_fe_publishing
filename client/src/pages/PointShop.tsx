import { useLocation } from "wouter";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useState } from "react";

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

interface ShopItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  discount?: number;
  popular?: boolean;
}

export default function PointShop() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<ShopItem[]>([]);

  const shopItems: ShopItem[] = [
    {
      id: 1,
      name: "Premium Character Skin",
      price: 9900,
      category: "cosmetics",
      image: `${ASSET_BASE_URL}/manus-storage/20241220_ROMC_PC_Banner_1c1329c9_9464f63e.jpg`,
      popular: true,
    },
    {
      id: 2,
      name: "Exclusive Pet",
      price: 4900,
      category: "pets",
      image: `${ASSET_BASE_URL}/manus-storage/BannerWarpportaldesktop_v2_0a88c48d_340f09e8.png`,
      discount: 20,
    },
    {
      id: 3,
      name: "Weapon Enhancement Pack",
      price: 14900,
      category: "items",
      image: `${ASSET_BASE_URL}/manus-storage/BannerWarpportaldesktop_v2_0a88c48d_340f09e8.png`,
      popular: true,
    },
    {
      id: 4,
      name: "Mount Costume",
      price: 7900,
      category: "cosmetics",
      image: `${ASSET_BASE_URL}/manus-storage/20241220_ROMC_PC_Banner_1c1329c9_9464f63e.jpg`,
    },
    {
      id: 5,
      name: "Battle Pass",
      price: 9900,
      category: "battle-pass",
      image: `${ASSET_BASE_URL}/manus-storage/BannerWarpportaldesktop_v2_0a88c48d_340f09e8.png`,
      discount: 10,
    },
    {
      id: 6,
      name: "Rare Wings",
      price: 19900,
      category: "cosmetics",
      image: `${ASSET_BASE_URL}/manus-storage/BannerWarpportaldesktop_v2_0a88c48d_340f09e8.png`,
      popular: true,
    },
    {
      id: 7,
      name: "Experience Booster (7 Days)",
      price: 4900,
      category: "items",
      image: `${ASSET_BASE_URL}/manus-storage/20241220_ROMC_PC_Banner_1c1329c9_9464f63e.jpg`,
    },
    {
      id: 8,
      name: "Legendary Armor Set",
      price: 24900,
      category: "items",
      image: `${ASSET_BASE_URL}/manus-storage/BannerWarpportaldesktop_v2_0a88c48d_340f09e8.png`,
      discount: 15,
    },
  ];

  const categories = [
    { id: "all", label: "All Items" },
    { id: "cosmetics", label: "Cosmetics" },
    { id: "pets", label: "Pets" },
    { id: "items", label: "Items" },
    { id: "battle-pass", label: "Battle Pass" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? shopItems
      : shopItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item: ShopItem) => {
    setCart([...cart, item]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart size={32} />
              <h1 className="text-4xl font-black">Ragnarok Point Shop</h1>
            </div>
            <p className="text-blue-100">Exclusive items and cosmetics for your adventure</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-bold text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-gray-100 text-foreground hover:bg-gray-200"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-bold text-foreground mb-3">Cart Summary</h4>
                  <div className="bg-blue-50 rounded p-4">
                    <p className="text-sm text-foreground/70 mb-2">
                      Items in cart: <span className="font-bold text-blue-600">{cart.length}</span>
                    </p>
                    <p className="text-sm text-foreground/70">
                      Total: <span className="font-bold text-blue-600">{cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}원</span>
                    </p>
                    <Button
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={cart.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-foreground/70">
                  Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {item.popular && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                          <Star size={14} fill="currentColor" />
                          Popular
                        </div>
                      )}
                      {item.discount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{item.discount}%
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2 line-clamp-2">{item.name}</h3>

                      {/* Price */}
                      <div className="mb-4">
                        {item.discount ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">
                              {Math.round(item.price * (1 - item.discount / 100)).toLocaleString()}원
                            </span>
                            <span className="text-sm text-foreground/50 line-through">
                              {item.price.toLocaleString()}원
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-blue-600">
                            {item.price.toLocaleString()}원
                          </span>
                        )}
                      </div>

                      {/* Category Badge */}
                      <div className="mb-4">
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {categories.find((c) => c.id === item.category)?.label}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start gap-3">
                <Zap size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-foreground mb-1">Instant Delivery</h4>
                  <p className="text-sm text-foreground/70">
                    Items are delivered to your account immediately after purchase.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
              <div className="flex items-start gap-3">
                <ShoppingCart size={24} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-foreground mb-1">Secure Payment</h4>
                  <p className="text-sm text-foreground/70">
                    All transactions are encrypted and protected for your safety.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-start gap-3">
                <Star size={24} className="text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-foreground mb-1">Exclusive Content</h4>
                  <p className="text-sm text-foreground/70">
                    Access unique cosmetics and items not available elsewhere.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-12 pt-8 border-t border-border">
            <button
              onClick={() => setLocation("/")}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
