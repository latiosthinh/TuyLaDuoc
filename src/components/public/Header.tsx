import Link from "next/link";
import { Compass, ScrollText, BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-orange-500"
          aria-label="Trang chủ Tùy Là Được"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Compass className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Tùy Là Được
              </span>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700 dark:bg-orange-950/80 dark:text-orange-400">
                v2.0
              </span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Vòng quay quyết định mọi thứ
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Điều hướng chính">
          <Link
            href="/dishes"
            className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition-colors hover:border-orange-200 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-orange-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-orange-900 dark:hover:text-orange-400"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Kho lựa chọn</span>
          </Link>
          <Link
            href="/que-trua"
            className="flex items-center gap-1.5 rounded-xl border border-stone-200/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-amber-300 hover:text-amber-600 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-amber-900 dark:hover:text-amber-400"
          >
            <ScrollText className="h-3.5 w-3.5 text-amber-500" />
            <span>Quẻ may mắn</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
