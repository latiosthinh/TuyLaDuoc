import Link from "next/link";
import { verifyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import {
  LayoutDashboard,
  Utensils,
  FolderTree,
  Sparkles,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await verifyAdminSession();

  // If viewing admin child routes (other than login), ensure authenticated
  // In Next.js App router, layout applies to /admin and subpaths
  // Note: /admin/login is inside this group, so check path or let page handle
  return (
    <div className="flex min-h-screen bg-stone-100 dark:bg-stone-950">
      {/* Sidebar (only shown if authenticated) */}
      {isAuth ? (
        <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          <div className="flex h-14 items-center gap-2 border-b border-stone-200 px-6 dark:border-stone-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white font-bold text-xs">
              AD
            </div>
            <span className="text-sm font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
              Trưa Nay Ăn Gì
            </span>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-4 text-xs font-medium text-stone-600 dark:text-stone-300">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-stone-100 hover:text-orange-600 dark:hover:bg-stone-800"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Tổng quan</span>
            </Link>

            <Link
              href="/admin/dishes"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-stone-100 hover:text-orange-600 dark:hover:bg-stone-800"
            >
              <Utensils className="h-4 w-4" />
              <span>Quản lý món ăn</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-stone-100 hover:text-orange-600 dark:hover:bg-stone-800"
            >
              <FolderTree className="h-4 w-4" />
              <span>Danh mục</span>
            </Link>

            <Link
              href="/admin/fortunes"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-stone-100 hover:text-orange-600 dark:hover:bg-stone-800"
            >
              <Sparkles className="h-4 w-4" />
              <span>Quẻ trưa</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-stone-100 hover:text-orange-600 dark:hover:bg-stone-800"
            >
              <Settings className="h-4 w-4" />
              <span>Cài đặt hệ thống</span>
            </Link>

            <div className="my-2 border-t border-stone-100 dark:border-stone-800" />

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Xem trang người dùng</span>
            </Link>
          </nav>

          <div className="border-t border-stone-200 p-4 dark:border-stone-800">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </form>
          </div>
        </aside>
      ) : null}

      {/* Main Content Area */}
      <div className={`flex-1 ${isAuth ? "pl-60" : ""}`}>
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
