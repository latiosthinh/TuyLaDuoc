import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng — Trưa Nay Ăn Gì",
  description: "Các điều khoản và quy định khi sử dụng dịch vụ.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl text-left">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
        Điều Khoản Sử Dụng
      </h1>
      <p className="mt-2 text-xs text-stone-400">Cập nhật lần cuối: 13/09/2026</p>

      <div className="mt-6 flex flex-col gap-4 text-xs leading-relaxed text-stone-600 sm:text-sm dark:text-stone-300">
        <section>
          <h2 className="text-sm font-bold text-stone-900 sm:text-base dark:text-stone-100">
            1. Mục đích phi thương mại
          </h2>
          <p className="mt-1">
            Trưa Nay Ăn Gì là một công cụ hỗ trợ gợi ý bữa trưa được phát triển cho
            cộng đồng nhằm giải quyết bài toán &quot;Hôm nay ăn gì?&quot;. Ứng dụng không tham
            gia bán hàng, đặt món hay hưởng hoa hồng từ bất kỳ nhà hàng nào.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-stone-900 sm:text-base dark:text-stone-100">
            2. Giá cả & thông tin món ăn
          </h2>
          <p className="mt-1">
            Mức giá hiển thị là mức giá tham khảo phổ biến tại thị trường Việt Nam
            và có thể dao động tùy theo từng quán ăn, vùng miền hoặc thời điểm.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-stone-900 sm:text-base dark:text-stone-100">
            3. Bản quyền & Nguồn gốc
          </h2>
          <p className="mt-1">
            Dự án kế thừa và phát triển từ sản phẩm mã nguồn mở <code>truanayangi-com/truanayangi</code>.
            Mọi quyền tác giả và nguồn cảm hứng ban đầu luôn được trân trọng ghi nhận.
          </p>
        </section>
      </div>
    </div>
  );
}
