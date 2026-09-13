import React from "react";
import { loginAction } from "@/app/actions/auth";
import { Lock, Mail, ShieldAlert } from "lucide-react";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4 dark:bg-stone-950">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-xl dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-md">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Quản Trị Hệ Thống
          </h1>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Đăng nhập để quản lý danh mục món ăn và nội dung
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Email hoặc mật khẩu không chính xác.</span>
          </div>
        )}

        <form action={loginAction} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Email Quản Trị
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                name="email"
                required
                defaultValue="admin@truanayangi.com"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pr-4 pl-9 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Mật Khẩu
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                name="password"
                required
                defaultValue="admin123456"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pr-4 pl-9 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-orange-600 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-700 active:scale-98"
          >
            ĐĂNG NHẬP CMS
          </button>
        </form>

        <div className="mt-6 border-t border-stone-100 pt-4 text-center text-[11px] text-stone-400 dark:border-stone-800">
          Mặc định: <code>admin@truanayangi.com</code> / <code>admin123456</code>
        </div>
      </div>
    </div>
  );
}
