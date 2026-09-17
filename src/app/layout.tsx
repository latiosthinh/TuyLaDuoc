import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "Tùy Là Được — Vòng quay quyết định mọi thứ",
  description:
    "Không biết chọn gì? Vòng quay quyết định ngẫu nhiên trong vài giây: Ăn uống, Giải trí, Hoạt động hay bất cứ việc gì bạn phân vân.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
