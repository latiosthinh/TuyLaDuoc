import { Sparkles, Dices, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3 py-1 text-xs font-medium text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300">
        <Sparkles className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
        <span>Hơn 60+ món ngon Việt Nam đã sẵn sàng</span>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-stone-100">
        Trưa Nay Ăn Gì?
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-300">
        Chọn lọc theo sở thích, ngân sách và tận hưởng bữa trưa bất ngờ với các
        vòng quay sinh động.
      </p>

      {/* Placeholder card for spin stage, to be completed in Phase 2 */}
      <div className="mt-10 w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-8 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
            <Dices className="h-8 w-8 animate-pulse" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-stone-800 dark:text-stone-200">
            Trạm Tiếp Tế Trưa Nay
          </h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Hệ thống chọn món ngẫu nhiên thông minh đang được khởi tạo.
          </p>

          <Link
            href="/dishes"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-orange-700 hover:shadow-md"
          >
            <span>Xem Kho Tiếp Tế</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
