import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200/80 bg-white py-10 text-xs text-stone-500 dark:border-stone-800/80 dark:bg-stone-900/60 dark:text-stone-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 lg:px-8 sm:text-left">
        <div className="flex flex-col gap-1">
          <p className="flex items-center justify-center gap-1 sm:justify-start">
            <span>Dành cho những buổi trưa không biết ăn gì với</span>
            <Heart className="h-3 w-3 fill-orange-500 text-orange-500" />
          </p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Nguồn dữ liệu & Cảm hứng:{" "}
            <a
              href="https://truanayangi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-600 underline underline-offset-2 hover:text-orange-600 dark:text-stone-300 dark:hover:text-orange-400"
            >
              truanayangi.com
            </a>{" "}
            (Bản mã nguồn mở)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <Link
            href="/privacy"
            className="hover:text-stone-800 dark:hover:text-stone-200"
          >
            Quyền riêng tư
          </Link>
          <span>·</span>
          <Link
            href="/terms"
            className="hover:text-stone-800 dark:hover:text-stone-200"
          >
            Điều khoản
          </Link>
          <span>·</span>
          <a
            href="https://github.com/truanayangi-com/truanayangi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-stone-800 dark:hover:text-stone-200"
          >
            <span>GitHub gốc</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
