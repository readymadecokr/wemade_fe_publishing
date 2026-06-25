import { Link } from "wouter";
import Layout from "@/components/Layout";

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

/**
 * Design Philosophy: Flyff Universe + Play2Bit Style
 * - Professional gaming portal design
 * - Notice listing page (image + title + date format)
 * - 2 rows, 3 columns layout for PC and mobile
 */

function NoticePageContent() {
  const noticeData = [
    {
      id: 1,
      title: "Ragnarok Online: Patch Update วันที่ 17 มิถุนายน 2569",
      date: "6/17/2026 10:38 PM",
      image: `${ASSET_BASE_URL}/manus-storage/ChatGPT-Image-Play-With-Discord_f803e1b3_988b3aeb.webp`,
    },
    {
      id: 2,
      title: "Ragnarok Online: Patch Update วันที่ 10 มิถุนายน 2569",
      date: "6/17/2026 10:32 PM",
      image: `${ASSET_BASE_URL}/manus-storage/TRO-Championship-2026_c417f04e_848eb2d9.webp`,
    },
    {
      id: 3,
      title: "Ragnarok Online: Patch Update วันที่ 4 มิถุนายน 2569",
      date: "6/17/2026 1:08:40 PM",
      image: `${ASSET_BASE_URL}/manus-storage/2-1-Gnjoysidebanner-1900x60006112025_9eb2918f_10d96d95.webp`,
    },
    {
      id: 4,
      title: "Ragnarok Online: Patch Update วันที่ 27 พฤษภาคม 2569",
      date: "5/28/2026 4:07:24 PM",
      image: `${ASSET_BASE_URL}/manus-storage/6th-Anniversary-Sunset-of-Ayothaya-1900x600_ad2ad494_1cd501ef.webp`,
    },
    {
      id: 5,
      title: "Gravity Game Tech เปิดตัว LINE Official Account อย่างเป็นทางการ",
      date: "5/28/2026 2:18:45 PM",
      image: `${ASSET_BASE_URL}/manus-storage/ROS-Thailand-2026-1900x600_509eb9c7_7491dd69.webp`,
    },
    {
      id: 6,
      title: "Ragnarok Online: ประกาศรายชื่อ Music Contest",
      date: "5/22/2026 2:03:43 PM",
      image: `${ASSET_BASE_URL}/manus-storage/ChatGPT-Image-Play-With-Discord_f803e1b3_988b3aeb.webp`,
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-black mb-2">📋 Notice</h1>
          <p className="text-blue-100">Stay updated with the latest announcements and updates</p>
        </div>
      </div>

      {/* Content */}
      <main className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticeData.map((notice) => (
            <Link key={notice.id} href={`/notice/${notice.id}`}>
              <div className="bg-white border border-blue-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-3">
                    {notice.title}
                  </h3>
                  <span className="text-xs text-slate-500 mt-3">{notice.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export default function NoticePage() {
  return (
    <Layout>
      <NoticePageContent />
    </Layout>
  );
}
