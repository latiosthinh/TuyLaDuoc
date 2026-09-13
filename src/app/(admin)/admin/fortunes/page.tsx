import { db } from "@/db";
import { fortunes } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOrUpdateFortune, deleteFortune } from "@/app/actions/admin-settings";
import { Plus, Trash2, Sparkles } from "lucide-react";

export default async function AdminFortunesPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) redirect("/admin/login");

  const allFortunes = await db.select().from(fortunes);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Quản Lý Quẻ Trưa ({allFortunes.length})
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Chỉnh sửa danh sách lời chúc, quẻ bói vui và món ăn gợi ý may mắn
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Fortune items list */}
        <div className="lg:col-span-2 flex flex-col divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
          {allFortunes.map((f) => (
            <div key={f.id} className="flex items-start justify-between p-4">
              <div className="flex flex-col gap-1 pr-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {f.text}
                  </span>
                </div>
                {f.advice && (
                  <p className="text-[11px] text-stone-500">{f.advice}</p>
                )}
                {f.luckyDish && (
                  <span className="text-[10px] font-semibold text-orange-600">
                    Món may mắn: {f.luckyDish}
                  </span>
                )}
              </div>
              <form action={deleteFortune.bind(null, f.id)}>
                <button
                  type="submit"
                  className="rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          ))}
        </div>

        {/* Add Fortune Form */}
        <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
            Thêm Quẻ Trưa Mới
          </span>
          <form action={createOrUpdateFortune} className="flex flex-col gap-3">
            <input
              type="text"
              name="text"
              required
              placeholder="Lời quẻ (ví dụ: Hôm nay đại cát đại lợi...)"
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            />
            <textarea
              name="advice"
              rows={3}
              placeholder="Lời khuyên chi tiết..."
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            />
            <input
              type="text"
              name="luckyDish"
              placeholder="Món ăn may mắn (ví dụ: Phở bò tái nạm)"
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            />
            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm quẻ</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
