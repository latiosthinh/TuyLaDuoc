import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200/80 bg-white py-10 text-xs text-stone-600 dark:border-stone-800/80 dark:bg-stone-900/60 dark:text-stone-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 lg:px-8 sm:text-left">
        <div className="flex flex-col gap-1">
          <p className="flex items-center justify-center gap-1 sm:justify-start font-medium text-stone-700 dark:text-stone-300">
            <span>Dành cho những lúc phân vân chưa biết chọn gì với</span>
            <Heart className="h-3.5 w-3.5 fill-orange-500 text-orange-500" aria-label="tình cảm" />
          </p>
          <p className="text-[11px] text-stone-600 dark:text-stone-400">
            Tùy Là Được • Vòng quay quyết định đa năng v2.0
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <Link
            href="/privacy"
            className="text-stone-600 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-orange-500 rounded-xs dark:text-stone-400 dark:hover:text-stone-200"
          >
            Quyền riêng tư
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/terms"
            className="text-stone-600 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-orange-500 rounded-xs dark:text-stone-400 dark:hover:text-stone-200"
          >
            Điều khoản
          </Link>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/truanayangi-com/truanayangi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-stone-600 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-orange-500 rounded-xs dark:text-stone-400 dark:hover:text-stone-200"
            aria-label="Xem dự án nguồn gốc trên GitHub (mở tab mới)"
          >
            <span>Mã nguồn mở</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
