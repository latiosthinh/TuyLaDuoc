import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateSiteSettings } from "@/app/actions/admin-settings";
import { Save } from "lucide-react";

export default async function AdminSettingsPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) redirect("/admin/login");

  const settingsRows = await db.select().from(siteSettings);
  const settingsMap = new Map(settingsRows.map((r) => [r.key, r.value]));

  const defaultPickerMode = settingsMap.get("default_picker_mode") || "roulette";
  const homepageTagline =
    settingsMap.get("homepage_tagline") ||
    "Hôm nay chưa biết trưa nay ăn gì? Quay chọn món theo ngân sách và sở thích!";
  const siteName = settingsMap.get("site_name") || "Trưa Nay Ăn Gì";

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Cài Đặt Hệ Thống & Nội Dung
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Cấu hình kiểu quay mặc định và các nội dung tiêu đề trang chủ
        </p>
      </div>

      <form
        action={updateSiteSettings}
        className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
            Kiểu Quay Mặc Định Cho Khách Truy Cập Mới
          </label>
          <select
            name="defaultPickerMode"
            defaultValue={defaultPickerMode}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
          >
            <option value="roulette">Vòng quay (Roulette Wheel)</option>
            <option value="cards">Lật bài bí mật (Card Shuffle & Flip)</option>
            <option value="slot">Quả chuông (Slot Machine Reel)</option>
            <option value="random">Ngẫu hứng (Random kiểu quay mỗi lần)</option>
          </select>
          <span className="text-[11px] text-stone-400">
            Người dùng vẫn có thể tự do chuyển đổi kiểu quay trên giao diện.
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
            Tên Trang Web (Site Name)
          </label>
          <input
            type="text"
            name="siteName"
            required
            defaultValue={siteName}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
            Khẩu Hiệu / Tagline Trang Chủ
          </label>
          <textarea
            name="homepageTagline"
            rows={3}
            defaultValue={homepageTagline}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 active:scale-98"
          >
            <Save className="h-4 w-4" />
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
