import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính Sách Quyền Riêng Tư — Trưa Nay Ăn Gì",
  description: "Cam kết bảo vệ dữ liệu và sự riêng tư của khách truy cập.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl text-left">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
        Chính Sách Quyền Riêng Tư
      </h1>
      <p className="mt-2 text-xs text-stone-400">Cập nhật lần cuối: 13/09/2026</p>

      <div className="mt-6 flex flex-col gap-4 text-xs leading-relaxed text-stone-600 sm:text-sm dark:text-stone-300">
        <section>
          <h2 className="text-sm font-bold text-stone-900 sm:text-base dark:text-stone-100">
            1. Không thu thập thông tin cá nhân
          </h2>
          <p className="mt-1">
            Trưa Nay Ăn Gì được xây dựng dựa trên nguyên tắc tôn trọng quyền riêng
            tư tuyệt đối của người dùng. Khách truy cập không cần tạo tài khoản hay
            cung cấp bất kỳ thông tin định danh nào (email, số điện thoại, tên).
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-stone-900 sm:text-base dark:text-stone-100">
            2. Lưu trữ cục bộ trên thiết bị (localStorage)
          </h2>
          <p className="mt-1">
            Sở thích vòng quay và danh sách món ăn riêng (&quot;Hòm của tôi&quot;) được lưu trữ
            trực tiếp trên trình duyệt của bạn thông qua <code>localStorage</code>. Dữ
            liệu này không bao giờ được gửi về máy chủ và bạn có thể xóa bất cứ lúc
            nào bằng cách xóa dữ liệu duyệt web.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-stone-900 sm:text-base dark:text-stone-100">
            3. Lượt quay toàn trạm
          </h2>
          <p className="mt-1">
            Hệ thống chỉ ghi nhận ẩn danh một số đếm lượt quay tích lũy nhằm hiển thị
            mức độ sôi nổi của cộng đồng, hoàn toàn không kèm theo địa chỉ IP hay dấu
            vết thiết bị.
          </p>
        </section>
      </div>
    </div>
  );
}
